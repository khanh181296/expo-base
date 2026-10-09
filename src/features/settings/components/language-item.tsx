import { Languages } from 'lucide-react-native'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { ListItem, Sheet, type SheetRef } from '@/components/ui'
import { LANGUAGES, useLanguage } from '@/lib/i18n'

export function LanguageItem() {
  const { t } = useTranslation()
  const { language, changeLanguage } = useLanguage()
  const sheetRef = useRef<SheetRef>(null)
  const current = LANGUAGES.find((item) => item.code === language)

  return (
    <>
      <ListItem
        icon={Languages}
        title={t('settings.language')}
        value={current?.label}
        onPress={() => sheetRef.current?.present()}
      />
      <Sheet ref={sheetRef} title={t('settings.language')}>
        {LANGUAGES.map((item) => (
          <ListItem
            key={item.code}
            title={item.label}
            onPress={() => {
              void changeLanguage(item.code)
              sheetRef.current?.dismiss()
            }}
            selected={item.code === language}
          />
        ))}
      </Sheet>
    </>
  )
}
