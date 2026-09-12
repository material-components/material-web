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
} from 'lit';
import {property} from 'lit/decorators.js';

import toolbarStyles from './toolbar.css' with {type: 'css'}; // github-only
// import toolbarStyles from './toolbar.cssresult.js'; // google3-only

import {
  type ToolbarColor,
  type ToolbarOrientation,
  toolbar,
} from './toolbar.js';

/**
 * A Material Design gBreeze toolbar component.
 *
 * @slot - Used to display toolbar action items (buttons, icons, separators).
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
 * @cssprop --separator-color
 * @cssprop --separator-height
 * @cssprop --separator-margin
 * @cssprop --separator-width
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

  protected readonly internals: ElementInternals = this.attachInternals();

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

  protected override willUpdate() {
    this.internals.ariaOrientation = this.orientation;
  }

  protected override render() {
    return html`
      <div
        part="toolbar"
        class="${toolbar({
          color: this.color,
          orientation: this.orientation,
          docked: this.docked,
        })}">
        <slot></slot>
      </div>
    `;
  }
}
