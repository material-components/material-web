/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ariaProperty} from '@material/mwc-base/aria-property';
import {BaseElement} from '@material/mwc-base/base-element';
import {observer} from '@material/mwc-base/observer';
import {deepActiveElementPath} from '@material/mwc-base/utils';
import {NavigationTab} from 'google3/third_party/javascript/material_web_components/m3/navigationtab/lib/navigation-tab';
import {html, TemplateResult} from 'lit';
import {property, query, queryAssignedNodes} from 'lit/decorators';
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

  @queryAssignedNodes('', true, '*') protected tabsSlot!: HTMLElement[];

  /** @soyPrefixAttribute */  // tslint:disable-next-line:no-new-decorators
  @ariaProperty @property({attribute: 'aria-label'}) ariaLabel?: string;

  // BaseElement
  @query('.mdc-navigation-bar') protected mdcRoot!: HTMLElement;
  protected readonly mdcFoundationClass = MDCNavigationBarFoundation;
  protected mdcFoundation!: MDCNavigationBarFoundation;

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`<div class="mdc-navigation-bar"
            role="tablist"
            aria-label="${ifDefined(this.ariaLabel)}"
            @keydown="${this.handleKeydown}"
            @navigation-tab-interaction="${this.handleNavigationTabInteraction}"
            @navigation-tab-rendered=${this.onNavigationTabConnected}
          ><slot></slot></div>`;
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
          return tab.getRoot() === activeElement;
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
    if (!this.tabsSlot) return;
    const navTabs: NavigationTab[] = [];
    for (const node of this.tabsSlot) {
      if (this.isNavigationTab(node)) {
        navTabs.push(node);
      }
    }
    this.tabs = navTabs;
  }

  private handleNavigationTabInteraction(event: NavigationTabInteractionEvent) {
    this.mdcFoundation.handleNavigationTabInteraction(event);
  }

  private handleKeydown(event: KeyboardEvent) {
    this.mdcFoundation.handleKeydown(event);
  }

  protected isNavigationTab(element: Element): element is NavigationTab {
    return element instanceof NavigationTab;
  }
}
