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
  // TODO(b/237284412): replace with exported types
  @property({type: String, reflect: true})
  type: 'email'|'number'|'password'|'search'|'tel'|'text'|'url'|'color'|'date'|
      'datetime-local'|'file'|'month'|'time'|'week' = 'text';

  /**
   * Returns true when the text field has been interacted with. Native
   * validation errors only display in response to user interactions.
   */
  @state() protected dirty = false;
  @query('.md3-text-field__input')
  protected readonly input?: HTMLInputElement|null;

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
    this.input?.focus();
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
    // TODO(b/237286701): replace with lit static
    return html``;
  }

  /** @soyTemplate */
  protected renderFieldContent(): TemplateResult {
    const prefix = this.renderPrefix();
    const suffix = this.renderSuffix();
    const input = this.renderInput();

    return html`${prefix}${input}${suffix}`;
  }

  /** @soyTemplate */
  protected renderLeadingIcon(): TemplateResult {
    return html`
      <span class="md3-text-field__icon md3-text-field__icon--leading">
        <slot name="leadingicon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderTrailingIcon(): TemplateResult {
    return html`
      <span class="md3-text-field__icon md3-text-field__icon--trailing">
        <slot name="trailingicon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
  }

  /** @soyTemplate */
  protected renderInput(): TemplateResult {
    // TODO(b/237281840): replace ternary operators with double pipes
    // TODO(b/237283903): remove when custom isTruthy directive is supported
    const placeholderValue = this.placeholder ? this.placeholder : undefined;
    const ariaLabelValue = this.ariaLabel ? this.ariaLabel :
        this.label                        ? this.label :
                                            undefined;
    const ariaLabelledByValue =
        this.ariaLabelledBy ? this.ariaLabelledBy : undefined;

    return html`<input
      class="md3-text-field__input"
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

  private handleIconChange() {
    this.hasLeadingIcon = this.leadingIcons.length > 0;
    this.hasTrailingIcon = this.trailingIcons.length > 0;
  }
}
