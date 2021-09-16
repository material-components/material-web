/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit-element';

import {Button} from './button';
import {styles as filledStyles} from './filled-styles.css';
import {styles as sharedStyles} from './shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-button': FilledButton;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-filled-button')
export class FilledButton extends Button {
  static styles = [sharedStyles, filledStyles];

  /** @soyCompatible */
  protected getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'mdc-button--filled': true,
    };
  }
}
