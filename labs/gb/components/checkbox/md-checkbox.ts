/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIAMixinStrict} from '@material/web/internal/aria/aria.js';
import {mixinDelegatesAria} from '@material/web/internal/aria/delegate.js';
import {redispatchEvent} from '@material/web/internal/events/redispatch-event.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '@material/web/labs/behaviors/constraint-validation.js';
import {mixinElementInternals} from '@material/web/labs/behaviors/element-internals.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '@material/web/labs/behaviors/form-associated.js';
import {CheckboxValidator} from '@material/web/labs/behaviors/validators/checkbox-validator.js';
import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '@material/web/labs/gb/components/focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '@material/web/labs/gb/components/ripple/ripple.cssresult.js'; // google3-only
import checkboxStyles from './checkbox.css' with {type: 'css'}; // github-only
// import checkboxStyles from './checkbox.cssresult.js'; // google3-only

import {checkbox} from './checkbox.js';

declare global {
  interface HTMLElementTagNameMap {
    /** A Material Design checkbox component. */
    'md-checkbox': Checkbox;
  }
}

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(
  mixinConstraintValidation(
    mixinFormAssociated(mixinElementInternals(LitElement)),
  ),
);

/**
 * A Material Design checkbox component.
 */
@customElement('md-checkbox')
export class Checkbox extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
    delegatesFocus: true,
  };

  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    checkboxStyles,
    css`
      :host {
        display: inline-flex;
      }
      .checkbox {
        flex: 1;
      }
    `,
  ];

  /**
   * Whether or not the checkbox is invalid.
   */
  @property({type: Boolean}) error = false;

  /**
   * Whether or not the checkbox is selected.
   */
  @property({type: Boolean}) checked = false;

  /**
   * The default checked state of the checkbox.
   */
  get defaultChecked(): boolean {
    return this.hasAttribute('checked');
  }
  set defaultChecked(value: boolean) {
    this.toggleAttribute('checked', value || false);
  }

  /**
   * Whether or not the checkbox is indeterminate.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#indeterminate_state_checkboxes
   */
  @property({type: Boolean}) indeterminate = false;

  /**
   * When true, require the checkbox to be selected when participating in
   * form submission.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation
   */
  @property({type: Boolean}) required = false;

  /**
   * The value of the checkbox that is submitted with a form when selected.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#value
   */
  @property() value = 'on';

  @query('input', true)
  private readonly input!: HTMLInputElement | null;
  /**
   * Mimics the behavior of <input> dirty checkedness, where the `checked`
   * attribute only updates the checked state if the checkbox has not been
   * interacted with.
   *
   * @see https://html.spec.whatwg.org/multipage/input.html#concept-input-checked-dirty-flag
   */
  private dirtyCheckedness = false;

  protected override render() {
    // Needed for closure conformance
    const {ariaLabel, ariaInvalid} = this as ARIAMixinStrict;
    return html`
      <input
        part="checkbox"
        class="${checkbox({invalid: this.error})}"
        type="checkbox"
        aria-checked=${this.indeterminate ? 'mixed' : nothing}
        aria-label=${ariaLabel || nothing}
        aria-invalid=${ariaInvalid || this.error || nothing}
        ?disabled=${this.disabled}
        ?required=${this.required}
        .indeterminate=${this.indeterminate}
        .checked=${this.checked}
        @input=${this.handleInput}
        @change=${this.handleChange} />
    `;
  }

  private handleInput(event: Event) {
    this.dirtyCheckedness = true;
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = target.indeterminate;
    // <input> 'input' event bubbles and is composed, don't re-dispatch it.
  }

  private handleChange(event: Event) {
    this.dirtyCheckedness = true;
    // <input> 'change' event is not composed, re-dispatch it.
    redispatchEvent(this, event);
  }

  override attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (name === 'checked' && this.dirtyCheckedness) {
      // The 'checked' attribute does not update checkboxes that have been
      // interacted with.
      return;
    }

    super.attributeChangedCallback(name, oldValue, newValue);
  }

  override [getFormValue]() {
    return this.checked ? this.value : null;
  }

  override [getFormState]() {
    return String(this.checked);
  }

  override formResetCallback() {
    this.dirtyCheckedness = false;
    this.checked = this.defaultChecked;
  }

  override formStateRestoreCallback(state: string) {
    this.checked = state === 'true';
  }

  override [createValidator]() {
    return new CheckboxValidator(() => this);
  }

  override [getValidityAnchor]() {
    return this.input;
  }
}
