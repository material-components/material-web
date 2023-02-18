/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {noChange} from 'lit';
import {Directive, directive, DirectiveParameters, ElementPart, PartInfo, PartType} from 'lit/directive.js';

import {Ripple, State} from './lib/ripple.js';

/**
 * Delay reacting to touch so that we do not show the ripple for a swipe or
 * scroll interaction.
 */
const TOUCH_DELAY_MS = 150;

/**
 * Normalized ripple accessor type.
 *
 * Use with `await rippleFunction()`
 */
type RippleFunction = () => Ripple|null|Promise<Ripple|null>;

class RippleDirective extends Directive {
  private rippleGetter: RippleFunction = async () => null;
  private element?: HTMLElement;
  private checkBoundsAfterContextMenu = false;
  private rippleStartEvent: PointerEvent|null = null;
  private touchTimer: number|null = null;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error('The `ripple` directive must be used on an element');
    }
  }

  render(ripple: RippleFunction|Promise<Ripple|null>) {
    return noChange;
  }

  // Use EventListenerObject::handleEvent interface to handle events without
  // generating bound event handlers
  async handleEvent(event: Event) {
    const ripple = await this.rippleGetter();
    if (!ripple) {
      return;
    }
    switch (event.type) {
      case 'click':
        this.click(ripple);
        break;
      case 'contextmenu':
        this.contextMenu(ripple);
        break;
      case 'pointercancel':
        this.pointerCancel(ripple, event as PointerEvent);
        break;
      case 'pointerdown':
        this.pointerDown(ripple, event as PointerEvent);
        break;
      case 'pointerenter':
        ripple.handlePointerenter(event as PointerEvent);
        break;
      case 'pointerleave':
        this.pointerLeave(ripple, event as PointerEvent);
        break;
      case 'pointerup':
        this.pointerUp(ripple, event as PointerEvent);
        break;
      default:
        break;
    }
  }

  override update(part: ElementPart, [ripple]: DirectiveParameters<this>) {
    if (!this.element) {
      // NOTE: addEventListener typing needs to be used with HTMLElements or a
      // subclass
      this.element = part.element as HTMLElement;
      this.element.addEventListener('click', this);
      this.element.addEventListener('contextmenu', this);
      this.element.addEventListener('pointercancel', this);
      this.element.addEventListener('pointerdown', this);
      this.element.addEventListener('pointerenter', this);
      this.element.addEventListener('pointerleave', this);
      this.element.addEventListener('pointerup', this);
    }
    // Normalize given ripple accessor
    this.rippleGetter = typeof ripple === 'function' ? ripple : () => ripple;
    return noChange;
  }

  /**
   * Returns `true` if
   *  - the ripple element is enabled
   *  - the pointer is primary for the input type
   *  - the pointer is the pointer that started the interaction, or will start
   * the interaction
   *  - the pointer is a touch, or the pointer state has the primary button
   * held, or the pointer is hovering
   */
  private shouldReactToEvent(
      ripple: Ripple, ev: PointerEvent, hovering = false) {
    const enabled = !ripple.disabled;
    const isPrimaryPointer = ev.isPrimary;
    const isInteractionPointer = this.rippleStartEvent === null ||
        this.rippleStartEvent.pointerId === ev.pointerId;
    const isPrimaryButton = ev.buttons === 1;
    return enabled && isPrimaryPointer && isInteractionPointer &&
        (this.isTouch(ev) || isPrimaryButton || hovering);
  }

  private isTouch({pointerType}: PointerEvent) {
    return pointerType === 'touch';
  }

  /**
   * Check if the event is within the bounds of the element.
   *
   * This is only needed for the "stuck" contextmenu longpress on Chrome.
   */
  private inBounds({x, y}: PointerEvent) {
    const {top, left, bottom, right} = this.element!.getBoundingClientRect();
    return x >= left && x <= right && y >= top && y <= bottom;
  }

  private beginPress(ripple: Ripple) {
    ripple.beginPress(this.rippleStartEvent);
  }

  private endPress(ripple: Ripple) {
    ripple.endPress();
    ripple.state = State.INACTIVE;
    this.rippleStartEvent = null;
    if (this.touchTimer) {
      clearTimeout(this.touchTimer);
      this.touchTimer = null;
    }
  }

  private waitForTouchHold(ripple: Ripple) {
    if (this.touchTimer !== null) {
      clearTimeout(this.touchTimer);
    }
    ripple.state = State.TOUCH_DELAY;
    this.touchTimer = setTimeout(() => {
      if (ripple.state !== State.TOUCH_DELAY) {
        return;
      }
      ripple.state = State.HOLDING;
      this.beginPress(ripple);
    }, TOUCH_DELAY_MS);
  }

  private click(ripple: Ripple) {
    // Click is a MouseEvent in Firefox and Safari, so we cannot use
    // `shouldReactToEvent`
    if (ripple.disabled) {
      return;
    }
    if (ripple.state === State.WAITING_FOR_CLICK) {
      this.endPress(ripple);
    } else if (ripple.state === State.INACTIVE) {
      // keyboard synthesized click event
      this.beginPress(ripple);
      this.endPress(ripple);
    }
  }

  private contextMenu(ripple: Ripple) {
    if (!ripple.disabled) {
      this.checkBoundsAfterContextMenu = true;
      this.endPress(ripple);
    }
  }

  private pointerDown(ripple: Ripple, ev: PointerEvent) {
    if (!this.shouldReactToEvent(ripple, ev)) {
      return;
    }
    this.rippleStartEvent = ev;
    if (this.isTouch(ev)) {
      // after a longpress contextmenu event, an extra `pointerdown` can be
      // dispatched to the pressed element. Check that the down is within
      // bounds of the element in this case.
      if (this.checkBoundsAfterContextMenu && !this.inBounds(ev)) {
        return;
      }
      this.checkBoundsAfterContextMenu = false;
      this.waitForTouchHold(ripple);
    } else {
      ripple.state = State.WAITING_FOR_CLICK;
      this.beginPress(ripple);
    }
  }

  private pointerUp(ripple: Ripple, ev: PointerEvent) {
    if (!this.isTouch(ev) || !this.shouldReactToEvent(ripple, ev)) {
      return;
    }
    if (ripple.state === State.HOLDING) {
      ripple.state = State.WAITING_FOR_CLICK;
    } else if (ripple.state === State.TOUCH_DELAY) {
      ripple.state = State.WAITING_FOR_CLICK;
      this.beginPress(ripple);
    }
  }

  private pointerCancel(ripple: Ripple, ev: PointerEvent) {
    if (this.shouldReactToEvent(ripple, ev)) {
      this.endPress(ripple);
    }
  }

  private pointerLeave(ripple: Ripple, ev: PointerEvent) {
    if (this.shouldReactToEvent(ripple, ev, true)) {
      ripple.handlePointerleave(ev);
      // release a held mouse or pen press that moves outside the element
      if (!this.isTouch(ev) && ripple.state !== State.INACTIVE) {
        this.endPress(ripple);
      }
    }
  }
}

/**
 * Connects a Ripple element to a node that drives the interaction
 *
 * @param rippleGetter A function that returns an `md-ripple` element
 * @param simulateKeyboardClick For elements that do not issue a click on
 *     keyboard interaction, pass `true` to enable press animations on Enter or
 *     Spacebar
 */
export const ripple = directive(RippleDirective);
