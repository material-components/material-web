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
import {BaseElement, html, property, query, customElement, PropertyValues, classMap, SpecificEventListener, addHasRemoveClass} from '@material/mwc-base/base-element.js';
import MDCTopAppBarBaseFoundation from '@material/top-app-bar/foundation';
import MDCTopAppBarFoundation from '@material/top-app-bar/standard/foundation.js';
import MDCShortTopAppBarFoundation from '@material/top-app-bar/short/foundation.js';
import MDCFixedTopAppBarFoundation from '@material/top-app-bar/fixed/foundation.js';
import {strings} from '@material/top-app-bar/constants.js';
import {style} from './mwc-top-app-bar-css.js';
import { MDCTopAppBarAdapter } from '@material/top-app-bar/adapter';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-top-app-bar': TopAppBar;
  }
}

@customElement('mwc-top-app-bar' as any)
export class TopAppBar extends BaseElement {

  protected mdcFoundation!: MDCTopAppBarBaseFoundation;

  protected get mdcFoundationClass() {
    return this.type === 'fixed' || this.type === 'prominentFixed' ? MDCFixedTopAppBarFoundation :
        (this.type === 'short' || this.type === 'shortCollapsed' ? MDCShortTopAppBarFoundation : MDCTopAppBarFoundation);
  }

  @query('.mdc-top-app-bar')
  protected mdcRoot!: HTMLElement;

  @query('[name="navigationIcon"]')
  private _navIconSlot!: HTMLSlotElement;

  @query('[name="actionItems"]')
  private _actionItemsSlot!: HTMLSlotElement;

  // type can be 'fixed' || 'prominent' || 'short' || 'shortCollapsed' || 'prominentFixed'
  @property({reflect: true})
  type = '';

  @property({type: Boolean, reflect: true})
  dense = false;

  @property({type: Boolean, reflect: true})
  centerTitle = false;

  private _scrollTarget!: HTMLElement|Window;

  get scrollTarget() {
    return this._scrollTarget || window as Window;
  }

  set scrollTarget(value) {
    const old = this.scrollTarget;
    this._scrollTarget = value;
    this.requestUpdate('scrollTarget', old);
  }

  static styles = style;

  // TODO(sorvell): MDC decorates the navigation icon and action items with
  // ripples. Since these are slotted items here, the assumption is that the
  // user brings a web component with a ripple if rippling is desired.
  render() {
    const classes = {
      'mdc-top-app-bar--fixed': this.type === 'fixed' || this.type === 'prominentFixed',
      'mdc-top-app-bar--short': this.type === 'shortCollapsed' || this.type === 'short',
      'mdc-top-app-bar--short-collapsed': this.type === 'shortCollapsed',
      'mdc-top-app-bar--prominent': this.type === 'prominent' || this.type === 'prominentFixed',
      'mdc-top-app-bar--dense': this.dense,
      'mwc-top-app-bar--center-title': this.centerTitle
    };
    const alignStartTitle = !this.centerTitle ? html`
      <span class="mdc-top-app-bar__title"><slot name="title"></slot></span>
    ` : '';
    const centerSection = this.centerTitle ? html`
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-center">
        <span class="mdc-top-app-bar__title"><slot name="title"></slot></span>
      </section>` : '';
    return html`
      <header class="mdc-top-app-bar ${classMap(classes)}">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <slot name="navigationIcon"></slot>
          ${alignStartTitle}
        </section>
        ${centerSection}
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
          <slot name="actionItems"></slot>
        </section>
      </div>
    </header>`;
  }

  protected createAdapter(): MDCTopAppBarAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      setStyle: (property: string, value: string) => this.mdcRoot.style.setProperty(property, value),
      getTopAppBarHeight: () => this.mdcRoot.clientHeight,
      // TODO(sorvell): don't understand why the top-app-bar knows about navigation
      registerNavigationIconInteractionHandler: (type: string, handler: EventListenerOrEventListenerObject) => {
        if (this._navIconSlot) {
          this._navIconSlot.addEventListener(type, handler);
        }
      },
      deregisterNavigationIconInteractionHandler: (type, handler) => {
        if (this._navIconSlot) {
          this._navIconSlot.removeEventListener(type, handler);
        }
      },
      notifyNavigationIconClicked: () => {
        this.dispatchEvent(new Event(strings.NAVIGATION_EVENT, {bubbles: true, cancelable: true}));
      },
      registerScrollHandler: (handler: SpecificEventListener<'scroll'>) =>
          this.scrollTarget.addEventListener('scroll', handler as EventListenerOrEventListenerObject),
      deregisterScrollHandler: (handler: SpecificEventListener<'scroll'>) =>
          this.scrollTarget.removeEventListener('scroll', handler as EventListenerOrEventListenerObject),
      registerResizeHandler: (handler: SpecificEventListener<'resize'>) =>
          window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler: SpecificEventListener<'resize'>) =>
          window.removeEventListener('resize', handler),
      getViewportScrollY: () => this.scrollTarget[this.scrollTarget === window ? 'pageYOffset' : 'scrollTop'],
      getTotalActionItems: () =>
        this._actionItemsSlot.assignedNodes({flatten: true}).length,
    };
  }

  // override that prevents `super.firstUpdated` since we are controlling when `createFoundation` is called.
  firstUpdated() {}

  updated(changedProperties: PropertyValues) {
    // update foundation if `type` or `scrollTarget` changes
    if (changedProperties.has('type') || changedProperties.has('scrollTarget')) {
      this.createFoundation();
    }
  }

  createFoundation() {
    super.createFoundation();
    const windowScroller = this.scrollTarget === window;
    // we add support for top-app-bar's tied to an element scroller.
    this.mdcRoot.style.position = windowScroller ? '' : 'absolute';
    // TODO(sorvell): not sure why this is necessary but the MDC demo does it.
    this.mdcRoot.style.top = windowScroller ? '0px' : '';
  }
}