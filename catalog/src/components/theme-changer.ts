/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/focus/md-focus-ring.js';
import '@material/web/icon/icon.js';
import '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import '@material/web/labs/segmentedbuttonset/outlined-segmented-button-set.js';
import './copy-code-button.js';
import './hct-slider.js';

import type {MdOutlinedSegmentedButton} from '@material/web/labs/segmentedbutton/outlined-segmented-button.js';
import {css, html, LitElement} from 'lit';
import {customElement, query, queryAll, state} from 'lit/decorators.js';
import {live} from 'lit/directives/live.js';

import {ChangeColorEvent, ChangeDarkModeEvent} from '../types/color-events.js';
import {hctFromHex, hexFromHct} from '../utils/material-color-helpers.js';
import type {ColorMode} from '../utils/theme.js';
import {
  getCurrentMode,
  getCurrentSeedColor,
  getCurrentThemeString,
} from '../utils/theme.js';

import type {HCTSlider} from './hct-slider.js';

/**
 * A small set of controls that allows the user to change the theme and preview
 * color values.
 */
@customElement('theme-changer')
export class ThemeChanger extends LitElement {
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * The currently selected color mode.
   */
  @state() selectedColorMode: ColorMode | null = null;

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
      <div id="head-wrapper">
        <h2> Theme Controls </h2>
        <copy-code-button
          button-title="Copy current theme to clipboard"
          label="Copy current theme"
          .getCopyText=${getCurrentThemeString}>
        </copy-code-button>
      </div>
      ${this.renderHexPicker()} ${this.renderHctPicker()}
      ${this.renderColorModePicker()}
    `;
  }

  /**
   * Renders a circular native color picker with a focus ring.
   */
  protected renderHexPicker() {
    return html`<div>
      <label id="hex" for="color-input">
        <span class="label">Hex Source Color</span>
        <span class="input-wrapper">
          <div class="overflow">
            <input
              id="color-input"
              @input=${this.onHexPickerInput}
              type="color"
              .value=${live(this.hexColor)} />
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
        @input=${this.onSliderInput}></hct-slider>
      <hct-slider
        .value=${live(this.chroma)}
        .color=${this.hexColor}
        type="chroma"
        label="Chroma"
        max="150"
        @input=${this.onSliderInput}></hct-slider>
      <hct-slider
        .value=${live(this.tone)}
        type="tone"
        label="Tone"
        max="100"
        @input=${this.onSliderInput}></hct-slider>
    </div>`;
  }

  /**
   * Renders the color mode segmented button set picker.
   */
  private renderColorModePicker() {
    return html`<md-outlined-segmented-button-set
      @segmented-button-set-selection=${this.onColorModeSelection}
      aria-label="Color mode">
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
      aria-label="${mode} color scheme"
      .selected=${this.selectedColorMode === mode}>
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

  private onColorModeSelection(
    e: CustomEvent<{
      button: MdOutlinedSegmentedButton;
      selected: boolean;
      index: number;
    }>,
  ) {
    const {button} = e.detail;
    const value = button.dataset.value as ColorMode;
    this.selectedColorMode = value;
    this.dispatchEvent(new ChangeDarkModeEvent(value));
  }

  static styles = css`
    :host {
      /* These are the default values, but we don't want the alignment to break
       * in case the token values are updated.
       */
      --_copy-button-button-size: 40px;
      --_copy-button-icon-size: 24px;
      position: relative;
      display: flex;
      flex-direction: column;
      margin: var(--catalog-spacing-m) var(--catalog-spacing-l);
    }

    :host > * {
      margin-block-end: var(--catalog-spacing-l);
    }

    :host > *:last-child {
      margin-block-end: 0;
    }

    #head-wrapper {
      display: flex;
      align-items: space-between;
    }

    input {
      border: none;
      background: none;
    }

    .sliders,
    #hex {
      padding-inline: var(--catalog-spacing-m);
      border-radius: var(--catalog-shape-l);
      background-color: var(--md-sys-color-surface-variant);
      color: var(--md-sys-color-on-surface-variant);

      /* Default track color is inaccessible in a surface-variant */
      --md-slider-inactive-track-color: var(--md-sys-color-on-surface-variant);
    }

    hct-slider {
      display: block;
      margin-block: 24px;
    }

    h2 {
      margin: 0;
      text-align: center;
      position: relative;
      height: var(--_copy-button-icon-size);
    }

    copy-code-button {
      --md-icon-button-icon-size: var(--_copy-button-icon-size);
      --md-icon-button-state-layer-width: var(--_copy-button-button-size);
      --md-icon-button-state-layer-height: var(--_copy-button-button-size);
      /*
       * Center the copy icon with the h2 text
       * -(icon button size - intrinsic icon size) / 2
       */
      --_inline-block-inset: calc(
        -1 * (var(--_copy-button-button-size) - var(--_copy-button-icon-size)) /
          2
      );
      --catalog-copy-code-button-inset: var(--_inline-block-inset) 0 auto auto;
      position: static;
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
