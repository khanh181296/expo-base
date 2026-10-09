import { zodResolver } from '@hookform/resolvers/zod'
import { Save } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { Button, FormInput } from '@/components/ui'

import { noteSchema, type NoteValues } from '../schemas'

type NoteFormProps = {
  defaultValues?: NoteValues
  submitting?: boolean
  onSubmit: (values: NoteValues) => void
  children?: React.ReactNode
}

export function NoteForm({ defaultValues, submitting, onSubmit, children }: NoteFormProps) {
  const { t } = useTranslation()
  const { control, handleSubmit, formState } = useForm<NoteValues>({
    resolver: zodResolver(noteSchema),
    defaultValues: defaultValues ?? { title: '', content: '' },
  })

  return (
    <View className="gap-4">
      <FormInput
        control={control}
        name="title"
        label={t('notes.titleLabel')}
        placeholder={t('notes.titlePlaceholder')}
        returnKeyType="next"
      />
      <FormInput
        control={control}
        name="content"
        label={t('notes.contentLabel')}
        placeholder={t('notes.contentPlaceholder')}
        multiline
      />
      <Button
        className="mt-2"
        label={t('common.save')}
        icon={Save}
        loading={submitting}
        disabled={Boolean(defaultValues) && !formState.isDirty}
        onPress={handleSubmit(onSubmit)}
      />
      {children}
    </View>
  )
}
