/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCChipActionFocusBehavior, MDCChipActionType} from '../../action/lib/constants.js';
import {MDCChipAnimation} from '../../chip/lib/constants.js';

import {MDCChipSetAdapter} from './adapter.js';
import {MDCChipSetAttributes, MDCChipSetEvents} from './constants.js';
import {ChipAnimationEvent, ChipInteractionEvent, ChipNavigationEvent, MDCChipSetInteractionEventDetail, MDCChipSetRemovalEventDetail, MDCChipSetSelectionEventDetail} from './types.js';

interface FocusAction {
  action: MDCChipActionType;
  index: number;
}

enum Operator {
  INCREMENT,
  DECREMENT,
}

/**
 * MDCChipSetFoundation provides a foundation for all chips.
 */
export class MDCChipSetFoundation {
  private readonly adapter: MDCChipSetAdapter;

  static get defaultAdapter(): MDCChipSetAdapter {
    return {
      announceMessage: () => undefined,
      emitEvent: () => undefined,
      getAttribute: () => null,
      getChipActionsAtIndex: () => [],
      getChipCount: () => 0,
      getChipIdAtIndex: () => '',
      getChipIndexById: () => 0,
      isChipFocusableAtIndex: () => false,
      isChipSelectableAtIndex: () => false,
      isChipSelectedAtIndex: () => false,
      removeChipAtIndex: () => {},
      setChipFocusAtIndex: () => undefined,
      setChipSelectedAtIndex: () => undefined,
      startChipAnimationAtIndex: () => undefined,
    };
  }

  constructor(adapter?: Partial<MDCChipSetAdapter>) {
    this.adapter = {...MDCChipSetFoundation.defaultAdapter, ...adapter};
  }

  handleChipAnimation({detail}: ChipAnimationEvent) {
    const {
      chipID,
      animation,
      isComplete,
      addedAnnouncement,
      removedAnnouncement
    } = detail;
    const index = this.adapter.getChipIndexById(chipID);

    if (animation === MDCChipAnimation.EXIT && isComplete) {
      if (removedAnnouncement) {
        this.adapter.announceMessage(removedAnnouncement);
      }
      this.removeAfterAnimation(index, chipID);
      return;
    }

    if (animation === MDCChipAnimation.ENTER && isComplete &&
        addedAnnouncement) {
      this.adapter.announceMessage(addedAnnouncement);
      return;
    }
  }

  handleChipInteraction({detail}: ChipInteractionEvent) {
    const {source, chipID, isSelectable, isSelected, shouldRemove} = detail;
    const index = this.adapter.getChipIndexById(chipID);

    if (shouldRemove) {
      this.removeChip(index);
      return;
    }

    this.focusChip(index, source, MDCChipActionFocusBehavior.FOCUSABLE);
    this.adapter.emitEvent<MDCChipSetInteractionEventDetail>(
        MDCChipSetEvents.INTERACTION, {
          chipIndex: index,
          chipID,
        });

    if (isSelectable) {
      this.setSelection(index, source, !isSelected);
    }
  }

  handleChipNavigation({detail}: ChipNavigationEvent) {
    const {chipID, key, isRTL, source} = detail;
    const index = this.adapter.getChipIndexById(chipID);

    const toNextChip =
        (key === 'ArrowRight' && !isRTL) || (key === 'ArrowLeft' && isRTL);
    if (toNextChip) {
      // Start from the next chip so we increment the index
      this.focusNextChipFrom(index + 1);
      return;
    }

    const toPreviousChip =
        (key === 'ArrowLeft' && !isRTL) || (key === 'ArrowRight' && isRTL);
    if (toPreviousChip) {
      // Start from the previous chip so we decrement the index
      this.focusPrevChipFrom(index - 1);
      return;
    }

    if (key === 'ArrowDown') {
      // Start from the next chip so we increment the index
      this.focusNextChipFrom(index + 1, source);
      return;
    }

    if (key === 'ArrowUp') {
      // Start from the previous chip so we decrement the index
      this.focusPrevChipFrom(index - 1, source);
      return;
    }

    if (key === 'Home') {
      this.focusNextChipFrom(0, source);
      return;
    }

    if (key === 'End') {
      this.focusPrevChipFrom(this.adapter.getChipCount() - 1, source);
      return;
    }
  }

