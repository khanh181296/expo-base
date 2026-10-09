import { useMutation, useQuery } from '@tanstack/react-query'

import { analytics } from '@/lib/analytics'

import { authApi } from './api'
import { useAuthStore } from './store'
import { tokenStore } from './token-store'

export const authKeys = {
  all: ['auth'] as const,
  me: () => [...authKeys.all, 'me'] as const,
}

export function useSignIn() {
  const signIn = useAuthStore((state) => state.signIn)
  return useMutation({
    mutationFn: authApi.signIn,
    onSuccess: async (response) => {
      await signIn(response)
      analytics.track({ name: 'sign_in', method: 'email' })
    },
  })
}

export function useSignUp() {
  const signIn = useAuthStore((state) => state.signIn)
  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: async (response) => {
      await signIn(response)
      analytics.track({ name: 'sign_up', method: 'email' })
    },
  })
}

export function useForgotPassword() {
  return useMutation({ mutationFn: authApi.forgotPassword })
}

export function useSignOut() {
  const signOut = useAuthStore((state) => state.signOut)
  return useMutation({
    mutationFn: async () => {
      const refreshToken = tokenStore.get()?.refreshToken
      // Best effort: the local session is cleared even if the server call fails.
      if (refreshToken) await authApi.signOut(refreshToken).catch(() => undefined)
    },
    onSettled: async () => {
      analytics.track({ name: 'sign_out' })
      await signOut()
    },
  })
}

/** Keeps the cached profile fresh while signed in. */
export function useMe() {
  const status = useAuthStore((state) => state.status)
  const setUser = useAuthStore((state) => state.setUser)
  return useQuery({
    queryKey: authKeys.me(),
    queryFn: async () => {
      const user = await authApi.me()
      setUser(user)
      return user
    },
    enabled: status === 'signedIn',
  })
}
