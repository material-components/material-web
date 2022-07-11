/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';
import {ClassInfo} from 'lit/directives/class-map';

import {styles} from './lib/filled-tonal-styles.css';
import {styles as sharedStyles} from './lib/icon-button-styles.css';
import {IconButtonToggle} from './lib/icon-button-toggle';

declare global {
  interface HTMLElementTagNameMap {
    'md-filled-tonal-icon-button-toggle': MdFilledTonalIconButtonToggle;
  }
}

@customElement('md-filled-tonal-icon-button-toggle')
export class MdFilledTonalIconButtonToggle extends IconButtonToggle {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon>${icon}</md-icon>` : '';
  }

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--filled-tonal': true,
      'md3-icon-button--toggle-filled-tonal': true,
    };
  }
}
