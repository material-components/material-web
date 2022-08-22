/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon';

import {customElement} from 'lit/decorators';
import {ClassInfo} from 'lit/directives/class-map';

import {IconButton} from './lib/icon-button';
import {styles as sharedStyles} from './lib/icon-button-styles.css';
import {styles} from './lib/standard-styles.css';

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
