import { kvStorage, secureStorage, STORAGE_KEYS } from '@/lib/storage'

import type { AuthTokens } from './types'

/**
 * Tokens live in the Keychain/Keystore, with an in-memory copy so the
 * axios interceptor can read them synchronously.
 */
let cache: AuthTokens | null = null

export const tokenStore = {
  get: () => cache,

  async load() {
    // iOS keeps Keychain items after the app is deleted. MMKV does not survive a reinstall,
    // so a missing marker means a fresh install: drop any session left by a previous install.
    if (!kvStorage.getString(STORAGE_KEYS.installMarker)) {
      await secureStorage.remove(STORAGE_KEYS.authTokens).catch(() => undefined)
      kvStorage.setString(STORAGE_KEYS.installMarker, '1')
    }
    cache = await secureStorage.getJSON<AuthTokens>(STORAGE_KEYS.authTokens)
    return cache
  },

  async set(tokens: AuthTokens) {
    cache = tokens
    await secureStorage.setJSON(STORAGE_KEYS.authTokens, tokens)
  },

  async clear() {
    cache = null
    await secureStorage.remove(STORAGE_KEYS.authTokens)
  },
}
