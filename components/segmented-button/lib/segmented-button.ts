/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {ifDefined} from 'lit/directives/if-defined';

import {SegmentedButtonFoundation} from './foundation';
import {SegmentedButtonState} from './state';

/**
 * SegmentedButton is a web component implementation of the Material Design
 * segmented button component. It is intended **only** for use as a child of a
 * `SementedButtonSet` component. It is **not** intended for use in any other
 * context.
 */
export abstract class SegmentedButton extends LitElement implements
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
