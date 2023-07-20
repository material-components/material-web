/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

import {Progress} from './progress.js';

/**
 * A linear progress component.
 */
export class LinearProgress extends Progress {
  /**
   * Buffer amount to display, a fraction between 0 and 1.
   */
  @property({type: Number}) buffer = 1;

  @query('.progress') private readonly rootEl!: HTMLElement|null;

  @state() private animationReady = true;
  private resizeObserver: ResizeObserver|null = null;

  protected override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'animation-ready': this.animationReady,
    };
  }

  // Note, the indeterminate animation is rendered with transform %'s
  // Previously, this was optimized to use px calculated with the resizeObserver
  // due to a now fixed Chrome bug: crbug.com/389359.
  protected override renderIndicator() {
    const progressStyles = {
      transform: `scaleX(${(this.indeterminate ? 1 : this.value) * 100}%)`
    };
    const bufferStyles = {
      transform: `scaleX(${(this.indeterminate ? 1 : this.buffer) * 100}%)`
    };

    return html`
      <div class="track"></div>
      <div class="buffer-bar" style=${styleMap(bufferStyles)}></div>
      <div class="bar primary-bar" style=${styleMap(progressStyles)}>
        <div class="bar-inner"></div>
      </div>
      <div class="bar secondary-bar">
        <div class="bar-inner"></div>
      </div>
    `;
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
