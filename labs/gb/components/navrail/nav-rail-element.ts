/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, nothing, type PropertyValues} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {AriaTablistElement} from '../../../aria/tabs/tablist.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {setupRipple} from '../ripple/ripple.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import {styles as focusRingStyles} from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import {styles as rippleStyles} from '../ripple/ripple.cssresult.js'; // google3-only
import navRailStyles from './nav-rail.css' with {type: 'css'}; // github-only
// import {styles as navRailStyles} from './nav-rail.cssresult.js'; // google3-only

import {
  navRail,
  type NavRailAlignment,
  type NavRailItemLayout,
} from './nav-rail.js';
import {NavRailItemElement} from './nav-rail-item-element.js';

const HEADER_TOGGLE_SELECTOR = [
  'md-gb-icon-button',
  '.icon-btn',
  '.nav-rail-menu-button',
  '[data-nav-rail-toggle]',
  '[nav-rail-toggle]',
].join(', ');

const HEADER_FAB_SELECTOR = 'md-gb-fab, .fab';

/**
 * A Material Design navigation rail component.
 *
 * @slot - Used to display navigation rail items (`md-gb-nav-rail-item`).
 * @slot header - Used to display optional header controls (menu button, FAB).
 * @csspart nav-rail - The navigation rail's root container.
 * @csspart header - The navigation rail's header container.
 * @csspart menu-button - The built-in expand/collapse menu button when `collapsible`.
 * @csspart items - The navigation rail's items container.
 * @fires {Event} change - Fired when the selected item changes. --bubbles
 * @fires {Event} toggle - Fired when the expanded state is toggled. --bubbles
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-shape
 * @cssprop --container-vertical-padding
 * @cssprop --container-width
 * @cssprop --expanded-container-color
 * @cssprop --expanded-container-width-maximum
 * @cssprop --expanded-container-width-minimum
 * @cssprop --expanded-modal-container-color
 * @cssprop --header-space-minimum
 * @cssprop --item-active-focused-icon-color
 * @cssprop --item-active-focused-label-text-color
 * @cssprop --item-active-hovered-icon-color
 * @cssprop --item-active-hovered-label-text-color
 * @cssprop --item-active-icon-color
 * @cssprop --item-active-indicator-color
 * @cssprop --item-active-indicator-height
 * @cssprop --item-active-indicator-shape
 * @cssprop --item-active-indicator-width
 * @cssprop --item-active-label-text-color
 * @cssprop --item-active-pressed-icon-color
 * @cssprop --item-active-pressed-label-text-color
 * @cssprop --item-active-state-layer-color
 * @cssprop --item-container-height
 * @cssprop --item-container-vertical-space
 * @cssprop --item-full-width-leading-space
 * @cssprop --item-full-width-trailing-space
 * @cssprop --item-horizontal-active-indicator-height
 * @cssprop --item-horizontal-icon-label-space
 * @cssprop --item-icon-size
 * @cssprop --item-inactive-focused-icon-color
 * @cssprop --item-inactive-focused-label-text-color
 * @cssprop --item-inactive-hovered-icon-color
 * @cssprop --item-inactive-hovered-label-text-color
 * @cssprop --item-inactive-icon-color
 * @cssprop --item-inactive-label-text-color
 * @cssprop --item-inactive-pressed-icon-color
 * @cssprop --item-inactive-pressed-label-text-color
 * @cssprop --item-inactive-state-layer-color
 * @cssprop --item-label-text
 * @cssprop --item-label-text-axes
 * @cssprop --item-label-text-tracking
 * @cssprop --item-vertical-icon-label-space
 * @cssprop --item-vertical-leading-space
 * @cssprop --item-vertical-trailing-space
 * @cssprop --modal-container-elevation
 * @cssprop --modal-container-shape
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 */
export class NavRailElement extends AriaTablistElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    navRailStyles,
    css`
      :host {
        block-size: 100%;
        display: inline-flex;
        flex-direction: column;
        outline: none;
      }

      .nav-rail ::slotted(:focus-within),
      .nav-rail-items ::slotted(:focus-within) {
        z-index: 1;
      }

      .nav-rail-header ::slotted(md-gb-icon-button),
      .nav-rail-header ::slotted(.icon-btn),
      .nav-rail-header ::slotted([data-nav-rail-toggle]),
      .nav-rail-header ::slotted([nav-rail-toggle]) {
        margin-inline-start: 8px;
      }
    `,
  ];

  override orientation: 'horizontal' | 'vertical' = 'vertical';

  /** Whether the navigation rail is expanded to show horizontal items. */
  @property({type: Boolean, reflect: true}) expanded = false;

  /**
   * Whether the navigation rail renders a built-in expand/collapse menu button
   * in the header when no toggle button is slotted into `slot="header"`.
   */
  @property({type: Boolean, reflect: true}) collapsible = false;

  /** Whether the navigation rail uses modal elevation and shape. */
  @property({type: Boolean, reflect: true}) modal = false;

  /** Vertical alignment of items ('top', 'center', or 'bottom'). */
  @property({reflect: true}) alignment: NavRailAlignment = 'top';

  /** The layout orientation of items ('vertical' or 'horizontal'). */
  @property({attribute: 'item-layout', reflect: true})
  itemLayout: NavRailItemLayout = 'vertical';

  @state() private hasHeader = false;
  @state() private hasSlottedToggle = false;

  @query('slot[name="header"]')
  private readonly headerSlot!: HTMLSlotElement | null;

  @query('.nav-rail-menu-button')
  private readonly menuButtonElement!: HTMLButtonElement | null;

  private menuButtonAbortController: AbortController | null = null;

  /**
   * The 0-based index of the currently active navigation rail item.
   * Alias for `selectedTabIndex`.
   */
  @property({type: Number, attribute: 'selected-index', noAccessor: true})
  get selectedIndex(): number {
    return this.selectedTabIndex;
  }
  set selectedIndex(index: number) {
    this.selectedTabIndex = index;
  }

  /**
   * Toggles the expanded state of the navigation rail.
   *
   * @param force Optional boolean to force expanded (`true`) or collapsed (`false`).
   * @return The new `expanded` state.
   */
  toggle(force?: boolean): boolean {
    const nextExpanded = force !== undefined ? Boolean(force) : !this.expanded;
    if (this.expanded === nextExpanded) {
      return this.expanded;
    }
    this.expanded = nextExpanded;
    this.dispatchEvent(new Event('toggle', {bubbles: true, composed: true}));
    return this.expanded;
  }

  /** Expands the navigation rail. */
  expand(): void {
    this.toggle(true);
  }

  /** Collapses the navigation rail. */
  collapse(): void {
    this.toggle(false);
  }

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, [focusRingStyles, rippleStyles, navRailStyles]);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.menuButtonAbortController?.abort();
    this.menuButtonAbortController = null;
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (
      changedProperties.has('expanded') ||
      changedProperties.has('itemLayout')
    ) {
      this.syncItemsLayout();
      this.syncHeaderState();
    }
    if (changedProperties.has('collapsible')) {
      this.setupBuiltInMenuButton();
    }
  }

  protected override render() {
    const effectiveLayout: NavRailItemLayout = this.expanded
      ? 'horizontal'
      : this.itemLayout;
    const showHeader = this.hasHeader || this.collapsible;
    const showBuiltInMenuButton = this.collapsible && !this.hasSlottedToggle;

    return html`
      <div
        part="nav-rail"
        class="${navRail({
          alignment: this.alignment,
          expanded: this.expanded,
          itemLayout: effectiveLayout,
          modal: this.modal,
        })}">
        <div
          part="header"
          class="nav-rail-header"
          ?hidden=${!showHeader}
          @click=${this.handleHeaderClick}>
          ${showBuiltInMenuButton
            ? html`
                <button
                  type="button"
                  part="menu-button"
                  class="nav-rail-menu-button ripple focus-ring-inner"
                  aria-label=${this.expanded
                    ? 'Collapse navigation rail'
                    : 'Expand navigation rail'}
                  aria-expanded=${this.expanded ? 'true' : 'false'}
                  @click=${this.handleMenuButtonClick}>
                  <span aria-hidden="true">
                    ${this.expanded ? 'menu_open' : 'menu'}
                  </span>
                </button>
              `
            : nothing}
          <slot name="header" @slotchange=${this.handleHeaderSlotChange}></slot>
        </div>
        <div part="items" class="nav-rail-items">
          <slot @slotchange=${this.handleSlotChange}></slot>
        </div>
      </div>
    `;
  }

  private setupBuiltInMenuButton() {
    this.menuButtonAbortController?.abort();
    this.menuButtonAbortController = null;
    if (this.menuButtonElement) {
      this.menuButtonAbortController = new AbortController();
      setupRipple(this.menuButtonElement, {
        signal: this.menuButtonAbortController.signal,
      });
    }
  }

  private handleMenuButtonClick(event: Event) {
    event.stopPropagation();
    this.toggle();
  }

  private handleHeaderClick(event: Event) {
    if (event.defaultPrevented) {
      return;
    }
    const headerElements =
      this.headerSlot?.assignedElements({flatten: true}) ?? [];
    if (headerElements.length === 0) {
      return;
    }
    const path = event.composedPath();
    for (const node of path) {
      if (!(node instanceof HTMLElement)) {
        continue;
      }
      if (
        node.matches(HEADER_FAB_SELECTOR) ||
        node.hasAttribute('data-nav-rail-no-toggle')
      ) {
        return;
      }
      if (
        headerElements.includes(node) &&
        node.matches(HEADER_TOGGLE_SELECTOR)
      ) {
        this.toggle();
        return;
      }
    }
  }

  private handleHeaderSlotChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    const assigned = slot.assignedElements({flatten: true});
    this.hasHeader = assigned.length > 0;
    this.hasSlottedToggle = assigned.some(
      (el) =>
        el instanceof HTMLElement &&
        !el.matches(HEADER_FAB_SELECTOR) &&
        !el.hasAttribute('data-nav-rail-no-toggle') &&
        el.matches(HEADER_TOGGLE_SELECTOR),
    );
    this.syncHeaderState();
    this.setupBuiltInMenuButton();
  }

  private syncHeaderState() {
    const assigned = this.headerSlot?.assignedElements({flatten: true}) ?? [];
    for (const el of assigned) {
      if (!(el instanceof HTMLElement)) {
        continue;
      }
      if (
        !el.matches(HEADER_FAB_SELECTOR) &&
        !el.hasAttribute('data-nav-rail-no-toggle') &&
        el.matches(HEADER_TOGGLE_SELECTOR)
      ) {
        el.setAttribute('aria-expanded', String(this.expanded));
        const iconEl =
          el.querySelector('md-gb-icon, .md-icon') ??
          (el.matches('md-gb-icon, .md-icon') ? el : null);
        if (iconEl) {
          const targetIcon = this.expanded ? 'menu_open' : 'menu';
          for (const childNode of Array.from(iconEl.childNodes)) {
            if (childNode.nodeType === Node.TEXT_NODE) {
              const text = childNode.textContent?.trim();
              if (
                (text === 'menu' || text === 'menu_open') &&
                text !== targetIcon
              ) {
                childNode.textContent = targetIcon;
              }
            }
          }
        }
      } else if (el.matches(HEADER_FAB_SELECTOR)) {
        const labelElements = el.querySelectorAll(
          ':scope > :not(md-gb-icon, .md-icon)',
        );
        for (const labelEl of Array.from(labelElements)) {
          if (labelEl instanceof HTMLElement) {
            labelEl.toggleAttribute('hidden', !this.expanded);
          }
        }
      }
    }
  }

  protected override handleSlotChange() {
    super.handleSlotChange();
    this.syncItemsLayout();
  }

  private syncItemsLayout() {
    const effectiveLayout: NavRailItemLayout = this.expanded
      ? 'horizontal'
      : this.itemLayout;
    for (const tab of this.tabs) {
      if (tab instanceof NavRailItemElement) {
        tab.itemLayout = effectiveLayout;
      } else {
        tab.setAttribute('item-layout', effectiveLayout);
      }
    }
  }
}
