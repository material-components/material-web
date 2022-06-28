/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators';

import {TabBar} from '../../tab_bar/lib/tab-bar';
import {TabBarActivatedEvent, TabBarActivatedEventDetail} from '../../tab_bar/lib/types';
import {TabPanel} from '../../tab_panel/lib/tab-panel';

/** @soyCompatible */
export class Tabs extends LitElement {
  @property({type: Number}) activeIndex = 0;

  @queryAssignedElements({slot: 'tabPanel', flatten: true})
  protected tabsPanel!: TabPanel[];

  @queryAssignedElements({slot: 'tabBar', flatten: true})
  protected tabBar!: TabBar[];

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
    <div class="md3-tabs"
      @tab-bar-activated="${this.handleTabBarActivated}">
      <span><slot name="tabBar"></slot></span>
      <span><slot name="tabPanel"></slot></span>
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

  override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('activeIndex')) {
      this.onActiveIndexChange(this.activeIndex);
      const event: TabBarActivatedEvent =
          new CustomEvent<TabBarActivatedEventDetail>('tab-bar-activated', {
            detail: {index: this.activeIndex},
            bubbles: true,
            cancelable: true
          });
      this.dispatchEvent(event);
    }
  }

  activateTab(index: number) {
    this.tabBar[0].activeIndex = index;
  }

  getActiveTabIndex(): number {
    return this.tabBar[0].activeIndex;
  }

  getTabIdByIndex(index: number): string|undefined {
    return this.tabBar[0].getTabIdByIndex(index);
  }

  getIndexOfTabById(id: string): number {
    return this.tabBar[0].getIndexOfTabById(id);
  }
}
