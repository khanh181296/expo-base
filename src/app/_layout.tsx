import '@/global.css'
import '@/lib/theme/interop'
import '@/lib/i18n'

import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { useEffect } from 'react'

import { ErrorFallback } from '@/components/error-fallback'
import { registerAuthSession, useAuthStore } from '@/features/auth'
import { setupQueryManagers } from '@/lib/api'
import { loadColorSchemePreference } from '@/lib/theme'
import { AppProviders } from '@/providers/app-providers'

export const ErrorBoundary = ErrorFallback

void SplashScreen.preventAutoHideAsync()
loadColorSchemePreference()
setupQueryManagers()
void registerAuthSession()

export default function RootLayout() {
  return (
    <AppProviders>
      <RootNavigator />
    </AppProviders>
  )
}

function RootNavigator() {
  const status = useAuthStore((state) => state.status)

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
      </Stack.Protected>
    </Stack>
  )
}
