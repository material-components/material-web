/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map';

import {SecondaryTab} from '../../tab/lib/secondary-tab';

import {TabBar} from './tab-bar';

/** @soyCompatible */
export class SecondaryTabBar extends TabBar {
  /** @soyTemplate */
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-tab-bar--secondary': true,
    };
  }

  // TODO(sorvell): probably want to memoize this and use a `slotChange` event
  protected getTabs() {
    return this.tabsSlot.filter((e: Node) => e instanceof SecondaryTab) as
        SecondaryTab[];
  }
}
