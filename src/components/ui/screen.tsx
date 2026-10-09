import { View } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { type Edge, SafeAreaView } from 'react-native-safe-area-context'

import { cn } from '@/lib/utils'

export type ScreenProps = {
  children: React.ReactNode
  /** Wrap content in a keyboard-aware ScrollView */
  scroll?: boolean
  edges?: Edge[]
  className?: string
  contentClassName?: string
}

export function Screen({
  children,
  scroll = false,
  edges = ['top', 'left', 'right'],
  className,
  contentClassName,
}: ScreenProps) {
  return (
    <SafeAreaView edges={edges} className={cn('flex-1 bg-background', className)}>
      {scroll ? (
        <KeyboardAwareScrollView
          bottomOffset={24}
          keyboardShouldPersistTaps="handled"
          contentContainerClassName={cn('grow p-4', contentClassName)}
        >
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <View className={cn('flex-1 p-4', contentClassName)}>{children}</View>
      )}
    </SafeAreaView>
  )
}
