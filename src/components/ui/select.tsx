import { ChevronDown } from 'lucide-react-native'
import { useRef } from 'react'
import { Pressable, View } from 'react-native'

import { cn } from '@/lib/utils'

import { Icon } from './icon'
import { ListItem } from './list-item'
import { Sheet, type SheetRef } from './sheet'
import { Text } from './text'

export type SelectOption<T extends string> = { value: T; label: string }

export type SelectProps<T extends string> = {
  options: readonly SelectOption<T>[]
  value: T | undefined
  onChange: (value: T) => void
  label?: string
  placeholder?: string
  error?: string
  className?: string
}

/** Field that opens a bottom sheet with the options. */
export function Select<T extends string>({
  options,
  value,
  onChange,
  label,
  placeholder,
  error,
  className,
}: SelectProps<T>) {
  const sheetRef = useRef<SheetRef>(null)
  const selected = options.find((option) => option.value === value)

  return (
    <View className={cn('gap-1.5', className)}>
      {label && <Text variant="label">{label}</Text>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: selected?.label }}
        onPress={() => sheetRef.current?.present()}
        className={cn(
          'h-12 flex-row items-center rounded border border-input bg-background px-3',
          error && 'border-destructive',
        )}
      >
        <Text className="flex-1" tone={selected ? 'default' : 'muted'}>
          {selected?.label ?? placeholder}
        </Text>
        <Icon as={ChevronDown} size={18} color="muted-foreground" />
      </Pressable>
      {error && (
        <Text variant="caption" tone="destructive">
          {error}
        </Text>
      )}
      <Sheet ref={sheetRef} title={label}>
        {options.map((option) => (
          <ListItem
            key={option.value}
            title={option.label}
            selected={option.value === value}
            onPress={() => {
              onChange(option.value)
              sheetRef.current?.dismiss()
            }}
          />
        ))}
      </Sheet>
    </View>
  )
}
