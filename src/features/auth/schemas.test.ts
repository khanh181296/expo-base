import { forgotPasswordSchema, signInSchema, signUpSchema } from './schemas'

describe('signInSchema', () => {
  it('accepts valid credentials and trims email', () => {
    expect(signInSchema.parse({ email: ' a@b.co ', password: '12345678' }).email).toBe('a@b.co')
  })

  it.each([
    [{ email: '', password: '12345678' }, 'validation.required'],
    [{ email: 'nope', password: '12345678' }, 'validation.email'],
    [{ email: 'a@b.co', password: '123' }, 'validation.passwordMin'],
  ])('rejects %j with %s', (input, message) => {
    const result = signInSchema.safeParse(input)
    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.message).toBe(message)
  })
})

describe('signUpSchema', () => {
  const valid = {
    name: 'Khanh',
    email: 'a@b.co',
    password: '12345678',
    confirmPassword: '12345678',
  }

  it('accepts matching passwords', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
  })

  it('reports mismatched confirmation on confirmPassword', () => {
    const result = signUpSchema.safeParse({ ...valid, confirmPassword: 'different1' })
    expect(result.error?.issues[0]).toMatchObject({
      path: ['confirmPassword'],
      message: 'validation.passwordMismatch',
    })
  })
})

describe('forgotPasswordSchema', () => {
  it('requires a valid email', () => {
    expect(forgotPasswordSchema.safeParse({ email: 'nope' }).success).toBe(false)
  })
})
