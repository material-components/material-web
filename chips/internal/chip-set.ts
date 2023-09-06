/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, isServer, LitElement, nothing, PropertyValues} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';

import {Chip} from './chip.js';

/**
 * The type of chip a chip set controls.
 */
export type ChipSetType = 'assist'|'suggestion'|'filter'|'input'|'';

/**
 * A chip set component.
 */
export class ChipSet extends LitElement {
  static {
    requestUpdateOnAriaChange(ChipSet);
  }

  get chips() {
    return this.childElements.filter(
        (child): child is Chip => child instanceof Chip);
  }

  @property() accessor type: ChipSetType = '';
  @property({type: Boolean, attribute: 'single-select'}) accessor singleSelect = false;

  @queryAssignedElements()
  private accessor childElements!: HTMLElement[];

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('focusin', this.updateTabIndices.bind(this));
      this.addEventListener('keydown', this.handleKeyDown.bind(this));
      this.addEventListener('selected', this.handleSelected.bind(this));
    }
  }

  protected override updated(changed: PropertyValues<this>) {
    if (changed.has('singleSelect') && this.singleSelect) {
      let hasSelectedChip = false;
      for (const chip of this.chips as MaybeSelectableChip[]) {
        if (chip.selected === true) {
          if (!hasSelectedChip) {
            hasSelectedChip = true;
            continue;
          }

          chip.selected = false;
        }
      }
    }
  }

  protected override render() {
    const {ariaLabel} = this as ARIAMixinStrict;
    const isFilter = this.type === 'filter';
    const role = isFilter ? 'listbox' : 'grid';
    const multiselectable = isFilter ? !this.singleSelect : nothing;
    return html`
      <div class="content"
          role=${role}
          aria-label=${ariaLabel || nothing}
          aria-multiselectable=${multiselectable}>
        <slot @slotchange=${this.updateTabIndices}></slot>
      </div>
    `;
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

    const {chips} = this as {chips: MaybeMultiActionChip[]};
    // Don't try to select another chip if there aren't any.
    if (chips.length < 2) {
      return;
    }

    // Prevent default interactions, such as scrolling.
    event.preventDefault();

    if (isHome || isEnd) {
      const index = isHome ? 0 : chips.length - 1;
      chips[index].focus({trailing: isEnd});
      this.updateTabIndices();
      return;
    }

    // Check if moving forwards or backwards
    const isRtl = getComputedStyle(this).direction === 'rtl';
    const forwards = isRtl ? isLeft || isUp : isRight || isDown;
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

  private handleSelected(event: Event) {
    if (!this.singleSelect) {
      return;
    }

    if ((event.target as MaybeSelectableChip).selected === true) {
      for (const chip of this.chips as MaybeSelectableChip[]) {
        if (chip !== event.target && chip.selected) {
          chip.selected = false;
        }
      }
    }
  }
}

interface MaybeMultiActionChip extends Chip {
  focus(options?: FocusOptions&{trailing?: boolean}): void;
}

interface MaybeSelectableChip extends Chip {
  selected?: boolean;
}
