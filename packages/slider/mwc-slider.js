/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {FormableComponentElement, MDCWebComponentMixin, html} from '@material/mwc-base/formable-component-element.js';
import {classMap} from 'lit-html/directives/classMap.js';
import {style} from './mwc-slider-css.js';
import {MDCSlider} from '@material/slider';

export class MDCWCSlider extends MDCWebComponentMixin(MDCSlider) {}

export class Slider extends FormableComponentElement {
  static get ComponentClass() {
    return MDCWCSlider;
  }

  static get componentSelector() {
    return '.mdc-slider';
  }

  static get properties() {
    return {
      disabled: {type: Boolean},
      step: {type: Number},
      min: {type: Number},
      max: {type: Number},
      value: {type: Number},
      discrete: {type: Boolean},
      markers: {type: Boolean},
    };
  }

  constructor() {
    super();
    this._asyncComponent = true;
    this.disabled = false;
    this.step = 0;
    this.min = 0;
    this.max = 10;
    this.value = 0;
    this.discrete = false;
    this.markers = false;
  }

  static get formElementSelector() {
    return '.mdc-slider';
  }

  _makeComponent() {
    super._makeComponent();
    this._componentRoot.addEventListener('MDCSlider:input', (e) => {
      this.value = e.detail.value;
    });
  }

  renderStyle() {
    return style;
  }

  // TODO(sorvell) #css: needs a default width
  render() {
    const {disabled, step, min, max, value, discrete, markers} = this;
    const hostClassInfo = {
      'mdc-slider--discrete': discrete,
      'mdc-slider--display-markers': markers && discrete,
    };
    return html`
      ${this.renderStyle()}
      <div class="mdc-slider ${classMap(hostClassInfo)}" tabindex="0" role="slider"
        aria-valuemin="${min}" aria-valuemax="${max}" aria-valuenow="${value}"
        aria-disabled="${disabled}" data-step="${step}">
      <div class="mdc-slider__track-container">
        <div class="mdc-slider__track"></div>
        ${discrete && markers ? html`<div class="mdc-slider__track-marker-container"></div>` : ''}
      </div>
      <div class="mdc-slider__thumb-container">
        ${discrete ? html`<div class="mdc-slider__pin">
          <span class="mdc-slider__pin-value-marker"></span>
        </div>` : ''}
        <svg class="mdc-slider__thumb" width="21" height="21">
          <circle cx="10.5" cy="10.5" r="7.875"></circle>
        </svg>
        <div class="mdc-slider__focus-ring"></div>
      </div>
    </div>`;
  }
}

customElements.define('mwc-slider', Slider);
