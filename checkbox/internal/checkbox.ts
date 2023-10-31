/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../focus/md-focus-ring.js';
import '../../ripple/ripple.js';

import {html, isServer, LitElement, nothing, PropertyValues} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {
  dispatchActivationClick,
  isActivationClick,
  redispatchEvent,
} from '../../internal/controller/events.js';
import {
  internals,
  mixinElementInternals,
} from '../../labs/behaviors/element-internals.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from '../../labs/behaviors/form-associated.js';

// Separate variable needed for closure.
const checkboxBaseClass = mixinFormAssociated(
  mixinElementInternals(LitElement),
);

/**
 * A checkbox component.
 */
export class Checkbox extends checkboxBaseClass {
  static {
    requestUpdateOnAriaChange(Checkbox);
  }

  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Whether or not the checkbox is selected.
   */
  @property({type: Boolean}) checked = false;

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

  /**
   * Returns a ValidityState object that represents the validity states of the
   * checkbox.
   *
   * Note that checkboxes will only set `valueMissing` if `required` and not
   * checked.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#validation
   */
  get validity() {
    this.syncValidity();
    return this[internals].validity;
  }

  /**
   * Returns the native validation error message.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation#constraint_validation_process
   */
  get validationMessage() {
    this.syncValidity();
    return this[internals].validationMessage;
  }

  /**
   * Returns whether an element will successfully validate based on forms
   * validation rules and constraints.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation#constraint_validation_process
   */
  get willValidate() {
    this.syncValidity();
    return this[internals].willValidate;
  }

  @state() private prevChecked = false;
  @state() private prevDisabled = false;
  @state() private prevIndeterminate = false;
  @query('input') private readonly input!: HTMLInputElement | null;
  // Needed for Safari, see https://bugs.webkit.org/show_bug.cgi?id=261432
  // Replace with this[internals].validity.customError when resolved.
  private hasCustomValidityError = false;

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('click', (event: MouseEvent) => {
        if (!isActivationClick(event)) {
          return;
        }
        this.focus();
        dispatchActivationClick(this.input!);
      });
    }
  }

  /**
   * Checks the checkbox's native validation and returns whether or not the
   * element is valid.
   *
   * If invalid, this method will dispatch the `invalid` event.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
   *
   * @return true if the checkbox is valid, or false if not.
   */
  checkValidity() {
    this.syncValidity();
    return this[internals].checkValidity();
  }

  /**
   * Checks the checkbox's native validation and returns whether or not the
   * element is valid.
   *
   * If invalid, this method will dispatch the `invalid` event.
   *
   * The `validationMessage` is reported to the user by the browser. Use
   * `setCustomValidity()` to customize the `validationMessage`.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/reportValidity
   *
   * @return true if the checkbox is valid, or false if not.
   */
  reportValidity() {
    this.syncValidity();
    return this[internals].reportValidity();
  }

  /**
   * Sets the checkbox's native validation error message. This is used to
   * customize `validationMessage`.
   *
   * When the error is not an empty string, the checkbox is considered invalid
   * and `validity.customError` will be true.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
   *
   * @param error The error message to display.
   */
  setCustomValidity(error: string) {
    this.hasCustomValidityError = !!error;
    this[internals].setValidity({customError: !!error}, error, this.getInput());
  }

  protected override update(changed: PropertyValues<Checkbox>) {
    if (
      changed.has('checked') ||
      changed.has('disabled') ||
      changed.has('indeterminate')
    ) {
      this.prevChecked = changed.get('checked') ?? this.checked;
      this.prevDisabled = changed.get('disabled') ?? this.disabled;
      this.prevIndeterminate =
        changed.get('indeterminate') ?? this.indeterminate;
    }

    super.update(changed);
  }

  protected override render() {
    const prevNone = !this.prevChecked && !this.prevIndeterminate;
    const prevChecked = this.prevChecked && !this.prevIndeterminate;
    const prevIndeterminate = this.prevIndeterminate;
    const isChecked = this.checked && !this.indeterminate;
    const isIndeterminate = this.indeterminate;

    const containerClasses = classMap({
      'disabled': this.disabled,
      'selected': isChecked || isIndeterminate,
      'unselected': !isChecked && !isIndeterminate,
      'checked': isChecked,
      'indeterminate': isIndeterminate,
      'prev-unselected': prevNone,
      'prev-checked': prevChecked,
      'prev-indeterminate': prevIndeterminate,
      'prev-disabled': this.prevDisabled,
    });

    // Needed for closure conformance
    const {ariaLabel, ariaInvalid} = this as ARIAMixinStrict;
    // Note: <input> needs to be rendered before the <svg> for
    // form.reportValidity() to work in Chrome.
    return html`
      <div class="container ${containerClasses}">
        <input
          type="checkbox"
          id="input"
          aria-checked=${isIndeterminate ? 'mixed' : nothing}
          aria-label=${ariaLabel || nothing}
          aria-invalid=${ariaInvalid || nothing}
          ?disabled=${this.disabled}
          ?required=${this.required}
          .indeterminate=${this.indeterminate}
          .checked=${this.checked}
          @change=${this.handleChange} />

        <div class="outline"></div>
        <div class="background"></div>
        <md-focus-ring part="focus-ring" for="input"></md-focus-ring>
        <md-ripple for="input" ?disabled=${this.disabled}></md-ripple>
        <svg class="icon" viewBox="0 0 18 18" aria-hidden="true">
          <rect class="mark short" />
          <rect class="mark long" />
        </svg>
      </div>
    `;
  }

  protected override updated() {
    // Sync validity when properties change, since validation properties may
    // have changed.
    this.syncValidity();
  }

  private handleChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = target.indeterminate;

    redispatchEvent(this, event);
  }

  private syncValidity() {
    // Sync the internal <input>'s validity and the host's ElementInternals
    // validity. We do this to re-use native `<input>` validation messages.
    const input = this.getInput();
    if (this.hasCustomValidityError) {
      input.setCustomValidity(this[internals].validationMessage);
    } else {
      input.setCustomValidity('');
    }

    this[internals].setValidity(
      input.validity,
      input.validationMessage,
      this.getInput(),
    );
  }

  private getInput() {
    if (!this.input) {
      // If the input is not yet defined, synchronously render.
      this.connectedCallback();
      this.performUpdate();
    }

    if (this.isUpdatePending) {
      // If there are pending updates, synchronously perform them. This ensures
      // that constraint validation properties (like `required`) are synced
      // before interacting with input APIs that depend on them.
      this.scheduleUpdate();
    }

    return this.input!;
  }

  // Writable mixin properties for lit-html binding, needed for lit-analyzer
  declare disabled: boolean;
  declare name: string;

  override [getFormValue]() {
    if (!this.checked || this.indeterminate) {
      return null;
    }

    return this.value;
  }

  override [getFormState]() {
    return String(this.checked);
  }

  override formResetCallback() {
    // The checked property does not reflect, so the original attribute set by
    // the user is used to determine the default value.
    this.checked = this.hasAttribute('checked');
  }

  override formStateRestoreCallback(state: string) {
    this.checked = state === 'true';
  }
}
