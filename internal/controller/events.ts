/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Re-dispatches an event from the provided element.
 *
 * This function is useful for forwarding non-composed events, such as `change`
 * events.
 *
 * @example
 * class MyInput extends LitElement {
 *   render() {
 *     return html`<input @change=${this.redispatchEvent}>`;
 *   }
 *
 *   protected redispatchEvent(event: Event) {
 *     redispatchEvent(this, event);
 *   }
 * }
 *
 * @param element The element to dispatch the event from.
 * @param event The event to re-dispatch.
 * @return Whether or not the event was dispatched (if cancelable).
 */
export function redispatchEvent(element: Element, event: Event) {
  // For bubbling events in SSR light DOM (or composed), stop their propagation
  // and dispatch the copy.
  if (event.bubbles && (!element.shadowRoot || event.composed)) {
    event.stopPropagation();
  }

  const copy = Reflect.construct(event.constructor, [event.type, event]);
  const dispatched = element.dispatchEvent(copy);
  if (!dispatched) {
    event.preventDefault();
  }

  return dispatched;
}

/**
 * A symbol used to add propagation signals to an `Event`.
 */
const propagationSignal = Symbol('propagationSignal');

/**
 * An `Event` that may have a `propagationSignal`.
 */
interface EventWithPropagation extends Event {
  [propagationSignal]?: EventTarget;
}

/**
 * Waits for an event to finish propagating to other event listeners. The
 * callback provided runs synchronously after event propagation, and enables
 * behavior for `event.preventDefault()` support.
 *
 * `listenForPropagation()` must be called for event listener types that use
 * this function.
 *
 * @example
 * ```ts
 * class MyElement extends LitElement {
 *   constructor() {
 *     super();
 *     listenForPropagation(this, 'click');
 *     this.addEventListener('click', event => {
 *       // Allow event to propagate to others that can call preventDefault()
 *       afterPropagation(event, () => {
 *         if (event.defaultPrevented) {
 *           return;
 *         }
 *
 *         // Perform behavior/cleanup
 *       });
 *     });
 *   }
 * }
 * ```
 *
 * @param event The event that is propagating. Will throw an error if
 *     `listenForPropagation()` was not called with the event's type.
 * @param callback A function that is called synchronously after the event has
 *     propagated, but before control is released to the function context that
 *     dispatched the event.
 */
export function afterPropagation(event: Event, callback: () => void) {
  // Must be a callback since Promises and async/await run on the microtask
  // queue, and this needs to be called synchronously.
  const signal = (event as EventWithPropagation)[propagationSignal];
  if (!signal) {
    throw new Error(`${event.type} event needs listenForPropagation()`);
  }

  signal.addEventListener('finish', callback);
}

/**
 * Sets up an event target to enable synchronous `afterPropagation()` callbacks.
 * This is used for event listeners that need to perform logic after an event
 * has propagated to other event listeners, often for `defaultPrevented` logic.
 *
 * @example
 * ```ts
 * class MyElement extends LitElement {
 *   constructor() {
 *     super();
 *     listenForPropagation(this, 'click');
 *     this.addEventListener('click', event => {
 *       // Allow event to propagate to others that can call preventDefault()
 *       afterPropagation(event, () => {
 *         if (event.defaultPrevented) {
 *           return;
 *         }
 *
 *         // Perform behavior/cleanup
 *       });
 *     });
 *   }
 * }
 * ```
 *
 * @param target The event target that adds listeners using
 *     `afterPropagation()`.
 * @param types One or more event types to enable `afterPropagation()` for.
 */
