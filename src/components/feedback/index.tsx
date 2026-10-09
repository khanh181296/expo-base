import { DialogHost } from './dialog'
import { LoadingOverlay } from './loading-overlay'
import { OfflineBanner } from './offline-banner'
import { ToastHost } from './toast'

export { dialog } from './dialog'
export { loading } from './loading-overlay'
export { toast } from './toast'

/** Global feedback hosts, rendered once above the navigator. */
export function FeedbackHosts() {
  return (
    <>
      <OfflineBanner />
      <LoadingOverlay />
      <ToastHost />
      <DialogHost />
    </>
  )
}
