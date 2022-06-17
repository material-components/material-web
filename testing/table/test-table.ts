/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators';

import {TestTable} from './lib/test-table';
import {styles as testTableStyles} from './lib/test-table-styles.css';

export {TestTableTemplate} from './lib/test-table';

declare global {
  interface HTMLElementTagNameMap {
    'md-test-table': MdTestTable;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-test-table')
export class MdTestTable<S extends string = string> extends TestTable<S> {
  static override styles = [testTableStyles];
}
