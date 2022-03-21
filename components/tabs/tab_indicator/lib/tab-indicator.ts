/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element';
import {html, PropertyValues} from 'lit';
import {property, query} from 'lit/decorators';
import {classMap} from 'lit/directives/class-map';

import {MDCTabIndicatorAdapter} from './adapter';
import MDCFadingTabIndicatorFoundation from './fading-foundation';
import MDCTabIndicatorFoundation from './foundation';
import MDCSlidingTabIndicatorFoundation from './sliding-foundation';

export class TabIndicator extends BaseElement {
  protected mdcFoundation!: MDCTabIndicatorFoundation;

  protected get mdcFoundationClass() {
    return this.fade ? MDCFadingTabIndicatorFoundation :
                       MDCSlidingTabIndicatorFoundation;
  }

  @query('.md3-tab-indicator') protected mdcRoot!: HTMLElement;

  @query('.md3-tab-indicator__content') protected contentElement!: HTMLElement;

  @property() icon = '';

  @property({type: Boolean}) fade = false;

  protected override render() {
    const contentClasses = {
      'md3-tab-indicator__content--icon': this.icon,
      'material-icons': this.icon,
      'md3-tab-indicator__content--underline': !this.icon,
    };
    return html`
      <span class="md3-tab-indicator ${classMap({
      'md3-tab-indicator--fade': this.fade
    })}">
        <span class="md3-tab-indicator__content ${classMap(contentClasses)}">${
        this.icon}</span>
      </span>
      `;
  }

  protected override updated(changedProperties: PropertyValues) {
    if (changedProperties.has('fade')) {
      this.createFoundation();
    }
  }

  protected createAdapter(): MDCTabIndicatorAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      computeContentClientRect: () =>
          this.contentElement.getBoundingClientRect(),
      setContentStyleProperty: (prop: string, value: string) =>
          this.contentElement.style.setProperty(prop, value),
    };
  }

  computeContentClientRect() {
    return this.mdcFoundation.computeContentClientRect();
  }

  activate(previousIndicatorClientRect?: DOMRect) {
    this.mdcFoundation.activate(previousIndicatorClientRect);
  }

  deactivate() {
    this.mdcFoundation.deactivate();
  }
}
