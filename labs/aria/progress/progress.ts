/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, PropertyValues, css, html, isServer} from 'lit';
import {state} from 'lit/decorators.js';
import {
  mixinCustomStateSet,
  toggleState,
} from '../../behaviors/custom-state-set.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';

const baseClass = mixinCustomStateSet(mixinElementInternals(LitElement));

/**
 * An ARIA progress element.
 *
 * @cssstate indeterminate - True when the progress has no `value`.
 * @slot - Use this slot to replace the default rendered content of this
 *     component. These CSS properties are available to slotted content:
 *
 *   - `--md-aria-progress-value` - The current value, or `indeterminate`.
 *   - `--md-aria-progress-max` - The maximum value.
 *   - `--md-aria-progress-position` - The current position (value / max,
 *       clamped to [0, 1]), or `indeterminate`.
 */
export class AriaProgressElement extends baseClass {
  static override styles = css`
    @keyframes --_indeterminate {
      from {
        inset-inline-start: 0%;
      }
      to {
        inset-inline-start: 80%;
      }
    }

    :host {
      display: inline-block;
      position: relative;
      block-size: 1em;
      inline-size: 10em;
      vertical-align: -0.2em;
      overflow: hidden;

      /* These defaults are immediately overridden by inline styles. */
      --md-aria-progress-value: indeterminate;
      --md-aria-progress-max: 1;
      --md-aria-progress-position: indeterminate;
    }

    :host(:not(:state(indeterminate))) {
      --md-aria-progress-position: clamp(
        0,
        calc(var(--md-aria-progress-value) / var(--md-aria-progress-max)),
        1
      );
    }

    #track,
    #bar {
      display: block;
      position: absolute;

      inset: 0.25em 0px;
      border-radius: 10000px;

      background: lightgray;
    }

    #track {
      @media (forced-colors: active) {
        border: 1px solid transparent;
      }
    }

    #bar {
      background: AccentColor;

      @media (forced-colors: active) {
        background: CanvasText;
      }

      :host(:state(indeterminate)) & {
        inset-inline: unset;
        inline-size: 20%;
        animation: --_indeterminate 2s ease-in-out infinite alternate;
      }

      :host(:not(:state(indeterminate))) & {
        inline-size: calc(100% * var(--md-aria-progress-position));
      }
    }
  `;

  static override get observedAttributes() {
    return [...super.observedAttributes, 'value', 'max'];
  }

  @state()
  private internalValue: number | null = null;

  @state()
  private internalMax = 1;

  constructor() {
    super();
    if (isServer) return;

    this[internals].role = 'progressbar';
    this[toggleState]('indeterminate', true);
  }

  /**
   * The current value of the progress bar. Must be non-negative and is clamped
   * between 0 and `max`.
   */
  get value(): number {
    const {internalValue, internalMax} = this;
    if (internalValue === null) {
      return 0;
    }

    return Math.max(0, Math.min(internalValue, internalMax));
  }
  set value(value: number) {
    if (value < 0) {
      value = 0;
    }

    this.setAttribute('value', String(value));
  }

  /** The maximum value of the progress bar. Must be positive. */
  get max(): number {
    return this.internalMax;
  }
  set max(value: number) {
    if (value <= 0) {
      return;
    }

    this.setAttribute('max', String(value));
  }

  /** The ratio of the current to maximum values. */
  get position(): number {
    const {internalValue, internalMax} = this;

    if (internalValue === null) {
      return -1;
    }

    return Math.min(internalValue, internalMax) / internalMax;
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    super.attributeChangedCallback(name, oldValue, newValue);

    if (name === 'value') {
      if (newValue === null) {
        this.internalValue = null;
      } else {
        const parsed = Number(newValue);
        this.internalValue = isNaN(parsed) || parsed < 0 ? 0 : parsed;
      }
    }

    if (name === 'max') {
      if (newValue === null) {
        this.internalMax = 1;
      } else {
        const parsed = Number(newValue);
        this.internalMax = isNaN(parsed) || parsed <= 0 ? 1 : parsed;
      }
    }
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    const {internalValue, internalMax} = this;

    if (internalValue === null) {
      this[internals].ariaValueNow = null;
      this[toggleState]('indeterminate', true);
      this.style.setProperty('--md-aria-progress-value', 'indeterminate');
    } else {
      const usedValue = Math.min(internalValue, internalMax);
      this[internals].ariaValueNow = String(usedValue);
      this[toggleState]('indeterminate', false);
      this.style.setProperty('--md-aria-progress-value', String(usedValue));
    }

    this[internals].ariaValueMax = String(internalMax);
    this.style.setProperty('--md-aria-progress-max', String(internalMax));
  }

  protected override render() {
    return html`
      <slot>
        <div id="track"></div>
        <div id="bar"></div>
      </slot>
    `;
  }
}
