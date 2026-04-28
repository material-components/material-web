/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {consume} from '@lit/context';
import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../../internal/events/dispatch-hooks.js';
import {
  internals,
  mixinElementInternals,
} from '../../../behaviors/element-internals.js';
import {isFocusable, mixinFocusable} from '../../../behaviors/focusable.js';
import {hasSlotted} from '../shared/has-slotted.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import menuStyles from './menu.css' with {type: 'css'}; // github-only
// import {styles as menuStyles} from './menu.cssresult.js'; // google3-only

import {
  menuContext,
  type MenuContext,
  menuItem,
  menuItemCheckable,
  type MenuItemCheckable,
} from './menu.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-menu-item': MenuItem;
  }
}

// Separate variable needed for closure.
const baseClass = mixinElementInternals(mixinFocusable(LitElement));

/**
 * A Material Design menu item component.
 */
@customElement('md-menu-item')
export class MenuItem extends baseClass {
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    menuStyles,
    css`
      :host {
        display: flex;
        outline: none;
      }
      .menu-item {
        flex: 1;
      }
      :is(.menu-item-leading, .menu-item-trailing):not(
        :has(.has-slotted, .checkmark)
      ) {
        display: none;
      }
      slot:not(.has-slotted) {
        display: contents;
      }
      .checkmark {
        display: flex;
        font: var(--md-icon-size) var(--md-icon-font);
      }
    `,
  ];

  @property({type: Boolean, reflect: true}) checked = false;
  @property({type: Boolean, reflect: true}) disabled = false;

  get menu(): HTMLElement | null {
    return this.menuContext?.menu || null;
  }

  @consume({context: menuContext, subscribe: true})
  private readonly menuContext?: MenuContext;

  @state()
  @consume({context: menuItemCheckable, subscribe: true})
  private readonly checkable?: MenuItemCheckable | null;

  constructor() {
    super();
    this[internals].role = 'menuitem';
    setupDispatchHooks(this, 'click');
    this.addEventListener('click', (e) => {
      if (this.disabled) {
        e.stopImmediatePropagation();
        return;
      }

      const wasChecked = this.checked;
      afterDispatch(e, () => {
        if (e.defaultPrevented) return;
        if (this.checkable) {
          this.checked = !wasChecked;
          this.dispatchEvent(new Event('change', {bubbles: true}));
          this.dispatchEvent(
            new InputEvent('input', {bubbles: true, composed: true}),
          );
        }

        if (this.checkable !== 'multiple') {
          this.menu?.hidePopover();
        }
      });
    });

    this.addEventListener('keydown', (e: KeyboardEvent) => {
      if (this.disabled) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this.menuContext?.itemConnected(this);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.menuContext?.itemDisconnected(this);
  }

  protected override render() {
    return html`<div
      part="menu-item"
      class="${menuItem({
        checked: this.checked,
        disabled: this.disabled,
      })} ripple-host focus-ring-host">
      ${this.renderContent()}
    </div>`;
  }

  private renderContent() {
    return html`
      <span class="menu-item-leading">
        <slot name="leading" ${hasSlotted()}>
          ${this.checked ? html`<span class="checkmark">check</span>` : nothing}
        </slot>
      </span>
      <span class="menu-item-content">
        <slot></slot>
        <slot name="supporting-text" class="menu-item-supporting-text"></slot>
      </span>
      <span class="menu-item-trailing">
        <slot
          name="trailing-text"
          class="menu-item-trailing-text"
          ${hasSlotted()}></slot>
        <slot name="trailing" ${hasSlotted()}></slot>
      </span>
    `;
  }

  protected override updated() {
    if (this.checkable === 'single') {
      this[internals].role = 'menuitemradio';
    } else if (this.checkable === 'multiple') {
      this[internals].role = 'menuitemcheckbox';
    } else {
      this[internals].role = 'menuitem';
    }

    if (this.checkable) {
      this[internals].ariaChecked = String(this.checked);
    } else {
      this[internals].ariaChecked = null;
    }

    this[internals].ariaDisabled = String(this.disabled);
    this[isFocusable] = !this.disabled;
  }
}
