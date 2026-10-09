import { Pressable, View } from 'react-native'

import { cn } from '@/lib/utils'

import { Text } from './text'

export type SegmentedOption<T extends string> = { value: T; label: string }

export type SegmentedControlProps<T extends string> = {
  options: readonly SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View accessibilityRole="radiogroup" className={cn('flex-row rounded bg-muted p-1', className)}>
      {options.map((option) => {
        const selected = option.value === value
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            onPress={() => onChange(option.value)}
            className={cn(
              'h-9 flex-1 items-center justify-center rounded-md',
              selected && 'bg-background',
            )}
          >
            <Text variant="label" tone={selected ? 'default' : 'muted'}>
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}
