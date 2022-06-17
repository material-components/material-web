/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

import {styles as overlayStyles} from '../elevation/lib/elevation-overlay-styles.css';

import {Fab} from './lib/fab';
import {styles as sharedStyles} from './lib/fab-shared-styles.css';
import {styles as fabStyles} from './lib/fab-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-fab': MdFab;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-fab')
export class MdFab extends Fab {
  static override styles = [overlayStyles, sharedStyles, fabStyles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon class="md3-fab__icon">${icon}</md-icon>` : '';
  }
}
