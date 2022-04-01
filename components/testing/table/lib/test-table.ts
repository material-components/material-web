/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {render, LitElement, TemplateResult} from 'lit';
import {html, literal} from 'lit/static-html';
import {property} from 'lit/decorators';

/** Test table interface. */
export interface TestTableTemplate<S extends string = string> {
  /** The row display name. May be a Lit static value for rich HTML. */
  display: string|ReturnType<typeof literal>;
  /**
   * A template's render function. It accepts a state string (the column) and
   * returns a Lit `TemplateResult`.
   *
   * @param state The current state to render in.
   * @return A `TemplateResult` for the given state.
   */
  render(state: S): TemplateResult;
}

/** @soyCompatible */
export class TestTable<S extends string = string> extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {mode: 'open'};

  @property({type: String}) override title = 'Title';
  @property({type: Array}) states: S[] = [];
  @property({type: Array}) templates: Array<TestTableTemplate<S>> = [];

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
      <table class="md3-test-table">
        <thead>
          <tr>
            <th class="md3-test-table__header"></th>
            ${this.states.map(state => html`
              <th class="md3-test-table__header">${state}</th>
            `)}
          </tr>
        </thead>
        <tbody>
          ${this.renderTemplates()}
        </tbody>
        <caption class="md3-test-table__header">${this.title}</caption>
      </table>
    `;
  }

  /** @soyTemplate */
  protected renderTemplates(): TemplateResult {
    // Render templates in the light DOM for easier styling access
    render(
        this.templates.map(
            (template, rowIndex) => this.states.map((state, colIndex) => html`
              <div slot="${`${rowIndex}-${colIndex}`}">
                ${template.render(state)}
              </div>
            `)),
        this);

    return html`
      ${this.templates.map((template, rowIndex) => html`
        <tr>
          <th class="md3-test-table__header">
            ${this.getVariantName(template.display)}
          </th>
          ${this.states.map((state, colIndex) => html`
            <td class="md3-test-table__cell">
              <slot name="${`${rowIndex}-${colIndex}`}"></slot>
            </td>
          `)}
        </tr>
      `)}
    `;
  }

  /** Convert the name from camel case to sentence case. */
  private getVariantName(display: TestTableTemplate['display']) {
    if (typeof display !== 'string') {
      return display;
    }

    const withSpaces = display.replace(/([A-Z])/g, ' $1');
    return withSpaces[0].toUpperCase() + withSpaces.slice(1);
  }
}
