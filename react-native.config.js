/**
 * Firebase native modules are linked only when Firebase is configured (see env.js).
 * Otherwise their pods break `pod install` (RN Firebase SPM + Expo static linkage).
 */
const { clientEnv } = require('./env')

const disabled = { platforms: { ios: null, android: null } }

module.exports = {
  dependencies: clientEnv.FIREBASE_ENABLED
    ? {}
    : {
        '@react-native-firebase/app': disabled,
        '@react-native-firebase/analytics': disabled,
        '@react-native-firebase/auth': disabled,
      },
}
