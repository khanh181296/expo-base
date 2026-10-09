import { z } from 'zod'

export const noteSchema = z.object({
  title: z.string().trim().min(1, 'validation.required').max(120, 'validation.tooLong'),
  content: z.string().trim().max(2000, 'validation.tooLong'),
})

export type NoteValues = z.infer<typeof noteSchema>
