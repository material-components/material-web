/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';

import {Button} from './button';

/**
 * @soyCompatible
 */
export class OutlinedButton extends Button {
  /** @soyCompatible */
  protected getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'mdc-button--outlined': true,
    };
  }

  override renderOutline(): TemplateResult {
    return html`
        <span class="mdc-button__outline"></span>
        `;
  }
}
