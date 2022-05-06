/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * @requirecss {segmented_button_set.lib.shared_styles}
 */

import {html, LitElement, TemplateResult} from 'lit';
import {queryAssignedElements} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {bound} from '../../decorators/bound.js';
import {SegmentedButton} from '../../segmented_button/lib/segmented-button.js';

import {SegmentedButtonSetFoundation} from './foundation.js';
import {SegmentedButtonSetState} from './state.js';

/**
 * SegmentedButtonSet is the parent component for two or more
 * `SegmentedButton` components. **Only** `SegmentedButton` components may be
 * used as children.
 * @soyCompatible
 */
export abstract class SegmentedButtonSet extends LitElement implements
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

  /** @soyTemplate */
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
