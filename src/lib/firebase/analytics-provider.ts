import { getAnalytics, logEvent, logScreenView, setUserId } from '@react-native-firebase/analytics'

import type { AnalyticsProvider } from '@/lib/analytics'

export function createFirebaseAnalyticsProvider(): AnalyticsProvider {
  const instance = getAnalytics()
  return {
    track: (name, properties) => void logEvent(instance, name, properties),
    screen: (name) => void logScreenView(instance, { screen_name: name, screen_class: name }),
    identify: (userId) => void setUserId(instance, userId),
  }
}
