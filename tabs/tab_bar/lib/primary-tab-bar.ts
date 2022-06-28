/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map';

import {PrimaryTab} from '../../tab/lib/primary-tab';

import {TabBar} from './tab-bar';

/** @soyCompatible */
export class PrimaryTabBar extends TabBar {
  /** @soyTemplate */
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-tab-bar--primary': true,
    };
  }

  // TODO(sorvell): probably want to memoize this and use a `slotChange` event
  protected getTabs() {
    return this.tabsSlot.filter((e: Node) => e instanceof PrimaryTab) as
        PrimaryTab[];
  }
}
