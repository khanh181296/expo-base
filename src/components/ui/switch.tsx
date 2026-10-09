import { Switch as RNSwitch, type SwitchProps as RNSwitchProps } from 'react-native'

import { useThemeColors } from '@/lib/theme'

export type SwitchProps = Omit<RNSwitchProps, 'trackColor' | 'thumbColor'>

export function Switch(props: SwitchProps) {
  const { colors } = useThemeColors()
  return (
    <RNSwitch
      trackColor={{ false: colors.input, true: colors.primary }}
      thumbColor="#ffffff"
      ios_backgroundColor={colors.input}
      {...props}
    />
  )
}
