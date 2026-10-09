import { AxiosError, AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'
import type { TFunction } from 'i18next'

import { ApiError, getErrorMessage, toApiError } from './errors'

const config = { headers: new AxiosHeaders() } as InternalAxiosRequestConfig

const httpError = (status: number, data: unknown = {}) =>
  new AxiosError('failed', undefined, config, null, {
    status,
    data,
    statusText: '',
    headers: {},
    config,
  })

const t = ((key: string) => key) as unknown as TFunction

describe('toApiError', () => {
  it.each([
    [401, 'unauthorized'],
    [403, 'forbidden'],
    [404, 'notFound'],
    [422, 'validation'],
    [503, 'server'],
  ])('maps HTTP %i to %s', (status, kind) => {
    expect(toApiError(httpError(status)).kind).toBe(kind)
  })

  it('detects network and timeout failures', () => {
    expect(toApiError(new AxiosError('offline', 'ERR_NETWORK', config)).kind).toBe('network')
    expect(toApiError(new AxiosError('slow', 'ECONNABORTED', config)).kind).toBe('timeout')
  })

  it('keeps server message and code', () => {
    const error = toApiError(httpError(422, { message: 'Email taken', code: 'EMAIL_TAKEN' }))
    expect(error.serverMessage).toBe('Email taken')
    expect(error.code).toBe('EMAIL_TAKEN')
  })

  it('returns ApiError instances unchanged', () => {
    const error = new ApiError({ kind: 'server', message: 'x' })
    expect(toApiError(error)).toBe(error)
  })
})

describe('getErrorMessage', () => {
  it('prefers the server message for client errors', () => {
    expect(getErrorMessage(httpError(422, { message: 'Email taken' }), t)).toBe('Email taken')
  })

  it('hides server internals for 5xx', () => {
    expect(getErrorMessage(httpError(500, { message: 'stack trace' }), t)).toBe('errors.server')
  })
})
