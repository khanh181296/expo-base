import { useQuery } from '@tanstack/react-query'
import * as Application from 'expo-application'
import Constants from 'expo-constants'

import { compareVersions } from '@/lib/utils'

import { appConfigApi } from './api'

export type AppGate = 'ok' | 'updateRequired' | 'maintenance'

/** Remote kill switch: forced update and maintenance mode. Fails open when the config is unreachable. */
export function useAppGate() {
  const query = useQuery({
    queryKey: ['app-config'],
    queryFn: appConfigApi.get,
    staleTime: 5 * 60_000,
    refetchInterval: 15 * 60_000,
  })

  const config = query.data
  // Web has no native version; fall back to the app config version. Unknown never blocks.
  const version = Application.nativeApplicationVersion ?? Constants.expoConfig?.version

  let gate: AppGate = 'ok'
  if (config?.maintenance) gate = 'maintenance'
  else if (config && version && compareVersions(version, config.minVersion) < 0) {
    gate = 'updateRequired'
  }

  return { gate, config, retry: query.refetch }
}
