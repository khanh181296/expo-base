import { render, screen, userEvent } from '@testing-library/react-native'

import { Button } from './button'

describe('Button', () => {
  it('calls onPress', async () => {
    const user = userEvent.setup()
    const onPress = jest.fn()
    await render(<Button label="Save" onPress={onPress} />)

    await user.press(screen.getByRole('button', { name: 'Save' }))

    expect(onPress).toHaveBeenCalledTimes(1)
  })

  it('is disabled while loading', async () => {
    const user = userEvent.setup()
    const onPress = jest.fn()
    await render(<Button label="Save" loading onPress={onPress} />)

    await user.press(screen.getByRole('button'))

    expect(onPress).not.toHaveBeenCalled()
    expect(screen.getByRole('button')).toBeDisabled()
  })
})
