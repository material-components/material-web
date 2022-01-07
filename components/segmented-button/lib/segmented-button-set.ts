/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {queryAssignedNodes} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {bound} from '../../decorators/bound';

import {SegmentedButtonSetFoundation} from './foundation';
import {SegmentedButton} from './segmented-button';
import {SegmentedButtonSetState} from './state';

/** @soyCompatible */
export abstract class SegmentedButtonSet extends LitElement implements
    SegmentedButtonSetState {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  abstract readonly isMultiselect: boolean;

  @queryAssignedNodes('', true, '*') buttons!: SegmentedButton[];

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
  protected override render(): TemplateResult {
    return html`
    <span role="listbox" aria-orientation="horizontal" aria-multiselectable=${
        ifDefined(this.isMultiselect ? 'true' : undefined)}>
      <slot role="presentation" @click=${this.handleClick} @keydown=${
        this.handleKeydown} @focusin=${this.handleFocusIn}></slot>
    </span>
    `;
  }
}