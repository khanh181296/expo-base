import { useTranslation } from 'react-i18next'

import { Card, Screen, Text } from '@/components/ui'
import { useAuthStore } from '@/features/auth'

export default function HomeScreen() {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)

  return (
    <Screen scroll contentClassName="gap-4">
      <Text variant="h1">{t('home.greeting', { name: user?.name ?? '' })}</Text>
      <Card className="p-4">
        <Text tone="muted">{t('home.subtitle')}</Text>
      </Card>
    </Screen>
  )
}
