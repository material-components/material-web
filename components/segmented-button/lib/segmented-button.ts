/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property, query, queryAssignedNodes, state} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {bound} from '../../decorators/bound';

import {SegmentedButtonFoundation, SegmentedButtonSetFoundation} from './foundation';
import {SegmentedButtonSetState, SegmentedButtonState} from './state';

/**
 * SegmentedButton is a web component implementation of the Material Design
 * segmented button component. It is intended **only** for use as a child of a
 * `SementedButtonSet` component. It is **not** intended for use in any other
 * context.
 */
abstract class SegmentedButton extends LitElement implements
    SegmentedButtonState {
  @property({type: Boolean}) disabled = false;
  @property({type: Boolean}) selected = false;
  @property({type: Boolean}) focusable = false;
  @property({type: String}) label = '';
  @state() ariaSelectedValue?: 'true'|'false';
  @query('[role="option"]') option!: HTMLElement;

  abstract readonly isMultiselect: boolean;

  protected foundation = new SegmentedButtonFoundation({
    state: this,
    animateSelection: this.animateSelection.bind(this),
  });

  private async animateSelection(...args: Parameters<Animatable['animate']>) {
    // TODO(b/212476341): Support selection animations.
    const animation = new Animation();
    animation.play();
    return Promise.resolve(animation);
  }

  override update(changedProperties: Map<string, unknown>) {
    super.update(changedProperties);
    if (this.isMultiselect) {
      this.ariaSelectedValue = this.selected ? 'true' : 'false';
    } else {
      this.ariaSelectedValue = this.selected ? 'true' : undefined;
    }
  }

  override render(): TemplateResult {
    return html`
      <button role="option" tabindex="${
        this.focusable ? '0' : '-1'}" aria-selected=${
        ifDefined(this.ariaSelectedValue)} .disabled=${this.disabled}>
        <span aria-hidden="true">${this.selected ? '✔' : ''}</span>
        <span>${this.label ?? ''}</span>
      </button>
    `;
  }

  focusButton() {
    this.option.focus();
  }
}

export class SingleSelectSegmentedButton extends SegmentedButton {
  isMultiselect = false;
}

export class MultiSelectSegmentedButton extends SegmentedButton {
  isMultiselect = true;
}

/**
 * SegmentedButtonSet is the parent component for two or more
 * `SegmentedButton` components. **Only** `SegmentedButton` components may be
 * used as children.
 */
abstract class SegmentedButtonSet extends LitElement implements
    SegmentedButtonSetState {
  abstract isMultiselect: boolean;

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
