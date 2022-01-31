/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';

import {ARIARole} from '../../types/aria';

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
      <ul tabindex="0" role=${this.getAriaRole()} class="md3-list">
        <slot></slot>
      </ul>
    `;
  }
}
