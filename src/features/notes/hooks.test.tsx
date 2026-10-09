import { act, renderHook, waitFor } from '@testing-library/react-native'

import { createQueryWrapper } from '@/test-utils'

import { notesApi } from './api'
import { noteKeys, useDeleteNote, useNotes } from './hooks'
import type { Note } from './types'

jest.mock('./api', () => ({
  NOTES_PAGE_SIZE: 2,
  notesApi: { list: jest.fn(), remove: jest.fn() },
}))

const note = (id: string): Note => ({ id, title: id, content: '', updatedAt: '2026-10-09' })
const api = jest.mocked(notesApi)

beforeEach(() => {
  api.list.mockImplementation(async (page) =>
    page === 1
      ? { items: [note('a'), note('b')], page: 1, nextPage: 2, total: 3 }
      : { items: [note('c')], page: 2, nextPage: null, total: 3 },
  )
})

describe('useNotes', () => {
  it('flattens pages and loads the next one', async () => {
    const { wrapper } = createQueryWrapper()
    const { result } = await renderHook(() => useNotes(), { wrapper })

    await waitFor(() => expect(result.current.data?.notes).toHaveLength(2))
    await act(async () => {
      await result.current.fetchNextPage()
    })

    await waitFor(() =>
      expect(result.current.data?.notes.map((n) => n.id)).toEqual(['a', 'b', 'c']),
    )
    expect(result.current.hasNextPage).toBe(false)
  })
})

describe('useDeleteNote', () => {
  const ids = (queryClient: ReturnType<typeof createQueryWrapper>['queryClient']) =>
    queryClient
      .getQueryData<{ pages: { items: Note[] }[] }>(noteKeys.lists())
      ?.pages.flatMap((page) => page.items.map((item) => item.id))

  it('removes the note immediately (optimistic)', async () => {
    let resolveRemove: (id: string) => void = () => {}
    api.remove.mockImplementation(() => new Promise((resolve) => (resolveRemove = resolve)))
    const { wrapper, queryClient } = createQueryWrapper()
    const notes = await renderHook(() => useNotes(), { wrapper })
    await waitFor(() => expect(notes.result.current.isSuccess).toBe(true))

    const { result } = await renderHook(() => useDeleteNote(), { wrapper })
    await act(async () => {
      result.current.mutate('a')
    })

    await waitFor(() => expect(ids(queryClient)).toEqual(['b']))
    await act(async () => resolveRemove('a'))
  })

  it('restores the note when the request fails', async () => {
    api.remove.mockRejectedValue(new Error('boom'))
    const { wrapper, queryClient } = createQueryWrapper()
    const notes = await renderHook(() => useNotes(), { wrapper })
    await waitFor(() => expect(notes.result.current.isSuccess).toBe(true))

    const { result } = await renderHook(() => useDeleteNote(), { wrapper })
    await act(async () => {
      await result.current.mutateAsync('a').catch(() => undefined)
    })

    await waitFor(() => expect(ids(queryClient)).toEqual(['a', 'b']))
  })
})
