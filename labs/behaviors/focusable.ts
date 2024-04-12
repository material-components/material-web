/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement} from 'lit';
import {property} from 'lit/decorators.js';

import {MixinBase, MixinReturn} from './mixin.js';

/**
 * An element that can enable and disable `tabindex` focusability.
 */
export interface Focusable {
  /**
   * Whether or not the element can be focused. Defaults to true. Set to false
   * to disable focusing (unless a user has set a `tabindex`).
   */
  [isFocusable]: boolean;
}

/**
 * A property symbol that indicates whether or not a `Focusable` element can be
 * focused.
 */
export const isFocusable = Symbol('isFocusable');

const privateIsFocusable = Symbol('privateIsFocusable');
const externalTabIndex = Symbol('externalTabIndex');
const isUpdatingTabIndex = Symbol('isUpdatingTabIndex');
const updateTabIndex = Symbol('updateTabIndex');

/**
 * Mixes in focusable functionality for a class.
 *
 * Elements can enable and disable their focusability with the `isFocusable`
 * symbol property. Changing `tabIndex` will trigger a lit render, meaning
 * `this.tabIndex` can be used in template expressions.
 *
 * This mixin will preserve externally-set tabindices. If an element turns off
 * focusability, but a user sets `tabindex="0"`, it will still be focusable.
 *
 * To remove user overrides and restore focusability control to the element,
 * remove the `tabindex` attribute.
 *
 * @param base The class to mix functionality into.
 * @return The provided class with `Focusable` mixed in.
 */
export function mixinFocusable<T extends MixinBase<LitElement>>(
  base: T,
): MixinReturn<T, Focusable> {
  abstract class FocusableElement extends base implements Focusable {
    @property({noAccessor: true})
    declare tabIndex: number;

    get [isFocusable]() {
      return this[privateIsFocusable];
    }

    set [isFocusable](value: boolean) {
      if (this[isFocusable] === value) {
        return;
      }

      this[privateIsFocusable] = value;
      this[updateTabIndex]();
    }

    [privateIsFocusable] = true;
    [externalTabIndex]: number | null = null;
    [isUpdatingTabIndex] = false;

    override connectedCallback() {
      super.connectedCallback();
      this[updateTabIndex]();
    }

    override attributeChangedCallback(
      name: string,
      old: string | null,
      value: string | null,
    ) {
      if (name !== 'tabindex') {
        super.attributeChangedCallback(name, old, value);
        return;
      }

      this.requestUpdate('tabIndex', Number(old ?? -1));
      if (this[isUpdatingTabIndex]) {
        // Not an externally-initiated update.
        return;
      }

      if (!this.hasAttribute('tabindex')) {
        // User removed the attribute, can now use internal tabIndex
        this[externalTabIndex] = null;
        this[updateTabIndex]();
        return;
      }

      this[externalTabIndex] = this.tabIndex;
    }

    [updateTabIndex]() {
      const internalTabIndex = this[isFocusable] ? 0 : -1;
      const computedTabIndex = this[externalTabIndex] ?? internalTabIndex;

      this[isUpdatingTabIndex] = true;
      this.tabIndex = computedTabIndex;
      this[isUpdatingTabIndex] = false;
    }
  }

  return FocusableElement;
}
