/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * MDCChipActionCssClasses provides the classes to be queried and manipulated on
 * the root.
 */
export enum MDCChipActionCssClasses {
  PRIMARY_ACTION = 'md3-evolution-chip__action--primary',
  TRAILING_ACTION = 'md3-evolution-chip__action--trailing',
  CHIP_ROOT = 'md3-evolution-chip',
}

/**
 * MDCChipActionInteractionTrigger provides detail of the different triggers for
 * action interactions.
 */
export enum MDCChipActionInteractionTrigger {
  UNSPECIFIED,  // Default type
  CLICK,
  BACKSPACE_KEY,
  DELETE_KEY,
  SPACEBAR_KEY,
  ENTER_KEY,
}

/**
 * MDCChipActionType provides the different types of available actions.
 */
export enum MDCChipActionType {
  UNSPECIFIED,  // Default type
  PRIMARY,
  TRAILING,
}

/**
 * MDCChipActionEvents provides the different events emitted by the action.
 */
export enum MDCChipActionEvents {
  INTERACTION = 'MDCChipAction:interaction',
  NAVIGATION = 'MDCChipAction:navigation',
}

/**
 * MDCChipActionFocusBehavior provides configurations for focusing or unfocusing
 * an action.
 */
export enum MDCChipActionFocusBehavior {
  FOCUSABLE,
  FOCUSABLE_AND_FOCUSED,
  NOT_FOCUSABLE,
}

/**
 * MDCChipActionAttributes provides the HTML attributes used by the foundation.
 */
export enum MDCChipActionAttributes {
  ARIA_DISABLED = 'aria-disabled',
  ARIA_HIDDEN = 'aria-hidden',
  ARIA_SELECTED = 'aria-selected',
  DATA_DELETABLE = 'data-mdc-deletable',
  DISABLED = 'disabled',
  ROLE = 'role',
  TAB_INDEX = 'tabindex',
}
