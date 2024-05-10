/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, ReactiveElement, isServer} from 'lit';

import {MixinBase, MixinReturn} from '../../labs/behaviors/mixin.js';
import {
  ARIA_PROPERTIES,
  ariaPropertyToAttribute,
  isAriaAttribute,
} from './aria.js';

// Private symbols
const privateIgnoreAttributeChangesFor = Symbol(
  'privateIgnoreAttributeChangesFor',
);

/**
 * Mixes in aria delegation for elements that delegate focus and aria to inner
 * shadow root elements.
 *
 * This mixin fixes invalid aria announcements with shadow roots, caused by
 * duplicate aria attributes on both the host and the inner shadow root element.
 *
 * Note: this mixin **does not yet support** ID reference attributes, such as
 * `aria-labelledby` or `aria-controls`.
 *
 * @example
 * ```ts
 * class MyButton extends mixinDelegatesAria(LitElement) {
 *   static shadowRootOptions = {mode: 'open', delegatesFocus: true};
 *
 *   render() {
 *     return html`
 *       <button aria-label=${this.ariaLabel || nothing}>
 *         <slot></slot>
 *       </button>
 *     `;
 *   }
 * }
 * ```
 * ```html
 * <my-button aria-label="Plus one">+1</my-button>
 * ```
 *
 * Use `ARIAMixinStrict` for lit analyzer strict types, such as the "role"
 * attribute.
 *
 * @example
 * ```ts
 * return html`
 *   <button role=${(this as ARIAMixinStrict).role || nothing}>
 *     <slot></slot>
 *   </button>
 * `;
 * ```
 *
 * In the future, updates to the Accessibility Object Model (AOM) will provide
 * built-in aria delegation features that will replace this mixin.
 *
 * @param base The class to mix functionality into.
 * @return The provided class with aria delegation mixed in.
 */
export function mixinDelegatesAria<T extends MixinBase<LitElement>>(
  base: T,
): MixinReturn<T> {
  if (isServer) {
    // Don't shift attributes when running with lit-ssr. The SSR renderer
    // implements a subset of DOM APIs, including the methods this mixin
    // overrides, causing errors. We don't need to shift on the server anyway
    // since elements will shift attributes immediately once they hydrate.
    return base;
  }

  abstract class WithDelegatesAriaElement extends base {
    [privateIgnoreAttributeChangesFor] = new Set();

    override attributeChangedCallback(
      name: string,
      oldValue: string | null,
      newValue: string | null,
    ) {
      if (!isAriaAttribute(name)) {
        super.attributeChangedCallback(name, oldValue, newValue);
        return;
      }

      if (this[privateIgnoreAttributeChangesFor].has(name)) {
        return;
      }

      // Don't trigger another `attributeChangedCallback` once we remove the
      // aria attribute from the host. We check the explicit name of the
      // attribute to ignore since `attributeChangedCallback` can be called
      // multiple times out of an expected order when hydrating an element with
      // multiple attributes.
      this[privateIgnoreAttributeChangesFor].add(name);
      this.removeAttribute(name);
      this[privateIgnoreAttributeChangesFor].delete(name);
      const dataProperty = ariaAttributeToDataProperty(name);
      if (newValue === null) {
        delete this.dataset[dataProperty];
      } else {
        this.dataset[dataProperty] = newValue;
      }

      this.requestUpdate(ariaAttributeToDataProperty(name), oldValue);
    }

    override getAttribute(name: string) {
      if (isAriaAttribute(name)) {
        return super.getAttribute(ariaAttributeToDataAttribute(name));
      }

      return super.getAttribute(name);
    }

    override removeAttribute(name: string) {
      super.removeAttribute(name);
      if (isAriaAttribute(name)) {
        super.removeAttribute(ariaAttributeToDataAttribute(name));
        // Since `aria-*` attributes are already removed`, we need to request
        // an update because `attributeChangedCallback` will not be called.
        this.requestUpdate();
      }
    }
  }

  setupDelegatesAriaProperties(
    WithDelegatesAriaElement as unknown as typeof ReactiveElement,
  );

  return WithDelegatesAriaElement;
}

/**
 * Overrides the constructor's native `ARIAMixin` properties to ensure that
 * aria properties reflect the values that were shifted to a data attribute.
 *
 * @param ctor The `ReactiveElement` constructor to patch.
 */
function setupDelegatesAriaProperties(ctor: typeof ReactiveElement) {
  for (const ariaProperty of ARIA_PROPERTIES) {
    // The casing between ariaProperty and the dataProperty may be different.
    // ex: aria-haspopup -> ariaHasPopup
    const ariaAttribute = ariaPropertyToAttribute(ariaProperty);
    // ex: aria-haspopup -> data-aria-haspopup
    const dataAttribute = ariaAttributeToDataAttribute(ariaAttribute);
    // ex: aria-haspopup -> dataset.ariaHaspopup
    const dataProperty = ariaAttributeToDataProperty(ariaAttribute);

    // Call `ReactiveElement.createProperty()` so that the `aria-*` and `data-*`
    // attributes are added to the `static observedAttributes` array. This
    // triggers `attributeChangedCallback` for the delegates aria mixin to
    // handle.
    ctor.createProperty(ariaProperty, {
      attribute: ariaAttribute,
      noAccessor: true,
    });
    ctor.createProperty(Symbol(dataAttribute), {
      attribute: dataAttribute,
      noAccessor: true,
    });

    // Re-define the `ARIAMixin` properties to handle data attribute shifting.
    // It is safe to use `Object.defineProperty` here because the properties
    // are native and not renamed.
    // tslint:disable-next-line:ban-unsafe-reflection
    Object.defineProperty(ctor.prototype, ariaProperty, {
      configurable: true,
      enumerable: true,
      get(this: ReactiveElement): string | null {
        return this.dataset[dataProperty] ?? null;
      },
      set(this: ReactiveElement, value: string | null): void {
        const prevValue = this.dataset[dataProperty] ?? null;
        if (value === prevValue) {
          return;
        }

        if (value === null) {
          delete this.dataset[dataProperty];
        } else {
          this.dataset[dataProperty] = value;
        }

        this.requestUpdate(ariaProperty, prevValue);
      },
    });
  }
}

function ariaAttributeToDataAttribute(ariaAttribute: string) {
  // aria-haspopup -> data-aria-haspopup
  return `data-${ariaAttribute}`;
}

function ariaAttributeToDataProperty(ariaAttribute: string) {
  // aria-haspopup -> dataset.ariaHaspopup
  return ariaAttribute.replace(/-\w/, (dashLetter) =>
    dashLetter[1].toUpperCase(),
  );
}
