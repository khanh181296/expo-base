import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Platform, Pressable, View } from 'react-native'

import { toast } from '@/components/feedback'
import { Divider, Spinner, Text } from '@/components/ui'
import { getErrorMessage } from '@/lib/api'
import { useThemeColors } from '@/lib/theme'

import { useSocialSignIn } from '../hooks'
import { getSocialAvailability } from '../social/providers'
import type { SocialProvider } from '../social/types'
import { GoogleLogo } from './google-logo'

/** "or" divider + provider buttons. Renders nothing when no provider is available. */
export function SocialButtons() {
  const { t } = useTranslation()
  const socialSignIn = useSocialSignIn()
  const { data: availability } = useQuery({
    queryKey: ['auth', 'social-availability'],
    queryFn: getSocialAvailability,
    staleTime: Infinity,
  })

  if (!availability?.google && !availability?.apple) return null

  const signIn = (provider: SocialProvider) =>
    socialSignIn.mutate(provider, {
      onError: (error) => toast.error(getErrorMessage(error, t)),
    })

  const pending = socialSignIn.isPending ? socialSignIn.variables : undefined

  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <Divider className="flex-1" />
        <Text variant="caption" tone="muted">
          {t('auth.or')}
        </Text>
        <Divider className="flex-1" />
      </View>
      {availability.apple && (
        <AppleButton
          label={t('auth.continueWithApple')}
          loading={pending === 'apple'}
          disabled={socialSignIn.isPending}
          onPress={() => signIn('apple')}
        />
      )}
      {availability.google && (
        <ProviderButton
          testID="sign-in-google"
          label={t('auth.continueWithGoogle')}
          icon={<GoogleLogo />}
          loading={pending === 'google'}
          disabled={socialSignIn.isPending}
          onPress={() => signIn('google')}
        />
      )}
    </View>
  )
}

type ProviderButtonProps = {
  label: string
  icon: React.ReactNode
  loading: boolean
  disabled: boolean
  onPress: () => void
  testID?: string
  className?: string
  textClassName?: string
}

function ProviderButton({
  label,
  icon,
  loading,
  disabled,
  onPress,
  testID,
  className = 'border border-border bg-background',
  textClassName,
}: ProviderButtonProps) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled, busy: loading }}
      disabled={disabled}
      onPress={onPress}
      className={`h-12 flex-row items-center justify-center gap-3 rounded active:opacity-80 ${className} ${disabled ? 'opacity-60' : ''}`}
    >
      {loading ? <Spinner size="small" color="foreground" /> : icon}
      <Text variant="label" className={textClassName}>
        {label}
      </Text>
    </Pressable>
  )
}

/** Apple's HIG requires the black/white Apple button; this mirrors it with the Apple logo glyph. */
function AppleButton(props: Omit<ProviderButtonProps, 'icon'>) {
  const { scheme } = useThemeColors()
  const dark = scheme === 'dark'
  return (
    <ProviderButton
      {...props}
      testID="sign-in-apple"
      className={dark ? 'bg-white' : 'bg-black'}
      textClassName={dark ? 'text-black' : 'text-white'}
      icon={
        <Text
          className={`text-lg ${dark ? 'text-black' : 'text-white'}`}
          style={{ fontFamily: Platform.select({ ios: 'System' }) }}
        >
          {''}
        </Text>
      }
    />
  )
}
