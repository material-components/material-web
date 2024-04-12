/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Easing functions to use for web animations.
 *
 * **NOTE:** `EASING.EMPHASIZED` is approximated with unknown accuracy.
 *
 * TODO(b/241113345): replace with tokens
 */
export const EASING = {
  STANDARD: 'cubic-bezier(0.2, 0, 0, 1)',
  STANDARD_ACCELERATE: 'cubic-bezier(.3,0,1,1)',
  STANDARD_DECELERATE: 'cubic-bezier(0,0,0,1)',
  EMPHASIZED: 'cubic-bezier(.3,0,0,1)',
  EMPHASIZED_ACCELERATE: 'cubic-bezier(.3,0,.8,.15)',
  EMPHASIZED_DECELERATE: 'cubic-bezier(.05,.7,.1,1)',
} as const;

/**
 * A signal that is used for abortable tasks.
 */
export interface AnimationSignal {
  /**
   * Starts the abortable task. Any previous tasks started with this instance
   * will be aborted.
   *
   * @return An `AbortSignal` for the current task.
   */
  start(): AbortSignal;
  /**
   * Complete the current task.
   */
  finish(): void;
}

/**
 * Creates an `AnimationSignal` that can be used to cancel a previous task.
 *
 * @example
 * class MyClass {
 *   private labelAnimationSignal = createAnimationSignal();
 *
 *   private async animateLabel() {
 *     // Start of the task. Previous tasks will be canceled.
 *     const signal = this.labelAnimationSignal.start();
 *
 *     // Do async work...
 *     if (signal.aborted) {
 *       // Use AbortSignal to check if a request was made to abort after some
 *       // asynchronous work.
 *       return;
 *     }
 *
 *     const animation = this.animate(...);
 *     // Add event listeners to be notified when the task should be canceled.
 *     signal.addEventListener('abort', () => {
 *       animation.cancel();
 *     });
 *
 *     animation.addEventListener('finish', () => {
 *       // Tell the signal that the current task is finished.
 *       this.labelAnimationSignal.finish();
 *     });
 *   }
 * }
 *
 * @return An `AnimationSignal`.
 */
export function createAnimationSignal(): AnimationSignal {
  // The current animation's AbortController
  let animationAbortController: AbortController | null = null;

  return {
    start() {
      // Tell the previous animation to cancel.
      animationAbortController?.abort();
      // Set up a new AbortController for the current animation.
      animationAbortController = new AbortController();
      // Provide the AbortSignal so that the caller can check aborted status
      // and add listeners.
      return animationAbortController.signal;
    },
    finish() {
      animationAbortController = null;
    },
  };
}

/**
 * Returns a function which can be used to throttle function calls
 * mapped to a key via a given function that should produce a promise that
 * determines the throttle amount (defaults to requestAnimationFrame).
 */
export function createThrottle() {
  const stack = new Set();
  return async (
    key = '',
    cb: (...args: unknown[]) => unknown,
    timeout = async () => {
      await new Promise(requestAnimationFrame);
    },
  ) => {
    if (!stack.has(key)) {
      stack.add(key);
      await timeout();
      if (stack.has(key)) {
        stack.delete(key);
        cb();
      }
    }
  };
}

/**
 * Parses an number in milliseconds from a css time value
 */
export function msFromTimeCSSValue(value: string) {
  const match = value.trim().match(/([\d.]+)(\s*s$)?/);
  const time = match?.[1];
  const seconds = match?.[2];
  return Number(time ?? 0) * (seconds ? 1000 : 1);
}
