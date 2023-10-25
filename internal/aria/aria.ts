/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {isServer, ReactiveElement} from 'lit';

/**
 * Accessibility Object Model reflective aria property name types.
 */
export type ARIAProperty = Exclude<keyof ARIAMixin, 'role'>;

/**
 * Accessibility Object Model reflective aria properties.
 */
export const ARIA_PROPERTIES: ARIAProperty[] = [
  'ariaAtomic',
  'ariaAutoComplete',
  'ariaBusy',
  'ariaChecked',
  'ariaColCount',
  'ariaColIndex',
  'ariaColSpan',
  'ariaCurrent',
  'ariaDisabled',
  'ariaExpanded',
  'ariaHasPopup',
  'ariaHidden',
  'ariaInvalid',
  'ariaKeyShortcuts',
  'ariaLabel',
  'ariaLevel',
  'ariaLive',
  'ariaModal',
  'ariaMultiLine',
  'ariaMultiSelectable',
  'ariaOrientation',
  'ariaPlaceholder',
  'ariaPosInSet',
  'ariaPressed',
  'ariaReadOnly',
  'ariaRequired',
  'ariaRoleDescription',
  'ariaRowCount',
  'ariaRowIndex',
  'ariaRowSpan',
  'ariaSelected',
  'ariaSetSize',
  'ariaSort',
  'ariaValueMax',
  'ariaValueMin',
  'ariaValueNow',
  'ariaValueText',
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
export function ariaPropertyToAttribute<K extends ARIAProperty | 'role'>(
  property: K,
) {
  return (
    property
      .replace('aria', 'aria-')
      // IDREF attributes also include an "Element" or "Elements" suffix
      .replace(/Elements?/g, '')
      .toLowerCase() as ARIAPropertyToAttribute<K>
  );
}

// Converts an `ariaFoo` string type to an `aria-foo` string type.
type ARIAPropertyToAttribute<K extends string> =
  K extends `aria${infer Suffix}Element${infer OptS}`
    ? `aria-${Lowercase<Suffix>}`
    : K extends `aria${infer Suffix}`
    ? `aria-${Lowercase<Suffix>}`
    : K;

/**
 * An extension of `ARIAMixin` that enforces strict value types for aria
 * properties.
 *
 * This is needed for correct typing in render functions with lit analyzer.
 *
 * @example
 * render() {
 *   const {ariaLabel} = this as ARIAMixinStrict;
 *   return html`
 *     <button aria-label=${ariaLabel || nothing}>
 *       <slot></slot>
 *     </button>
 *   `;
 * }
 */
export interface ARIAMixinStrict extends ARIAMixin {
  ariaAtomic: 'true' | 'false' | null;
  ariaAutoComplete: 'none' | 'inline' | 'list' | 'both' | null;
  ariaBusy: 'true' | 'false' | null;
  ariaChecked: 'true' | 'false' | null;
  ariaColCount: `${number}` | null;
  ariaColIndex: `${number}` | null;
  ariaColSpan: `${number}` | null;
  ariaCurrent:
    | 'page'
    | 'step'
    | 'location'
    | 'date'
    | 'time'
    | 'true'
    | 'false'
    | null;
  ariaDisabled: 'true' | 'false' | null;
  ariaExpanded: 'true' | 'false' | null;
  ariaHasPopup:
    | 'false'
    | 'true'
    | 'menu'
    | 'listbox'
    | 'tree'
    | 'grid'
    | 'dialog'
    | null;
  ariaHidden: 'true' | 'false' | null;
  ariaInvalid: 'true' | 'false' | null;
  ariaKeyShortcuts: string | null;
  ariaLabel: string | null;
  ariaLevel: `${number}` | null;
  ariaLive: 'assertive' | 'off' | 'polite' | null;
  ariaModal: 'true' | 'false' | null;
  ariaMultiLine: 'true' | 'false' | null;
  ariaMultiSelectable: 'true' | 'false' | null;
  ariaOrientation: 'horizontal' | 'vertical' | 'undefined' | null;
  ariaPlaceholder: string | null;
  ariaPosInSet: `${number}` | null;
  ariaPressed: 'true' | 'false' | null;
  ariaReadOnly: 'true' | 'false' | null;
  ariaRequired: 'true' | 'false' | null;
  ariaRoleDescription: string | null;
  ariaRowCount: `${number}` | null;
  ariaRowIndex: `${number}` | null;
  ariaRowSpan: `${number}` | null;
  ariaSelected: 'true' | 'false' | null;
  ariaSetSize: `${number}` | null;
  ariaSort: 'ascending' | 'descending' | 'none' | 'other' | null;
  ariaValueMax: `${number}` | null;
  ariaValueMin: `${number}` | null;
  ariaValueNow: `${number}` | null;
  ariaValueText: string | null;
  role: ARIARole | null;
}

/**
 * Valid values for `role`.
 */
export type ARIARole =
  | 'alert'
  | 'alertdialog'
  | 'button'
  | 'checkbox'
  | 'dialog'
  | 'gridcell'
  | 'link'
  | 'log'
  | 'marquee'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'option'
  | 'progressbar'
  | 'radio'
  | 'scrollbar'
  | 'searchbox'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'switch'
  | 'tab'
  | 'tabpanel'
  | 'textbox'
  | 'timer'
  | 'tooltip'
  | 'treeitem'
  | 'combobox'
  | 'grid'
  | 'listbox'
  | 'menu'
  | 'menubar'
  | 'radiogroup'
  | 'tablist'
  | 'tree'
  | 'treegrid'
  | 'application'
  | 'article'
  | 'cell'
  | 'columnheader'
  | 'definition'
  | 'directory'
  | 'document'
  | 'feed'
  | 'figure'
  | 'group'
  | 'heading'
  | 'img'
  | 'list'
  | 'listitem'
  | 'math'
  | 'none'
  | 'note'
  | 'presentation'
  | 'region'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'separator'
  | 'table'
  | 'term'
  | 'text'
  | 'toolbar'
  | 'banner'
  | 'complementary'
  | 'contentinfo'
  | 'form'
  | 'main'
  | 'navigation'
  | 'region'
  | 'search'
  | 'doc-abstract'
  | 'doc-acknowledgments'
  | 'doc-afterword'
  | 'doc-appendix'
  | 'doc-backlink'
  | 'doc-biblioentry'
  | 'doc-bibliography'
  | 'doc-biblioref'
  | 'doc-chapter'
  | 'doc-colophon'
  | 'doc-conclusion'
  | 'doc-cover'
  | 'doc-credit'
  | 'doc-credits'
  | 'doc-dedication'
  | 'doc-endnote'
  | 'doc-endnotes'
  | 'doc-epigraph'
  | 'doc-epilogue'
  | 'doc-errata'
  | 'doc-example'
  | 'doc-footnote'
  | 'doc-foreword'
  | 'doc-glossary'
  | 'doc-glossref'
  | 'doc-index'
  | 'doc-introduction'
  | 'doc-noteref'
  | 'doc-notice'
  | 'doc-pagebreak'
  | 'doc-pagelist'
  | 'doc-part'
  | 'doc-preface'
  | 'doc-prologue'
  | 'doc-pullquote'
  | 'doc-qna'
  | 'doc-subtitle'
  | 'doc-tip'
  | 'doc-toc';

/**
 * Enables a host custom element to be the target for aria roles and attributes.
 * Components should set the `elementInternals.role` property.
 *
 * By default, aria components are tab focusable. Provide a `focusable: false`
 * option for components that should not be tab focusable, such as
 * `role="listbox"`.
 *
 * This function will also polyfill aria `ElementInternals` properties for
 * Firefox.
 *
 * @param ctor The `ReactiveElement` constructor to set up.
 * @param options Options to configure the element's host aria.
 */
export function setupHostAria(
  ctor: typeof ReactiveElement,
  {focusable}: SetupHostAriaOptions = {},
) {
  if (focusable !== false) {
    ctor.addInitializer((host) => {
      host.addController({
        hostConnected() {
          if (host.hasAttribute('tabindex')) {
            return;
          }

          host.tabIndex = 0;
        },
      });
    });
  }

  if (isServer || 'role' in Element.prototype) {
    return;
  }

  // Polyfill reflective aria properties for Firefox
  for (const ariaProperty of ARIA_PROPERTIES) {
    ctor.createProperty(ariaProperty, {
      attribute: ariaPropertyToAttribute(ariaProperty),
      reflect: true,
    });
  }

  ctor.createProperty('role', {reflect: true});
}

/**
 * Options for setting up a host element as an aria target.
 */
export interface SetupHostAriaOptions {
  /**
   * Whether or not the element can be focused with the tab key. Defaults to
   * true.
   *
   * Set this to false for aria roles that should not be tab focusable, such as
   * `role="listbox"`.
   */
  focusable?: boolean;
}

/**
 * Polyfills an element and its `ElementInternals` to support `ARIAMixin`
 * properties on internals. This is needed for Firefox.
 *
 * `setupHostAria()` must be called for the element class.
 *
 * @example
 * class XButton extends LitElement {
 *   static {
 *     setupHostAria(XButton);
 *   }
 *
 *   private internals =
 *       polyfillElementInternalsAria(this, this.attachInternals());
 *
 *   constructor() {
 *     super();
 *     this.internals.role = 'button';
 *   }
 * }
 */
export function polyfillElementInternalsAria(
  host: ReactiveElement,
  internals: ElementInternals,
) {
  if (checkIfElementInternalsSupportsAria(internals)) {
    return internals;
  }

  if (!('role' in host)) {
    throw new Error('Missing setupHostAria()');
  }

  let firstConnectedCallbacks: Array<{
    property: ARIAProperty | 'role';
    callback: () => void;
  }> = [];
  let hasBeenConnected = false;

  // Add support for Firefox, which has not yet implement ElementInternals aria
  for (const ariaProperty of ARIA_PROPERTIES) {
    let internalAriaValue: string | null = null;
    Object.defineProperty(internals, ariaProperty, {
      enumerable: true,
      configurable: true,
      get() {
        return internalAriaValue;
      },
      set(value: string | null) {
        const setValue = () => {
          internalAriaValue = value;
          if (!hasBeenConnected) {
            firstConnectedCallbacks.push({
              property: ariaProperty,
              callback: setValue,
            });
            return;
          }

          // Dynamic lookup rather than hardcoding all properties.
          // tslint:disable-next-line:no-dict-access-on-struct-type
          host[ariaProperty] = value;
        };

        setValue();
      },
    });
  }

  let internalRoleValue: string | null = null;
  Object.defineProperty(internals, 'role', {
    enumerable: true,
    configurable: true,
    get() {
      return internalRoleValue;
    },
    set(value: string | null) {
      const setRole = () => {
        internalRoleValue = value;

        if (!hasBeenConnected) {
          firstConnectedCallbacks.push({
            property: 'role',
            callback: setRole,
          });
          return;
        }

        if (value === null) {
          host.removeAttribute('role');
        } else {
          host.setAttribute('role', value);
        }
      };

      setRole();
    },
  });

  host.addController({
    hostConnected() {
      if (hasBeenConnected) {
        return;
      }

      hasBeenConnected = true;

      const propertiesSetByUser = new Set<ARIAProperty | 'role'>();

      // See which properties were set by the user on host before we apply
      // internals values as attributes to host. Needs to be done in another
      // for loop because the callbacks set these attributes on host.
      for (const {property} of firstConnectedCallbacks) {
        const wasSetByUser =
          host.getAttribute(ariaPropertyToAttribute(property)) !== null ||
          // Dynamic lookup rather than hardcoding all properties.
          // tslint:disable-next-line:no-dict-access-on-struct-type
          host[property] !== undefined;

        if (wasSetByUser) {
          propertiesSetByUser.add(property);
        }
      }

      for (const {property, callback} of firstConnectedCallbacks) {
        // If the user has set the attribute or property, do not override the
        // user's value
        if (propertiesSetByUser.has(property)) {
          continue;
        }

        callback();
      }

      // Remove strong callback references
      firstConnectedCallbacks = [];
    },
  });

  return internals;
}

// Separate function so that typescript doesn't complain about internals being
// "never".
function checkIfElementInternalsSupportsAria(internals: ElementInternals) {
  return 'role' in internals;
}
