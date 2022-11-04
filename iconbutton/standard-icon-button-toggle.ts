/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';

import {customElement} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';

import {IconButtonToggle} from './lib/icon-button-toggle.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {styles} from './lib/standard-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-standard-icon-button-toggle': MdStandardIconButtonToggle;
  }
}

/** @soyCompatible */
@customElement('md-standard-icon-button-toggle')
export class MdStandardIconButtonToggle extends IconButtonToggle {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--standard': true,
    };
  }
}
