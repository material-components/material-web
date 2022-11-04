/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';

import {customElement} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';

import {styles} from './lib/filled-styles.css.js';
import {LinkIconButton} from './lib/link-icon-button.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-link-icon-button': MdFilledLinkIconButton;
  }
}

/** @soyCompatible */
@customElement('md-filled-link-icon-button')
export class MdFilledLinkIconButton extends LinkIconButton {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--filled': true,
    };
  }
}
