/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {consume} from '@lit/context';
import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
  nothing,
  PropertyValues,
} from 'lit';
import {property, state} from 'lit/decorators.js';
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
import {
  fabMenuContext,
  type FabMenuContext,
  fabMenuItem,
  type FabMenuItem,
  fabMenuItemCheckable,
  type FabMenuItemCheckable,
} from './fab-menu.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import fabMenuStyles from './fab-menu.css' with {type: 'css'}; // github-only
// import {styles as fabMenuStyles} from './fab-menu.cssresult.js'; // google3-only

// Separate variable needed for closure.
const baseClass = mixinElementInternals(mixinFocusable(LitElement));

/**
 * A Material Design FAB menu item component.
 *
 * @slot - Used to display the item's primary label.
 * @slot leading - Used to display icons and content before the item's main content.
 * @slot supporting-text - Used to display supporting text below the main label.
 * @slot trailing-text - Used to display metadata or text after the item's main content.
 * @slot trailing - Used to display icons and content after the item's main content.
 * @fires {Event} change - Fired when a checkable menu item is checked or unchecked. --bubbles
 * @fires {InputEvent} input - Fired when a checkable menu item is checked or unchecked. --bubbles --composed
 * @csspart menu-item - The menu item's root element.
 * @cssprop --between-space
 * @cssprop --bottom-space
 * @cssprop --container-color
 * @cssprop --height
 * @cssprop --inner-corner-size
 * @cssprop --label-text
 * @cssprop --label-text-axes
 * @cssprop --label-text-color
 * @cssprop --label-text-tracking
 * @cssprop --leading-icon-color
 * @cssprop --leading-icon-size
 * @cssprop --leading-space
 * @cssprop --outer-corner-size
 * @cssprop --shape
 * @cssprop --supporting-text
 * @cssprop --supporting-text-axes
 * @cssprop --supporting-text-color
 * @cssprop --supporting-text-tracking
 * @cssprop --top-space
 * @cssprop --trailing-icon-color
 * @cssprop --trailing-icon-size
 * @cssprop --trailing-space
 * @cssprop --trailing-supporting-text
 * @cssprop --trailing-supporting-text-axes
 * @cssprop --trailing-supporting-text-color
 * @cssprop --trailing-supporting-text-tracking
 */
export class FabMenuItemElement extends baseClass implements FabMenuItem {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    fabMenuStyles,
    css`
      :host {
        display: flex;
        outline: none;
      }
    `,
  ];

  @property({type: Boolean, reflect: true}) checked = false;
  @property({type: Boolean, reflect: true}) disabled = false;
  @property({reflect: true}) checkable?: FabMenuItemCheckable | null = null;

  @property({type: Boolean})
  get selected(): boolean {
    return this.checked;
  }
  set selected(value: boolean) {
    this.checked = value;
  }

  get effectiveCheckable(): FabMenuItemCheckable | null {
    return this.checkable ?? this.groupCheckable ?? null;
  }

  get menu(): HTMLElement | null {
    return this.menuContextInternal?.menu || null;
  }

  private menuContextInternal?: FabMenuContext;

  @consume({context: fabMenuContext, subscribe: true})
  set menuContext(context: FabMenuContext | undefined) {
    if (this.menuContextInternal === context) return;
    if (this.menuContextInternal) {
      this.menuContextInternal.itemDisconnected(this);
    }
    this.menuContextInternal = context;
    if (this.isConnected && context) {
      context.itemConnected(this);
    }
  }

  get menuContext(): FabMenuContext | undefined {
    return this.menuContextInternal;
  }

  @state()
  @consume({context: fabMenuItemCheckable, subscribe: true})
  private readonly groupCheckable?: FabMenuItemCheckable | null;

  constructor() {
    super();
    this[internals].role = 'menuitem';
    setupDispatchHooks(this, 'click');

    this.addEventListener('click', (e) => {
      if (this.disabled) {
        e.stopImmediatePropagation();
        return;
      }

      const effectiveCheckable = this.effectiveCheckable;
      const wasChecked = this.checked;

      afterDispatch(e, () => {
        if (e.defaultPrevented) return;
        if (effectiveCheckable) {
          if (effectiveCheckable === 'single') {
            this.checked = true;
            const items = this.menuContextInternal?.getItems() ?? [];
            for (const item of items) {
              if (
                item !== this &&
                item.effectiveCheckable === 'single' &&
                item.checked
              ) {
                item.checked = false;
              }
            }
          } else {
            this.checked = !wasChecked;
          }
          if (this.checked !== wasChecked) {
            this.dispatchEvent(
              new Event('change', {bubbles: true, composed: true}),
            );
            this.dispatchEvent(
              new InputEvent('input', {bubbles: true, composed: true}),
            );
          }
        }

        if (effectiveCheckable !== 'multiple') {
          this.menuContextInternal?.close();
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
    this.menuContextInternal?.itemConnected(this);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.menuContextInternal?.itemDisconnected(this);
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    const effectiveCheckable = this.effectiveCheckable;
    if (effectiveCheckable === 'single') {
      this[internals].role = 'menuitemradio';
    } else if (effectiveCheckable === 'multiple') {
      this[internals].role = 'menuitemcheckbox';
    } else {
      this[internals].role = 'menuitem';
    }

    if (effectiveCheckable) {
      this[internals].ariaChecked = String(this.checked);
    } else {
      this[internals].ariaChecked = null;
    }

    this[internals].ariaDisabled = String(this.disabled);
    this[isFocusable] = !this.disabled;
  }

  protected override render() {
    return html`<div
      part="menu-item"
      class="${fabMenuItem({
        checked: this.checked,
        disabled: this.disabled,
      })} fab-menu-item-host ripple-host focus-ring-host">
      ${this.renderContent()}
    </div>`;
  }

  private renderContent() {
    return html`
      <span class="fab-menu-item-leading">
        <slot name="leading" ${hasSlotted()}>
          ${this.checked ? html`<span class="checkmark">check</span>` : nothing}
        </slot>
      </span>
      <span class="fab-menu-item-content">
        <slot></slot>
        <slot
          name="supporting-text"
          class="fab-menu-item-supporting-text"></slot>
      </span>
      <span class="fab-menu-item-trailing">
        <slot
          name="trailing-text"
          class="fab-menu-item-trailing-text"
          ${hasSlotted()}></slot>
        <slot name="trailing" ${hasSlotted()}></slot>
      </span>
    `;
  }
}
