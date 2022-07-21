/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map';

import {Button} from './button';

/** @soyCompatible */
export class TextButton extends Button {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-button--text': true,
    };
  }
}
