import { CircleAlert, CircleCheck, Info, type LucideIcon } from 'lucide-react-native'
import { Pressable, View } from 'react-native'
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { create } from 'zustand'

import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'
import type { ColorToken } from '@/lib/theme'

type ToastType = 'success' | 'error' | 'info'

type ToastItem = {
  id: number
  type: ToastType
  message: string
  duration: number
}

type ToastState = {
  toasts: ToastItem[]
  show: (toast: Omit<ToastItem, 'id'>) => void
  dismiss: (id: number) => void
}

const MAX_VISIBLE = 3
let nextId = 1

const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  show: (toast) => {
    const id = nextId++
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }].slice(-MAX_VISIBLE) }))
    setTimeout(() => get().dismiss(id), toast.duration)
  },
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

const show =
  (type: ToastType) =>
  (message: string, duration = 3000) =>
    useToastStore.getState().show({ type, message, duration })

/** Imperative API, callable from anywhere (components, mutations, interceptors). */
export const toast = {
  success: show('success'),
  error: show('error'),
  info: show('info'),
  dismissAll: () => useToastStore.setState({ toasts: [] }),
}

const ICONS: Record<ToastType, { icon: LucideIcon; color: ColorToken }> = {
  success: { icon: CircleCheck, color: 'success' },
  error: { icon: CircleAlert, color: 'destructive' },
  info: { icon: Info, color: 'primary' },
}

/** Mount once near the root. */
export function ToastHost() {
  const toasts = useToastStore((state) => state.toasts)
  const dismiss = useToastStore((state) => state.dismiss)
  const insets = useSafeAreaInsets()

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 top-0 gap-2 px-4"
      style={{ paddingTop: insets.top + 8 }}
    >
      {toasts.map((item) => (
        <Animated.View
          key={item.id}
          entering={FadeInUp}
          exiting={FadeOutUp}
          layout={LinearTransition}
        >
          <Pressable
            accessibilityRole="alert"
            onPress={() => dismiss(item.id)}
            className="flex-row items-center gap-3 rounded-lg border border-border bg-card px-4 py-3 shadow-lg"
          >
            <Icon as={ICONS[item.type].icon} color={ICONS[item.type].color} />
            <Text className="flex-1" variant="label">
              {item.message}
            </Text>
          </Pressable>
        </Animated.View>
      ))}
    </View>
  )
}
