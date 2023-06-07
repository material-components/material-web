/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, isServer, LitElement} from 'lit';
import {queryAssignedElements} from 'lit/decorators.js';

import {Chip} from './chip.js';

/**
 * A chip set component.
 */
export class ChipSet extends LitElement {
  get chips() {
    return this.childElements.filter(
        (child): child is MaybeMultiActionChip => child instanceof Chip);
  }

  @queryAssignedElements({flatten: true})
  private readonly childElements!: HTMLElement[];

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('focusin', this.updateTabIndices.bind(this));
      this.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
  }

  protected override render() {
    return html`<slot @slotchange=${this.updateTabIndices}></slot>`;
  }

  private handleKeyDown(event: KeyboardEvent) {
    const isDown = event.key === 'ArrowDown';
    const isUp = event.key === 'ArrowUp';
    const isLeft = event.key === 'ArrowLeft';
    const isRight = event.key === 'ArrowRight';
    const isHome = event.key === 'Home';
    const isEnd = event.key === 'End';
    // Ignore non-navigation keys
    if (!isLeft && !isRight && !isDown && !isUp && !isHome && !isEnd) {
      return;
    }

    // Prevent default interactions, such as scrolling.
    event.preventDefault();

    const {chips} = this;
    // Don't try to select another chip if there aren't any.
    if (chips.length < 2) {
      return;
    }

    if (isHome || isEnd) {
      const index = isHome ? 0 : chips.length - 1;
      chips[index].focus({trailing: isEnd});
      this.updateTabIndices();
      return;
    }

    // Check if moving forwards or backwards
    const isRtl = getComputedStyle(this).direction === 'rtl';
    const forwards = isRtl ? isLeft || isDown : isRight || isDown;
    const focusedChip = chips.find(chip => chip.matches(':focus-within'));
    if (!focusedChip) {
      // If there is not already a chip focused, select the first or last chip
      // based on the direction we're traveling.
      const nextChip = forwards ? chips[0] : chips[chips.length - 1];
      nextChip.focus({trailing: !forwards});
      this.updateTabIndices();
      return;
    }

    const currentIndex = chips.indexOf(focusedChip);
    let nextIndex = forwards ? currentIndex + 1 : currentIndex - 1;
    // Search for the next sibling that is not disabled to select.
    // If we return to the host index, there is nothing to select.
    while (nextIndex !== currentIndex) {
      if (nextIndex >= chips.length) {
        // Return to start if moving past the last item.
        nextIndex = 0;
      } else if (nextIndex < 0) {
        // Go to end if moving before the first item.
        nextIndex = chips.length - 1;
      }

      // Check if the next sibling is disabled. If so,
      // move the index and continue searching.
      const nextChip = chips[nextIndex];
      if (nextChip.disabled) {
        if (forwards) {
          nextIndex++;
        } else {
          nextIndex--;
        }

        continue;
      }

      nextChip.focus({trailing: !forwards});
      this.updateTabIndices();
      break;
    }
  }

  private updateTabIndices() {
    const {chips} = this;
    let hasFocusedChip = false;
    for (const chip of chips) {
      if (chip.matches(':focus-within')) {
        chip.removeAttribute('tabindex');
        hasFocusedChip = true;
      } else {
        chip.tabIndex = -1;
      }
    }

    if (!hasFocusedChip) {
      chips[0]?.removeAttribute('tabindex');
    }
  }
}

interface MaybeMultiActionChip extends Chip {
  focus(options?: FocusOptions&{trailing?: boolean}): void;
}
