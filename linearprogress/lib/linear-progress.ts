/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';

import {requestUpdateOnAriaChange} from '../../aria/delegate.js';
import {ARIAMixinStrict} from '../../types/aria.js';

/**
 * LinearProgress component.
 */
export class LinearProgress extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  /**
   * Whether or not to render indeterminate progress in an animated state.
   */
  @property({type: Boolean}) indeterminate = false;

  /**
   * Progress to display, a fraction between 0 and 1.
   */
  @property({type: Number}) progress = 0;

  /**
   * Buffer amount to display, a fraction between 0 and 1.
   */
  @property({type: Number}) buffer = 1;

  /**
   * Whether or not to render indeterminate mode using 4 colors instead of one.
   *
   */
  @property({type: Boolean, attribute: 'four-colors'}) fourColors = false;

  @query('.linear-progress') private readonly rootEl!: HTMLElement|null;

  @state() private animationReady = true;
  private resizeObserver: ResizeObserver|null = null;

  // Note, the indeterminate animation is rendered with transform %'s
  // Previously, this was optimized to use px calculated with the resizeObserver
  // due to a now fixed Chrome bug: crbug.com/389359.
  protected override render() {
    const rootClasses = {
      'indeterminate': this.indeterminate,
      'animation-ready': this.animationReady,
      'four-colors': this.fourColors
    };

    const progressStyles = {
      transform: `scaleX(${(this.indeterminate ? 1 : this.progress) * 100}%)`
    };
    const bufferStyles = {
      transform: `scaleX(${(this.indeterminate ? 1 : this.buffer) * 100}%)`
    };

    // Needed for closure conformance
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <div
          role="progressbar"
          class="linear-progress ${classMap(rootClasses)}"
          aria-label="${ariaLabel || nothing}"
          aria-valuemin="0"
          aria-valuemax="1"
          aria-valuenow="${this.indeterminate ? nothing : this.progress}">
        <div class="track"></div>
        <div class="buffer-bar" style=${styleMap(bufferStyles)}></div>
        <div class="bar primary-bar" style=${styleMap(progressStyles)}>
          <div class="bar-inner"></div>
        </div>
        <div class="bar secondary-bar">
          <div class="bar-inner"></div>
        </div>
      </div>`;
  }

  override async connectedCallback() {
    super.connectedCallback();
    // wait for rendering.
    await this.updateComplete;
    if (this.resizeObserver) {
      return;
    }
    this.resizeObserver = new ResizeObserver(() => {
      if (this.indeterminate) {
        this.restartAnimation();
      }
    });
    this.resizeObserver.observe(this.rootEl!);
  }

  override disconnectedCallback() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
    super.disconnectedCallback();
  }

  // When size changes, restart the animation
  // to avoid jank.
  private async restartAnimation() {
    await this.updateComplete;
    this.animationReady = false;
    await new Promise(requestAnimationFrame);
    this.animationReady = true;
    await this.updateComplete;
  }
}
