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
import {BaseElement, html, property, observer, query, customElement, Adapter, Foundation, PropertyValues} from '@material/mwc-base/base-element';
import {classMap} from 'lit-html/directives/classMap.js';
import MDCModalDrawerFoundation from '@material/drawer/modal/foundation.js';
import MDCDismissibleDrawerFoundation from '@material/drawer/dismissible/foundation.js';
import {strings} from '@material/drawer/constants.js';
//import {MDCModalDrawerFoundation, MDCDismissibleDrawerFoundation, strings, util, createFocusTrap} from '@material/drawer/foundation.js';
import {style} from './mwc-drawer-css';

export interface DrawerFoundation extends Foundation {
  open(): void;
  close(): void;
}

export declare var DrawerFoundation: {
  prototype: DrawerFoundation;
  new(adapter: Adapter): DrawerFoundation;
}

@customElement('mwc-drawer' as any)
export class Drawer extends BaseElement {

  @query('.mdc-drawer')
  mdcRoot!: HTMLElement;

  protected mdcFoundation!: MDCDismissibleDrawerFoundation|MDCModalDrawerFoundation;

  protected get mdcFoundationClass(): typeof DrawerFoundation {
    return this.modal ? MDCModalDrawerFoundation : MDCDismissibleDrawerFoundation;
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      elementHasClass: (element, className) => element.classList.contains(className),
      computeBoundingRect: () => this.mdcRoot.getBoundingClientRect(),
      saveFocus: () => {
        this._previousFocus = document.activeElement as HTMLElement;
      },
      restoreFocus: () => {
        const previousFocus = this._previousFocus && this._previousFocus.focus;
        if (this.mdcRoot.contains(document.activeElement) && previousFocus) {
          this._previousFocus.focus();
        }
      },
      // TODO(sorvell): List integration like this may not work. Need to understand
      // why this is here.
      focusActiveNavigationItem: () => {
        // const activeNavItemEl = this._root.querySelector(`.${MDCListFoundation.cssClasses.LIST_ITEM_ACTIVATED_CLASS}`)!;
        // if (activeNavItemEl) {
        //   (activeNavItemEl as HTMLElement).focus();
        // }
      },
      notifyClose: () => {
        this.open = false;
        this.dispatchEvent(new Event(strings.CLOSE_EVENT, {bubbles: true, cancelable: true}))
      },
      notifyOpen: () => {
        this.open = true;
        this.dispatchEvent(new Event(strings.OPEN_EVENT, {bubbles: true, cancelable: true}))
      },
      trapFocus: () => {/*this._focusTrap.activate()*/},
      releaseFocus: () => {/*this._focusTrap.deactivate()*/},
    }
  }

  // TODO(sorvell): integrate focus trapping.
  //private _focusTrap = undefined;
  private _previousFocus: HTMLElement|undefined = undefined;

  @observer(function(value) {
    if (value) {
      this.mdcFoundation.open();
    } else {
      this.mdcFoundation.close();
    }
  })
  @property({type: Boolean, reflect: true})
  open = false;

  @property({type: Boolean})
  hasHeader = false;

  @property({type: Boolean, reflect: true})
  dismissible = false;

  @property({type: Boolean, reflect: true})
  modal = false;

  renderStyle() {
    return style;
  }

  render() {
    return html`
      ${this.renderStyle()}
      <aside class="mdc-drawer
          ${classMap({'mdc-drawer--dismissible': this.dismissible, 'mdc-drawer--modal': this.modal})}">
        ${this.hasHeader ? html`
        <div class="mdc-drawer__header">
          <h3 class="mdc-drawer__title"><slot name="title"></slot></h3>
          <h6 class="mdc-drawer__subtitle"><slot name="subtitle"></slot></h6>
          <slot name="header"></slot>
        </div>
        ` : ''}
        <div class="mdc-drawer__content"><slot></slot></div>
      </aside>
      ${this.modal ? html`<div class="mdc-drawer-scrim" @click="${() => this.mdcFoundation.handleScrimClick()}"></div>` : ''}
      `;
  }

  // note, we avoid calling `super.firstUpdated()` to control when `createFoundation()` is called.
  firstUpdated() {
    this.mdcRoot.addEventListener('keydown', (e) => this.mdcFoundation.handleKeydown(e));
    this.mdcRoot.addEventListener('transitionend', (e) => this.mdcFoundation.handleTransitionEnd(e));
    //this._focusTrap = util.createFocusTrapInstance(this.mdcRoot, createFocusTrap);
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('modal')) {
      this.createFoundation();
    }
  }

}

declare global {
  interface HTMLElementTagNameMap {
    'mwc-drawer': Drawer;
  }
}