/**
 * @requirecss {textfield.lib.shared_styles}
 *
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAssignedElements, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';
import {live} from 'lit/directives/live.js';
import {styleMap} from 'lit/directives/style-map.js';
import {html as staticHtml, StaticValue} from 'lit/static-html.js';

import {redispatchEvent} from '../../controller/events.js';
import {FormController, getFormValue} from '../../controller/form-controller.js';
import {stringConverter} from '../../controller/string-converter.js';
import {ariaProperty} from '../../decorators/aria-property.js';
import {ARIAAutoComplete, ARIAExpanded, ARIARole} from '../../types/aria.js';

/**
 * Input types that are compatible with the text field.
 */
export type TextFieldType =
    'email'|'number'|'password'|'search'|'tel'|'text'|'url';

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

/** @soyCompatible */
export abstract class TextField extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

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
  @property({type: String}) errorText = '';
  @property({type: String}) label?: string;
  @property({type: Boolean, reflect: true}) required = false;
  /**
   * The current value of the text field. It is always a string.
   *
   * This is equal to `defaultValue` before user input.
   */
  @property({type: String}) value = '';
  /**
   * The default value of the text field. Before user input, changing the
   * default value will update `value` as well.
   *
   * When the text field is reset, its `value` will be set to this default
   * value.
   */
  @property({type: String}) defaultValue = '';
  /**
   * An optional prefix to display before the input value.
   */
  @property({type: String}) prefixText = '';
  /**
   * An optional suffix to display after the input value.
   */
  @property({type: String}) suffixText = '';
  /**
   * Whether or not the text field has a leading icon. Used for SSR.
   */
  @property({type: Boolean}) hasLeadingIcon = false;
  /**
   * Whether or not the text field has a trailing icon. Used for SSR.
   */
  @property({type: Boolean}) hasTrailingIcon = false;
  /**
   * Conveys additional information below the text field, such as how it should
   * be used.
   */
  @property({type: String}) supportingText = '';
  /**
   * Override the input text CSS `direction`. Useful for RTL languages that use
   * LTR notation for fractions.
   */
  @property({type: String}) textDirection = '';

  // ARIA
  // TODO(b/210730484): replace with @soyParam annotation
  @property(
      {type: String, attribute: 'data-aria-autocomplete', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  override ariaAutoComplete: ARIAAutoComplete|null = null;

  @property({type: String, attribute: 'data-aria-controls', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  ariaControls: string|null = null;

  @property(
      {type: String, attribute: 'data-aria-activedescendant', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  ariaActiveDescendant: string|null = null;

  @property({type: String, attribute: 'data-aria-expanded', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  override ariaExpanded: ARIAExpanded|null = null;

  /**
   * The `aria-label` of the text field's input.
   */
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  override ariaLabel!: string;

  /**
   * The `aria-labelledby` of the text field's input.
   *
   * Note: currently only usable in SSR light DOM.
   */
  @property({type: String, attribute: 'data-aria-labelledby', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  ariaLabelledBy!: string;

  // tslint:disable:decorator-placement
  @property({type: String, attribute: 'data-role', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  // @ts-ignore(b/264292293): Use `override` with TS 4.9+
  role: ARIARole|null = null;
  // tslint:enable:decorator-placement

  // FormElement
  get form() {
    return this.closest('form');
  }

  @property({type: String, reflect: true, converter: stringConverter})
  name = '';

  [getFormValue]() {
    return this.value;
  }

  // <input> properties
  /**
   * Defines the greatest value in the range of permitted values.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#max
   */
  @property({type: String}) max = '';
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
  @property({type: String}) min = '';
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
  @property({type: String}) pattern = '';
  @property({type: String, reflect: true, converter: stringConverter})
  placeholder = '';

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
    return this.getInput().selectionDirection;
  }
  set selectionDirection(value: 'forward'|'backward'|'none'|null) {
    this.getInput().selectionDirection = value;
  }

  /**
   * Gets or sets the end position or offset of a text selection.
   */
  get selectionEnd() {
    return this.getInput().selectionEnd;
  }
  set selectionEnd(value: number|null) {
    this.getInput().selectionEnd = value;
  }

  /**
   * Gets or sets the starting position or offset of a text selection.
   */
  get selectionStart() {
    return this.getInput().selectionStart;
  }
  set selectionStart(value: number|null) {
    this.getInput().selectionStart = value;
  }

  /**
   * Returns or sets the element's step attribute, which works with min and max
   * to limit the increments at which a numeric or date-time value can be set.
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#step
   */
  @property({type: String}) step = '';

  // TODO(b/237284412): replace with exported types
  @property({type: String, reflect: true})
  type: 'email'|'number'|'password'|'search'|'tel'|'text'|'url'|'color'|'date'|
      'datetime-local'|'file'|'month'|'time'|'week' = 'text';

  /**
   * Returns the native validation error message that would be displayed upon
   * calling `reportValidity()`.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validationMessage
   */
  get validationMessage() {
    return this.getInput().validationMessage;
  }

  /**
   * Returns a ValidityState object that represents the validity states of the
   * text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/validity
   */
  get validity() {
    return this.getInput().validity;
  }

  /**
   * The text field's value as a number.
   */
  get valueAsNumber() {
    return this.getInput().valueAsNumber;
  }
  set valueAsNumber(value: number) {
    this.getInput().valueAsNumber = value;
    this.value = this.getInput().value;
  }

  /**
   * The text field's value as a Date.
   */
  get valueAsDate() {
    return this.getInput().valueAsDate;
  }
  set valueAsDate(value: Date|null) {
    this.getInput().valueAsDate = value;
    this.value = this.getInput().value;
  }

  /**
   * Returns whether an element will successfully validate based on forms
   * validation rules and constraints.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLObjectElement/willValidate
   */
  get willValidate() {
    return this.getInput().willValidate;
  }

  /**
   * Returns true when the text field has been interacted with. Native
   * validation errors only display in response to user interactions.
   */
  @state() protected dirty = false;
  @state() protected focused = false;
  /**
   * When set to true, the error text's `role="alert"` will be removed, then
   * re-added after an animation frame. This will re-announce an error message
   * to screen readers.
   */
  @state() protected refreshErrorAlert = false;
  /**
   * Returns true when the text field's `value` property has been changed from
   * it's initial value.
   *
   * Setting `value` should always overwrite `defaultValue`, even when `value`
   * is an empty string. This flag ensures that behavior.
   */
  @state() protected valueHasChanged = false;
  /**
   * Whether or not to ignore the next `value` change when computing
   * `valueHasChanged`.
   */
  protected ignoreNextValueChange = false;
  /**
   * Whether or not a native error has been reported via `reportValidity()`.
   */
  @state() protected nativeError = false;
  /**
   * The validation message displayed from a native error via
   * `reportValidity()`.
   */
  @state() protected nativeErrorText = '';
  @query('.md3-text-field__input')
  protected readonly input?: HTMLInputElement|null;
  protected abstract readonly fieldTag: StaticValue;

  /** @soyUniqueAttribute */
  private readonly counterId = 'counter';
  @queryAssignedElements({slot: 'leadingicon'})
  private readonly leadingIcons!: Element[];
  @queryAssignedElements({slot: 'trailingicon'})
  private readonly trailingIcons!: Element[];
  /** @soyUniqueAttribute */
  private readonly supportingTextId = 'support';

  constructor() {
    super();
    this.addController(new FormController(this));
    // TODO(b/244574653): replace this.handleClick with this.focus
    this.addEventListener('click', this.handleClick);
    this.addEventListener('focusin', this.handleFocusin);
    this.addEventListener('focusout', this.handleFocusout);
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

    // TODO(b/210731759): replace with super.focus() once SSR supports
    // delegating focus
    this.getInput().focus();
  }

  /**
   * Unfocuses the text field.
   */
  override blur() {
    this.getInput().blur();
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

      const needsRefresh =
          this.shouldErrorAnnounce() && prevMessage === this.getErrorText();
      if (needsRefresh) {
        this.refreshErrorAlert = true;
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
    this.getInput().select();
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
    this.getInput().setCustomValidity(error);
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
    this.getInput().setRangeText(
        ...args as Parameters<HTMLInputElement['setRangeText']>);
    this.value = this.getInput().value;
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
    this.getInput().setSelectionRange(start, end, direction);
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
    input.stepUp(stepIncrement);
    this.value = input.value;
  }

  /**
   * Reset the text field to its default value.
   */
  reset() {
    this.dirty = false;
    this.valueHasChanged = false;
    this.ignoreNextValueChange = true;
    this.value = this.defaultValue;
    this.nativeError = false;
    this.nativeErrorText = '';
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
       <span class="md3-text-field ${classMap(this.getRenderClasses())}">
         ${this.renderField()}
       </span>
     `;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-text-field--disabled': this.disabled,
      'md3-text-field--error': this.getError(),
    };
  }

  /** @soyTemplate */
  protected getError(): boolean {
    return this.error || this.nativeError;
  }

  /** @soyTemplate */
  protected renderField(): TemplateResult {
    const prefix = this.renderPrefix();
    const suffix = this.renderSuffix();
    const input = this.renderInput();
    const inputValue = this.getInputValue();

    return staticHtml`<${this.fieldTag}
      class="md3-text-field__field"
      ?disabled=${this.disabled}
      ?error=${this.getError()}
      ?focused=${this.focused}
      ?hasEnd=${this.hasTrailingIcon}
      ?hasStart=${this.hasLeadingIcon}
      .label=${this.label}
      ?populated=${!!inputValue}
      ?required=${this.required}
    >
      ${this.renderLeadingIcon()}
      ${prefix}${input}${suffix}
      ${this.renderTrailingIcon()}
      ${this.renderSupportingText()}
      ${this.renderCounter()}
    </${this.fieldTag}>`;
  }

  /**
   * @soyTemplate
   * @slotName start
   */
  protected renderLeadingIcon(): TemplateResult {
    return html`
       <span class="md3-text-field__icon md3-text-field__icon--leading"
           slot="start">
         <slot name="leadingicon" @slotchange=${this.handleIconChange}></slot>
       </span>
     `;
  }

  /**
   * @soyTemplate
   * @slotName end
   */
  protected renderTrailingIcon(): TemplateResult {
    return html`
       <span class="md3-text-field__icon md3-text-field__icon--trailing"
           slot="end">
         <slot name="trailingicon" @slotchange=${this.handleIconChange}></slot>
       </span>
     `;
  }

  /** @soyTemplate */
  protected renderInput(): TemplateResult {
    // TODO(b/237283903): remove when custom isTruthy directive is supported
    const placeholderValue = this.placeholder || undefined;
    const ariaActiveDescendantValue = this.ariaActiveDescendant || undefined;
    const ariaAutoCompleteValue = this.ariaAutoComplete || undefined;
    const ariaControlsValue = this.ariaControls || undefined;
    const ariaDescribedByValue = this.getAriaDescribedBy() || undefined;
    const ariaExpandedValue = this.ariaExpanded || undefined;
    const ariaLabelValue = this.ariaLabel || this.label || undefined;
    const ariaLabelledByValue = this.ariaLabelledBy || undefined;
    const maxValue = this.max || undefined;
    const maxLengthValue = this.maxLength > -1 ? this.maxLength : undefined;
    const minValue = this.min || undefined;
    const minLengthValue = this.minLength > -1 ? this.minLength : undefined;
    const patternValue = this.pattern || undefined;
    const roleValue = this.role || undefined;
    const stepValue = this.step || undefined;

    /** @styleMap */
    const style = {direction: this.textDirection};

    // TODO(b/243805848): remove `as unknown as number` once lit analyzer is
    // fixed
    return html`<input
       class="md3-text-field__input"
       style=${styleMap(style)}
       aria-activedescendant=${ifDefined(ariaActiveDescendantValue)}
       aria-autocomplete=${ifDefined(ariaAutoCompleteValue)}
       aria-controls=${ifDefined(ariaControlsValue)}
       aria-describedby=${ifDefined(ariaDescribedByValue)}
       aria-expanded=${ifDefined(ariaExpandedValue)}
       aria-invalid=${this.getError()}
       aria-label=${ifDefined(ariaLabelValue)}
       aria-labelledby=${ifDefined(ariaLabelledByValue)}
       ?disabled=${this.disabled}
       max=${ifDefined(maxValue as unknown as number)}
       maxlength=${ifDefined(maxLengthValue)}
       min=${ifDefined(minValue as unknown as number)}
       minlength=${ifDefined(minLengthValue)}
       pattern=${ifDefined(patternValue)}
       placeholder=${ifDefined(placeholderValue)}
       role=${ifDefined(roleValue)}
       ?readonly=${this.readOnly}
       ?required=${this.required}
       step=${ifDefined(stepValue as unknown as number)}
       type=${this.type}
       .value=${live(this.getInputValue())}
       @change=${this.redispatchEvent}
       @input=${this.handleInput}
       @select=${this.redispatchEvent}
     >`;
  }

  /** @soyTemplate */
  protected getInputValue(): string {
    const alwaysShowValue = this.dirty || this.valueHasChanged;
    return alwaysShowValue ? this.value : this.defaultValue || this.value;
  }

  /** @soyTemplate */
  protected getAriaDescribedBy(): string {
    const hasSupport = !!this.getSupportingText();
    const hasCounter = this.hasCounter();
    // TODO(b/244609052): remove parens
    return (hasSupport || hasCounter) ?
        `${hasSupport ? this.supportingTextId : ''} ${
            hasCounter ? this.counterId : ''}` :
        '';
  }

  /** @soyTemplate */
  protected renderPrefix(): TemplateResult {
    return this.prefixText ?
        html`<span class="md3-text-field__prefix">${this.prefixText}</span>` :
        html``;

    // TODO(b/217441842): Create shared function once argument bug is fixed
    // return this.renderAffix(/* isSuffix */ false);
  }

  /** @soyTemplate */
  protected renderSuffix(): TemplateResult {
    return this.suffixText ?
        html`<span class="md3-text-field__suffix">${this.suffixText}</span>` :
        html``;

    // TODO(b/217441842): Create shared function once argument bug is fixed
    // return this.renderAffix(/* isSuffix */ true);
  }

  /**
   * @soyTemplate
   * @slotName supporting-text
   */
  protected renderSupportingText(): TemplateResult {
    const shouldAlert = this.shouldErrorAnnounce();
    const text = this.getSupportingText();
    const template = html`<span id=${this.supportingTextId} 
      slot="supporting-text" 
      role=${ifDefined(shouldAlert ? 'alert' : undefined)}>${text}</span>`;

    return text ? template : html``;
  }

  /** @soyTemplate */
  protected getSupportingText(): string {
    const errorText = this.getErrorText();
    return this.getError() && errorText ? errorText : this.supportingText;
  }

  /** @soyTemplate */
  protected getErrorText(): string {
    return this.error ? this.errorText : this.nativeErrorText;
  }

  /** @soyTemplate */
  protected shouldErrorAnnounce(): boolean {
    // Announce if there is an error and error text visible.
    // If refreshErrorAlert is true, do not announce. This will remove the
    // role="alert" attribute. Another render cycle will happen after an
    // animation frame to re-add the role.
    return this.getError() && !!this.getErrorText() && !this.refreshErrorAlert;
  }

  /**
   * @soyTemplate
   * @slotName supporting-text-end
   */
  protected renderCounter(): TemplateResult {
    const counter = html`<span id=${this.counterId}
       class="md3-text-field__counter"
       slot="supporting-text-end">${this.getCounterText()}</span>`;
    // TODO(b/244473435): add aria-label and announcements
    return this.hasCounter() ? counter : html``;
  }

  // TODO(b/244197198): replace with !!this.getCounterText()
  /** @soyTemplate */
  protected hasCounter(): boolean {
    return this.maxLength > -1;
  }

  /** @soyTemplate */
  protected getCounterText(): TemplateResult {
    // TODO(b/244197198): replace with string return
    const length = this.value.length;
    return this.hasCounter() ? html`${length} / ${this.maxLength}` : html``;
  }

  protected override update(changedProperties: PropertyValues<TextField>) {
    // Consider a value change anything that is not the initial empty string
    // value.
    const valueHasChanged = changedProperties.has('value') &&
        changedProperties.get('value') !== undefined;
    if (valueHasChanged && !this.ignoreNextValueChange) {
      this.valueHasChanged = true;
    }

    if (this.ignoreNextValueChange) {
      this.ignoreNextValueChange = false;
    }

    super.update(changedProperties);
  }

  protected override updated(changedProperties: PropertyValues) {
    // If a property such as `type` changes and causes the internal <input>
    // value to change without dispatching an event, re-sync it.
    const value = this.getInput().value;
    if (this.value !== value) {
      // Don't consider these updates (such as setting `defaultValue`) as
      // the developer directly changing the `value`.
      this.ignoreNextValueChange = true;
      // Note this is typically inefficient in updated() since it schedules
      // another update. However, it is needed for the <input> to fully render
      // before checking its value.
      this.value = value;
    }

    if (this.refreshErrorAlert) {
      // The past render cycle removed the role="alert" from the error message.
      // Re-add it after an animation frame to re-announce the error.
      requestAnimationFrame(() => {
        this.refreshErrorAlert = false;
      });
    }
  }

  /** @bubbleWizEvent */
  protected handleClick() {
    this.focus();
  }

  /** @bubbleWizEvent */
  protected handleFocusin(event: FocusEvent) {
    this.focused = true;
  }

  /** @bubbleWizEvent */
  protected handleFocusout(event: FocusEvent) {
    if (this.matches(':focus-within')) {
      // Changing focus to another child within the text field, like a button
      return;
    }

    this.focused = false;
  }

  protected handleInput(event: InputEvent) {
    this.dirty = true;
    this.value = (event.target as HTMLInputElement).value;
    this.redispatchEvent(event);
  }

  protected redispatchEvent(event: Event) {
    redispatchEvent(this, event);
  }

  protected getInput() {
    if (!this.input) {
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

    return this.input!;
  }

  private checkValidityAndDispatch() {
    const valid = this.getInput().checkValidity();
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
}
