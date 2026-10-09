import { zodResolver } from '@hookform/resolvers/zod'
import { UserPlus } from 'lucide-react-native'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import { toast } from '@/components/feedback'
import { Button, FormInput } from '@/components/ui'
import { getErrorMessage } from '@/lib/api'

import { useSignUp } from '../hooks'
import { signUpSchema, type SignUpValues } from '../schemas'

export function SignUpForm() {
  const { t } = useTranslation()
  const signUp = useSignUp()
  const { control, handleSubmit, setFocus } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  const onSubmit = handleSubmit(({ name, email, password }) =>
    signUp.mutate(
      { name, email, password },
      { onError: (error) => toast.error(getErrorMessage(error, t)) },
    ),
  )

  return (
    <View className="gap-4">
      <FormInput
        control={control}
        name="name"
        label={t('auth.name')}
        placeholder={t('auth.namePlaceholder')}
        autoComplete="name"
        textContentType="name"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('email')}
      />
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
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="next"
        submitBehavior="submit"
        onSubmitEditing={() => setFocus('confirmPassword')}
      />
      <FormInput
        control={control}
        name="confirmPassword"
        label={t('auth.confirmPassword')}
        placeholder={t('auth.confirmPasswordPlaceholder')}
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
      <Button
        className="mt-2"
        label={t('auth.signUp')}
        icon={UserPlus}
        loading={signUp.isPending}
        onPress={onSubmit}
      />
    </View>
  )
}
