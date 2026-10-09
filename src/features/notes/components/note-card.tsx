import { Pressable } from 'react-native'

import { Text } from '@/components/ui'
import { formatDateTime } from '@/lib/utils'

import type { Note } from '../types'

export function NoteCard({ note, onPress }: { note: Note; onPress: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      className="gap-1 rounded-lg border border-border bg-card p-4 active:opacity-80"
    >
      <Text variant="h3" numberOfLines={1}>
        {note.title}
      </Text>
      {note.content ? (
        <Text tone="muted" numberOfLines={2}>
          {note.content}
        </Text>
      ) : null}
      <Text variant="caption" tone="muted" className="mt-1">
        {formatDateTime(note.updatedAt)}
      </Text>
    </Pressable>
  )
}
