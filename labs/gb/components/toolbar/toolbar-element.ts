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

  /** The alignment in vertical orientation. */
  @property({reflect: true}) align?: ToolbarAlign;

  /** Whether to hide text labels. */
  @property({type: Boolean, attribute: 'hide-labels', reflect: true})
  hideLabels = false;

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, toolbarStyles);
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

  private readonly handleSlotChange = () => {
    this.updateLabels();
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
