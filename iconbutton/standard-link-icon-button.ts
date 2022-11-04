/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';

import {customElement} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';

import {LinkIconButton} from './lib/link-icon-button.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {styles} from './lib/standard-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-standard-link-icon-button': MdStandardLinkIconButton;
  }
}

/** @soyCompatible */
@customElement('md-standard-link-icon-button')
export class MdStandardLinkIconButton extends LinkIconButton {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--standard': true,
    };
  }
}
