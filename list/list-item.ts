/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {ListItemEl as ListItem} from './lib/listitem/list-item.js';
import {styles as privateProps} from './lib/listitem/list-item-private-styles.css.js';
import {styles} from './lib/listitem/list-item-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item': MdListItem;
  }
}

/**
 * @summary
 * Lists are continuous, vertical indexes of text or images. Items are placed
 * inside the list.
 *
 * @description
 * Lists consist of one or more list items, and can contain actions represented
 * by icons and text. List items come in three sizes: one-line, two-line, and
 * three-line.
 *
 * __Takeaways:__
 *
 * - Lists should be sorted in logical ways that make content easy to scan, such
 *   as alphabetical, numerical, chronological, or by user preference.
 * - Lists present content in a way that makes it easy to identify a specific
 *   item in a collection and act on it.
 * - Lists should present icons, text, and actions in a consistent format.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-list-item')
export class MdListItem extends ListItem {
  static override styles = [privateProps, styles];
}
