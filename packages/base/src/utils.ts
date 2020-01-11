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

/**
 * Return an element assigned to a given slot that matches the given selector
 */

import {matches} from '@material/dom/ponyfill';

/**
 * Determines whether a node is an element.
 *
 * @param node Node to check
 */
export const isNodeElement = (node: Node) => {
  return node.nodeType === Node.ELEMENT_NODE;
};

export function findAssignedElement(slot: HTMLSlotElement, selector: string) {
  for (const node of slot.assignedNodes({flatten: true})) {
    if (isNodeElement(node)) {
      const el = (node as HTMLElement);
      if (matches(el, selector)) {
        return el;
      }
    }
  }

  return null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Constructor<T> = new (...args: any[]) => T;

export function addHasRemoveClass(element: HTMLElement) {
  return {
    addClass: (className: string) => {
      element.classList.add(className);
    },
    removeClass: (className: string) => {
      element.classList.remove(className);
    },
    hasClass: (className: string) => element.classList.contains(className),
  };
}

let supportsPassive = false;
const fn = () => { /* empty listener */ };
const optionsBlock: AddEventListenerOptions = {
  get passive() {
    supportsPassive = true;
    return false;
  }
};
document.addEventListener('x', fn, optionsBlock);
document.removeEventListener('x', fn);
/**
 * Do event listeners suport the `passive` option?
 */
export const supportsPassiveEventListener = supportsPassive;

const slotActiveElement = (slot: HTMLSlotElement): Element|null => {
  const assignedElements =
      slot.assignedNodes({flatten: true})
          .filter((node) => isNodeElement(node)) as Element[];

  const first = assignedElements[0];
  if (!first) {
    return null;
  }

  const root = first.getRootNode() as unknown as DocumentOrShadowRoot;
  return root ? root.activeElement : null;
};

export const doesSlotContainElement =
    (slot: HTMLSlotElement, element: Element): boolean => {
      return slot.assignedNodes({flatten: true})
          .filter((node) => isNodeElement(node))
          .reduce((isContained: boolean, assinedElement) => {
            return isContained || assinedElement === element ||
                assinedElement.contains(element);
          }, false);
    };

export const doesSlotContainFocus = (slot: HTMLSlotElement): boolean => {
  const activeElement = slotActiveElement(slot);

  return activeElement ? doesSlotContainElement(slot, activeElement) : false;
};

export const deepActiveElementPath = (doc = window.document): Element[] => {
  let activeElement = doc.activeElement;
  const path: Element[] = [];

  if (!activeElement) {
    return path;
  }

  while (activeElement) {
    path.push(activeElement);
    if (activeElement.shadowRoot) {
      activeElement = activeElement.shadowRoot.activeElement;
    } else {
      break;
    }
  }

  return path;
};
