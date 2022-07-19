/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

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
