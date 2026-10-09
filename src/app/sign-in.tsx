import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Screen, Text } from '@/components/ui'
import { SignInForm } from '@/features/auth'
import { Env } from '@/lib/env'

export default function SignInScreen() {
  const { t } = useTranslation()

  return (
    <Screen
      scroll
      edges={['top', 'bottom', 'left', 'right']}
      contentClassName="justify-center gap-8"
    >
      <View className="gap-2">
        <Text variant="h1">{t('auth.signInTitle')}</Text>
        <Text tone="muted">{t('auth.signInSubtitle')}</Text>
      </View>
      <SignInForm />
      {Env.USE_MOCK_API && (
        <Text variant="caption" tone="muted" className="text-center">
          {t('auth.mockHint')}
        </Text>
      )}
    </Screen>
  )
}
