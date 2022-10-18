/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {Environment} from '../testing/environment.js';

import {FormController, FormElement, getFormValue} from './form-controller.js';

function submitForm(form: HTMLFormElement) {
  return new Promise<FormData>(resolve => {
    const submitListener = (event: SubmitEvent) => {
      event.preventDefault();
      form.removeEventListener('submit', submitListener);
      const data = new FormData(form);
      resolve(data);
      return false;
    };

    form.addEventListener('submit', submitListener);
    form.requestSubmit();
  });
}

declare global {
  interface HTMLElementTagNameMap {
    'my-form-element': MyFormElement;
    'my-form-data-element': MyFormDataElement;
  }
}

@customElement('my-form-element')
class MyFormElement extends LitElement implements FormElement {
  get form() {
    return this.closest('form');
  }
  @property({type: Boolean}) disabled = false;
  @property() name = '';
  @property() value = '';
  [getFormValue](): string|null|FormData {
    return this.value ? this.value : null;
  }

  constructor() {
    super();
    this.addController(new FormController(this));
  }
}


@customElement('my-form-data-element')
class MyFormDataElement extends MyFormElement {
  override[getFormValue]() {
    const data = new FormData();
    data.append('element-value', this.value);
    data.append('element-foo', 'foo');
    return data;
  }
}

describe('FormController', () => {
  const env = new Environment();

  async function setupTest(template: TemplateResult) {
    const root = env.render(html`
      <form>${template}</form>
    `);

    await env.waitForStability();
    return root.querySelector('form')!;
  }

  it('should add element\'s name/value pair to the form', async () => {
    const form = await setupTest(html`
      <my-form-element name="element" value="foo"></my-form-element>
    `);

    const data = await submitForm(form);
    expect(data.has('element'))
        .withContext('should add name to data')
        .toBeTrue();
    expect(data.get('element'))
        .withContext('should add value to data')
        .toBe('foo');
  });

  it('should not add data when disconnected', async () => {
    const form = await setupTest(html`
      <my-form-element name="element" value="foo"></my-form-element>
    `);

    form.removeChild(form.querySelector('my-form-element')!);

    const data = await submitForm(form);
    expect(data.has('element'))
        .withContext('should not add disconnected element to data')
        .toBeFalse();
  });

  it('should not add data when element is disabled', async () => {
    const form = await setupTest(html`
      <my-form-element name="element" value="foo" disabled></my-form-element>
    `);

    const data = await submitForm(form);
    expect(data.has('element'))
        .withContext('should not add disabled element to data')
        .toBeFalse();
  });

  it('should not add data when value is null', async () => {
    const form = await setupTest(html`
      <my-form-element name="element"></my-form-element>
    `);

    const data = await submitForm(form);
    expect(data.has('element'))
        .withContext('should not add null value to data')
        .toBeFalse();
  });

  it('should add all entries if element returns FormData', async () => {
    const form = await setupTest(html`
      <my-form-data-element value="foo"></my-form-data-element>
    `);

    const data = await submitForm(form);
    expect(data.has('element-value'))
        .withContext('should add element-value data')
        .toBe(true);
    expect(data.has('element-foo'))
        .withContext('should add element-value data')
        .toBe(true);
    expect(data.get('element-value'))
        .withContext('element-value should match data value')
        .toBe('foo');
    expect(data.get('element-foo'))
        .withContext('element-foo should match "foo"')
        .toBe('foo');
  });
});
