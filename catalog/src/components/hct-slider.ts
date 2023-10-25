/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/slider/slider.js';

import type {MdSlider} from '@material/web/slider/slider.js';
import {css, html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {styleMap} from 'lit/directives/style-map.js';

import {hctFromHex, hexFromHct} from '../utils/material-color-helpers.js';

/**
 * A tuple denoting an inclusive value range.
 */
type Range = [number, number];

const HUE_RANGE: Range = [0, 360];
const CHROMA_RANGE: Range = [0, 150];
const TONE_RANGE: Range = [0, 100];

/**
 * A slider for either hue, chroma, or tone with a preview gradient.
 *
 * @event input Fired when the user changes the value.
 */
@customElement('hct-slider')
export class HCTSlider extends LitElement {
  /**
   * The visiable and accessible label for the control.
   */
  @property({type: String}) label = '';

  /**
   * The value of the slider.
   */
  @property({type: Number}) value = 0;

  /**
   * The color from which to base the preview gradient (really only useful for
   * chroma).
   */
  @property({type: String}) color = '';

  /**
   * The type of HCT slider to display
   */
  @property({type: String}) type: 'hue' | 'chroma' | 'tone' = 'hue';

  override render() {
    let range = HUE_RANGE;

    if (this.type === 'chroma') {
      range = CHROMA_RANGE;
    } else if (this.type === 'tone') {
      range = TONE_RANGE;
    }

    return html`<section>
      <span id="label" class="color-on-surface-text">${this.label}</span>
      <md-slider
        id="source"
        labeled
        aria-label=${this.label}
        .min=${range[0]}
        .max=${range[1]}
        .value=${this.value}
        @input=${this.onInput}></md-slider>
      <div
        id="gradient"
        class=${this.type}
        style=${styleMap({
          background: this.buildGradient(),
        })}></div>
    </section>`;
  }

  private onInput(e: Event) {
    const target = e.target as MdSlider;
    this.value = target.value as number;

    this.dispatchEvent(new Event('input'));
  }

  /**
   * Generates the linear-gradient background image CSS string for the gradient
   * preview under the slider.
   *
   * @return A linear gradient CSS string.
   */
  private buildGradient() {
    const numStops = 100;

    let linearGradientString = 'linear-gradient(to right';

    if (this.type === 'hue') {
      for (let i = 0; i < numStops; i++) {
        const hue = (HUE_RANGE[1] / numStops) * i;
        // Set chroma to something fairly saturated + tone in the middle of
        // black and white so it's not too dark or too bright and vary the hue
        const hex = hexFromHct(hue, 100, 50);
        linearGradientString += `, ${hex} ${i}%`;
      }
    } else if (this.type === 'chroma') {
      const hct = hctFromHex(this.color || '#000');
      const hue = hct.hue;

      for (let i = 0; i < numStops; i++) {
        const chroma = (CHROMA_RANGE[1] / numStops) * i;
        // Change the color of the bar to the current hue and set the tone to
        // mid so we it's not too dark or too bright and vary the chroma
        const hex = hexFromHct(hue, chroma, 50);
        linearGradientString += `, ${hex} ${i}%`;
      }
    } else if (this.type === 'tone') {
      for (let i = 0; i < numStops; i++) {
        const tone = (TONE_RANGE[1] / numStops) * i;
        // Set tone color to black (0 chroma means that hue doesn't matter) and
        // vary the tone
        const hex = hexFromHct(0, 0, tone);
        linearGradientString += `, ${hex} ${i}%`;
      }
    }

    linearGradientString += ')';

    return linearGradientString;
  }

  static override styles = css`
    section {
      display: flex;
      flex-direction: column;
    }

    #gradient {
      height: 24px;
      border-radius: 12px;
      border: 1px solid currentColor;
      box-sizing: border-box;
    }

    #gradient.chroma {
      will-change: background;
    }

    #label,
    #gradient {
      margin-inline: calc(var(--md-slider-handle-width, 20px) / 2);
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'hct-slider': HCTSlider;
  }
}
