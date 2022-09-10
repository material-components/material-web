/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';
import {SelectableAction} from './lib/selectable-action.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-selectable-action': MdSelectableAction;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-selectable-action')
export class MdSelectableAction extends SelectableAction {}
