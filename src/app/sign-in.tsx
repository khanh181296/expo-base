import { useTranslation } from 'react-i18next'

import { Text } from '@/components/ui'
import { AuthFooter, AuthScreen, SignInForm } from '@/features/auth'
import { Env } from '@/lib/env'

export default function SignInScreen() {
  const { t } = useTranslation()

  return (
    <AuthScreen title={t('auth.signInTitle')} subtitle={t('auth.signInSubtitle')}>
      <SignInForm />
      <AuthFooter question={t('auth.noAccount')} linkLabel={t('auth.signUpLink')} href="/sign-up" />
      {Env.USE_MOCK_API && (
        <Text variant="caption" tone="muted" className="text-center">
          {t('auth.mockHint')}
        </Text>
      )}
    </AuthScreen>
  )
}
