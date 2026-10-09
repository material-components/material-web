/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';
import {createClassMapDirective} from '../shared/directives.js';

/** Sheet position configuration types. */
export type SheetPosition = 'side' | 'bottom' | 'floating';

/** Sheet position configurations. */
export const SHEET_POSITIONS = {
  side: 'side',
  bottom: 'bottom',
  floating: 'floating',
} as const;

/** Dismissal reason for sheet closure. */
export type SheetCloseReason =
  | 'close-button'
  | 'back-button'
  | 'escape'
  | 'scrim'
  | 'drag';

/** Sheet class name constants. */
export const SHEET_CLASSES = {
  sheet: 'sheet',
  sheetSide: 'sheet-side',
  sheetBottom: 'sheet-bottom',
  sheetFloating: 'sheet-floating',
  sheetModal: 'sheet-modal',
  sheetDetached: 'sheet-detached',
  sheetWithDragHandle: 'sheet-with-drag-handle',
  sheetExpanded: 'sheet-expanded',
  sheetOpen: 'sheet-open',
  sheetDivideActionButtons: 'sheet-divide-action-buttons',
} as const;

/** The state provided to the `sheetClasses()` function. */
export interface SheetClassesState {
  /** The position / presentation style of the sheet. */
  position?: SheetPosition;
  /** Whether the sheet is modal (renders scrim overlay and traps focus). */
  modal?: boolean;
  /** Whether the sheet is detached with margins (side sheet only). */
  detached?: boolean;
  /** Whether the bottom sheet has a drag handle (rounds top corners). */
  hasDragHandle?: boolean;
  /** Alias for `hasDragHandle`. */
  dragHandle?: boolean;
  /** Whether the bottom sheet is expanded to full height. */
  expanded?: boolean;
  /** Whether the sheet is currently open and visible. */
  open?: boolean;
  /** Whether dividing borders are rendered between body and actions. */
  divideActionButtons?: boolean;
}

/**
 * Returns sheet classes to apply based on the given state.
 */
export function sheetClasses({
  position = SHEET_POSITIONS.side,
  modal = false,
  detached = false,
  hasDragHandle,
  dragHandle = false,
  expanded = false,
  open = false,
  divideActionButtons = false,
}: SheetClassesState = {}): ClassInfo {
  const isSide = position === SHEET_POSITIONS.side || !position;
  const isBottom = position === SHEET_POSITIONS.bottom;
  const isFloating = position === SHEET_POSITIONS.floating;
  const withDragHandle = Boolean(hasDragHandle ?? dragHandle);

  return {
    [SHEET_CLASSES.sheet]: true,
    [SHEET_CLASSES.sheetSide]: isSide,
    [SHEET_CLASSES.sheetBottom]: isBottom,
    [SHEET_CLASSES.sheetFloating]: isFloating,
    [SHEET_CLASSES.sheetModal]: Boolean(modal),
    [SHEET_CLASSES.sheetDetached]: isSide && Boolean(detached),
    [SHEET_CLASSES.sheetWithDragHandle]: isBottom && withDragHandle,
    [SHEET_CLASSES.sheetExpanded]: isBottom && Boolean(expanded),
    [SHEET_CLASSES.sheetOpen]: Boolean(open),
    [SHEET_CLASSES.sheetDivideActionButtons]: Boolean(divideActionButtons),
  };
}

/** Configuration options for `setupSheet()`. */
export interface SheetOptions {
  /** AbortSignal for automatic cleanup of registered event listeners. */
  signal?: AbortSignal;
  /** Whether pressing the Escape key dismisses the sheet. Defaults to true. */
  closeOnEscape?: boolean;
  /** Whether clicking the backdrop scrim dismisses the sheet. Defaults to true. */
  closeOnScrimClick?: boolean;
  /** Callback invoked when the sheet requests closure. */
  onClose?: (reason: SheetCloseReason) => void;
  /** Callback invoked when the drag handle is activated via click, Enter, or Space. */
  onDragHandleActivate?: () => void;
  /** Callback invoked when the back button is clicked. */
  onBack?: (event: CustomEvent<void>) => void;
}
/** CSS selector matching natively focusable HTML elements and interactive controls. */
export const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable]',
].join(',');

/** Returns whether an element is visible and interactive for focus trapping. */
export function isElementFocusable(el: HTMLElement): boolean {
  return (
    el.matches(FOCUSABLE_SELECTOR) &&
    !el.hasAttribute('disabled') &&
    el.getAttribute('aria-hidden') !== 'true' &&
    getComputedStyle(el).display !== 'none'
  );
}

/** Returns the deepest active element across open Shadow DOM boundaries. */
export function getDeepActiveElement(): HTMLElement | null {
  let active = document.activeElement as HTMLElement | null;
  while (active?.shadowRoot?.activeElement) {
    active = active.shadowRoot.activeElement as HTMLElement;
  }
  return active;
}

/**
 * Returns focusable descendants within an element or shadow root,
 * recursively traversing open shadow roots.
 */
