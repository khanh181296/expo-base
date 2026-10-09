import { useTranslation } from 'react-i18next'

import { Card, Screen, Text } from '@/components/ui'
import { AboutSection, AccountSection, AppearanceSection, LanguageItem } from '@/features/settings'

export default function SettingsScreen() {
  const { t } = useTranslation()

  return (
    <Screen scroll contentClassName="gap-4">
      <Text variant="h1">{t('settings.title')}</Text>
      <AppearanceSection />
      <Card>
        <LanguageItem />
      </Card>
      <AccountSection />
      <AboutSection />
    </Screen>
  )
}
