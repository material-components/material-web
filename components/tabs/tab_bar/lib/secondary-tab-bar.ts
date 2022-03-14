/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map';

import {SecondaryTab} from '../../tab/lib/secondary-tab';
import {MdSecondaryTab} from '../../tab/secondary-tab';

import {TabBar} from './tab-bar';

export class SecondaryTabBar extends TabBar {
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-tab-bar--secondary': true,
    };
  }

  // TODO(sorvell): probably want to memoize this and use a `slotChange` event
  protected _getTabs() {
    return (this.tabsSlot as HTMLSlotElement)
               .assignedNodes({flatten: true})
               .filter((e: Node) => e instanceof SecondaryTab) as
        MdSecondaryTab[];
  }

  protected _getActiveTabIndex() {
    const tabElements = this._getTabs();
    const activeElement =
        (this.getRootNode() as ShadowRoot).activeElement as MdSecondaryTab;
    return tabElements.indexOf(activeElement);
  }
}
