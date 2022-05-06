/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../tab_scroller/tab-scroller.js';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {PrimaryTabBar} from './lib/primary-tab-bar.js';
import {styles as tabbarStyles} from './lib/primary-tab-bar-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-primary-tab-bar': MdPrimaryTabBar;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-primary-tab-bar')
export class MdPrimaryTabBar extends PrimaryTabBar {
  static override styles = [sharedStyles, tabbarStyles];

  /** @soyTemplate */
  protected override renderTabScroller(): TemplateResult {
    return html`<md-tab-scroller class="md3-tab-bar__scroller"><slot></slot></md-tab-scroller>`;
  }
}
