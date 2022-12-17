/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement, TemplateResult} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

import {Environment} from '../testing/environment.js';
import {Harness} from '../testing/harness.js';

import {dispatchActivationClick, isActivationClick} from './events.js';
import {FormController, FormElement, getFormValue} from './form-controller.js';

declare global {
  interface HTMLElementTagNameMap {
    'my-form-element': MyFormElement;
    'my-form-data-element': MyFormDataElement;
    'my-checked-form-element': MyCheckedFormElement;
    'my-checked-form-associated-element': MyCheckedFormAssociatedElement;
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

@customElement('my-checked-form-element')
class MyCheckedFormElement extends MyFormElement {
  @property({type: Boolean}) checked = false;

  @query('#checked') checkedEl!: HTMLDivElement;

  constructor() {
    super();
    this.setupActivationClickHandler();
  }

  setupActivationClickHandler() {
    this.addEventListener('click', (event: MouseEvent) => {
      if (!isActivationClick(event)) {
        return;
      }
      this.checkedEl.focus();
      dispatchActivationClick(this.checkedEl);
    });
  }

  // Note, due to the following Firefox issue, it's important that the
  // element contain native "interactive content" like a button or input,
  // see https://bugzilla.mozilla.org/show_bug.cgi?id=1804576.
  //
  override render() {
    return html`<button id="checked" @click=${
        () => this.checked = !this.checked}>
      ${this.checked}
    </button>`;
  }

  override focus() {
    this.checkedEl.focus();
  }
}

@customElement('my-checked-form-associated-element')
class MyCheckedFormAssociatedElement extends MyCheckedFormElement {
  static formAssociated = true;
}

class CheckedFormElementHarness extends Harness<MyCheckedFormElement> {
  protected override async getInteractiveElement() {
    await this.element.updateComplete;
    return this.element.checkedEl;
  }
}

describe('FormController', () => {
  const env = new Environment();

  async function setupTest(template: TemplateResult) {
    const root = env.render(html`
      <form>${template}</form>
    `);

    await env.waitForStability();
    const element =
        root.querySelector('form')!.firstElementChild! as HTMLElement;
    return new Harness(element);
  }

  it('should add element\'s name/value pair to the form', async () => {
    const harness = await setupTest(html`
      <my-form-element name="element" value="foo"></my-form-element>
    `);
    const data = await harness.submitForm();
    expect(data.has('element'))
        .withContext('should add name to data')
        .toBeTrue();
    expect(data.get('element'))
        .withContext('should add value to data')
        .toBe('foo');
  });

  it('should add form associated element\'s name/value pair to the form',
     async () => {
       const harness = await setupTest(
           html`
        <my-checked-form-associated-element name="element" value="foo">
        </my-checked-form-associated-element>`);

       const data = await harness.submitForm();
       expect(data.has('element'))
           .withContext('should add name to data')
           .toBeTrue();
       expect(data.get('element'))
           .withContext('should add value to data')
           .toBe('foo');
     });

  it('should not add data when disconnected', async () => {
    const harness = await setupTest(html`
      <my-form-element name="element" value="foo"></my-form-element>
    `);

    const form = harness.element.form!;
    harness.element.remove();
    expect(harness.element.form).toBeNull();
    const data = await harness.submitForm(form);
    expect(data.has('element'))
        .withContext('should not add disconnected element to data')
        .toBeFalse();
  });

  it('should not add data when element is disabled', async () => {
    const harness = await setupTest(html`
      <my-form-element name="element" value="foo" disabled></my-form-element>
    `);

    const data = await harness.submitForm();
    expect(data.has('element'))
        .withContext('should not add disabled element to data')
        .toBeFalse();
  });

  it('should not add data when value is null', async () => {
    const harness = await setupTest(html`
      <my-form-element name="element"></my-form-element>
    `);

    const data = await harness.submitForm();
    expect(data.has('element'))
        .withContext('should not add null value to data')
        .toBeFalse();
  });

  it('should add all entries if element returns FormData', async () => {
    const harness = await setupTest(
        html`
      <my-form-data-element value="foo"></my-form-data-element>
    `);

    const data = await harness.submitForm();
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

  describe('label activation', () => {
    const setupLabelTest = async (
        template: TemplateResult,
        harnessTag = 'my-checked-form-associated-element') => {
      const root = env.render(html`
        <form>${template}</form>
      `);
      await env.waitForStability();
      const label = new Harness(root.querySelector<HTMLLabelElement>('label')!);
      const face = new CheckedFormElementHarness(
          root.querySelector<MyCheckedFormElement>(harnessTag)!);
      return {label, face};
    };

    it('should activate via click event', async () => {
      const {face} = await setupLabelTest(html`
        <label>
          <my-checked-form-associated-element value="foo">
          </my-checked-form-associated-element>
        </label>
      `);
      expect(face.element.checked).toBeFalse();
      await face.clickWithMouse();
      expect(face.element.checked).toBeTrue();
      await face.clickWithMouse();
      expect(face.element.checked).toBeFalse();
    });

    it('should activate via click method', async () => {
      const {face} = await setupLabelTest(html`
        <label>
          <my-checked-form-associated-element value="foo">
          </my-checked-form-associated-element>
        </label>
      `);
      expect(face.element.checked).toBeFalse();
      face.element.click();
      await env.waitForStability();
      expect(face.element.checked).toBeTrue();
      face.element.click();
      await env.waitForStability();
      expect(face.element.checked).toBeFalse();
    });

    it('should activate form associated elements via surrounding label',
       async () => {
         const {label, face} = await setupLabelTest(html`
          <label>
            label
            <my-checked-form-associated-element value="foo">
            </my-checked-form-associated-element>
          </label>`);
         expect(face.element.checked).toBeFalse();
         await face.clickWithMouse();
         expect(face.element.checked).toBeTrue();
         await label.clickWithMouse();
         expect(face.element.checked).toBeFalse();
         await label.clickWithMouse();
         expect(face.element.checked).toBeTrue();
       });

    it('should not generate extra clicks when activated', async () => {
      const {label, face} = await setupLabelTest(html`
        <label>
          <my-checked-form-associated-element value="foo">
          </my-checked-form-associated-element>
        </label>`);
      expect(face.element.checked).toBeFalse();
      const clickListener = jasmine.createSpy('clickListener');
      face.element.addEventListener('click', clickListener);
      await face.clickWithMouse();
      expect(clickListener).toHaveBeenCalledTimes(1);
      face.element.click();
      await env.waitForStability();
      expect(clickListener).toHaveBeenCalledTimes(2);
      await label.clickWithMouse();
      expect(clickListener).toHaveBeenCalledTimes(3);
    });

    it('should activate form associated elements via label with matching `for`',
       async () => {
         const {label, face} = await setupLabelTest(html`
          <label for="a">a</label>
          <my-checked-form-associated-element id="a" value="foo">
          </my-checked-form-associated-element>`);
         expect(face.element.checked).toBeFalse();
         await face.clickWithMouse();
         expect(face.element.checked).toBeTrue();
         await label.clickWithMouse();
         expect(face.element.checked).toBeFalse();
         await label.clickWithMouse();
         expect(face.element.checked).toBeTrue();

         // Disconnect `for` and check that face is not activated.
         label.element.setAttribute('for', '');
         await label.clickWithMouse();
         expect(face.element.checked).toBeTrue();
       });

    it('should *not* activate disabled form associated elements via label',
       async () => {
         const {label, face} = await setupLabelTest(html`
          <label>
            label
            <my-checked-form-associated-element disabled value="foo">
            </my-checked-form-associated-element>
          </label>`);
         expect(face.element.checked).toBeFalse();
         await label.clickWithMouse();
         expect(face.element.checked).toBeFalse();
       });

    it('should *not* activate non-form associated elements via label',
       async () => {
         const {label, face} = await setupLabelTest(
             html`
          <label>
            label
            <my-checked-form-element value="foo">
            </my-checked-form-element>
          </label>`,
             `my-checked-form-element`);
         expect(face.element.checked).toBeFalse();
         await face.clickWithMouse();
         expect(face.element.checked).toBeTrue();
         await label.clickWithMouse();
         expect(face.element.checked).toBeTrue();
       });
  });
});