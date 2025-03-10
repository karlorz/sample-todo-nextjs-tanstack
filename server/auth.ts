import type { AuthConfig, AuthHandler, AuthSession } from '@hono/auth-js'

export type {
  AuthConfig,
  AuthHandler,
  AuthSession,
}

export {
  authHandler,
  initAuthConfig,
  verifyAuth,
} from '@hono/auth-js'
