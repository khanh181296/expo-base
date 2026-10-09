import { zodResolver } from '@hookform/resolvers/zod'
import { LogIn } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { toast } from '@/components/feedback'
import { Button, FormInput } from '@/components/ui'
import { getErrorMessage } from '@/lib/api'

import { useSignIn } from '../hooks'
import { signInSchema, type SignInValues } from '../schemas'

export function SignInForm() {
  const { t } = useTranslation()
  const signIn = useSignIn()
  const { control, handleSubmit, setFocus } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = handleSubmit((values) =>
    signIn.mutate(values, {
      onError: (error) => toast.error(getErrorMessage(error, t)),
    }),
  )

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
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('password')}
      />
      <FormInput
        control={control}
        name="password"
        label={t('auth.password')}
        placeholder={t('auth.passwordPlaceholder')}
        secureTextEntry
        autoComplete="current-password"
        textContentType="password"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
      <Button
        className="mt-2"
        label={t('auth.signIn')}
        icon={LogIn}
        loading={signIn.isPending}
        onPress={onSubmit}
      />
    </View>
  )
}
