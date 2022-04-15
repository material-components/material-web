/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * @requirecss {segmented_button_set.lib.shared_styles}
 */

import {html, LitElement, TemplateResult} from 'lit';
import {queryAssignedElements} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {bound} from '../../decorators/bound';
import {SegmentedButton} from '../../segmented_button/lib/segmented-button';

import {SegmentedButtonSetFoundation} from './foundation';
import {SegmentedButtonSetState} from './state';

/**
 * SegmentedButtonSet is the parent component for two or more
 * `SegmentedButton` components. **Only** `SegmentedButton` components may be
 * used as children.
 */
abstract class SegmentedButtonSet extends LitElement implements
    SegmentedButtonSetState {
  abstract isMultiselect: boolean;

  @queryAssignedElements({flatten: true}) buttons!: SegmentedButton[];

  get isRTL() {
    return window.getComputedStyle(this).direction === 'rtl';
  }

  protected foundation = new SegmentedButtonSetFoundation({
    state: this,
    focusButton:
        (i) => {
          this.buttons[i].focusButton();
        },
  });

  override firstUpdated() {
    this.foundation.firstUpdated();
  }

  @bound
  protected handleClick(e: MouseEvent) {
    this.foundation.handleClick(e);
  }

  @bound
  protected handleKeydown(e: KeyboardEvent) {
    this.foundation.handleKeydown(e);
  }

  @bound
  protected handleFocusIn(e: FocusEvent) {
    this.foundation.handleFocusIn(e);
  }

  override render(): TemplateResult {
    return html`
    <span role="listbox" aria-orientation="horizontal" aria-multiselectable=${
        ifDefined(this.isMultiselect ? 'true' : undefined)}>
      <slot role="presentation" @click=${this.handleClick} @keydown=${
        this.handleKeydown} @focusin=${this.handleFocusIn}></slot>
    </span>
    `;
  }
}

/**
 * SingleSelectSegmentedButtonSet implements the single-select behavior for a
 * group of two or more child segmented buttons.
 */
export class SingleSelectSegmentedButtonSet extends SegmentedButtonSet {
  isMultiselect = false;
}

/**
 * MultiSelectSegmentedButtonSet implements the multi-select behavior for a
 * group of two or more child segmented buttons.
 */
export class MultiSelectSegmentedButtonSet extends SegmentedButtonSet {
  isMultiselect = true;
}
