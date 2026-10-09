import NetInfo from '@react-native-community/netinfo'
import { focusManager, onlineManager, QueryClient } from '@tanstack/react-query'
import { AppState, Platform } from 'react-native'

import { toApiError } from './errors'

const NON_RETRYABLE = new Set(['unauthorized', 'forbidden', 'notFound', 'validation'])

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      gcTime: 5 * 60_000,
      retry: (failureCount, error) =>
        !NON_RETRYABLE.has(toApiError(error).kind) && failureCount < 2,
    },
    mutations: {
      retry: false,
    },
  },
})

let managersReady = false

/** Teach React Query about RN app focus and connectivity. Safe to call more than once. */
export function setupQueryManagers() {
  if (managersReady) return
  managersReady = true

  onlineManager.setEventListener((setOnline) =>
    NetInfo.addEventListener((state) => {
      setOnline(state.isConnected !== false)
    }),
  )

  if (Platform.OS !== 'web') {
    focusManager.setEventListener((setFocused) => {
      const subscription = AppState.addEventListener('change', (status) => {
        setFocused(status === 'active')
      })
      return () => subscription.remove()
    })
  }
}
