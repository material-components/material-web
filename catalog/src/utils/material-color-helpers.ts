import type { Theme } from '../types/color-events.js';

import {
  MaterialDynamicColors,
  argbFromHex,
  hexFromArgb,
  Hct,
  SchemeTonalSpot,
  DynamicColor,
  DynamicScheme,
} from '@material/material-color-utilities';

import { applyThemeString } from './apply-theme-string.js';

function generateMaterialColors(scheme: DynamicScheme): {
  [key: string]: DynamicColor;
} {
  return {
    'highest-surface': MaterialDynamicColors.highestSurface(scheme),
    background: MaterialDynamicColors.background,
    'on-background': MaterialDynamicColors.onBackground,
    surface: MaterialDynamicColors.surface,
    'surface-dim': MaterialDynamicColors.surfaceDim,
    'surface-bright': MaterialDynamicColors.surfaceBright,
    'surface-container-lowest': MaterialDynamicColors.surfaceContainerLowest,
    'surface-container-low': MaterialDynamicColors.surfaceContainerLow,
    'surface-container': MaterialDynamicColors.surfaceContainer,
    'surface-container-high': MaterialDynamicColors.surfaceContainerHigh,
    'surface-container-highest': MaterialDynamicColors.surfaceContainerHighest,
    'on-surface': MaterialDynamicColors.onSurface,
    'surface-variant': MaterialDynamicColors.surfaceVariant,
    'on-surface-variant': MaterialDynamicColors.onSurfaceVariant,
    'inverse-surface': MaterialDynamicColors.inverseSurface,
    'inverse-on-surface': MaterialDynamicColors.inverseOnSurface,
    outline: MaterialDynamicColors.outline,
    'outline-variant': MaterialDynamicColors.outlineVariant,
    shadow: MaterialDynamicColors.shadow,
    scrim: MaterialDynamicColors.scrim,
    'surface-tint': MaterialDynamicColors.surfaceTintColor,
    primary: MaterialDynamicColors.primary,
    'on-primary': MaterialDynamicColors.onPrimary,
    'primary-container': MaterialDynamicColors.primaryContainer,
    'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
    'inverse-primary': MaterialDynamicColors.inversePrimary,
    'inverse-on-primary': MaterialDynamicColors.inverseOnPrimary,
    secondary: MaterialDynamicColors.secondary,
    'on-secondary': MaterialDynamicColors.onSecondary,
    'secondary-container': MaterialDynamicColors.secondaryContainer,
    'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
    tertiary: MaterialDynamicColors.tertiary,
    'on-tertiary': MaterialDynamicColors.onTertiary,
    'tertiary-container': MaterialDynamicColors.tertiaryContainer,
    'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
    error: MaterialDynamicColors.error,
    'on-error': MaterialDynamicColors.onError,
    'error-container': MaterialDynamicColors.errorContainer,
    'on-error-container': MaterialDynamicColors.onErrorContainer,
  };
}

/**
 * Convert a hex value to a hct truple
 */
export function hctFromHex(value: string) {
  const hct = Hct.fromInt(argbFromHex(value));
  return hct;
}

/**
 * Convert a hct truple to a hex value
 */
export function hexFromHct(hue: number, chroma: number, tone: number) {
  const hct = Hct.from(hue, chroma, tone);
  const value = hct.toInt();
  return hexFromArgb(value);
}

export function themeFromSourceColor(color: string, isDark: boolean) {
  const scheme = new SchemeTonalSpot(
    Hct.fromInt(argbFromHex(color)),
    isDark,
    0
  );
  const colors = generateMaterialColors(scheme);
  const theme: { [key: string]: string } = {};

  for (const [key, value] of Object.entries(colors)) {
    theme[key] = hexFromArgb(value.getArgb(scheme));
  }
  return theme;
}

export function applyTheme(
  doc: DocumentOrShadowRoot,
  theme: Theme,
  ssName = 'material-theme'
) {
  let styleString = ':root{';
  for (const [key, value] of Object.entries(theme)) {
    styleString += `--md-sys-color-${key}:${value};`;
  }
  styleString += '}';

  applyThemeString(doc, styleString, ssName);
}
