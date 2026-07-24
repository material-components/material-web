/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, nothing, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {styleMap, type StyleInfo} from 'lit/directives/style-map.js';

import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {Progress} from '../../../../progress/internal/progress.js';

import {circularProgress, circularWavePath} from './circular-progress.js';

import circularProgressStyles from './circular-progress.css' with {type: 'css'}; // github-only
// import {styles as circularProgressStyles} from './circular-progress.cssresult.js'; // google3-only

const VIEWBOX_SIZE = 48;
const STROKE_INSET = 6;
const GAP_PERCENT = 6;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * A Material Design circular progress component.
 *
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-thickness
 * @cssprop --track-color
 * @cssprop --size
 */
export class CircularProgressElement extends Progress {
  static override styles: CSSResultOrNative[] = [
    circularProgressStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }
    `,
  ];

  /**
   * Whether or not to render a wavy (expressive) active indicator instead of a
   * standard smooth one.
   */
  @property({type: Boolean}) wavy = false;

  /**
   * The amplitude of the wavy active indicator, in viewBox units. Only applies
   * when `wavy` is true.
   */
  @property({type: Number}) amplitude = 1.6;

  /**
   * The wavelength of the wavy active indicator, in viewBox units. Only applies
   * when `wavy` is true.
   */
  @property({type: Number}) wavelength = 15;

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <div
        class=${circularProgress({indeterminate: this.indeterminate})}
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
    const amplitude = this.wavy ? this.amplitude : 0;
    const activePath = circularWavePath({
      size: VIEWBOX_SIZE,
      strokeWidth: STROKE_INSET,
      amplitude,
      wavelength: this.wavelength,
      wavy: this.wavy,
    });
    // The track shares the active indicator's mean radius but is always smooth.
    const trackPath = circularWavePath({
      size: VIEWBOX_SIZE,
      strokeWidth: STROKE_INSET,
      amplitude,
      wavelength: this.wavelength,
      wavy: false,
    });

    if (this.indeterminate) {
      return this.renderIndeterminate(trackPath, activePath);
    }
    return this.renderDeterminate(trackPath, activePath);
  }

  private renderDeterminate(
    trackPath: string,
    activePath: string,
  ): TemplateResult {
    const progress = this.max > 0 ? clamp(this.value / this.max, 0, 1) : 0;
    const activeOffset = round((1 - progress) * 100);
    const trackStart = progress * 100 + GAP_PERCENT;
    const trackLength = Math.max(0, 100 - progress * 100 - 2 * GAP_PERCENT);
    const trackTail = Math.max(0, 100 - trackStart - trackLength);
    const trackStyles: StyleInfo = {
      'stroke-dasharray': `0 ${round(trackStart)} ${round(trackLength)} ${round(
        trackTail,
      )}`,
    };

    return html`
      <svg viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}">
        <path
          class="circular-progress-track"
          d=${trackPath}
          pathLength="100"
          style=${styleMap(trackStyles)}></path>
        <path
          class="circular-progress-active"
          d=${activePath}
          pathLength="100"
          stroke-dashoffset=${activeOffset}></path>
      </svg>
    `;
  }

  private renderIndeterminate(
    trackPath: string,
    activePath: string,
  ): TemplateResult {
    return html`
      <svg viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}">
        <path
          class="circular-progress-track"
          d=${trackPath}
          pathLength="100"></path>
        <path
          class="circular-progress-active"
          d=${activePath}
          pathLength="100"></path>
      </svg>
    `;
  }
}