export function getFocusableElements(
  root: HTMLElement | ShadowRoot,
): HTMLElement[] {
  const results: HTMLElement[] = [];
  if (root instanceof HTMLElement) {
    if (
      root.hasAttribute('disabled') ||
      root.getAttribute('aria-hidden') === 'true' ||
      getComputedStyle(root).display === 'none'
    ) {
      return results;
    }
    if (isElementFocusable(root)) {
      results.push(root);
      return results;
    }
    if (root.shadowRoot) {
      results.push(...getFocusableElements(root.shadowRoot));
    }
  }
  for (const child of Array.from(root.children)) {
    if (child instanceof HTMLElement) {
      results.push(...getFocusableElements(child));
    }
  }
  return results;
}

/** Wraps Tab and Shift+Tab focus within the provided focusable elements list. */
export function trapTabFocus(
  event: KeyboardEvent,
  focusables: HTMLElement[],
): void {
  if (focusables.length === 0) {
    event.preventDefault();
    return;
  }
  const active = getDeepActiveElement();
  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const isInside = active !== null && focusables.includes(active);

  if (event.shiftKey) {
    if (active === first || !isInside) {
      event.preventDefault();
      last.focus({preventScroll: true});
    }
  } else if (active === last || !isInside) {
    event.preventDefault();
    first.focus({preventScroll: true});
  }
}

/** Minimum pointer movement in pixels to distinguish a drag from a tap. */
const DRAG_SLOP_PX = 5;

/** Clamped minimum height of the bottom sheet during interactive drag. */
const MIN_SHEET_DRAG_HEIGHT_PX = 120;

/** Upward vertical drag delta in pixels required to trigger sheet expansion. */
const EXPAND_DRAG_DELTA_PX = -30;

/** Downward vertical drag delta in pixels required to trigger sheet collapse. */
const COLLAPSE_DRAG_DELTA_PX = 30;

/** Downward vertical drag delta in pixels required to dismiss a collapsed sheet. */
const DISMISS_DRAG_DELTA_PX = 60;

/** Options for starting an interactive bottom sheet drag gesture. */
export interface SheetDragGestureOptions {
  event: PointerEvent;
  surface: HTMLElement;
  isExpanded: () => boolean;
  onDragStart?: () => void;
  onExpand: () => void;
  onCollapse: () => void;
  onDismiss: () => void;
}

/**
 * Starts tracking a pointer drag gesture on a bottom sheet surface and returns
 * a cleanup callback to detach active window listeners.
 */
export function startSheetDragGesture({
  event,
  surface,
  isExpanded,
  onDragStart,
  onExpand,
  onCollapse,
  onDismiss,
}: SheetDragGestureOptions): () => void {
  if (event.button !== 0) return () => {};

  const startY = event.clientY;
  const startHeight = surface.getBoundingClientRect().height;
  let isDragging = false;

  const handlePointerMove = (moveEvent: PointerEvent) => {
    const deltaY = moveEvent.clientY - startY;
    if (!isDragging && Math.abs(deltaY) > DRAG_SLOP_PX) {
      isDragging = true;
      onDragStart?.();
    }
    if (isDragging) {
      const nextHeight = Math.max(
        MIN_SHEET_DRAG_HEIGHT_PX,
        startHeight - deltaY,
      );
      surface.style.blockSize = `${nextHeight}px`;
      surface.style.transition = 'none';
    }
  };

  const cleanup = () => {
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
    window.removeEventListener('pointercancel', handlePointerUp);
    surface.style.blockSize = '';
    surface.style.transition = '';
  };

  const handlePointerUp = (upEvent: PointerEvent) => {
    cleanup();
    if (!isDragging) return;
    isDragging = false;

    const deltaY = upEvent.clientY - startY;
    if (deltaY < EXPAND_DRAG_DELTA_PX) {
      onExpand();
    } else if (deltaY > COLLAPSE_DRAG_DELTA_PX) {
      if (isExpanded()) {
        onCollapse();
      } else if (deltaY > DISMISS_DRAG_DELTA_PX) {
        onDismiss();
      }
    }
  };

  window.addEventListener('pointermove', handlePointerMove);
  window.addEventListener('pointerup', handlePointerUp);
  window.addEventListener('pointercancel', handlePointerUp);

  return cleanup;
}

/**
 * Sets up standard DOM interaction listeners on a sheet element.
 */
