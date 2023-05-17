import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import '@material/web/slider/slider.js';

import { hctFromHex, hexFromHct } from '../utils/material-color-helpers.js';
import type { MdSlider } from '@material/web/slider/slider.js';

/**
 * HCT component control
 */
@customElement('hct-slider')
export class HCTSlider extends LitElement {
  @property({ type: String }) label = '';
  @property({ type: Number }) value = 0;
  @property({ type: String }) color = '';
  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 0;
  @property({ type: String }) type: 'hue' | 'chroma' | 'tone' = 'hue';

  override render() {
    return html`<section>
      <label id="label" class="color-on-surface-text" for="source"
        >${this.label}</label
      >
      <md-slider
        id="source"
        withLabel
        aria-label="${this.label}"
        .min=${this.min}
        .max=${this.max}
        .value=${this.value}
        @input=${this.onInput}
      ></md-slider>
      <div
        id="gradient"
        style=${styleMap({
          background: this.buildGradient(),
        })}
      ></div>
    </section>`;
  }

  private onInput(e: Event) {
    const target = e.target as MdSlider;
    this.onValue(Number(target.value));
  }

  buildGradient() {
    const hct = hctFromHex(this.color || '#000');
    const hue = hct.hue;
    const chroma = hct.chroma;
    const stops: ColorStop[] = [];
    const hueStops = 360;
    const chromeStops = 100;
    const toneStops = 100;
    if (this.type === 'hue') {
      for (let i = 0; i < hueStops; i++) {
        const hex = hexFromHct(i, 100, 50); // hsl(${i}, 100%, 50%)
        stops.push([i / hueStops, hex]);
      }
    } else if (this.type === 'chroma') {
      for (let i = 0; i < chromeStops; i++) {
        const hex = hexFromHct(hue, i, 50); // hsl(${hue}, ${i}%, 50%)
        stops.push([i / chromeStops, hex]);
      }
    } else if (this.type === 'tone') {
      for (let i = 0; i < toneStops; i++) {
        const hex = hexFromHct(hue, chroma, i); // hsl(${hue}, ${chroma}%, ${i}%)
        stops.push([i / toneStops, hex]);
      }
    }
    return `linear-gradient(to right, ${stops.map(
      ([pos, color]) => `${color} ${pos * 100}%`
    )})`;
  }

  private onValue(value: number) {
    this.value = value;
    this.dispatchEvent(new Event('input'));
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

    #label,
    #gradient {
      margin-inline: calc(var(--md-slider-handle-width, 20px) / 2);
    }
  `;
}

type ColorStop = [number, string];

declare global {
  interface HTMLElementTagNameMap {
    'hct-slider': HCTSlider;
  }
}
