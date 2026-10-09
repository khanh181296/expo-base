import { router, useLocalSearchParams } from 'expo-router'
import { Trash2 } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

import { dialog, toast } from '@/components/feedback'
import { Button, ErrorState, Screen, Spinner } from '@/components/ui'
import { NoteForm, useDeleteNote, useNote, useUpdateNote } from '@/features/notes'
import { getErrorMessage } from '@/lib/api'

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { t } = useTranslation()
  const note = useNote(id)
  const updateNote = useUpdateNote(id)
  const deleteNote = useDeleteNote()

  if (note.isError) return <ErrorState error={note.error} onRetry={() => note.refetch()} />
  if (!note.data) return <Spinner className="flex-1" />

  const onDelete = async () => {
    const confirmed = await dialog.confirm({
      title: t('notes.deleteTitle'),
      message: t('notes.deleteMessage'),
      confirmLabel: t('common.delete'),
      destructive: true,
    })
    if (!confirmed) return
    router.back()
    deleteNote.mutate(id, {
      onError: (error) => toast.error(getErrorMessage(error, t)),
    })
  }

  return (
    <Screen scroll edges={['bottom', 'left', 'right']}>
      <NoteForm
        key={note.data.updatedAt}
        defaultValues={{ title: note.data.title, content: note.data.content }}
        submitting={updateNote.isPending}
        onSubmit={(values) =>
          updateNote.mutate(values, {
            onSuccess: () => toast.success(t('notes.updated')),
            onError: (error) => toast.error(getErrorMessage(error, t)),
          })
        }
      >
        <Button variant="outline" icon={Trash2} label={t('common.delete')} onPress={onDelete} />
      </NoteForm>
    </Screen>
  )
}
