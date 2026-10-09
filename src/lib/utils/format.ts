import { i18n } from '@/lib/i18n'

/** Locale-aware date, follows the app language: 9 Oct 2026, 13:05 / 9 thg 10, 2026, 13:05 */
export function formatDateTime(value: string | number | Date) {
  return new Intl.DateTimeFormat(i18n.language, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}
