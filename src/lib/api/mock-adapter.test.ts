import { AxiosHeaders, type InternalAxiosRequestConfig } from 'axios'

import { mockAdapter } from './mock-adapter'

jest.useFakeTimers()

const call = async (method: string, url: string, data?: unknown, token?: string) => {
  const config = {
    method,
    url,
    data: data && JSON.stringify(data),
    headers: new AxiosHeaders(token ? { Authorization: `Bearer ${token}` } : {}),
  } as InternalAxiosRequestConfig
  const promise = mockAdapter(config)
  jest.runAllTimers()
  return promise
}

describe('mock API', () => {
  it('accepts tokens for emails that contain dots', async () => {
    const login = await call('post', '/auth/login', {
      email: 'first.last@example.com',
      password: '12345678',
    })
    const me = await call('get', '/auth/me', undefined, login.data.tokens.accessToken)
    expect(me.data.email).toBe('first.last@example.com')
  })

  it('keeps the registered name across refresh', async () => {
    const register = await call('post', '/auth/register', {
      name: 'Khanh Duc',
      email: 'k.d@example.com',
      password: '12345678',
    })
    const refreshed = await call('post', '/auth/refresh', {
      refreshToken: register.data.tokens.refreshToken,
    })
    const me = await call('get', '/auth/me', undefined, refreshed.data.accessToken)
    expect(me.data.name).toBe('Khanh Duc')
  })
})
