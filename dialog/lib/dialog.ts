/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../elevation/elevation.js';

import {html, LitElement, PropertyValues} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {createThrottle, msFromTimeCSSValue} from '../../internal/motion/animation.js';

// This is required for decorators.
// tslint:disable:no-new-decorators

/**
 * Default close action.
 */
export const CLOSE_ACTION = 'close';

const OPENING_TRANSITION_PROP = '--_opening-transition-duration';
const CLOSING_TRANSITION_PROP = '--_closing-transition-duration';

/**
 * A dialog component.
 */
export class Dialog extends LitElement {
  private static preventedScrollingCount = 0;
  private static scrollbarTester: HTMLDivElement;

  private static setDocumentScrollingDisabled(disabled = false) {
    let {preventedScrollingCount, scrollbarTester} = Dialog;
    Dialog.preventedScrollingCount = preventedScrollingCount =
        Math.max(preventedScrollingCount + (Number(disabled) || -1), 0);
    const shouldPrevent = Boolean(preventedScrollingCount);
    const {style} = document.body;
    if (shouldPrevent && style.overflow === 'hidden') {
      return;
    }
    if (scrollbarTester === undefined) {
      Dialog.scrollbarTester = scrollbarTester = document.createElement('div');
      scrollbarTester.style.cssText =
          `position: absolute; height: 0; width: 100%; visibility: hidden; pointer-events: none;`;
    }
    // Appends an element to see if its offsetWidth changes when overflow is
    // altered. If it does, then add end inline padding to restore the width to
    // avoid a visible layout shift.
    document.body.append(scrollbarTester);
    const {offsetWidth} = scrollbarTester;
    style.overflow = shouldPrevent ? 'hidden' : '';
    const scrollbarWidth = scrollbarTester.offsetWidth - offsetWidth;
    scrollbarTester.remove();
    style.paddingInlineEnd = shouldPrevent ? `${scrollbarWidth}px` : '';
  }

  /**
   * Opens the dialog when set to `true` and closes it when set to `false`.
   */
  @property({type: Boolean}) open = false;

  /**
   * Setting fullscreen displays the dialog fullscreen on small screens.
   * This can be customized via the `fullscreenBreakpoint` property.
   * When showing fullscreen, the header will take up less vertical space, and
   * the dialog will have a `showing-fullscreen`attribute, allowing content to
   * be styled in this state.
   *
   * Dialogs can be sized by setting:
   *
   * * --md-dialog-container-min-block-size
   * * --md-dialog-container-max-block-size
   * * --md-dialog-container-min-inline-size
   * * --md-dialog-container-max-inline-size
   *
   * These are typically configured via media queries and are independent of the
   * fullscreen setting.
   */
  @property({type: Boolean}) fullscreen = false;

  /**
   * A media query string specifying the breakpoint at which the dialog
   * should be shown fullscreen. Note, this only applies when the `fullscreen`
   * property is set.
   *
   * By default, the dialog is shown fullscreen on screens less than 600px wide
   * or 400px tall.
   */
  @property() fullscreenBreakpoint = '(max-width: 600px), (max-height: 400px)';

  /**
   * Hides the dialog footer, making any content slotted into the footer
   * inaccessible.
   */
  @property({type: Boolean}) footerHidden = false;

  /**
   * Renders footer content in a vertically stacked alignment rather than the
   * normal horizontal alignment.
   */
  @property({type: Boolean}) stacked = false;

  /**
   * When the dialog is closed it disptaches `closing` and `closed` events.
   * These events have an action property which has a default value of
   * the value of this property. Specific actions have explicit values but when
   * a value is not specified, the default is used. For example, clicking the
   * scrim, pressing escape, or clicking a button with an action attribute set
   * produce an explicit action.
   *
   * Defaults to `close`.
   */
  @property() defaultAction = CLOSE_ACTION;

  /**
   * The name of an attribute which can be placed on any element slotted into
   * the dialog. If an element has an action attribute set, clicking it will
   * close the dialog and the `closing` and `closed` events dispatched will
   * have their action property set the value of this attribute on the
   * clicked element.The default valus is `dialogAction`. For example,
   *
   *   <md-dialog>
   *    Content
   *     <md-filled-button slot="footer"dialogAction="buy">
   *       Buy
   *     </md-filled-button>
   *   </md-dialog>
   */
  @property() actionAttribute = 'dialogAction';

