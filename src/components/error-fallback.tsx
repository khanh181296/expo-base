import type { ErrorBoundaryProps } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Button, Screen, Text } from '@/components/ui'
import { captureError } from '@/lib/monitoring'

/** Route-level error boundary, exported from layouts as `ErrorBoundary`. */
export function ErrorFallback({ error, retry }: ErrorBoundaryProps) {
  const { t } = useTranslation()

  useEffect(() => {
    captureError(error)
  }, [error])

  return (
    <Screen contentClassName="items-center justify-center gap-4">
      <Text variant="h2">{t('errors.boundaryTitle')}</Text>
      {__DEV__ && (
        <View className="w-full rounded bg-muted p-3">
          <Text variant="caption" tone="destructive">
            {error.message}
          </Text>
        </View>
      )}
      <Button label={t('common.retry')} onPress={retry} />
    </Screen>
  )
}
