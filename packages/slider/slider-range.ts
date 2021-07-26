/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit-element';

import {styles} from './mwc-slider.css';
import {SliderRangeBase} from './slider-range-base';

export {Thumb} from '@material/slider/types';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-slider-range': SliderRange;
  }
}

@customElement('mwc-slider-range')
export class SliderRange extends SliderRangeBase {
  static styles = styles;
}
