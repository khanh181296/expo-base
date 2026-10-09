import { api } from '@/lib/api'

export type AppConfig = {
  /** Builds below this version must update from the store */
  minVersion: string
  maintenance: boolean
  maintenanceMessage?: string
  storeUrl: { ios: string; android: string }
}

export const appConfigApi = {
  get: () => api.get<AppConfig>('/app/config', { skipAuth: true }).then((res) => res.data),
}
