import { api, type Paginated } from '@/lib/api'

import type { Note, NoteInput } from './types'

export const NOTES_PAGE_SIZE = 15

export const notesApi = {
  list: (page: number) =>
    api
      .get<Paginated<Note>>('/notes', { params: { page, limit: NOTES_PAGE_SIZE } })
      .then((res) => res.data),

  get: (id: string) => api.get<Note>(`/notes/${id}`).then((res) => res.data),

  create: (input: NoteInput) => api.post<Note>('/notes', input).then((res) => res.data),

  update: (id: string, input: NoteInput) =>
    api.put<Note>(`/notes/${id}`, input).then((res) => res.data),

  remove: (id: string) => api.delete<void>(`/notes/${id}`).then(() => id),
}
