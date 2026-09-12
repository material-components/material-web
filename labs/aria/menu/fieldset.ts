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
import {sharedSlottedContentStyles} from './shared-slotted-content.js';

declare global {
  interface HTMLElementEventMap {
    'checkable-changed': CustomEvent<{value: 'single' | 'multiple' | null}>;
    'disabled-changed': CustomEvent<{value: boolean}>;
  }
}

const baseClass = mixinElementInternals(LitElement);

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

  private internalCheckable: 'single' | 'multiple' | null = null;
  private internalDisabled = false;

  /**
   * Whether or not menuitems in this fieldset are checkable, and if they are
   * exclusively checkable.
   */
  @property({type: String, reflect: true})
  get checkable(): 'single' | 'multiple' | null {
    return this.internalCheckable;
  }
  set checkable(value: 'single' | 'multiple' | null) {
    if (value === this.internalCheckable) {
      return;
    }

    const oldValue = this.internalCheckable;
    this.internalCheckable = value;
    this.dispatchEvent(new CustomEvent('checkable-changed', {detail: {value}}));
    this.requestUpdate('checkable', oldValue);
  }

  /**
   * Whether or not menuitems in this fieldset are disabled.
   */
  @property({type: Boolean, reflect: true})
  get disabled(): boolean {
    return this.internalDisabled;
  }
  set disabled(value: boolean) {
    if (value === this.internalDisabled) {
      return;
    }

    const oldValue = this.internalDisabled;
    this.internalDisabled = value;
    this.dispatchEvent(new CustomEvent('disabled-changed', {detail: {value}}));
    this.requestUpdate('disabled', oldValue);
  }

  constructor() {
    super();
    this[internals].role = 'group';
  }

  override render() {
    return html`<slot></slot>`;
  }
}