  /**
   * When the dialog is opened, it will focus the first element which has
   * an attribute name matching this property. The default value is
   * `dialogFocus`. For example:
   *
   *  <md-dialog>
   *    <md-filled-text-field
   *      label="Enter some text"
   *      dialogFocus
   *    >
   *    </md-filled-text-field>
   *  </md-dialog>
   */
  @property() focusAttribute = 'dialogFocus';

  /**
   * Clicking on the scrim surrounding the dialog closes the dialog.
   * The `closing` and `closed` events this produces have an `action` property
   * which is the value of this property and defaults to `close`.
   */
  @property() scrimClickAction = CLOSE_ACTION;

  /**
   * Pressing the `escape` key while the dialog is open closes the dialog.
   * The `closing` and `closed` events this produces have an `action` property
   * which is the value of this property and defaults to `close`.
   */
  @property() escapeKeyAction = CLOSE_ACTION;

  /**
   * When opened, the dialog is displayed modeless or non-modal. This
   * allows users to interact with content outside the dialog without
   * closing the dialog and does not display the scrim around the dialog.
   */
  @property({type: Boolean, reflect: true}) modeless = false;

  /**
   * Set to make the dialog position draggable.
   */
  @property({type: Boolean}) override draggable = false;

  private readonly throttle = createThrottle();

  @query('.dialog', true)
  private readonly dialogElement!: HTMLDialogElement|null;

  // slots tracked to find focusable elements.
  @query('slot[name=footer]', true)
  private readonly footerSlot!: HTMLSlotElement;
  @query('slot:not([name])', true)
  private readonly contentSlot!: HTMLSlotElement;
  // for scrolling related styling
  @query(`.content`, true)
  private readonly contentElement!: HTMLDivElement|null;
  // used to determine container size for dragging
  @query(`.container`, true)
  private readonly containerElement!: HTMLDivElement|null;
  // used to determine where users can drag from.
  @query(`.header`, true) private readonly headerElement!: HTMLDivElement|null;

  /**
   * Private properties that reflect for styling manually in `updated`.
   */
  @state() private showingFullscreen = false;
  @state() private showingOpen = false;
  @state() private opening = false;
  @state() private closing = false;

  /**
   * Transition kind. Supported options include: grow, shrink, grow-down,
   * grow-up, grow-left, and grow-right.
   *
   * Defaults to grow-down.
   */
  @property({reflect: true}) transition = 'grow-down';

  private currentAction: string|undefined;

  @state() private dragging = false;
  private readonly dragMargin = 8;
  private dragInfo?: [number, number, number, number]|undefined;

  /**
   * Opens and shows the dialog. This is equivalent to setting the `open`
   * property to true.
   */
  show() {
    this.open = true;
  }

  /**
   * Closes the dialog. This is equivalent to setting the `open`
   * property to false.
   */
  close(action = '') {
    this.currentAction = action;
    this.open = false;
  }

  /**
   * Opens and shows the dialog if it is closed; otherwise closes it.
   */
  toggleShow() {
    if (this.open) {
      this.close(this.currentAction);
    } else {
      this.show();
    }
  }

  private getContentScrollInfo() {
    if (!this.hasUpdated || !this.contentElement) {
      return {isScrollable: false, isAtScrollTop: true, isAtScrollBottom: true};
    }
    const {scrollTop, scrollHeight, offsetHeight, clientHeight} =
        this.contentElement;
    return {
      isScrollable: scrollHeight > offsetHeight,
      isAtScrollTop: scrollTop === 0,
      isAtScrollBottom:
          Math.abs(Math.round(scrollHeight - scrollTop) - clientHeight) <= 2
    };
  }

  protected override render() {
    const {isScrollable, isAtScrollTop, isAtScrollBottom} =
        this.getContentScrollInfo();
    return html`
    <dialog
      @close=${this.handleDialogDismiss}
      @cancel=${this.handleDialogDismiss}
      @click=${this.handleDialogClick}
      class="dialog ${classMap({
      'stacked': this.stacked,
      'scrollable': isScrollable,
      'scroll-divider-header': !isAtScrollTop,
      'scroll-divider-footer': !isAtScrollBottom,
      'footerHidden': this.footerHidden
    })}"
      aria-labelledby="header"
      aria-describedby="content"
    >
      <div class="container ${classMap({
      'dragging': this.dragging
    })}"
        @pointermove=${this.handlePointerMove}
        @pointerup=${this.handleDragEnd}
      >
        <md-elevation></md-elevation>
        <header class="header">
          <slot name="header">
            <slot name="headline-prefix"></slot>
            <slot name="headline"></slot>
            <slot name="headline-suffix"></slot>
          </slot>
        </header>
        <section class="content" @scroll=${this.handleContentScroll}>
          <slot></slot>
        </section>
        <footer class="footer">
          <slot name="footer"></slot>
        </footer>
      </div>
    </dialog>`;
  }

