import { useTranslation } from 'react-i18next'

import { Card, SegmentedControl, Text } from '@/components/ui'
import { COLOR_SCHEME_PREFERENCES, useColorSchemePreference } from '@/lib/theme'

export function AppearanceSection() {
  const { t } = useTranslation()
  const { preference, setPreference } = useColorSchemePreference()

  const options = COLOR_SCHEME_PREFERENCES.map((value) => ({
    value,
    label: t(`settings.colorScheme.${value}`),
  }))

  return (
    <Card className="gap-3 p-4">
      <Text variant="label" tone="muted">
        {t('settings.appearance')}
      </Text>
      <SegmentedControl options={options} value={preference} onChange={setPreference} />
    </Card>
  )
}