export function listenForPropagation(
  target: EventTarget,
  ...types: [string, ...string[]]
) {
  for (const type of types) {
    target.addEventListener(
      type,
      (event: EventWithPropagation) => {
        // Each event gets an EventTarget that can be used to hook into the
        // event's propagation lifecycle.
        const propagationEvents = new EventTarget();
        event[propagationSignal] = propagationEvents;

        // Install a final event listener during the capture phase to the last
        // target in the event's path that it will propagate to. When this final
        // event listener is called, propagation will be complete.
        const cleanupFinalListener = new AbortController();
        const finishPropagation = () => {
          cleanupFinalListener.abort();
          propagationEvents.dispatchEvent(new Event('finish'));
        };

        // Patch event stop propagation methods to remove the final event
        // listener when a listener in the chain before stops it.
        const superStopPropagation = event.stopPropagation;
        event.stopPropagation = () => {
          superStopPropagation.call(event);
          finishPropagation();
        };

        const superStopImmediatePropagation = event.stopImmediatePropagation;
        event.stopImmediatePropagation = () => {
          superStopImmediatePropagation.call(event);
          finishPropagation();
        };

        // Add a final event listener to the last propagation target. It will
        // only fire once, but we also need to clean it up with an abort signal
        // if the event stopped propagating before reaching the listener.
        const path = event.composedPath();
        // If the event doesn't bubble, the last target is the current target.
        const lastTarget = event.bubbles ? path[path.length - 1] : target;
        lastTarget.addEventListener(type, finishPropagation, {
          once: true,
          signal: cleanupFinalListener.signal,
        });
      },
      {
        // Use the capture phase, which will happen before other event
        // listeners during the bubbling phase. Because they're different
        // phases, we can add the final bubbling event listener during the
        // capture phase. You cannot add additional bubbling event listeners
        // once the bubbling phase has started.
        capture: true,
      },
    );
  }
}

/**
 * Dispatches a click event to the given element that triggers a native action,
 * but is not composed and therefore is not seen outside the element.
 *
 * This is useful for responding to an external click event on the host element
 * that should trigger an internal action like a button click.
 *
 * Note, a helper is provided because setting this up correctly is a bit tricky.
 * In particular, calling `click` on an element creates a composed event, which
 * is not desirable, and a manually dispatched event must specifically be a
 * `MouseEvent` to trigger a native action.
 *
 * @example
 * hostClickListener = (event: MouseEvent) {
 *   if (isActivationClick(event)) {
 *     this.dispatchActivationClick(this.buttonElement);
 *   }
 * }
 *
 */
export function dispatchActivationClick(element: HTMLElement) {
  const event = new MouseEvent('click', {bubbles: true});
  element.dispatchEvent(event);
  return event;
}

/**
 * Returns true if the click event should trigger an activation behavior. The
 * behavior is defined by the element and is whatever it should do when
 * clicked.
 *
 * Typically when an element needs to handle a click, the click is generated
 * from within the element and an event listener within the element implements
 * the needed behavior; however, it's possible to fire a click directly
 * at the element that the element should handle. This method helps
 * distinguish these "external" clicks.
 *
 * An "external" click can be triggered in a number of ways: via a click
 * on an associated label for a form  associated element, calling
 * `element.click()`, or calling
 * `element.dispatchEvent(new MouseEvent('click', ...))`.
 *
 * Also works around Firefox issue
 * https://bugzilla.mozilla.org/show_bug.cgi?id=1804576 by squelching
 * events for a microtask after called.
 *
 * @example
 * hostClickListener = (event: MouseEvent) {
 *   if (isActivationClick(event)) {
 *     this.dispatchActivationClick(this.buttonElement);
 *   }
 * }
 *
 */
export function isActivationClick(event: Event) {
  // Event must start at the event target.
  if (event.currentTarget !== event.target) {
    return false;
  }
  // Event must not be retargeted from shadowRoot.
  if (event.composedPath()[0] !== event.target) {
    return false;
  }
  // Target must not be disabled; this should only occur for a synthetically
  // dispatched click.
  if ((event.target as EventTarget & {disabled: boolean}).disabled) {
    return false;
  }
  // This is an activation if the event should not be squelched.
  return !squelchEvent(event);
}

// TODO(https://bugzilla.mozilla.org/show_bug.cgi?id=1804576)
//  Remove when Firefox bug is addressed.
function squelchEvent(event: Event) {
  const squelched = isSquelchingEvents;
  if (squelched) {
    event.preventDefault();
    event.stopImmediatePropagation();
  }
  squelchEventsForMicrotask();
  return squelched;
}

// Ignore events for one microtask only.
let isSquelchingEvents = false;
async function squelchEventsForMicrotask() {
  isSquelchingEvents = true;
  // Need to pause for just one microtask.
  // tslint:disable-next-line
  await null;
  isSquelchingEvents = false;
}
