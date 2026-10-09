import { Check } from 'lucide-react-native'
import { Pressable, View } from 'react-native'

import { cn } from '@/lib/utils'

import { Icon } from './icon'
import { Text } from './text'

export type CheckboxProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Checkbox({ checked, onChange, label, disabled, className }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onChange(!checked)}
      className={cn('flex-row items-center gap-3', disabled && 'opacity-50', className)}
    >
      <View
        className={cn(
          'size-5 items-center justify-center rounded-md border',
          checked ? 'border-primary bg-primary' : 'border-input bg-background',
        )}
      >
        {checked && <Icon as={Check} size={14} strokeWidth={3} color="primary-foreground" />}
      </View>
      {label && <Text className="flex-1">{label}</Text>}
    </Pressable>
  )
}
