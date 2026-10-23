/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  html,
  LitElement,
  type CSSResultOrNative,
  type PropertyValues,
} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {adoptStyles} from '../../styles/adopt-styles.js';

import loadingStyles from './loading.css' with {type: 'css'}; // github-only
import {computeLoadingState, loadingClasses, SHAPE_SVG_PATHS} from './loading.js';
// import {styles as loadingStyles} from './loading.cssresult.js'; // google3-only

/**
 * A Material 3 Expressive loading custom element (`<md-gb-loading>`).
 *
 * Continuously morphs across 7 geometric shapes driven by damped harmonic
 * spring physics and rotation.
 *
 * @csspart loading - The internal root progressbar container.
 * @cssprop --active-indicator-color - Color of the animated morphing shape.
 * @cssprop --active-indicator-size - Size of the animated morphing shape.
 * @cssprop --container-color - Background color of the container.
 * @cssprop --container-height - Height of the component container.
 * @cssprop --container-shape - Border radius of the component container.
 * @cssprop --container-width - Width of the component container.
 */
export class LoadingElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    loadingStyles,
    css`
      :host {
        display: inline-flex;
        vertical-align: middle;
      }

      :host([closed]) {
        display: none;
      }
    `,
  ];

  /**
   * Whether to display in contained circular badge mode with background fill.
   */
  @property({type: Boolean, reflect: true}) contained = false;

  /**
   * Whether the loading indicator is closed/hidden.
   */
  @property({type: Boolean, reflect: true}) closed = false;

  /**
   * Accessible label announcing the progress state to assistive technology.
   */
  @property({attribute: 'aria-label'}) override ariaLabel: string | null = null;

  @state() private currentPathD = SHAPE_SVG_PATHS[0];
  @state() private currentRotation = 0;

  private animFrameId: number | null = null;
  private animationStartTime = 0;

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, loadingStyles);
    this.startAnimation();
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.stopAnimation();
    document.removeEventListener(
      'visibilitychange',
      this.handleVisibilityChange,
    );
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (changedProperties.has('closed')) {
      if (this.closed) {
        this.stopAnimation();
      } else {
        this.startAnimation();
      }
    }
  }

  private readonly handleVisibilityChange = () => {
    if (document.hidden || this.closed) {
      this.stopAnimation();
    } else {
      this.startAnimation();
    }
  };

  private startAnimation() {
    if (this.animFrameId !== null || this.closed) return;
    this.animationStartTime = 0;
    const tick = (now: number) => {
      if (this.animationStartTime === 0) {
        this.animationStartTime = now;
      }
      const elapsed = Math.max(0, now - this.animationStartTime);
      const {pathD, rotationDeg} = computeLoadingState(elapsed);
      this.currentPathD = pathD;
      this.currentRotation = rotationDeg;
      this.animFrameId = requestAnimationFrame(tick);
    };
    this.animFrameId = requestAnimationFrame(tick);
  }

  private stopAnimation() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }
  }

  protected override render() {
    const hostAriaLabel = this.ariaLabel ?? this.getAttribute('aria-label');
    const containerClasses = loadingClasses({
      contained: this.contained,
      closed: this.closed,
    });

    const rotStr = this.currentRotation.toFixed(1);

    return html`
      <div
        part="loading"
        class="${classMap(containerClasses)}"
        role="progressbar"
        aria-label=${hostAriaLabel ?? 'Loading'}
        aria-live="polite">
        <div class="loading-container">
          <svg class="loading-graphic" viewBox="-1 -1 2 2" aria-hidden="true">
            <g transform="rotate(${rotStr})">
              <path class="loading-shape" d="${this.currentPathD}" />
            </g>
          </svg>
        </div>
      </div>
    `;
  }
}
