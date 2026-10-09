import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Input, type InputProps } from './input'

export type FormInputProps<T extends FieldValues> = Omit<
  InputProps,
  'value' | 'onChangeText' | 'error'
> & {
  control: Control<T>
  name: FieldPath<T>
}

/** Input bound to react-hook-form. Validation messages are i18n keys. */
export function FormInput<T extends FieldValues>({ control, name, ...props }: FormInputProps<T>) {
  const { t } = useTranslation()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Input
          ref={field.ref}
          value={field.value ?? ''}
          onChangeText={field.onChange}
          onBlur={field.onBlur}
          error={fieldState.error?.message && t(fieldState.error.message as never)}
          {...props}
        />
      )}
    />
  )
}
