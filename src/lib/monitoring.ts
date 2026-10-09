import * as Sentry from '@sentry/react-native'
import * as Application from 'expo-application'

import { Env, isDev } from '@/lib/env'

export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
})

/** Sentry is on only when a DSN is set and the app is not a development build. */
export const isMonitoringEnabled = Boolean(Env.SENTRY_DSN) && !isDev

export function initMonitoring() {
  if (!isMonitoringEnabled) return

  Sentry.init({
    dsn: Env.SENTRY_DSN,
    environment: Env.APP_ENV,
    release: `${Application.applicationId}@${Application.nativeApplicationVersion}+${Application.nativeBuildVersion}`,
    tracesSampleRate: Env.APP_ENV === 'production' ? 0.2 : 1,
    sendDefaultPii: false,
    integrations: [navigationIntegration],
  })
}

export function setMonitoringUser(user: { id: string; email: string } | null) {
  if (!isMonitoringEnabled) return
  Sentry.setUser(user ? { id: user.id } : null)
}

export function captureError(error: unknown, context?: Record<string, unknown>) {
  if (!isMonitoringEnabled) {
    console.error(error)
    return
  }
  Sentry.captureException(error, context && { extra: context })
}

/** Wraps the root component for Sentry (touch and navigation spans) only when Sentry is on. */
export const wrapRoot = <P extends Record<string, unknown>>(Root: React.ComponentType<P>) =>
  isMonitoringEnabled ? Sentry.wrap(Root) : Root
