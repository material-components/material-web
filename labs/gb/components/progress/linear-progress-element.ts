/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, nothing, TemplateResult} from 'lit';
import {property, state} from 'lit/decorators.js';
import {styleMap, type StyleInfo} from 'lit/directives/style-map.js';

import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {Progress} from '../../../../progress/internal/progress.js';

import {linearProgress, linearWavePath} from './linear-progress.js';

import linearProgressStyles from './linear-progress.css' with {type: 'css'}; // github-only
// import {styles as linearProgressStyles} from './linear-progress.cssresult.js'; // google3-only

const DEFAULT_HEIGHT = 16;
// The gap between the active indicator and the inactive track, in pixels.
const TRACK_GAP = 4;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * A Material Design linear progress component.
 *
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-thickness
 * @cssprop --track-color
 * @cssprop --track-shape
 * @cssprop --container-height
 */
export class LinearProgressElement extends Progress {
  static override styles: CSSResultOrNative[] = [
    linearProgressStyles,
    css`
      :host {
        display: block;
      }
      :host(:dir(rtl)) {
        transform: scale(-1);
      }
      @media (forced-colors: active) {
        :host {
          outline: 1px solid CanvasText;
        }
      }
    `,
  ];

  /**
   * Buffer amount to display, a fraction between 0 and `max`.
   * If the value is 0 or negative, the buffer is not displayed.
   */
  @property({type: Number}) buffer = 0;

  /**
   * Whether or not to render a wavy (expressive) active indicator instead of a
   * standard smooth one.
   */
  @property({type: Boolean}) wavy = false;

  /**
   * The amplitude of the wavy active indicator, in pixels. Only applies when
   * `wavy` is true.
   */
  @property({type: Number}) amplitude = 3;

  /**
   * The wavelength of the wavy active indicator, in pixels. Only applies when
   * `wavy` is true.
   */
  @property({type: Number}) wavelength = 40;

  @state() private measuredWidth = 0;
  @state() private measuredHeight = DEFAULT_HEIGHT;

  private readonly resizeObserver = new ResizeObserver(() => {
    this.measure();
  });

  override connectedCallback() {
    super.connectedCallback();
    this.resizeObserver.observe(this);
    this.measure();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver.disconnect();
  }

  private measure() {
    const rect = this.getBoundingClientRect();
    if (rect.width > 0) {
      this.measuredWidth = rect.width;
    }
    if (rect.height > 0) {
      this.measuredHeight = rect.height;
    }
  }

  private wavePath(): string {
    return linearWavePath({
      width: this.measuredWidth,
      height: this.measuredHeight,
      amplitude: this.amplitude,
      wavelength: this.wavelength,
      wavy: this.wavy,
    });
  }

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <div
        class=${linearProgress({indeterminate: this.indeterminate})}
        role="progressbar"
        aria-label="${ariaLabel || nothing}"
        aria-valuemin="0"
        aria-valuemax=${this.max}
        aria-valuenow=${this.indeterminate ? nothing : this.value}
        >${this.renderIndicator()}</div
      >
    `;
  }

  protected override renderIndicator(): TemplateResult {
    if (this.indeterminate) {
      return this.renderIndeterminate();
    }
    return this.renderDeterminate();
  }

  private renderDeterminate(): TemplateResult {
    const progress = this.max > 0 ? clamp(this.value / this.max, 0, 1) : 0;
    const activeOffset = round((1 - progress) * 100);

    const bufferValue = this.buffer ?? 0;
    const buffer = this.max > 0 ? clamp(bufferValue / this.max, 0, 1) : 0;
    const hasBuffer = bufferValue > 0 && buffer > progress;

    // The inactive track starts after the active indicator (plus a gap) and
    // ends at the buffer (if any) or the end of the track.
    const trackStyles: StyleInfo = {
      'inset-inline-start': `calc(${round(progress * 100)}% + ${TRACK_GAP}px)`,
      'inset-inline-end': `${round((1 - (hasBuffer ? buffer : 1)) * 100)}%`,
    };

    // Buffer dots fill the region between the buffer and the end of the track.
    const dotsStyles: StyleInfo = {
      'inset-inline-start': `${round(buffer * 100)}%`,
    };

    const hideDots = !hasBuffer || buffer >= 1 || progress >= 1;
    const hideStopIndicator = progress >= 1;

    return html`
      <div
        class="linear-progress-inactive-track"
        style=${styleMap(trackStyles)}></div>
      <div
        class="linear-progress-dots"
        ?hidden=${hideDots}
        style=${styleMap(dotsStyles)}></div>
      <svg
        class="linear-progress-indicator"
        viewBox="0 0 ${round(this.measuredWidth)} ${round(this.measuredHeight)}"
        preserveAspectRatio="none">
        <path
          class="linear-progress-active"
          d=${this.wavePath()}
          pathLength="100"
          stroke-dashoffset=${activeOffset}></path>
      </svg>
      <div
        class="linear-progress-stop-indicator"
        ?hidden=${hideStopIndicator}></div>
    `;
  }

  private renderIndeterminate(): TemplateResult {
    return html`
      <div class="linear-progress-inactive-track"></div>
      <svg
        class="linear-progress-indicator"
        viewBox="0 0 ${round(this.measuredWidth)} ${round(this.measuredHeight)}"
        preserveAspectRatio="none">
        <path
          class="linear-progress-active"
          d=${this.wavePath()}
          pathLength="100"></path>
      </svg>
    `;
  }
}
