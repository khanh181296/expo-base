/**
 * In-memory backend for local development (USE_MOCK_API=true).
 * Mirrors the auth contract in features/auth/api.ts so the app runs without a server.
 * Access tokens expire after 60s to exercise the refresh flow.
 */
import {
  type AxiosAdapter,
  AxiosError,
  AxiosHeaders,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

const ACCESS_TTL_MS = 60_000
const LATENCY_MS = 400

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const issueTokens = () => ({
  accessToken: `mock-access.${Date.now() + ACCESS_TTL_MS}`,
  refreshToken: `mock-refresh.${Math.random().toString(36).slice(2)}`,
})

const mockUser = (email: string) => ({
  id: 'user_1',
  email,
  name: email.split('@')[0] ?? 'User',
})

let currentEmail = 'demo@example.com'

function respond<T>(config: InternalAxiosRequestConfig, status: number, data: T): AxiosResponse<T> {
  const response: AxiosResponse<T> = {
    data,
    status,
    statusText: String(status),
    headers: new AxiosHeaders(),
    config,
  }
  if (status >= 400) {
    throw new AxiosError(
      `Request failed with status code ${status}`,
      undefined,
      config,
      null,
      response,
    )
  }
  return response
}

const parseBody = (config: InternalAxiosRequestConfig) =>
  (typeof config.data === 'string' ? JSON.parse(config.data) : (config.data ?? {})) as Record<
    string,
    unknown
  >

function isAccessTokenValid(config: InternalAxiosRequestConfig) {
  const header = String(config.headers.Authorization ?? '')
  const expiresAt = Number(header.replace('Bearer mock-access.', ''))
  return Number.isFinite(expiresAt) && expiresAt > Date.now()
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await wait(LATENCY_MS)
  const method = (config.method ?? 'get').toUpperCase()
  const route = `${method} ${config.url}`

  switch (route) {
    case 'POST /auth/login': {
      const { email, password } = parseBody(config)
      if (typeof email !== 'string' || typeof password !== 'string' || password.length < 8) {
        return respond(config, 401, { message: 'Invalid email or password' })
      }
      currentEmail = email
      return respond(config, 200, { user: mockUser(email), tokens: issueTokens() })
    }
    case 'POST /auth/refresh': {
      const { refreshToken } = parseBody(config)
      if (typeof refreshToken !== 'string' || !refreshToken.startsWith('mock-refresh.')) {
        return respond(config, 401, { message: 'Invalid refresh token' })
      }
      return respond(config, 200, issueTokens())
    }
    case 'POST /auth/logout':
      return respond(config, 204, null)
    case 'GET /auth/me':
      if (!isAccessTokenValid(config)) return respond(config, 401, { message: 'Token expired' })
      return respond(config, 200, mockUser(currentEmail))
    default:
      return respond(config, 404, { message: `Mock route not found: ${route}` })
  }
}
