export type Note = {
  id: string
  title: string
  content: string
  updatedAt: string
}

export type NoteInput = Pick<Note, 'title' | 'content'>
