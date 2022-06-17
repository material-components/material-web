/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

import {styles as overlayStyles} from '../elevation/lib/elevation-overlay-styles.css';

import {FabExtended} from './lib/fab-extended';
import {styles as extendedStyles} from './lib/fab-extended-styles.css';
import {styles as sharedStyles} from './lib/fab-shared-styles.css';

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
  static override styles = [overlayStyles, sharedStyles, extendedStyles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon class="md3-fab__icon">${icon}</md-icon>` : '';
  }
}
