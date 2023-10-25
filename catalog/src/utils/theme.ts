/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  applyMaterialTheme,
  themeFromSourceColor,
} from './material-color-helpers.js';

/** Color mode, either overriding light/dark or the user's preference. */
export type ColorMode = 'light' | 'dark' | 'auto';

/**
 * Generates a Material Theme from a given color and dark mode boolean, and
 * applies the theme to the document and lets the app know that the theme has
 * changed.
 *
 * @param color The source color to generate the theme.
 * @param isDark Whether or not the theme should be in dark mode.
 */
function applyThemeFromColor(color: string, isDark: boolean) {
  const theme = themeFromSourceColor(color, isDark);
  applyMaterialTheme(document, theme);
  // Dispatches event to communicate with components pages' JS to update the
  // theme in the playground preview.
  window.dispatchEvent(new Event('theme-changed'));
}

/**
 * Determines whether or not the mode should be Dark. This also means
 * calculating whether it should be dark if the current mode is 'auto'.
 *
 * @param mode The current color mode 'light', 'dark', or 'auto'.
 * @param saveAutoMode (Optional) Whether or not to save last auto mode to
 *     localstorage. Set to false if you simply want to query whether auto mode
 *     is dark or not. Defaults to true.
 * @return Whether or not the dark mode color tokens should apply.
 */
export function isModeDark(mode: ColorMode, saveAutoMode = true) {
  let isDark = mode === 'dark';

  // Determines whether the auto mode should display light or dark.
  if (mode === 'auto') {
    isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (saveAutoMode) {
      // We have to save this because if the user closes the tab when it's light
      // and reopens it when it's dark, we need to know whether the last applied
      // 'auto' mode was correct.
      saveLastSavedAutoColorMode(isDark ? 'dark' : 'light');
    }
  }

  return isDark;
}

/**
 * Gets the current stringified material theme css string from localstorage.
 *
 * @return The current stringified material theme css string.
 */
export function getCurrentThemeString(): string | null {
  return localStorage.getItem('material-theme');
}

/**
 * Gets the current color mode from localstorage.
 *
 * @return The current color mode.
 */
export function getCurrentMode(): ColorMode | null {
  return localStorage.getItem('color-mode') as ColorMode | null;
}

/**
 * Saves the given color mode to localstorage.
 *
 * @param mode The color mode to save to localstorage.
 */
export function saveColorMode(mode: ColorMode) {
  localStorage.setItem('color-mode', mode);
}

/**
 * Gets the current seed color from localstorage.
 *
 * @return The current seed color.
 */
export function getCurrentSeedColor(): string | null {
  return localStorage.getItem('seed-color');
}

/**
 * Saves the given seed color to localstorage.
 *
 * @param color The seed color to save to local storage.
 */
export function saveSeedColor(color: string) {
  localStorage.setItem('seed-color', color);
}

/**
 * Gets last applied color mode while in "auto" from localstorage.
 *
 * @return The last applied color mode while in "auto".
 */
export function getLastSavedAutoColorMode() {
  return localStorage.getItem('last-auto-color-mode') as
    | 'light'
    | 'dark'
    | null;
}

/**
 * Saves last applied color mode while in "auto" from localstorage.
 *
 * @param mode The last applied color mode while in "auto" to be saved to local
 *     storage.
 */
export function saveLastSavedAutoColorMode(mode: 'light' | 'dark') {
  localStorage.setItem('last-auto-color-mode', mode);
}

/**
 * Generates and applies a new theme due to a change in source color.
 *
 * @param color The new source color from which to generate the new theme.
 */
export function changeColor(color: string) {
  const lastColorMode = getCurrentMode()!;
  const isDark = isModeDark(lastColorMode);

  applyThemeFromColor(color, isDark);
  saveSeedColor(color);
}

/**
 * Generates and applies a new theme due to a change in color mode.
 *
 * @param mode The new color mode from which to generate the new theme.
 */
export function changeColorMode(mode: ColorMode) {
  const color = getCurrentSeedColor()!;
  const isDark = isModeDark(mode);

  applyThemeFromColor(color, isDark);
  saveColorMode(mode);
}

/**
 * Generates and applies a new theme due to a change in both source color and
 * color mode.
 *
 * @param color The new source color from which to generate the new theme.
 * @param mode The new color mode from which to generate the new theme.
 */
export function changeColorAndMode(color: string, mode: ColorMode) {
  const isDark = isModeDark(mode);

  applyThemeFromColor(color, isDark);
  saveSeedColor(color);
  saveColorMode(mode);
}
