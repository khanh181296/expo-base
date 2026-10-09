import * as Notifications from 'expo-notifications'
import { type Href, router } from 'expo-router'
import { useEffect } from 'react'

/** Opens `data.url` (an app route like "/notes/123") when a notification is tapped. */
export function useNotificationNavigation() {
  const response = Notifications.useLastNotificationResponse()

  useEffect(() => {
    const url = response?.notification.request.content.data?.url
    if (typeof url === 'string' && url.startsWith('/')) router.push(url as Href)
  }, [response])
}
