/**
 * @requirecss {text_field.lib.shared_styles}
 *
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {redispatchEvent} from '@material/web/controller/events';
import {FormController, getFormValue} from '@material/web/controller/form-controller';
import {ariaProperty} from '@material/web/decorators/aria-property';
import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';
import {live} from 'lit/directives/live';

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

  // ARIA
  // TODO(b/210730484): replace with @soyParam annotation
  @property({type: String, attribute: 'data-aria-label', noAccessor: true})
  @ariaProperty
  override ariaLabel!: string;

  // FormElement
  get form() {
    return this.closest('form');
  }

  @property({type: String, reflect: true}) name = '';

  [getFormValue]() {
    return this.value;
  }

  // <input> properties
  @property({type: String, reflect: true}) placeholder = '';
  @property({type: Boolean, reflect: true}) readonly = false;
  @property({type: String, reflect: true}) type = 'text';

  /**
   * Returns true when the text field has been interacted with. Native
   * validation errors only display in response to user interactions.
   */
  @state() protected dirty = false;
  @state() protected fieldID = 'field';
  @query('.md3-text-field__input')
  protected readonly input?: HTMLInputElement|null;

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
    return html``;
  }

  /** @soyTemplate */
  protected renderFieldContent(): TemplateResult {
    return html`
      <input
        class="md3-text-field__input"
        aria-invalid=${this.error}
        aria-label=${ifDefined(this.ariaLabel)}
        aria-labelledby="${this.fieldID}"
        .disabled=${this.disabled}
        .placeholder=${this.placeholder}
        .readonly=${this.readonly}
        .required=${this.required}
        .type=${this.type}
        .value=${live(this.value)}
        @change=${this.redispatchEvent}
        @input=${this.handleInput}
        @select=${this.redispatchEvent}
      >
    `;
  }

  protected override update(changedProperties: PropertyValues<TextField>) {
    if (changedProperties.has('defaultValue') && !this.dirty) {
      // Do this here instead of in a setter so that the order of setting both
      // value and defaultValue does not matter.
      this.value = this.defaultValue;
    }

    super.update(changedProperties);
  }

  protected handleInput(event: InputEvent) {
    this.dirty = true;
    this.value = (event.target as HTMLInputElement).value;
    this.redispatchEvent(event);
  }

  protected redispatchEvent(event: Event) {
    redispatchEvent(this, event);
  }
}
