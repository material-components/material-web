/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {property} from 'lit/decorators.js';

import {Tab} from './tab.js';

/**
 * A primary tab component.
 */
export class PrimaryTab extends Tab {
  /**
   * Whether or not the icon renders inline with label or stacked vertically.
   */
  @property({type: Boolean, attribute: 'inline-icon'}) inlineIcon = false;

  protected override getContentClasses() {
    return {
      ...super.getContentClasses(),
      'stacked': !this.inlineIcon,
    };
  }
}
