import en from '@/translations/en.json'
import vi from '@/translations/vi.json'

export const resources = {
  en: { translation: en },
  vi: { translation: vi },
} as const

export type Language = keyof typeof resources

export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
]

export const FALLBACK_LANGUAGE: Language = 'en'

export const isSupportedLanguage = (code: unknown): code is Language =>
  typeof code === 'string' && code in resources
