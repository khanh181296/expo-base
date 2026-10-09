jest.mock('expo-constants', () => ({
  __esModule: true,
  default: {
    expoConfig: {
      extra: {
        env: {
          APP_ENV: 'development',
          API_URL: 'https://api.test',
          API_TIMEOUT_MS: 1000,
          USE_MOCK_API: false,
        },
      },
    },
  },
}))

jest.mock('react-native-mmkv', () => {
  const store = new Map<string, string | number | boolean>()
  const mmkv = {
    set: (key: string, value: string | number | boolean) => store.set(key, value),
    getString: (key: string) => store.get(key) as string | undefined,
    getBoolean: (key: string) => store.get(key) as boolean | undefined,
    getNumber: (key: string) => store.get(key) as number | undefined,
    contains: (key: string) => store.has(key),
    remove: (key: string) => store.delete(key),
    clearAll: () => store.clear(),
    getAllKeys: () => [...store.keys()],
    addOnValueChangedListener: () => ({ remove: () => undefined }),
  }
  return {
    createMMKV: () => mmkv,
    useMMKVString: (key: string) => [store.get(key), (value: string) => store.set(key, value)],
  }
})

jest.mock('expo-secure-store', () => {
  const store = new Map<string, string>()
  return {
    AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 0,
    getItemAsync: jest.fn(async (key: string) => store.get(key) ?? null),
    setItemAsync: jest.fn(async (key: string, value: string) => void store.set(key, value)),
    deleteItemAsync: jest.fn(async (key: string) => void store.delete(key)),
  }
})

jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock.js'),
)

jest.mock('react-native-keyboard-controller', () =>
  require('react-native-keyboard-controller/jest'),
)
