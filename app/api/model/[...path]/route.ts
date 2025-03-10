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
    
    if (data.user?.id && data.user?.email) {
      // Try to find existing user and their accounts
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { id: data.user.id },
            { email: data.user.email },
            ...(data.user.provider && data.user.providerAccountId ? [{
              accounts: {
                some: {
                  provider: data.user.provider,
                  providerAccountId: data.user.providerAccountId
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

      const isOAuthLogin = data.user.provider && data.user.providerAccountId;

      if (user) {
        // Update existing user if needed
        const updates: UserUpdates = {};
        if (user.id !== data.user.id) updates.id = data.user.id;
        if (user.name !== data.user.name && data.user.name) updates.name = data.user.name;
        if (user.image !== data.user.image && data.user.image) updates.image = data.user.image;
        
        if (Object.keys(updates).length > 0) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: updates as Prisma.UserUpdateInput,
            include: { memberships: true }
          })
        }

        // If this is OAuth login and we don't have an account record yet, create it
        if (isOAuthLogin && !user.accounts.some(a => 
          a.provider === data.user.provider && 
          a.providerAccountId === data.user.providerAccountId
        )) {
          await prisma.account.create({
            data: {
              provider: data.user.provider!,
              providerAccountId: data.user.providerAccountId!,
              type: 'oauth',
              userId: user.id
            }
          })
        }
      } else {
        // Create new user
        user = await prisma.user.create({
          data: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name || null,
            image: data.user.image || null,
            ...(isOAuthLogin ? {
              accounts: {
                create: {
                  provider: data.user.provider!,
                  providerAccountId: data.user.providerAccountId!,
                  type: 'oauth'
                }
              }
            } : {})
          },
          include: { memberships: true }
        })
      }

      if (user) {
        return enhance(prisma, { user })
      }
    }
  } catch (error) {
    console.error('Failed to get user session:', error)
  }

  // anonymous user
  return enhance(prisma)
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
