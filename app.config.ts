import type { ConfigContext, ExpoConfig } from 'expo/config'

import { appIdentity, buildTimeEnv, clientEnv } from './env'

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: appIdentity.name,
  slug: appIdentity.slug,
  owner: buildTimeEnv.EXPO_ACCOUNT_OWNER,
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/images/icon.png',
  scheme: appIdentity.scheme,
  userInterfaceStyle: 'automatic',
  ios: {
    bundleIdentifier: appIdentity.bundleId,
    icon: './assets/expo.icon',
    supportsTablet: false,
    config: { usesNonExemptEncryption: false },
  },
  android: {
    package: appIdentity.bundleId,
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
    'expo-secure-store',
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
