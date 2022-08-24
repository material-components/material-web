/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TemplateResult} from 'lit';
import {ClassInfo} from 'lit/directives/class-map.js';

import {FabShared} from './fab-shared.js';

/**
 * @soyCompatible
 */
export class Fab extends FabShared {
  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-fab--regular': true,
    };
  }

  /** @soyTemplate */
  protected override renderIcon(icon: string): TemplateResult|string {
    return '';
  }
}
