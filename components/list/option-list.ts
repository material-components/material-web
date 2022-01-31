/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {styles} from './lib/list-styles.css';
import {OptionList} from './lib/option-list';

declare global {
  interface HTMLElementTagNameMap {
    'md-option-list': MdOptionList;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-option-list')
export class MdOptionList extends OptionList {
  static override styles = [styles];
}
