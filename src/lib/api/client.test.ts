import { type AxiosAdapter, AxiosError, type AxiosResponse } from 'axios'

import { api, setAuthHandlers } from './client'
import { ApiError } from './errors'

let accessToken = 'expired'

const respond = (config: Parameters<AxiosAdapter>[0], status: number, data: unknown = {}) => {
  const response = { data, status, statusText: '', headers: {}, config } as AxiosResponse
  if (status >= 400) throw new AxiosError('failed', undefined, config, null, response)
  return response
}

/** 401 unless the request carries the fresh token */
const adapter: AxiosAdapter = async (config) =>
  config.headers.Authorization === 'Bearer fresh'
    ? respond(config, 200, { ok: true })
    : respond(config, 401)

describe('api client auth flow', () => {
  const refreshAccessToken = jest.fn()
  const onSessionExpired = jest.fn()

  beforeEach(() => {
    accessToken = 'expired'
    refreshAccessToken.mockReset()
    onSessionExpired.mockReset()
    api.defaults.adapter = adapter
    setAuthHandlers({ getAccessToken: () => accessToken, refreshAccessToken, onSessionExpired })
  })

  it('attaches the access token', async () => {
    accessToken = 'fresh'
    await expect(api.get('/me')).resolves.toMatchObject({ data: { ok: true } })
    expect(refreshAccessToken).not.toHaveBeenCalled()
  })

  it('refreshes once for concurrent 401s and retries every request', async () => {
    refreshAccessToken.mockImplementation(async () => {
      accessToken = 'fresh'
      return 'fresh'
    })

    const results = await Promise.all([api.get('/a'), api.get('/b'), api.get('/c')])

    expect(refreshAccessToken).toHaveBeenCalledTimes(1)
    expect(results.map((r) => r.status)).toEqual([200, 200, 200])
  })

  it('ends the session when refresh fails', async () => {
    refreshAccessToken.mockRejectedValue(new Error('refresh failed'))

    await expect(api.get('/me')).rejects.toMatchObject({ kind: 'unauthorized' })
    expect(onSessionExpired).toHaveBeenCalledTimes(1)
  })

  it('never refreshes requests marked skipAuth', async () => {
    await expect(api.post('/auth/login', {}, { skipAuth: true })).rejects.toBeInstanceOf(ApiError)
    expect(refreshAccessToken).not.toHaveBeenCalled()
  })
})
