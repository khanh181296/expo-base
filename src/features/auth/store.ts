import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { queryClient } from '@/lib/api'
import { STORAGE_KEYS, zustandStorage } from '@/lib/storage'

import { tokenStore } from './token-store'
import type { SignInResponse, User } from './types'

export type AuthStatus = 'loading' | 'signedIn' | 'signedOut'

type AuthState = {
  status: AuthStatus
  user: User | null
  hydrate: () => Promise<void>
  signIn: (response: SignInResponse) => Promise<void>
  signOut: () => Promise<void>
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: 'loading',
      user: null,

      hydrate: async () => {
        const tokens = await tokenStore.load().catch(() => null)
        set(tokens ? { status: 'signedIn' } : { status: 'signedOut', user: null })
      },

      signIn: async ({ user, tokens }) => {
        await tokenStore.set(tokens)
        set({ status: 'signedIn', user })
      },

      signOut: async () => {
        await tokenStore.clear()
        queryClient.clear()
        set({ status: 'signedOut', user: null })
      },

      setUser: (user) => set({ user }),
    }),
    {
      name: STORAGE_KEYS.authStore,
      storage: createJSONStorage(() => zustandStorage),
      // Only the profile is cached in MMKV; tokens stay in secure storage.
      partialize: (state) => ({ user: state.user }),
    },
  ),
)
