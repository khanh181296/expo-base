import { useMutation, useQuery } from '@tanstack/react-query'

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
    onSuccess: signIn,
  })
}

export function useSignUp() {
  const signIn = useAuthStore((state) => state.signIn)
  return useMutation({
    mutationFn: authApi.signUp,
    onSuccess: signIn,
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
    onSettled: signOut,
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
