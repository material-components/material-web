/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/**
 * Standard reasons for closing a snackbar.
 */
export const CLOSE_REASONS = {
  ACTION: 'action',
  DISMISS: 'dismiss',
  TIMEOUT: 'timeout',
} as const;

/**
 * Close reason type.
 */
export type CloseReason =
  | (typeof CLOSE_REASONS)[keyof typeof CLOSE_REASONS]
  | string;

/**
 * Snackbar CSS classes.
 */
export const SNACKBAR_CLASSES = {
  snackbar: 'snackbar',
  open: 'snackbar-open',
  opening: 'snackbar-opening',
  closing: 'snackbar-closing',
  fixed: 'snackbar-fixed',
} as const;

/**
 * State provided to `snackbarClasses()`.
 */
export interface SnackbarClassesState {
  open?: boolean;
  opening?: boolean;
  closing?: boolean;
  fixed?: boolean;
}

/**
 * Returns the class map object for the snackbar based on given state.
 */
export function snackbarClasses({
  open = false,
  opening = false,
  closing = false,
  fixed = false,
}: SnackbarClassesState = {}): ClassInfo {
  return {
    [SNACKBAR_CLASSES.snackbar]: true,
    [SNACKBAR_CLASSES.open]: open,
    [SNACKBAR_CLASSES.opening]: opening,
    [SNACKBAR_CLASSES.closing]: closing,
    [SNACKBAR_CLASSES.fixed]: fixed,
  };
}

/**
 * Sets up snackbar accessibility and keydown behavior on an element.
 *
 * @param snackbar The snackbar root element.
 * @param opts Options, supports AbortSignal for cleanup.
 */
export function setupSnackbar(
  snackbar: HTMLElement,
  opts?: {signal?: AbortSignal},
): void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      const el = snackbar as HTMLElement & {
        open?: boolean;
        close?: (reason?: string) => void;
      };
      if (el.open === false) {
        return;
      }
      event.preventDefault();
      if (typeof el.close === 'function') {
        el.close(CLOSE_REASONS.DISMISS);
      } else {
        snackbar.dispatchEvent(
          new CustomEvent('close', {
            bubbles: true,
            cancelable: true,
            detail: {reason: CLOSE_REASONS.DISMISS},
          }),
        );
      }
    }
  };

  snackbar.addEventListener('keydown', handleKeyDown, opts);
}

/**
 * A Lit directive that adds snackbar classes and setup logic to an element.
 */
export const snackbar = createClassMapDirective({
  getClasses: snackbarClasses,
  setupElement: setupSnackbar,
});