export function setupSheet(
  element: HTMLElement,
  opts?: SheetOptions,
): () => void {
  const signal = opts?.signal;
  if (signal?.aborted) return () => {};

  let suppressNextDragClick = false;
  let cleanupActiveDrag: (() => void) | null = null;

  const triggerClose = (reason: SheetCloseReason) => {
    element.classList.remove(SHEET_CLASSES.sheetExpanded);
    element.dispatchEvent(
      new CustomEvent<{reason: SheetCloseReason}>('sheet-close', {
        bubbles: true,
        composed: true,
        detail: {reason},
      }),
    );
    element.classList.remove(SHEET_CLASSES.sheetOpen);
    opts?.onClose?.(reason);
  };

  const dispatchDragActivate = () => {
    element.dispatchEvent(
      new CustomEvent('sheet-drag-handle-activate', {
        bubbles: true,
        composed: true,
      }),
    );
    opts?.onDragHandleActivate?.();
  };

  const triggerDragHandleActivate = () => {
    element.classList.toggle(SHEET_CLASSES.sheetExpanded);
    dispatchDragActivate();
  };

  const handleKeydown = (event: KeyboardEvent) => {
    if (!element.classList.contains(SHEET_CLASSES.sheetOpen)) return;

    if (event.key === 'Escape' && opts?.closeOnEscape !== false) {
      triggerClose('escape');
      return;
    }

    if (
      event.key === 'Tab' &&
      element.classList.contains(SHEET_CLASSES.sheetModal)
    ) {
      const focusables = getFocusableElements(element);
      trapTabFocus(event, focusables);
    }
  };

  const handleClick = (event: MouseEvent) => {
    if (!element.classList.contains(SHEET_CLASSES.sheetOpen)) return;

    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.closest('.sheet-back')) {
      const backEvent = new CustomEvent<void>('sheet-back', {
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      element.dispatchEvent(backEvent);
      opts?.onBack?.(backEvent);
      if (!backEvent.defaultPrevented) {
        triggerClose('back-button');
      }
      return;
    }

    if (target.closest('.sheet-close')) {
      triggerClose('close-button');
      return;
    }

    if (target.closest('.sheet-scrim')) {
      if (opts?.closeOnScrimClick !== false) {
        triggerClose('scrim');
      }
      return;
    }

    if (target.closest('.sheet-drag-handle')) {
      if (suppressNextDragClick) {
        suppressNextDragClick = false;
        return;
      }
      triggerDragHandleActivate();
      return;
    }
  };

  const handleDragHandleKeydown = (event: KeyboardEvent) => {
    if (!element.classList.contains(SHEET_CLASSES.sheetOpen)) return;

    const target = event.target as HTMLElement | null;
    const dragHandle = target?.closest('.sheet-drag-handle');
    if (!dragHandle || dragHandle instanceof HTMLButtonElement) return;

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      triggerDragHandleActivate();
    }
  };

  const handlePointerDown = (event: PointerEvent) => {
    if (!element.classList.contains(SHEET_CLASSES.sheetOpen)) return;
    if (event.button !== 0) return;
    const target = event.target as HTMLElement | null;
    const dragHandle = target?.closest<HTMLElement>('.sheet-drag-handle');
    if (!dragHandle) return;

    cleanupActiveDrag?.();
    suppressNextDragClick = false;
    cleanupActiveDrag = startSheetDragGesture({
      event,
      surface: element,
      isExpanded: () => element.classList.contains(SHEET_CLASSES.sheetExpanded),
      onDragStart: () => {
        suppressNextDragClick = true;
      },
      onExpand: () => {
        element.classList.add(SHEET_CLASSES.sheetExpanded);
        dispatchDragActivate();
      },
      onCollapse: () => {
        element.classList.remove(SHEET_CLASSES.sheetExpanded);
        dispatchDragActivate();
      },
      onDismiss: () => {
        triggerClose('drag');
      },
    });
  };

  const handleParentClick = (event: MouseEvent) => {
    if (!element.classList.contains(SHEET_CLASSES.sheetOpen)) return;
    const target = event.target as HTMLElement | null;
    const scrim = target?.closest('.sheet-scrim');
    if (scrim && scrim.parentElement === element.parentElement) {
      if (opts?.closeOnScrimClick !== false) {
        triggerClose('scrim');
      }
    }
  };

  element.addEventListener('keydown', handleKeydown);
  element.addEventListener('click', handleClick);
  element.addEventListener('keydown', handleDragHandleKeydown);
  element.addEventListener('pointerdown', handlePointerDown);
  const parentEl = element.parentElement;
  parentEl?.addEventListener('click', handleParentClick);

  const cleanup = () => {
    cleanupActiveDrag?.();
    cleanupActiveDrag = null;
    element.removeEventListener('keydown', handleKeydown);
    element.removeEventListener('click', handleClick);
    element.removeEventListener('keydown', handleDragHandleKeydown);
    element.removeEventListener('pointerdown', handlePointerDown);
    parentEl?.removeEventListener('click', handleParentClick);
  };

  if (signal) {
    signal.addEventListener('abort', cleanup, {once: true});
  }

  return cleanup;
}

/**
 * Lit directive for sheet class styling and standard DOM lifecycle setup.
 *
 * @example
 * ```ts
 * html`<div class="${sheet({position: 'bottom', modal: true, open: true})}">
 *   ...
 * </div>`;
 * ```
 */
export const sheet = createClassMapDirective<SheetClassesState>({
  getClasses: sheetClasses,
  setupElement: (element, opts) => {
    setupSheet(element, opts);
  },
});
