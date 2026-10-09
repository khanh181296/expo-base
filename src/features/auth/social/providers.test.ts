import type * as Providers from './providers'

jest.mock('@/lib/env', () => ({
  Env: {
    USE_MOCK_API: true,
    FIREBASE_ENABLED: false,
    GOOGLE_WEB_CLIENT_ID: '',
    GOOGLE_IOS_CLIENT_ID: '',
    APPLE_SIGN_IN: false,
  },
}))

describe('social providers without Firebase (mock API)', () => {
  const load = (os: 'ios' | 'android') => {
    jest.resetModules()
    jest.doMock('react-native', () => ({ Platform: { OS: os } }))
    return require('./providers') as typeof Providers
  }

  it('offers Google everywhere and Apple only on iOS', async () => {
    expect(await load('ios').getSocialAvailability()).toEqual({ google: true, apple: true })
    expect(await load('android').getSocialAvailability()).toEqual({ google: true, apple: false })
  })

  it('returns a mock token without touching native modules', async () => {
    await expect(load('ios').getSocialIdToken('google')).resolves.toBe('mock-google-id-token')
  })

  it('sign out is a no-op when Firebase is off', async () => {
    await expect(load('ios').signOutSocial()).resolves.toBeUndefined()
  })
})
