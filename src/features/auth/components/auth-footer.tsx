import type { Href } from 'expo-router'
import { View } from 'react-native'

import { Text, TextLink } from '@/components/ui'

type AuthFooterProps = {
  question: string
  linkLabel: string
  href: Href
}

export function AuthFooter({ question, linkLabel, href }: AuthFooterProps) {
  return (
    <View className="flex-row items-center justify-center gap-1">
      <Text variant="label" tone="muted">
        {question}
      </Text>
      <TextLink href={href} replace>
        {linkLabel}
      </TextLink>
    </View>
  )
}
