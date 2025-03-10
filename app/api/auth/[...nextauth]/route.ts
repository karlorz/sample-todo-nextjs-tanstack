import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import GitHub from '@auth/core/providers/github'
import Credentials from '@auth/core/providers/credentials'
import type { Context } from 'hono'
import type { Session } from '@auth/core/types'
import type { AuthConfig } from '@auth/core/types'

// Set runtime explicitly to nodejs since we're using Prisma
export const runtime = 'nodejs'

// Define types for the token and callbacks to address type issues
interface Token {
  sub?: string;
  [key: string]: unknown;
}

interface User {
  id?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}

interface SessionCallback {
  session: Session;
  token?: Token;
  user?: User;
  account?: {
    provider: string;
    providerAccountId: string;
    type: string;
  };
}

// Define the AuthUser interface
interface AuthUser {
  id: string;
  email: string;
  name?: string;
}

interface Env {
  AUTH_SECRET: string;
  GITHUB_ID: string;
  GITHUB_SECRET: string;
}

interface Variables {
  authUser: AuthUser;
}

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

app.use(
  '*',
  initAuthConfig(() => {
    // Get the base URL for API calls
    const baseUrl = process.env.NEXTAUTH_URL || 
      (typeof window !== 'undefined' 
        ? window.location.origin 
        : 'http://localhost:3000');

    const config: AuthConfig = {
      secret: process.env.AUTH_SECRET || '',
      providers: [
        GitHub({
          clientId: process.env.GITHUB_ID || '',
          clientSecret: process.env.GITHUB_SECRET || '',
        }),
        Credentials({
          name: 'credentials',
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" }
          },
          async authorize(credentials) {
            if (!credentials?.email || !credentials?.password) {
              return null;
            }
            
            try {
              const res = await fetch(`${baseUrl}/api/auth/verify`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: credentials.email,
                  password: credentials.password,
                }),
              });
              
              if (!res.ok) {
                return null;
              }
              
              const data = await res.json() as Record<string, unknown>;
              const user: User = {
                id: data.id as string | undefined,
                email: data.email as string | undefined,
                name: data.name as string | undefined
              };
              return user;
            } catch (error) {
              console.error('Credential authorization error:', error);
              return null;
            }
          }
        })
      ],
      callbacks: {
        async session({ session, token, user, account }: SessionCallback) {
          if (session.user) {
            await Promise.resolve();
            
            if (token?.sub) {
              session.user.id = token.sub;
            } else if (user?.id) {
              session.user.id = user.id;
            }

            if (account) {
              session.user.provider = account.provider;
              session.user.providerAccountId = account.providerAccountId;
            }
          }
          return session;
        }
      }
    };
    return config;
  })
)

app.use('/api/auth/*', authHandler())

app.use('/api/*', verifyAuth())

app.get('/api/protected', (c: Context<Env, Variables>) => {
  const auth = c.get('authUser');
  return c.json(auth);
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
export const HEAD = handle(app)
export const OPTIONS = handle(app)
