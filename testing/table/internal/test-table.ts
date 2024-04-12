/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {LitElement, render, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';
import {guard} from 'lit/directives/guard.js';
import {html, literal} from 'lit/static-html.js';

/** Test table interface. */
export interface TestTableTemplate<S extends string = string> {
  /** The row display name. May be a Lit static value for rich HTML. */
  display: string | ReturnType<typeof literal>;
  /**
   * A template's render function. It accepts a state string (the column) and
   * returns a Lit `TemplateResult`.
   *
   * @param state The current state to render in.
   * @return A `TemplateResult` for the given state.
   */
  render(state: S): TemplateResult | null;
}

/**
 * A test table component.
 */
export class TestTable<S extends string = string> extends LitElement {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {mode: 'open'};

  @property() override title = 'Title';
  @property({type: Array}) states: S[] = [];
  @property({type: Array}) templates: Array<TestTableTemplate<S>> = [];
  @property({type: Boolean, reflect: true}) dark = false;

  protected override render() {
    return html`
      <table class="md3-test-table">
        <thead>
          <tr>
            <th class="md3-test-table__header"></th>
            ${this.states.map(
              (state) => html`
                <th class="md3-test-table__header">${state}</th>
              `,
            )}
          </tr>
        </thead>
        <tbody>
          ${guard([this.templates, this.states], () => this.renderTemplates())}
        </tbody>
        <caption class="md3-test-table__header">${this.title}</caption>
      </table>
    `;
  }

  protected renderTemplates() {
    // Render templates in the light DOM for easier styling access
    render(
      this.templates.map((template, rowIndex) =>
        this.states.map((state, colIndex) => {
          const renderResult = template.render(state);
          const isEmptyTemplate = renderResult === null;
          return isEmptyTemplate
            ? html``
            : html` <div slot="${`${rowIndex}-${colIndex}`}">
                ${renderResult}
              </div>`;
        }),
      ),
      this,
    );

    return html`
      ${this.templates.map(
        (template, rowIndex) => html`
          <tr>
            <th class="md3-test-table__header">
              ${this.getVariantName(template.display)}
            </th>
            ${this.states.map(
              (state, colIndex) => html`
                <td class="md3-test-table__cell">
                  <slot name="${`${rowIndex}-${colIndex}`}">
                    <div class="md3-test-table__text">N/A</div>
                  </slot>
                </td>
              `,
            )}
          </tr>
        `,
      )}
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
