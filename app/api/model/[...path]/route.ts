import { enhance } from '@zenstackhq/runtime'
import type { Context } from 'hono'
import type { Session } from '@auth/core/types'
import { Hono } from 'hono'
import { createHonoHandler } from '@zenstackhq/server/hono'
import { handle } from 'hono/vercel'
import { prisma } from 'server/db'
export const runtime = 'nodejs'

interface SessionResponse {
  user: Session['user'] & {
    provider?: string;
    providerAccountId?: string;
  } | null
}

// create an enhanced Prisma client with user context
async function getPrisma(c: Context) {
  try {
    let baseUrl = '';
    if (c.req.url.startsWith('https://')) {
      baseUrl = new URL(c.req.url).origin;
    } else {
      baseUrl = 'http://localhost:3000';
    }

    const authUrl = new URL('/api/auth/session', baseUrl);
    const cookieHeader = c.req.header('cookie');

    console.log('Fetching auth session from:', authUrl.toString());
    console.log('With cookie header:', cookieHeader);
    
    const response = await fetch(authUrl.toString(), {
      headers: {
        cookie: cookieHeader || '',
      },
      cache: 'no-store'  // Ensure we always get fresh session data
    });

    if (!response.ok) {
      console.error('Failed to fetch auth session:', response.status, response.statusText);
      return enhance(prisma);
    }

    const data = await response.json() as SessionResponse;
    console.log('Auth session data:', data);

    if (!data.user?.email) {
      console.log('No valid user email in session');
      return enhance(prisma);
    }

    console.log('Looking up user by email:', data.user.email);
    // Try to find user by email first
    const dbUser = await prisma.user.findUnique({
      where: {
        email: data.user.email
      },
      include: { 
        memberships: {
          include: {
            space: true
          }
        },
        ownedSpaces: true
      }
    })


    if (!dbUser) {
      console.log('User not found, creating new user');
      // Create new user if not found
      const newUser = await prisma.user.create({
        data: {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name || null,
          image: data.user.image || null,
        },
        include: {
          memberships: {
            include: {
              space: true
            }
          },
          ownedSpaces: true
        }
      });
      console.log('Created new user:', newUser.id);
      return enhance(prisma, { user: newUser });
    }

    console.log('Found existing user:', dbUser.id);
    // Update user info if needed
    if (dbUser.name !== data.user.name || dbUser.image !== data.user.image) {
      console.log('Updating user info');
      const updatedUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: {
          name: data.user.name || dbUser.name,
          image: data.user.image || dbUser.image,
        },
        include: {
          memberships: {
            include: {
              space: true
            }
          },
          ownedSpaces: true
        }
      });
      console.log('User info updated');
      return enhance(prisma, { user: updatedUser });
    }
    return enhance(prisma, { user: dbUser });
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
