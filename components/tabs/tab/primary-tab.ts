/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../tab_indicator/tab-indicator';
import '../../icon/icon';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

import {PrimaryTab} from './lib/primary-tab';
import {styles as primaryStyles} from './lib/primary-tab-styles.css';
import {styles as sharedStyles} from './lib/shared-styles.css';

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
  protected override renderIndicator(
      indicatorIcon: string, isFadingIndicator: boolean): TemplateResult {
    return html`<md-tab-indicator
         class="md3-tab__indicator"
        .icon="${indicatorIcon}"
        .fade="${isFadingIndicator}"></md-tab-indicator>`;
  }

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult {
    return html`<md-icon class="md3-tab__icon"><slot name="icon">${
        icon}</slot></md-icon>`;
  }
}
