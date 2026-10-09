import { SegmentedControl } from '@/components/ui'
import { LANGUAGES, useLanguage } from '@/lib/i18n'

const OPTIONS = LANGUAGES.map(({ code }) => ({ value: code, label: code.toUpperCase() }))

/** Compact VI | EN toggle for screens without the settings tab */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { language, changeLanguage } = useLanguage()
  return (
    <SegmentedControl
      className={className}
      options={OPTIONS}
      value={language}
      onChange={(code) => void changeLanguage(code)}
    />
  )
}
