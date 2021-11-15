/** @license Googler-authored internal-only code. */

import * as dom from 'goog:goog.dom';  // from //third_party/javascript/closure/dom
import * as googObject from 'goog:goog.object';  // from //third_party/javascript/closure/object
import * as singleton from 'goog:goog.singleton';  // from //third_party/javascript/closure/singleton
import PluginBase from 'goog:testing.deflaker.PluginBase'; // from //testing/js/deflaker:deflaker_noinit_lib

declare global {
  export interface Window {
    ShadyDOM?: {inUse: boolean;};
  }
}

export class ShadowDOMPlugin extends PluginBase {
  constructor() {
    super('ShadowDOMPlugin');

    const styles = {
      'animation-delay': '0ms',
      'animation-duration': '1ms',
      'animation-timing-function': 'step-start',
      'animation-iteration-count': '1',
      'transition-delay': '0ms',
      'transition-duration': '1ms',
      'transition-timing-function': 'step-start',
    };

    let css = '*, *::before, *::after {';
    googObject.forEach(styles, (value, key) => {
      const property = `${key}: ${value} !important;`;
      css += `${property}-webkit-${property}`;
    });
    css += '}';

    const style = dom.createDom('style', {id: 'deflakerShadowDOMPatch'}, css);
    onShadowRootAttached(shadowRoot => {
      shadowRoot.appendChild(style.cloneNode(true));
    });
  }

  /**
   * @return {!WebAnimationPlugin}
   * @nocollapse
   */
  static getInstance() {
    return singleton.getInstance(ShadowDOMPlugin);
  }
}

type ShadowRootAttachedCallback = (shadowRoot: ShadowRoot, element: Element) =>
    void;

let deflakerPatched = false;
const callbacks = new Set<ShadowRootAttachedCallback>();

function onShadowRootAttached(callback: ShadowRootAttachedCallback) {
  if (!Element.prototype.attachShadow) {
    return;
  }

  if (deflakerPatched) {
    callbacks.add(callback);
    return;
  }

  const nativeAttachShadow = Element.prototype.attachShadow;
  function patchedAttachShadow(
      this: Element, ...args: Parameters<typeof nativeAttachShadow>) {
    const shadowRoot = nativeAttachShadow.apply(this, args);
    // When an element's shadow root is attached, invoke all registered
    // callbacks with the newly created shadow root so that they may modify it.
    for (const callback of callbacks) {
      try {
        callback(shadowRoot, this);
      } catch {
        // Continue even if a callback throws an error.
      }
    }

    // After plugins have addressed the shadow root, return it.
    return shadowRoot;
  }

  Object.defineProperty(Element.prototype, 'attachShadow', {
    configurable: true,
    enumerable: true,
    writable: true,
    value: patchedAttachShadow
  });

  callbacks.add(callback);
  deflakerPatched = true;
}
