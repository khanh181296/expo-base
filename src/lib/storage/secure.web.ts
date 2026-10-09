/**
 * Web has no Keychain/Keystore. localStorage keeps the same API for previews;
 * a production web app should use httpOnly cookies instead.
 */
export const secureStorage = {
  async getJSON<T>(key: string): Promise<T | null> {
    const raw = globalThis.localStorage?.getItem(key)
    if (raw == null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      globalThis.localStorage?.removeItem(key)
      return null
    }
  },
  async setJSON(key: string, value: unknown) {
    globalThis.localStorage?.setItem(key, JSON.stringify(value))
  },
  async remove(key: string) {
    globalThis.localStorage?.removeItem(key)
  },
}
