/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {applyPassive} from '@material/dom/events';
import {matches} from '@material/dom/ponyfill';
import {EventType, SpecificEventListener} from '@material/mwc-base/base-element.js';
import {RippleInterface} from '@material/mwc-base/form-element.js';
import {MDCRippleAdapter} from '@material/ripple/adapter.js';
import MDCRippleFoundation from '@material/ripple/foundation.js';
import {supportsCssVariables} from '@material/ripple/util.js';
import {directive, noChange, NodePart, PropertyPart, templateFactory} from 'lit-html';

import {style} from './mwc-ripple-global-css.js';

const supportsCssVariablesWin = supportsCssVariables(window);

export interface RippleOptions {
  interactionNode?: HTMLElement;
  unbounded?: boolean;
  disabled?: boolean;
  active?: boolean;
}

export interface RippleNodeOptions extends RippleOptions {
  surfaceNode: HTMLElement;
}

/**
 * force the ripple directive to share API names with `mwc-ripple` after Closure
 * Compiler.
 */
class RippleIntermediate implements RippleInterface {
  private readonly foundation: MDCRippleFoundation;

  constructor(foundation: MDCRippleFoundation) {
    this.foundation = foundation;
  }
  startPress() {
    this.foundation.activate();
  }
  endPress() {
    this.foundation.deactivate();
  }
  startFocus() {
    this.foundation.handleFocus();
  }
  endFocus() {
    this.foundation.handleBlur();
  }
  destroy() {
    this.foundation.destroy();
  }
  setUnbounded(value: boolean) {
    this.foundation.setUnbounded(value);
  }
}

declare global {
  interface Element {
    // This is not a super great thing to do, adding a new property onto
    // arbitrary elements...
    ripple?: unknown;
  }
}

// NOTE: This is a workaround for
// https://bugs.webkit.org/show_bug.cgi?id=173027. Since keyframes on
// pseudo-elements (:after) are not supported in Shadow DOM, we put the keyframe
// style into the <head> element.
const isSafari = navigator.userAgent.match(/Safari/);
let didApplyRippleStyle = false;
const applyRippleStyle = () => {
  didApplyRippleStyle = true;
  const styleElement = document.createElement('style');
  const part = new NodePart({templateFactory});
  part.appendInto(styleElement);
  part.setValue(style);
  part.commit();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  document.head!.appendChild(styleElement);
};

/**
 * Applied a ripple to the node specified by {surfaceNode}.
 * @param options {RippleNodeOptions}
 */
export const rippleNode = (options: RippleNodeOptions) => {
  if (isSafari && !didApplyRippleStyle) {
    applyRippleStyle();
  }
  // TODO(sorvell): This directive requires bringing css yourself. We probably
  // need to do this because of ShadyCSS, but on Safari, the keyframes styling
  // must be global. Perhaps this directive could fix that.
  const surfaceNode = options.surfaceNode;
  const interactionNode = options.interactionNode || surfaceNode;
  // only style interaction node if not in the same root
  if (interactionNode.getRootNode() !== surfaceNode.getRootNode()) {
    if (interactionNode.style.position === '') {
      interactionNode.style.position = 'relative';
    }
  }
  const adapter: MDCRippleAdapter = {
    browserSupportsCssVars: () => supportsCssVariablesWin,
    isUnbounded: () =>
        options.unbounded === undefined ? true : options.unbounded,
    isSurfaceActive: () => matches(interactionNode, ':active'),
    isSurfaceDisabled: () => Boolean(interactionNode.hasAttribute('disabled')),
    addClass: (className: string) => surfaceNode.classList.add(className),
    removeClass: (className: string) => surfaceNode.classList.remove(className),
    containsEventTarget: (target: HTMLElement) =>
        interactionNode.contains(target),
    registerInteractionHandler:
        <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
            interactionNode.addEventListener(type, handler, applyPassive()),
    deregisterInteractionHandler:
        <K extends EventType>(type: K, handler: SpecificEventListener<K>) =>
            interactionNode.removeEventListener(type, handler, applyPassive()),
    registerDocumentInteractionHandler:
        <K extends EventType>(evtType: K, handler: SpecificEventListener<K>) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.documentElement!.addEventListener(
        evtType, handler, applyPassive()),
    deregisterDocumentInteractionHandler: <K extends EventType>(
        evtType: string, handler: SpecificEventListener<K>) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    document.documentElement!.removeEventListener(
        evtType, handler as EventListenerOrEventListenerObject, applyPassive()),
    registerResizeHandler: (handler: SpecificEventListener<'resize'>) =>
        window.addEventListener('resize', handler),
    deregisterResizeHandler: (handler: SpecificEventListener<'resize'>) =>
        window.removeEventListener('resize', handler),
    updateCssVariable: (varName: string, value: string) =>
        surfaceNode.style.setProperty(varName, value),
    computeBoundingRect: () => surfaceNode.getBoundingClientRect(),
    getWindowPageOffset: () => ({x: window.pageXOffset, y: window.pageYOffset}),
  };
  const rippleFoundation = new MDCRippleFoundation(adapter);
  rippleFoundation.init();
  return new RippleIntermediate(rippleFoundation);
};

const rippleInteractionNodes = new WeakMap();

/**
 * A directive that applies a Material ripple to a part node. The directive
 * should be applied to a PropertyPart.
 * @param options {RippleOptions}
 */
export const ripple =
    directive((options: RippleOptions = {}) => (part: PropertyPart) => {
      const surfaceNode = part.committer.element as HTMLElement;
      const interactionNode = options.interactionNode || surfaceNode;
      let rippleFoundation = part.value as RippleIntermediate | typeof noChange;
      // if the interaction node changes, destroy and invalidate the foundation.
      const existingInteractionNode =
          rippleInteractionNodes.get(rippleFoundation);
      if (existingInteractionNode !== undefined &&
          existingInteractionNode !== interactionNode) {
        (rippleFoundation as RippleIntermediate).destroy();
        rippleFoundation = noChange;
      }
      // make the ripple, if needed
      if (rippleFoundation === noChange) {
        rippleFoundation =
            rippleNode(Object.assign({}, options, {surfaceNode}));
        rippleInteractionNodes.set(rippleFoundation, interactionNode);
        part.setValue(rippleFoundation);
        // otherwise update settings as needed.
      } else {
        if (options.unbounded !== undefined) {
          (rippleFoundation as RippleIntermediate)
              .setUnbounded(options.unbounded);
        }
        if (options.disabled !== undefined) {
          (rippleFoundation as RippleIntermediate)
              .setUnbounded(options.disabled);
        }
      }
      if (options.active === true) {
        (rippleFoundation as RippleIntermediate).startPress();
      } else if (options.active === false) {
        (rippleFoundation as RippleIntermediate).endPress();
      }
    });
