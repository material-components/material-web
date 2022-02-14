/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map';

import {Tab} from './tab';

export class PrimaryTab extends Tab {
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-tab--primary': true,
    };
  }
}
