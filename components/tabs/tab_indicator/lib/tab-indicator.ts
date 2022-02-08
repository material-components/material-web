/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element';
import {html, PropertyValues} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {MDCTabIndicatorAdapter} from './adapter';
import MDCFadingTabIndicatorFoundation from './fading-foundation';
import MDCTabIndicatorFoundation from './foundation';
import MDCSlidingTabIndicatorFoundation from './sliding-foundation';

export class TabIndicatorBase extends BaseElement {
  protected mdcFoundation!: MDCTabIndicatorFoundation;

  protected get mdcFoundationClass() {
    return this.fade ? MDCFadingTabIndicatorFoundation :
                       MDCSlidingTabIndicatorFoundation;
  }

  @query('.mdc-tab-indicator') protected mdcRoot!: HTMLElement;

  @query('.mdc-tab-indicator__content') protected contentElement!: HTMLElement;

  @property() icon = '';

  @property({type: Boolean}) fade = false;

  protected override render() {
    const contentClasses = {
      'mdc-tab-indicator__content--icon': this.icon,
      'material-icons': this.icon,
      'mdc-tab-indicator__content--underline': !this.icon,
    };
    return html`
      <span class="mdc-tab-indicator ${classMap({
      'mdc-tab-indicator--fade': this.fade
    })}">
        <span class="mdc-tab-indicator__content ${classMap(contentClasses)}">${
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

  activate(previousIndicatorClientRect?: ClientRect) {
    this.mdcFoundation.activate(previousIndicatorClientRect);
  }

  deactivate() {
    this.mdcFoundation.deactivate();
  }
}
