import { z } from 'zod'

/** Messages are i18n keys, translated where errors are rendered. */
export const signInSchema = z.object({
  email: z.string().trim().min(1, 'validation.required').pipe(z.email('validation.email')),
  password: z.string().min(1, 'validation.required').min(8, 'validation.passwordMin'),
})

export type SignInValues = z.infer<typeof signInSchema>
