/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Button} from './button';

/**
 * @soyCompatible
 */
export class TonalButton extends Button {
  /** @soyCompatible */
  protected getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'mdc-button--tonal': true,
    };
  }
}
