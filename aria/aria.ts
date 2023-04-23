/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Accessibility Object Model reflective aria property name types.
 */
export type ARIAProperty = Exclude<keyof ARIAMixin, 'role'>;

/**
 * Accessibility Object Model reflective aria properties.
 */
export const ARIA_PROPERTIES: ARIAProperty[] = [
  'ariaAtomic',          'ariaAutoComplete', 'ariaBusy',
  'ariaChecked',         'ariaColCount',     'ariaColIndex',
  'ariaColIndexText',    'ariaColSpan',      'ariaCurrent',
  'ariaDisabled',        'ariaExpanded',     'ariaHasPopup',
  'ariaHidden',          'ariaInvalid',      'ariaKeyShortcuts',
  'ariaLabel',           'ariaLevel',        'ariaLive',
  'ariaModal',           'ariaMultiLine',    'ariaMultiSelectable',
  'ariaOrientation',     'ariaPlaceholder',  'ariaPosInSet',
  'ariaPressed',         'ariaReadOnly',     'ariaRequired',
  'ariaRoleDescription', 'ariaRowCount',     'ariaRowIndex',
  'ariaRowIndexText',    'ariaRowSpan',      'ariaSelected',
  'ariaSetSize',         'ariaSort',         'ariaValueMax',
  'ariaValueMin',        'ariaValueNow',     'ariaValueText',
];

/**
 * Accessibility Object Model aria attribute name types.
 */
export type ARIAAttribute = ARIAPropertyToAttribute<ARIAProperty>;

/**
 * Accessibility Object Model aria attributes.
 */
export const ARIA_ATTRIBUTES = ARIA_PROPERTIES.map(ariaPropertyToAttribute);

/**
 * Checks if an attribute is one of the AOM aria attributes.
 *
 * @example
 * isAriaAttribute('aria-label'); // true
 *
 * @param attribute The attribute to check.
 * @return True if the attribute is an aria attribute, or false if not.
 */
export function isAriaAttribute(attribute: string): attribute is ARIAAttribute {
  return attribute.startsWith('aria-');
}

/**
 * Converts an AOM aria property into its corresponding attribute.
 *
 * @example
 * ariaPropertyToAttribute('ariaLabel'); // 'aria-label'
 *
 * @param property The aria property.
 * @return The aria attribute.
 */
export function ariaPropertyToAttribute<K extends ARIAProperty|'role'>(
    property: K) {
  return property
             .replace('aria', 'aria-')
             // IDREF attributes also include an "Element" or "Elements" suffix
             .replace(/Elements?/g, '')
             .toLowerCase() as ARIAPropertyToAttribute<K>;
}

// Converts an `ariaFoo` string type to an `aria-foo` string type.
type ARIAPropertyToAttribute<K extends string> =
    K extends `aria${infer Suffix}Element${infer OptS}` ?
    `aria-${Lowercase < Suffix >}` :
    K extends `aria${infer Suffix}` ? `aria-${Lowercase < Suffix >}` : K;
