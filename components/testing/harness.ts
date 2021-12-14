/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {defaultTransformPseudoClasses, getTransformedPseudoClass, transformPseudoClasses} from './transform-pseudo-classes';

declare global {
  interface DocumentOrShadowRoot {
    adoptedStyleSheets?: CSSStyleSheet[];
  }
}

/**
 * Retrieves the element type from a `Harness` type.
 *
 * @template H The harness type.
 */
export type HarnessElement<H extends Harness> =
    H extends Harness<infer E>? E : never;

/**
 * A test harness class that can be used to simulate interaction with an
 * element.
 *
 * @template E The harness's element type.
 */
export class Harness<E extends HTMLElement = HTMLElement> {
  /**
   * The pseudo classes that should be transformed for simulation. Component
   * subclasses may override this to add additional pseudo classes.
   */
  protected transformPseudoClasses = defaultTransformPseudoClasses;

  /**
   * Creates a new harness for the given element.
   *
   * @param element The element that this harness controls.
   */
  constructor(readonly element: E) {}

  /**
   * Resets the element's simulated classes to the default state.
   */
  async reset() {
    await this.release();
    await this.blur();
  }

  /**
   * Hovers, clicks, and leaves the element with a simulated mouse click.
   */
  async click() {
    await this.hoverEnter();
    this.simulateClick(await this.getInteractiveElement());
    await this.hoverLeave();
  }

  /**
   * Taps once on the element with a simulated touch.
   */
  async tap() {
    this.simulateTap(await this.getInteractiveElement());
  }

  /**
   * Hovers over the element with a simulated mouse.
   */
  async hoverEnter() {
    this.simulateHoverEnter(await this.getInteractiveElement());
  }

  /**
   * Moves the simulated mouse cursor off of the element.
   */
  async hoverLeave() {
    this.simulateHoverLeave(await this.getInteractiveElement());
  }

  /**
   * Simulates focusing an element with the keyboard.
   */
  async focusWithKeyboard() {
    this.simulateKeyboardFocus(await this.getInteractiveElement());
  }

  /**
   * Simulates focusing an element with a pointer (mouse/touch).
   */
  async focusWithPointer() {
    await this.hoverEnter();
    this.simulatePointerFocus(await this.getInteractiveElement());
  }

  /**
   * Simulates unfocusing an element.
   */
  async blur() {
    await this.hoverLeave();
    this.simulateBlur(await this.getInteractiveElement());
  }

  /**
   * Simulates pressing and holding a mouse cursor over an element.
   */
  async press() {
    await this.hoverEnter();
    this.simulateMousePress(await this.getInteractiveElement());
  }

  /**
   * Simulates releasing a pressed mouse cursor over an element.
   */
  async release() {
    this.simulateMouseRelease(await this.getInteractiveElement());
    await this.hoverLeave();
  }

  /**
   * Returns the element that should be used for interaction simulation.
   * Defaults to the host element itself.
   *
   * Subclasses should override this if the interactive element is not the host.
   *
   * @return The element to use in simulation.
   */
  protected async getInteractiveElement(): Promise<HTMLElement> {
    return this.element;
  }

  /**
   * Adds a pseudo class to an element. The element's shadow root styles (or
   * document if not in a shadow root) will be transformed to support
   * simulated pseudo classes.
   *
   * @param element The element to add a pseudo class to.
   * @param pseudoClass The pseudo class to add.
   */
  protected addPseudoClass(element: HTMLElement, pseudoClass: string) {
    if (!this.transformPseudoClasses.includes(pseudoClass)) {
      return;
    }

    const root = element.getRootNode() as Document | ShadowRoot;
    transformPseudoClasses(root.styleSheets, this.transformPseudoClasses);
    transformPseudoClasses(
        root.adoptedStyleSheets || [], this.transformPseudoClasses);
    element.classList.add(getTransformedPseudoClass(pseudoClass));
  }

  /**
   * Removes a pseudo class from an element.
   *
   * @param element The element to remove a pseudo class from.
   * @param pseudoClass The pseudo class to remove.
   */
  protected removePseudoClass(element: HTMLElement, pseudoClass: string) {
    element.classList.remove(getTransformedPseudoClass(pseudoClass));
  }

  /**
   * Simulates a mouse press and release.
   *
   * @param element The element to click.
   */
  protected simulateClick(element: HTMLElement) {
    this.simulateMousePress(element);
    this.simulateMouseRelease(element);
  }

