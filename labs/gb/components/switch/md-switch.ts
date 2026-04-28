/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {redispatchEvent} from '../../../../internal/events/redispatch-event.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../../behaviors/constraint-validation.js';
import {
  hasState,
  mixinCustomStateSet,
  toggleState,
} from '../../../behaviors/custom-state-set.js';
import {mixinElementInternals} from '../../../behaviors/element-internals.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '../../../behaviors/form-associated.js';
import {CheckboxValidator} from '../../../behaviors/validators/checkbox-validator.js';
import {hasSlotted} from '../shared/has-slotted.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import switchStyles from './switch.css' with {type: 'css'}; // github-only
// import switchStyles from './switch.cssresult.js'; // google3-only

import {switchToggle} from './switch.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design switch component. */
    'md-switch': Switch;
  }
}

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(
  mixinConstraintValidation(
    mixinFormAssociated(mixinCustomStateSet(mixinElementInternals(LitElement))),
  ),
);

/**
 * A Material Design switch component.
 */
@customElement('md-switch')
export class Switch extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    switchStyles,
    css`
      :host {
        display: inline-flex;
      }
      .switch {
        flex: 1;
      }
      ::slotted(*) {
        grid-area: handle;
      }
    `,
  ];

  /**
   * Puts the switch in the selected state and sets the form submission value to
   * the `value` property.
   */
  @property({type: Boolean})
  get selected() {
    return this[hasState]('selected');
  }
  set selected(value: boolean) {
    this[toggleState]('selected', value);
  }

  /**
   * The default selected state of the switch.
   */
  get defaultSelected(): boolean {
    return this.hasAttribute('selected');
  }
  set defaultSelected(value: boolean) {
    this.toggleAttribute('selected', value || false);
  }

  /**
   * When true, require the switch to be selected when participating in
   * form submission.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation
   */
  @property({type: Boolean}) required = false;

  /**
   * The value associated with this switch on form submission. `null` is
   * submitted when `selected` is `false`.
   */
  @property() value = 'on';

  @query('button', true)
  private readonly button!: HTMLButtonElement | null;

  /**
   * Mimics the behavior of <input> dirty checkedness, where the `checked`
   * attribute only updates the checked state if the checkbox has not been
   * interacted with.
   *
   * @see https://html.spec.whatwg.org/multipage/input.html#concept-input-checked-dirty-flag
   */
  private dirtyCheckedness = false;

  protected override render() {
    const {ariaLabel} = this as ARIAMixinStrict;
    return html`
      <button
        role="switch"
        part="switch"
        class="${switchToggle()}"
        aria-checked="${this.selected ? 'true' : 'false'}"
        aria-label=${ariaLabel || nothing}
        ?disabled=${this.disabled}
        @change=${this.handleChange}>
        <slot name="off-icon" class="switch-icon-off" ${hasSlotted()}></slot>
        <slot name="on-icon" class="switch-icon-on"></slot>
      </button>
    `;
  }

  private handleChange(event: Event) {
    this.dirtyCheckedness = true;
    this.selected = this.button?.ariaChecked === 'true';
    // Change event is not composed, re-dispatch it.
    redispatchEvent(this, event);
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (name === 'selected' && this.dirtyCheckedness) {
      // The 'selected' attribute does not update switches that have been
      // interacted with.
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  override [getFormValue]() {
    return this.selected ? this.value : null;
  }

  override [getFormState]() {
    return String(this.selected);
  }

  override formResetCallback() {
    this.dirtyCheckedness = false;
    this.selected = this.defaultSelected;
  }

  override formStateRestoreCallback(state: string) {
    this.selected = state === 'true';
  }

  override [createValidator]() {
    return new CheckboxValidator(() => ({
      checked: this.selected,
      required: this.required,
    }));
  }

  override [getValidityAnchor]() {
    return this.button;
  }
}
