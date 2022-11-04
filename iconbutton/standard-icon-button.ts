/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';

import {customElement} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';

import {IconButton} from './lib/icon-button.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {styles} from './lib/standard-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-standard-icon-button': MdStandardIconButton;
  }
}

/** @soyCompatible */
@customElement('md-standard-icon-button')
export class MdStandardIconButton extends IconButton {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--standard': true,
    };
  }
}
