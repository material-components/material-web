/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {styles as sharedStyles} from './lib/icon-button-styles.css.js';
import {IconButtonToggle} from './lib/icon-button-toggle.js';
import {styles} from './lib/standard-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-standard-icon-button-toggle': MdStandardIconButtonToggle;
  }
}

@customElement('md-standard-icon-button-toggle')
export class MdStandardIconButtonToggle extends IconButtonToggle {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon>${icon}</md-icon>` : '';
  }
}
