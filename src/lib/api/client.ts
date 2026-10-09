import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'

import { Env } from '@/lib/env'

import { toApiError } from './errors'
import { mockAdapter } from './mock-adapter'

declare module 'axios' {
  interface AxiosRequestConfig {
    /** Do not attach the access token or try to refresh it (login, refresh, public endpoints) */
    skipAuth?: boolean
  }
}

type RetriableConfig = InternalAxiosRequestConfig & { _retried?: boolean }

export type AuthHandlers = {
  getAccessToken: () => string | null
  /** Exchange the refresh token for a new access token. Resolve null when the session is gone. */
  refreshAccessToken: () => Promise<string | null>
  onSessionExpired: () => void
}

let authHandlers: AuthHandlers | null = null

/** Wired by the auth feature so `lib/api` does not depend on features. */
export function setAuthHandlers(handlers: AuthHandlers | null) {
  authHandlers = handlers
}

export const api = axios.create({
  baseURL: Env.API_URL,
  timeout: Env.API_TIMEOUT_MS,
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  ...(Env.USE_MOCK_API && { adapter: mockAdapter }),
})

api.interceptors.request.use((config) => {
  if (!config.skipAuth) {
    const token = authHandlers?.getAccessToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Concurrent 401s share one refresh request instead of racing each other.
let refreshing: Promise<string | null> | null = null

function refreshOnce(handlers: AuthHandlers) {
  refreshing ??= handlers.refreshAccessToken().finally(() => {
    refreshing = null
  })
  return refreshing
}

api.interceptors.response.use(undefined, async (error: AxiosError) => {
  const config = error.config as RetriableConfig | undefined
  const handlers = authHandlers

  const canRefresh =
    error.response?.status === 401 && handlers && config && !config.skipAuth && !config._retried

  if (!canRefresh) throw toApiError(error)

  config._retried = true
  let token: string | null = null
  try {
    token = await refreshOnce(handlers)
  } catch {
    token = null
  }

  if (!token) {
    handlers.onSessionExpired()
    throw toApiError(error)
  }

  config.headers.Authorization = `Bearer ${token}`
  return api(config)
})
