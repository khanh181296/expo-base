import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import { Platform } from 'react-native'

import { kvStorage } from '@/lib/storage'

const TOKEN_KEY = 'push.token'

export const isPushSupported = Platform.OS !== 'web' && Device.isDevice

/** How notifications look while the app is open. Runs once at import. */
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  })
}

export async function getPermissionStatus() {
  if (!isPushSupported) return 'unsupported' as const
  const { status } = await Notifications.getPermissionsAsync()
  return status
}

/** Ask for permission (only prompts once per install) and return the Expo push token. */
export async function obtainPushToken({ prompt }: { prompt: boolean }) {
  if (!isPushSupported) return null

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.DEFAULT,
    })
  }

  let { status } = await Notifications.getPermissionsAsync()
  if (status !== 'granted' && prompt) {
    status = (await Notifications.requestPermissionsAsync()).status
  }
  if (status !== 'granted') return null

  const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined
  if (!projectId) {
    console.warn('Push: set EAS_PROJECT_ID to receive push tokens')
    return null
  }
  const { data } = await Notifications.getExpoPushTokenAsync({ projectId })
  return data
}

export const pushTokenStore = {
  get: () => kvStorage.getString(TOKEN_KEY) ?? null,
  set: (token: string) => kvStorage.setString(TOKEN_KEY, token),
  clear: () => kvStorage.remove(TOKEN_KEY),
}
