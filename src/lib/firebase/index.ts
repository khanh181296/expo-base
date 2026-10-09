import { Platform } from 'react-native'

import { setAnalyticsProvider } from '@/lib/analytics'
import { Env, isDev } from '@/lib/env'

import type * as FirebaseAnalyticsProvider from './analytics-provider'

/**
 * Firebase is optional: it is configured only when the Google service files are
 * provided at build time (see .env.example). Development keeps the console provider.
 */
export function initFirebase() {
  if (!Env.FIREBASE_ENABLED || Platform.OS === 'web' || isDev) return
  // Loaded lazily so builds without Firebase never touch the native module.
  const { createFirebaseAnalyticsProvider } =
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('./analytics-provider') as typeof FirebaseAnalyticsProvider
  setAnalyticsProvider(createFirebaseAnalyticsProvider())
}
