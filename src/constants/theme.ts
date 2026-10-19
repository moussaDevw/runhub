import '@/global.css';

import { Platform } from 'react-native';

// 01 Thèmes de fond
export const BackgroundThemes = {
  Creme: '#faf6f0',
  Ivoire: '#fefdfb',
  Sable: '#f4ecdd',
  Brume: '#f5f5f4', // défaut
  Nuit: '#1d161c', // sombre
} as const;

// 02 Couleurs d'accent
export const AccentColors = {
  bissap: '#b8324f', // Rouge hibiscus — accent de marque
  bissapLight: '#fdf0f3', // Fond bissap léger
  terreDeGoree: '#b35a33', // Terracotta brûlée, organique
  safran: '#a9761f', // Or-moutarde épicé, solaire
  vertTeranga: '#5b7333', // Olive / palmeraie, naturel
  terangaLight: '#eaf3ed', // Fond vert léger
  indigoWolof: '#46507e', // Indigo textile, profond
  indigoLight: '#f0f1f8', // Fond indigo léger
  corailSunset: '#f2784f', // Le corail d’origine, énergique
  verified: '#3b82f6', // Bleu vérifié
} as const;

// 03 Couleurs des sports
export const SportsColors = {
  running: '#f2784f',
  foot: '#2c7a55',
  fitness: '#c64a86',
  yoga: '#b78ad6',
  cyclisme: '#e0913a',
  basket: '#d9633f',
  marche: '#caa45f',
} as const;

// 04 Couleurs sémantiques
export const SemanticColors = {
  valide: '#1F8A5B', // Billet bon, entrée autorisée
  dejaUtilise: '#C8901E', // QR déjà scanné — alerte
  invalide: '#C8392F', // QR inconnu / refusé
} as const;

// 05 Marques mobile money
export const PaymentBrands = {
  wave: '#1AA9F7',
  orangeMoney: '#FF7900',
  freeMoney: '#C8102E',
  carte: '#232220',
} as const;

// 06 Palette des avatars
export const AvatarColors = [
  '#f2784f',
  '#2f6b4d',
  '#b8324f',
  '#8a5c9f',
  '#d98b2b',
  '#20639b',
  '#3caea3',
  '#ed553b',
] as const;

// Surfaces du thème actif · Brume / Nuit mapped with full component tokens
export const Colors = {
  light: {
    // Brume Surfaces
    background: '#f5f5f4', // Paper
    backgroundElement: '#eaeae9', // Paper-2
    backgroundSelected: '#e3e3e1', // Paper-3
    line: '#e3e2df',
    text: '#232220', // Ink
    textSecondary: '#65625e', // Ink-2
    ink3: '#a2a09b',
    mutedText: '#8a8782',
    // Surfaces & Card
    cardBackground: '#ffffff',
    cardBorder: '#eae7e3',
    // Form Inputs
    inputBackground: '#ffffff',
    inputBorder: '#e3e2df',
    inputBorderFocus: AccentColors.bissap,
    surfaceGhost: 'rgba(35, 34, 32, 0.06)',
    // Aliases mapped to brand accent & semantics
    primary: AccentColors.bissap,
    danger: SemanticColors.invalide,
    success: SemanticColors.valide,
    warning: SemanticColors.dejaUtilise,
  },
  dark: {
    // Nuit Surfaces
    background: '#1d161c', // Nuit
    backgroundElement: '#2b212a', // Approximation
    backgroundSelected: '#3d2f3c', // Approximation
    line: '#4a3a49',
    text: '#ffffff',
    textSecondary: '#c5bfb9',
    ink3: '#8a8089',
    mutedText: '#6f666e',
    // Surfaces & Card
    cardBackground: '#261e25',
    cardBorder: '#3d2f3c',
    // Form Inputs
    inputBackground: '#261e25',
    inputBorder: '#3d2f3c',
    inputBorderFocus: AccentColors.bissap,
    surfaceGhost: 'rgba(255, 255, 255, 0.1)',
    // Aliases mapped to brand accent & semantics
    primary: AccentColors.bissap,
    danger: SemanticColors.invalide,
    success: SemanticColors.valide,
    warning: SemanticColors.dejaUtilise,
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

// 06 Typographie
export const Typography = {
  display: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 42,
  },
  titre: {
    fontFamily: 'SpaceGrotesk_700Bold',
    fontSize: 27,
  },
  corps: {
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 17,
  },
  corpsGras: {
    fontFamily: 'HankenGrotesk_700Bold',
    fontSize: 17,
  },
  meta: {
    fontFamily: 'GeistMono_500Medium',
    fontSize: 15,
  },
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

// 06 Couleurs neutres
export const NeutralColors = {
  white: '#ffffff',
  black: '#000000',
  transparent: 'transparent',
  overlay30: 'rgba(0, 0, 0, 0.3)',
  overlay40: 'rgba(29, 22, 28, 0.4)',
  overlay60: 'rgba(29, 22, 28, 0.6)',
} as const;

// 07 Formes & espacements
export const Radius = {
  xs: 8,
  sm: 12,   // Vignettes, champs
  md: 16,   // Boutons, cartes compactes
  card: 20, // Cartes standard
  lg: 24,   // Grandes cartes, sheets
  pill: 999,// Chips, avatars, badges
  btn: 16,  // Boutons
} as const;

export const Shadows = {
  sm: {
    shadowColor: NeutralColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 1,
  },
  card: {
    shadowColor: NeutralColors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  lg: {
    shadowColor: NeutralColors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

export const Spacing = {
  space4: 4,
  space8: 8,
  space12: 12,
  space16: 16,
  space20: 20,
  space24: 24,
  space26: 26,
  space32: 32,
  // Backward compatibility with previous Spacing interface
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
