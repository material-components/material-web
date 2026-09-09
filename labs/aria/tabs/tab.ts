/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultGroup, html, isServer, LitElement} from 'lit';
import {property} from 'lit/decorators.js';

import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../internal/events/dispatch-hooks.js';
import {queryAssociatedById} from '../../aria/query-associated.js';
import {
  mixinCustomStateSet,
  toggleState,
} from '../../behaviors/custom-state-set.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';
import {mixinFocusable} from '../../behaviors/focusable.js';

const baseClass = mixinFocusable(
  mixinCustomStateSet(mixinElementInternals(LitElement)),
);

/**
 * An ARIA tab element.
 *
 * @cssstate selected - Whether the tab is selected.
 */
export class AriaTabElement extends baseClass {
  static override styles: CSSResultGroup = css`
    :host {
      display: inline-block;
      cursor: pointer;
    }
  `;

  /**
   * ID of the associated `md-aria-tabpanel` element.
   */
  @property({type: String, reflect: true, noAccessor: true})
  get tabpanel(): string {
    return this.tabpanelElement?.id || '';
  }
  set tabpanel(value: string) {
    this.tabpanelElement = queryAssociatedById(this, value);
  }

  /**
   * The tabpanel element that is controlled by this tab.
   */
  get tabpanelElement(): Element | null {
    return this[internals].ariaControlsElements?.[0] || null;
  }
  set tabpanelElement(value: Element | null) {
    const previousValue = this.tabpanelElement;
    if (value === previousValue) return;
    this[internals].ariaControlsElements = value ? [value] : [];
  }

  /**
   * Whether the tab is selected.
   */
  @property({type: Boolean, reflect: true})
  get selected(): boolean {
    return this[internals].ariaSelected === 'true';
  }
  set selected(value: boolean) {
    value = Boolean(value); // coerce for safety
    this[internals].ariaSelected = String(value);
    this[toggleState]('selected', value);
  }

  constructor() {
    super();
    if (isServer) return;
    this[internals].role = 'tab';
    setupDispatchHooks(this, 'keydown');
    this.addEventListener('keydown', (event: KeyboardEvent) => {
      afterDispatch(event, () => {
        if (event.defaultPrevented) {
          return;
        }

        if (event.key === 'Enter' || event.key === ' ') {
          // Prevent default behavior such as scrolling when pressing spacebar.
          event.preventDefault();
          this.click();
        }
      });
    });
  }

  protected override render() {
    return html`<slot></slot>`;
  }
}
