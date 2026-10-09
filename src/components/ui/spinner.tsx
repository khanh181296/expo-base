import { ActivityIndicator, type ActivityIndicatorProps } from 'react-native'

import { type ColorToken, useThemeColors } from '@/lib/theme'

export type SpinnerProps = Omit<ActivityIndicatorProps, 'color'> & { color?: ColorToken }

export function Spinner({ color = 'primary', ...props }: SpinnerProps) {
  const { colors } = useThemeColors()
  return <ActivityIndicator color={colors[color]} {...props} />
}
