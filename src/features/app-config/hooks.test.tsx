import { renderHook, waitFor } from '@testing-library/react-native'

import { createQueryWrapper } from '@/test-utils'

import { appConfigApi } from './api'
import { useAppGate } from './hooks'

jest.mock('expo-application', () => ({ nativeApplicationVersion: '1.2.0' }))
jest.mock('./api', () => ({ appConfigApi: { get: jest.fn() } }))

const get = jest.mocked(appConfigApi.get)
const storeUrl = { ios: 'ios', android: 'android' }

const gateFor = async (config: Awaited<ReturnType<typeof appConfigApi.get>>) => {
  get.mockResolvedValue(config)
  const { wrapper } = createQueryWrapper()
  const { result } = await renderHook(() => useAppGate(), { wrapper })
  await waitFor(() => expect(result.current.config).toBeDefined())
  return result.current.gate
}

describe('useAppGate', () => {
  it('lets supported versions through', async () => {
    expect(await gateFor({ minVersion: '1.2.0', maintenance: false, storeUrl })).toBe('ok')
  })

  it('requires an update below minVersion', async () => {
    expect(await gateFor({ minVersion: '1.10.0', maintenance: false, storeUrl })).toBe(
      'updateRequired',
    )
  })

  it('maintenance wins over everything', async () => {
    expect(await gateFor({ minVersion: '9.0.0', maintenance: true, storeUrl })).toBe('maintenance')
  })
})
