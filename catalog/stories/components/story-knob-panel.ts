/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* Fork of Lit stories story-knob-renderer with m3 components and theming */

import '@material/web/elevation/elevation.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';

import {css, html, LitElement, PropertyValues} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

/**
 * Default dimensions for offsets and heights used for drag bounding
 */
export const DEFAULT_DIMENSIONS = {
  RIGHT_OFFSET: 8,
  TOP_OFFSET: 8,
  DRAG_BAR_HEIGHT: 32,
} as const;

/**
 * A right-side panel for the knobs
 *
 * @fires open-changed {{open: boolean}} Fired when opened or closed
 */
@customElement('story-knob-panel')
export class StoryKnobPanel extends LitElement {
  @query('.dragBar') dragBar!: HTMLElement | null;

  @property({type: Boolean}) showCloseIcon = true;
  @property({type: Boolean, reflect: true}) open = false;
  @property({type: Boolean, reflect: true}) override draggable = false;
  @property({type: Boolean}) hideDragIcon = false;
  @property({type: String, reflect: true}) type: 'modal' | 'inline' = 'inline';
  private isDragging = false;
  private previousX = 0;
  private currentX = 0;
  private previousY = 0;
  private currentY = 0;
  private dragStartPos = {
    x: 0,
    y: 0,
  };
  private containerWidth = 0;

  override update(changed: PropertyValues) {
    super.update(changed);

    if (changed.has('draggable') && changed.get('draggable') !== undefined) {
      this.containerWidth = this.getBoundingClientRect().width;
    }

    if (changed.has('type')) {
      this.open = this.type === 'inline';
    }

    if (changed.has('draggable')) {
      this.translatePos(0, 0);
      this.previousX = 0;
      this.previousY = 0;
    }
  }

  override render() {
    let closeIcon = html``;
    let dragIcon = html``;
    let dragBar = html``;

    if (this.showCloseIcon) {
      closeIcon = html`
        <md-icon-button aria-label="close" @click=${this.close}>
          <md-icon>close</md-icon>
        </md-icon-button>
      `;
    }

    if (this.draggable) {
      dragBar = html`
        <div
          class="dragBar"
          @pointerdown=${this.onDragStart}
          @pointermove=${this.onDrag}
          @pointerup=${this.onDragEnd}>
          <md-icon>drag_handle</md-icon>
        </div>
      `;
    }

    if (!this.hideDragIcon) {
      const iconSvg = this.draggable ? 'dock_to_left' : 'branding_watermark';
      const iconLabel = this.draggable ? 'dock' : 'pop out';

      dragIcon = html`
        <md-icon-button
          class="dragIconButton"
          aria-label=${iconLabel}
          @click=${this.onDragIconClick}>
          <md-icon>${iconSvg}</md-icon>
        </md-icon-button>
      `;
    }

    return html`
      <aside>
        <md-elevation></md-elevation>
        ${dragBar}
        <div class="content">
          <div id="title">
            <h3 class="m-headline5">Knobs</h3>
            ${dragIcon} ${closeIcon}
          </div>
          <div id="knobs">
            <slot></slot>
          </div>
        </div>
      </aside>
    `;
  }

  override updated(changed: PropertyValues) {
    super.updated(changed);

    if (changed.has('open')) {
      this.dispatchEvent(
        new CustomEvent('open-changed', {
          detail: {
            open: this.open,
          },
        }),
      );
    }
  }

  close() {
    this.open = false;
  }

  show() {
    this.open = true;
  }

  private onDragIconClick() {
    this.draggable = !this.draggable;
  }

  private onDragStart(event: PointerEvent) {
    this.dragStartPos = {x: event.x, y: event.y};
    this.isDragging = true;
    if (this.dragBar) {
      this.dragBar.setPointerCapture(event.pointerId);
    }
  }

  private onDrag(event: PointerEvent) {
    if (!this.isDragging) {
      return;
    }
    const newX = this.previousX + event.x - this.dragStartPos.x;
    const newY = this.previousY + event.y - this.dragStartPos.y;

    this.translatePos(newX, newY);
  }

