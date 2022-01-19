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
      <table class="md3-test-table">
        <thead>
          <tr>
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
              <div slot="${`${rowIndex}-${colIndex}`}">${template(state)}</div>
            `)),
        this);

    return html`
      ${this.templates.map((template, rowIndex) => html`
        <tr>
          ${this.states.map((state, colIndex) => html`
            <td class="md3-test-table__cell">
              <slot name="${`${rowIndex}-${colIndex}`}"></slot>
            </td>
          `)}
        </tr>
      `)}
    `;
  }
}
