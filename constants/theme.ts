import { Platform } from 'react-native'

export const COLORS = {
  cream: '#fdf8f3',
  chocolate: '#2c1810',
  chocolateMid: '#3d2215',
  pink: '#e8698a',
  pinkDark: '#c94a6a',
  pinkPale: '#fce8ed',
  gold: '#c9a96e',
  goldDark: '#a37f42',
  muted: '#8c7b6e',
  mutedLight: '#b5a89e',
  border: 'rgba(232,213,188,0.65)',
  borderSolid: '#e8d5bc',
  white: '#ffffff',
  bg: '#fdf8f3',
  bgAlt: '#fff9f4',
  darkBg: '#160b06',
  darkBgMid: '#2c1810',
  card: '#ffffff',
  glass: 'rgba(255,255,255,0.88)',
  glassDark: 'rgba(44,24,16,0.72)',
  overlay: 'rgba(44,24,16,0.48)',
  overlayLight: 'rgba(253,248,243,0.92)',
  green: '#4ade80',
  greenBg: '#dcfce7',
  greenText: '#16a34a',
} as const

export const FONTS = {
  serif: Platform.select({ ios: 'Georgia', android: 'serif', default: 'Georgia' }),
  sans: Platform.select({ ios: 'System', android: 'Roboto', default: 'System' }),
  mono: Platform.select({ ios: 'Courier', android: 'monospace', default: 'monospace' }),
} as const

export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
} as const

export const RADIUS = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 28,
  xxl: 36,
  full: 999,
} as const

export const SHADOWS = {
  sm: {
    shadowColor: '#2c1810',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: '#2c1810',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.11,
    shadowRadius: 20,
    elevation: 6,
  },
  lg: {
    shadowColor: '#2c1810',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.16,
    shadowRadius: 40,
    elevation: 12,
  },
  pink: {
    shadowColor: '#e8698a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 10,
  },
} as const
