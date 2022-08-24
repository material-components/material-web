/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map.js';

import {FabShared} from './fab-shared.js';

/**
 * @soyCompatible
 */
export class FabExtended extends FabShared {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-fab--extended': true,
    };
  }

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return '';
  }

  /** @soyTemplate */
  protected override renderLabel(): TemplateResult {
    return html`<span class="md3-fab__label">${this.label}</span>`;
  }
}
