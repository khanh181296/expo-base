import { View } from 'react-native'

import { NotesList } from '@/features/notes'

export default function NotesScreen() {
  return (
    <View className="flex-1 bg-background">
      <NotesList />
    </View>
  )
}