  /**
   * Simulates a touch press and release.
   *
   * @param element The element to tap.
   */
  protected simulateTap(element: HTMLElement) {
    this.simulateTouchPress(element);
    this.simulateTouchRelease(element);
  }

  /**
   * Simulates focusing with a keyboard. The difference between this and
   * `simulatePointerFocus` is that keyboard focus will include the
   * `:focus-visible` pseudo class.
   *
   * @param element The element to focus with a keyboard.
   */
  protected simulateKeyboardFocus(element: HTMLElement) {
    this.simulateKeydown(element.ownerDocument, 'Tab');
    this.addPseudoClass(element, ':focus-visible');
    this.simulatePointerFocus(element);
    this.simulateKeyup(element, 'Tab');
  }

  /**
   * Simulates focusing with a pointer.
   *
   * @param element The element to focus with a pointer.
   */
  protected simulatePointerFocus(element: HTMLElement) {
    this.addPseudoClass(element, ':focus');
    this.addPseudoClass(this.element, ':focus-within');
    element.dispatchEvent(new FocusEvent('focus', {composed: true}));
    element.dispatchEvent(
        new FocusEvent('focusin', {bubbles: true, composed: true}));
  }

  /**
   * Simulates unfocusing an element.
   *
   * @param element The element to blur.
   */
  protected simulateBlur(element: HTMLElement) {
    this.removePseudoClass(element, ':focus');
    this.removePseudoClass(element, ':focus-visible');
    this.removePseudoClass(this.element, ':focus-within');
    element.dispatchEvent(new FocusEvent('blur', {composed: true}));
    element.dispatchEvent(
        new FocusEvent('focusout', {bubbles: true, composed: true}));
    element.blur();
  }

  /**
   * Simulates a mouse pointer hovering over an element.
   *
   * @param element The element to hover over.
   */
  protected simulateHoverEnter(element: HTMLElement) {
    this.addPseudoClass(element, ':hover');
    const rect = element.getBoundingClientRect();
    const mouseInit = this.createMouseEventInit(element);
    const mouseEnterInit = {
      ...mouseInit,
      bubbles: false,
      clientX: rect.left,
      clientY: rect.top,
      screenX: rect.left,
      screenY: rect.top,
    };

    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'mouse',
    };

    const pointerEnterInit: PointerEventInit = {
      ...pointerInit,
      ...mouseEnterInit,
    };

