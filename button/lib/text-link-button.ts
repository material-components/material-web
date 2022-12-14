/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map.js';

import {LinkButton} from './link-button.js';

// tslint:disable-next-line:enforce-comments-on-exported-symbols
export class TextLinkButton extends LinkButton {
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-button--text': true,
    };
  }
}
