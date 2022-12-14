/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map.js';

import {Button} from './button.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class FilledButton extends Button {
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-button--filled': true,
    };
  }

  /** @soyTemplate */
  protected override renderElevation(): TemplateResult {
    return html`<md-elevation shadow surface></md-elevation>`;
  }
}
