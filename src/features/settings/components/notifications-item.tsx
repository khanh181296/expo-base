import { Bell } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { Linking, View } from 'react-native'

import { Icon, Switch, Text } from '@/components/ui'
import { isPushSupported, usePushPermission } from '@/features/notifications'

export function NotificationsItem() {
  const { t } = useTranslation()
  const { status, request } = usePushPermission()

  if (!isPushSupported) return null

  const enabled = status === 'granted'

  const onToggle = () => {
    // iOS only shows the system prompt once; after a denial the user must go to Settings.
    if (status === 'denied' || enabled) void Linking.openSettings()
    else void request()
  }

  return (
    <View className="min-h-12 flex-row items-center gap-3 px-4 py-3">
      <Icon as={Bell} size={20} color="muted-foreground" />
      <Text className="flex-1">{t('settings.notifications')}</Text>
      <Switch
        value={enabled}
        onValueChange={onToggle}
        accessibilityLabel={t('settings.notifications')}
      />
    </View>
  )
}