  /** Returns the unique selected indexes of the chips. */
  getSelectedChipIndexes(): ReadonlySet<number> {
    const selectedIndexes = new Set<number>();
    const chipCount = this.adapter.getChipCount();
    for (let i = 0; i < chipCount; i++) {
      const actions = this.adapter.getChipActionsAtIndex(i);
      for (const action of actions) {
        if (this.adapter.isChipSelectedAtIndex(i, action)) {
          selectedIndexes.add(i);
        }
      }
    }
    return selectedIndexes;
  }

  /** Sets the selected state of the chip at the given index and action. */
  setChipSelected(
      index: number, action: MDCChipActionType, isSelected: boolean) {
    if (this.adapter.isChipSelectableAtIndex(index, action)) {
      this.setSelection(index, action, isSelected);
    }
  }

  /** Returns the selected state of the chip at the given index and action. */
  isChipSelected(index: number, action: MDCChipActionType): boolean {
    return this.adapter.isChipSelectedAtIndex(index, action);
  }

  /** Removes the chip at the given index. */
  removeChip(index: number) {
    // Early exit if the index is out of bounds
    if (index >= this.adapter.getChipCount() || index < 0) return;
    this.adapter.startChipAnimationAtIndex(index, MDCChipAnimation.EXIT);
    this.adapter.emitEvent<MDCChipSetRemovalEventDetail>(
        MDCChipSetEvents.REMOVAL, {
          chipID: this.adapter.getChipIdAtIndex(index),
          chipIndex: index,
          isComplete: false,
        });
  }

  addChip(index: number) {
    // Early exit if the index is out of bounds
    if (index >= this.adapter.getChipCount() || index < 0) return;
    this.adapter.startChipAnimationAtIndex(index, MDCChipAnimation.ENTER);
  }

