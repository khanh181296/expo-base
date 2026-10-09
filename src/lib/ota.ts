import * as Updates from 'expo-updates'
import { useEffect } from 'react'
import { AppState } from 'react-native'

import { dialog } from '@/components/feedback'
import { i18n } from '@/lib/i18n'
import { captureError } from '@/lib/monitoring'

let checking = false

async function checkForUpdate() {
  if (checking || !Updates.isEnabled || __DEV__) return
  checking = true
  try {
    const { isAvailable } = await Updates.checkForUpdateAsync()
    if (!isAvailable) return
    await Updates.fetchUpdateAsync()
    const restart = await dialog.confirm({
      title: i18n.t('ota.title'),
      message: i18n.t('ota.message'),
      confirmLabel: i18n.t('ota.restart'),
      cancelLabel: i18n.t('ota.later'),
    })
    // Declined updates apply on the next cold start.
    if (restart) await Updates.reloadAsync()
  } catch (error) {
    captureError(error, { scope: 'ota' })
  } finally {
    checking = false
  }
}

/** Check for an EAS Update on launch and whenever the app returns to the foreground. */
export function useOtaUpdates() {
  useEffect(() => {
    void checkForUpdate()
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void checkForUpdate()
    })
    return () => subscription.remove()
  }, [])
}
