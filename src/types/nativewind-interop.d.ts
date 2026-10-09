import 'react-native-keyboard-controller'

declare module 'react-native-keyboard-controller' {
  interface KeyboardAwareScrollViewProps {
    className?: string
    contentContainerClassName?: string
  }
}
