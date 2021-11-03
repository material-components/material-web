/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, render, TemplateResult} from 'lit';
import {property} from 'lit/decorators';

export type TestTableTemplate<S extends string = string> = (state: S) =>
    TemplateResult;

/** @soyCompatible */
export class TestTable<S extends string = string> extends LitElement {
  static override shadowRootOptions: ShadowRootInit = {mode: 'open'};

  @property({type: String}) override title = 'Title';
  @property({type: Array}) states: S[] = [];
  @property({type: Array}) templates: Array<TestTableTemplate<S>> = [];

  /** @soyTemplate */
  protected override render(): TemplateResult {
    return html`
      <table class="md-test-table">
        <caption class="md-test-table__cell md-test-table__cell--caption"
          >${this.title}</caption>
        <thead>
          <tr>
            ${this.states.map(state => html`
              <th class="md-test-table__cell md-test-table__cell--header"
                >${state}</th>
            `)}
          </tr>
        </thead>
        <tbody class="md-test-table__body">
          ${this.renderTemplates()}
        </tbody>
      </table>
    `;
  }

  /** @soyTemplate */
  protected renderTemplates(): TemplateResult {
    // Render templates in the light DOM for easier styling access
    render(
        this.templates.map(
            (template, rowIndex) => this.states.map((state, colIndex) => html`
              <div slot="${`${rowIndex}-${colIndex}`}">${template(state)}</div>
            `)),
        this);

    return html`
      ${this.templates.map((template, rowIndex) => html`
        <tr>
          ${this.states.map((state, colIndex) => html`
            <td class="md-test-table__cell">
              <slot name="${`${rowIndex}-${colIndex}`}"></slot>
            </td>
          `)}
        </tr>
      `)}
    `;
  }
}