  protected override willUpdate(changed: PropertyValues) {
    if (changed.has('open')) {
      this.opening = this.open;
      // only closing if was opened previously...
      this.closing = !this.open && changed.get('open');
    }
    if (changed.has('fullscreen') || changed.has('fullscreenBreakpoint')) {
      this.updateFullscreen();
    }
  }

  protected override firstUpdated() {
    // Update when content size changes to show/hide scroll dividers.
    new ResizeObserver(() => {
      if (this.showingOpen) {
        this.requestUpdate();
      }
    }).observe(this.contentElement!);
  }

  protected override updated(changed: PropertyValues) {
    if (changed.get('draggable') && !this.draggable) {
      this.style.removeProperty('--_container-drag-inline-start');
      this.style.removeProperty('--_container-drag-block-start');
    }
    // Reflect internal state to facilitate styling.
    this.reflectStateProp(changed, 'opening', this.opening);
    this.reflectStateProp(changed, 'closing', this.closing);
    this.reflectStateProp(
        changed, 'showingFullscreen', this.showingFullscreen,
        'showing-fullscreen');
    this.reflectStateProp(
        changed, 'showingOpen', this.showingOpen, 'showing-open');
    if (!changed.has('open')) {
      return;
    }
    // prevent body scrolling early only when opening to avoid layout
    // shift when closing.
    if (!this.modeless && this.open) {
      Dialog.setDocumentScrollingDisabled(this.open);
    }
    if (this.open) {
      this.contentElement!.scrollTop = 0;
      if (this.modeless) {
        this.dialogElement!.show();
      } else {
        // Note, native focus handling fails when focused element is in an
        // overflow: auto container.
        this.dialogElement!.showModal();
      }
    }
    // Avoids dispatching initial state.
    const shouldDispatchAction = changed.get('open') !== undefined;
    this.performTransition(shouldDispatchAction);
  }

  /**
   * Internal state is reflected here as attributes to effect styling. This
   * could be done via internal classes, but it's published on the host
   * to facilitate the (currently undocumented) possibility of customizing
   * styling of user content based on these states.
   * Note, in the future this could be done with `:state(...)` when browser
   * support improves.
   */
  private reflectStateProp(
      changed: PropertyValues, key: string, value: unknown,
      attribute?: string) {
    attribute ??= key;
    if (!changed.has(key)) {
      return;
    }
    if (value) {
      this.setAttribute(attribute, '');
    } else {
      this.removeAttribute(attribute);
    }
  }

  private dialogClosedResolver?: () => void;

  private async performTransition(shouldDispatchAction: boolean) {
    // TODO: pause here only to avoid a double update warning.
    await this.updateComplete;
    this.showingOpen = this.open;
    if (shouldDispatchAction) {
      this.dispatchActionEvent(this.open ? 'opening' : 'closing');
    }
    // Compute desired transition duration.
    const duration = msFromTimeCSSValue(getComputedStyle(this).getPropertyValue(
        this.open ? OPENING_TRANSITION_PROP : CLOSING_TRANSITION_PROP));
    let promise = this.updateComplete;
    if (duration > 0) {
      promise = new Promise((r) => {
        setTimeout(r, duration);
      });
    }
    await promise;
    this.opening = false;
    this.closing = false;
    if (!this.open && this.dialogElement?.open) {
      // Closing the dialog triggers an asynchronous `close` event.
      // It's important to wait for this event to fire since it changes the
      // state of `open` to false.
      // Without waiting, this element's `closed` event can be called before
      // the dialog's `close` event, which is problematic since the user
      // can set `open` in the `closed` event.
      // The timing of the event appears to vary via browser and does *not*
      // seem to resolve by "task" timing; therefore an explicit promise is
      // used.
      const closedPromise = new Promise<void>(resolve => {
        this.dialogClosedResolver = resolve;
      });
      this.dialogElement?.close(this.currentAction || this.defaultAction);
      await closedPromise;
      // enable scrolling late to avoid layout shift when closing
      if (!this.modeless) {
        Dialog.setDocumentScrollingDisabled(this.open);
      }
    }
    // Focus initial element.
    if (this.open) {
      this.focus();
    }
    if (shouldDispatchAction) {
      this.dispatchActionEvent(this.open ? 'opened' : 'closed');
    }
    this.currentAction = undefined;
  }

