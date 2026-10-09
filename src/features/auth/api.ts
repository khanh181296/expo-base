import { api } from '@/lib/api'

import type { AuthTokens, SignInPayload, SignInResponse, SignUpPayload, User } from './types'

export const authApi = {
  signIn: (payload: SignInPayload) =>
    api.post<SignInResponse>('/auth/login', payload, { skipAuth: true }).then((res) => res.data),

  signUp: (payload: SignUpPayload) =>
    api.post<SignInResponse>('/auth/register', payload, { skipAuth: true }).then((res) => res.data),

  forgotPassword: (email: string) =>
    api.post<void>('/auth/forgot-password', { email }, { skipAuth: true }).then(() => undefined),

  refresh: (refreshToken: string) =>
    api
      .post<AuthTokens>('/auth/refresh', { refreshToken }, { skipAuth: true })
      .then((res) => res.data),

  signOut: (refreshToken: string) =>
    api.post<void>('/auth/logout', { refreshToken }, { skipAuth: true }).then(() => undefined),

  me: () => api.get<User>('/auth/me').then((res) => res.data),
}
