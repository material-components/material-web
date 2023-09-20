/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A map of Markdown documentation file name to element entrypoints associated
 * with that documentation.
 */
export const docsToElementMapping: {[key: string]: string[]} = {
  'button.md': [
    'button/elevated-button.ts',
    'button/filled-button.ts',
    'button/filled-tonal-button.ts',
    'button/outlined-button.ts',
    'button/text-button.ts',
  ],
  'checkbox.md': ['checkbox/checkbox.ts'],
  'chip.md': [
    'chips/chip-set.ts',
    'chips/assist-chip.ts',
    'chips/filter-chip.ts',
    'chips/input-chip.ts',
    'chips/suggestion-chip.ts',
  ],
  'dialog.md': ['dialog/dialog.ts'],
  'divider.md': ['divider/divider.ts'],
  'elevation.md': ['elevation/elevation.ts'],
  'fab.md': ['fab/fab.ts', 'fab/branded-fab.ts'],
  'focus-ring.md': ['focus/md-focus-ring.ts'],
  'icon-button.md': [
    'iconbutton/icon-button.ts',
    'iconbutton/filled-icon-button.ts',
    'iconbutton/filled-tonal-icon-button.ts',
    'iconbutton/outlined-icon-button.ts',
  ],
  'icon.md': ['icon/icon.ts'],
  'list.md': ['list/list.ts', 'list/list-item.ts'],
  'menu.md': ['menu/menu.ts', 'menu/menu-item.ts', 'menu/sub-menu-item.ts'],
  'progress.md':
      ['progress/linear-progress.ts', 'progress/circular-progress.ts'],
  'radio.md': ['radio/radio.ts'],
  'ripple.md': ['ripple/ripple.ts'],
  'slider.md': ['slider/slider.ts'],
  'switch.md': ['switch/switch.ts'],
  'tabs.md': ['tabs/tabs.ts', 'tabs/primary-tab.ts', 'tabs/secondary-tab.ts'],
  'text-field.md':
      ['textfield/filled-text-field.ts', 'textfield/outlined-text-field.ts'],
};
