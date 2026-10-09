import {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  BottomSheetModal,
  type BottomSheetModalProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useThemeColors } from '@/lib/theme'

import { Text } from './text'

export type SheetProps = Omit<BottomSheetModalProps, 'children'> & {
  title?: string
  children: React.ReactNode
  ref?: React.Ref<BottomSheetModal>
}

const renderBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop {...props} appearsOnIndex={0} disappearsOnIndex={-1} pressBehavior="close" />
)

/** Themed modal bottom sheet. Open with `ref.current?.present()`. */
export function Sheet({ title, children, ref, ...props }: SheetProps) {
  const { colors } = useThemeColors()
  const insets = useSafeAreaInsets()

  return (
    <BottomSheetModal
      ref={ref}
      enableDynamicSizing
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.card }}
      handleIndicatorStyle={{ backgroundColor: colors.border }}
      {...props}
    >
      <BottomSheetView style={{ paddingBottom: insets.bottom + 16 }}>
        {title && (
          <Text variant="h3" className="px-4 pb-2">
            {title}
          </Text>
        )}
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  )
}

export type { BottomSheetModal as SheetRef }
