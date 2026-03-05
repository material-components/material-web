/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {mixinElementInternals} from '../../labs/behaviors/element-internals.js';
import {Environment} from '../../testing/environment.js';
import {Harness} from '../../testing/harness.js';
import {FormSubmitterType, setupFormSubmitter} from './form-submitter.js';

declare global {
  interface HTMLElementTagNameMap {
    'test-form-submitter-button': FormSubmitterButton;
  }
}

@customElement('test-form-submitter-button')
class FormSubmitterButton extends mixinElementInternals(LitElement) {
  static {
    setupFormSubmitter(FormSubmitterButton);
  }

  static formAssociated = true;

  type: FormSubmitterType = 'submit';
  @property({reflect: true}) name = '';
  value = '';
}

describe('setupFormSubmitter()', () => {
  const env = new Environment();

  async function setupTest() {
    const root = env.render(
      html`<form
        ><test-form-submitter-button></test-form-submitter-button
      ></form>`,
    );
    const submitter = root.querySelector('test-form-submitter-button');
    if (!submitter) {
      throw new Error(`Could not query rendered <test-form-submitter-button>`);
    }
    const form = root.querySelector('form');
    if (!form) {
      throw new Error(`Could not query rendered <form>`);
    }

    await env.waitForStability();

    return {harness: new Harness(submitter), form};
  }

  it('button is submit type by default', async () => {
    const {harness} = await setupTest();
    expect(harness.element.type).toBe('submit');
  });

  it('button with type submit can submit a form', async () => {
    const {harness, form} = await setupTest();
    harness.element.type = 'submit';

    spyOn(form, 'requestSubmit');
    spyOn(form, 'reset');
    await harness.clickWithMouse();
    // Submission happens after a task
    await env.waitForStability();

    expect(form.requestSubmit).toHaveBeenCalled();
    expect(form.reset).not.toHaveBeenCalled();
  });

  it('button with type reset can reset a form', async () => {
    const {harness, form} = await setupTest();
    harness.element.type = 'reset';

    spyOn(form, 'requestSubmit');
    spyOn(form, 'reset');
    await harness.clickWithMouse();
    // Submission happens after a task
    await env.waitForStability();

    expect(form.requestSubmit).not.toHaveBeenCalled();
    expect(form.reset).toHaveBeenCalled();
  });

  it('submit can be cancelled with preventDefault', async () => {
    const {harness, form} = await setupTest();
    harness.element.type = 'submit';

    spyOn(form, 'requestSubmit');

    harness.element.addEventListener(
      'click',
      (event: Event) => {
        event.preventDefault();
      },
      {once: true},
    );

    await harness.clickWithMouse();
    // Submission happens after a task
    await env.waitForStability();

    expect(form.requestSubmit).not.toHaveBeenCalled();
  });

  it('should set the button as the SubmitEvent submitter', async () => {
    const {harness, form} = await setupTest();
    const submitListener = jasmine
      .createSpy('submitListener')
      .and.callFake((event: Event) => {
        event.preventDefault();
      });

    form.addEventListener('submit', submitListener);

    await harness.clickWithMouse();
    // Submission happens after a task
    await env.waitForStability();

    expect(submitListener).toHaveBeenCalled();
    const event = submitListener.calls.argsFor(0)[0] as SubmitEvent;
    expect(event.submitter)
      .withContext('event.submitter')
      .toBe(harness.element);
  });

  it('should add name/value to form data when present', async () => {
    const {harness, form} = await setupTest();
    form.addEventListener('submit', (event) => {
      event.preventDefault();
    });

    harness.element.name = 'foo';
    harness.element.value = 'bar';

    await harness.clickWithMouse();
    // Submission happens after a task
    await env.waitForStability();

    const formData = Array.from(new FormData(form));
    expect(formData.length).withContext('formData.length').toBe(1);

    const [formName, formValue] = formData[0];
    expect(formName).toBe('foo');
    expect(formValue).toBe('bar');
  });
});
