/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {styles} from './lib/icon-button-styles.css';
import {LinkIconButton} from './lib/link-icon-button';

declare global {
  interface HTMLElementTagNameMap {
    'md-link-icon-button': MdLinkIconButton;
  }
}

@customElement('md-link-icon-button')
export class MdLinkIconButton extends LinkIconButton {
  static override styles = [styles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon>${icon}</md-icon>` : '';
  }
}
