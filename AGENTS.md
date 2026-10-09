This is an Expo/React Native mobile application. Prioritize mobile-first patterns, performance, and cross-platform compatibility.

## Expo has changed — do not trust your training data

Expo ships breaking changes every SDK release. APIs you remember are likely renamed, moved, or removed. Before writing any code that touches an Expo, EAS, or React Native API:

1. Read the major version of the `expo` package in `package.json`.
2. Fetch the matching versioned docs: `https://docs.expo.dev/versions/v<major>.0.0/`
3. For anything else, fetch https://docs.expo.dev/llms.txt — an index of all Expo docs with corrections to common LLM misconceptions. Follow its links to the specific page you need; never answer from memory.

## Commands

This project uses **pnpm** (isolated `node_modules`). Never use npm, yarn or bun.

```bash
pnpm expo install <package> # ALWAYS use for Expo/RN packages — resolves SDK-compatible versions
pnpm add <package>          # pure JS packages not tied to the SDK
pnpm start                  # dev server (APP_ENV=development)
pnpm check                  # typecheck + lint + format + test, same as CI
pnpm doctor                 # diagnose dependency and config issues
```

Run `pnpm check` before declaring any task done.

## Project conventions

- Architecture is feature-based: `src/app` (routes only) → `src/features/<name>` → `src/components`, `src/lib`. `lib` never imports from `features`. Import features only through their `index.ts`.
- Server state: TanStack Query in `features/<name>/hooks.ts`. Client state: Zustand. Do not mirror API data into stores.
- HTTP goes through `api` from `@/lib/api`. Errors are always `ApiError`; show them with `getErrorMessage(error, t)`.
- Secrets (tokens) only in `secureStorage`. MMKV (`kv`) is unencrypted.
- Styling: NativeWind `className` with semantic tokens (`bg-background`, `text-muted-foreground`…). Colors live in `src/global.css` and `src/lib/theme/palette.ts`, kept in sync by a test.
- Every user-facing string goes through i18n (`src/translations/{en,vi}.json`). Zod messages are i18n keys.
- Env vars: declare in the schema in `env.js`, read with `Env` from `@/lib/env`. Never put secrets in client env.
- Use the `@/` alias, no deep relative imports. Use the components in `@/components/ui` before adding new ones.
- Signed-out screens use `AuthScreen` from `@/features/auth` (heading + EN | VI toggle) and are listed in the `!signedIn` `Stack.Protected` group in `src/app/_layout.tsx`.
- Report unexpected errors with `captureError` from `@/lib/monitoring`; never call Sentry directly. Sentry is off in development builds.
- When the mock API is on (`USE_MOCK_API`), add new endpoints to `src/lib/api/mock-adapter.ts` with the same contract as the real API.

## Navigation & Routing

- Use **Expo Router** for all navigation. Routes live in `src/app/` — every file there is a screen, `_layout.tsx` files define navigators. Keep non-route code (components, hooks, utils) outside `src/app/`.
- Import `Link`, `router`, and `useLocalSearchParams` from `expo-router`.
- Docs: https://docs.expo.dev/router/introduction.md

## Building with EAS

Use EAS to build, sign, and submit the app in the cloud (`eas build`, `eas submit`) and to ship over-the-air updates (`eas update`) — no local Xcode or Android Studio required. Run EAS CLI as `bunx eas-cli <command>` in Bun projects, or `npx eas-cli@latest <command>` otherwise; substitute that for bare `eas` in docs examples.
Docs: https://docs.expo.dev/eas/index.md

## Rules

- If `ios/` and `android/` directories do not exist, they are generated (Continuous Native Generation). Never create or edit them by hand — configure native behavior in `app.json` and config plugins.
- Expo Go only includes its bundled native modules. After adding a library with native code, the app needs a development build: `npx expo run:ios|android` locally, or `eas build --profile development`.
- Prefer recommended Expo modules over third-party libraries, and check your available skills before adding dependencies. Docs: https://docs.expo.dev/versions/latest/index.md
