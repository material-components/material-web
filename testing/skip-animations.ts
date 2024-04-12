/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** Overrides the browsers native animate to make them run in 1ms */
export function installSkipWebAnimations() {
  const nativeAnimate = Element.prototype.animate;
  function patchedAnimate(
    this: Element,
    ...args: Parameters<typeof nativeAnimate>
  ) {
    const animation = nativeAnimate.apply(this, args);
    if (animation.effect) {
      animation.effect.updateTiming({
        delay: 0,
        duration: 1,
        easing: 'step-start',
        iterations: 1,
      });
    }

    return animation;
  }

  Object.defineProperty(Element.prototype, 'animate', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: patchedAnimate,
  });

  // return uninstall function.
  return () => {
    Object.defineProperty(Element.prototype, 'animate', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: nativeAnimate,
    });
  };
}
