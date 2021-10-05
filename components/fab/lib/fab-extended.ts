/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {html} from 'lit';
import {ClassInfo} from 'lit/directives/class-map.js';

import {Fab} from './fab';

export class FabExtended extends Fab {
  /** @soyTemplate */
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-fab--extended': true,
    };
  }

  /** @soyTemplate */
  protected override renderLabel() {
    return html`<span class="md3-fab__label">${this.label}</span>`;
  }
}