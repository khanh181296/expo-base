import Constants from 'expo-constants'

// eslint-disable-next-line no-restricted-imports -- env.js lives at the project root
import type { ClientEnv } from '../../env'

const env = Constants.expoConfig?.extra?.env as ClientEnv | undefined

if (!env) {
  throw new Error('Missing `extra.env` in app config. Did app.config.ts load env.ts?')
}

export const Env: Readonly<ClientEnv> = Object.freeze(env)

export const isDev = Env.APP_ENV === 'development'
export const isStaging = Env.APP_ENV === 'staging'
export const isProduction = Env.APP_ENV === 'production'
