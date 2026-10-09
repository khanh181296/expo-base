import { createMMKV } from 'react-native-mmkv'
import type { StateStorage } from 'zustand/middleware'

/** Fast, synchronous, unencrypted storage. Never put secrets here, use `secureStorage`. */
export const kv = createMMKV({ id: 'app' })

export const kvStorage = {
  getString: (key: string) => kv.getString(key),
  setString: (key: string, value: string) => kv.set(key, value),
  getJSON<T>(key: string): T | null {
    const raw = kv.getString(key)
    if (raw == null) return null
    try {
      return JSON.parse(raw) as T
    } catch {
      kv.remove(key)
      return null
    }
  },
  setJSON: (key: string, value: unknown) => kv.set(key, JSON.stringify(value)),
  remove: (key: string) => kv.remove(key),
}

/** Adapter for zustand `persist` */
export const zustandStorage: StateStorage = {
  getItem: (name) => kv.getString(name) ?? null,
  setItem: (name, value) => kv.set(name, value),
  removeItem: (name) => {
    kv.remove(name)
  },
}
