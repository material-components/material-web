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
import {BaseElement, html, property, observer, query, customElement, Adapter, Foundation, PropertyValues, classMap} from '@material/mwc-base/base-element.js';
import MDCModalDrawerFoundation from '@material/drawer/modal/foundation.js';
import MDCDismissibleDrawerFoundation from '@material/drawer/dismissible/foundation.js';
import {strings} from '@material/drawer/constants.js';
import {style} from './mwc-drawer-css.js';
import 'wicg-inert/dist/inert.js';
import 'blocking-elements/blocking-elements.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-drawer': Drawer;
  }

  interface Document {
    $blockingElements: {
      push(HTMLElement): void;
      remove(HTMLElement): Boolean;
    }
  }
}

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
  protected mdcRoot!: HTMLElement;

  protected mdcFoundation!: MDCDismissibleDrawerFoundation|MDCModalDrawerFoundation;

  protected get mdcFoundationClass(): typeof DrawerFoundation {
    return this.type === 'modal' ? MDCModalDrawerFoundation : MDCDismissibleDrawerFoundation;
  }

  protected createAdapter() {
    return {
      ...super.createAdapter(),
      elementHasClass: (element: HTMLElement, className: string) => element.classList.contains(className),
      computeBoundingRect: () => this.mdcRoot.getBoundingClientRect(),
      saveFocus: () => {
        // Note, casting to avoid cumbersome runtime check.
        this._previousFocus = (this.getRootNode() as any as DocumentOrShadowRoot).activeElement as HTMLElement|null;
      },
      restoreFocus: () => {
        document.$blockingElements.remove(this);
        const previousFocus = this._previousFocus && this._previousFocus.focus;
        if (previousFocus) {
          this._previousFocus!.focus();
        }
      },
      notifyClose: () => {
        this.open = false;
        this.dispatchEvent(new Event(strings.CLOSE_EVENT, {bubbles: true, cancelable: true}))
      },
      notifyOpen: () => {
        this.open = true;
        this.dispatchEvent(new Event(strings.OPEN_EVENT, {bubbles: true, cancelable: true}))
      },
      // TODO(sorvell): Implement list focusing integration.
      focusActiveNavigationItem: () => {
      },
      trapFocus: () => {
        document.$blockingElements.push(this);
      },
    }
  }

  private _previousFocus: HTMLElement|null = null;

  private _handleScrimClick() {
    this.mdcFoundation.handleScrimClick()
  };

  @observer(function(this: Drawer, value: boolean) {
    if (this.type === '') {
      return;
    }
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

  @property({reflect: true})
  type = '';

  static styles = style;

  render() {
    const dismissible = this.type === 'dismissible' || this.type === 'modal';
    const modal = this.type === 'modal';
    const header = this.hasHeader ? html`
      <div class="mdc-drawer__header">
        <h3 class="mdc-drawer__title"><slot name="title"></slot></h3>
        <h6 class="mdc-drawer__subtitle"><slot name="subtitle"></slot></h6>
        <slot name="header"></slot>
      </div>
      ` : '';
    return html`
      <aside class="mdc-drawer
          ${classMap({'mdc-drawer--dismissible': dismissible, 'mdc-drawer--modal': modal})}">
        ${header}
        <div class="mdc-drawer__content"><slot></slot></div>
      </aside>
      ${modal ? html`<div class="mdc-drawer-scrim" @click="${this._handleScrimClick}"></div>` : ''}
      <div class="mdc-drawer-app-content">
        <slot name="appContent"></slot>
      </div>
      `;
  }

  // note, we avoid calling `super.firstUpdated()` to control when `createFoundation()` is called.
  firstUpdated() {
    this.mdcRoot.addEventListener('keydown', (e) => this.mdcFoundation.handleKeydown(e));
    this.mdcRoot.addEventListener('transitionend', (e) => this.mdcFoundation.handleTransitionEnd(e));
  }

  updated(changedProperties: PropertyValues) {
    if (changedProperties.has('type')) {
      this.createFoundation();
    }
  }
}