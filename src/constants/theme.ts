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
  terreDeGoree: '#b35a33', // Terracotta brûlée, organique
  safran: '#a9761f', // Or-moutarde épicé, solaire
  vertTeranga: '#5b7333', // Olive / palmeraie, naturel
  indigoWolof: '#46507e', // Indigo textile, profond
  corailSunset: '#f2784f', // Le corail d’origine, énergique
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

// Surfaces du thème actif · Brume / Nuit mapped for backward compatibility
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
    // Aliases mapped to brand accent
    primary: AccentColors.bissap,
  },
  dark: {
    // Nuit Surfaces
    background: '#1d161c', // Nuit
    backgroundElement: '#2b212a', // Approximation
    backgroundSelected: '#3d2f3c', // Approximation
    line: '#4a3a49',
    text: '#ffffff',
    textSecondary: '#a2a09b',
    ink3: '#65625e',
    // Aliases mapped to brand accent
    primary: AccentColors.bissap,
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

// 07 Formes & espacements
export const Radius = {
  card: 20, // Cartes, photos, sheets
  btn: 15,  // Boutons
  sm: 12,   // Vignettes, champs
  pill: 999,// Chips, avatars, badges
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
