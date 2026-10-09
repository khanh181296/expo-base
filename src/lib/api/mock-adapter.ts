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

// Tokens carry the user so the mock survives app reloads without server state.
const encodeUser = (email: string, name?: string) =>
  encodeURIComponent(JSON.stringify({ email, name }))

const issueTokens = (email: string, name?: string) => ({
  accessToken: `mock-access.${Date.now() + ACCESS_TTL_MS}.${encodeUser(email, name)}`,
  refreshToken: `mock-refresh.${encodeUser(email, name)}`,
})

const decodeUser = (encoded: string): { email: string; name?: string } | null => {
  try {
    return JSON.parse(decodeURIComponent(encoded))
  } catch {
    return null
  }
}

const mockUser = (email: string, name?: string) => ({
  id: 'user_1',
  email,
  name: name ?? email.split('@')[0] ?? 'User',
})

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

/** User of a valid access token, or null when missing or expired */
function readAccessToken(config: InternalAxiosRequestConfig) {
  const header = String(config.headers.Authorization ?? '')
  // Format: mock-access.<expiresAt>.<user>; the encoded user may itself contain dots.
  const [, expiresAt, ...user] = header.replace('Bearer ', '').split('.')
  if (!user.length || !(Number(expiresAt) > Date.now())) return null
  return decodeUser(user.join('.'))
}

type MockNote = { id: string; title: string; content: string; updatedAt: string }

const notes: MockNote[] = Array.from({ length: 42 }, (_, index) => ({
  id: `note_${42 - index}`,
  title: `Ghi chú #${42 - index}`,
  content: 'Ghi chú mẫu từ mock API. Kéo xuống để tải lại, cuộn để xem thêm, chạm để sửa.',
  updatedAt: new Date(Date.now() - index * 3_600_000).toISOString(),
}))

function handleNotes(config: InternalAxiosRequestConfig, method: string, url: string) {
  if (!readAccessToken(config)) return respond(config, 401, { message: 'Token expired' })

  if (method === 'GET' && url === '/notes') {
    const page = Number(config.params?.page ?? 1)
    const limit = Number(config.params?.limit ?? 15)
    const start = (page - 1) * limit
    return respond(config, 200, {
      items: notes.slice(start, start + limit),
      page,
      nextPage: start + limit < notes.length ? page + 1 : null,
      total: notes.length,
    })
  }

  if (method === 'POST' && url === '/notes') {
    const { title, content } = parseBody(config)
    const note = {
      id: `note_${Date.now()}`,
      title: String(title ?? ''),
      content: String(content ?? ''),
      updatedAt: new Date().toISOString(),
    }
    notes.unshift(note)
    return respond(config, 201, note)
  }

  const index = notes.findIndex((note) => `/notes/${note.id}` === url)
  if (index === -1) return respond(config, 404, { message: 'Note not found' })

  if (method === 'GET') return respond(config, 200, notes[index])
  if (method === 'PUT') {
    const { title, content } = parseBody(config)
    const updated = {
      ...notes[index]!,
      title: String(title ?? ''),
      content: String(content ?? ''),
      updatedAt: new Date().toISOString(),
    }
    notes.splice(index, 1)
    notes.unshift(updated)
    return respond(config, 200, updated)
  }
  if (method === 'DELETE') {
    notes.splice(index, 1)
    return respond(config, 204, null)
  }
  return respond(config, 405, { message: 'Method not allowed' })
}

export const mockAdapter: AxiosAdapter = async (config) => {
  await wait(LATENCY_MS)
  const method = (config.method ?? 'get').toUpperCase()
  const route = `${method} ${config.url}`

  if (config.url?.startsWith('/notes')) return handleNotes(config, method, config.url)
  if (method === 'DELETE' && config.url?.startsWith('/devices/')) return respond(config, 204, null)

  switch (route) {
    case 'POST /auth/login': {
      const { email, password } = parseBody(config)
      if (typeof email !== 'string' || typeof password !== 'string' || password.length < 8) {
        return respond(config, 401, { message: 'Invalid email or password' })
      }
      return respond(config, 200, { user: mockUser(email), tokens: issueTokens(email) })
    }
    case 'POST /auth/register': {
      const { name, email, password } = parseBody(config)
      if (typeof email !== 'string' || typeof password !== 'string' || password.length < 8) {
        return respond(config, 422, { message: 'Invalid registration data' })
      }
      if (email === 'taken@example.com') {
        return respond(config, 409, { message: 'Email is already registered', code: 'EMAIL_TAKEN' })
      }
      return respond(config, 201, {
        user: mockUser(email, typeof name === 'string' ? name : undefined),
        tokens: issueTokens(email, typeof name === 'string' ? name : undefined),
      })
    }
    case 'GET /app/config':
      return respond(config, 200, {
        minVersion: '1.0.0',
        maintenance: false,
        storeUrl: {
          ios: 'https://apps.apple.com/app/id0000000000',
          android: 'https://play.google.com/store/apps/details?id=com.example.expobase',
        },
      })
    case 'POST /devices':
      return respond(config, 204, null)
    case 'POST /auth/forgot-password':
      return respond(config, 204, null)
    case 'POST /auth/refresh': {
      const { refreshToken } = parseBody(config)
      if (typeof refreshToken !== 'string' || !refreshToken.startsWith('mock-refresh.')) {
        return respond(config, 401, { message: 'Invalid refresh token' })
      }
      const user = decodeUser(refreshToken.slice('mock-refresh.'.length))
      if (!user) return respond(config, 401, { message: 'Invalid refresh token' })
      return respond(config, 200, issueTokens(user.email, user.name))
    }
    case 'POST /auth/logout':
      return respond(config, 204, null)
    case 'GET /auth/me': {
      const user = readAccessToken(config)
      if (!user) return respond(config, 401, { message: 'Token expired' })
      return respond(config, 200, mockUser(user.email, user.name))
    }
    default:
      return respond(config, 404, { message: `Mock route not found: ${route}` })
  }
}
