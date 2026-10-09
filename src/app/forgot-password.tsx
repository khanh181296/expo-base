import { useTranslation } from 'react-i18next'

import { TextLink } from '@/components/ui'
import { AuthScreen, ForgotPasswordForm } from '@/features/auth'

export default function ForgotPasswordScreen() {
  const { t } = useTranslation()

  return (
    <AuthScreen title={t('auth.forgotTitle')} subtitle={t('auth.forgotSubtitle')}>
      <ForgotPasswordForm />
      <TextLink href="/sign-in" replace className="self-center">
        {t('auth.backToSignIn')}
      </TextLink>
    </AuthScreen>
  )
}
