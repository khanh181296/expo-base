import { useTranslation } from 'react-i18next'

import { Card, Divider, Screen, Text } from '@/components/ui'
import {
  AboutSection,
  AccountSection,
  AppearanceSection,
  LanguageItem,
  NotificationsItem,
} from '@/features/settings'

export default function SettingsScreen() {
  const { t } = useTranslation()

  return (
    <Screen scroll contentClassName="gap-4">
      <Text variant="h1">{t('settings.title')}</Text>
      <AppearanceSection />
      <Card>
        <LanguageItem />
        <Divider className="ml-12" />
        <NotificationsItem />
      </Card>
      <AccountSection />
      <AboutSection />
    </Screen>
  )
}
