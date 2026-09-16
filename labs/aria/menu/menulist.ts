/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="../../../types/popover.d.ts" />

import {CSSResultOrNative, LitElement, css, html} from 'lit';
import {property} from 'lit/decorators.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';
import {sharedSlottedContentStyles} from './shared-slotted-content.js';

// `focus` is defined on `HTMLElement` and `SVGElement` directly, not `Element`.
interface MaybeFocusableElement extends Element {
  focus?: HTMLElement['focus'];
}

const baseClass = mixinElementInternals(LitElement);

/**
 * An element implementing the proposed `<menulist>` built-in element.
 */
export class AriaMenulistElement extends baseClass {
  static override styles: CSSResultOrNative[] = [
    sharedSlottedContentStyles,
    css`
      /* Unset UA |[popover]| styles. */
      @layer {
        :host([popover]) {
          position: unset;
          width: unset;
          height: unset;
          color: unset;
          background-color: unset;
          inset: unset;
          margin: unset;
          border: unset;
          border-image: unset;
          padding: unset;
          overflow: unset;
        }

        :host([popover]:popover-open) {
          display: unset;
          overlay: unset;
        }
      }

      :host {
        display: block;
        position: fixed;
        width: max-content;
        max-block-size: stretch;
        color: canvastext;
        background-color: canvas;
        margin: 0px;
        inset: auto;
        overflow: auto;
        border: 1px solid currentColor;
        border-image: none;
        padding: 0.25em;

        /* This should really only apply when the implicit anchor is a menuitem
         * in a menubar, but applies to buttons too? */
        position-area: block-end span-inline-end;
      }

      :host(:not(:popover-open)) {
        display: none;
      }
    `,
  ];

  @property({reflect: true})
  override popover = 'auto';

  @property({reflect: true})
  focusGroup = 'menu';

  constructor() {
    super();

    this[internals].role = 'menu';
    this[internals].ariaOrientation = 'vertical';
    this.addEventListener('toggle', this.handleToggle.bind(this));
    this.addEventListener('focusout', this.handleFocusout.bind(this));
  }

  override render() {
    return html`<slot></slot>`;
  }

  private opener: MaybeFocusableElement | null = null;

  private handleToggle(event: ToggleEvent) {
    if (event.newState === 'open') {
      this.opener = event.source as MaybeFocusableElement | null;
    } else if (event.newState === 'closed' && this.matches(':focus-within')) {
      // When closing, restore focus if focus remained in the menulist (e.g.
      // during _keyboard_ light dismiss).
      this.opener?.focus?.();
    }
  }

  private handleFocusout() {
    if (!this.matches(':focus-within')) {
      this.hidePopover();
    }
  }
}
