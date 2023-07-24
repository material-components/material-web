/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, isServer, LitElement, nothing, PropertyValues} from 'lit';
import {property, query, queryAssignedElements, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {live} from 'lit/directives/live.js';
import {styleMap} from 'lit/directives/style-map.js';
import {html as staticHtml, StaticValue} from 'lit/static-html.js';

import {Field} from '../../field/internal/field.js';
import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {redispatchEvent} from '../../internal/controller/events.js';
import {stringConverter} from '../../internal/controller/string-converter.js';

/**
 * Input types that are compatible with the text field.
 */
export type TextFieldType =
    'email'|'number'|'password'|'search'|'tel'|'text'|'url'|'textarea';

/**
 * Input types that are not fully supported for the text field.
 */
export type UnsupportedTextFieldType =
    'color'|'date'|'datetime-local'|'file'|'month'|'time'|'week';

/**
 * Input types that are incompatible with the text field.
 */
export type InvalidTextFieldType =
    'button'|'checkbox'|'hidden'|'image'|'radio'|'range'|'reset'|'submit';

/**
 * A text field component.
 */
export abstract class TextField extends LitElement {
  static {
    requestUpdateOnAriaChange(this);
  }

  /** @nocollapse */
  static override shadowRootOptions:
      ShadowRootInit = {...LitElement.shadowRootOptions, delegatesFocus: true};

  /** @nocollapse  */
  static formAssociated = true;

  @property({type: Boolean, reflect: true}) disabled = false;
  /**
   * Gets or sets whether or not the text field is in a visually invalid state.
   *
   * Calling `reportValidity()` will automatically update `error`.
   */
  @property({type: Boolean, reflect: true}) error = false;
  /**
   * The error message that replaces supporting text when `error` is true. If
   * `errorText` is an empty string, then the supporting text will continue to
   * show.
   *
   * Calling `reportValidity()` will automatically update `errorText` to the
   * native `validationMessage`.
   */
  @property({attribute: 'error-text'}) errorText = '';
  @property() label = '';
  @property({type: Boolean, reflect: true}) required = false;
  /**
   * The current value of the text field. It is always a string.
   */
  @property() value = '';
  /**
   * An optional prefix to display before the input value.
   */
  @property({attribute: 'prefix-text'}) prefixText = '';
  /**
   * An optional suffix to display after the input value.
   */
  @property({attribute: 'suffix-text'}) suffixText = '';
  /**
   * Whether or not the text field has a leading icon. Used for SSR.
   */
  @property({type: Boolean, attribute: 'has-leading-icon'})
  hasLeadingIcon = false;
  /**
   * Whether or not the text field has a trailing icon. Used for SSR.
   */
  @property({type: Boolean, attribute: 'has-trailing-icon'})
  hasTrailingIcon = false;
  /**
   * Conveys additional information below the text field, such as how it should
   * be used.
   */
  @property({attribute: 'supporting-text'}) supportingText = '';
  /**
   * Override the input text CSS `direction`. Useful for RTL languages that use
   * LTR notation for fractions.
   */
  @property({attribute: 'text-direction'}) textDirection = '';

  /**
   * The number of rows to display for a `type="textarea"` text field.
   * Defaults to 2.
   */
  @property({type: Number}) rows = 2;

  /**
   * The associated form element with which this element's value will submit.
   */
  get form() {
    return this.internals.form;
  }

  /**
   * The labels this element is associated with.
   */
  get labels() {
    return this.internals.labels;
  }

  /**
   * The HTML name to use in form submission.
   */
  get name() {
    return this.getAttribute('name') ?? '';
  }
  set name(name: string) {
    this.setAttribute('name', name);
  }

  // <input> properties
  /**
   * Defines the greatest value in the range of permitted values.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max
   */
  @property() max = '';
  /**
   * The maximum number of characters a user can enter into the text field. Set
   * to -1 for none.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#maxlength
   */
  @property({type: Number}) maxLength = -1;
  /**
   * Defines the most negative value in the range of permitted values.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#min
   */
  @property() min = '';
  /**
   * The minimum number of characters a user can enter into the text field. Set
   * to -1 for none.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#minlength
   */
  @property({type: Number}) minLength = -1;
  /**
   * A regular expression that the text field's value must match to pass
   * constraint validation.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#pattern
   */
  @property() pattern = '';
  @property({reflect: true, converter: stringConverter}) placeholder = '';

  /**
   * Indicates whether or not a user should be able to edit the text field's
   * value.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#readonly
   */
  @property({type: Boolean, reflect: true}) readOnly = false;

  /**
   * Gets or sets the direction in which selection occurred.
   */
  get selectionDirection() {
    return this.getInputOrTextarea().selectionDirection;
  }
  set selectionDirection(value: 'forward'|'backward'|'none'|null) {
    this.getInputOrTextarea().selectionDirection = value;
  }

  /**
   * Gets or sets the end position or offset of a text selection.
   */
  get selectionEnd() {
    return this.getInputOrTextarea().selectionEnd;
  }
  set selectionEnd(value: number|null) {
    this.getInputOrTextarea().selectionEnd = value;
  }

  /**
   * Gets or sets the starting position or offset of a text selection.
   */
  get selectionStart() {
    return this.getInputOrTextarea().selectionStart;
  }
  set selectionStart(value: number|null) {
    this.getInputOrTextarea().selectionStart = value;
  }

  /**
   * Returns or sets the element's step attribute, which works with min and max
   * to limit the increments at which a numeric or date-time value can be set.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step
   */
  @property() step = '';

  @property({reflect: true})
  type: TextFieldType|UnsupportedTextFieldType = 'text';

  /**
   * Returns the native validation error message that would be displayed upon
   * calling `reportValidity()`.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validationMessage
   */
  get validationMessage() {
    return this.getInputOrTextarea().validationMessage;
  }

  /**
   * Returns a ValidityState object that represents the validity states of the
   * text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validity
   */
  get validity() {
    return this.getInputOrTextarea().validity;
  }

  /**
   * The text field's value as a number.
   */
  get valueAsNumber() {
    const input = this.getInput();
    if (!input) {
      return NaN;
    }

    return input.valueAsNumber;
  }
  set valueAsNumber(value: number) {
    const input = this.getInput();
    if (!input) {
      return;
    }

    input.valueAsNumber = value;
    this.value = input.value;
  }

  /**
   * The text field's value as a Date.
   */
  get valueAsDate() {
    const input = this.getInput();
    if (!input) {
      return null;
    }

    return input.valueAsDate;
  }
  set valueAsDate(value: Date|null) {
    const input = this.getInput();
    if (!input) {
      return;
    }

    input.valueAsDate = value;
    this.value = input.value;
  }

  /**
   * Returns whether an element will successfully validate based on forms
   * validation rules and constraints.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/willValidate
   */
  get willValidate() {
    return this.getInputOrTextarea().willValidate;
  }

  protected abstract readonly fieldTag: StaticValue;

  /**
   * Returns true when the text field has been interacted with. Native
   * validation errors only display in response to user interactions.
   */
  @state() private dirty = false;
  @state() private focused = false;
  /**
   * Whether or not a native error has been reported via `reportValidity()`.
   */
  @state() private nativeError = false;
  /**
   * The validation message displayed from a native error via
   * `reportValidity()`.
   */
  @state() private nativeErrorText = '';

  private get hasError() {
    return this.error || this.nativeError;
  }

  @query('.input')
  private readonly inputOrTextarea?: HTMLInputElement|HTMLTextAreaElement|null;
  @query('.field') private readonly field?: Field|null;
  @queryAssignedElements({slot: 'leadingicon'})
  private readonly leadingIcons!: Element[];
  @queryAssignedElements({slot: 'trailingicon'})
  private readonly trailingIcons!: Element[];
  private readonly internals =
      (this as HTMLElement /* needed for closure */).attachInternals();

  constructor() {
    super();
    if (!isServer) {
      this.addEventListener('click', this.focus);
      this.addEventListener('focusin', this.handleFocusin);
      this.addEventListener('focusout', this.handleFocusout);
    }
  }

  /**
   * Checks the text field's native validation and returns whether or not the
   * element is valid.
   *
   * If invalid, this method will dispatch the `invalid` event.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/checkValidity
   *
   * @return true if the text field is valid, or false if not.
   */
  checkValidity() {
    const {valid} = this.checkValidityAndDispatch();
    return valid;
  }

  /**
   * Focuses the text field's input text.
   */
  override focus() {
    if (this.disabled || this.matches(':focus-within')) {
      // Don't shift focus from an element within the text field, like an icon
      // button, to the input when focus is requested.
      return;
    }

    super.focus();
  }

  /**
   * Checks the text field's native validation and returns whether or not the
   * element is valid.
   *
   * If invalid, this method will dispatch the `invalid` event.
   *
   * This method will display or clear an error text message equal to the text
   * field's `validationMessage`, unless the invalid event is canceled.
   *
   * Use `setCustomValidity()` to customize the `validationMessage`.
   *
   * This method can also be used to re-announce error messages to screen
   * readers.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/reportValidity
   *
   * @return true if the text field is valid, or false if not.
   */
  reportValidity() {
    const {valid, canceled} = this.checkValidityAndDispatch();
    if (!canceled) {
      const prevMessage = this.getErrorText();
      this.nativeError = !valid;
      this.nativeErrorText = this.validationMessage;

      if (prevMessage === this.getErrorText()) {
        this.field?.reannounceError();
      }
    }

    return valid;
  }

  /**
   * Selects all the text in the text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
   */
  select() {
    this.getInputOrTextarea().select();
  }

  /**
   * Sets the text field's native validation error message. This is used to
   * customize `validationMessage`.
   *
   * When the error is not an empty string, the text field is considered invalid
   * and `validity.customError` will be true.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setCustomValidity
   *
   * @param error The error message to display.
   */
  setCustomValidity(error: string) {
    this.getInputOrTextarea().setCustomValidity(error);
  }

  /**
   * Replaces a range of text with a new string.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setRangeText
   */
  setRangeText(replacement: string): void;
  setRangeText(
      replacement: string, start: number, end: number,
      selectionMode?: SelectionMode): void;
  setRangeText(...args: unknown[]) {
    // Calling setRangeText with 1 vs 3-4 arguments has different behavior.
    // Use spread syntax and type casting to ensure correct usage.
    this.getInputOrTextarea().setRangeText(
        ...args as Parameters<HTMLInputElement['setRangeText']>);
    this.value = this.getInputOrTextarea().value;
  }

  /**
   * Sets the start and end positions of a selection in the text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/setSelectionRange
   *
   * @param start The offset into the text field for the start of the selection.
   * @param end The offset into the text field for the end of the selection.
   * @param direction The direction in which the selection is performed.
   */
  setSelectionRange(
      start: number|null, end: number|null,
      direction?: 'forward'|'backward'|'none') {
    this.getInputOrTextarea().setSelectionRange(start, end, direction);
  }

  /**
   * Decrements the value of a numeric type text field by `step` or `n` `step`
   * number of times.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepDown
   *
   * @param stepDecrement The number of steps to decrement, defaults to 1.
   */
  stepDown(stepDecrement?: number) {
    const input = this.getInput();
    if (!input) {
      return;
    }

    input.stepDown(stepDecrement);
    this.value = input.value;
  }

  /**
   * Increments the value of a numeric type text field by `step` or `n` `step`
   * number of times.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/stepUp
   *
   * @param stepIncrement The number of steps to increment, defaults to 1.
   */
  stepUp(stepIncrement?: number) {
    const input = this.getInput();
    if (!input) {
      return;
    }

    input.stepUp(stepIncrement);
    this.value = input.value;
  }

  /**
   * Reset the text field to its default value.
   */
  reset() {
    this.dirty = false;
    this.value = this.getAttribute('value') ?? '';
    this.nativeError = false;
    this.nativeErrorText = '';
  }

  override attributeChangedCallback(
      attribute: string, newValue: string|null, oldValue: string|null) {
    if (attribute === 'value' && this.dirty) {
      // After user input, changing the value attribute no longer updates the
      // text field's value (until reset). This matches native <input> behavior.
      return;
    }

    super.attributeChangedCallback(attribute, newValue, oldValue);
  }

  protected override render() {
    const classes = {
      'disabled': this.disabled,
      'error': !this.disabled && this.hasError,
      'textarea': this.type === 'textarea',
    };

    return html`
       <span class="text-field ${classMap(classes)}">
         ${this.renderField()}
       </span>
     `;
  }

  protected override updated(changedProperties: PropertyValues) {
    // Keep changedProperties arg so that subclasses may call it

    // If a property such as `type` changes and causes the internal <input>
    // value to change without dispatching an event, re-sync it.
    const value = this.getInputOrTextarea().value;
    this.internals.setFormValue(value);
    if (this.value !== value) {
      // Note this is typically inefficient in updated() since it schedules
      // another update. However, it is needed for the <input> to fully render
      // before checking its value.
      this.value = value;
    }
  }

  private renderField() {
    return staticHtml`<${this.fieldTag}
      class="field"
      count=${this.value.length}
      ?disabled=${this.disabled}
      ?error=${this.hasError}
      error-text=${this.getErrorText()}
      ?focused=${this.focused}
      ?has-end=${this.hasTrailingIcon}
      ?has-start=${this.hasLeadingIcon}
      label=${this.label}
      max=${this.maxLength}
      ?populated=${!!this.value}
      ?required=${this.required}
      supporting-text=${this.supportingText}
    >
      ${this.renderLeadingIcon()}
      ${this.renderInputOrTextarea()}
      ${this.renderTrailingIcon()}
      <div id="description" slot="aria-describedby"></div>
    </${this.fieldTag}>`;
  }

  private renderLeadingIcon() {
    return html`
       <span class="icon leading" slot="start">
         <slot name="leadingicon" @slotchange=${this.handleIconChange}></slot>
       </span>
     `;
  }

  private renderTrailingIcon() {
    return html`
       <span class="icon trailing" slot="end">
         <slot name="trailingicon" @slotchange=${this.handleIconChange}></slot>
       </span>
     `;
  }

  private renderInputOrTextarea() {
    const style = {direction: this.textDirection};
    const ariaLabel =
        (this as ARIAMixinStrict).ariaLabel || this.label || nothing;

    if (this.type === 'textarea') {
      return html`
        <textarea
          class="input"
          style=${styleMap(style)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${ariaLabel}
          ?disabled=${this.disabled}
          maxlength=${this.maxLength > -1 ? this.maxLength : nothing}
          minlength=${this.minLength > -1 ? this.minLength : nothing}
          placeholder=${this.placeholder || nothing}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          rows=${this.rows}
          .value=${live(this.value)}
          @change=${this.redispatchEvent}
          @input=${this.handleInput}
          @select=${this.redispatchEvent}
        ></textarea>
      `;
    }

    const prefix = this.renderPrefix();
    const suffix = this.renderSuffix();

    // TODO(b/243805848): remove `as unknown as number` once lit analyzer is
    // fixed
    return html`
      <div class="input-wrapper">
        ${prefix}
        <input
          class="input"
          style=${styleMap(style)}
          aria-describedby="description"
          aria-invalid=${this.hasError}
          aria-label=${ariaLabel}
          ?disabled=${this.disabled}
          max=${(this.max || nothing) as unknown as number}
          maxlength=${this.maxLength > -1 ? this.maxLength : nothing}
          min=${(this.min || nothing) as unknown as number}
          minlength=${this.minLength > -1 ? this.minLength : nothing}
          pattern=${this.pattern || nothing}
          placeholder=${this.placeholder || nothing}
          ?readonly=${this.readOnly}
          ?required=${this.required}
          step=${(this.step || nothing) as unknown as number}
          type=${this.type}
          .value=${live(this.value)}
          @change=${this.redispatchEvent}
          @input=${this.handleInput}
          @select=${this.redispatchEvent}
        >
        ${suffix}
      </div>
    `;
  }

  private renderPrefix() {
    return this.renderAffix(this.prefixText, /* isSuffix */ false);
  }

  private renderSuffix() {
    return this.renderAffix(this.suffixText, /* isSuffix */ true);
  }

  private renderAffix(text: string, isSuffix: boolean) {
    if (!text) {
      return nothing;
    }

    const classes = {
      'suffix': isSuffix,
      'prefix': !isSuffix,
    };

    return html`<span class="${classMap(classes)}">${text}</span>`;
  }

  private getErrorText() {
    return this.error ? this.errorText : this.nativeErrorText;
  }

  private handleFocusin() {
    this.focused = true;
  }

  private handleFocusout() {
    if (this.matches(':focus-within')) {
      // Changing focus to another child within the text field, like a button
      return;
    }

    this.focused = false;
  }

  private handleInput(event: InputEvent) {
    this.dirty = true;
    this.value = (event.target as HTMLInputElement).value;
    this.redispatchEvent(event);
  }

  private redispatchEvent(event: Event) {
    redispatchEvent(this, event);
  }

  private getInputOrTextarea() {
    if (!this.inputOrTextarea) {
      // If the input is not yet defined, synchronously render.
      // e.g.
      // const textField = document.createElement('md-outlined-text-field');
      // document.body.appendChild(textField);
      // textField.focus(); // synchronously render
      this.connectedCallback();
      this.scheduleUpdate();
    }

    if (this.isUpdatePending) {
      // If there are pending updates, synchronously perform them. This ensures
      // that constraint validation properties (like `required`) are synced
      // before interacting with input APIs that depend on them.
      this.scheduleUpdate();
    }

    return this.inputOrTextarea!;
  }

  private getInput() {
    if (this.type === 'textarea') {
      return null;
    }

    return this.getInputOrTextarea() as HTMLInputElement;
  }

  private checkValidityAndDispatch() {
    const valid = this.getInputOrTextarea().checkValidity();
    let canceled = false;
    if (!valid) {
      canceled = !this.dispatchEvent(new Event('invalid', {cancelable: true}));
    }

    return {valid, canceled};
  }

  private handleIconChange() {
    this.hasLeadingIcon = this.leadingIcons.length > 0;
    this.hasTrailingIcon = this.trailingIcons.length > 0;
  }

  /** @private */
  formResetCallback() {
    this.reset();
  }

  /** @private */
  formStateRestoreCallback(state: string) {
    this.value = state;
  }
}
