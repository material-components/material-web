/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {type ClassInfo} from 'lit/directives/class-map.js';

import {createElementDirective} from './directives.js';
import {updateClassList} from './update-class-list.js';

/** CSS classes applied to visual effects elements and slots. */
export const FX_CLASSES = {
  playing: 'fx-playing',
} as const;

/**
 * A snapshot of a visual effects element's state.
 *
 * Each field must define how `setupFxSlot()` combines it across multiple
 * slotted fx elements (`playing` is `true` if any slotted fx element plays).
 */
export interface FxState {
  playing?: boolean;
}

/** Returns the `.fx-*` classes for a visual effects state. */
export function fxClasses({playing = false}: FxState = {}): ClassInfo {
  return {
    [FX_CLASSES.playing]: playing,
  };
}

/** Options for `FxChangeEvent`. */
export interface FxChangeEventInit extends EventInit, FxState {}

/**
 * Event dispatched by visual effects elements when their state changes.
 */
export class FxChangeEvent extends Event implements Required<FxState> {
  static readonly type = 'fx-change';
  readonly playing: boolean;

  constructor(opts?: FxChangeEventInit) {
    super(FxChangeEvent.type, {bubbles: true, composed: true, ...opts});
    this.playing = opts?.playing ?? false;
  }
}

declare global {
  interface HTMLElementEventMap {
    'fx-change': FxChangeEvent;
  }
}

/**
 * Updates a visual effects element's `.fx-*` classes and dispatches an
 * `FxChangeEvent` when its state changes.
 *
 * Visual effects elements own their playback state machine and call this
 * function with a state snapshot whenever that state may have changed.
 */
export function updateFxElement(element: HTMLElement, state: FxState) {
  const wasPlaying = element.classList.contains(FX_CLASSES.playing);
  const isPlaying = state.playing ?? false;
  updateClassList(element, fxClasses({playing: isPlaying}));
  if (isPlaying !== wasPlaying) {
    element.dispatchEvent(new FxChangeEvent({playing: isPlaying}));
  }
}

/**
 * Mirrors the `.fx-*` classes of assigned visual effects elements onto a
 * `<slot>`, so shadow stylesheets can match `:has(.fx-playing)` across the
 * slot boundary.
 */
export function setupFxSlot(element: HTMLElement, opts: {signal: AbortSignal}) {
  if (!(element instanceof HTMLSlotElement)) {
    throw new Error('fxSlot() must be used on a <slot> element.');
  }

  const slot = element;
  const playingTargets = new Set<EventTarget>();
  const syncClasses = () => {
    for (const target of playingTargets) {
      if (
        !(target instanceof Element) ||
        !target.isConnected ||
        !target.classList.contains(FX_CLASSES.playing)
      ) {
        playingTargets.delete(target);
      }
    }
    updateClassList(slot, fxClasses({playing: playingTargets.size > 0}));
  };
  // Re-check assigned elements on 'slotchange', since a removed fx element
  // dispatches its final `FxChangeEvent` after it is no longer slotted.
  const syncAssignedElements = () => {
    playingTargets.clear();
    for (const el of slot.assignedElements({flatten: true})) {
      if (el.matches(`.${FX_CLASSES.playing}`)) {
        playingTargets.add(el);
      }
      for (const child of el.querySelectorAll(`.${FX_CLASSES.playing}`)) {
        playingTargets.add(child);
      }
    }
    syncClasses();
  };

  syncAssignedElements();
  slot.addEventListener('slotchange', syncAssignedElements, opts);
  slot.addEventListener(
    FxChangeEvent.type,
    (event) => {
      if (!event.target) return;
      if (event.playing) {
        playingTargets.add(event.target);
      } else {
        playingTargets.delete(event.target);
      }
      syncClasses();
    },
    opts,
  );
}

/**
 * Mirrors the `.fx-*` classes of assigned visual effects elements onto a
 * `<slot>`.
 *
 * @example
 * ```ts
 * html`<slot name="container" ${hasSlotted()} ${fxSlot()}></slot>`;
 * ```
 */
export const fxSlot = createElementDirective(setupFxSlot);