    element.dispatchEvent(new PointerEvent('pointerover', pointerInit));
    element.dispatchEvent(new PointerEvent('pointerenter', pointerEnterInit));
    element.dispatchEvent(new MouseEvent('mouseover', mouseInit));
    element.dispatchEvent(new MouseEvent('mouseenter', mouseEnterInit));
  }

  /**
   * Simulates a mouse pointer leaving the element.
   *
   * @param element The element to stop hovering over.
   */
  protected simulateHoverLeave(element: HTMLElement) {
    this.removePseudoClass(element, ':hover');
    const rect = element.getBoundingClientRect();
    const mouseInit = this.createMouseEventInit(element);
    const mouseLeaveInit = {
      ...mouseInit,
      bubbles: false,
      clientX: rect.left - 1,
      clientY: rect.top - 1,
      screenX: rect.left - 1,
      screenY: rect.top - 1,
    };

    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'mouse',
    };

    const pointerLeaveInit: PointerEventInit = {
      ...pointerInit,
      ...mouseLeaveInit,
    };

    element.dispatchEvent(new PointerEvent('pointerout', pointerInit));
    element.dispatchEvent(new PointerEvent('pointerleave', pointerLeaveInit));
    element.dispatchEvent(new MouseEvent('pointerout', mouseInit));
    element.dispatchEvent(new MouseEvent('mouseleave', mouseLeaveInit));
  }

  /**
   * Simulates a mouse press and hold on an element.
   *
   * @param element The element to press with a mouse.
   */
  protected simulateMousePress(element: HTMLElement) {
    this.addPseudoClass(element, ':active');
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'mouse',
    };

    element.dispatchEvent(new PointerEvent('pointerdown', pointerInit));
    element.dispatchEvent(new MouseEvent('mousedown', mouseInit));
    this.simulatePointerFocus(element);
  }

  /**
   * Simulates a mouse press release from an element.
   *
   * @param element The element to release pressing from.
   */
  protected simulateMouseRelease(element: HTMLElement) {
    this.removePseudoClass(element, ':active');
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'mouse',
    };

    element.dispatchEvent(new PointerEvent('pointerup', pointerInit));
    element.dispatchEvent(new MouseEvent('mouseup', mouseInit));
    element.click();
  }

  /**
   * Simulates a touch press and hold on an element.
   *
   * @param element The element to press with a touch pointer.
   */
  protected simulateTouchPress(element: HTMLElement) {
    this.addPseudoClass(element, ':active');
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'touch',
    };

    const touch = this.createTouch(element);
    element.dispatchEvent(new PointerEvent('pointerdown', pointerInit));
    element.dispatchEvent(new TouchEvent('touchstart', {
      touches: [touch],
      targetTouches: [touch],
      changedTouches: [touch],
    }));
    this.simulatePointerFocus(element);
  }

  /**
   * Simulates a touch press release from an element.
   *
   * @param element The element to release pressing from.
   */
  protected simulateTouchRelease(element: HTMLElement) {
    this.removePseudoClass(element, ':active');
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'touch',
    };

    const touch = this.createTouch(element);
    element.dispatchEvent(new PointerEvent('pointerup', pointerInit));
    element.dispatchEvent(
        new TouchEvent('touchend', {changedTouches: [touch]}));
    element.dispatchEvent(new MouseEvent('mousedown', mouseInit));
    element.dispatchEvent(new MouseEvent('mouseup', mouseInit));
    element.click();
  }

  /**
   * Simulates a keypress on an element.
   *
   * @param element The element to press a key on.
   * @param key The key to press.
   * @param init Additional keyboard options.
   */
  protected simulateKeypress(
      element: EventTarget, key: string, init?: Partial<KeyboardEventInit>) {
    this.simulateKeydown(element, key, init);
    this.simulateKeyup(element, key, init);
  }

  /**
   * Simulates a keydown press on an element.
   *
   * @param element The element to press a key on.
   * @param key The key to press.
   * @param init Additional keyboard options.
   */
  protected simulateKeydown(
      element: EventTarget, key: string,
      init: Partial<KeyboardEventInit> = {}) {
    element.dispatchEvent(new KeyboardEvent('keydown', {
      ...init,
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
    }));
  }

  /**
   * Simulates a keyup release from an element.
   *
   * @param element The element to release a key from.
   * @param key The key to release.
   * @param init Additional keyboard options.
   */
  protected simulateKeyup(
      element: EventTarget, key: string,
      init: Partial<KeyboardEventInit> = {}) {
    element.dispatchEvent(new KeyboardEvent('keyup', {
      ...init,
      key,
      bubbles: true,
      composed: true,
      cancelable: true,
    }));
  }

  /**
   * Creates a MouseEventInit for an element. The default x/y coordinates of the
   * event init will be in the center of the element.
   *
   * @param element The element to create a `MouseEventInit` for.
   * @return The init object for a `MouseEvent`.
   */
  protected createMouseEventInit(element: HTMLElement): MouseEventInit {
    const rect = element.getBoundingClientRect();
    return {
      bubbles: true,
      cancelable: true,
      composed: true,
      clientX: (rect.left + rect.right) / 2,
      clientY: (rect.top + rect.bottom) / 2,
      screenX: (rect.left + rect.right) / 2,
      screenY: (rect.top + rect.bottom) / 2,
    };
  }

  /**
   * Creates a Touch instance for an element. The default x/y coordinates of the
   * touch will be in the center of the element. This can be used in the
   * `TouchEvent` constructor.
   *
   * @param element The element to create a touch for.
   * @param identifier Optional identifier for the touch. Defaults to 0 for
   *     every touch instance.
   * @return The `Touch` instance.
   */
  protected createTouch(element: HTMLElement, identifier = 0): Touch {
    const rect = element.getBoundingClientRect();
    return new Touch({
      identifier,
      target: element,
      clientX: (rect.left + rect.right) / 2,
      clientY: (rect.top + rect.bottom) / 2,
      screenX: (rect.left + rect.right) / 2,
      screenY: (rect.top + rect.bottom) / 2,
      pageX: (rect.left + rect.right) / 2,
      pageY: (rect.top + rect.bottom) / 2,
    });
  }
}
