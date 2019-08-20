/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

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
import {addHasRemoveClass, BaseElement, classMap, html, property, query} from '@material/mwc-base/base-element';
import {supportsPassiveEventListener} from '@material/mwc-base/utils';
import {MDCTopAppBarAdapter} from '@material/top-app-bar/adapter';
import {strings} from '@material/top-app-bar/constants';
import MDCTopAppBarBaseFoundation from '@material/top-app-bar/foundation';

export const passiveEventListener =
    supportsPassiveEventListener ? {passive: true} : undefined;

type ClassInfo = {
  [key: string]: boolean
};

export abstract class TopAppBarBaseBase extends BaseElement {
  protected abstract mdcFoundation: MDCTopAppBarBaseFoundation;

  protected abstract mdcFoundationClass = MDCTopAppBarBaseFoundation;

  @query('.mdc-top-app-bar') protected mdcRoot!: HTMLElement;

  // _actionItemsSlot should have type HTMLSlotElement, but when TypeScript's
  // emitDecoratorMetadata is enabled, the HTMLSlotElement constructor will
  // be emitted into the runtime, which will cause an "HTMLSlotElement is
  // undefined" error in browsers that don't define it (e.g. Edge and IE11).
  @query('slot[name="actionItems"]') private _actionItemsSlot!: HTMLElement;

  private _scrollTarget!: HTMLElement|Window;

  @property()
  get scrollTarget() {
    return this._scrollTarget || window;
  }

  set scrollTarget(value) {
    const old = this.scrollTarget;
    this._scrollTarget = value;
    this.updateRootPosition();
    this.requestUpdate('scrollTarget', old);
  }

  private updateRootPosition() {
    if (this.mdcRoot) {
      const windowScroller = this.scrollTarget === window;
      // we add support for top-app-bar's tied to an element scroller.
      this.mdcRoot.style.position = windowScroller ? '' : 'absolute';
    }
  }

  /**
   * classMap map for classes on the bar
   */
  protected abstract barClasses: ClassInfo;

  /**
   * classMap map for classes on the content slot
   */
  protected abstract contentClasses: ClassInfo;

  // TODO(sorvell): MDC decorates the navigation icon and action items with
  // ripples. Since these are slotted items here, the assumption is that the
  // user brings a web component with a ripple if rippling is desired.
  protected render() {
    return html`
      <header class="mdc-top-app-bar ${classMap(this.barClasses)}">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start" id="navigation">
          <slot name="navigationIcon" @click=${
        this.handleNavigationClick}></slot>
          <span class="mdc-top-app-bar__title"><slot name="title"></slot></span>
        </section>
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" id="actions" role="toolbar">
          <slot name="actionItems"></slot>
        </section>
      </div>
    </header>
    <div class="${classMap(this.contentClasses)}">
      <slot></slot>
    </div>
    `;
  }

  protected createAdapter(): MDCTopAppBarAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      setStyle: (property: string, value: string) =>
          this.mdcRoot.style.setProperty(property, value),
      getTopAppBarHeight: () => this.mdcRoot.clientHeight,
      notifyNavigationIconClicked: () => {
        this.dispatchEvent(new Event(
            strings.NAVIGATION_EVENT, {bubbles: true, cancelable: true}));
      },
      getViewportScrollY: () => this.scrollTarget instanceof Window ?
          this.scrollTarget.pageYOffset :
          this.scrollTarget.scrollTop,
      getTotalActionItems: () => (this._actionItemsSlot as HTMLSlotElement)
                                     .assignedNodes({flatten: true})
                                     .length,
    };
  }

  protected handleTargetScroll = () => {
    this.mdcFoundation.handleTargetScroll();
  };

  protected handleNavigationClick = () => {
    this.mdcFoundation.handleNavigationClick();
  };

  protected registerListeners() {
    this.scrollTarget.addEventListener(
        'scroll', this.handleTargetScroll, passiveEventListener);
  }

  protected unregisterListeners() {
    this.scrollTarget.removeEventListener('scroll', this.handleTargetScroll);
  }

  protected firstUpdated() {
    super.firstUpdated();
    this.updateRootPosition();
    this.registerListeners();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unregisterListeners();
  }
}
