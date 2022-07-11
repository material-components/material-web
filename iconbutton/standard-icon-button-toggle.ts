/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon';

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';
import {ClassInfo} from 'lit/directives/class-map';

import {styles as sharedStyles} from './lib/icon-button-styles.css';
import {IconButtonToggle} from './lib/icon-button-toggle';
import {styles} from './lib/standard-styles.css';

declare global {
  interface HTMLElementTagNameMap {
    'md-standard-icon-button-toggle': MdStandardIconButtonToggle;
  }
}

@customElement('md-standard-icon-button-toggle')
export class MdStandardIconButtonToggle extends IconButtonToggle {
  static override styles = [sharedStyles, styles];

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return icon ? html`<md-icon>${icon}</md-icon>` : '';
  }

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-icon-button--standard': true,
    };
  }
}
