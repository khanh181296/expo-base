/**
 * Native social sign-in → Firebase Auth → Firebase ID token, the same contract as the invo app:
 * the backend verifies the Firebase ID token at POST /auth/sso.
 * Native modules are required lazily so builds without Firebase never load them.
 */
/* eslint-disable @typescript-eslint/no-require-imports */
import type * as FirebaseAuthModule from '@react-native-firebase/auth'
import type * as GoogleSignIn from '@react-native-google-signin/google-signin'
import type * as AppleAuthentication from 'expo-apple-authentication'
import type * as Crypto from 'expo-crypto'
import { Platform } from 'react-native'

import { Env } from '@/lib/env'

import { mockIdToken, mockSocial, socialConfigured } from './config'
import type { SocialAvailability, SocialProvider } from './types'

type FirebaseAuth = typeof FirebaseAuthModule
type GoogleSignInModule = typeof GoogleSignIn
type AppleAuthModule = typeof AppleAuthentication
type CryptoModule = typeof Crypto

const firebaseAuth = () => require('@react-native-firebase/auth') as FirebaseAuth
const googleSignIn = () =>
  require('@react-native-google-signin/google-signin') as GoogleSignInModule
const appleAuth = () => require('expo-apple-authentication') as AppleAuthModule
const crypto = () => require('expo-crypto') as CryptoModule

let googleConfigured = false

export async function getSocialAvailability(): Promise<SocialAvailability> {
  const appleSupported =
    Platform.OS === 'ios' &&
    (mockSocial('apple') ||
      (socialConfigured.apple &&
        (await appleAuth()
          .isAvailableAsync()
          .catch(() => false))))
  return {
    google: socialConfigured.google || mockSocial('google'),
    apple: appleSupported,
  }
}

async function exchangeForFirebaseToken(
  credential: ReturnType<FirebaseAuth['GoogleAuthProvider']['credential']>,
) {
  const { getAuth, signInWithCredential } = firebaseAuth()
  const { user } = await signInWithCredential(getAuth(), credential)
  return user.getIdToken()
}

async function googleIdToken() {
  const { GoogleSignin, isCancelledResponse } = googleSignIn()
  if (!googleConfigured) {
    GoogleSignin.configure({
      webClientId: Env.GOOGLE_WEB_CLIENT_ID,
      iosClientId: Env.GOOGLE_IOS_CLIENT_ID || undefined,
    })
    googleConfigured = true
  }
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true })
  const response = await GoogleSignin.signIn()
  if (isCancelledResponse(response)) return null
  const idToken = response.data.idToken
  if (!idToken) throw new Error('Google did not return an ID token. Check GOOGLE_WEB_CLIENT_ID.')
  const { GoogleAuthProvider } = firebaseAuth()
  return exchangeForFirebaseToken(GoogleAuthProvider.credential(idToken))
}

async function appleIdToken() {
  const Apple = appleAuth()
  const { CryptoDigestAlgorithm, digestStringAsync, randomUUID } = crypto()
  // Firebase checks that Apple signed the SHA-256 of this nonce.
  const rawNonce = randomUUID()
  const hashedNonce = await digestStringAsync(CryptoDigestAlgorithm.SHA256, rawNonce)
  try {
    const credential = await Apple.signInAsync({
      requestedScopes: [
        Apple.AppleAuthenticationScope.FULL_NAME,
        Apple.AppleAuthenticationScope.EMAIL,
      ],
      nonce: hashedNonce,
    })
    if (!credential.identityToken) throw new Error('Apple did not return an identity token.')
    const { AppleAuthProvider } = firebaseAuth()
    return exchangeForFirebaseToken(
      AppleAuthProvider.credential(credential.identityToken, rawNonce),
    )
  } catch (error) {
    if ((error as { code?: string }).code === 'ERR_REQUEST_CANCELED') return null
    throw error
  }
}

/** Returns a Firebase ID token, or null when the user cancelled. */
export async function getSocialIdToken(provider: SocialProvider): Promise<string | null> {
  if (mockSocial(provider)) return mockIdToken(provider)
  return provider === 'google' ? googleIdToken() : appleIdToken()
}

/** Clears provider and Firebase sessions so the next sign-in shows the account picker. */
export async function signOutSocial() {
  if (!Env.FIREBASE_ENABLED) return
  const { getAuth, signOut } = firebaseAuth()
  await signOut(getAuth()).catch(() => undefined)
  if (socialConfigured.google)
    await googleSignIn()
      .GoogleSignin.signOut()
      .catch(() => undefined)
}
