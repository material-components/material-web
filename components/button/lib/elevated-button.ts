/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {customElement, state} from 'lit-element';

import {Button} from './button';
import {styles as elevatedStyles} from './elevated-styles.css';
import {styles as sharedStyles} from './shared-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-elevated-button': ElevatedButton;
  }
}

@customElement('md-elevated-button')
export class ElevatedButton extends Button {
  static styles = [sharedStyles, elevatedStyles];

  @state()
  protected get variant() {
    return 'elevated';
  }
}