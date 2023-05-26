/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {changeColor, changeColorAndMode, changeColorMode, getCurrentMode, getCurrentSeedColor, getCurrentThemeString, getLastSavedAutoColorMode, isModeDark} from '../utils/theme.js';

/**
 * Determins whether the top app bar and nav drawers should be sticky, and then
 * listens to scroll events to determine at runtime.
 */
function applyStickyScrollListener() {
  const topAppBar = document.querySelector('top-app-bar')!;
  const navDrawer = document.querySelector('nav-drawer')!;

  const updateSticky = () => {
    if (globalThis.scrollY > 0) {
      topAppBar.classList.add('is-sticky');
      navDrawer.classList.add('is-sticky');
    } else {
      topAppBar.classList.remove('is-sticky');
      navDrawer.classList.remove('is-sticky');
    }
  };

  globalThis.addEventListener('scroll', () => {
    updateSticky();
  }, {passive: true});

  updateSticky();
}

/**
 * Applies theme-based event listeners such as changing color, mode, and
 * listening to system mode changes.
 */
function applyColorThemeListeners() {
  document.body.addEventListener('change-color', (event) => {
    changeColor(event.color);
  });

  document.body.addEventListener('change-mode', (event) => {
    changeColorMode(event.mode);
  });

  // Listen for system color change and applies the new theme if the current
  // color mode is 'auto'.
  window.matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        if (getCurrentMode() !== 'auto') {
          return;
        }

        changeColor(getCurrentSeedColor()!);
      });
}

/**
 * Sets color and mode to '#81ea6c' and 'auto' respectively if there is no
 * material theme saved to localStorage. This is the case in initial naviation
 * to the catalog.
 */
function initializeTheme() {
  if (!getCurrentThemeString()) {
    changeColorAndMode('#81ea6c', 'auto');
  }
}

/**
 * Determines whether to update the theme on page navigation if the mode is
 * 'auto'.
 *
 * This is necessary in the edge case where the user has set color mode to
 * 'auto', and the system mode is A. They navigate away from the catalog, and
 * over time the system mode changes to B. When they navigate back to the
 * catalog, the mode may be 'auto', but color theme with mode A is saved instead
 * of B.
 */
function determinePageNavigationAutoMode() {
  if (getCurrentMode() !== 'auto') {
    return;
  }

  const actualColorMode = isModeDark('auto', false) ? 'dark' : 'light';
  const lastSavedAutoColorMode = getLastSavedAutoColorMode();

  if (actualColorMode !== lastSavedAutoColorMode) {
    // Recalculate auto mode with the same theme color.
    changeColorMode('auto');
  }
}

applyStickyScrollListener();
applyColorThemeListeners();
initializeTheme();
determinePageNavigationAutoMode();
