import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'

import { toast } from '@/components/feedback'
import { Screen } from '@/components/ui'
import { NoteForm, useCreateNote } from '@/features/notes'
import { getErrorMessage } from '@/lib/api'

export default function NewNoteScreen() {
  const { t } = useTranslation()
  const createNote = useCreateNote()

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <NoteForm
        submitting={createNote.isPending}
        onSubmit={(values) =>
          createNote.mutate(values, {
            onSuccess: () => {
              toast.success(t('notes.created'))
              router.back()
            },
            onError: (error) => toast.error(getErrorMessage(error, t)),
          })
        }
      />
    </Screen>
  )
}
