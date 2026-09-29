/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative, LitElement, PropertyValues, css, html} from 'lit';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';
import {sharedSlottedContentStyles} from './shared-slotted-content.js';

const baseClass = mixinElementInternals(LitElement);

/** An element implementing the proposed `<menubar>` built-in element. */
export class AriaMenubarElement extends baseClass {
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: inline-flex;
        flex-direction: row;
        width: max-content;
        background-color: transparent;
        gap: 0.5em;
        border-width: 1px;
        border-style: solid;
        border-color: currentcolor;
        border-image: none;
        border-radius: 0.25em;
        padding: 0.25em;
      }
    `,
    sharedSlottedContentStyles,
  ];

  constructor() {
    super();
    this[internals].role = 'menubar';
    this[internals].ariaOrientation = 'horizontal';
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (!this.hasAttribute('focusgroup')) {
      this.setAttribute('focusgroup', 'menubar');
    }
  }

  override render() {
    return html`<slot></slot>`;
  }
}
