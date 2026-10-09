import axios from 'axios'
import type { TFunction } from 'i18next'

export type ApiErrorKind =
  | 'network'
  | 'timeout'
  | 'unauthorized'
  | 'forbidden'
  | 'notFound'
  | 'validation'
  | 'server'
  | 'unknown'

export class ApiError extends Error {
  readonly kind: ApiErrorKind
  readonly status?: number
  readonly code?: string
  readonly details?: unknown
  /** Message sent by the server, safe to show to the user */
  readonly serverMessage?: string

  constructor(params: {
    kind: ApiErrorKind
    message: string
    status?: number
    code?: string
    details?: unknown
    serverMessage?: string
    cause?: unknown
  }) {
    super(params.message, { cause: params.cause })
    this.name = 'ApiError'
    this.kind = params.kind
    this.status = params.status
    this.code = params.code
    this.details = params.details
    this.serverMessage = params.serverMessage
  }
}

type ErrorBody = { message?: unknown; code?: unknown; errors?: unknown }

function kindFromStatus(status: number): ApiErrorKind {
  if (status === 401) return 'unauthorized'
  if (status === 403) return 'forbidden'
  if (status === 404) return 'notFound'
  if (status === 400 || status === 409 || status === 422) return 'validation'
  if (status >= 500) return 'server'
  return 'unknown'
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) return error

  if (axios.isAxiosError<ErrorBody>(error)) {
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return new ApiError({ kind: 'timeout', message: error.message, cause: error })
    }
    if (!error.response) {
      return new ApiError({ kind: 'network', message: error.message, cause: error })
    }
    const { status, data } = error.response
    return new ApiError({
      kind: kindFromStatus(status),
      status,
      message: error.message,
      code: typeof data?.code === 'string' ? data.code : undefined,
      serverMessage: typeof data?.message === 'string' ? data.message : undefined,
      details: data?.errors,
      cause: error,
    })
  }

  const message = error instanceof Error ? error.message : String(error)
  return new ApiError({ kind: 'unknown', message, cause: error })
}

const MESSAGE_KEYS = {
  network: 'errors.network',
  timeout: 'errors.timeout',
  unauthorized: 'errors.unauthorized',
  server: 'errors.server',
  forbidden: 'errors.unknown',
  notFound: 'errors.unknown',
  validation: 'errors.unknown',
  unknown: 'errors.unknown',
} as const satisfies Record<ApiErrorKind, string>

/** User-facing message: prefer what the server said, else a translated fallback. */
export function getErrorMessage(error: unknown, t: TFunction) {
  const apiError = toApiError(error)
  if (apiError.serverMessage && apiError.kind !== 'server') return apiError.serverMessage
  return t(MESSAGE_KEYS[apiError.kind])
}