  /**
   * Increments to find the first focusable chip.
   */
  private focusNextChipFrom(
      startIndex: number, targetAction?: MDCChipActionType) {
    const chipCount = this.adapter.getChipCount();
    for (let i = startIndex; i < chipCount; i++) {
      const focusableAction =
          this.getFocusableAction(i, Operator.INCREMENT, targetAction);
      if (focusableAction) {
        this.focusChip(
            i, focusableAction,
            MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
        return;
      }
    }
  }

  /**
   * Decrements to find the first focusable chip. Takes an optional target
   * action that can be used to focus the first matching focusable action.
   */
  private focusPrevChipFrom(
      startIndex: number, targetAction?: MDCChipActionType) {
    for (let i = startIndex; i > -1; i--) {
      const focusableAction =
          this.getFocusableAction(i, Operator.DECREMENT, targetAction);
      if (focusableAction) {
        this.focusChip(
            i, focusableAction,
            MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
        return;
      }
    }
  }

  /** Returns the appropriate focusable action, or null if none exist. */
  private getFocusableAction(
      index: number, op: Operator,
      targetAction?: MDCChipActionType): MDCChipActionType|null {
    const actions = this.adapter.getChipActionsAtIndex(index);
    // Reverse the actions if decrementing
    if (op === Operator.DECREMENT) actions.reverse();

    if (targetAction) {
      return this.getMatchingFocusableAction(index, actions, targetAction);
    }

    return this.getFirstFocusableAction(index, actions);
  }

  /**
   * Returs the first focusable action, regardless of type, or null if no
   * focusable actions exist.
   */
  private getFirstFocusableAction(index: number, actions: MDCChipActionType[]):
      MDCChipActionType|null {
    for (const action of actions) {
      if (this.adapter.isChipFocusableAtIndex(index, action)) {
        return action;
      }
    }
    return null;
  }

  /**
   * If the actions contain a focusable action that matches the target action,
   * return that. Otherwise, return the first focusable action, or null if no
   * focusable action exists.
   */
  private getMatchingFocusableAction(
      index: number, actions: MDCChipActionType[],
      targetAction: MDCChipActionType): MDCChipActionType|null {
    let focusableAction = null;
    for (const action of actions) {
      if (this.adapter.isChipFocusableAtIndex(index, action)) {
        focusableAction = action;
      }

      // Exit and return the focusable action if it matches the target
      if (focusableAction === targetAction) {
        return focusableAction;
      }
    }
    return focusableAction;
  }

  private focusChip(
      index: number, action: MDCChipActionType,
      focus: MDCChipActionFocusBehavior) {
    this.adapter.setChipFocusAtIndex(index, action, focus);
    const chipCount = this.adapter.getChipCount();
    for (let i = 0; i < chipCount; i++) {
      const actions = this.adapter.getChipActionsAtIndex(i);
      for (const chipAction of actions) {
        // Skip the action and index provided since we set it above
        if (chipAction === action && i === index) continue;
        this.adapter.setChipFocusAtIndex(
            i, chipAction, MDCChipActionFocusBehavior.NOT_FOCUSABLE);
      }
    }
  }

  private supportsMultiSelect(): boolean {
    return this.adapter.getAttribute(
               MDCChipSetAttributes.ARIA_MULTISELECTABLE) === 'true';
  }

  private setSelection(
      index: number, action: MDCChipActionType, isSelected: boolean) {
    this.adapter.setChipSelectedAtIndex(index, action, isSelected);
    this.adapter.emitEvent<MDCChipSetSelectionEventDetail>(
        MDCChipSetEvents.SELECTION, {
          chipID: this.adapter.getChipIdAtIndex(index),
          chipIndex: index,
          isSelected,
        });
    // Early exit if we support multi-selection
    if (this.supportsMultiSelect()) {
      return;
    }

    // If we get here, we ony support single selection. This means we need to
    // unselect all chips
    const chipCount = this.adapter.getChipCount();
    for (let i = 0; i < chipCount; i++) {
      const actions = this.adapter.getChipActionsAtIndex(i);
      for (const chipAction of actions) {
        // Skip the action and index provided since we set it above
        if (chipAction === action && i === index) continue;
        this.adapter.setChipSelectedAtIndex(i, chipAction, false);
      }
    }
  }

  private removeAfterAnimation(index: number, chipID: string) {
    this.adapter.removeChipAtIndex(index);
    this.adapter.emitEvent<MDCChipSetRemovalEventDetail>(
        MDCChipSetEvents.REMOVAL, {
          chipIndex: index,
          isComplete: true,
          chipID,
        });

    const chipCount = this.adapter.getChipCount();
    // Early exit if we have an empty chip set
    if (chipCount <= 0) return;
    this.focusNearestFocusableAction(index);
  }

  /**
   * Find the first focusable action by moving bidirectionally horizontally
   * from the start index.
   *
   * Given chip set [A, B, C, D, E, F, G]...
   * Let's say we remove chip "F". We don't know where the nearest focusable
   * action is since any of them could be disabled. The nearest focusable
   * action could be E, it could be G, it could even be A. To find it, we
   * start from the source index (5 for "F" in this case) and move out
   * horizontally, checking each chip at each index.
   *
   */
  private focusNearestFocusableAction(index: number) {
    const chipCount = this.adapter.getChipCount();
    let decrIndex = index;
    let incrIndex = index;
    while (decrIndex > -1 || incrIndex < chipCount) {
      const focusAction = this.getNearestFocusableAction(
          decrIndex, incrIndex, MDCChipActionType.TRAILING);
      if (focusAction) {
        this.focusChip(
            focusAction.index, focusAction.action,
            MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
        return;
      }

      decrIndex--;
      incrIndex++;
    }
  }

  private getNearestFocusableAction(
      decrIndex: number, incrIndex: number,
      actionType?: MDCChipActionType): FocusAction|null {
    const decrAction =
        this.getFocusableAction(decrIndex, Operator.DECREMENT, actionType);
    if (decrAction) {
      return {
        index: decrIndex,
        action: decrAction,
      };
    }

    // Early exit if the incremented and decremented indices are identical
    if (incrIndex === decrIndex) return null;

    const incrAction =
        this.getFocusableAction(incrIndex, Operator.INCREMENT, actionType);
    if (incrAction) {
      return {
        index: incrIndex,
        action: incrAction,
      };
    }

    return null;
  }
}
