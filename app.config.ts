import type { ConfigContext, ExpoConfig } from 'expo/config'

import { appIdentity, buildTimeEnv, clientEnv } from './env'

const firebasePlugins: NonNullable<ExpoConfig['plugins']> = clientEnv.FIREBASE_ENABLED
  ? [
      '@react-native-firebase/app',
      ['@react-native-firebase/analytics', { ios: { withoutAdIdSupport: true } }],
      // React Native Firebase resolves the Apple SDK with SPM, which needs dynamic frameworks.
      ['expo-build-properties', { ios: { useFrameworks: 'dynamic' } }],
    ]
  : []

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appIdentity.name,
  slug: appIdentity.slug,
  owner: buildTimeEnv.EXPO_ACCOUNT_OWNER,
  version: '1.0.0',
  // OTA updates only reach builds with the same app version.
  runtimeVersion: { policy: 'appVersion' },
  ...(buildTimeEnv.EAS_PROJECT_ID && {
    updates: { url: `https://u.expo.dev/${buildTimeEnv.EAS_PROJECT_ID}` },
  }),
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: appIdentity.scheme,
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: appIdentity.bundleId,
    googleServicesFile: buildTimeEnv.GOOGLE_SERVICE_INFO_PLIST,
    icon: './assets/expo.icon',
    supportsTablet: false,
    config: { usesNonExemptEncryption: false },
  },
  android: {
    package: appIdentity.bundleId,
    googleServicesFile: buildTimeEnv.GOOGLE_SERVICES_JSON,
    adaptiveIcon: {
      backgroundColor: '#E6F4FE',
      foregroundImage: './assets/images/android-icon-foreground.png',
      backgroundImage: './assets/images/android-icon-background.png',
      monochromeImage: './assets/images/android-icon-monochrome.png',
    },
    predictiveBackGestureEnabled: false,
  },
  web: {
    output: 'single',
    favicon: './assets/images/favicon.png',
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        backgroundColor: '#FFFFFF',
        image: './assets/images/splash-icon.png',
        imageWidth: 76,
        dark: { backgroundColor: '#020617', image: './assets/images/splash-icon.png' },
      },
    ],
    [
      '@sentry/react-native/expo',
      { organization: buildTimeEnv.SENTRY_ORG, project: buildTimeEnv.SENTRY_PROJECT },
    ],
    'expo-secure-store',
    ['expo-notifications', { color: '#2563EB' }],
    ...firebasePlugins,
    'expo-localization',
  ],
  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    env: clientEnv,
    ...(buildTimeEnv.EAS_PROJECT_ID && { eas: { projectId: buildTimeEnv.EAS_PROJECT_ID } }),
  },
})
