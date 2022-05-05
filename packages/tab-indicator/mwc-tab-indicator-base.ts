/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element.js';
import {MDCTabIndicatorAdapter} from '@material/tab-indicator/adapter.js';
import MDCFadingTabIndicatorFoundation from '@material/tab-indicator/fading-foundation.js';
import MDCTabIndicatorFoundation from '@material/tab-indicator/foundation.js';
import MDCSlidingTabIndicatorFoundation from '@material/tab-indicator/sliding-foundation.js';
import {html, PropertyValues} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

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

  activate(previousIndicatorClientRect?: DOMRect) {
    this.mdcFoundation.activate(previousIndicatorClientRect);
  }

  deactivate() {
    this.mdcFoundation.deactivate();
  }
}
