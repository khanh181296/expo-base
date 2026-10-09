import '@/global.css'
import '@/lib/theme/interop'
import '@/lib/i18n'

import { Stack, useNavigationContainerRef, usePathname } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { ErrorFallback } from '@/components/error-fallback'
import { AppGate } from '@/features/app-config'
import { registerAuthSession, useAuthStore } from '@/features/auth'
import { analytics } from '@/lib/analytics'
import { setupQueryManagers } from '@/lib/api'
import {
  initMonitoring,
  navigationIntegration,
  setMonitoringUser,
  wrapRoot,
} from '@/lib/monitoring'
import { useOtaUpdates } from '@/lib/ota'
import { loadColorSchemePreference } from '@/lib/theme'
import { AppProviders } from '@/providers/app-providers'

export const ErrorBoundary = ErrorFallback

initMonitoring()
void SplashScreen.preventAutoHideAsync()
loadColorSchemePreference()
setupQueryManagers()
void registerAuthSession()

function RootLayout() {
  const navigationRef = useNavigationContainerRef()
  const user = useAuthStore((state) => state.user)

  useEffect(() => {
    navigationIntegration.registerNavigationContainer(navigationRef)
  }, [navigationRef])

  const pathname = usePathname()

  useEffect(() => {
    setMonitoringUser(user)
    analytics.identify(user?.id ?? null)
  }, [user])

  useEffect(() => {
    analytics.screen(pathname)
  }, [pathname])

  return (
    <AppProviders>
      <AppGate>
        <RootNavigator />
      </AppGate>
    </AppProviders>
  )
}

function RootNavigator() {
  const status = useAuthStore((state) => state.status)
  useOtaUpdates()

  useEffect(() => {
    if (status !== 'loading') void SplashScreen.hideAsync()
  }, [status])

  const signedIn = status === 'signedIn'

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>
    </Stack>
  )
}

export default wrapRoot(RootLayout)
