/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * @requirecss {text_field.lib.shared_styles}
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property, state, queryAsync} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';
import {live} from 'lit/directives/live';

import {redispatchEvent} from '../../controller/events';
import {FormController, getFormValue} from '../../controller/form-controller';
import {ariaProperty} from '../../decorators/aria-property';

/** @soyCompatible */
export class TextField extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  @property({type: Boolean, reflect: true}) disabled = false;
  @property({type: Boolean, reflect: true}) error = false;
  @property({type: String}) label?: string;
  @property({type: Boolean, reflect: true}) required = false;
  @property({type: String}) value = '';

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

  @state()
  protected fieldID = 'field';
  @queryAsync('.md3-text-field__input')
  protected readonly input!: Promise<HTMLInputElement>;

  constructor() {
    super();
    this.addController(new FormController(this));
    this.addEventListener('click', this.handleClick);
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
        aria-labelledby="field"
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

  protected handleClick() {
    if (this.disabled) {
      return;
    }

    if (!this.matches(':focus-within')) {
      this.focus();
    }
  }

  protected handleInput(event: InputEvent) {
    this.value = (event.target as HTMLInputElement).value;
    this.redispatchEvent(event);
  }

  protected redispatchEvent(event: Event) {
    redispatchEvent.call(this, event);
  }
}
