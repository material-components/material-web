/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

/** @soyCompatible */
export class ListItemVideo extends LitElement {
  @property({type: String, reflect: true}) media = 'video';
  @property({type: String, reflect: true}) video = '';
  @property({type: String, reflect: true}) altText?: string;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
        <img src="${this.video}" alt="${ifDefined(this.altText)}"
         class="md3-list-item__video" />
      `;
  }
}
