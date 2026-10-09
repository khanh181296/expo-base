import { Tabs } from 'expo-router'
import { House, Settings } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

import { useMe } from '@/features/auth'
import { useThemeColors } from '@/lib/theme'

export default function AppLayout() {
  const { t } = useTranslation()
  const { colors } = useThemeColors()
  useMe()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors['muted-foreground'],
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('tabs.home'),
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: t('tabs.settings'),
          tabBarIcon: ({ color, size }) => <Settings color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}