  private onDragEnd(event: PointerEvent) {
    this.isDragging = false;
    this.previousX = this.currentX;
    this.previousY = this.currentY;
    if (this.dragBar) {
      this.dragBar.releasePointerCapture(event.pointerId);
    }
  }

  private translatePos(x: number, y: number) {
    if (x === 0 && y === 0) {
      this.style.transform = '';
      return;
    }

    const rightBound = DEFAULT_DIMENSIONS.RIGHT_OFFSET;
    const leftBound =
      DEFAULT_DIMENSIONS.RIGHT_OFFSET + this.containerWidth - window.innerWidth;
    const topBound = -DEFAULT_DIMENSIONS.TOP_OFFSET;
    const bottomBound =
      window.innerHeight -
      (DEFAULT_DIMENSIONS.DRAG_BAR_HEIGHT + DEFAULT_DIMENSIONS.TOP_OFFSET);

    // do not allow drag outside right bound
    if (x > rightBound) {
      x = rightBound;
    }

    // do not allow drag outside left bound
    if (x < leftBound) {
      x = leftBound;
    }

    // do not allow drag outside top bound
    if (y < topBound) {
      y = topBound;
    }

    // do not allow drag outside bottom bound
    if (y > bottomBound) {
      y = bottomBound;
    }

    this.currentX = x;
    this.currentY = y;

    this.style.transform = `translate(${x}px, ${y}px)`;
  }

  static override styles = [
    css`
      :host {
        max-width: 320px;
        margin-left: 56px;
        padding: 0 16px;
        background-color: white;
        --mdc-typography-headline-color: black;
        background-color: var(--md-sys-color-surface-container);
        color: var(--md-sys-color-on-surface);
        --md-elevation-level: 1;
        position: relative;
      }

      :host([type='inline']) {
        display: none;
      }

      :host([type='inline']:not([draggable])) {
        height: 100%;
        min-height: 100dvh;
      }

      :host([type='modal']) {
        top: 0;
        bottom: 0;
        right: 0;

        transition: right 250ms cubic-bezier(0.4, 0, 0.2, 1);
        position: fixed;
        z-index: 6;
      }

      :host([type='modal']:not([open])) {
        right: -353px;
      }

      :host([open]) {
        display: block;
      }

      :host([open][type='modal']) {
        transition: right 200ms cubic-bezier(0.4, 0, 0.2, 1);
      }

      :host([draggable]) {
        background-color: var(--md-sys-color-surface-container-high);
        color: var(--md-sys-color-on-surface);
        --md-elevation-level: 2;
        position: fixed;
        margin: 0;
        padding: 0;
        border-radius: 4px;
        border: none;
        top: 8px;
        right: 8px;
        bottom: unset;
        z-index: 7;
        opacity: 1;
      }

      :host([draggable]) .content {
        border-end-start-radius: inherit;
        border-end-end-radius: inherit;
        padding: 0 16px 16px 16px;
        max-height: 80dvh;
        overflow-y: auto;
        box-sizing: border-box;
        width: 100%;
      }

      :host([draggable]:not([open])) {
        display: none;
      }

      aside {
        border-radius: inherit;
      }

      .dragBar {
        height: 24px;
        padding: 4px 0;
        border-bottom: 1px solid var(--md-sys-color-outline-variant);
        background-color: var(--md-sys-color-surface-variant);
        color: var(--md-sys-color-on-surface-variant);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: grab;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
        touch-action: none;
        border-start-start-radius: inherit;
        border-start-end-radius: inherit;
      }

      @media (pointer: coarse) {
        .dragBar {
          height: 32px;
        }
      }

      .dragBar:active {
        cursor: grabbing;
      }

      ::slotted(*) {
        min-height: 40px;
        display: flex;
        align-items: center;
        --mdc-theme-primary: hsl(199, 18%, 40%);
        --mdc-theme-secondary: hsl(199, 18%, 40%);
      }

      #title {
        display: flex;
        align-items: center;
      }

      #title h3 {
        flex-grow: 1;
      }

      mwc-icon-button {
        color: hsl(0, 0%, 50%);
      }
    `,
  ];
}

declare global {
  interface HTMLElementTagNameMap {
    'story-knob-panel': StoryKnobPanel;
  }
}
