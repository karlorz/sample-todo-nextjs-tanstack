import { enhance } from '@zenstackhq/runtime'
import type { Context } from 'hono'
import type { Session } from '@auth/core/types'
import { Hono } from 'hono'
import { createHonoHandler } from '@zenstackhq/server/hono'
import { handle } from 'hono/vercel'
import { prisma } from 'server/db'

// Change runtime from edge to nodejs to work with Prisma
export const runtime = 'nodejs'

interface SessionResponse {
  user: Session['user'] | null
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
    
    if (data.user?.id) {
      const user = await prisma.user.findUniqueOrThrow({
        where: { id: data.user.id },
        include: { memberships: true },
      })

      return enhance(prisma, { user })
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
