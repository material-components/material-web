/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import { LitElement, css, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import '@material/web/icon/icon.js';

/**
 * A playground preview + editor with a draggable handle.
 */
@customElement('drag-playground')
export class DragPlayground extends LitElement {
  static styles = css`
    :host {
      display: block;
      --_drag-bar-height: 24px;
      --_drag-bar-border-width: 1px;
      --_half-drag-bar-height: calc(
        (var(--_drag-bar-height) / 2) + var(--_drag-bar-border-width)
      );
    }

    #wrapper {
      display: flex;
      flex-direction: column;
    }

    :host,
    #wrapper,
    ::slotted(*) {
      height: 100%;
    }

    slot {
      display: block;
      overflow: hidden;
    }

    [name='preview'] {
      height: max(
        calc(
          100% - var(--editor-percentage, 0%) - var(--_half-drag-bar-height)
        ),
        0px
      );
    }

    [name='editor'] {
      height: max(
        calc(var(--editor-percentage, 0px) - var(--_half-drag-bar-height)),
        0px
      );
    }

    #drag-bar {
      touch-action: none;
      background-color: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface);
      border: var(--_drag-bar-border-width) solid var(--md-sys-color-outline);
      border-radius: 12px;
      height: var(--_drag-bar-height);
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-user-select: none;
      user-select: none;
    }

    #drag-bar:hover {
      background-color: var(--md-sys-color-surface-container-high);
      cursor: grab;
    }

    #drag-bar.isDragging {
      background-color: var(--md-sys-color-inverse-surface);
      color: var(--md-sys-color-inverse-on-surface);
      cursor: grabbing;
    }
  `;

  /**
   * Whether or not we are in the "dragging" state.
   */
  @state() private isDragging = false;

  /**
   * The percentage of the editor height.
   */
  @state() private editorHeightPercent = 0;

  @query('#wrapper') private wrapperEl!: HTMLElement;

  /**
   * A set of pointer IDs in the case that the user is dragging with multiple
   * pointers.
   */
  private pointerIds = new Set<number>();

  render() {
    return html`<div
      id="wrapper"
      style=${styleMap({
        '--editor-percentage': `${this.editorHeightPercent}%`,
      })}
    >
      <slot name="preview"></slot>
      <div
        id="drag-bar"
        tabindex="0"
        role="slider"
        aria-orientation="vertical"
        aria-valuemax="100"
        aria-valuemin="0"
        aria-valuenow="${this.editorHeightPercent}"
        aria-valuetext="${this.editorHeightPercent} percent"
        aria-label="Editor height"
        @focus=${this.onFocus}
        @blur=${this.onBlur}
        @keydown=${this.onKeydown}
        @pointerdown=${this.onPointerdown}
        @pointerup=${this.onPointerup}
        @pointermove=${this.onPointermove}
        class=${classMap({
          isDragging: this.isDragging,
        })}
      >
        <md-icon>drag_handle</md-icon>
      </div>
      <slot name="editor"></slot>
    </div>`;
  }

  private onFocus() {
    this.isDragging = true;
  }

  private onBlur() {
    this.isDragging = false;
  }

  private onKeydown(event: KeyboardEvent) {
    const { key } = event;
    switch (key) {
      case 'ArrowRight':
      case 'ArrowUp':
        this.editorHeightPercent = Math.min(this.editorHeightPercent + 1, 100);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        this.editorHeightPercent = Math.max(this.editorHeightPercent - 1, 0);
        break;
      case 'PageUp':
        this.editorHeightPercent = Math.min(this.editorHeightPercent + 10, 100);
        break;
      case 'PageDown':
        this.editorHeightPercent = Math.max(this.editorHeightPercent - 10, 0);
        break;
      case 'Home':
        this.editorHeightPercent = 0;
        break;
      case 'End':
        this.editorHeightPercent = 100;
        break;
      default:
        break;
    }
  }

  private onPointerdown(event: PointerEvent) {
    this.isDragging = true;

    if (this.pointerIds.has(event.pointerId)) return;

    this.pointerIds.add(event.pointerId);
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
  }

  private onPointerup(event: PointerEvent) {
    this.pointerIds.delete(event.pointerId);
    (event.target as HTMLElement).releasePointerCapture(event.pointerId);

    if (this.pointerIds.size === 0) {
      this.isDragging = false;
    }
  }

  private onPointermove(event: PointerEvent) {
    if (!this.isDragging) return;

    const { clientY: mouseY } = event;
    const { top: wrapperTop, bottom: wrapperBottom } =
      this.wrapperEl.getBoundingClientRect();

    // The height of the wrapper
    const height = wrapperBottom - wrapperTop;

    // Calculate the percentage of the editor height in which the pointer is
    // located
    const editorHeightPercent = 100 - ((mouseY - wrapperTop) / height) * 100;

    // Clamp the percentage between 0 and 100
    this.editorHeightPercent = Math.min(Math.max(editorHeightPercent, 0), 100);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'drag-playground': DragPlayground;
  }
}
