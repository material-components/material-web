/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {TestTable} from './lib/test-table.js';
import {styles as testTableStyles} from './lib/test-table-styles.css.js';

export {TestTableTemplate} from './lib/test-table.js';

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
