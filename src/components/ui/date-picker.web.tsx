import { useTranslation } from 'react-i18next'

import { Input } from './input'

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

/** Web preview fallback: type the date as YYYY-MM-DD. */
export function DatePicker({ value, onChange, label, error, className }: DatePickerProps) {
  const { t } = useTranslation()
  return (
    <Input
      className={className}
      label={label}
      error={error}
      placeholder="YYYY-MM-DD"
      defaultValue={value?.toISOString().slice(0, 10)}
      accessibilityHint={t('common.dateFormatHint')}
      onChangeText={(text) => {
        const date = new Date(text)
        if (/^\d{4}-\d{2}-\d{2}$/.test(text) && !Number.isNaN(date.getTime())) onChange(date)
      }}
    />
  )
}
