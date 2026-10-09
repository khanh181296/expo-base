import * as SecureStore from 'expo-secure-store'

/** Keychain / Keystore backed storage for secrets (tokens, credentials). */
export const secureStorage = {
  async getJSON<T>(key: string): Promise<T | null> {
    const raw = await SecureStore.getItemAsync(key)
    if (raw == null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      await SecureStore.deleteItemAsync(key)
      return null
    }
  },
  setJSON: (key: string, value: unknown) =>
    SecureStore.setItemAsync(key, JSON.stringify(value), {
      keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
    }),
  remove: (key: string) => SecureStore.deleteItemAsync(key),
}
