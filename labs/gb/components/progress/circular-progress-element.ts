/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {CSSResultOrNative, html, LitElement, nothing, svg} from 'lit';
import {property, state} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {
  circularProgress,
  type ProgressThickness,
  type ProgressVariant,
} from './circular-progress.js';
import circularProgressStyles from './circular-progress.css' with {type: 'css'}; // github-only
// import {styles as circularProgressStyles} from './circular-progress.cssresult.js'; // google3-only

const baseClass = mixinDelegatesAria(LitElement);

const RESOLUTION = (2 * Math.PI) / 180;
const SMOOTHING_FACTOR = 0.5;

/**
 * A Material Design circular progress component.
 *
 * @csspart progress - The circular progress container element.
 * @csspart svg - The SVG canvas element.
 * @csspart active - The active progress indicator path or circle.
 * @csspart track - The background track path or circle.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-shape
 * @cssprop --active-indicator-thickness
 * @cssprop --four-color-1
 * @cssprop --four-color-2
 * @cssprop --four-color-3
 * @cssprop --four-color-4
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 * @cssprop --size
 * @cssprop --track-active-indicator-space
 * @cssprop --track-color
 * @cssprop --track-shape
 * @cssprop --track-thickness
 * @cssprop --wave-amplitude
 * @cssprop --wave-speed
 * @cssprop --wave-wavelength
 * @cssprop --with-wave-size
 */
