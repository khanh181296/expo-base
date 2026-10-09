import { CloudOff, TriangleAlert } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'

import { getErrorMessage, toApiError } from '@/lib/api'

import { EmptyState } from './empty-state'

export type ErrorStateProps = {
  error: unknown
  onRetry?: () => void
  className?: string
}

/** Full-area error with a translated message and a retry button. */
export function ErrorState({ error, onRetry, className }: ErrorStateProps) {
  const { t } = useTranslation()
  const offline = toApiError(error).kind === 'network'

  return (
    <EmptyState
      className={className}
      icon={offline ? CloudOff : TriangleAlert}
      title={t('states.errorTitle')}
      description={getErrorMessage(error, t)}
      actionLabel={onRetry ? t('common.retry') : undefined}
      onAction={onRetry}
    />
  )
}
