/**
 * Vendor-neutral analytics. Screens call `analytics.track(...)`; plug a provider
 * (Firebase, PostHog, Mixpanel...) with `setAnalyticsProvider` in one place.
 */
import { isDev } from '@/lib/env'

export type AnalyticsEvent =
  | { name: 'sign_in'; method: 'email' }
  | { name: 'sign_up'; method: 'email' }
  | { name: 'sign_out' }
  | { name: 'note_created' }
  | { name: 'note_deleted' }

type Properties = Record<string, string | number | boolean | undefined>

export type AnalyticsProvider = {
  track: (name: string, properties: Properties) => void
  screen: (name: string) => void
  identify: (userId: string | null) => void
}

const consoleProvider: AnalyticsProvider = {
  track: (name, properties) => console.info('[analytics] track', name, properties),
  screen: (name) => console.info('[analytics] screen', name),
  identify: (userId) => console.info('[analytics] identify', userId),
}

const noopProvider: AnalyticsProvider = { track: () => {}, screen: () => {}, identify: () => {} }

let provider: AnalyticsProvider = isDev ? consoleProvider : noopProvider

export function setAnalyticsProvider(next: AnalyticsProvider) {
  provider = next
}

export const analytics = {
  track: ({ name, ...properties }: AnalyticsEvent) => provider.track(name, properties),
  screen: (name: string) => provider.screen(name),
  identify: (userId: string | null) => provider.identify(userId),
}
