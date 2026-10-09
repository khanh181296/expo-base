import { Env } from '@/lib/env'

/** Real provider wiring needs Firebase (to mint the ID token) plus the provider's own setup. */
export const socialConfigured = {
  google: Env.FIREBASE_ENABLED && Boolean(Env.GOOGLE_WEB_CLIENT_ID),
  apple: Env.FIREBASE_ENABLED && Env.APPLE_SIGN_IN,
}

/** With the mock API on, buttons work without any provider setup (UI and flow preview). */
export const mockSocial = (provider: keyof typeof socialConfigured) =>
  Env.USE_MOCK_API && !socialConfigured[provider]

export const mockIdToken = (provider: string) => `mock-${provider}-id-token`
