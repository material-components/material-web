/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, css, html} from 'lit';
import {property} from 'lit/decorators.js';
import {StyleInfo, styleMap} from 'lit/directives/style-map.js';
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
 *   - `--progress-value` - The current value, clamped to
 *      [`--progress-min`, `--progress-max`].
 *   - `--progress-min` - The minimum value.
 *   - `--progress-max` - The maximum value, or `--progress-min` if `max` is
 *      less than `min`.
 *   - `--progress` - The current position, from 0 to 1, or `indeterminate`.
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
      display: inline-flex;
      position: relative;
      block-size: 1em;
      inline-size: 10em;
      vertical-align: -0.2em;
      overflow: hidden;
      container: size;
    }

    slot {
      /* Defaults until overridden by inline styles; --progress-value is
         not set inline when indeterminate. */
      --progress-value: 0;
      --progress-min: 0;
      --progress-max: 100;
      --progress: indeterminate;

      :host(:not(:state(indeterminate))) & {
        --progress: progress(
          var(--progress-value),
          var(--progress-min),
          var(--progress-max)
        );
      }
    }

    #track,
    #bar {
      display: block;
      position: absolute;

      inset: 0.25em 0;
      border-radius: 50cqmin;
    }

    #track {
      border: 1px solid currentColor;
    }

    #bar {
      forced-color-adjust: preserve-parent-color;
      background: currentColor;

      :host(:state(indeterminate)) & {
        inset-inline: unset;
        inline-size: 20%;
        animation: --_indeterminate 2s ease-in-out infinite alternate;
      }

      :host(:not(:state(indeterminate))) & {
        inline-size: calc(100% * var(--progress));
      }
    }
  `;

  /**
   * The current value, or `null` if indeterminate. Clamped to [`min`, `max`]
   * when used.
   */
  @property({type: Number, reflect: true, useDefault: true})
  value: number | null = null;

  /** The minimum value. */
  @property({type: Number, reflect: true, useDefault: true})
  min = 0;

  /** The maximum value. Treated as `min` when less than `min`. */
  @property({type: Number, reflect: true, useDefault: true})
  max = 100;

  constructor() {
    super();

    this[internals].role = 'progressbar';
    this[toggleState]('indeterminate', true);
  }

  /**
   * Updates ARIA properties and returns a `StyleInfo` containing computed
   * `--progress-*` properties to be applied to this element's `<slot>`.
   *
   * This method must be called by any override for `value` / `min` / `max` to
   * be correctly synced to ARIA properties and the entries it returns must be
   * merged with any additional entries produced by the override for the
   * `--progress-*` properties to be updated. New entries produced by the
   * override do not affect ARIA or the indeterminate state.
   */
  protected getProgressStyles(): StyleInfo {
    const styles: StyleInfo = {};

    const {value, min, max} = this;
    const indeterminate = value === null;
    const usedMin = min;
    const usedMax = Math.max(min, max);
    const usedValue = indeterminate
      ? null
      : Math.min(usedMax, Math.max(usedMin, value));

    if (indeterminate) {
      this[internals].ariaValueNow = null;
      this[toggleState]('indeterminate', true);
    } else {
      this[internals].ariaValueNow = String(usedValue);
      styles['--progress-value'] = String(usedValue);
      this[toggleState]('indeterminate', false);
    }

    this[internals].ariaValueMin = String(usedMin);
    styles['--progress-min'] = String(usedMin);

    this[internals].ariaValueMax = String(usedMax);
    styles['--progress-max'] = String(usedMax);

    return styles;
  }

  protected override render() {
    return html`
      <slot style="${styleMap(this.getProgressStyles())}">
        <div id="track"></div>
        <div id="bar"></div>
      </slot>
    `;
  }
}
