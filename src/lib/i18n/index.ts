import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next, useTranslation } from 'react-i18next'

import { kvStorage, STORAGE_KEYS } from '@/lib/storage'

import { FALLBACK_LANGUAGE, isSupportedLanguage, type Language, resources } from './resources'

function detectLanguage(): Language {
  const saved = kvStorage.getString(STORAGE_KEYS.language)
  if (isSupportedLanguage(saved)) return saved
  const device = getLocales()[0]?.languageCode
  return isSupportedLanguage(device) ? device : FALLBACK_LANGUAGE
}

// Resources are bundled, so init resolves synchronously before the first render.
void i18n.use(initReactI18next).init({
  resources,
  lng: detectLanguage(),
  fallbackLng: FALLBACK_LANGUAGE,
  interpolation: { escapeValue: false },
})

export function changeLanguage(language: Language) {
  kvStorage.setString(STORAGE_KEYS.language, language)
  return i18n.changeLanguage(language)
}

export function useLanguage() {
  const { i18n: instance } = useTranslation()
  return {
    language: (isSupportedLanguage(instance.resolvedLanguage)
      ? instance.resolvedLanguage
      : FALLBACK_LANGUAGE) as Language,
    changeLanguage,
  }
}

export { i18n }
export * from './resources'
