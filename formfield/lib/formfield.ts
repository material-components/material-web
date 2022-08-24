/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property, queryAssignedElements} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {ifDefined} from 'lit/directives/if-defined.js';

/** @soyCompatible */
export class Formfield extends LitElement {
  @property({type: Boolean}) alignEnd = false;
  @property({type: Boolean}) spaceBetween = false;
  @property({type: String}) label = '';
  @property({type: String}) inputId?: string;
  @property({type: Boolean}) disabled = false;

  @queryAssignedElements() protected slottedInputs!: HTMLElement[]|null;

  protected get input() {
    return this.slottedInputs?.[0] ?? null;
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
      <div class="md3-formfield ${classMap(this.getRenderClasses())}">
        <div><slot></slot></div>
        <label class="md3-formfield__label"
          for="${ifDefined(this.inputId)}"
          @click="${this.labelClick}">${this.label}</label>
      </div>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'md3-formfield--align-end': this.alignEnd,
      'md3-formfield--space-between': this.spaceBetween,
      'md3-formfield--disabled': this.disabled,
    };
  }

  protected labelClick() {
    const input = this.input;
    if (input && this.shadowRoot) {
      input.focus();
      input.click();
    }
  }
}
