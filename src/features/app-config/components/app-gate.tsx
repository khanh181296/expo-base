import { Download, Wrench } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Linking, Platform, View } from 'react-native'

import { EmptyState } from '@/components/ui'

import { useAppGate } from '../hooks'

/** Renders children unless the remote config blocks this build. */
export function AppGate({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation()
  const { gate, config, retry } = useAppGate()

  if (gate === 'ok' || !config) return children

  return (
    <View className="flex-1 bg-background">
      {gate === 'updateRequired' ? (
        <EmptyState
          icon={Download}
          title={t('appGate.updateTitle')}
          description={t('appGate.updateMessage')}
          actionLabel={t('appGate.updateAction')}
          onAction={() =>
            Linking.openURL(Platform.OS === 'ios' ? config.storeUrl.ios : config.storeUrl.android)
          }
        />
      ) : (
        <EmptyState
          icon={Wrench}
          title={t('appGate.maintenanceTitle')}
          description={config.maintenanceMessage ?? t('appGate.maintenanceMessage')}
          actionLabel={t('common.retry')}
          onAction={() => retry()}
        />
      )}
    </View>
  )
}
