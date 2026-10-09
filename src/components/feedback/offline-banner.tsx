import { useNetInfo } from '@react-native-community/netinfo'
import { WifiOff } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Icon } from '@/components/ui/icon'
import { Text } from '@/components/ui/text'

/** Shown while the device has no connection. Mount once near the root. */
export function OfflineBanner() {
  const { t } = useTranslation()
  const { isConnected } = useNetInfo()
  const insets = useSafeAreaInsets()

  if (isConnected !== false) return null

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      pointerEvents="none"
      accessibilityLiveRegion="polite"
      className="absolute inset-x-0 top-0 flex-row items-center justify-center gap-2 bg-foreground px-4 pb-2"
      style={{ paddingTop: insets.top + 4 }}
    >
      <Icon as={WifiOff} size={16} color="background" />
      <Text variant="label" className="text-background">
        {t('states.offline')}
      </Text>
    </Animated.View>
  )
}
