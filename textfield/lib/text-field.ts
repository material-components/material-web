/**
 * @requirecss {textfield.lib.shared_styles}
 *
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {redispatchEvent} from '@material/web/controller/events';
import {FormController, getFormValue} from '@material/web/controller/form-controller';
import {stringConverter} from '@material/web/controller/string-converter';
import {ariaProperty} from '@material/web/decorators/aria-property';
import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAssignedElements, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';
import {live} from 'lit/directives/live';
import {html as staticHtml, literal} from 'lit/static-html';

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
export class TextField extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) error = false;
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
   * The ID on the supporting text element, used for SSR.
   */
  @property({type: String}) supportingTextId = 'support';

  // ARIA
  // TODO(b/210730484): replace with @soyParam annotation
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  override ariaLabel!: string;
  @property({type: String, attribute: 'data-aria-labelledby', noAccessor: true})
  @ariaProperty  // tslint:disable-line:no-new-decorators
  ariaLabelledBy!: string;

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
  @property({type: String, reflect: true, converter: stringConverter})
  placeholder = '';
  @property({type: Boolean, reflect: true}) readonly = false;

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

  // TODO(b/237284412): replace with exported types
  @property({type: String, reflect: true})
  type: 'email'|'number'|'password'|'search'|'tel'|'text'|'url'|'color'|'date'|
      'datetime-local'|'file'|'month'|'time'|'week' = 'text';

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
   * Returns true when the text field has been interacted with. Native
   * validation errors only display in response to user interactions.
   */
  @state() protected dirty = false;
  @query('.md3-text-field__input')
  protected readonly input?: HTMLInputElement|null;
  // TODO(b/241841846): make abstract
  protected readonly fieldTag = literal`div`;

  @queryAssignedElements({slot: 'leadingicon'})
  private readonly leadingIcons!: Element[];
  @queryAssignedElements({slot: 'trailingicon'})
  private readonly trailingIcons!: Element[];

  constructor() {
    super();
    this.addController(new FormController(this));
    this.addEventListener('click', this.focus);
  }

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
   * Selects all the text in the text field.
   *
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/select
   */
  select() {
    this.getInput().select();
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
   * Reset the text field to its default value.
   */
  reset() {
    this.dirty = false;
    this.value = this.defaultValue;
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
      'md3-text-field--error': this.error,
    };
  }

  /** @soyTemplate */
  protected renderField(): TemplateResult {
    const prefix = this.renderPrefix();
    const suffix = this.renderSuffix();
    const input = this.renderInput();

    return staticHtml`<${this.fieldTag}
      class="md3-text-field__field"
      ?disabled=${this.disabled}
      ?error=${this.error}
      ?hasEnd=${this.hasTrailingIcon}
      ?hasStart=${this.hasLeadingIcon}
      .label=${this.label}
      ?populated=${!!this.value}
      ?required=${this.required}
    >
      ${this.renderLeadingIcon()}
      ${prefix}${input}${suffix}
      ${this.renderTrailingIcon()}
      ${this.renderSupportingText()}
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
    // TODO(b/237281840): replace ternary operators with double pipes
    // TODO(b/237283903): remove when custom isTruthy directive is supported
    const placeholderValue = this.placeholder ? this.placeholder : undefined;
    const ariaDescribedByValue =
        this.supportingText ? this.supportingTextId : undefined;
    const ariaLabelValue = this.ariaLabel ? this.ariaLabel :
        this.label                        ? this.label :
                                            undefined;
    const ariaLabelledByValue =
        this.ariaLabelledBy ? this.ariaLabelledBy : undefined;

    return html`<input
      class="md3-text-field__input"
      aria-describedby=${ifDefined(ariaDescribedByValue)}
      aria-invalid=${this.error}
      aria-label=${ifDefined(ariaLabelValue)}
      aria-labelledby=${ifDefined(ariaLabelledByValue)}
      ?disabled=${this.disabled}
      placeholder=${ifDefined(placeholderValue)}
      ?readonly=${this.readonly}
      ?required=${this.required}
      type=${this.type}
      .value=${live(this.value)}
      @change=${this.redispatchEvent}
      @input=${this.handleInput}
      @select=${this.redispatchEvent}
    >`;
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
    return this.supportingText ?
        html`<span id=${this.supportingTextId} slot="supporting-text">${
            this.supportingText}</span>` :
        html``;
  }

  protected override willUpdate(changedProperties: PropertyValues<TextField>) {
    if (!changedProperties.has('value') && !this.dirty) {
      // Do this here instead of in a setter so that the order of setting both
      // value and defaultValue does not matter.
      this.value = this.value || this.defaultValue;
    }

    super.willUpdate(changedProperties);
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

    return this.input!;
  }

  private handleIconChange() {
    this.hasLeadingIcon = this.leadingIcons.length > 0;
    this.hasTrailingIcon = this.trailingIcons.length > 0;
  }
}
