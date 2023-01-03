/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Fab} from './lib/fab.js';
import {styles as sharedStyles} from './lib/fab-shared-styles.css.js';
import {styles as fabStyles} from './lib/fab-styles.css.js';

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
  static override styles = [sharedStyles, fabStyles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon class="md3-fab__icon">${icon}</md-icon>` : '';
  }
}
