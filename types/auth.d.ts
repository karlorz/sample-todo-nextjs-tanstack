import type { Session, User } from '@auth/core/types'

declare module '@hono/auth-js' {
  interface AuthSession {
    session: Session
    user: User
  }

  interface AuthConfig {
    secret: string
    trustHost?: boolean
    providers: unknown[]
    baseUrl?: string
    basePath?: string
    pages?: {
      signIn?: string
      signOut?: string
      error?: string
    }
    debug?: boolean
    callbacks?: {
      session?: (params: { session: Session; user: User }) => Promise<Session> | Session
    }
  }

  interface AuthHandler {
    getSession(): Promise<Session | null>
  }

  interface ContextVariableMap {
    auth: AuthHandler
    authConfig: AuthConfig
    authUser: User
  }
}
