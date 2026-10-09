import { setAuthHandlers } from '@/lib/api'

import { authApi } from './api'
import { useAuthStore } from './store'
import { tokenStore } from './token-store'

/** Connect the API client to the auth session. Call once at startup. */
export function registerAuthSession() {
  setAuthHandlers({
    getAccessToken: () => tokenStore.get()?.accessToken ?? null,

    refreshAccessToken: async () => {
      const refreshToken = tokenStore.get()?.refreshToken
      if (!refreshToken) return null
      const tokens = await authApi.refresh(refreshToken)
      await tokenStore.set(tokens)
      return tokens.accessToken
    },

    onSessionExpired: () => {
      if (useAuthStore.getState().status === 'signedIn') {
        void useAuthStore.getState().signOut()
      }
    },
  })

  return useAuthStore.getState().hydrate()
}
