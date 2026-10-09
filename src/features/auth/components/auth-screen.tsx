import { View } from 'react-native'

import { LanguageSwitcher } from '@/components/language-switcher'
import { Screen, Text } from '@/components/ui'

type AuthScreenProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

/** Shared shell for signed-out screens: language toggle, heading, content */
export function AuthScreen({ title, subtitle, children }: AuthScreenProps) {
  return (
    <Screen scroll edges={['top', 'bottom', 'left', 'right']} contentClassName="gap-8">
      <LanguageSwitcher className="w-28 self-end" />
      <View className="flex-1 justify-center gap-8">
        <View className="gap-2">
          <Text variant="h1">{title}</Text>
          <Text tone="muted">{subtitle}</Text>
        </View>
        {children}
      </View>
    </Screen>
  )
}
