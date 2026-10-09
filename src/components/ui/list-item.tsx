import { Check, ChevronRight, type LucideIcon } from 'lucide-react-native'
import { Pressable } from 'react-native'

import { cn } from '@/lib/utils'

import { Icon } from './icon'
import { Text } from './text'

export type ListItemProps = {
  title: string
  value?: string
  icon?: LucideIcon
  destructive?: boolean
  /** Shows a check mark instead of the chevron (pickers) */
  selected?: boolean
  onPress?: () => void
  className?: string
}

export function ListItem({
  title,
  value,
  icon,
  destructive,
  selected,
  onPress,
  className,
}: ListItemProps) {
  return (
    <Pressable
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityState={selected === undefined ? undefined : { selected }}
      onPress={onPress}
      className={cn('min-h-12 flex-row items-center gap-3 px-4 py-3 active:bg-muted', className)}
    >
      {icon && (
        <Icon as={icon} size={20} color={destructive ? 'destructive' : 'muted-foreground'} />
      )}
      <Text className="flex-1" tone={destructive ? 'destructive' : 'default'}>
        {title}
      </Text>
      {value && <Text tone="muted">{value}</Text>}
      {selected !== undefined
        ? selected && <Icon as={Check} size={18} color="primary" />
        : onPress && !destructive && <Icon as={ChevronRight} size={18} color="muted-foreground" />}
    </Pressable>
  )
}
