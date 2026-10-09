import type { AnalyticsProvider } from '@/lib/analytics'

/** Native Firebase is not available on web previews. */
export function createFirebaseAnalyticsProvider(): AnalyticsProvider {
  return { track: () => {}, screen: () => {}, identify: () => {} }
}
