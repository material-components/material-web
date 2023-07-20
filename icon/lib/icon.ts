/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement} from 'lit';

/**
 * TODO(b/265336902): add docs
 */
export class Icon extends LitElement {
  protected override render() {
    return html`<slot></slot>`;
  }
}
