export const BRAND = {
  appName: 'Vintager',
  colors: {
    // Burgundy and cream/beige palette
    primary: '#800020',
    secondary: '#F5E9DA',
    hero: '#E9D1BE',
    textMuted: '#6B7280', // tailwind gray-500 equivalent
    surface: '#FFFFFF',
  },
  fonts: {
    // Rounded, friendly
    display: "Quicksand, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
    body: "Quicksand, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
  },
} as const

export type Brand = typeof BRAND


