import { Eye, EyeOff } from 'lucide-react-native'
import { useState } from 'react'
import { Pressable, TextInput, type TextInputProps, View } from 'react-native'

import { useThemeColors } from '@/lib/theme'
import { cn } from '@/lib/utils'

import { Icon } from './icon'
import { Text } from './text'

export type InputProps = TextInputProps & {
  label?: string
  error?: string
  hint?: string
  className?: string
  ref?: React.Ref<TextInput>
}

export function Input({
  label,
  error,
  hint,
  secureTextEntry,
  multiline,
  editable = true,
  className,
  onFocus,
  onBlur,
  ref,
  ...props
}: InputProps) {
  const { colors } = useThemeColors()
  const [focused, setFocused] = useState(false)
  const [hidden, setHidden] = useState(Boolean(secureTextEntry))

  return (
    <View className={cn('gap-1.5', className)}>
      {label && <Text variant="label">{label}</Text>}
      <View
        className={cn(
          'flex-row rounded border border-input bg-background px-3',
          multiline ? 'min-h-28 items-start py-2.5' : 'h-12 items-center',
          focused && 'border-ring',
          error && 'border-destructive',
          !editable && 'bg-muted opacity-70',
        )}
      >
        <TextInput
          ref={ref}
          className="flex-1 text-base text-foreground"
          placeholderTextColor={colors['muted-foreground']}
          selectionColor={colors.primary}
          secureTextEntry={hidden}
          multiline={multiline}
          textAlignVertical={multiline ? 'top' : 'center'}
          editable={editable}
          accessibilityLabel={label}
          onFocus={(event) => {
            setFocused(true)
            onFocus?.(event)
          }}
          onBlur={(event) => {
            setFocused(false)
            onBlur?.(event)
          }}
          {...props}
        />
        {secureTextEntry && (
          <Pressable
            hitSlop={8}
            accessibilityRole="button"
            onPress={() => setHidden((value) => !value)}
          >
            <Icon as={hidden ? Eye : EyeOff} size={18} color="muted-foreground" />
          </Pressable>
        )}
      </View>
      {error ? (
        <Text variant="caption" tone="destructive">
          {error}
        </Text>
      ) : (
        hint && (
          <Text variant="caption" tone="muted">
            {hint}
          </Text>
        )
      )}
    </View>
  )
}
