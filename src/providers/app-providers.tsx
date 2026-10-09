import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { FeedbackHosts } from '@/components/feedback'
import { queryClient } from '@/lib/api'
import { useNavigationTheme, useWebColorSchemeSync } from '@/lib/theme'

export function AppProviders({ children }: { children: React.ReactNode }) {
  useWebColorSchemeSync()
  const navigationTheme = useNavigationTheme()

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <KeyboardProvider>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider value={navigationTheme}>
              <BottomSheetModalProvider>
                {children}
                <FeedbackHosts />
                <StatusBar style="auto" />
              </BottomSheetModalProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </KeyboardProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({ root: { flex: 1 } })
