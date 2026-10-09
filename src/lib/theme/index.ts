import { DarkTheme, DefaultTheme, type Theme } from 'expo-router'
import { colorScheme, useColorScheme } from 'nativewind'
import { useMemo } from 'react'
import { useMMKVString } from 'react-native-mmkv'

import { kv, kvStorage, STORAGE_KEYS } from '@/lib/storage'

import { type ColorSchemeName, getColors } from './palette'

export * from './palette'

export const COLOR_SCHEME_PREFERENCES = ['system', 'light', 'dark'] as const
export type ColorSchemePreference = (typeof COLOR_SCHEME_PREFERENCES)[number]

const isPreference = (value: unknown): value is ColorSchemePreference =>
  COLOR_SCHEME_PREFERENCES.includes(value as ColorSchemePreference)

/** Apply the saved preference. Call once at startup, before the first render. */
export function loadColorSchemePreference() {
  const saved = kvStorage.getString(STORAGE_KEYS.colorScheme)
  colorScheme.set(isPreference(saved) ? saved : 'system')
}

export function useColorSchemePreference() {
  const [saved, setSaved] = useMMKVString(STORAGE_KEYS.colorScheme, kv)
  const preference: ColorSchemePreference = isPreference(saved) ? saved : 'system'

  const setPreference = (value: ColorSchemePreference) => {
    setSaved(value)
    colorScheme.set(value)
  }

  return { preference, setPreference }
}

/** Resolved color values for places that cannot use className (icons, navigation, native props). */
export function useThemeColors() {
  const { colorScheme: scheme } = useColorScheme()
  const resolved: ColorSchemeName = scheme === 'dark' ? 'dark' : 'light'
  return useMemo(() => ({ scheme: resolved, colors: getColors(resolved) }), [resolved])
}

export function useNavigationTheme(): Theme {
  const { scheme, colors } = useThemeColors()
  return useMemo(() => {
    const base = scheme === 'dark' ? DarkTheme : DefaultTheme
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: colors.primary,
        background: colors.background,
        card: colors.card,
        text: colors.foreground,
        border: colors.border,
        notification: colors.destructive,
      },
    }
  }, [scheme, colors])
}
