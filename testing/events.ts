/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Adds an event listener for `eventName` on the given element.
 * @return Promise that resolves when `eventName` has been fired on the element.
 */
export function listenOnce(
    element: HTMLElement, eventName: string): Promise<CustomEvent> {
  return new Promise((res) => {
    const listener = (e: CustomEvent) => {
      element.removeEventListener(eventName, listener as EventListener);
      res(e);
    };

    element.addEventListener(eventName, listener as EventListener);
  });
}