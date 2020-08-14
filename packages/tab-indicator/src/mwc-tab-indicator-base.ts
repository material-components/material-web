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
import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element';
import {MDCTabIndicatorAdapter} from '@material/tab-indicator/adapter';
import MDCFadingTabIndicatorFoundation from '@material/tab-indicator/fading-foundation';
import MDCTabIndicatorFoundation from '@material/tab-indicator/foundation';
import MDCSlidingTabIndicatorFoundation from '@material/tab-indicator/sliding-foundation';
import {html, property, PropertyValues, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';

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

  protected render() {
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

  protected updated(changedProperties: PropertyValues) {
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
