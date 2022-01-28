/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ReactiveController, ReactiveControllerHost} from 'lit';

import {bound} from '../decorators/bound';

/**
 * Some browsers don't allow focusing <button>s via the keyboard, requiring
 * special handling.
 *
 * @see https://stackoverflow.com/a/1914496/1431146
 * @see https://www.alexlande.com/articles/cross-browser-tabindex-woes/#so-what-happens
 * @see https://bugs.webkit.org/show_bug.cgi?id=13724#c7
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=756028
 * @see https://developer.mozilla.org/en-US/docs/Web/HTML/Element/Button#Clicking_and_focus
 */
const BUTTON_FOCUS_ALLOWED: boolean = (() => {
  const ua = window.navigator.userAgent;
  const mac = ua.match('Macintosh');
  const firefox = ua.match(/Gecko\/\d+/);
  const safari = ua.match(/Version\/\d+/) && ua.match(/Safari\/\d+/);
  return !mac || !firefox && !safari;
})();

/**
 * Enumeration to keep track of the lifecycle of a touch event.
 */

// State transition diagram:
//     +-----------------------------+
//     |                             v
//     |    +------+------ WAITING_FOR_MOUSE_CLICK<----+
//     |    |      |                ^                  |
//     |    V      |                |                  |
// => INACTIVE -> TOUCH_DELAY -> RELEASING          HOLDING
//                 |                                   ^
//                 |                                   |
//                 +-----------------------------------+
enum Phase {
  // Initial state of the control, no touch in progress.
  // Transitions:
  //     on touch down: transition to TOUCH_DELAY.
  //     on mouse down: transition to WAITING_FOR_MOUSE_CLICK.
  INACTIVE = 'INACTIVE',

  // Touch down has been received, waiting to determine if it's a swipe.
  // Transitions:
  //     on touch up: beginPress(); transition to RELEASING.
  //     on cancel: transition to INACTIVE.
  //     after TOUCH_DELAY_MS: beginPress(); transition to HOLDING.
  TOUCH_DELAY = 'TOUCH_DELAY',

  // A touch has been deemed to be a press
  // Transitions:
  //     on pointerup: endPress(); transition to WAITING_FOR_MOUSE_CLICK.
  HOLDING = 'HOLDING',

  // The user has released the mouse / touch, but we want to delay calling
  // endPress for a little bit to avoid double clicks.
  // Transitions:
  //    mouse sequence after debounceDelay: endPress(); transition to INACTIVE
  //    when in touch sequence: transitions directly to WAITING_FOR_MOUSE_CLICK
  RELEASING = 'RELEASING',

  // The user has touched, but we want to delay endPress until synthetic mouse
  // click event occurs. Stay in this state for a fixed amount of time before
  // giving up and transitioning into rest state.
  // Transitions:
  //     on click: endPress(); transition to INACTIVE.
  //     after WAIT_FOR_MOUSE_CLICK_MS: transition to INACTIVE.
  WAITING_FOR_MOUSE_CLICK = 'WAITING_FOR_MOUSE_CLICK'
}

/**
 * Delay time from touchstart to when element#beginPress is invoked.
 */
const TOUCH_DELAY_MS = 150;

/**
 * Delay time from beginning to wait for synthetic mouse events till giving up.
 */
const WAIT_FOR_MOUSE_CLICK_MS = 500;

/**
 * The necessary interface for using an ActionController
 */
export interface ActionControllerHost extends ReactiveControllerHost,
                                              HTMLElement {
  disabled: boolean;
  /**
   * Determines if pointerdown or click events containing modifier keys should
   * be ignored
   */
  ignoreClicksWithModifiers?: boolean;
  /**
   * Called when a user interaction is determined to be a press.
   * `positionEvent` can be used to determine location of the press
   */
  beginPress(options: {positionEvent: Event|null}): void;
  /**
   * Called when a press ends or is cancelled.
   * `cancelled` will determine the difference between the two states.
   */
  endPress(options: {cancelled: boolean}): void;
}

// tslint:disable:no-new-decorators
/**
 * ActionController normalizes user interaction on components and distills it
 * into calling `beginPress` and `endPress` on the component.
 *
 * `beginPress` is a good hook to affect visuals for pressed state, including
 * ripple.
 *
 * `endPress` is a good hook for firing events based on user interaction, and
 * cleaning up the pressed visual state.
 *
 * A component using an ActionController need only implement the ActionElement
 * interface and add the ActionController's event listeners to understand user
 * interaction.
 */
export class ActionController implements ReactiveController {
  constructor(private readonly element: ActionControllerHost) {
    this.element.addController(this);
  }

  private get disabled() {
    return this.element.disabled;
  }

  private get ignoreClicksWithModifiers() {
    return this.element.ignoreClicksWithModifiers ?? false;
  }

  private phase = Phase.INACTIVE;

  private touchTimer: number|null = null;

  private clickTimer: number|null = null;

  private lastPositionEvent: PointerEvent|null = null;

  private pressed = false;

  private checkBoundsAfterContextMenu = false;

  private setPhase(newPhase: Phase) {
    this.phase = newPhase;
  }

  /**
   * Calls beginPress and then endPress. Allows us to programmatically click
   * on the element.
   */
  private press() {
    this.beginPress(/* positionEvent= */ null);
    this.setPhase(Phase.INACTIVE);
    this.endPress();
  }

  /**
   * Call `beginPress` on element with triggering event, if applicable
   */
  private beginPress(positionEvent: Event|null = this.lastPositionEvent) {
    this.pressed = true;
    this.element.beginPress({positionEvent});
  }

