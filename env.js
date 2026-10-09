/**
 * Build-time env loader. Only required by app.config.ts (Node), never by app code.
 * Select the environment with APP_ENV=development|staging|production.
 * App code reads the validated client values through `@/lib/env`.
 */
const path = require('node:path')

const { config } = require('dotenv')
const { z } = require('zod')

const APP_ENVS = /** @type {const} */ (['development', 'staging', 'production'])

const appEnv = z.enum(APP_ENVS).parse(process.env.APP_ENV ?? 'development')

// The selected file wins over anything Expo CLI may have loaded on its own.
config({ path: path.resolve(__dirname, `.env.${appEnv}`), override: true, quiet: true })

const booleanString = z
  .enum(['true', 'false'])
  .default('false')
  .transform((value) => value === 'true')

const clientSchema = z.object({
  APP_ENV: z.enum(APP_ENVS),
  API_URL: z.url(),
  API_TIMEOUT_MS: z.coerce.number().int().positive().default(15000),
  USE_MOCK_API: booleanString,
  SENTRY_DSN: z.union([z.url(), z.literal('')]).default(''),
  FIREBASE_ENABLED: z.boolean(),
})

const buildTimeSchema = z.object({
  EAS_PROJECT_ID: z.string().optional(),
  EXPO_ACCOUNT_OWNER: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),
  GOOGLE_SERVICES_JSON: z.string().optional(),
  GOOGLE_SERVICE_INFO_PLIST: z.string().optional(),
})

/**
 * @template {z.ZodType} T
 * @param {T} schema
 * @param {unknown} input
 * @returns {z.infer<T>}
 */
function parse(schema, input) {
  const result = schema.safeParse(input)
  if (!result.success) {
    throw new Error(`Invalid .env.${appEnv}:\n${z.prettifyError(result.error)}`)
  }
  return result.data
}

/** @typedef {z.infer<typeof clientSchema>} ClientEnv */

/** @type {ClientEnv} */
const clientEnv = parse(clientSchema, {
  APP_ENV: appEnv,
  API_URL: process.env.API_URL,
  API_TIMEOUT_MS: process.env.API_TIMEOUT_MS,
  USE_MOCK_API: process.env.USE_MOCK_API,
  SENTRY_DSN: process.env.SENTRY_DSN,
  // Firebase is on when both platform files are configured.
  FIREBASE_ENABLED: Boolean(
    process.env.GOOGLE_SERVICES_JSON && process.env.GOOGLE_SERVICE_INFO_PLIST,
  ),
})

const buildTimeEnv = parse(buildTimeSchema, {
  EAS_PROJECT_ID: process.env.EAS_PROJECT_ID || undefined,
  EXPO_ACCOUNT_OWNER: process.env.EXPO_ACCOUNT_OWNER || undefined,
  SENTRY_ORG: process.env.SENTRY_ORG || undefined,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT || undefined,
  // Paths to the Firebase files. On EAS use file environment variables with these names.
  GOOGLE_SERVICES_JSON: process.env.GOOGLE_SERVICES_JSON || undefined,
  GOOGLE_SERVICE_INFO_PLIST: process.env.GOOGLE_SERVICE_INFO_PLIST || undefined,
})

/** Static app identity. Non-production builds get a suffix so all variants install side by side. */
const BASE = {
  name: 'Expo Base',
  slug: 'expo-base',
  scheme: 'expobase',
  bundleId: 'com.example.expobase',
}

const VARIANTS = {
  development: { id: '.dev', name: ' (DEV)' },
  staging: { id: '.staging', name: ' (STG)' },
  production: { id: '', name: '' },
}

const variant = VARIANTS[appEnv]

const appIdentity = {
  name: `${BASE.name}${variant.name}`,
  slug: BASE.slug,
  scheme: `${BASE.scheme}${variant.id.replace('.', '-')}`,
  bundleId: `${BASE.bundleId}${variant.id}`,
}

module.exports = { APP_ENVS, appEnv, appIdentity, buildTimeEnv, clientEnv }
