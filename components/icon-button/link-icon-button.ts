/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {customElement} from 'lit/decorators.js';

import {styles} from '../../icon_button/mwc-icon-button.css';

import {LinkIconButton} from './lib/link-icon-button';

declare global {
  interface HTMLElementTagNameMap {
    'md-link-icon-button': MdLinkIconButton;
  }
}

@customElement('md-link-icon-button')
export class MdLinkIconButton extends LinkIconButton {
  static override styles = [styles];
}
