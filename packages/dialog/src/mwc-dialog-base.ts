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
import 'blocking-elements';
import 'wicg-inert';

import {MDCDialogAdapter} from '@material/dialog/adapter.js';
import {cssClasses} from '@material/dialog/constants.js';
import MDCDialogFoundation from '@material/dialog/foundation.js';
import {applyPassive} from '@material/dom/events';
import {closest, matches} from '@material/dom/ponyfill';
import {addHasRemoveClass, BaseElement, observer} from '@material/mwc-base/base-element.js';
import {DocumentWithBlockingElements} from 'blocking-elements';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';

export {MDCDialogCloseEventDetail} from '@material/dialog/types';

const blockingElements =
    (document as DocumentWithBlockingElements).$blockingElements;

export class DialogBase extends BaseElement {
  @query('.mdc-dialog') protected mdcRoot!: HTMLDivElement;

  // _actionItemsSlot should have type HTMLSlotElement, but when TypeScript's
  // emitDecoratorMetadata is enabled, the HTMLSlotElement constructor will
  // be emitted into the runtime, which will cause an "HTMLSlotElement is
  // undefined" error in browsers that don't define it (e.g. Edge and IE11).
  @query('slot[name="primaryAction"]') protected primarySlot!: HTMLElement;

  // _actionItemsSlot should have type HTMLSlotElement, but when TypeScript's
  // emitDecoratorMetadata is enabled, the HTMLSlotElement constructor will
  // be emitted into the runtime, which will cause an "HTMLSlotElement is
  // undefined" error in browsers that don't define it (e.g. Edge and IE11).
  @query('slot[name="secondaryAction"]') protected secondarySlot!: HTMLElement;

  @query('.mdc-dialog__content') protected contentElement!: HTMLDivElement;

  @query('.mdc-container') protected conatinerElement!: HTMLDivElement;

  @property({type: Boolean}) hideActions = false;

  @property({type: Boolean})
  @observer(function(this: DialogBase) {
    this.forceLayout();
  })
  stacked = false;

  @property({type: String}) title = '';

  @property({type: String})
  @observer(function(this: DialogBase, newAction: string) {
    this.mdcFoundation.setScrimClickAction(newAction);
  })
  scrimClickAction = 'close';

  @property({type: String})
  @observer(function(this: DialogBase, newAction: string) {
    this.mdcFoundation.setEscapeKeyAction(newAction);
  })
  escapeKeyAction = 'close';

  @property({type: Boolean, reflect: true})
  @observer(function(this: DialogBase, isOpen: boolean) {
    if (isOpen) {
      if (this.mdcFoundation) {
        this.setEventListeners();

        this.mdcFoundation.open();
      }
    } else {
      if (this.mdcFoundation) {
        this.removeEventListeners();
        this.mdcFoundation.close(this.currentAction || this.defaultAction);
        this.currentAction = undefined;
      }
    }
  })
  open = false;

  @property() defaultAction = 'close';
  @property() actionAttribute = 'dialogAction';
  @property() initialFocusAttribute = 'dialogInitialFocus';

  protected get primaryButton(): HTMLElement|null {
    let assignedNodes = (this.primarySlot as HTMLSlotElement).assignedNodes();
    assignedNodes = assignedNodes.filter((node) => node instanceof HTMLElement);
    const button = assignedNodes[0] as HTMLElement | undefined;
    return button ? button : null;
  }

  protected currentAction: string|undefined;
  protected mdcFoundationClass = MDCDialogFoundation;
  protected mdcFoundation!: MDCDialogFoundation;
  protected boundLayout: (() => void)|null = null;
  protected boundHandleClick: ((ev: MouseEvent) => void)|null = null;
  protected boundHandleKeydown: ((ev: KeyboardEvent) => void)|null = null;
  protected boundHandleDocumentKeydown:
      ((ev: KeyboardEvent) => void)|null = null;

  protected emitNotification(name: string, action?: string) {
    const init: CustomEventInit = {detail: action ? {action} : {}};
    const ev = new CustomEvent(name, init);
    this.dispatchEvent(ev);
  }

  protected getInitialFocusEl(): HTMLElement|null {
    return this.querySelector(`[${this.initialFocusAttribute}]`);
  }

