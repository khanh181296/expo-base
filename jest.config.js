/** @type {import('jest').Config} */
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!(.pnpm|(jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|nativewind|react-native-css-interop|lucide-react-native|@gorhom/.*|standard-navigation))',
  ],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts', '!src/app/**'],
  // A floor that only goes up: raise it when coverage improves. Core API code stays near full.
  coverageThreshold: {
    global: { statements: 30, branches: 25, functions: 20, lines: 30 },
    './src/lib/api/client.ts': { statements: 90, branches: 80, lines: 90 },
    './src/lib/api/errors.ts': { statements: 85, branches: 80, lines: 85 },
  },
}
