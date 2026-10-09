import type { LucideIcon } from 'lucide-react-native'

import { type ColorToken, useThemeColors } from '@/lib/theme'

export type IconProps = {
  as: LucideIcon
  size?: number
  color?: ColorToken
  strokeWidth?: number
}

export function Icon({
  as: Component,
  size = 20,
  color = 'foreground',
  strokeWidth = 2,
}: IconProps) {
  const { colors } = useThemeColors()
  return <Component size={size} color={colors[color]} strokeWidth={strokeWidth} />
}
