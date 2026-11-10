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
  linearProgress,
  type ProgressThickness,
  type ProgressVariant,
} from './linear-progress.js';
import linearProgressStyles from './linear-progress.css' with {type: 'css'}; // github-only
// import {styles as linearProgressStyles} from './linear-progress.cssresult.js'; // google3-only

const baseClass = mixinDelegatesAria(LitElement);

const RESOLUTION = 2;
const SMOOTHING_FACTOR = 0.5;

/**
 * A Material Design linear progress component.
 *
 * @csspart progress - The linear progress container element.
 * @csspart svg - The SVG canvas element.
 * @csspart active - The active progress indicator path or line.
 * @csspart track - The background track path or line.
 * @csspart stop - The stop indicator dot element.
 * @cssprop --active-indicator-color
 * @cssprop --active-indicator-shape
 * @cssprop --active-indicator-thickness
 * @cssprop --block-size
 * @cssprop --four-color-1
 * @cssprop --four-color-2
 * @cssprop --four-color-3
 * @cssprop --four-color-4
 * @cssprop --motion-duration
 * @cssprop --motion-easing
 * @cssprop --stop-indicator-color
 * @cssprop --stop-indicator-shape
 * @cssprop --stop-indicator-size
 * @cssprop --stop-indicator-trailing-space
 * @cssprop --track-active-indicator-space
 * @cssprop --track-color
 * @cssprop --track-shape
 * @cssprop --track-thickness
 * @cssprop --wave-amplitude
 * @cssprop --wave-speed
 * @cssprop --wave-wavelength
 * @cssprop --wave-wavelength-indeterminate
 * @cssprop --with-wave-block-size
 */
export class LinearProgressElement extends baseClass {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [linearProgressStyles];

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
  @state() private containerWidth = 240;

  private animationFrameId = 0;
  private lastTimestamp = 0;
  private wavelengthOffset = 0;
  private currentAmplitude = 0;
  private resizeObserver?: ResizeObserver;

  get isThick(): boolean {
    return this.thick || this.thickness === 'thick';
  }

  get isWavy(): boolean {
    return this.wavy || this.variant === 'wavy';
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setupResizeObserver();
    this.startAnimationIfNeeded();
  }

  override disconnectedCallback() {
    this.stopAnimation();
    this.resizeObserver?.disconnect();
    super.disconnectedCallback();
  }

  override firstUpdated() {
    const rect = this.getBoundingClientRect();
    if (rect.width > 0) {
      this.containerWidth = rect.width;
    }
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

  private setupResizeObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width;
        if (width > 0 && width !== this.containerWidth) {
          this.containerWidth = width;
        }
      }
    });
    this.resizeObserver.observe(this);
  }

  private startAnimationIfNeeded() {
    if (this.isWavy && !this.animationFrameId) {
      this.lastTimestamp = performance.now();
      const targetAmplitude = 3.0;
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

    const targetAmplitude = 3.0;
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
    const width = this.containerWidth || 240;
    const strokeWidth = this.isThick ? 8 : 4;
    const center = (this.isThick ? 24 : 16) / 2;
    const gapSize = 4;
    const wavelength = 40;

    const xStart = strokeWidth / 2;
    const effectiveLength = width - strokeWidth - gapSize;
    const xEnd = Math.max(xStart, xStart + progress * effectiveLength);

    let activeData = '';
    for (let x = xStart; x <= xEnd; x += RESOLUTION) {
      const phase = (2 * Math.PI * x) / wavelength + this.wavelengthOffset;
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
      const y = center + amplitudeOffset + smoothingOffset;
      activeData += x === xStart ? `M ${x} ${y} ` : `L ${x} ${y} `;
    }
    this.activePathD = activeData;

    let trackData = '';
    const trackStart = xEnd + gapSize;
    const trackEnd = width - strokeWidth / 2;
    if (trackEnd > trackStart && progress < 0.98) {
      trackData = `M ${trackStart} ${center} L ${trackEnd} ${center}`;
    }
    this.trackPathD = trackData;
  }

  private updateWavyIndeterminatePaths() {
    const width = this.containerWidth || 240;
    const strokeWidth = this.isThick ? 8 : 4;
    const center = (this.isThick ? 24 : 16) / 2;
    const wavelength = 20;

    const xStart = strokeWidth / 2;
    const xEnd = width - strokeWidth / 2;

    let activeData = '';
    for (let x = xStart; x <= xEnd; x += RESOLUTION) {
      const phase = (2 * Math.PI * x) / wavelength + this.wavelengthOffset;
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
      const y = center + amplitudeOffset + smoothingOffset;
      activeData += x === xStart ? `M ${x} ${y} ` : `L ${x} ${y} `;
    }
    this.activePathD = activeData;
    this.trackPathD = '';
  }

  protected override render() {
    const {ariaLabel} = this as ARIAMixinStrict;
    const isWavy = this.isWavy;
    const isThick = this.isThick;
    const center = (isThick ? (isWavy ? 24 : 8) : isWavy ? 16 : 4) / 2;
    const width = this.containerWidth || 240;

    const progressValue = Math.max(
      0,
      Math.min(1, this.max > 0 ? this.value / this.max : 0),
    );
    const activeWidth = progressValue * width;

    return html`
      <div
        part="progress"
        class="${linearProgress({
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
          class="linear-progress-svg"
          viewBox="0 0 ${width} ${center * 2}"
          aria-hidden="true">
          ${isWavy
            ? svg`
                ${
                  this.trackPathD
                    ? svg`<path
                      part="track"
                      class="linear-progress-track"
                      d="${this.trackPathD}"></path>`
                    : nothing
                }
                <path
                  part="active"
                  class="linear-progress-active"
                  d="${this.activePathD}"></path>
              `
            : svg`
                <line
                  part="track"
                  class="linear-progress-track"
                  x1="0"
                  y1="${center}"
                  x2="${width}"
                  y2="${center}"></line>
                <line
                  part="active"
                  class="linear-progress-active"
                  x1="0"
                  y1="${center}"
                  x2="${this.indeterminate ? width : activeWidth}"
                  y2="${center}"></line>
              `}
        </svg>
        ${!this.indeterminate && progressValue < 0.99
          ? html`<span
              part="stop"
              class="linear-progress-stop-indicator"></span>`
          : nothing}
      </div>
    `;
  }
}
