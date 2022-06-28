/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../tab_indicator/tab-indicator';
import '@material/web/icon/icon';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

import {PrimaryTab} from './lib/primary-tab';
import {styles as primaryStyles} from './lib/primary-tab-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';
import {IndicatorOptions} from './lib/types';

export {TabInteractionEventDetail} from './lib/types';

declare global {
  interface HTMLElementTagNameMap {
    'md-primary-tab': MdPrimaryTab;
  }
}

/**
 * @soyCompatible
 * @final
 * @suppress {visibility}
 */
@customElement('md-primary-tab')
export class MdPrimaryTab extends PrimaryTab {
  static override styles = [sharedStyles, primaryStyles];

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
