/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map.js';

import {LinkButton} from './link-button.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class OutlinedLinkButton extends LinkButton {
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-button--outlined': true,
    };
  }

  protected override renderOutline(): TemplateResult {
    return html`<span class="md3-button__outline"></span>`;
  }
}
