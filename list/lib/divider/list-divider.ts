/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ariaProperty} from '@material/web/decorators/aria-property.js';
import {ARIARole} from '@material/web/types/aria.js';
import {html, LitElement, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

/** @soyCompatible */
export class ListDivider extends LitElement {
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'data-role', noAccessor: true})
  role: ARIARole = 'separator';

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
       <li role="separator" class="md3-list__divider">
       </li>
     `;
  }
}