  private dispatchActionEvent(type: string) {
    const detail = {action: this.open ? 'none' : this.currentAction};
    this.dispatchEvent(new CustomEvent(type, {detail, bubbles: true}));
  }

  /* Live media query for matching user specified fullscreen breakpoint. */
  private fullscreenQuery?: MediaQueryList;
  private fullscreenQueryListener:
      ((e: MediaQueryListEvent) => void)|undefined = undefined;
  private updateFullscreen() {
    if (this.fullscreenQuery !== undefined) {
      this.fullscreenQuery.removeEventListener(
          'change', this.fullscreenQueryListener!);
      this.fullscreenQuery = this.fullscreenQueryListener = undefined;
    }
    if (!this.fullscreen) {
      this.showingFullscreen = false;
      return;
    }
    this.fullscreenQuery = window.matchMedia(this.fullscreenBreakpoint);
    this.fullscreenQuery.addEventListener(
        'change',
        (this.fullscreenQueryListener = (event: MediaQueryListEvent) => {
          this.showingFullscreen = event.matches;
        }));
    this.showingFullscreen = this.fullscreenQuery.matches;
  }

  // handles native close/cancel events and we just ensure
  // internal state is in sync.
  private handleDialogDismiss(e: Event) {
    if (e.type === 'cancel') {
      this.currentAction = this.escapeKeyAction;
    }
    // Prevents the <dialog> element from closing when
    // `escapeKeyAction` is set to an empty string.
    // It also early returns and avoids <md-dialog> internal state
    // changes.
    if (this.currentAction === '') {
      e.preventDefault();
      return;
    }
    this.dialogClosedResolver?.();
    this.dialogClosedResolver = undefined;
    this.open = false;
    this.opening = false;
    this.closing = false;
  }

  private handleDialogClick(e: Event) {
    if (!this.open) {
      return;
    }
    this.currentAction =
        (e.target as Element).getAttribute(this.actionAttribute) ??
        (!this.modeless && this.containerElement &&
                 !e.composedPath().includes(this.containerElement) ?
             this.scrimClickAction :
             '');
    if (this.currentAction !== '') {
      this.close(this.currentAction);
    }
  }

  /* This allows the dividers to dynamically show based on scrolling. */
  private handleContentScroll() {
    this.throttle('scroll', () => {
      this.requestUpdate();
    });
  }

  private getFocusElement(): HTMLElement|null {
    const selector = `[${this.focusAttribute}]`;
    const slotted = [this.footerSlot, this.contentSlot].flatMap(
        slot => slot.assignedElements({flatten: true}));
    for (const el of slotted) {
      const focusEl = el.matches(selector) ? el : el.querySelector(selector);
      if (focusEl) {
        return focusEl as HTMLElement;
      }
    }
    return null;
  }

  override focus() {
    this.getFocusElement()?.focus();
  }

  override blur() {
    this.getFocusElement()?.blur();
  }

  private canStartDrag(e: PointerEvent) {
    if (this.draggable === false || e.defaultPrevented || !(e.buttons & 1) ||
        !this.headerElement || !e.composedPath().includes(this.headerElement)) {
      return false;
    }
    return true;
  }

  private handlePointerMove(e: PointerEvent) {
    if (!this.dragging && !this.canStartDrag(e) || !this.containerElement) {
      return;
    }
    const {top, left, height, width} =
        this.containerElement.getBoundingClientRect();
    if (!this.dragging) {
      this.containerElement.setPointerCapture(e.pointerId);
      this.dragging = true;
      const {x, y} = e;
      this.dragInfo = [x, y, top, left];
    }
    const [sx, sy, st, sl] = this.dragInfo ?? [0, 0, 0, 0];
    const dx = e.x - sx;
    const dy = e.y - sy;
    const ml = window.innerWidth - width - this.dragMargin;
    const mt = window.innerHeight - height - this.dragMargin;
    const l = Math.max(this.dragMargin, Math.min(ml, dx + sl));
    const t = Math.max(this.dragMargin, Math.min(mt, dy + st));
    this.style.setProperty('--_container-drag-inline-start', `${l}px`);
    this.style.setProperty('--_container-drag-block-start', `${t}px`);
  }

  private handleDragEnd(e: PointerEvent) {
    if (!this.dragging) {
      return;
    }
    this.containerElement?.releasePointerCapture(e.pointerId);
    this.dragging = false;
    this.dragInfo = undefined;
  }
}
