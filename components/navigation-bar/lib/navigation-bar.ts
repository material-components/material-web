/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {KEY, normalizeKey} from '@material/dom/keyboard';
import {ariaProperty} from '@material/mwc-base/aria-property';
import {observer} from '@material/mwc-base/observer';
import {deepActiveElementPath} from '@material/mwc-base/utils';
import {NavigationTab} from 'google3/third_party/javascript/material_web_components/m3/navigation_tab/lib/navigation-tab';
import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {NavigationTabInteractionEvent} from './constants';
import {NavigationBarState} from './state';

/** @soyCompatible */
export class NavigationBar extends LitElement implements NavigationBarState {
  @property({type: Number})  // tslint:disable-next-line:no-new-decorators
  @observer(function(this: NavigationBar, value: number) {
    this.onActiveIndexChange(this.activeIndex);
    this.dispatchEvent(new CustomEvent(
        'navigation-bar-activated',
        {detail: {tab: this.tabs[value]}, bubbles: true, composed: true}));
  })
  activeIndex = 0;

  @property({type: Boolean})  // tslint:disable-next-line:no-new-decorators
  @observer(function(this: NavigationBar, value: boolean) {
    this.onHideInactiveLabelsChange(this.hideInactiveLabels);
  })
  hideInactiveLabels = false;

  // tslint:disable-next-line:no-new-decorators
  @observer(function(this: NavigationBar) {
    this.onHideInactiveLabelsChange(this.hideInactiveLabels);
    this.onActiveIndexChange(this.activeIndex);
  })
  tabs: NavigationTab[] = [];

  @queryAssignedElements({flatten: true})
  protected tabsElement!: NavigationTab[];

  /** @soyPrefixAttribute */  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property({attribute: 'aria-label'})
  override ariaLabel?: string;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`<div class="md3-navigation-bar"
            role="tablist"
            aria-label="${ifDefined(this.ariaLabel)}"
            @keydown="${this.handleKeydown}"
            @navigation-tab-interaction="${this.handleNavigationTabInteraction}"
            @navigation-tab-rendered=${this.handleNavigationTabConnected}
          ><div class="md3-elevation-overlay"
        ></div><div class="md3-navigation-bar__tabs-slot-container"
        ><slot></slot></div></div>`;
  }

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.layout();
  }

  layout() {
    if (!this.tabsElement) return;
    const navTabs: NavigationTab[] = [];
    for (const node of this.tabsElement) {
      navTabs.push(node);
    }
    this.tabs = navTabs;
  }

  private handleNavigationTabConnected(event: CustomEvent) {
    const target = event.target as NavigationTab;
    if (this.tabs.indexOf(target) === -1) {
      this.layout();
    }
  }

  private handleNavigationTabInteraction(event: NavigationTabInteractionEvent) {
    this.activeIndex = this.tabs.indexOf(event.detail.state as NavigationTab);
  }

  private handleKeydown(event: KeyboardEvent) {
    const key = normalizeKey(event);
    const activeElementPath = deepActiveElementPath();
    const focusedTabIndex = this.tabs.findIndex((tab) => {
      return tab.buttonElement ===
          activeElementPath[activeElementPath.length - 1];
    });
    const isRTL =
        getComputedStyle(this).getPropertyValue('direction') === 'rtl';
    const maxIndex = this.tabs.length - 1;

    if (key === KEY.ENTER || key === KEY.SPACEBAR) {
      this.activeIndex = focusedTabIndex;
      return;
    }

    if (key === KEY.HOME) {
      this.tabs[0].focus();
      return;
    }

    if (key === KEY.END) {
      this.tabs[maxIndex].focus();
      return;
    }

    const toNextTab = (key === KEY.ARROW_RIGHT && !isRTL) ||
        (key === KEY.ARROW_LEFT && isRTL);
    if (toNextTab && focusedTabIndex === maxIndex) {
      this.tabs[0].focus();
      return;
    }
    if (toNextTab) {
      this.tabs[focusedTabIndex + 1].focus();
      return;
    }

    const toPreviousTab = (key === KEY.ARROW_LEFT && !isRTL) ||
        (key === KEY.ARROW_RIGHT && isRTL);
    if (toPreviousTab && focusedTabIndex === 0) {
      this.tabs[maxIndex].focus();
      return;
    }
    if (toPreviousTab) {
      this.tabs[focusedTabIndex - 1].focus();
      return;
    }
  }

  private onActiveIndexChange(value: number) {
    if (!this.tabs[value]) {
      throw new Error('NavigationBar: activeIndex is out of bounds.');
    }
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].active = i === value;
    }
  }

  private onHideInactiveLabelsChange(value: boolean) {
    for (const tab of this.tabs) {
      tab.hideInactiveLabel = value;
    }
  }
}
