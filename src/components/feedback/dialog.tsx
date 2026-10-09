import { Modal, View } from 'react-native'
import { create } from 'zustand'

import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { i18n } from '@/lib/i18n'

type ConfirmOptions = {
  title: string
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
}

type DialogState = {
  current: (ConfirmOptions & { resolve: (value: boolean) => void }) | null
}

const useDialogStore = create<DialogState>(() => ({ current: null }))

function close(result: boolean) {
  const { current } = useDialogStore.getState()
  current?.resolve(result)
  useDialogStore.setState({ current: null })
}

/** Imperative confirm dialog: `if (await dialog.confirm({...})) doIt()` */
export const dialog = {
  confirm: (options: ConfirmOptions) =>
    new Promise<boolean>((resolve) => {
      useDialogStore.getState().current?.resolve(false)
      useDialogStore.setState({ current: { ...options, resolve } })
    }),
}

/** Mount once near the root. */
export function DialogHost() {
  const current = useDialogStore((state) => state.current)

  return (
    <Modal
      transparent
      visible={current != null}
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => close(false)}
    >
      <View className="flex-1 items-center justify-center bg-overlay/50 px-6">
        {current && (
          <View className="w-full max-w-sm gap-3 rounded-xl bg-card p-5">
            <Text variant="h3">{current.title}</Text>
            {current.message && <Text tone="muted">{current.message}</Text>}
            <View className="mt-2 flex-row gap-3">
              <Button
                className="flex-1"
                variant="outline"
                label={current.cancelLabel ?? i18n.t('common.cancel')}
                onPress={() => close(false)}
              />
              <Button
                className="flex-1"
                variant={current.destructive ? 'destructive' : 'primary'}
                label={current.confirmLabel ?? i18n.t('common.confirm')}
                onPress={() => close(true)}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  )
}
