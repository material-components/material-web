/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const cssClasses = {
  MENU_SELECTED_LIST_ITEM: 'md3-menu-item--selected',
  MENU_SELECTION_GROUP: 'md3-menu__selection-group',
  ROOT: 'md3-menu',
};

const strings = {
  ARIA_CHECKED_ATTR: 'aria-checked',
  ARIA_DISABLED_ATTR: 'aria-disabled',
  CHECKBOX_SELECTOR: 'input[type="checkbox"]',
  LIST_SELECTOR: '.md3-list,.md3-deprecated-list',
  SELECTED_EVENT: 'MDCMenu:selected',
  SKIP_RESTORE_FOCUS: 'data-menu-item-skip-restore-focus',
};

const numbers = {
  FOCUS_ROOT_INDEX: -1,
};

export {cssClasses, strings, numbers};
