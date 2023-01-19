/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit/decorators.js';

import {ListItemVideo} from './lib/video/list-item-video.js';
import {styles} from './lib/video/list-item-video-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-list-item-video': MdListItemVideo;
  }
}

/**
 * @summary A video that is expected to be slotted into a list item.
 *
 * @final
 * @suppress {visibility}
 */
@customElement('md-list-item-video')
export class MdListItemVideo extends ListItemVideo {
  static override styles = [styles];
}