  /**
   * Call `endPress` on element, and clean up timers
   */
  private endPress() {
    this.pressed = false;
    this.element.endPress({cancelled: false});
    this.cleanup();
  }

  private cleanup() {
    if (this.touchTimer) {
      clearTimeout(this.touchTimer);
    }
    this.touchTimer = null;
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
    }
    this.clickTimer = null;
    this.lastPositionEvent = null;
  }

  /**
   * Call `endPress` with cancelled state on element, and cleanup timers
   */
  private cancelPress() {
    this.cleanup();
    if (this.phase === Phase.TOUCH_DELAY) {
      this.setPhase(Phase.INACTIVE);
    } else if (this.phase !== Phase.INACTIVE) {
      this.setPhase(Phase.INACTIVE);
      this.element.endPress({cancelled: true});
    }
  }

  private isTouch(e: PointerEvent) {
    return e.pointerType === 'touch';
  }

  private touchDelayFinished() {
    if (this.phase !== Phase.TOUCH_DELAY) {
      return;
    }
    this.setPhase(Phase.HOLDING);
    this.beginPress();
  }

  private waitForClick() {
    this.setPhase(Phase.WAITING_FOR_MOUSE_CLICK);
    this.clickTimer = setTimeout(() => {
      // If a click event does not occur, clean up the interaction state
      if (this.phase === Phase.WAITING_FOR_MOUSE_CLICK) {
        this.cancelPress();
      }
    }, WAIT_FOR_MOUSE_CLICK_MS);
  }

  /**
   * Check if event should trigger actions on the element
   */
  private shouldRespondToEvent(e: PointerEvent) {
    return !this.disabled && e.isPrimary;
  }

  /**
   * Check if the event is within the bounds of the element.
   *
   * This is only needed for the "stuck" contextmenu longpress on Chrome
   */
  private inBounds(ev: PointerEvent) {
    const {top, left, bottom, right} = this.element.getBoundingClientRect();
    const {x, y} = ev;
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  private eventHasModifiers(e: MouseEvent) {
    return e.altKey || e.ctrlKey || e.shiftKey || e.metaKey;
  }

  /**
   * Cancel interactions if the element is removed from the DOM
   */
  hostDisconnected() {
    this.cancelPress();
  }

  /**
   * If the element becomes disabled, cancel interactions
   */
  hostUpdated() {
    if (this.disabled) {
      this.cancelPress();
    }
  }

  // event listeners
  /**
   * Pointer down event handler
   */
  @bound
  pointerDown(e: PointerEvent) {
    if (!this.shouldRespondToEvent(e) || this.phase !== Phase.INACTIVE) {
      return;
    }
    if (this.isTouch(e)) {
      // after a longpress contextmenu event, an extra `pointerdown` can be
      // dispatched to the pressed element. Check that the down is within bounds
      // of the element in this case.
      if (this.checkBoundsAfterContextMenu && !this.inBounds(e)) {
        return;
      }
      this.checkBoundsAfterContextMenu = false;
      this.lastPositionEvent = e;
      this.setPhase(Phase.TOUCH_DELAY);
      this.touchTimer = setTimeout(() => {
        this.touchDelayFinished();
      }, TOUCH_DELAY_MS);
    } else {
      const leftButtonPressed = e.buttons === 1;
      if (!leftButtonPressed ||
          (this.ignoreClicksWithModifiers && this.eventHasModifiers(e))) {
        return;
      }
      this.setPhase(Phase.WAITING_FOR_MOUSE_CLICK);
      this.beginPress(e);
    }
  }

  /**
   * Pointer up event handler
   */
  @bound
  pointerUp(e: PointerEvent) {
    if (!this.isTouch(e) || !this.shouldRespondToEvent(e)) {
      return;
    }
    if (this.phase === Phase.HOLDING) {
      this.waitForClick();
    } else if (this.phase === Phase.TOUCH_DELAY) {
      this.setPhase(Phase.RELEASING);
      this.beginPress();
      this.waitForClick();
    }
  }

  /**
   * Click event handler
   */
  @bound
  click(e: MouseEvent) {
    if (this.disabled ||
        (this.ignoreClicksWithModifiers && this.eventHasModifiers(e))) {
      return;
    }
    if (this.phase === Phase.WAITING_FOR_MOUSE_CLICK) {
      this.endPress();
      this.setPhase(Phase.INACTIVE);
      return;
    }

    // keyboard synthesized click event
    if (this.phase === Phase.INACTIVE && !this.pressed) {
      this.press();
    }
  }

  /**
   * Pointer leave event handler
   */
  @bound
  pointerLeave(e: PointerEvent) {
    // cancel a held press that moves outside the element
    if (this.shouldRespondToEvent(e) && !this.isTouch(e) && this.pressed) {
      this.cancelPress();
    }
  }

  /**
   * Pointer cancel event handler
   */
  @bound
  pointerCancel(e: PointerEvent) {
    if (this.shouldRespondToEvent(e)) {
      this.cancelPress();
    }
  }

  /**
   * Contextmenu event handler
   */
  @bound
  contextMenu() {
    if (!this.disabled) {
      this.checkBoundsAfterContextMenu = true;
      this.cancelPress();
    }
  }

  /**
   * Blur event handler
   */
  @bound
  blur() {
    // Ignore blur before pointerend/pointercancel/pointerup/click. The reason
    // for this is that Mac Firefox/Safari blur buttons on pointerdown.
    if (this.phase !== Phase.TOUCH_DELAY &&
        (BUTTON_FOCUS_ALLOWED ||
         this.phase !== Phase.WAITING_FOR_MOUSE_CLICK)) {
      setTimeout(() => {
        this.cancelPress();
      }, 5);
    }
  }
}