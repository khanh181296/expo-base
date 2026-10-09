import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker'
import { CalendarDays } from 'lucide-react-native'
import { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, View } from 'react-native'

import { useThemeColors } from '@/lib/theme'
import { cn } from '@/lib/utils'

import { Button } from './button'
import { Icon } from './icon'
import { Sheet, type SheetRef } from './sheet'
import { Text } from './text'

export type DatePickerProps = {
  value: Date | undefined
  onChange: (date: Date) => void
  label?: string
  placeholder?: string
  error?: string
  minimumDate?: Date
  maximumDate?: Date
  className?: string
}

const format = (date: Date, locale: string) =>
  new Intl.DateTimeFormat(locale, { dateStyle: 'medium' }).format(date)

/** Date field: native dialog on Android, inline calendar in a bottom sheet on iOS. */
export function DatePicker({
  value,
  onChange,
  label,
  placeholder,
  error,
  minimumDate,
  maximumDate,
  className,
}: DatePickerProps) {
  const { t, i18n } = useTranslation()
  const { scheme } = useThemeColors()
  const sheetRef = useRef<SheetRef>(null)
  const [draft, setDraft] = useState(value ?? new Date())

  const open = () => {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: value ?? new Date(),
        mode: 'date',
        minimumDate,
        maximumDate,
        onChange: (event, date) => {
          if (event.type === 'set' && date) onChange(date)
        },
      })
      return
    }
    setDraft(value ?? new Date())
    sheetRef.current?.present()
  }

  return (
    <View className={cn('gap-1.5', className)}>
      {label && <Text variant="label">{label}</Text>}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{ text: value ? format(value, i18n.language) : undefined }}
        onPress={open}
        className={cn(
          'h-12 flex-row items-center rounded border border-input bg-background px-3',
          error && 'border-destructive',
        )}
      >
        <Text className="flex-1" tone={value ? 'default' : 'muted'}>
          {value ? format(value, i18n.language) : placeholder}
        </Text>
        <Icon as={CalendarDays} size={18} color="muted-foreground" />
      </Pressable>
      {error && (
        <Text variant="caption" tone="destructive">
          {error}
        </Text>
      )}
      {Platform.OS === 'ios' && (
        <Sheet ref={sheetRef} title={label}>
          <View className="items-center px-4">
            <DateTimePicker
              value={draft}
              mode="date"
              display="inline"
              locale={i18n.language}
              themeVariant={scheme}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              onChange={(_event, date) => date && setDraft(date)}
            />
            <Button
              className="mt-2 w-full"
              label={t('common.confirm')}
              onPress={() => {
                onChange(draft)
                sheetRef.current?.dismiss()
              }}
            />
          </View>
        </Sheet>
      )}
    </View>
  )
}
