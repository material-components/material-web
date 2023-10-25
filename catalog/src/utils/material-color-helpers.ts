/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  argbFromHex,
  Hct,
  hexFromArgb,
  MaterialDynamicColors,
  SchemeContent,
} from '@material/material-color-utilities';

import type {Theme} from '../types/color-events.js';

import {applyThemeString} from './apply-theme-string.js';

/**
 * A Mapping of color token name to MCU HCT color function generator.
 */
const materialColors = {
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
  'surface-tint': MaterialDynamicColors.surfaceTint,
  primary: MaterialDynamicColors.primary,
  'on-primary': MaterialDynamicColors.onPrimary,
  'primary-container': MaterialDynamicColors.primaryContainer,
  'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
  'inverse-primary': MaterialDynamicColors.inversePrimary,
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

/**
 * Converts a hex value to a HCT tuple.
 *
 * @param value A stringified hex color e.g. '#C01075'
 * @return Material Color Utilities HCT color tuple.
 */
export function hctFromHex(value: string) {
  return Hct.fromInt(argbFromHex(value));
}

/**
 * Converts a hue chroma and tone to a hex color value clamped in the hex
 * colorspace.
 *
 * @param hue The hue of the color of value [0,360]
 * @param chroma The chroma of the color of value [0,150]
 * @param tone The tone of the color of value [0,100]
 * @return A clamped, stringified hex color value representing the HCT values.
 */
export function hexFromHct(hue: number, chroma: number, tone: number) {
  const hct = Hct.from(hue, chroma, tone);
  const value = hct.toInt();
  return hexFromArgb(value);
}

/**
 * Generates a theme object mapping of kebab-system-color-token to stringified
 * sRGB hex value in the Material SchemeContent color scheme given a single
 * color.
 *
 * @param color A stringified hex color e.g. '#C01075'
 * @param isDark Whether or not to generate a dark mode theme.
 * @return A theme object that maps the sys color token to its value (not a
 *     custom property).
 */
export function themeFromSourceColor(color: string, isDark: boolean): Theme {
  const scheme = new SchemeContent(Hct.fromInt(argbFromHex(color)), isDark, 0);
  const theme: {[key: string]: string} = {};

  for (const [key, value] of Object.entries(materialColors)) {
    theme[key] = hexFromArgb(value.getArgb(scheme));
  }
  return theme;
}

/**
 * Generates a stylesheet string of custom properties from the given theme, and
 * applies the styles to the given document or shadow root, and caches the value
 * in memory and localstorage given an optional ssName.
 *
 * @param doc Document or ShadowRoot to apply theme.
 * @param theme A theme object that maps the sys color token to its value
 *     (output of themeFromSourceColor).
 * @param ssName Optional global identifier of the constructable stylesheet and
 *     used to generate the localstorage name.
 */
export function applyMaterialTheme(
  doc: DocumentOrShadowRoot,
  theme: Theme,
  ssName = 'material-theme',
) {
  let styleString = ':root,:host{';
  for (const [key, value] of Object.entries(theme)) {
    styleString += `--md-sys-color-${key}:${value};`;
  }
  styleString += '}';

  applyThemeString(doc, styleString, ssName);
}
