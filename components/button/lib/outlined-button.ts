/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement, html, TemplateResult} from 'lit-element';

import {Button} from './button';
import {styles as outlinedStyles} from './outlined-styles.css';
import {styles as sharedStyles} from './shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-outlined-button': OutlinedButton;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-outlined-button')
export class OutlinedButton extends Button {
  static styles = [sharedStyles, outlinedStyles];

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
