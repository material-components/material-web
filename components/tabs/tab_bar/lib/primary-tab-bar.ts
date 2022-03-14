/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ClassInfo} from 'lit/directives/class-map';

import {PrimaryTab} from '../../tab/lib/primary-tab';
import {MdPrimaryTab} from '../../tab/primary-tab';

import {TabBar} from './tab-bar';

export class PrimaryTabBar extends TabBar {
  protected override getRootClasses(): ClassInfo {
    return {
      ...super.getRootClasses(),
      'md3-tab-bar--primary': true,
    };
  }
  // TODO(sorvell): probably want to memoize this and use a `slotChange` event
  protected _getTabs() {
    return (this.tabsSlot as HTMLSlotElement)
               .assignedNodes({flatten: true})
               .filter((e: Node) => e instanceof PrimaryTab) as MdPrimaryTab[];
  }

  protected _getActiveTabIndex() {
    const tabElements = this._getTabs();
    const activeElement =
        (this.getRootNode() as ShadowRoot).activeElement as MdPrimaryTab;
    return tabElements.indexOf(activeElement);
  }
}
