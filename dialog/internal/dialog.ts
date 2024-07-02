/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../divider/divider.js';

import {html, isServer, LitElement, nothing} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../internal/aria/delegate.js';
import {redispatchEvent} from '../../internal/events/redispatch-event.js';

import {
  DIALOG_DEFAULT_CLOSE_ANIMATION,
  DIALOG_DEFAULT_OPEN_ANIMATION,
  DialogAnimation,
  DialogAnimationArgs,
} from './animations.js';

// Separate variable needed for closure.
const dialogBaseClass = mixinDelegatesAria(LitElement);

/**
 * A dialog component.
 *
 * @fires open {Event} Dispatched when the dialog is opening before any animations.
 * @fires opened {Event} Dispatched when the dialog has opened after any animations.
 * @fires close {Event} Dispatched when the dialog is closing before any animations.
 * @fires closed {Event} Dispatched when the dialog has closed after any animations.
 * @fires cancel {Event} Dispatched when the dialog has been canceled by clicking
 * on the scrim or pressing Escape.
 */
export class Dialog extends dialogBaseClass {
  // We do not use `delegatesFocus: true` due to a Chromium bug with
  // selecting text.
  // See https://bugs.chromium.org/p/chromium/issues/detail?id=950357

  /**
   * Opens the dialog when set to `true` and closes it when set to `false`.
   */
  @property({type: Boolean})
  get open() {
    return this.isOpen;
  }

  set open(open: boolean) {
    if (open === this.isOpen) {
      return;
    }

    this.isOpen = open;
    if (open) {
      this.setAttribute('open', '');
      this.show();
    } else {
      this.removeAttribute('open');
      this.close();
    }
  }

  /**
   * Skips the opening and closing animations.
   */
  @property({type: Boolean}) quick = false;

  /**
   * Gets or sets the dialog's return value, usually to indicate which button
   * a user pressed to close it.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/returnValue
   */
  @property({attribute: false}) returnValue = '';

  /**
   * The type of dialog for accessibility. Set this to `alert` to announce a
   * dialog as an alert dialog.
   */
  @property() type?: 'alert';

  /**
   * Disables focus trapping, which by default keeps keyboard Tab navigation
   * within the dialog.
   *
   * When disabled, after focusing the last element of a dialog, pressing Tab
   * again will release focus from the window back to the browser (such as the
   * URL bar).
   *
   * Focus trapping is recommended for accessibility, and should not typically
   * be disabled. Only turn this off if the use case of a dialog is more
   * accessible without focus trapping.
   */
  @property({type: Boolean, attribute: 'no-focus-trap'})
  noFocusTrap = false;

  /**
   * Gets the opening animation for a dialog. Set to a new function to customize
   * the animation.
   */
  getOpenAnimation = () => DIALOG_DEFAULT_OPEN_ANIMATION;

  /**
   * Gets the closing animation for a dialog. Set to a new function to customize
   * the animation.
   */
  getCloseAnimation = () => DIALOG_DEFAULT_CLOSE_ANIMATION;

  private isOpen = false;
  private isOpening = false;
  // getIsConnectedPromise() immediately sets the resolve property.
  private isConnectedPromiseResolve!: () => void;
  private isConnectedPromise = this.getIsConnectedPromise();
  @query('dialog') private readonly dialog!: HTMLDialogElement | null;
  @query('.scrim') private readonly scrim!: HTMLDialogElement | null;
  @query('.container') private readonly container!: HTMLDialogElement | null;
  @query('.headline') private readonly headline!: HTMLDialogElement | null;
  @query('.content') private readonly content!: HTMLDialogElement | null;
  @query('.actions') private readonly actions!: HTMLDialogElement | null;
  @state() private isAtScrollTop = false;
  @state() private isAtScrollBottom = false;
  @query('.scroller') private readonly scroller!: HTMLElement | null;
  @query('.top.anchor') private readonly topAnchor!: HTMLElement | null;
  @query('.bottom.anchor') private readonly bottomAnchor!: HTMLElement | null;
  @query('.focus-trap')
  private readonly firstFocusTrap!: HTMLElement | null;
  private nextClickIsFromContent = false;
  private intersectionObserver?: IntersectionObserver;
  // Dialogs should not be SSR'd while open, so we can just use runtime checks.
  @state() private hasHeadline = false;
  @state() private hasActions = false;
  @state() private hasIcon = false;
  private cancelAnimations?: AbortController;

