/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {BaseElement, html, property, query, customElement, Adapter, Foundation, PropertyValues, classMap} from '@material/mwc-base/base-element.js';
import MDCSlidingTabIndicatorFoundation from '@material/tab-indicator/sliding-foundation.js';
import MDCFadingTabIndicatorFoundation from '@material/tab-indicator/fading-foundation.js';
import {style} from './mwc-tab-indicator-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-tab-indicator': TabIndicator;
  }
}

export interface TabIndicatorFoundation extends Foundation {
  handleTransitionEnd(e: Event): void;
  computeContentClientRect(): ClientRect;
  activate(previousIndicatorClientRect?: ClientRect): void;
  deactivate(): void;
}

export declare var TabIndicatorFoundation: {
  prototype: TabIndicatorFoundation;
  new(adapter: Adapter): TabIndicatorFoundation;
}

@customElement('mwc-tab-indicator' as any)
export class TabIndicator extends BaseElement {

  protected mdcFoundation!: MDCSlidingTabIndicatorFoundation|MDCFadingTabIndicatorFoundation;

  protected get mdcFoundationClass(): typeof TabIndicatorFoundation {
    return this.fade ? MDCFadingTabIndicatorFoundation : MDCSlidingTabIndicatorFoundation;
  }

  @query('.mdc-tab-indicator')
  protected mdcRoot!: HTMLElement;

  @query('.mdc-tab-indicator__content')
  protected contentElement!: HTMLElement;

  @property()
  icon = '';

  @property({type: Boolean})
  fade = false;

  static styles = style;

  render() {
    const contentClasses = {
      'mdc-tab-indicator__content--icon': this.icon,
      'material-icons': this.icon,
      'mdc-tab-indicator__content--underline': !this.icon
    };
    return html`
      <span class="mdc-tab-indicator ${classMap({'mdc-tab-indicator--fade': this.fade})}">
        <span class="mdc-tab-indicator__content ${classMap(contentClasses)}">${this.icon}</span>
      </span>
      `;
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('fade')) {
      this.createFoundation();
    }
  }

  createAdapter() {
    return {
      ...super.createAdapter(),
      computeContentClientRect: () => this.contentElement.getBoundingClientRect(),
      setContentStyleProperty: (prop: string, value: string) =>
          this.contentElement.style.setProperty(prop, value)
    };
  }

  createFoundation() {
    if (this.mdcFoundation !== undefined) {
      this.mdcFoundation.destroy();
    }
    super.createFoundation();
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