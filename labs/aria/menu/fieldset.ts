/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative, LitElement, css, html} from 'lit';
import {property} from 'lit/decorators.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';
import {
  resetMenuitemCheckedness,
  setCheckedness,
  updateUsedValues,
} from './internal.js';
import type {AriaMenuitemElement} from './menuitem.js';
import {sharedSlottedContentStyles} from './shared-slotted-content.js';

const baseClass = mixinElementInternals(LitElement);

/** Possible values for `AriaFieldsetElement`'s `checkable` property. */
// tslint:disable-next-line:no-undefined-type-alias Defined by proposed spec
export type CheckableState = 'single' | 'multiple' | null;

/**
 * An element implementing the proposed menu behavior of `<fieldset>`.
 */
export class AriaFieldsetElement extends baseClass {
  static override styles: CSSResultOrNative[] = [
    sharedSlottedContentStyles,
    css`
      :host {
        display: block;
        margin-inline: 2px;
        border: groove 2px ThreeDFace;
        padding-block: 0.35em 0.625em;
        padding-inline: 0.75em;
        min-inline-size: min-content;
      }
    `,
  ];

  private internalDisabled = false;
  private internalCheckable: CheckableState = null;

  private get items(): Iterable<AriaMenuitemElement> {
    // This naively queries for these elements because this element doesn't need
    // to support nested fieldsets yet.
    return this.querySelectorAll('md-aria-menuitem');
  }

  @property({type: Boolean, reflect: true})
  get disabled(): boolean {
    return this.internalDisabled;
  }
  set disabled(value: boolean) {
    this.internalDisabled = value;
    for (const item of this.items) {
      // If this component is upgraded with `disabled` set in HTML,
      // `<md-aria-menuitem>` children will not be upgraded at this point.
      // These children will update themselves during `connectedCallback`.
      item[updateUsedValues]?.();
    }
  }

  @property({type: String, reflect: true})
  get checkable(): CheckableState {
    return this.internalCheckable;
  }
  set checkable(value: CheckableState) {
    if (typeof value === 'string') {
      const canonicalizedValue = value.toLowerCase();
      if (
        canonicalizedValue === 'single' ||
        canonicalizedValue === 'multiple'
      ) {
        value = canonicalizedValue;
      } else {
        value = 'multiple';
      }
    }

    this.internalCheckable = value;

    if (value === 'single') {
      this[resetMenuitemCheckedness](null);
    }

    for (const item of this.items) {
      // If this component is upgraded with `checkable` set in HTML,
      // `<md-aria-menuitem>` children will not be upgraded at this point.
      // These children will update themselves during `connectedCallback`.
      item[updateUsedValues]?.();
    }
  }

  constructor() {
    super();
    this[internals].role = 'group';
  }

  override render() {
    return html`<slot></slot>`;
  }

  /**
   * Unchecks every menuitem in this fieldset apart from the given one.
   *
   * `<md-aria-menuitem>` calls this on its cached ancestor fieldset when it
   * becomes checked in a single-checkable fieldset.
   *
   * @param checkedItem The item to leave as-is, or null to uncheck every item.
   */
  [resetMenuitemCheckedness](checkedItem: AriaMenuitemElement | null) {
    for (const item of this.items) {
      if (item !== checkedItem) {
        item[setCheckedness]?.(false);
      }
    }
  }
}