  // See https://bugs.chromium.org/p/chromium/issues/detail?id=1512224
  // Chrome v120 has a bug where escape keys do not trigger cancels. If we get
  // a dialog "close" event that is triggered without a "cancel" after an escape
  // keydown, then we need to manually trigger our closing logic.
  //
  // This bug occurs when pressing escape to close a dialog without first
  // interacting with the dialog's content.
  //
  // Cleanup tracking:
  // https://github.com/material-components/material-web/issues/5330
  // This can be removed when full CloseWatcher support added and the above bug
  // in Chromium is fixed to fire 'cancel' with one escape press and close with
  // multiple.
  private escapePressedWithoutCancel = false;
  // This TreeWalker is used to walk through a dialog's children to find
  // focusable elements. TreeWalker is faster than `querySelectorAll('*')`.
  private readonly treewalker = document.createTreeWalker(
    this,
    NodeFilter.SHOW_ELEMENT,
  );

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('submit', this.handleSubmit);
    }
  }

  /**
   * Opens the dialog and fires a cancelable `open` event. After a dialog's
   * animation, an `opened` event is fired.
   *
   * Add an `autofocus` attribute to a child of the dialog that should
   * receive focus after opening.
   *
   * @return A Promise that resolves after the animation is finished and the
   *     `opened` event was fired.
   */
  async show() {
    this.isOpening = true;
    // Dialogs can be opened before being attached to the DOM, so we need to
    // wait until we're connected before calling `showModal()`.
    await this.isConnectedPromise;
    await this.updateComplete;
    const dialog = this.dialog!;
    // Check if already opened or if `dialog.close()` was called while awaiting.
    if (dialog.open || !this.isOpening) {
      this.isOpening = false;
      return;
    }

    const preventOpen = !this.dispatchEvent(
      new Event('open', {cancelable: true}),
    );
    if (preventOpen) {
      this.open = false;
      this.isOpening = false;
      return;
    }

    // All Material dialogs are modal.
    dialog.showModal();
    this.open = true;
    // Reset scroll position if re-opening a dialog with the same content.
    if (this.scroller) {
      this.scroller.scrollTop = 0;
    }
    // Native modal dialogs ignore autofocus and instead force focus to the
    // first focusable child. Override this behavior if there is a child with
    // an autofocus attribute.
    this.querySelector<HTMLElement>('[autofocus]')?.focus();

    await this.animateDialog(this.getOpenAnimation());
    this.dispatchEvent(new Event('opened'));
    this.isOpening = false;
  }

  /**
   * Closes the dialog and fires a cancelable `close` event. After a dialog's
   * animation, a `closed` event is fired.
   *
   * @param returnValue A return value usually indicating which button was used
   *     to close a dialog. If a dialog is canceled by clicking the scrim or
   *     pressing Escape, it will not change the return value after closing.
   * @return A Promise that resolves after the animation is finished and the
   *     `closed` event was fired.
   */
  async close(returnValue = this.returnValue) {
    this.isOpening = false;
    if (!this.isConnected) {
      // Disconnected dialogs do not fire close events or animate.
      this.open = false;
      return;
    }

    await this.updateComplete;
    const dialog = this.dialog!;
    // Check if already closed or if `dialog.show()` was called while awaiting.
    if (!dialog.open || this.isOpening) {
      this.open = false;
      return;
    }

    const prevReturnValue = this.returnValue;
    this.returnValue = returnValue;
    const preventClose = !this.dispatchEvent(
      new Event('close', {cancelable: true}),
    );
    if (preventClose) {
      this.returnValue = prevReturnValue;
      return;
    }

    await this.animateDialog(this.getCloseAnimation());
    dialog.close(returnValue);
    this.open = false;
    this.dispatchEvent(new Event('closed'));
  }

  override connectedCallback() {
    super.connectedCallback();
    this.isConnectedPromiseResolve();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.isConnectedPromise = this.getIsConnectedPromise();
  }

  protected override render() {
    const scrollable =
      this.open && !(this.isAtScrollTop && this.isAtScrollBottom);
    const classes = {
      'has-headline': this.hasHeadline,
      'has-actions': this.hasActions,
      'has-icon': this.hasIcon,
      'scrollable': scrollable,
      'show-top-divider': scrollable && !this.isAtScrollTop,
      'show-bottom-divider': scrollable && !this.isAtScrollBottom,
    };

    // The focus trap sentinels are only added after the dialog opens, since
    // dialog.showModal() will try to autofocus them, even with tabindex="-1".
    const showFocusTrap = this.open && !this.noFocusTrap;
    const focusTrap = html`
      <div
        class="focus-trap"
        tabindex="0"
        aria-hidden="true"
        @focus=${this.handleFocusTrapFocus}></div>
    `;

    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <div class="scrim"></div>
      <dialog
        class=${classMap(classes)}
        aria-label=${ariaLabel || nothing}
        aria-labelledby=${this.hasHeadline ? 'headline' : nothing}
        role=${this.type === 'alert' ? 'alertdialog' : nothing}
        @cancel=${this.handleCancel}
        @click=${this.handleDialogClick}
        @close=${this.handleClose}
        @keydown=${this.handleKeydown}
        .returnValue=${this.returnValue || nothing}>
        ${showFocusTrap ? focusTrap : nothing}
        <div class="container" @click=${this.handleContentClick}>
          <div class="headline">
            <div class="icon" aria-hidden="true">
              <slot name="icon" @slotchange=${this.handleIconChange}></slot>
            </div>
            <h2 id="headline" aria-hidden=${!this.hasHeadline || nothing}>
              <slot
                name="headline"
                @slotchange=${this.handleHeadlineChange}></slot>
            </h2>
            <md-divider></md-divider>
          </div>
          <div class="scroller">
            <div class="content">
              <div class="top anchor"></div>
              <slot name="content"></slot>
              <div class="bottom anchor"></div>
            </div>
          </div>
          <div class="actions">
            <md-divider></md-divider>
            <slot name="actions" @slotchange=${this.handleActionsChange}></slot>
          </div>
        </div>
        ${showFocusTrap ? focusTrap : nothing}
      </dialog>
    `;
  }

  protected override firstUpdated() {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.handleAnchorIntersection(entry);
        }
      },
      {root: this.scroller!},
    );

    this.intersectionObserver.observe(this.topAnchor!);
    this.intersectionObserver.observe(this.bottomAnchor!);
  }

  private handleDialogClick() {
    if (this.nextClickIsFromContent) {
      // Avoid doing a layout calculation below if we know the click came from
      // content.
      this.nextClickIsFromContent = false;
      return;
    }

    // Click originated on the backdrop. Native `<dialog>`s will not cancel,
    // but Material dialogs do.
    const preventDefault = !this.dispatchEvent(
      new Event('cancel', {cancelable: true}),
    );
    if (preventDefault) {
      return;
    }

    this.close();
  }

  private handleContentClick() {
    this.nextClickIsFromContent = true;
  }

  private handleSubmit(event: SubmitEvent) {
    const form = event.target as HTMLFormElement;
    const {submitter} = event;
    if (form.method !== 'dialog' || !submitter) {
      return;
    }

    // Close reason is the submitter's value attribute, or the dialog's
    // `returnValue` if there is no attribute.
    this.close(submitter.getAttribute('value') ?? this.returnValue);
  }

  private handleCancel(event: Event) {
    if (event.target !== this.dialog) {
      // Ignore any cancel events dispatched by content.
      return;
    }

    this.escapePressedWithoutCancel = false;
    const preventDefault = !redispatchEvent(this, event);
    // We always prevent default on the original dialog event since we'll
    // animate closing it before it actually closes.
    event.preventDefault();
    if (preventDefault) {
      return;
    }

    this.close();
  }

  private handleClose() {
    if (!this.escapePressedWithoutCancel) {
      return;
    }

    this.escapePressedWithoutCancel = false;
    this.dialog?.dispatchEvent(new Event('cancel', {cancelable: true}));
  }

  private handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape') {
      return;
    }

    // An escape key was pressed. If a "close" event fires next without a
    // "cancel" event first, then we know we're in the Chrome v120 bug.
    this.escapePressedWithoutCancel = true;
    // Wait a full task for the cancel/close event listeners to fire, then
    // reset the flag.
    setTimeout(() => {
      this.escapePressedWithoutCancel = false;
    });
  }

  private async animateDialog(animation: DialogAnimation) {
    // Always cancel the previous animations. Animations can include `fill`
    // modes that need to be cleared when `quick` is toggled. If not, content
    // that faded out will remain hidden when a `quick` dialog re-opens after
    // previously opening and closing without `quick`.
    this.cancelAnimations?.abort();
    this.cancelAnimations = new AbortController();
    if (this.quick) {
      return;
    }

    const {dialog, scrim, container, headline, content, actions} = this;
    if (!dialog || !scrim || !container || !headline || !content || !actions) {
      return;
    }

    const {
      container: containerAnimate,
      dialog: dialogAnimate,
      scrim: scrimAnimate,
      headline: headlineAnimate,
      content: contentAnimate,
      actions: actionsAnimate,
    } = animation;

    const elementAndAnimation: Array<[Element, DialogAnimationArgs[]]> = [
      [dialog, dialogAnimate ?? []],
      [scrim, scrimAnimate ?? []],
      [container, containerAnimate ?? []],
      [headline, headlineAnimate ?? []],
      [content, contentAnimate ?? []],
      [actions, actionsAnimate ?? []],
    ];

    const animations: Animation[] = [];
    for (const [element, animation] of elementAndAnimation) {
      for (const animateArgs of animation) {
        const animation = element.animate(...animateArgs);
        this.cancelAnimations.signal.addEventListener('abort', () => {
          animation.cancel();
        });

        animations.push(animation);
      }
    }

    await Promise.all(
      animations.map((animation) =>
        animation.finished.catch(() => {
          // Ignore intentional AbortErrors when calling `animation.cancel()`.
        }),
      ),
    );
  }

  private handleHeadlineChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasHeadline = slot.assignedElements().length > 0;
  }

  private handleActionsChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasActions = slot.assignedElements().length > 0;
  }

  private handleIconChange(event: Event) {
    const slot = event.target as HTMLSlotElement;
    this.hasIcon = slot.assignedElements().length > 0;
  }

  private handleAnchorIntersection(entry: IntersectionObserverEntry) {
    const {target, isIntersecting} = entry;
    if (target === this.topAnchor) {
      this.isAtScrollTop = isIntersecting;
    }

    if (target === this.bottomAnchor) {
      this.isAtScrollBottom = isIntersecting;
    }
  }

  private getIsConnectedPromise() {
    return new Promise<void>((resolve) => {
      this.isConnectedPromiseResolve = resolve;
    });
  }

  private handleFocusTrapFocus(event: FocusEvent) {
    const [firstFocusableChild, lastFocusableChild] =
      this.getFirstAndLastFocusableChildren();
    if (!firstFocusableChild || !lastFocusableChild) {
      // When a dialog does not have focusable children, the dialog itself
      // receives focus.
      this.dialog?.focus();
      return;
    }

    // To determine which child to focus, we need to know which focus trap
    // received focus...
    const isFirstFocusTrap = event.target === this.firstFocusTrap;
    const isLastFocusTrap = !isFirstFocusTrap;
    // ...and where the focus came from (what was previously focused).
    const focusCameFromFirstChild = event.relatedTarget === firstFocusableChild;
    const focusCameFromLastChild = event.relatedTarget === lastFocusableChild;
    // Although this is a focus trap, focus can come from outside the trap.
    // This can happen when elements are programmatically `focus()`'d. It also
    // happens when focus leaves and returns to the window, such as clicking on
    // the browser's URL bar and pressing Tab, or switching focus between
    // iframes.
    const focusCameFromOutsideDialog =
      !focusCameFromFirstChild && !focusCameFromLastChild;

    // Focus the dialog's first child when we reach the end of the dialog and
    // focus is moving forward. Or, when focus is moving forwards into the
    // dialog from outside of the window.
    const shouldFocusFirstChild =
      (isLastFocusTrap && focusCameFromLastChild) ||
      (isFirstFocusTrap && focusCameFromOutsideDialog);
    if (shouldFocusFirstChild) {
      firstFocusableChild.focus();
      return;
    }

    // Focus the dialog's last child when we reach the beginning of the dialog
    // and focus is moving backward. Or, when focus is moving backwards into the
    // dialog from outside of the window.
    const shouldFocusLastChild =
      (isFirstFocusTrap && focusCameFromFirstChild) ||
      (isLastFocusTrap && focusCameFromOutsideDialog);
    if (shouldFocusLastChild) {
      lastFocusableChild.focus();
      return;
    }

    // The booleans above are verbose for readability, but code executation
    // won't actually reach here.
  }

  private getFirstAndLastFocusableChildren() {
    let firstFocusableChild: HTMLElement | null = null;
    let lastFocusableChild: HTMLElement | null = null;

    // Reset the current node back to the root host element.
    this.treewalker.currentNode = this.treewalker.root;
    while (this.treewalker.nextNode()) {
      // Cast as Element since the TreeWalker filter only accepts Elements.
      const nextChild = this.treewalker.currentNode as Element;
      if (!isFocusable(nextChild)) {
        continue;
      }

      if (!firstFocusableChild) {
        firstFocusableChild = nextChild;
      }

      lastFocusableChild = nextChild;
    }

    // We set lastFocusableChild immediately after finding a
    // firstFocusableChild, which means the pair is either both null or both
    // non-null. Cast since TypeScript does not recognize this.
    return [firstFocusableChild, lastFocusableChild] as
      | [HTMLElement, HTMLElement]
      | [null, null];
  }
}

function isFocusable(element: Element): element is HTMLElement {
  // Check if the element is a known built-in focusable element:
  // - <a> and <area> with `href` attributes.
  // - Form controls that are not disabled.
  // - `contenteditable` elements.
  // - Anything with a non-negative `tabindex`.
  const knownFocusableElements =
    ':is(button,input,select,textarea,object,:is(a,area)[href],[tabindex],[contenteditable=true])';
  const notDisabled = ':not(:disabled,[disabled])';
  const notNegativeTabIndex = ':not([tabindex^="-"])';
  if (
    element.matches(knownFocusableElements + notDisabled + notNegativeTabIndex)
  ) {
    return true;
  }

  const isCustomElement = element.localName.includes('-');
  if (!isCustomElement) {
    return false;
  }

  // If a custom element does not have a tabindex, it may still be focusable
  // if it delegates focus with a shadow root. We also need to check again if
  // the custom element is a disabled form control.
  if (!element.matches(notDisabled)) {
    return false;
  }

  return element.shadowRoot?.delegatesFocus ?? false;
}
