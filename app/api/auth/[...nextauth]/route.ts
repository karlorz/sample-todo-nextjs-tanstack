import { Hono } from 'hono'
import { handle } from 'hono/vercel'
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js'
import GitHub from '@auth/core/providers/github'
import Credentials from '@auth/core/providers/credentials'

// Set runtime explicitly to nodejs since we're using Prisma
export const runtime = 'nodejs'

interface Env {
  AUTH_SECRET: string;
  GITHUB_ID: string;
  GITHUB_SECRET: string;
}

const app = new Hono<{ Bindings: Env }>()

type InitAuthConfig = Parameters<typeof initAuthConfig>[0];

app.use(
  '*',
  initAuthConfig(() => {
    // Get the base URL for API calls
    const baseUrl = process.env.NEXTAUTH_URL || 
      (typeof window !== 'undefined' 
        ? window.location.origin 
        : 'http://localhost:3000');

    const config: ReturnType<InitAuthConfig> = {
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
              
              const user = await res.json();
              return user;
            } catch (error) {
              console.error('Credential authorization error:', error);
              return null;
            }
          }
        })
      ],
      callbacks: {
        async session({ session, token, user }) {
          // Use token.sub for JWT strategy or user.id for database strategy
          if (session.user) {
            if (token?.sub) {
              session.user.id = token.sub;
            } else if (user?.id) {
              session.user.id = user.id;
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

app.get('/api/protected', (c) => {
  const auth = c.get('authUser')
  return c.json(auth)
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
export const HEAD = handle(app)
export const OPTIONS = handle(app)

// Remove the default export to fix the type error
