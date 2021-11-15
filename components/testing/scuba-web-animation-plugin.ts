/** @license Googler-authored internal-only code. */

import * as singleton from 'goog:goog.singleton';  // from //third_party/javascript/closure/singleton
import PluginBase from 'goog:testing.deflaker.PluginBase'; // from //testing/js/deflaker:deflaker_noinit_lib

/**
 * Deflaker plugin for web animations: it patches them so they become fast and
 * deterministic, and also waits for them to finish (because a finished
 * animation can cause other code to run, which must happen before the page is
 * deemed stable).
 *
 * This is based on `CssAnimationPlugin` and works by patching `Element.animate`
 * to update the animation's effect to a 0ms delay, 1ms duration, 1
 * iteration, and step-start easing.
 *
 * This plugin does not do anything if the web animation API is not available.
 */
export class WebAnimationPlugin extends PluginBase {
  constructor() {
    super('WebAnimationPlugin');

    if (!Element.prototype.animate) {
      console.log(
          '[Deflaker] Web animations not available, plugin is disabled');
      return;
    }

    const nativeAnimate = Element.prototype.animate;
    function patchedAnimate(
        this: Element, ...args: Parameters<typeof nativeAnimate>) {
      const animation = nativeAnimate.apply(this, args);
      if (animation.effect) {
        animation.effect.updateTiming(
            {delay: 0, duration: 1, easing: 'step-start', iterations: 1});
      }

      return animation;
    }

    Object.defineProperty(Element.prototype, 'animate', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: patchedAnimate
    });
  }

  /** @override */
  override async waitImpl() {
    if (!document.getAnimations) {
      return false;
    }

    // Simply report whether or not there are animations present/running and
    // wait `WebAnimationPlugin.timeoutMillis` for them to finish.
    return document.getAnimations().length > 0;
  }

  /**
   * @return {!WebAnimationPlugin}
   * @nocollapse
   */
  static getInstance() {
    return singleton.getInstance(WebAnimationPlugin);
  }
}
