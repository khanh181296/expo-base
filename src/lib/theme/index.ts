import { DarkTheme, DefaultTheme, type Theme } from 'expo-router'
import { colorScheme, useColorScheme } from 'nativewind'
import { useEffect, useMemo } from 'react'
import { Appearance, Platform } from 'react-native'
import { useMMKVString } from 'react-native-mmkv'

import { kv, kvStorage, STORAGE_KEYS } from '@/lib/storage'

import { type ColorSchemeName, getColors } from './palette'

export * from './palette'

export const COLOR_SCHEME_PREFERENCES = ['system', 'light', 'dark'] as const
export type ColorSchemePreference = (typeof COLOR_SCHEME_PREFERENCES)[number]

const isPreference = (value: unknown): value is ColorSchemePreference =>
  COLOR_SCHEME_PREFERENCES.includes(value as ColorSchemePreference)

function applyColorScheme(preference: ColorSchemePreference) {
  // Web toggles a `dark` class, so "system" has to be resolved to a concrete scheme there.
  if (Platform.OS === 'web' && preference === 'system') {
    colorScheme.set(Appearance.getColorScheme() === 'dark' ? 'dark' : 'light')
    return
  }
  colorScheme.set(preference)
}

const readPreference = (): ColorSchemePreference => {
  const saved = kvStorage.getString(STORAGE_KEYS.colorScheme)
  return isPreference(saved) ? saved : 'system'
}

/** Apply the saved preference on native. Call once at startup, before the first render. */
export function loadColorSchemePreference() {
  if (Platform.OS !== 'web') applyColorScheme(readPreference())
}

/**
 * Web only: NativeWind registers its dark mode flag when the stylesheet loads and resets
 * the scheme at that point, so the preference is applied after mount and re-applied
 * when the OS theme changes while following the system.
 */
export function useWebColorSchemeSync() {
  useEffect(() => {
    if (Platform.OS !== 'web') return
    applyColorScheme(readPreference())
    const subscription = Appearance.addChangeListener(() => {
      if (readPreference() === 'system') applyColorScheme('system')
    })
    return () => subscription.remove()
  }, [])
}

export function useColorSchemePreference() {
  const [saved, setSaved] = useMMKVString(STORAGE_KEYS.colorScheme, kv)
  const preference: ColorSchemePreference = isPreference(saved) ? saved : 'system'

  const setPreference = (value: ColorSchemePreference) => {
    setSaved(value)
    applyColorScheme(value)
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
