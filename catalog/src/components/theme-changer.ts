import { LitElement, css, html } from 'lit';
import { customElement, query, state, queryAll } from 'lit/decorators.js';
import { live } from 'lit/directives/live.js';
import {
  ChangeColorEvent,
  ChangeDarkModeEvent,
} from '../types/color-events.js';
import '@material/web/segmentedbuttonset/outlined-segmented-button-set.js';
import '@material/web/segmentedbutton/outlined-segmented-button.js';
import type { MdOutlinedSegmentedButton } from '@material/web/segmentedbutton/outlined-segmented-button.js';
import '@material/web/icon/icon.js';
import './hct-slider.js';
import { hctFromHex, hexFromHct } from '../utils/material-color-helpers.js';
import type { HCTSlider } from './hct-slider.js';
import '@material/web/focus/focus-ring.js';

type ColorMode = 'light' | 'dark' | 'auto';

@customElement('theme-changer')
export class ThemeChanger extends LitElement {
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
      --md-sys-color-surface-container-highest: var(
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
      border-radius: 24px;
      box-sizing: border-box;
      border: 1px solid var(--md-sys-color-on-secondary-container);
      position: relative;
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

  @state() selected: ColorMode | null = null;
  @state() color: string = '';
  @state() hue: number = 0;
  @state() chroma: number = 0;
  @state() tone: number = 0;
  @state() showHexPickerFocusRing = false;

  @query('input')
  inputEl!: HTMLInputElement;

  @queryAll('hct-slider')
  sliders!: HCTSlider[];

  render() {
    return html`
      <h2>Theme Controls</h2>
      ${this.renderHexPicker()} ${this.renderHctPicker()}
      ${this.renderDarkModePicker()}
    `;
  }

  protected renderHexPicker() {
    return html`<div>
      <label
        id="hex"
      >
        <span class="label">Hex Source Color</span>
        <span class="input-wrapper">
          <div class="overflow">
            <input
              @input=${this.onNativeInputInput}
              @blur=${() => {
                this.showHexPickerFocusRing = false;
              }}
              type="color"
              .value=${live(this.color)}
            />
          </div>
          <md-focus-ring
            .visible=${this.showHexPickerFocusRing}
          ></md-focus-ring>
        </span>
      </label>
    </div>`;
  }

  private renderHctPicker() {
    // not defined in SSR and will throw in child if not defined
    const hue = this.hue ?? 0;
    const chroma = this.chroma ?? 0;
    const tone = this.tone ?? 0;

    return html`<div class="sliders">
      <hct-slider
        .value=${live(hue)}
        type="hue"
        label="Hue"
        max="360"
        @input=${this.onInput}
      ></hct-slider>
      <hct-slider
        .value=${live(chroma)}
        .color=${this.color}
        type="chroma"
        label="Chroma"
        max="150"
        @input=${this.onInput}
      ></hct-slider>
      <hct-slider
        .value=${live(tone)}
        type="tone"
        label="Tone"
        max="100"
        @input=${this.onInput}
      ></hct-slider>
    </div>`;
  }

  private renderDarkModePicker() {
    return html`<md-outlined-segmented-button-set
      @segmented-button-set-selection=${this.onSelection}
    >
      ${this.renderModeButton('dark', 'dark_mode')}
      ${this.renderModeButton('auto', 'brightness_medium')}
      ${this.renderModeButton('light', 'light_mode')}
    </md-outlined-segmented-button-set>`;
  }

  private renderModeButton(mode: ColorMode, icon: string) {
    return html`<md-outlined-segmented-button
      data-value=${mode}
      title=${mode}
      .selected=${this.selected === mode}
    >
      <md-icon slot="icon">${icon}</md-icon>
    </md-outlined-segmented-button>`;
  }

  private onInput() {
    for (const slider of this.sliders) {
      this[slider.type] = slider.value;
    }

    this.color = hexFromHct(this.hue, this.chroma, this.tone);
    this.dispatchEvent(new ChangeColorEvent(this.color));
  }

  private onNativeInputInput() {
    this.color = this.inputEl.value;
    const hct = hctFromHex(this.color);
    this.hue = hct.hue;
    this.chroma = hct.chroma;
    this.tone = hct.tone;
    this.dispatchEvent(new ChangeColorEvent(this.color));
  }

  async firstUpdated() {
    await this.updateComplete;
    if (!this.selected) {
      this.selected = localStorage.getItem('color-mode') as ColorMode | null;
    }

    if (!this.color) {
      this.color = localStorage.getItem('seed-color')!;
    }
    const hct = hctFromHex(this.color);
    this.hue = hct.hue;
    this.chroma = hct.chroma;
    this.tone = hct.tone;
  }

  private onSelection(
    e: CustomEvent<{
      button: MdOutlinedSegmentedButton;
      selected: boolean;
      index: number;
    }>
  ) {
    const { button } = e.detail;
    const value = button.dataset.value as ColorMode;
    this.selected = value;
    this.dispatchEvent(new ChangeDarkModeEvent(value));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'theme-changer': ThemeChanger;
  }
}
