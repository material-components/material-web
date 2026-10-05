/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
  type PropertyValues,
} from 'lit';
import {property} from 'lit/decorators.js';

import {adoptStyles} from '../../styles/adopt-styles.js';
import {hasSlotted} from '../shared/has-slotted.js';

import {
  toolbar,
  type ToolbarAlign,
  type ToolbarColor,
  type ToolbarOrientation,
} from './toolbar.js';
import toolbarStyles from './toolbar.css' with {type: 'css'}; // github-only
// import {styles as toolbarStyles} from './toolbar.cssresult.js'; // google3-only

/** Internal element interface supporting state properties without index signature. */
declare interface ElementWithState extends Element {
  disabled?: boolean;
  selected?: boolean;
}

/**
 * A Material Design gBreeze toolbar component.
 *
 * @slot - Used to display toolbar items (buttons, icon buttons, or custom
 *   content).
 * @slot leading - Used to display leading toolbar items.
 * @slot trailing - Used to display trailing toolbar items.
 * @csspart toolbar - The toolbar's root container.
 *
 * // LINT.IfChange
 * @cssprop --button-container-color
 * @cssprop --button-shape
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
 * @cssprop --icon-button-shape
 * @cssprop --icon-color
 * @cssprop --label-text-color
 * @cssprop --min-button-size
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 * @cssprop --selected-button-container-color
 * @cssprop --selected-icon-color
 * @cssprop --selected-label-text-color
 * @cssprop --target-area-gap
 * @cssprop --touch-target-size
 * @cssprop --vertical-container-width
 * // LINT.ThenChange(_toolbar-tokens.scss)
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
  }

  /** The color scheme of the toolbar. */
  @property({reflect: true}) color: ToolbarColor = 'standard';

  /** The layout orientation. */
  @property({reflect: true}) orientation: ToolbarOrientation = 'horizontal';

  /** Whether the toolbar is docked across full width. */
  @property({type: Boolean, reflect: true}) docked = false;

  /** Whether the toolbar is disabled. */
  @property({type: Boolean, reflect: true}) disabled = false;

  /** The alignment in vertical orientation. */
  @property({reflect: true}) align?: ToolbarAlign;

  /** Whether to hide text labels. */
  @property({type: Boolean, attribute: 'hide-labels', reflect: true})
  hideLabels = false;

  private itemObserver?: MutationObserver;

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, toolbarStyles);
    this.itemObserver = new MutationObserver(this.handleItemMutations);
    this.itemObserver.observe(this, {
      attributes: true,
      attributeFilter: ['disabled', 'aria-disabled'],
      childList: true,
      subtree: true,
    });
  }

  override disconnectedCallback() {
    this.itemObserver?.disconnect();
    this.itemObserver = undefined;
    super.disconnectedCallback();
  }

  protected override willUpdate() {
    if (this.docked && this.orientation !== 'horizontal') {
      this.orientation = 'horizontal';
    }
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (
      changedProperties.has('orientation') ||
      changedProperties.has('docked') ||
      !this.hasAttribute('focusgroup')
    ) {
      const isVertical = !this.docked && this.orientation === 'vertical';
      this.internals.ariaOrientation = isVertical ? 'vertical' : 'horizontal';
      this.setAttribute(
        'focusgroup',
        `toolbar wrap ${isVertical ? 'block' : 'inline'}`,
      );
    }

    if (changedProperties.has('disabled')) {
      this.internals.ariaDisabled = this.disabled ? 'true' : 'false';
      this.updateDisabledPropagation();
    }

    if (changedProperties.has('hideLabels')) {
      this.updateLabels();
    }
  }

  protected override render() {
    return html`
      <div
        part="toolbar"
        class="${toolbar({
          color: this.color,
          orientation: this.docked ? 'horizontal' : this.orientation,
          docked: this.docked,
          disabled: this.disabled,
          align: this.align,
          hideLabels: this.hideLabels,
        })}">
        <slot
          name="leading"
          ${hasSlotted()}
          @slotchange=${this.handleSlotChange}></slot>
        <slot ${hasSlotted()} @slotchange=${this.handleSlotChange}></slot>
        <slot
          name="trailing"
          ${hasSlotted()}
          @slotchange=${this.handleSlotChange}></slot>
      </div>
    `;
  }

  private readonly handleItemMutations = (mutations: MutationRecord[]) => {
    for (const mutation of mutations) {
      if (mutation.type === 'childList' && this.disabled) {
        this.updateDisabledPropagation();
      }
      const target = mutation.target;
      if (target instanceof Element && target !== this) {
        const isElDisabled =
          Boolean((target as ElementWithState).disabled) ||
          target.hasAttribute('disabled') ||
          target.getAttribute('aria-disabled') === 'true';
        if (isElDisabled) {
          this.clearPressedState(target);
          for (const desc of Array.from(target.querySelectorAll('*'))) {
            this.clearPressedState(desc);
          }
        }
      }
    }
  };

  private readonly handleSlotChange = () => {
    this.updateDisabledPropagation();
    this.updateLabels();
    const items = this.getSlottedItemsAndDescendants();
    for (const item of items) {
      const isElDisabled =
        Boolean((item as ElementWithState).disabled) ||
        item.hasAttribute('disabled') ||
        item.getAttribute('aria-disabled') === 'true';
      if (isElDisabled) {
        this.clearPressedState(item);
      }
    }
  };

  private getSlottedElements(): Element[] {
    const slots = this.shadowRoot?.querySelectorAll('slot');
    if (!slots) return [];
    const elements: Element[] = [];
    for (const slot of Array.from(slots)) {
      elements.push(...slot.assignedElements({flatten: true}));
    }
    return elements;
  }

  private getSlottedItemsAndDescendants(): Element[] {
    const slots = this.shadowRoot?.querySelectorAll('slot');
    if (!slots) return [];
    const elements: Element[] = [];
    const seen = new Set<Element>();
    for (const slot of Array.from(slots)) {
      for (const assigned of slot.assignedElements({flatten: true})) {
        if (!seen.has(assigned)) {
          seen.add(assigned);
          elements.push(assigned);
        }
        for (const desc of Array.from(assigned.querySelectorAll('*'))) {
          if (!seen.has(desc)) {
            seen.add(desc);
            elements.push(desc);
          }
        }
      }
    }
    return elements;
  }

  private clearPressedState(item: Element) {
    const itemWithState = item as ElementWithState;
    if (Boolean(itemWithState.selected)) {
      try {
        itemWithState.selected = false;
      } catch {
        // Ignore read-only property accessors on custom elements.
      }
    }
    if (item.hasAttribute('selected')) {
      item.removeAttribute('selected');
    }
    if (item.getAttribute('aria-pressed') === 'true') {
      item.setAttribute('aria-pressed', 'false');
    }
    item.classList.remove('active', 'btn-selected', 'icon-btn-selected');

    if (item.shadowRoot) {
      const innerButtons = item.shadowRoot.querySelectorAll(
        '[part~="btn"], [part~="icon-btn"], button',
      );
      for (const btn of Array.from(innerButtons)) {
        btn.classList.remove('active', 'btn-selected', 'icon-btn-selected');
        if (btn.getAttribute('aria-pressed') === 'true') {
          btn.setAttribute('aria-pressed', 'false');
        }
      }
    }
  }

  private updateDisabledPropagation() {
    const ACTION_SELECTOR =
      'button, a, [role="button"], [role="menuitem"], [role="checkbox"], [role="switch"], [role="radio"], md-gb-button, md-gb-icon-button, .btn, .icon-btn, input, select, textarea';
    if (this.disabled) {
      const items = this.getSlottedItemsAndDescendants();
      for (const item of items) {
        const itemWithProps = item as ElementWithState;
        if (
          item.matches(ACTION_SELECTOR) ||
          itemWithProps.disabled !== undefined
        ) {
          const isAlreadyDisabled =
            Boolean(itemWithProps.disabled) ||
            item.hasAttribute('disabled') ||
            item.getAttribute('aria-disabled') === 'true';
          if (!isAlreadyDisabled) {
            item.setAttribute('data-toolbar-disabled', '');
            if (itemWithProps.disabled !== undefined) {
              try {
                itemWithProps.disabled = true;
              } catch {
                // Ignore read-only disabled property.
              }
            } else {
              if (item.hasAttribute('tabindex')) {
                item.setAttribute(
                  'data-toolbar-prev-tabindex',
                  item.getAttribute('tabindex')!,
                );
              }
              item.setAttribute('tabindex', '-1');
            }
            item.setAttribute('aria-disabled', 'true');
          }
        }
        this.clearPressedState(item);
      }
    } else {
      const items = new Set<Element>([
        ...Array.from(this.querySelectorAll('[data-toolbar-disabled]')),
        ...this.getSlottedItemsAndDescendants().filter((el) =>
          el.hasAttribute('data-toolbar-disabled'),
        ),
      ]);
      for (const item of items) {
        const itemWithProps = item as ElementWithState;
        item.removeAttribute('data-toolbar-disabled');
        if (itemWithProps.disabled !== undefined) {
          try {
            itemWithProps.disabled = false;
          } catch {
            // Ignore read-only disabled property.
          }
        }
        item.removeAttribute('aria-disabled');
        if (item.hasAttribute('data-toolbar-prev-tabindex')) {
          item.setAttribute(
            'tabindex',
            item.getAttribute('data-toolbar-prev-tabindex')!,
          );
          item.removeAttribute('data-toolbar-prev-tabindex');
        } else if (itemWithProps.disabled === undefined) {
          item.removeAttribute('tabindex');
        }
      }
    }
  }

  private updateLabels() {
    if (this.hideLabels) {
      const slotted = this.getSlottedElements();
      for (const el of slotted) {
        if (
          el.tagName.toLowerCase() === 'md-gb-button' ||
          el.classList.contains('btn')
        ) {
          if (!el.getAttribute('aria-label')) {
            const textParts = this.extractLabelTextParts(el);
            const labelText = textParts.join(' ');
            if (labelText) {
              el.setAttribute('aria-label', labelText);
              el.setAttribute('data-toolbar-label', '');
            }
          }
        }
      }
    } else {
      const labeled = this.querySelectorAll('[data-toolbar-label]');
      for (const el of Array.from(labeled)) {
        el.removeAttribute('data-toolbar-label');
        el.removeAttribute('aria-label');
      }
    }
  }

  private extractLabelTextParts(node: Node): string[] {
    const textParts: string[] = [];
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent?.trim();
        if (text) {
          textParts.push(text);
        }
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        const element = child as Element;
        if (element.matches('md-gb-icon, .icon, [slot="container"]')) {
          continue;
        }
        textParts.push(...this.extractLabelTextParts(element));
      }
    }
    return textParts;
  }
}
