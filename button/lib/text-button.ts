/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Button} from './button.js';

/**
 * A text button component.
 */
export class TextButton extends Button {
  protected override getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'md3-button--text': true,
    };
  }
}
