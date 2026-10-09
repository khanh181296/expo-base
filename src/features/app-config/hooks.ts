import { useQuery } from '@tanstack/react-query'
import * as Application from 'expo-application'

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
  const version = Application.nativeApplicationVersion ?? '0.0.0'

  let gate: AppGate = 'ok'
  if (config?.maintenance) gate = 'maintenance'
  else if (config && compareVersions(version, config.minVersion) < 0) gate = 'updateRequired'

  return { gate, config, retry: query.refetch }
}
