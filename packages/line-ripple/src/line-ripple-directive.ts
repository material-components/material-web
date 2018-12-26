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
import { directive, PropertyPart, noChange } from 'lit-html';
import { Adapter, Foundation } from '@material/mwc-base/base-element.js';
import MDCLineRippleFoundation from '@material/line-ripple/foundation.js';
// import {style} from './mwc-ripple-global-css.js';

export interface LineRippleOptions {
  rootNode?: HTMLElement;
  disabled?: boolean;
  active?: boolean;
}

export interface LineRippleNodeOptions extends LineRippleOptions {
  rootNode: HTMLElement;
}

export interface LineRippleFoundation extends Foundation {
  activate(): void;
  deactivate(): void;
}

export declare var LineRippleFoundation: {
  prototype: LineRippleFoundation;
  new(adapter: Adapter): LineRippleFoundation;
}

/**
 * Applied a line ripple to the node specified by {rootNode}.
 * @param options {RippleNodeOptions}
 */
export const lineRippleNode = (options: LineRippleNodeOptions) => {
  // TODO(sorvell): This directive requires bringing css yourself. We probably need to do this
  // because of ShadyCSS, but on Safari, the keyframes styling must be global. Perhaps this
  // directive could fix that.
  const rootNode = options.rootNode;

  const adapter: Adapter = {
    addClass: (className: string) => rootNode.classList.add(className),
    removeClass: (className: string) =>
      rootNode.classList.remove(className),
    hasClass: (className: string) => rootNode.classList.contains(className),
    registerEventHandler: (type: string, handler: EventListener) => {
      rootNode.addEventListener(type, handler);
    },
    deregisterEventHandler: (type: string, handler: EventListener) => {
      rootNode.removeEventListener(type, handler);
    }
  };
  const rippleFoundation: LineRippleFoundation = new MDCLineRippleFoundation(adapter);
  rippleFoundation.init();
  return rippleFoundation;
}

const rippleInteractionNodes = new WeakMap();

/**
 * A directive that applies a Material line ripple to a part node. The directive
 * should be applied to a PropertyPart.
 * @param options {RippleOptions}
 */
export const lineRipple = directive((options: LineRippleOptions = {}) => (part: PropertyPart) => {
  const rootNode = part.committer.element as HTMLElement;
  const interactionNode = rootNode;
  let rippleFoundation = part.value;

  // if the interaction node changes, destroy and invalidate the foundation.
  const existingInteractionNode = rippleInteractionNodes.get(rippleFoundation);
  if (existingInteractionNode !== undefined && existingInteractionNode !== interactionNode) {
    rippleFoundation.destroy();
    rippleFoundation = noChange;
  }
  // make the ripple, if needed
  if (rippleFoundation === noChange) {
    rippleFoundation = lineRippleNode(Object.assign({}, options, { rootNode }));
    rippleInteractionNodes.set(rippleFoundation, interactionNode);
    part.setValue(rippleFoundation);
  }

  if (options.active === true) {
    rippleFoundation.activate();
  } else if (options.active === false) {
    rippleFoundation.deactivate();
  }
});
