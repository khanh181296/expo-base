export const COLOR_TOKENS = [
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
] as const

export type ColorToken = (typeof COLOR_TOKENS)[number]
export type ColorSchemeName = 'light' | 'dark'

/** RGB channels, mirrored as CSS variables in src/global.css */
export const palette: Record<ColorSchemeName, Record<ColorToken, string>> = {
  light: {
    background: '255 255 255',
    foreground: '15 23 42',
    card: '255 255 255',
    'card-foreground': '15 23 42',
    muted: '241 245 249',
    'muted-foreground': '100 116 139',
    primary: '37 99 235',
    'primary-foreground': '255 255 255',
    secondary: '241 245 249',
    'secondary-foreground': '15 23 42',
    destructive: '220 38 38',
    'destructive-foreground': '255 255 255',
    success: '22 163 74',
    warning: '217 119 6',
    border: '226 232 240',
    input: '226 232 240',
    ring: '37 99 235',
    overlay: '15 23 42',
  },
  dark: {
    background: '2 6 23',
    foreground: '248 250 252',
    card: '15 23 42',
    'card-foreground': '248 250 252',
    muted: '30 41 59',
    'muted-foreground': '148 163 184',
    primary: '59 130 246',
    'primary-foreground': '255 255 255',
    secondary: '30 41 59',
    'secondary-foreground': '248 250 252',
    destructive: '239 68 68',
    'destructive-foreground': '255 255 255',
    success: '34 197 94',
    warning: '245 158 11',
    border: '30 41 59',
    input: '51 65 85',
    ring: '59 130 246',
    overlay: '0 0 0',
  },
}

export function toRgb(channels: string, alpha = 1) {
  const [r, g, b] = channels.split(' ')
  return alpha === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getColors(scheme: ColorSchemeName) {
  return Object.fromEntries(
    COLOR_TOKENS.map((token) => [token, toRgb(palette[scheme][token])]),
  ) as Record<ColorToken, string>
}
