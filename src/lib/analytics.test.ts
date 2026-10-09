import { analytics, setAnalyticsProvider } from './analytics'

describe('analytics', () => {
  it('forwards typed events to the provider', () => {
    const provider = { track: jest.fn(), screen: jest.fn(), identify: jest.fn() }
    setAnalyticsProvider(provider)

    analytics.track({ name: 'sign_in', method: 'email' })
    analytics.screen('/notes')

    expect(provider.track).toHaveBeenCalledWith('sign_in', { method: 'email' })
    expect(provider.screen).toHaveBeenCalledWith('/notes')
  })
})
