/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {isRtl} from '../../controller/is-rtl.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {NavigationTab} from '../../navigationtab/lib/navigation-tab.js';

import {NavigationTabInteractionEvent} from './constants.js';
import {NavigationBarState} from './state.js';

/** @soyCompatible */
export class NavigationBar extends LitElement implements NavigationBarState {
  @property({type: Number}) activeIndex = 0;

  @property({type: Boolean}) hideInactiveLabels = false;

  tabs: NavigationTab[] = [];

  @queryAssignedElements({flatten: true})
  protected tabsElement!: NavigationTab[];

  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property({attribute: 'data-aria-label', noAccessor: true})
  override ariaLabel!: string;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`<div class="md3-navigation-bar"
            role="tablist"
            aria-label="${ifDefined(this.ariaLabel || undefined)}"
            @keydown="${this.handleKeydown}"
            @navigation-tab-interaction="${this.handleNavigationTabInteraction}"
            @navigation-tab-rendered=${this.handleNavigationTabConnected}
          ><md-elevation shadow surface
          ></md-elevation><div class="md3-navigation-bar__tabs-slot-container"
        ><slot></slot></div></div>`;
  }

  protected override updated(changedProperties: PropertyValues<NavigationBar>) {
    if (changedProperties.has('activeIndex')) {
      this.onActiveIndexChange(this.activeIndex);
      this.dispatchEvent(new CustomEvent('navigation-bar-activated', {
        detail:
            {tab: this.tabs[this.activeIndex], activeIndex: this.activeIndex},
        bubbles: true,
        composed: true
      }));
    }

    if (changedProperties.has('hideInactiveLabels')) {
      this.onHideInactiveLabelsChange(this.hideInactiveLabels);
    }

    if (changedProperties.has('tabs')) {
      this.onHideInactiveLabelsChange(this.hideInactiveLabels);
      this.onActiveIndexChange(this.activeIndex);
    }
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
    const key = event.key;
    const focusedTabIndex = this.tabs.findIndex((tab) => {
      return tab.matches(':focus-within');
    });
    const isRTL = isRtl(this);
    const maxIndex = this.tabs.length - 1;

    if (key === 'Enter' || key === ' ') {
      this.activeIndex = focusedTabIndex;
      return;
    }

    if (key === 'Home') {
      this.tabs[0].focus();
      return;
    }

    if (key === 'End') {
      this.tabs[maxIndex].focus();
      return;
    }

    const toNextTab =
        (key === 'ArrowRight' && !isRTL) || (key === 'ArrowLeft' && isRTL);
    if (toNextTab && focusedTabIndex === maxIndex) {
      this.tabs[0].focus();
      return;
    }
    if (toNextTab) {
      this.tabs[focusedTabIndex + 1].focus();
      return;
    }

    const toPreviousTab =
        (key === 'ArrowLeft' && !isRTL) || (key === 'ArrowRight' && isRTL);
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
