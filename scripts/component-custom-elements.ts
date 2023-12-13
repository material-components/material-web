/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A map of components and their custom element TypeScript entrypoints.
 */
export const COMPONENT_CUSTOM_ELEMENTS = {
  button: [
    'button/elevated-button.ts',
    'button/filled-button.ts',
    'button/filled-tonal-button.ts',
    'button/outlined-button.ts',
    'button/text-button.ts',
  ],
  checkbox: ['checkbox/checkbox.ts'],
  chips: [
    'chips/chip-set.ts',
    'chips/assist-chip.ts',
    'chips/filter-chip.ts',
    'chips/input-chip.ts',
    'chips/suggestion-chip.ts',
  ],
  dialog: ['dialog/dialog.ts'],
  divider: ['divider/divider.ts'],
  elevation: ['elevation/elevation.ts'],
  fab: ['fab/fab.ts', 'fab/branded-fab.ts'],
  field: ['field/filled-field.ts', 'field/outlined-field.ts'],
  focus: ['focus/md-focus-ring.ts'],
  icon: ['icon/icon.ts'],
  iconButton: [
    'iconbutton/icon-button.ts',
    'iconbutton/filled-icon-button.ts',
    'iconbutton/filled-tonal-icon-button.ts',
    'iconbutton/outlined-icon-button.ts',
  ],
  list: ['list/list.ts', 'list/list-item.ts'],
  menu: ['menu/menu.ts', 'menu/menu-item.ts', 'menu/sub-menu.ts'],
  progress: ['progress/linear-progress.ts', 'progress/circular-progress.ts'],
  radio: ['radio/radio.ts'],
  ripple: ['ripple/ripple.ts'],
  select: [
    'select/filled-select.ts',
    'select/outlined-select.ts',
    'select/select-option.ts',
  ],
  slider: ['slider/slider.ts'],
  switch: ['switch/switch.ts'],
  tabs: ['tabs/tabs.ts', 'tabs/primary-tab.ts', 'tabs/secondary-tab.ts'],
  textField: [
    'textfield/filled-text-field.ts',
    'textfield/outlined-text-field.ts',
  ],
} as const;
