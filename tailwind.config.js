const tokens = [
  'background',
  'foreground',
  'card',
  'card-foreground',
  'muted',
  'muted-foreground',
  'primary',
  'primary-foreground',
  'secondary',
  'secondary-foreground',
  'destructive',
  'destructive-foreground',
  'success',
  'warning',
  'border',
  'input',
  'ring',
  'overlay',
]

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: Object.fromEntries(
        tokens.map((token) => [token, `rgb(var(--${token}) / <alpha-value>)`]),
      ),
      borderRadius: {
        DEFAULT: '10px',
        lg: '14px',
        xl: '18px',
      },
    },
  },
  plugins: [],
}
