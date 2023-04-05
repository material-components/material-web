/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation-surface.js';

import {html, TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map.js';

import {Button} from './button.js';

/**
 * An elevated button component.
 */
export class ElevatedButton extends Button {
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-button--elevated': true,
    };
  }

  protected override renderElevation(): TemplateResult {
    return html`<md-elevation-surface shadow></md-elevation-surface>`;
  }
}
