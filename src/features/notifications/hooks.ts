import { useCallback, useEffect, useState } from 'react'
import { AppState } from 'react-native'

import { useAuthStore } from '@/features/auth'
import { captureError } from '@/lib/monitoring'

import { devicesApi } from './api'
import { getPermissionStatus, isPushSupported, obtainPushToken, pushTokenStore } from './push'

async function syncToken(prompt: boolean) {
  const token = await obtainPushToken({ prompt })
  if (!token || token === pushTokenStore.get()) return token
  await devicesApi.register(token)
  pushTokenStore.set(token)
  return token
}

/** Silently registers the device after sign-in when permission was already granted. */
export function usePushRegistration() {
  const status = useAuthStore((state) => state.status)

  useEffect(() => {
    if (status !== 'signedIn' || !isPushSupported) return
    syncToken(false).catch((error) => captureError(error, { scope: 'push' }))
  }, [status])
}

/** For a settings toggle: current permission and a function that asks for it. */
export function usePushPermission() {
  const [status, setStatus] = useState<Awaited<ReturnType<typeof getPermissionStatus>>>()

  const refresh = useCallback(() => {
    void getPermissionStatus().then(setStatus)
  }, [])

  useEffect(() => {
    refresh()
    // The user may change it in system settings while the app is in background.
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') refresh()
    })
    return () => subscription.remove()
  }, [refresh])

  const request = useCallback(async () => {
    await syncToken(true).catch((error) => captureError(error, { scope: 'push' }))
    refresh()
  }, [refresh])

  return { status, request }
}

export async function unregisterPushToken() {
  const token = pushTokenStore.get()
  if (!token) return
  pushTokenStore.clear()
  await devicesApi.unregister(token).catch(() => undefined)
}
