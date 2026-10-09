import {
  type InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import type { Paginated } from '@/lib/api'

import { notesApi } from './api'
import type { Note, NoteInput } from './types'

export const noteKeys = {
  all: ['notes'] as const,
  lists: () => [...noteKeys.all, 'list'] as const,
  detail: (id: string) => [...noteKeys.all, 'detail', id] as const,
}

type NotesPages = InfiniteData<Paginated<Note>, number>

export function useNotes() {
  return useInfiniteQuery({
    queryKey: noteKeys.lists(),
    queryFn: ({ pageParam }) => notesApi.list(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    select: (data) => ({
      notes: data.pages.flatMap((page) => page.items),
      total: data.pages[0]?.total ?? 0,
    }),
  })
}

export function useNote(id: string) {
  const queryClient = useQueryClient()
  return useQuery({
    queryKey: noteKeys.detail(id),
    queryFn: () => notesApi.get(id),
    // Show the row from the list instantly while the detail refetches.
    placeholderData: () =>
      queryClient
        .getQueryData<NotesPages>(noteKeys.lists())
        ?.pages.flatMap((page) => page.items)
        .find((note) => note.id === id),
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NoteInput) => notesApi.create(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: noteKeys.lists() }),
  })
}

export function useUpdateNote(id: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: NoteInput) => notesApi.update(id, input),
    onSuccess: (note) => {
      queryClient.setQueryData(noteKeys.detail(id), note)
      return queryClient.invalidateQueries({ queryKey: noteKeys.lists() })
    },
  })
}

/** Optimistic delete: the row disappears immediately and comes back if the request fails. */
export function useDeleteNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: notesApi.remove,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: noteKeys.lists() })
      const previous = queryClient.getQueryData<NotesPages>(noteKeys.lists())
      queryClient.setQueryData<NotesPages>(
        noteKeys.lists(),
        (data) =>
          data && {
            ...data,
            pages: data.pages.map((page) => ({
              ...page,
              items: page.items.filter((note) => note.id !== id),
              total: page.total - 1,
            })),
          },
      )
      return { previous }
    },
    onError: (_error, _id, context) => {
      if (context?.previous) queryClient.setQueryData(noteKeys.lists(), context.previous)
    },
    onSettled: (_data, _error, id) => {
      queryClient.removeQueries({ queryKey: noteKeys.detail(id) })
      return queryClient.invalidateQueries({ queryKey: noteKeys.lists() })
    },
  })
}
