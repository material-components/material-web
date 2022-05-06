/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {styles} from './mwc-slider.css.js';
import {SliderSingleBase} from './slider-single-base.js';

export {Thumb} from '@material/slider/types.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-slider': Slider;
  }
}

@customElement('mwc-slider')
export class Slider extends SliderSingleBase {
  static override styles = [styles];
}
