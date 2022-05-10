/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';
import {ClassInfo} from 'lit/directives/class-map.js';

import {MdIconButton} from './icon-button.js';
import {styles} from './lib/filled-styles.css.js';
import {styles as sharedStyles} from './lib/icon-button-styles.css.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-icon-button': MdFilledIconButton;
  }
}

@customElement('md-filled-icon-button')
export class MdFilledIconButton extends MdIconButton {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon>${icon}</md-icon>` : '';
  }

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--filled': true,
    };
  }
}
