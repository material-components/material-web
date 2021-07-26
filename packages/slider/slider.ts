/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {styles} from './mwc-slider.css';
import {SliderSingleBase} from './slider-single-base';

export {Thumb} from '@material/slider/types';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-slider': Slider;
  }
}

@customElement('mwc-slider')
export class Slider extends SliderSingleBase {
  static styles = [styles];
}
