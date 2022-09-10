/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';
import {TrailingAction} from './lib/trailing-action.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-trailing-action': MdTrailingAction;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-trailing-action')
export class MdTrailingAction extends TrailingAction {}
