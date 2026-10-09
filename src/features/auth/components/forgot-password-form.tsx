import { zodResolver } from '@hookform/resolvers/zod'
import { MailCheck, Send } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { toast } from '@/components/feedback'
import { Button, Card, FormInput, Icon, Text } from '@/components/ui'
import { getErrorMessage } from '@/lib/api'

import { useForgotPassword } from '../hooks'
import { forgotPasswordSchema, type ForgotPasswordValues } from '../schemas'

export function ForgotPasswordForm() {
  const { t } = useTranslation()
  const forgotPassword = useForgotPassword()
  const { control, handleSubmit } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = handleSubmit(({ email }) =>
    forgotPassword.mutate(email, {
      onError: (error) => toast.error(getErrorMessage(error, t)),
    }),
  )

  if (forgotPassword.isSuccess) {
    return (
      <Card className="items-center gap-3 p-6">
        <Icon as={MailCheck} size={40} color="success" />
        <Text variant="h3">{t('auth.resetSentTitle')}</Text>
        <Text tone="muted" className="text-center">
          {t('auth.resetSentMessage', { email: forgotPassword.variables })}
        </Text>
      </Card>
    )
  }

  return (
    <View className="gap-4">
      <FormInput
        control={control}
        name="email"
        label={t('auth.email')}
        placeholder={t('auth.emailPlaceholder')}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        returnKeyType="send"
        onSubmitEditing={onSubmit}
      />
      <Button
        className="mt-2"
        label={t('auth.sendResetLink')}
        icon={Send}
        loading={forgotPassword.isPending}
        onPress={onSubmit}
      />
    </View>
  )
}
