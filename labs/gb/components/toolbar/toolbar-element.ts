/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement} from 'lit';
import {property} from 'lit/decorators.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import toolbarStyles from './toolbar.css' with {type: 'css'}; // github-only
// import {styles as toolbarStyles} from './toolbar.cssresult.js'; // google3-only

import {type ToolbarColor, type ToolbarOrientation, toolbar} from './toolbar.js';

/**
 * A Material Design gBreeze toolbar component.
 *
 * @slot - Used to display toolbar items (buttons, icon buttons, or custom content).
 * @slot leading - Used to display leading toolbar items.
 * @slot trailing - Used to display trailing toolbar items.
 * @csspart toolbar - The toolbar's root container.
 * @cssprop --button-container-color
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-leading-space
 * @cssprop --container-shape
 * @cssprop --container-spacing
 * @cssprop --container-trailing-space
 * @cssprop --docked-container-elevation
 * @cssprop --docked-container-height
 * @cssprop --docked-container-leading-space
 * @cssprop --docked-container-max-spacing
 * @cssprop --docked-container-min-spacing
 * @cssprop --docked-container-shape
 * @cssprop --docked-container-trailing-space
 * @cssprop --horizontal-container-height
 * @cssprop --icon-color
 * @cssprop --label-text-color
 * @cssprop --min-button-size
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 * @cssprop --selected-button-container-color
 * @cssprop --selected-icon-color
 * @cssprop --selected-label-text-color
 * @cssprop --vertical-container-width
 */
export class ToolbarElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    toolbarStyles,
    css`
      :host {
        display: inline-flex;
      }

      :host([docked]) {
        display: flex;
        width: 100%;
      }

      :host([docked]) [part='toolbar'] {
        width: 100%;
      }
    `,
  ];

  protected readonly internals = this.attachInternals();

  constructor() {
    super();
    this.internals.role = 'toolbar';
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('focusin', this.handleFocusIn);
  }

  /** The color scheme of the toolbar. */
  @property({reflect: true}) color: ToolbarColor = 'standard';

  /** The layout orientation. */
  @property({reflect: true}) orientation: ToolbarOrientation = 'horizontal';

  /** Whether the toolbar is docked across full width. */
  @property({type: Boolean, reflect: true}) docked = false;

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, toolbarStyles);
  }

  protected override willUpdate() {
    if (this.docked && this.orientation !== 'horizontal') {
      this.orientation = 'horizontal';
    }
    this.internals.ariaOrientation = this.orientation;
  }

  protected override render() {
    return html`
      <div
        part="toolbar"
        class="${toolbar({
          color: this.color,
          orientation: this.docked ? 'horizontal' : this.orientation,
          docked: this.docked,
        })}">
        <slot name="leading" @slotchange=${this.handleSlotChange}></slot>
        <slot @slotchange=${this.handleSlotChange}></slot>
        <slot name="trailing" @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }

  private getFocusableItems(): HTMLElement[] {
    const candidates = Array.from(
      this.querySelectorAll<HTMLElement>(
        'md-gb-button, md-gb-icon-button, button, [role="button"], a[href]',
      ),
    );
    return candidates.filter(
      (item) =>
        !item.hasAttribute('disabled') && !(item as HTMLButtonElement).disabled,
    );
  }

  private setActiveItem(
    activeItem: HTMLElement,
    items = this.getFocusableItems(),
  ) {
    for (const item of items) {
      item.tabIndex = item === activeItem ? 0 : -1;
    }
  }

  private updateRovingTabIndex() {
    const allItems = Array.from(
      this.querySelectorAll<HTMLElement>(
        'md-gb-button, md-gb-icon-button, button, [role="button"], a[href]',
      ),
    );
    const enabledItems = this.getFocusableItems();
    const enabledSet = new Set(enabledItems);

    for (const item of allItems) {
      if (!enabledSet.has(item)) {
        item.tabIndex = -1;
      }
    }

    if (enabledItems.length === 0) return;

    const currentActive =
      enabledItems.find((item) => item.matches(':focus, :focus-within')) ??
      enabledItems.find((item) => item.tabIndex === 0) ??
      enabledItems[0];

    this.setActiveItem(currentActive, enabledItems);
  }

  private handleFocusIn(event: FocusEvent) {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const items = this.getFocusableItems();
    const matched = items.find(
      (item) => item === target || item.contains(target),
    );
    if (matched) {
      this.setActiveItem(matched, items);
    }
  }

  private handleKeyDown(event: KeyboardEvent) {
    const items = this.getFocusableItems();
    if (items.length === 0) return;

    const isVertical = !this.docked && this.orientation === 'vertical';
    const isRtl = !isVertical && getComputedStyle(this).direction === 'rtl';
    const nextKeys = isVertical
      ? ['ArrowDown', 'ArrowRight']
      : [isRtl ? 'ArrowLeft' : 'ArrowRight', 'ArrowDown'];
    const prevKeys = isVertical
      ? ['ArrowUp', 'ArrowLeft']
      : [isRtl ? 'ArrowRight' : 'ArrowLeft', 'ArrowUp'];

    const currentIndex = items.findIndex(
      (item) => item.matches(':focus, :focus-within') || item.tabIndex === 0,
    );
    const startIndex = currentIndex === -1 ? 0 : currentIndex;

    let nextIndex = -1;
    if (nextKeys.includes(event.key)) {
      nextIndex = (startIndex + 1) % items.length;
    } else if (prevKeys.includes(event.key)) {
      nextIndex = (startIndex - 1 + items.length) % items.length;
    } else if (event.key === 'Home') {
      nextIndex = 0;
    } else if (event.key === 'End') {
      nextIndex = items.length - 1;
    }

    if (nextIndex !== -1) {
      event.preventDefault();
      const targetItem = items[nextIndex];
      this.setActiveItem(targetItem, items);
      targetItem.focus();
    }
  }

  private handleSlotChange() {
    this.updateRovingTabIndex();
  }
}
