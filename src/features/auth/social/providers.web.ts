import { mockIdToken, mockSocial } from './config'
import type { SocialAvailability, SocialProvider } from './types'

/** Native social sign-in is not available on web previews; only the mock flow is. */
export async function getSocialAvailability(): Promise<SocialAvailability> {
  return { google: mockSocial('google'), apple: false }
}

export async function getSocialIdToken(provider: SocialProvider): Promise<string | null> {
  return mockSocial(provider) ? mockIdToken(provider) : null
}

export async function signOutSocial() {}
