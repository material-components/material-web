/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../tab_scroller/tab-scroller.js';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {SecondaryTabBar} from './lib/secondary-tab-bar.js';
import {styles as tabbarStyles} from './lib/secondary-tab-bar-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-secondary-tab-bar': MdSecondaryTabBar;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-secondary-tab-bar')
export class MdSecondaryTabBar extends SecondaryTabBar {
  static override styles = [sharedStyles, tabbarStyles];

  /** @soyTemplate */
  protected override renderTabScroller(): TemplateResult {
    return html`<md-tab-scroller class="md3-tab-bar__scroller"><slot></slot></md-tab-scroller>`;
  }
}