export class CircularProgressElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [circularProgressStyles];

  /** Current progress value between 0 and `max`. */
  @property({type: Number}) value = 0;

  /** Maximum progress value, defaults to 1. */
  @property({type: Number}) max = 1;

  /** Whether to render in indeterminate mode. */
  @property({type: Boolean, reflect: true}) indeterminate = false;

  /** Whether to render with a thick stroke. */
  @property({type: Boolean, reflect: true}) thick = false;

  /** Stroke thickness option: 'normal' or 'thick'. */
  @property({type: String}) thickness: ProgressThickness = 'normal';

  /** Whether to render in expressive wavy style. */
  @property({type: Boolean, reflect: true}) wavy = false;

  /** Variant style option: 'normal' or 'wavy'. */
  @property({type: String}) variant: ProgressVariant = 'normal';

  /** Whether to use 4 colors for indeterminate progress. */
  @property({type: Boolean, attribute: 'four-color'}) fourColor = false;

  @state() private activePathD = '';
  @state() private trackPathD = '';

  private animationFrameId = 0;
  private lastTimestamp = 0;
  private wavelengthOffset = 0;
  private currentAmplitude = 0;

  get isThick(): boolean {
    return this.thick || this.thickness === 'thick';
  }

  get isWavy(): boolean {
    return this.wavy || this.variant === 'wavy';
  }

  override connectedCallback() {
    super.connectedCallback();
    this.startAnimationIfNeeded();
  }

  override disconnectedCallback() {
    this.stopAnimation();
    super.disconnectedCallback();
  }

  override updated(changedProperties: Map<string, unknown>) {
    super.updated(changedProperties);
    if (
      changedProperties.has('wavy') ||
      changedProperties.has('variant') ||
      changedProperties.has('indeterminate') ||
      changedProperties.has('value') ||
      changedProperties.has('max') ||
      changedProperties.has('thick') ||
      changedProperties.has('thickness')
    ) {
      this.startAnimationIfNeeded();
    }
  }

  private startAnimationIfNeeded() {
    if (this.isWavy && !this.animationFrameId) {
      this.lastTimestamp = performance.now();
      const targetAmplitude = this.isThick ? 5.0 : 3.3;
      const progress = this.max > 0 ? this.value / this.max : 0;
      this.currentAmplitude =
        !this.indeterminate && progress >= 1 ? 0 : targetAmplitude;
      this.animationFrameId = requestAnimationFrame(this.tick);
    } else if (!this.isWavy && this.animationFrameId) {
      this.stopAnimation();
    }
  }

  private stopAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = 0;
    }
  }

  private readonly tick = (timestamp: number) => {
    if (!this.isConnected || !this.isWavy) {
      this.animationFrameId = 0;
      return;
    }

    const elapsed = this.lastTimestamp ? timestamp - this.lastTimestamp : 16.6;
    this.lastTimestamp = timestamp;

    const waveSpeed = 1;
    this.wavelengthOffset =
      (this.wavelengthOffset + (2 * Math.PI * waveSpeed * elapsed) / 1000) %
      (2 * Math.PI);

    const targetAmplitude = this.isThick ? 5.0 : 3.3;
    const progress = Math.max(
      0,
      Math.min(1, this.max > 0 ? this.value / this.max : 0),
    );

    if (!this.indeterminate) {
      if (progress >= 1) {
        this.currentAmplitude = Math.max(
          0,
          this.currentAmplitude - (targetAmplitude * elapsed) / 150,
        );
      } else {
        this.currentAmplitude = Math.min(
          targetAmplitude,
          this.currentAmplitude + (targetAmplitude * elapsed) / 150,
        );
      }
      this.updateWavyDeterminatePaths(progress);
    } else {
      this.currentAmplitude = targetAmplitude;
      this.updateWavyIndeterminatePaths();
    }

    this.animationFrameId = requestAnimationFrame(this.tick);
  };

  private updateWavyDeterminatePaths(progress: number) {
    const center = 50;
    const radius = 38;
    const frequency = 8;
    const angleEnd = progress * 2 * Math.PI;

    let activeData = '';
    const pointsCount = Math.max(2, Math.floor(angleEnd / RESOLUTION));
    for (let i = 0; i <= pointsCount; i++) {
      const rad = (i / pointsCount) * angleEnd;
      const phase = frequency * rad + this.wavelengthOffset;
      const amplitudeOffset = this.currentAmplitude * Math.sin(phase);
      const power =
        this.currentAmplitude > 0
          ? 1 -
            (this.currentAmplitude - Math.abs(amplitudeOffset)) /
              this.currentAmplitude
          : 0;
      const smoothingOffset =
        this.currentAmplitude > 0
          ? Math.sign(amplitudeOffset) *
            SMOOTHING_FACTOR *
            (this.currentAmplitude - Math.abs(amplitudeOffset)) *
            power ** 2
          : 0;
      const r = radius + amplitudeOffset + smoothingOffset;
      const x = center + r * Math.cos(rad);
      const y = center + r * Math.sin(rad);

      activeData += i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
    }
    this.activePathD = activeData;

    let trackData = '';
    const gapAngle = (4 / (2 * Math.PI * radius)) * 2 * Math.PI;
    const trackStart = angleEnd + gapAngle;
    const trackEnd = 2 * Math.PI;
    if (trackEnd > trackStart && progress < 0.98) {
      const trackPoints = Math.max(
        2,
        Math.floor((trackEnd - trackStart) / RESOLUTION),
      );
      for (let i = 0; i <= trackPoints; i++) {
        const rad = trackStart + (i / trackPoints) * (trackEnd - trackStart);
        const x = center + radius * Math.cos(rad);
        const y = center + radius * Math.sin(rad);
        trackData += i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
      }
    }
    this.trackPathD = trackData;
  }

  private updateWavyIndeterminatePaths() {
    const center = 50;
    const radius = 38;
    const frequency = 8;
    const totalAngle = 2 * Math.PI;

    let activeData = '';
    const pointsCount = Math.floor(totalAngle / RESOLUTION);
    for (let i = 0; i <= pointsCount; i++) {
      const rad = (i / pointsCount) * totalAngle;
      const phase = frequency * rad + this.wavelengthOffset;
      const amplitudeOffset = this.currentAmplitude * Math.sin(phase);
      const power =
        this.currentAmplitude > 0
          ? 1 -
            (this.currentAmplitude - Math.abs(amplitudeOffset)) /
              this.currentAmplitude
          : 0;
      const smoothingOffset =
        this.currentAmplitude > 0
          ? Math.sign(amplitudeOffset) *
            SMOOTHING_FACTOR *
            (this.currentAmplitude - Math.abs(amplitudeOffset)) *
            power ** 2
          : 0;
      const r = radius + amplitudeOffset + smoothingOffset;
      const x = center + r * Math.cos(rad);
      const y = center + r * Math.sin(rad);

      activeData += i === 0 ? `M ${x} ${y} ` : `L ${x} ${y} `;
    }
    this.activePathD = activeData;
    this.trackPathD = '';
  }

  protected override render() {
    const {ariaLabel} = this as ARIAMixinStrict;
    const isWavy = this.isWavy;
    const isThick = this.isThick;

    const progressValue = Math.max(
      0,
      Math.min(1, this.max > 0 ? this.value / this.max : 0),
    );
    const dashOffset = (1 - progressValue) * 100;

    return html`
      <div
        part="progress"
        class="${circularProgress({
          fourColor: this.fourColor,
          indeterminate: this.indeterminate,
          thick: isThick,
          wavy: isWavy,
        })}"
        role="progressbar"
        aria-label="${ariaLabel || nothing}"
        aria-valuemin="0"
        aria-valuemax="${this.max}"
        aria-valuenow="${this.indeterminate ? nothing : this.value}">
        <svg
          part="svg"
          class="circular-progress-svg"
          viewBox="0 0 100 100"
          aria-hidden="true">
          ${isWavy
            ? svg`
                ${
                  this.trackPathD
                    ? svg`<path
                      part="track"
                      class="circular-progress-track"
                      d="${this.trackPathD}"></path>`
                    : nothing
                }
                <path
                  part="active"
                  class="circular-progress-active"
                  d="${this.activePathD}"></path>
              `
            : svg`
                <circle
                  part="track"
                  class="circular-progress-track"
                  cx="50"
                  cy="50"
                  r="38"
                  pathLength="100"></circle>
                <circle
                  part="active"
                  class="circular-progress-active"
                  cx="50"
                  cy="50"
                  r="38"
                  pathLength="100"
                  stroke-dashoffset="${
                    this.indeterminate ? nothing : dashOffset
                  }"></circle>
              `}
        </svg>
      </div>
    `;
  }
}
