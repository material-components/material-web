/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';
import {DeleteAction} from './lib/delete-action.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-delete-action': MdDeleteAction;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-delete-action')
export class MdDeleteAction extends DeleteAction {}
