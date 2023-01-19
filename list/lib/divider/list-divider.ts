/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

import {ariaProperty} from '../../../decorators/aria-property.js';
import {ARIARole} from '../../../types/aria.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class ListDivider extends LitElement {
  @ariaProperty  // tslint:disable-line:no-new-decorators
  // tslint:disable-next-line:decorator-placement
  @property({type: String, attribute: 'data-role', noAccessor: true})
  // @ts-ignore(b/264292293): Use `override` with TS 4.9+
  role: ARIARole = 'separator';

  override render(): TemplateResult {
    return html`
       <li role=${this.role} class="divider"></li>
     `;
  }
}
