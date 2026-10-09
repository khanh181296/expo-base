import { useTranslation } from 'react-i18next'

import { Text } from '@/components/ui'
import { AuthFooter, AuthScreen, SignUpForm, SocialButtons } from '@/features/auth'
import { Env } from '@/lib/env'

export default function SignUpScreen() {
  const { t } = useTranslation()

  return (
    <AuthScreen title={t('auth.signUpTitle')} subtitle={t('auth.signUpSubtitle')}>
      <SignUpForm />
      <SocialButtons />
      <AuthFooter
        question={t('auth.haveAccount')}
        linkLabel={t('auth.signInLink')}
        href="/sign-in"
      />
      {Env.USE_MOCK_API && (
        <Text variant="caption" tone="muted" className="text-center">
          {t('auth.mockSignUpHint')}
        </Text>
      )}
    </AuthScreen>
  )
}
