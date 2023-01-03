/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {FabExtended} from './lib/fab-extended.js';
import {styles as extendedStyles} from './lib/fab-extended-styles.css.js';
import {styles as sharedStyles} from './lib/fab-shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-fab-extended': MdFabExtended;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-fab-extended')
export class MdFabExtended extends FabExtended {
  static override styles = [sharedStyles, extendedStyles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon class="md3-fab__icon">${icon}</md-icon>` : '';
  }
}
