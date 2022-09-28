/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MenuSurface} from '@material/web/menu-surface/lib/menu-surface.js';
import {ClassInfo} from 'lit/directives/class-map.js';

/** Base class for autocomplete surface component. */
export class AutocompleteSurface extends MenuSurface {
  override stayOpenOnBodyClick = true;

  /** @soyTemplate */
  protected override getRenderClasses(): ClassInfo {
    return {
      ...super.getRenderClasses(),
      'md3-autocomplete-surface': true,
    };
  }
}
