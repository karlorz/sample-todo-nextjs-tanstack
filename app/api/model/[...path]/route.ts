import { enhance } from '@zenstackhq/runtime'
import type { Context } from 'hono'
import type { Session } from '@auth/core/types'
import { Hono } from 'hono'
import { createHonoHandler } from '@zenstackhq/server/hono'
import { handle } from 'hono/vercel'
import { prisma } from 'server/db'
import type { User, Prisma } from '@prisma/client'

export const runtime = 'nodejs'

interface SessionResponse {
  user: Session['user'] & {
    provider?: string;
    providerAccountId?: string;
  } | null
}

interface UserUpdates extends Partial<User> {
  accounts?: {
    create: {
      provider: string;
      providerAccountId: string;
      type: string;
    }
  }
}

interface OAuthData {
  provider: string;
  providerAccountId: string;
}

// create an enhanced Prisma client with user context
async function getPrisma(c: Context) {
  try {
    const authUrl = new URL('/api/auth/session', c.req.url)
    const cookieHeader = c.req.header('cookie')
    
    const response = await fetch(authUrl, {
      headers: {
        cookie: cookieHeader || '',
      }
    })

    if (!response.ok) {
      return enhance(prisma)
    }

    const data = (await response.json()) as SessionResponse
    const user = data.user
    
    if (!user?.id || !user?.email) {
      return enhance(prisma)
    }

    // Extract and validate OAuth data if present
    const oauthData: OAuthData | undefined = 
      user.provider && user.providerAccountId
        ? { provider: user.provider, providerAccountId: user.providerAccountId }
        : undefined

    // Try to find existing user and their accounts
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { id: user.id },
          { email: user.email },
          ...(oauthData ? [{
            accounts: {
              some: {
                provider: oauthData.provider,
                providerAccountId: oauthData.providerAccountId
              }
            }
          }] : [])
        ]
      },
      include: { 
        memberships: true,
        accounts: true
      },
    })

    if (dbUser) {
      // Update existing user if needed
      const updates: UserUpdates = {}
      if (dbUser.id !== user.id) updates.id = user.id
      if (dbUser.name !== user.name) updates.name = user.name || null
      if (dbUser.image !== user.image) updates.image = user.image || null
      
      if (Object.keys(updates).length > 0) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: updates as Prisma.UserUpdateInput,
          include: { memberships: true, accounts: true }
        })
      }

      // If this is OAuth login and we don't have an account record yet, create it
      if (oauthData && !dbUser.accounts.some(a => 
        a.provider === oauthData.provider && 
        a.providerAccountId === oauthData.providerAccountId
      )) {
        await prisma.account.create({
          data: {
            ...oauthData,
            type: 'oauth',
            userId: dbUser.id
          }
        })
      }
    } else {
      // Create new user
      dbUser = await prisma.user.create({
        data: {
          id: user.id,
          email: user.email,
          name: user.name || null,
          image: user.image || null,
          ...(oauthData ? {
            accounts: {
              create: {
                ...oauthData,
                type: 'oauth'
              }
            }
          } : {}),
          memberships: {
            create: [] // Initialize empty memberships array
          }
        },
        include: { 
          memberships: true,
          accounts: true
        }
      })
    }

    return enhance(prisma, { user: dbUser })
  } catch (error) {
    console.error('Failed to get user session:', error)
    return enhance(prisma)
  }
}

const app = new Hono()

app.use(
  '/api/model/*',
  createHonoHandler({
    getPrisma,
  })
)

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const DELETE = handle(app)
export const PATCH = handle(app)
