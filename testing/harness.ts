/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  defaultTransformPseudoClasses,
  getTransformedPseudoClass,
  transformPseudoClasses,
} from './transform-pseudo-classes.js';

/**
 * Retrieves the element type from a `Harness` type.
 *
 * @template H The harness type.
 */
export type HarnessElement<H extends Harness> = H extends Harness<infer E>
  ? ElementWithHarness<E, H>
  : never;

/**
 * Harnesses will attach themselves to their element for convenience.
 *
 * @template E The element type.
 * @template H The harness type.
 */
export type ElementWithHarness<
  E extends HTMLElement = HTMLElement,
  H extends Harness<E> = Harness<E>,
> = E & {
  /**
   * The harness for this element.
   */
  harness: H;

  /**
   * Associated form element.
   */
  form?: HTMLFormElement | null;
};

/**
 * Checks whether or not an element has a Harness attached to it on the
 * `element.harness` property.
 *
 * @param element The element to check.
 * @return True if the element has a harness property.
 */
export function isElementWithHarness(
  element: Element,
): element is ElementWithHarness {
  return (element as unknown as ElementWithHarness).harness instanceof Harness;
}

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
   * The element that this harness controls.
   */
  readonly element: E & ElementWithHarness<E, this>;

  /**
   * A set of elements that have already been patched to support transformed
   * pseudo classes.
   */
  private readonly patchedElements = new WeakSet<HTMLElement>();

  /**
   * Creates a new harness for the given element.
   *
   * @param element The element that this harness controls.
   */
  constructor(element: E) {
    this.element = element as ElementWithHarness<E, this>;
    this.element.harness = this;
  }

  /**
   * Resets the element's simulated classes to the default state.
   */
  async reset() {
    const element = await this.getInteractiveElement();
    for (const pseudoClass of this.transformPseudoClasses) {
      this.forEachNodeFrom(element, (el) => {
        this.removePseudoClass(el, pseudoClass);
      });
    }
  }

  /**
   * Hovers and clicks on an element. This will generate a `click` event.
   *
   * @param init Additional event options.
   */
  async clickWithMouse(init: PointerEventInit = {}) {
    await this.startClickWithMouse(init);
    await this.endClickWithMouse(init);
  }

  /**
   * Begins a click with a mouse. Use this along with `endClickWithMouse()` to
   * customize the length of the click.
   *
   * @param init Additional event options.
   */
  async startClickWithMouse(init: PointerEventInit = {}) {
    const element = await this.getInteractiveElement();
    await this.startHover();
    this.simulateMousePress(element, init);
  }

  /**
   * Finishes a click with a mouse. Use this along with `startClickWithMouse()`
   * to customize the length of the click. This will generate a `click` event.
   *
   * @param init Additional event options.
   */
  async endClickWithMouse(init: PointerEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateMouseRelease(element, init);
    if ((init?.button ?? 0) === 0) {
      // Dispatch a click for left-click only (default).
      this.simulateClick(element, init);
    }
  }

  /**
   * Clicks an element with the keyboard (defaults to spacebar). This will
   * generate a `click` event.
   *
   * @param init Additional event options.
   */
  async clickWithKeyboard(init: KeyboardEventInit = {}) {
    const element = await this.getInteractiveElement();
    await this.startClickWithKeyboard(init);
    await this.endClickWithKeyboard(init);
    this.simulateClick(element, init);
  }

  /**
   * Begins a click with the keyboard (defaults to spacebar). Use this along
   * with `endClickWithKeyboard()` to customize the length of the click.
   *
   * @param init Additional event options.
   */
  async startClickWithKeyboard(init: KeyboardEventInit = {}) {
    const element = await this.getInteractiveElement();
    await this.focusWithKeyboard(init);
    this.simulateKeydown(element, init.key ?? ' ', init);
    this.simulateClick(element, init);
  }

  /**
   * Finishes a click with the keyboard (defaults to spacebar). Use this along
   * with `startClickWithKeyboard()` to customize the length of the click.
   *
   * @param init Additional event options.
   */
  async endClickWithKeyboard(init: KeyboardEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateKeyup(element, init.key ?? ' ', init);
    this.simulateClick(element, init);
  }

  /**
   * Right-clicks and opens a context menu. This will generate a `contextmenu`
   * event.
   */
  async rightClickWithMouse() {
    const element = await this.getInteractiveElement();
    const rightMouseButton = {button: 2, buttons: 2};
    await this.startClickWithMouse(rightMouseButton);
    // Note: contextmenu right clicks do not generate the up events
    this.simulateContextmenu(element, rightMouseButton);
  }

  /**
   * Taps once on the element with a simulated touch. This will generate a
   * `click` event.
   *
   * @param init Additional event options.
   * @param touchInit Additional touch event options.
   */
  async tap(init: PointerEventInit = {}, touchInit: TouchEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateTouchPress(element, init, touchInit);
    this.simulateTouchRelease(element, init, touchInit);
    if ((init?.isPrimary ?? true) === true) {
      // Dispatch a click for primary touches only (default).
      await this.endTapClick(init);
    }
  }

  /**
   * Begins a touch tap. Use this along with `endTap()` to customize the length
   * or number of taps.
   *
   * @param init Additional event options.
   * @param touchInit Additional touch event options.
   */
  async startTap(init: PointerEventInit = {}, touchInit: TouchEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateTouchPress(element, init, touchInit);
  }

  /**
   * Simulates a `contextmenu` event for touch. Use this along with `startTap()`
   * to generate a tap-and-hold context menu interaction.
   *
   * @param init Additional event options.
   */
  async startTapContextMenu(init: MouseEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateContextmenu(element, init);
  }

  /**
   * Finished a touch tap. Use this along with `startTap()` to customize the
   * length or number of taps.
   *
   * This will NOT generate a `click` event.
   *
   * @param init Additional event options.
   * @param touchInit Additional touch event options.
   */
  async endTap(init: PointerEventInit = {}, touchInit: TouchEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateTouchRelease(element, init, touchInit);
  }

  /**
   * Simulates a `click` event for touch. Use this along with `endTap()` to
   * control the timing of tap and click events.
   *
   * @param init Additional event options.
   */
  async endTapClick(init: PointerEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateClick(element, {
      pointerType: 'touch',
      ...init,
    });
  }

  /**
   * Cancels a touch tap.
   *
   * @param init Additional event options.
   * @param touchInit Additional touch event options.
   */
  async cancelTap(init: PointerEventInit = {}, touchInit: TouchEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateTouchCancel(element, init, touchInit);
  }

  /**
   * Hovers over the element with a simulated mouse.
   */
  async startHover() {
    const element = await this.getInteractiveElement();
    this.simulateStartHover(element);
  }

  /**
   * Moves the simulated mouse cursor off of the element.
   */
  async endHover() {
    const element = await this.getInteractiveElement();
    this.simulateEndHover(element);
  }

  /**
   * Simulates focusing an element with the keyboard.
   *
   * @param init Additional event options.
   */
  async focusWithKeyboard(init: KeyboardEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateKeyboardFocus(element);
  }

  /**
   * Simulates focusing an element with a pointer.
   */
  async focusWithPointer() {
    const element = await this.getInteractiveElement();
    await this.startHover();
    this.simulatePointerFocus(element);
  }

  /**
   * Simulates unfocusing an element.
   */
  async blur() {
    const element = await this.getInteractiveElement();
    await this.endHover();
    this.simulateBlur(element);
  }

  /**
   * Simulates a keypress on an element.
   *
   * @param key The key to press.
   * @param init Additional event options.
   */
  async keypress(key: string, init: KeyboardEventInit = {}) {
    const element = await this.getInteractiveElement();
    this.simulateKeypress(element, key, init);
  }

  /**
   * Simulates submitting the element's associated form element.
   *
   * @param form (Optional) form to submit, defaults to the elemnt's form.
   * @return The submitted form data or null if the element has no associated
   * form.
   */
  submitForm(form = this.element.form) {
    if (!form) {
      return new FormData();
    }
    return new Promise<FormData>((resolve) => {
      const submitListener = (event: SubmitEvent) => {
        event.preventDefault();
        const data = new FormData(form);
        resolve(data);
        return false;
      };

      form.addEventListener('submit', submitListener, {once: true});
      form.requestSubmit();
    });
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
    if (element.shadowRoot) {
      transformPseudoClasses(
        element.shadowRoot.adoptedStyleSheets || [],
        this.transformPseudoClasses,
      );
    }

    transformPseudoClasses(root.styleSheets, this.transformPseudoClasses);
    transformPseudoClasses(
      root.adoptedStyleSheets || [],
      this.transformPseudoClasses,
    );
    element.classList.add(getTransformedPseudoClass(pseudoClass));
    this.patchForTransformedPseudoClasses(element);
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
   * Simulates a click event.
   *
   * @param element The element to click.
   * @param init Additional event options.
   */
  protected simulateClick(element: HTMLElement, init: MouseEventInit = {}) {
    // Firefox does not support some simulations with PointerEvents, such as
    // selecting an <input type="checkbox">. Use MouseEvent for browser support.
    element.dispatchEvent(
      new MouseEvent('click', {
        ...this.createMouseEventInit(element),
        ...init,
      }),
    );
  }

  /**
   * Simulates a contextmenu event.
   *
   * @param element The element to generate an event for.
   * @param init Additional event options.
   */
  protected simulateContextmenu(
    element: HTMLElement,
    init: MouseEventInit = {},
  ) {
    element.dispatchEvent(
      new MouseEvent('contextmenu', {
        ...this.createMouseEventInit(element),
        button: 2,
        buttons: 2,
        ...init,
      }),
    );
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
    this.forEachNodeFrom(element, (el) => {
      this.addPseudoClass(el, ':focus-within');
    });
    element.dispatchEvent(new FocusEvent('focus', {composed: true}));
    element.dispatchEvent(
      new FocusEvent('focusin', {bubbles: true, composed: true}),
    );
  }

  /**
   * Simulates unfocusing an element.
   *
   * @param element The element to blur.
   */
  protected simulateBlur(element: HTMLElement) {
    this.removePseudoClass(element, ':focus');
    this.removePseudoClass(element, ':focus-visible');
    this.forEachNodeFrom(element, (el) => {
      this.removePseudoClass(el, ':focus-within');
    });
    element.dispatchEvent(new FocusEvent('blur', {composed: true}));
    element.dispatchEvent(
      new FocusEvent('focusout', {bubbles: true, composed: true}),
    );
  }

  /**
   * Simulates a mouse pointer hovering over an element.
   *
   * @param element The element to hover over.
   * @param init Additional event options.
   */
  protected simulateStartHover(
    element: HTMLElement,
    init: PointerEventInit = {},
  ) {
    this.forEachNodeFrom(element, (el) => {
      this.addPseudoClass(el, ':hover');
    });
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

    const pointerInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'mouse',
    };

    const pointerEnterInit: PointerEventInit = {
      ...pointerInit,
      ...mouseEnterInit,
      ...init,
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
   * @param init Additional event options.
   */
  protected simulateEndHover(
    element: HTMLElement,
    init: PointerEventInit = {},
  ) {
    this.forEachNodeFrom(element, (el) => {
      this.removePseudoClass(el, ':hover');
    });
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
      ...init,
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
   * @param init Additional event options.
   */
  protected simulateMousePress(
    element: HTMLElement,
    init: PointerEventInit = {},
  ) {
    this.addPseudoClass(element, ':active');
    this.forEachNodeFrom(element, (el) => {
      this.addPseudoClass(el, ':active');
    });
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'mouse',
      ...init,
    };

    element.dispatchEvent(new PointerEvent('pointerdown', pointerInit));
    element.dispatchEvent(new MouseEvent('mousedown', mouseInit));
    this.simulatePointerFocus(element);
  }

  /**
   * Simulates a mouse press release from an element.
   *
   * @param element The element to release pressing from.
   * @param init Additional event options.
   */
  protected simulateMouseRelease(
    element: HTMLElement,
    init: PointerEventInit = {},
  ) {
    this.removePseudoClass(element, ':active');
    this.forEachNodeFrom(element, (el) => {
      this.removePseudoClass(el, ':active');
    });
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'mouse',
      ...init,
    };

    element.dispatchEvent(new PointerEvent('pointerup', pointerInit));
    element.dispatchEvent(new MouseEvent('mouseup', mouseInit));
  }

  /**
   * Simulates a touch press and hold on an element.
   *
   * @param element The element to press with a touch pointer.
   * @param init Additional event options.
   */
  protected simulateTouchPress(
    element: HTMLElement,
    init: PointerEventInit = {},
    touchInit: TouchEventInit = {},
  ) {
    this.addPseudoClass(element, ':active');
    this.forEachNodeFrom(element, (el) => {
      this.addPseudoClass(el, ':active');
    });
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'touch',
      ...init,
    };

    element.dispatchEvent(new PointerEvent('pointerdown', pointerInit));
    // Firefox does not support TouchEvent constructor
    if (window.TouchEvent) {
      const touch = this.createTouch(element);
      element.dispatchEvent(
        new TouchEvent('touchstart', {
          touches: [touch],
          targetTouches: [touch],
          changedTouches: [touch],
          ...touchInit,
        }),
      );
    }
    this.simulatePointerFocus(element);
  }

  /**
   * Simulates a touch press release from an element.
   *
   * @param element The element to release pressing from.
   * @param init Additional event options.
   */
  protected simulateTouchRelease(
    element: HTMLElement,
    init: PointerEventInit = {},
    touchInit: TouchEventInit = {},
  ) {
    this.removePseudoClass(element, ':active');
    this.forEachNodeFrom(element, (el) => {
      this.removePseudoClass(el, ':active');
    });
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'touch',
      ...init,
    };

    element.dispatchEvent(new PointerEvent('pointerup', pointerInit));
    // Firefox does not support TouchEvent constructor
    if (window.TouchEvent) {
      const touch = this.createTouch(element);
      element.dispatchEvent(
        new TouchEvent('touchend', {changedTouches: [touch], ...touchInit}),
      );
    }
  }

  /**
   * Simulates a touch cancel from an element.
   *
   * @param element The element to cancel a touch for.
   * @param init Additional event options.
   */
  protected simulateTouchCancel(
    element: HTMLElement,
    init: PointerEventInit = {},
    touchInit: TouchEventInit = {},
  ) {
    this.removePseudoClass(element, ':active');
    this.forEachNodeFrom(element, (el) => {
      this.removePseudoClass(el, ':active');
    });
    const mouseInit = this.createMouseEventInit(element);
    const pointerInit: PointerEventInit = {
      ...mouseInit,
      isPrimary: true,
      pointerType: 'touch',
      ...init,
    };

    element.dispatchEvent(new PointerEvent('pointercancel', pointerInit));
    // Firefox does not support TouchEvent constructor
    if (window.TouchEvent) {
      const touch = this.createTouch(element);
      element.dispatchEvent(
        new TouchEvent('touchcancel', {changedTouches: [touch], ...touchInit}),
      );
    }
  }

  /**
   * Simulates a keypress on an element.
   *
   * @param element The element to press a key on.
   * @param key The key to press.
   * @param init Additional event options.
   */
  protected simulateKeypress(
    element: EventTarget,
    key: string,
    init: KeyboardEventInit = {},
  ) {
    this.simulateKeydown(element, key, init);
    this.simulateKeyup(element, key, init);
  }

  /**
   * Simulates a keydown press on an element.
   *
   * @param element The element to press a key on.
   * @param key The key to press.
   * @param init Additional event options.
   */
  protected simulateKeydown(
    element: EventTarget,
    key: string,
    init: KeyboardEventInit = {},
  ) {
    element.dispatchEvent(
      new KeyboardEvent('keydown', {
        ...init,
        key,
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
  }

  /**
   * Simulates a keyup release from an element.
   *
   * @param element The element to release a key from.
   * @param key The key to release.
   * @param init Additional keyboard options.
   */
  protected simulateKeyup(
    element: EventTarget,
    key: string,
    init: KeyboardEventInit = {},
  ) {
    element.dispatchEvent(
      new KeyboardEvent('keyup', {
        ...init,
        key,
        bubbles: true,
        composed: true,
        cancelable: true,
      }),
    );
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
      // Primary button (usually the left button)
      button: 0,
      buttons: 1,
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
      touchType: 'direct',
    });
  }

  /**
   * Visit each node up the parent tree from the given child until reaching the
   * given parent.
   *
   * This is used to perform logic such as adding/removing recursive pseudo
   * classes like `:hover`.
   *
   * @param child The first child element to start from.
   * @param callback A callback that is invoked with each `HTMLElement` node
   *     from the child to the parent.
   * @param parent The last parent element to visit.
   */
  protected forEachNodeFrom(
    child: HTMLElement,
    callback: (node: HTMLElement) => void,
    parent: HTMLElement = this.element,
  ) {
    let nextNode: Node | null = child;
    while (nextNode && nextNode !== this.element) {
      const currentNode: Node = nextNode;
      nextNode = currentNode.parentNode || (currentNode as ShadowRoot).host;

      if (!(currentNode instanceof HTMLElement)) {
        continue;
      }

      callback(currentNode);

      if (nextNode instanceof HTMLElement && nextNode.shadowRoot) {
        const slot = currentNode.getAttribute('slot');
        const slotSelector = slot ? `slot[name=${slot}]` : 'slot:not([name])';
        const slotElement =
          nextNode.shadowRoot.querySelector<HTMLSlotElement>(slotSelector);
        if (slotElement) {
          this.forEachNodeFrom(slotElement, callback, nextNode);
        }
      }
    }

    callback(parent);
  }

  /**
   * Patch an element's methods, such as `querySelector` and `matches` to
   * handle transformed pseudo classes.
   *
   * For example, `element.matches(':focus')` will return true when the
   * `._focus` class is applied.
   *
   * @param element The element to patch.
   */
  protected patchForTransformedPseudoClasses(element: HTMLElement) {
    if (this.patchedElements.has(element)) {
      return;
    }

    // Patch functions to handle pseudo selectors.
    const getSelector = (selector: string) => {
      if (this.transformPseudoClasses.includes(selector)) {
        return `.${getTransformedPseudoClass(selector)}`;
      }

      return selector;
    };

    const superMatches = this.element.matches;
    element.matches = (selector: string) => {
      return superMatches.call(element, getSelector(selector));
    };

    const superQuerySelector = this.element.querySelector;
    element.querySelector = (selector: string) => {
      return superQuerySelector.call(element, getSelector(selector));
    };

    const superQuerySelectorAll = this.element.querySelectorAll;
    element.querySelectorAll = (selector: string) => {
      return superQuerySelectorAll.call(element, getSelector(selector));
    };

    this.patchedElements.add(element);
  }
}
