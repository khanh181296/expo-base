import * as Application from 'expo-application'
import { Info, Server } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

import { Card, Divider, ListItem } from '@/components/ui'
import { Env } from '@/lib/env'

export function AboutSection() {
  const { t } = useTranslation()
  const version = `${Application.nativeApplicationVersion ?? '-'} (${Application.nativeBuildVersion ?? '-'})`

  return (
    <Card>
      <ListItem icon={Info} title={t('settings.version')} value={version} />
      <Divider className="ml-12" />
      <ListItem icon={Server} title={t('settings.environment')} value={Env.APP_ENV} />
    </Card>
  )
}
