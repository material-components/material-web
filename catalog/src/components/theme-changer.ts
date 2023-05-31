/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/icon/icon.js';
import './hct-slider.js';
import '@material/web/focus/focus-ring.js';

import type {MdOutlinedSegmentedButton} from '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import {css, html, LitElement} from 'lit';
import {customElement, query, queryAll, state} from 'lit/decorators.js';
import {live} from 'lit/directives/live.js';

import {ChangeColorEvent, ChangeDarkModeEvent,} from '../types/color-events.js';
import {hctFromHex, hexFromHct} from '../utils/material-color-helpers.js';
import {getCurrentMode, getCurrentSeedColor} from '../utils/theme.js';

import type {HCTSlider} from './hct-slider.js';

type ColorMode = 'light'|'dark'|'auto';

/**
 * A small set of controls that allows the user to change the theme and preview
 * color values.
 */
@customElement('theme-changer')
export class ThemeChanger extends LitElement {
  /**
   * The currently selected color mode.
   */
  @state() selectedColorMode: ColorMode|null = null;

  /**
   * The currently selected hex color.
   *
   * NOTE: Hex colors are in the srgb color space and HCT has a much larger, so
   * this value is a clipped value of HCT.
   */
  @state() hexColor = '';

  /**
   * The current hue value of the hue slider.
   */
  @state() hue = 0;

  /**
   * The crrent value of the chroma slider.
   */
  @state() chroma = 0;

  /**
   * The current value of the tone slider.
   */
  @state() tone = 0;

  @query('input') private inputEl!: HTMLInputElement;
  @queryAll('hct-slider') private sliders!: NodeListOf<HCTSlider>;

  render() {
    return html`
      <h2>Theme Controls</h2>
      ${this.renderHexPicker()}
      ${this.renderHctPicker()}
      ${this.renderColorModePicker()}
    `;
  }

  /**
   * Renders a circular native color picker with a focus ring.
   */
  protected renderHexPicker() {
    return html`<div>
      <label id="hex">
        <span class="label">Hex Source Color</span>
        <span class="input-wrapper">
          <div class="overflow">
            <input
              id="color-input"
              @input=${this.onHexPickerInput}
              type="color"
              .value=${live(this.hexColor)}
            />
          </div>
          <md-focus-ring for="color-input"></md-focus-ring>
        </span>
      </label>
    </div>`;
  }

  /**
   * Renders the three hct color pickers.
   */
  private renderHctPicker() {
    return html`<div class="sliders">
      <hct-slider
          .value=${live(this.hue)}
          type="hue"
          label="Hue"
          max="360"
          @input=${this.onSliderInput}
      ></hct-slider>
      <hct-slider
          .value=${live(this.chroma)}
          .color=${this.hexColor}
          type="chroma"
          label="Chroma"
          max="150"
          @input=${this.onSliderInput}
      ></hct-slider>
      <hct-slider
          .value=${live(this.tone)}
          type="tone"
          label="Tone"
          max="100"
          @input=${this.onSliderInput}
      ></hct-slider>
    </div>`;
  }

  /**
   * Renders the color mode segmented button set picker.
   */
  private renderColorModePicker() {
    return html`<md-outlined-segmented-button-set
        @segmented-button-set-selection=${this.onColorModeSelection}
    >
      ${this.renderModeButton('dark', 'dark_mode')}
      ${this.renderModeButton('auto', 'brightness_medium')}
      ${this.renderModeButton('light', 'light_mode')}
    </md-outlined-segmented-button-set>`;
  }

  /**
   * Renders a color mode segmented button.
   *
   * @param mode Sets the value and the title of the button to the given color
   *     mode.
   * @param icon The icon to display in the button.
   */
  private renderModeButton(mode: ColorMode, icon: string) {
    return html`<md-outlined-segmented-button
      data-value=${mode}
      title=${mode}
      .selected=${this.selectedColorMode === mode}
    >
      <md-icon slot="icon">${icon}</md-icon>
    </md-outlined-segmented-button>`;
  }

  private onSliderInput() {
    for (const slider of this.sliders) {
      this[slider.type] = slider.value;
    }

    this.hexColor = hexFromHct(this.hue, this.chroma, this.tone);
    this.dispatchEvent(new ChangeColorEvent(this.hexColor));
  }

  /**
   * Updates the HCT sliders by converting a hex color to HCT.
   *
   * @param hexColor The hex color to convert to HCT and update the sliders.
   */
  private updateHctFromHex(hexColor: string) {
    const hct = hctFromHex(hexColor);
    this.hue = hct.hue;
    this.chroma = hct.chroma;
    this.tone = hct.tone;
  }

  private onHexPickerInput() {
    this.hexColor = this.inputEl.value;
    this.updateHctFromHex(this.hexColor);
    this.dispatchEvent(new ChangeColorEvent(this.hexColor));
  }

  async firstUpdated() {
    if (!this.selectedColorMode) {
      // localStorage is not available on server so must do this here.
      this.selectedColorMode = getCurrentMode();
    }

    if (!this.hexColor) {
      // localStorage is not available on server so must do this here.
      this.hexColor = getCurrentSeedColor()!;
    }

    this.updateHctFromHex(this.hexColor);
  }

  private onColorModeSelection(e: CustomEvent<{
    button: MdOutlinedSegmentedButton; selected: boolean; index: number;
  }>) {
    const {button} = e.detail;
    const value = button.dataset.value as ColorMode;
    this.selectedColorMode = value;
    this.dispatchEvent(new ChangeDarkModeEvent(value));
  }

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      margin: 12px 24px;
    }

    :host > * {
      margin-block-end: 24px;
    }

    :host > *:last-child {
      margin-block-end: 0;
    }

    input {
      border: none;
      background: none;
    }

    .sliders,
    #hex {
      padding-inline: 12px;
      border-radius: 22px;

      background-color: var(--md-sys-color-secondary-container);
      color: var(--md-sys-color-on-secondary-container);

      /* Default track color is inaccessible in a secondary-container */
      --md-slider-inactive-track-color: var(
        --md-sys-color-on-secondary-container
      );
    }

    hct-slider {
      display: block;
      margin-block: 24px;
    }

    h2 {
      margin: 0;
      text-align: center;
    }

    #hex {
      display: flex;
      padding: 12px;
      align-items: center;
    }

    #hex .label {
      flex-grow: 1;
    }

    #hex .input-wrapper {
      box-sizing: border-box;
      width: 48px;
      height: 48px;
      box-sizing: border-box;
      border: 1px solid var(--md-sys-color-on-secondary-container);
      position: relative;
    }
      
    #hex .input-wrapper,
    #hex md-focus-ring {
      border-radius: 50%;
    }

    .overflow {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border-radius: inherit;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    #hex input {
      min-width: 200%;
      min-height: 200%;
    }

    @media (forced-colors: active) {
      #hex,
      .sliders {
        box-sizing: border-box;
        border: 1px solid CanvasText;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-changer': ThemeChanger;
  }
}
