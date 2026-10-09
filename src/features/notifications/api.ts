import { Platform } from 'react-native'

import { api } from '@/lib/api'

export const devicesApi = {
  register: (token: string) =>
    api.post<void>('/devices', { token, platform: Platform.OS }).then(() => undefined),
  unregister: (token: string) =>
    api.delete<void>(`/devices/${encodeURIComponent(token)}`).then(() => undefined),
}
