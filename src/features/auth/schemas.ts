import { z } from 'zod'

/** Messages are i18n keys, translated where errors are rendered. */
const email = z.string().trim().min(1, 'validation.required').pipe(z.email('validation.email'))
const password = z.string().min(1, 'validation.required').min(8, 'validation.passwordMin')

export const signInSchema = z.object({ email, password })

export type SignInValues = z.infer<typeof signInSchema>

export const signUpSchema = z
  .object({
    name: z.string().trim().min(1, 'validation.required').min(2, 'validation.nameMin'),
    email,
    password,
    confirmPassword: z.string().min(1, 'validation.required'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'validation.passwordMismatch',
  })

export type SignUpValues = z.infer<typeof signUpSchema>

export const forgotPasswordSchema = z.object({ email })

export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>
