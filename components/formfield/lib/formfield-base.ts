/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, TemplateResult} from 'lit';
import {property, queryAssignedNodes} from 'lit/decorators';
import {ClassInfo, classMap} from 'lit/directives/class-map';
import {ifDefined} from 'lit/directives/if-defined';

/** @soyCompatible */
export class Formfield extends LitElement {
  @property({type: Boolean}) alignEnd = false;
  @property({type: Boolean}) spaceBetween = false;

  @property({type: String}) label = '';

  @property({type: String}) inputId?: string;

  @queryAssignedNodes('', true, '*')
  protected slottedInputs!: HTMLElement[]|null;

  protected get input() {
    return this.slottedInputs?.[0] ?? null;
  }

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
      <div class="mdc-formfield ${classMap(this.getRenderClasses())}">
        <div><slot></slot></div>
        <label class="mdc-formfield__label"
          for="${ifDefined(this.inputId)}"
          @click="${this.labelClick}">${this.label}</label>
      </div>`;
  }

  /** @soyTemplate */
  protected getRenderClasses(): ClassInfo {
    return {
      'mdc-formfield--align-end': this.alignEnd,
      'mdc-formfield--space-between': this.spaceBetween,
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
