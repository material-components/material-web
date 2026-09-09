/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {consume} from '@lit/context';
import {CSSResultOrNative, LitElement, css, html} from 'lit';
import {property} from 'lit/decorators.js';
import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../internal/events/dispatch-hooks.js';
import {
  mixinCustomStateSet,
  toggleState,
} from '../../behaviors/custom-state-set.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';
import {mixinFocusable} from '../../behaviors/focusable.js';
import {sharedCommandInvokerActivationSteps} from '../command.js';
import {AriaMenulistElement, ancestorMenulistContext} from './menulist.js';

/** Private property key for the `ancestorMenulist` context. */
const ancestorMenulist = Symbol('ancestorMenulist');

const baseClass = mixinCustomStateSet(
  mixinFocusable(mixinElementInternals(LitElement)),
);

/**
 * An element implementing the proposed `<menuitem>` built-in element.
 *
 * @cssstate enabled - True when the item is enabled.
 * @cssstate disabled - True when the item is disabled.
 */
export class AriaMenuitemElement extends baseClass {
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: inline-flex;
      }
    `,
  ];

  @consume({context: ancestorMenulistContext, subscribe: true})
  [ancestorMenulist]?: AriaMenulistElement;

  @property({type: Boolean, reflect: true, noAccessor: true})
  get disabled() {
    return this[internals].ariaDisabled === 'true';
  }
  set disabled(value: boolean) {
    const oldValue = this.disabled;
    value = Boolean(value);
    this[internals].ariaDisabled = String(value);
    this[toggleState]('disabled', value);
    this[toggleState]('enabled', !value);
    this.requestUpdate('disabled', oldValue);
  }

  constructor() {
    super();
    this[internals].role = 'menuitem';
    this.disabled = false;

    setupDispatchHooks(this, 'keydown', 'click');
    this.addEventListener('keydown', (event: KeyboardEvent) => {
      afterDispatch(event, () => {
        if (event.defaultPrevented) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          this.click();
        }
      });
    });
    this.addEventListener('click', (event: Event) => {
      afterDispatch(event, () => {
        if (event.defaultPrevented || this.disabled) {
          return;
        }

        this[ancestorMenulist]?.hidePopover();
        sharedCommandInvokerActivationSteps(this, event);
      });
    });
  }

  override render() {
    return html`<slot></slot>`;
  }

  override click() {
    if (!this.disabled) {
      super.click();
    }
  }
}
