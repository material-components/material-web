/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ariaProperty} from '@material/mwc-base/aria-property';
import {BaseElement} from '@material/mwc-base/base-element';
import {observer} from '@material/mwc-base/observer';
import {deepActiveElementPath} from '@material/mwc-base/utils';
import {NavigationTab} from 'google3/third_party/javascript/material_web_components/m3/navigation_tab/lib/navigation-tab';
import {html, TemplateResult} from 'lit';
import {property, query, queryAssignedElements} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {NavigationTabInteractionEvent} from './constants';
import {MDCNavigationBarFoundation} from './foundation';
import {MDCNavigationBarAdapter, MDCNavigationBarState} from './state';

/** @soyCompatible */
export class NavigationBar extends BaseElement implements
    MDCNavigationBarState {
  // MDCNavigationBarState
  @property({type: Number})  // tslint:disable-next-line:no-new-decorators
  @observer(function(this: NavigationBar, value: number) {
    this.dispatchEvent(new CustomEvent(
        'navigation-bar-activated',
        {detail: {tab: this.tabs[value]}, bubbles: true, composed: true}));
  })
  activeIndex = 0;

  @property({type: Boolean}) hideInactiveLabels = false;
  tabs: NavigationTab[] = [];

  @queryAssignedElements({flatten: true})
  protected tabsElement!: NavigationTab[];

  /** @soyPrefixAttribute */  // tslint:disable-next-line:no-new-decorators
  @ariaProperty
  @property({attribute: 'aria-label'})
  override ariaLabel?: string;

  // BaseElement
  @query('.md3-navigation-bar') protected mdcRoot!: HTMLElement;
  protected readonly mdcFoundationClass = MDCNavigationBarFoundation;
  protected mdcFoundation!: MDCNavigationBarFoundation;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`<div class="md3-navigation-bar"
            role="tablist"
            aria-label="${ifDefined(this.ariaLabel)}"
            @keydown="${this.handleKeydown}"
            @navigation-tab-interaction="${this.handleNavigationTabInteraction}"
            @navigation-tab-rendered=${this.onNavigationTabConnected}
          ><div class="md3-elevation-overlay"
        ></div><div class="md3-navigation-bar__tabs-slot-container"
        ><slot></slot></div></div>`;
  }

  override firstUpdated() {
    super.firstUpdated();
    this.layout();
  }

  protected createAdapter(): MDCNavigationBarAdapter {
    return {
      state: this,
      focusTab: (index) => {
        this.tabs[index].focus();
      },
      getFocusedTabIndex: () => {
        const activeElementPath = deepActiveElementPath();
        const activeElement = activeElementPath[activeElementPath.length - 1];
        return this.tabs.findIndex((tab) => {
          return tab.buttonElement === activeElement;
        });
      },
      isRTL: () =>
          getComputedStyle(this).getPropertyValue('direction') === 'rtl',
    };
  }

  protected onNavigationTabConnected(event: CustomEvent) {
    const target = event.target as NavigationTab;
    if (this.tabs.indexOf(target) === -1) {
      this.layout();
    }
  }

  layout() {
    if (!this.tabsElement) return;
    const navTabs: NavigationTab[] = [];
    for (const node of this.tabsElement) {
      navTabs.push(node);
    }
    this.tabs = navTabs;
  }

  private handleNavigationTabInteraction(event: NavigationTabInteractionEvent) {
    this.mdcFoundation.handleNavigationTabInteraction(event);
  }

  private handleKeydown(event: KeyboardEvent) {
    this.mdcFoundation.handleKeydown(event);
  }
}
