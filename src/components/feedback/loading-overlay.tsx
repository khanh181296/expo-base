import { View } from 'react-native'
import Animated, { FadeIn } from 'react-native-reanimated'
import { create } from 'zustand'

import { Spinner } from '@/components/ui/spinner'

const useLoadingStore = create<{ count: number }>(() => ({ count: 0 }))

/** Blocking overlay. Calls are counted, so nested show/hide pairs are safe. */
export const loading = {
  show: () => useLoadingStore.setState((state) => ({ count: state.count + 1 })),
  hide: () => useLoadingStore.setState((state) => ({ count: Math.max(0, state.count - 1) })),
  async wrap<T>(task: Promise<T>) {
    loading.show()
    try {
      return await task
    } finally {
      loading.hide()
    }
  },
}

/** Mount once near the root. */
export function LoadingOverlay() {
  const visible = useLoadingStore((state) => state.count > 0)
  if (!visible) return null

  return (
    <Animated.View
      entering={FadeIn}
      className="absolute inset-0 items-center justify-center bg-overlay/30"
    >
      <View className="rounded-xl bg-card p-5">
        <Spinner size="large" />
      </View>
    </Animated.View>
  )
}
