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
import {addHasRemoveClass, BaseElement, classMap, html, observer, property, query} from '@material/mwc-base/base-element.js';
import {DocumentWithBlockingElements} from 'blocking-elements';

export {MDCDialogCloseEventDetail} from '@material/dialog/types';

const blockingElements =
    (document as DocumentWithBlockingElements).$blockingElements;

export class DialogBase extends BaseElement {
  @query('.mdc-dialog') protected mdcRoot!: HTMLDivElement;

  @query('slot[name="primaryAction"]') protected primarySlot!: HTMLSlotElement;

  @query('slot[name="secondaryAction"]')
  protected secondarySlot!: HTMLSlotElement;

  @query('.mdc-dialog__content') protected contentElement!: HTMLDivElement;

  @query('.mdc-container') protected conatinerElement!: HTMLDivElement;

  @property({type: Boolean}) protected actionsReversed: boolean = false;

  @property({type: Boolean}) hideActions: boolean = false;

  @property({type: Boolean})
  @observer(function(this: DialogBase) {
    this.forceLayout();
  })
  stacked: boolean = false;

  @property({type: String}) title: string = '';

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
      if (this.originalOpen) {
        this.originalOpen();
      }
    } else {
      if (this.originalClose) {
        this.originalClose(this.currentAction || this.defaultAction);
        this.currentAction = undefined;
      }
    }
  })
  open = false;

  defaultAction = 'close';
  actionAttribute = 'dialog-action';
  initialFocusAttribute = 'dialog-initial-focus';

  protected get primaryButton(): HTMLElement|null {
    const assignedNodes = this.primarySlot.assignedNodes();
    assignedNodes.filter((node) => node instanceof HTMLElement);
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
  protected originalClose: null|((action?: string|undefined) => void) = null;
  protected originalOpen: null|(() => void) = null;

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
          target ? (target as Element).matches(selector) : false,
      getActionFromEvent: (e: Event) => {
        if (!e.target) {
          return '';
        }

        const element =
            (e.target as Element).closest(`[${this.actionAttribute}]`);
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
      notifyClosing: (action) => this.emitNotification('closing', action),
      notifyOpened: () => this.emitNotification('opened'),
      notifyOpening: () => this.emitNotification('opening'),
      reverseButtons: () => this.actionsReversed = !this.actionsReversed,
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

    const actoinsClasses = {
      'mdc-dialog__actions': !this.hideActions,
    };

    let slotNames = ['secondaryAction', 'primaryAction'];

    if (this.actionsReversed) {
      slotNames = slotNames.reverse();
    }

    const actionSlots = html`
        <slot name="${slotNames[0]}"></slot>
        <slot name="${slotNames[1]}"></slot>`;

    return html`
    <div class="mdc-dialog ${classMap(classes)}"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="my-dialog-title"
        aria-describedby="my-dialog-content"
        mdc>
      <div class="mdc-dialog__container">
        <div class="mdc-dialog__surface">
          ${title}
          <div class="mdc-dialog__content">
            <slot></slot>
          </div>
          <footer
              id="actions"
              class="${classMap(actoinsClasses)}">
            ${actionSlots}
          </footer>
        </div>
      </div>
      <div class="mdc-dialog__scrim"></div>
    </div>`;
  }

  firstUpdated() {
    super.firstUpdated();
    this.mdcFoundation.setAutoStackButtons(true);

    this.originalOpen = this.mdcFoundation.open.bind(this.mdcFoundation);
    this.originalClose = this.mdcFoundation.close.bind(this.mdcFoundation);

    this.mdcFoundation.open = () => {
      this.open = true;
    };

    this.mdcFoundation.close = (action) => {
      this.currentAction = action;
      this.open = false;
    };

    this.removeEventListeners();
    this.setEventListeners();
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
      activeEl instanceof HTMLElement && activeEl.blur();
    } else {
      const root = this.getRootNode();
      const activeEl = root instanceof Document ? root.activeElement : null;
      activeEl instanceof HTMLElement && activeEl.blur();
    }
  }

  protected setEventListeners() {
    this.boundHandleClick =
        this.mdcFoundation.handleClick.bind(this.mdcFoundation);
    this.boundLayout = () => {
      if (this.open) {
        this.mdcFoundation.layout.bind(this.mdcFoundation);
      }
    };
    this.boundHandleKeydown =
        this.mdcFoundation.handleKeydown.bind(this.mdcFoundation);
    this.boundHandleDocumentKeydown =
        this.mdcFoundation.handleDocumentKeydown.bind(this.mdcFoundation);

    this.mdcRoot.addEventListener('click', this.boundHandleClick);
    window.addEventListener('resize', this.boundLayout, {passive: true});
    window.addEventListener(
        'orientationchange', this.boundLayout, {passive: true});
    this.addEventListener('keydown', this.boundHandleKeydown, {passive: true});
    document.addEventListener(
        'keydown', this.boundHandleDocumentKeydown, {passive: true});
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
