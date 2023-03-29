/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map.js';

import {Button} from './button.js';

/**
 * A text button component.
 */
export class TextButton extends Button {
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-button--text': true,
    };
  }
}