  protected createAdapter(): MDCDialogAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      addBodyClass: () => document.body.style.overflow = 'hidden',
      removeBodyClass: () => document.body.style.overflow = '',
      areButtonsStacked: () => this.stacked,
      clickDefaultButton: () => {
        const primary = this.primaryButton;
        if (primary) {
          primary.click();
        }
      },
      eventTargetMatches: (target, selector) =>
          target ? matches(target as Element, selector) : false,
      getActionFromEvent: (e: Event) => {
        if (!e.target) {
          return '';
        }

        const element =
            closest(e.target as Element, `[${this.actionAttribute}]`);
        const action = element && element.getAttribute(this.actionAttribute);
        return action;
      },
      getInitialFocusEl: () => {
        return this.getInitialFocusEl();
      },
      isContentScrollable: () => {
        const el = this.contentElement;
        return el ? el.scrollHeight > el.offsetHeight : false;
      },
      notifyClosed: (action) => this.emitNotification('closed', action),
      notifyClosing: (action) => {
        this.open = false;
        this.emitNotification('closing', action);
      },
      notifyOpened: () => this.emitNotification('opened'),
      notifyOpening: () => {
        this.open = true;
        this.emitNotification('opening');
      },
      reverseButtons: () => {},
      releaseFocus: () => {
        blockingElements.remove(this);
      },
      trapFocus: (el) => {
        blockingElements.push(this);
        if (el) {
          el.focus();
        }
      },
    };
  }

  protected render() {
    const classes = {
      [cssClasses.STACKED]: this.stacked,
    };

    let title = html``;

    if (this.title) {
      title = html`<h2 class="mdc-dialog__title">${this.title}</h2>`;
    }

    const actionsClasses = {
      'mdc-dialog__actions': !this.hideActions,
    };

    return html`
    <div class="mdc-dialog ${classMap(classes)}"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="my-dialog-title"
        aria-describedby="my-dialog-content">
      <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface">
          ${title}
          <div class="mdc-dialog__content">
            <slot></slot>
          </div>
          <footer
              id="actions"
              class="${classMap(actionsClasses)}">
            <span>
              <slot name="secondaryAction"></slot>
            </span>
            <span>
             <slot name="primaryAction"></slot>
            </span>
          </footer>
        </div>
      </div>
      <div class="mdc-dialog__scrim"></div>
    </div>`;
  }

  firstUpdated() {
    super.firstUpdated();
    this.mdcFoundation.setAutoStackButtons(true);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListeners();
  }

  forceLayout() {
    this.mdcFoundation.layout();
  }

  focus() {
    const initialFocusEl = this.getInitialFocusEl();
    initialFocusEl && initialFocusEl.focus();
  }

  blur() {
    if (!this.shadowRoot) {
      return;
    }

    const activeEl = this.shadowRoot.activeElement;
    if (activeEl) {
      if (activeEl instanceof HTMLElement) {
        activeEl.blur();
      }
    } else {
      const root = this.getRootNode();
      const activeEl = root instanceof Document ? root.activeElement : null;
      if (activeEl instanceof HTMLElement) {
        activeEl.blur();
      }
    }
  }

  protected setEventListeners() {
    this.boundHandleClick = this.mdcFoundation.handleClick.bind(
                                this.mdcFoundation) as EventListener;
    this.boundLayout = () => {
      if (this.open) {
        this.mdcFoundation.layout.bind(this.mdcFoundation);
      }
    };
    this.boundHandleKeydown = this.mdcFoundation.handleKeydown.bind(
                                  this.mdcFoundation) as EventListener;
    this.boundHandleDocumentKeydown =
        this.mdcFoundation.handleDocumentKeydown.bind(this.mdcFoundation) as
        EventListener;

    this.mdcRoot.addEventListener('click', this.boundHandleClick);
    window.addEventListener('resize', this.boundLayout, applyPassive());
    window.addEventListener(
        'orientationchange', this.boundLayout, applyPassive());
    this.addEventListener('keydown', this.boundHandleKeydown, applyPassive());
    document.addEventListener(
        'keydown', this.boundHandleDocumentKeydown, applyPassive());
  }

  protected removeEventListeners() {
    if (this.boundHandleClick) {
      this.mdcRoot.removeEventListener('click', this.boundHandleClick);
    }

    if (this.boundLayout) {
      window.removeEventListener('resize', this.boundLayout);
      window.removeEventListener('orientationchange', this.boundLayout);
    }

    if (this.boundHandleKeydown) {
      this.mdcRoot.removeEventListener('keydown', this.boundHandleKeydown);
    }

    if (this.boundHandleDocumentKeydown) {
      this.mdcRoot.removeEventListener(
          'keydown', this.boundHandleDocumentKeydown);
    }
  }
}
