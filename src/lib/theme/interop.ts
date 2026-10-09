/** Enable `className` on third-party components that NativeWind does not know about. */
import { cssInterop } from 'nativewind'
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { SafeAreaView } from 'react-native-safe-area-context'

cssInterop(SafeAreaView, { className: 'style' })
cssInterop(KeyboardAwareScrollView, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
})
