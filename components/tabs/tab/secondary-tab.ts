/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../tab_indicator/tab-indicator.js';
import '../../icon/icon.js';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {SecondaryTab} from './lib/secondary-tab.js';
import {styles as secondaryStyles} from './lib/secondary-tab-styles.css.js';
import {styles as sharedStyles} from './lib/shared-styles.css.js';
import {IndicatorOptions} from './lib/types.js';

export {TabInteractionEventDetail} from './lib/types.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-secondary-tab': MdSecondaryTab;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-secondary-tab')
export class MdSecondaryTab extends SecondaryTab {
  static override styles = [sharedStyles, secondaryStyles];

  /** @soyTemplate */
  protected override renderIndicator(opts: IndicatorOptions): TemplateResult {
    return html`<md-tab-indicator
         class="md3-tab__indicator"
        .icon="${opts.indicatorIcon}"
        .fade="${opts.isFadingIndicator}"
        .active="${opts.isActive}"></md-tab-indicator>`;
  }

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult {
    return html`<md-icon class="md3-tab__icon"><slot name="icon">${
        icon}</slot></md-icon>`;
  }
}
