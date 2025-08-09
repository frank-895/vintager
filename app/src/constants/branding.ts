export const BRAND = {
  appName: 'Vintager',
  colors: {
    // Burgundy and cream/beige palette
    primary: '#800020',
    secondary: '#F5E9DA',
    textMuted: '#6B7280', // tailwind gray-500 equivalent
    surface: '#FFFFFF',
  },
  fontFamily:
    "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
} as const

export type Brand = typeof BRAND


