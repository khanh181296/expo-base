import * as SecureStore from 'expo-secure-store'

import { kv } from '@/lib/storage'

import { useAuthStore } from './store'
import { tokenStore } from './token-store'

const session = {
  user: { id: '1', email: 'a@b.co', name: 'a' },
  tokens: { accessToken: 'access', refreshToken: 'refresh' },
}

describe('auth store', () => {
  it('signIn keeps tokens in secure storage, not in the persisted state', async () => {
    await useAuthStore.getState().signIn(session)

    expect(useAuthStore.getState()).toMatchObject({ status: 'signedIn', user: session.user })
    expect(tokenStore.get()).toEqual(session.tokens)
    expect(SecureStore.setItemAsync).toHaveBeenCalled()
    expect(
      JSON.stringify(useAuthStore.persist.getOptions().partialize?.(useAuthStore.getState())),
    ).not.toContain('access')
  })

  it('a fresh install drops tokens left in the Keychain by a previous install', async () => {
    await SecureStore.setItemAsync('auth.tokens', JSON.stringify(session.tokens))
    kv.remove('app.installed')

    expect(await tokenStore.load()).toBeNull()
  })

  it('hydrate restores the session from secure storage', async () => {
    await useAuthStore.getState().signIn(session)
    useAuthStore.setState({ status: 'loading' })

    await useAuthStore.getState().hydrate()

    expect(useAuthStore.getState().status).toBe('signedIn')
  })

  it('signOut clears tokens and user', async () => {
    await useAuthStore.getState().signIn(session)
    await useAuthStore.getState().signOut()

    expect(useAuthStore.getState()).toMatchObject({ status: 'signedOut', user: null })
    expect(await tokenStore.load()).toBeNull()
  })
})
