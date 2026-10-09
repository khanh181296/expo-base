import { signInSchema } from './schemas'

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
