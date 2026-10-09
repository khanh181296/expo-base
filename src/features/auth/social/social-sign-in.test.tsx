import { act, renderHook, waitFor } from '@testing-library/react-native'

import { createQueryWrapper } from '@/test-utils'

import { authApi } from '../api'
import { useSocialSignIn } from '../hooks'
import { useAuthStore } from '../store'
import { getSocialIdToken } from './providers'

jest.mock('./providers', () => ({
  getSocialIdToken: jest.fn(),
  getSocialAvailability: jest.fn(),
  signOutSocial: jest.fn(),
}))
jest.mock('../api', () => ({ authApi: { sso: jest.fn() } }))

const session = {
  user: { id: '1', email: 'g@example.com', name: 'G' },
  tokens: { accessToken: 'a', refreshToken: 'r' },
}

describe('useSocialSignIn', () => {
  beforeEach(() => useAuthStore.setState({ status: 'signedOut', user: null }))

  it('exchanges the provider token at /auth/sso and signs in', async () => {
    jest.mocked(getSocialIdToken).mockResolvedValue('firebase-id-token')
    jest.mocked(authApi.sso).mockResolvedValue(session)
    const { wrapper } = createQueryWrapper()
    const { result } = await renderHook(() => useSocialSignIn(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync('google')
    })

    expect(authApi.sso).toHaveBeenCalledWith({ idToken: 'firebase-id-token', provider: 'google' })
    await waitFor(() => expect(useAuthStore.getState().status).toBe('signedIn'))
  })

  it('does nothing when the user cancels', async () => {
    jest.mocked(getSocialIdToken).mockResolvedValue(null)
    jest.mocked(authApi.sso).mockClear()
    const { wrapper } = createQueryWrapper()
    const { result } = await renderHook(() => useSocialSignIn(), { wrapper })

    await act(async () => {
      await result.current.mutateAsync('apple')
    })

    expect(authApi.sso).not.toHaveBeenCalled()
    expect(useAuthStore.getState().status).toBe('signedOut')
  })
})
