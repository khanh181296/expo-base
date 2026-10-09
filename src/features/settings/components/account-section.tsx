import { LogOut } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

import { dialog } from '@/components/feedback'
import { Card, ListItem, Text } from '@/components/ui'
import { useSignOut } from '@/features/auth'

export function AccountSection() {
  const { t } = useTranslation()
  const signOut = useSignOut()

  const onSignOut = async () => {
    const confirmed = await dialog.confirm({
      title: t('auth.signOut'),
      message: t('auth.signOutConfirm'),
      confirmLabel: t('auth.signOut'),
      destructive: true,
    })
    if (confirmed) signOut.mutate()
  }

  return (
    <Card>
      <Text variant="label" tone="muted" className="px-4 pt-4">
        {t('settings.account')}
      </Text>
      <ListItem icon={LogOut} title={t('auth.signOut')} destructive onPress={onSignOut} />
    </Card>
  )
}
