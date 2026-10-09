import { fireEvent, render, screen } from '@testing-library/react-native'
import { useState } from 'react'

import { OtpInput } from './otp-input'

function Harness({ onComplete }: { onComplete: (code: string) => void }) {
  const [value, setValue] = useState('')
  return <OtpInput length={4} value={value} onChange={setValue} onComplete={onComplete} />
}

describe('OtpInput', () => {
  it('keeps digits only and completes at full length', async () => {
    const onComplete = jest.fn()
    await render(<Harness onComplete={onComplete} />)

    await fireEvent.changeText(screen.getByLabelText('OTP'), '1a2-3 4 5')

    expect(onComplete).toHaveBeenCalledWith('1234')
    expect(screen.getByText('4')).toBeTruthy()
  })
})
