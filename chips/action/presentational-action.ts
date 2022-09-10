/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';
import {PresentationalAction} from './lib/presentational-action.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-presentational-action': MdPresentationalAction;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-presentational-action')
export class MdPresentationalAction extends PresentationalAction {}
