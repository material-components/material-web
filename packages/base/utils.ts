/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Determines whether a node is an element.
 *
 * @param node Node to check
 */
export const isNodeElement = (node: Node): node is Element => {
  return node.nodeType === Node.ELEMENT_NODE;
};

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

export const doesElementContainFocus = (element: HTMLElement): boolean => {
  const activePath = deepActiveElementPath();

  if (!activePath.length) {
    return false;
  }

  const deepActiveElement = activePath[activePath.length - 1];
  const focusEv =
      new Event('check-if-focused', {bubbles: true, composed: true});
  let composedPath: EventTarget[] = [];
  const listener = (ev: Event) => {
    composedPath = ev.composedPath();
  };

  document.body.addEventListener('check-if-focused', listener);
  deepActiveElement.dispatchEvent(focusEv);
  document.body.removeEventListener('check-if-focused', listener);

  return composedPath.indexOf(element) !== -1;
};

export interface RippleInterface {
  startPress: (e?: Event) => void;
  endPress: () => void;
  startFocus: () => void;
  endFocus: () => void;
  startHover: () => void;
  endHover: () => void;
}
