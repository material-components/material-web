/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement} from 'lit-element';

import {Button} from './button';
import {styles as elevatedStyles} from './elevated-styles.css';
import {styles as sharedStyles} from './shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-elevated-button': ElevatedButton;
  }
}

/**
 * @soyCompatible
 * @final
 */
@customElement('md-elevated-button')
export class ElevatedButton extends Button {
  static styles = [sharedStyles, elevatedStyles];

  /** @soyCompatible */
  protected getRenderClasses() {
    return {
      ...super.getRenderClasses(),
      'mdc-button--elevated': true,
    };
  }
}
