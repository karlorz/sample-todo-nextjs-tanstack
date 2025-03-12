import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import { authHandler, initAuthConfig, verifyAuth } from '@hono/auth-js';
import type { Context } from 'hono';
import type { ConfigHandler } from '@hono/auth-js';

import GitHub from '@auth/core/providers/github';
import Credentials from '@auth/core/providers/credentials';
import type { Session } from '@auth/core/types';

// Set runtime explicitly to nodejs since we're using Prisma
export const runtime = 'nodejs';

// Define base types
interface BaseUser {
  id: string;
  email: string;
  name?: string;
}

interface CustomSession extends Omit<Session, 'user'> {
  user?: BaseUser;
}

interface Variables {
  authUser: BaseUser;
}

const app = new Hono<{ Variables: Variables }>()

// Type assertion function to ensure config matches ConfigHandler requirements
const createAuthConfig: ConfigHandler = () => {
  const baseUrl = process.env.NEXTAUTH_URL || 
    (typeof window !== 'undefined' 
      ? window.location.origin 
      : 'http://localhost:3000');

  return {
    secret: process.env.AUTH_SECRET || 'fallback-secret-key-replace-in-production',
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
            if (!data.id || !data.email || typeof data.id !== 'string' || typeof data.email !== 'string') {
              return null;
            }
            
            const validatedUser: BaseUser = {
              id: data.id,
              email: data.email,
              name: typeof data.name === 'string' ? data.name : undefined
            };
            return validatedUser;
          } catch (error) {
            console.error('Credential authorization error:', error);
            return null;
          }
        }
      })
    ],
    callbacks: {
      async session({ session, user }) {
        // Check if we have the required fields
        if (!user?.id || !user?.email) {
          return session;
        }

        // Add an await to make this truly async
        await Promise.resolve();

        // Construct a new session with type-safe user data
        const validatedSession: CustomSession = {
          ...session,
          user: {
            id: user.id,
            email: user.email,
            name: user.name || undefined
          }
        };
        return validatedSession;
      }
    }
  };
};

app.use('*', initAuthConfig(createAuthConfig))

app.use('/api/auth/*', authHandler())

app.use('/api/*', verifyAuth())

app.get('/api/protected', (c: Context<{ Variables: Variables }>) => {
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
