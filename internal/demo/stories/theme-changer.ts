/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {argbFromHex, DynamicColor, DynamicScheme, Hct, hexFromArgb, MaterialDynamicColors, SchemeTonalSpot} from 'google3/third_party/javascript/material_color_utilities.js';

import {CssPropArray} from './stylesheet-helpers.js';

/**
 * Generates a list of CSS Custom properties from the Material Color Utilities'
 * token output from the given color and dark mode toggle.
 *
 * @param color Color in Hex from which to generate the theme
 * @param dark Whether or not to use the dark theme scheme. Defaults to false
 * @return A CSS Prop Array of Material System CSS Custom Property assignments.
 */
export function createTheme(color: string, dark = false) {
  const theme = themeFromSourceColor(color, dark);
  const out: CssPropArray = [];

  for (const [token, hex] of Object.entries(theme)) {
    // camelCase to kebab-case
    const name = token.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    out.push([`--md-sys-color-${name}`, hex]);
  }
  return out;
}

/**
 * Generates a mapping of sys token name to material DynamicColor object.
 *
 * TODO: replace with material-color-utilities' `themeFromSourceColor` function
 * once it supports v172 tokens.
 *
 * @param scheme The scheme from wich to generate the DynamicColor objects.
 * @return An object that maps kebab-case sys token names to hex rgb value.
 */
function generateMaterialColors(scheme: DynamicScheme):
    {[key: string]: DynamicColor;} {
  return {
    'highest-surface': MaterialDynamicColors.highestSurface(scheme),
    'background': MaterialDynamicColors.background,
    'on-background': MaterialDynamicColors.onBackground,
    'surface': MaterialDynamicColors.surface,
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
    'outline': MaterialDynamicColors.outline,
    'outline-variant': MaterialDynamicColors.outlineVariant,
    'shadow': MaterialDynamicColors.shadow,
    'scrim': MaterialDynamicColors.scrim,
    'surface-tint': MaterialDynamicColors.surfaceTintColor,
    'primary': MaterialDynamicColors.primary,
    'on-primary': MaterialDynamicColors.onPrimary,
    'primary-container': MaterialDynamicColors.primaryContainer,
    'on-primary-container': MaterialDynamicColors.onPrimaryContainer,
    'inverse-primary': MaterialDynamicColors.inversePrimary,
    'secondary': MaterialDynamicColors.secondary,
    'on-secondary': MaterialDynamicColors.onSecondary,
    'secondary-container': MaterialDynamicColors.secondaryContainer,
    'on-secondary-container': MaterialDynamicColors.onSecondaryContainer,
    'tertiary': MaterialDynamicColors.tertiary,
    'on-tertiary': MaterialDynamicColors.onTertiary,
    'tertiary-container': MaterialDynamicColors.tertiaryContainer,
    'on-tertiary-container': MaterialDynamicColors.onTertiaryContainer,
    'error': MaterialDynamicColors.error,
    'on-error': MaterialDynamicColors.onError,
    'error-container': MaterialDynamicColors.errorContainer,
    'on-error-container': MaterialDynamicColors.onErrorContainer,
  };
}

interface Theme {
  [tokenName: string]: string;
}

/**
 * Generates a material theme from a given color.
 *
 * TODO: replace with material-color-utilities' `themeFromSourceColor` function
 * once it supports v172 tokens.
 *
 * @param color The hex color to seed the theme.
 * @param isDark Whether or not the resultant theme should be dark mode.
 * @return An object that maps kebab-case sys token names to hex rgb value.
 */
function themeFromSourceColor(color: string, isDark: boolean) {
  const scheme =
      new SchemeTonalSpot(Hct.fromInt(argbFromHex(color)), isDark, 0);
  const colors = generateMaterialColors(scheme);
  const theme: Theme = {};

  for (const [key, value] of Object.entries(colors)) {
    theme[key] = hexFromArgb(value.getArgb(scheme));
  }
  return theme;
}
