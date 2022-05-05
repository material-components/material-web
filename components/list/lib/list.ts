/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';

import {ARIARole} from '../../types/aria.js';

import {ListItemInteractionEvent} from './constants.js';

/** @soyCompatible */
export class List extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  /** @soyTemplate */
  protected getAriaRole(): ARIARole {
    return 'list';
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <ul class="md3-list"
          tabindex="0"
          role=${this.getAriaRole()}
          @list-item-interaction=${this.handleItemInteraction}>
        <slot></slot>
      </ul>
    `;
  }


  handleItemInteraction(event: ListItemInteractionEvent) {
    if (event.detail.state.isSelected) {
      // TODO: manage selection state.
    }
  }
}
