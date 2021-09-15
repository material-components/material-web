/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement, state} from 'lit-element';

import {Button} from './button';
import {styles as sharedStyles} from './shared-styles.css';
import {styles as textStyles} from './text-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-text-button': TextButton;
  }
}

@customElement('md-text-button')
export class TextButton extends Button {
  static styles = [sharedStyles, textStyles];

  @state()
  protected get variant() {
    return 'text';
  }
}
