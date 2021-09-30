/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map.js';

import {Button} from './button';

/**
 * @soyCompatible
 */
export class TonalButton extends Button {
  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-button--tonal': true,
    };
  }
}
