import { Inbox, type LucideIcon } from 'lucide-react-native'
import { View } from 'react-native'

import { cn } from '@/lib/utils'

import { Button } from './button'
import { Icon } from './icon'
import { Text } from './text'

export type EmptyStateProps = {
  title: string
  description?: string
  icon?: LucideIcon
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function EmptyState({
  title,
  description,
  icon = Inbox,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('flex-1 items-center justify-center gap-3 p-8', className)}>
      <View className="rounded-full bg-muted p-4">
        <Icon as={icon} size={28} color="muted-foreground" />
      </View>
      <Text variant="h3" className="text-center">
        {title}
      </Text>
      {description && (
        <Text tone="muted" className="text-center">
          {description}
        </Text>
      )}
      {actionLabel && onAction && (
        <Button className="mt-2" variant="outline" label={actionLabel} onPress={onAction} />
      )}
    </View>
  )
}
