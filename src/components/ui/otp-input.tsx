import { useRef, useState } from 'react'
import { Pressable, TextInput, View } from 'react-native'

import { cn } from '@/lib/utils'

import { Text } from './text'

export type OtpInputProps = {
  length?: number
  value: string
  onChange: (value: string) => void
  /** Called once all digits are entered */
  onComplete?: (value: string) => void
  error?: string
  autoFocus?: boolean
  className?: string
}

/**
 * One hidden TextInput drives the boxes, so paste, SMS autofill (iOS oneTimeCode,
 * Android sms-otp) and backspace work natively.
 */
export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  error,
  autoFocus,
  className,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null)
  const [focused, setFocused] = useState(false)

  const handleChange = (text: string) => {
    const digits = text.replace(/\D/g, '').slice(0, length)
    onChange(digits)
    if (digits.length === length) onComplete?.(digits)
  }

  return (
    <View className={cn('gap-1.5', className)}>
      <Pressable
        onPress={() => inputRef.current?.focus()}
        className="flex-row justify-between gap-2"
      >
        {Array.from({ length }, (_, index) => {
          const active = focused && index === Math.min(value.length, length - 1)
          return (
            <View
              key={index}
              className={cn(
                'h-14 flex-1 items-center justify-center rounded border border-input bg-background',
                active && 'border-ring',
                error && 'border-destructive',
              )}
            >
              <Text variant="h3">{value[index] ?? ''}</Text>
            </View>
          )
        })}
      </Pressable>
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={handleChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={length}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoFocus={autoFocus}
        caretHidden
        accessibilityLabel="OTP"
        className="absolute h-px w-px opacity-0"
      />
      {error && (
        <Text variant="caption" tone="destructive">
          {error}
        </Text>
      )}
    </View>
  )
}
