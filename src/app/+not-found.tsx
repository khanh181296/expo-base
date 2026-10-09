import { Link } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { Screen, Text } from '@/components/ui'

export default function NotFoundScreen() {
  const { t } = useTranslation()

  return (
    <Screen contentClassName="items-center justify-center gap-4">
      <Text variant="h3">{t('errors.notFound')}</Text>
      <Link href="/" className="text-base font-semibold text-primary">
        {t('errors.goHome')}
      </Link>
    </Screen>
  )
}
