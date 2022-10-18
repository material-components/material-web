/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ListItem} from '../../../list/lib/listitem/list-item.js';
import {ARIARole} from '../../../types/aria.js';

/** Base class for menu item component. */
export class MenuItem extends ListItem {
  override role: ARIARole = 'menuitem';
}
