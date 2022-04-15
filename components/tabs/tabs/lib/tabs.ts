/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {observer} from '@material/mwc-base/observer';
import {html, LitElement, TemplateResult} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators';

import {TabBarActivatedEvent, TabBarActivatedEventDetail} from '../../tab_bar/lib/types';
import {TabPanel} from '../../tab_panel/lib/tab-panel';

/** @soyCompatible */
export class Tabs extends LitElement {
  @property({type: Number})  // tslint:disable-next-line:no-new-decorators
  @observer(function(this: Tabs, value: number) {
    this.onActiveIndexChange(this.activeIndex);
    const event: TabBarActivatedEvent =
        new CustomEvent<TabBarActivatedEventDetail>('tab-bar-activated', {
          detail: {index: this.activeIndex},
          bubbles: true,
          cancelable: true
        });
    this.dispatchEvent(event);
  })
  activeIndex = 0;

  @queryAssignedElements({slot: 'tabPanel', flatten: true})
  protected tabsPanel!: TabPanel[];

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
    <div
      @tab-bar-activated="${this.handleTabBarActivated}">
      <slot name="tabBar"></slot>
      <slot name="tabPanel"></slot>
    </div>`;
  }

  protected handleTabBarActivated(event: TabBarActivatedEvent) {
    this.activeIndex = event.detail.index;
  }

  protected onActiveIndexChange(index: number) {
    if (!this.tabsPanel[index]) {
      throw new Error('Tabs: activeIndex is out of bounds.');
    }
    for (let i = 0; i < this.tabsPanel.length; i++) {
      this.tabsPanel[i].active = i === index;
    }
  }
}