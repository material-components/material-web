/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';
import {LinkAction} from './lib/link-action.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-link-action': MdLinkAction;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-link-action')
export class MdLinkAction extends LinkAction {}
