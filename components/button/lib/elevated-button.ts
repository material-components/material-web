/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map.js';

import {Button} from './button.js';

/** @soyCompatible */
export class ElevatedButton extends Button {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-button--elevated': true,
    };
  }

  /** @soyTemplate */
  protected override renderOverlay(): TemplateResult {
    return html`<div class="md3-elevation-overlay"></div>`;
  }
}
