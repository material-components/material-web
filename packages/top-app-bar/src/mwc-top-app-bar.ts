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
import MDCTopAppBarFoundation from '@material/top-app-bar/standard/foundation.js';
import MDCShortTopAppBarFoundation from '@material/top-app-bar/short/foundation.js';
import MDCFixedTopAppBarFoundation from '@material/top-app-bar/fixed/foundation.js';
import {strings} from '@material/top-app-bar/constants.js';
import {style} from './mwc-top-app-bar-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-top-app-bar': TopAppBar;
  }
}

export interface TopAppBarFoundation extends Foundation {
}

export declare var TopAppBarFoundation: {
  prototype: TopAppBarFoundation;
  new(adapter: Adapter): TopAppBarFoundation;
}

@customElement('mwc-top-app-bar' as any)
export class TopAppBar extends BaseElement {

  protected mdcFoundation: MDCShortTopAppBarFoundation|MDCFixedTopAppBarFoundation|MDCTopAppBarFoundation;

  protected get mdcFoundationClass(): typeof TopAppBarFoundation {
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

  // does not work with prominent
  @property({type: Boolean, reflect: true})
  extraRow = false;

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
      'mdc-top-app-bar--dense': this.dense
    };
    const extraRow = this.extraRow ? html`
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section">
          <slot name="extraRow"></slot>
        </section>
      </div>` : '';
    return html`
      <header class="mdc-top-app-bar ${classMap(classes)}">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <slot name="navigationIcon"></slot>
          <span class="mdc-top-app-bar__title"><slot name="title"></slot></span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
          <slot name="actionItems"></slot>
        </section>
      </div>
      ${extraRow}
    </header>`;
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
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
      registerScrollHandler: (handler: EventListenerOrEventListenerObject) =>
          this.scrollTarget.addEventListener('scroll', handler),
      deregisterScrollHandler: (handler: EventListenerOrEventListenerObject) =>
          this.scrollTarget.removeEventListener('scroll', handler),
      registerResizeHandler: (handler: EventListenerOrEventListenerObject) =>
          window.addEventListener('resize', handler),
      deregisterResizeHandler: (handler: EventListenerOrEventListenerObject) =>
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