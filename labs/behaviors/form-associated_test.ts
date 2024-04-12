/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {LitElement, html, render} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';

import {internals, mixinElementInternals} from './element-internals.js';
import {
  getFormState,
  getFormValue,
  mixinFormAssociated,
} from './form-associated.js';

describe('mixinFormAssociated()', () => {
  @customElement('test-form-associated')
  class TestFormAssociated extends mixinFormAssociated(
    mixinElementInternals(LitElement),
  ) {
    @property() value = '';
    get state(): 'populated' | 'empty' {
      return this.value ? 'populated' : 'empty';
    }

    useCustomGetFormStateImpl = true;

    override [getFormValue]() {
      return this.value;
    }

    override [getFormState]() {
      if (this.useCustomGetFormStateImpl) {
        return this.state;
      }

      return super[getFormState]();
    }

    // These behaviors are specific to individual components
    override formResetCallback() {}
    override formStateRestoreCallback() {}
  }

  const env = new Environment();

  // Form APIs should be synchronous
  function setupTestWithoutForm() {
    const root = env.render(
      html`<test-form-associated></test-form-associated>`,
    );

    const element = root.querySelector(
      'test-form-associated',
    ) as TestFormAssociated;

    return {root, element};
  }

  function setupTestWithForm() {
    const root = env.render(
      html`<form><test-form-associated></test-form-associated></form>`,
    );

    const form = root.querySelector('form')!;
    const element = root.querySelector(
      'test-form-associated',
    ) as TestFormAssociated;

    return {root, form, element};
  }

  it('should add `static formAssociated = true`', () => {
    const {element} = setupTestWithoutForm();
    expect(
      (element.constructor as typeof TestFormAssociated).formAssociated,
    ).toBeTrue();
  });

  describe('.form', () => {
    it('should return null when not a child of a form', () => {
      const {element} = setupTestWithoutForm();
      expect(element.form).toBeNull();
    });

    it('should return parent form element', () => {
      const {form, element} = setupTestWithForm();
      expect(element.form).toBe(form);
    });
  });

  describe('labels', () => {
    it('should return empty NodeList when no labels associated', () => {
      const {element} = setupTestWithoutForm();
      expect(element.labels).toBeInstanceOf(NodeList);
      expect(element.labels).toHaveSize(0);
    });

    it('should return parent labels', () => {
      const {root, element} = setupTestWithoutForm();
      render(html`<label>${element}</label>`, root);
      const label = root.querySelector('label');
      if (!label) {
        throw new Error('<label> did not render');
      }

      expect(element.labels).toHaveSize(1);
      expect(element.labels[0]).toBe(label);
    });

    it('should return ID ref labels', () => {
      const {root, element} = setupTestWithoutForm();
      element.id = 'control';
      render(html`<label for="control"></label>${element}`, root);
      const label = root.querySelector('label');
      if (!label) {
        throw new Error('<label> did not render');
      }

      expect(element.labels).toHaveSize(1);
      expect(element.labels[0]).toBe(label);
    });

    it('should return multiple labels', () => {
      const {root, element} = setupTestWithoutForm();
      element.id = 'control';
      render(
        html`<label for="control"></label>
          <label for="control"></label>
          <label>${element}</label>`,
        root,
      );

      expect(element.labels).toHaveSize(3);
    });
  });

  describe('name', () => {
    it('should return empty string by default', () => {
      const {element} = setupTestWithoutForm();
      expect(element.name).toBe('');
    });

    it('should return name attribute', () => {
      const {element} = setupTestWithoutForm();
      element.setAttribute('name', 'foo');
      expect(element.name).toBe('foo');
    });

    it('should set name attribute synchronously', () => {
      const {element} = setupTestWithoutForm();
      element.name = 'foo';
      expect(element.getAttribute('name'))
        .withContext('name attribute value')
        .toBe('foo');
    });

    it('should add empty name attribute if set to an empty string', () => {
      const {element} = setupTestWithoutForm();
      element.name = '';
      expect(element.hasAttribute('name'))
        .withContext('has name attribute')
        .toBeTrue();
      expect(element.getAttribute('name'))
        .withContext('name attribute value')
        .toBe('');
    });

    it('should request a render on change', () => {
      const {element} = setupTestWithoutForm();
      spyOn(element, 'requestUpdate').and.callThrough();
      element.name = 'foo';
      expect(element.requestUpdate).toHaveBeenCalled();
    });
  });

  describe('disabled', () => {
    it('should return false by default', () => {
      const {element} = setupTestWithoutForm();
      expect(element.disabled).toBeFalse();
    });

    it('should return true if attribute set', () => {
      const {element} = setupTestWithoutForm();
      element.setAttribute('disabled', '');
      expect(element.disabled).toBeTrue();
    });

    it('should set disabled attribute synchronously', () => {
      const {element} = setupTestWithoutForm();
      element.disabled = true;
      expect(element.hasAttribute('disabled'))
        .withContext('has disabled attribute')
        .toBeTrue();
    });

    it('should remove attribute if set to false', () => {
      const {element} = setupTestWithoutForm();
      element.setAttribute('disabled', '');
      element.disabled = false;
      expect(element.hasAttribute('disabled'))
        .withContext('has disabled attribute')
        .toBeFalse();
    });

    it('should request a render on change', () => {
      const {element} = setupTestWithoutForm();
      spyOn(element, 'requestUpdate').and.callThrough();
      element.disabled = true;
      expect(element.requestUpdate).toHaveBeenCalled();
    });
  });

  describe('[getFormValue]()', () => {
    it('should throw an error if not implemented', () => {
      expect(() => {
        @customElement('test-bad-form-associated')
        class TestBadFormAssociated extends mixinFormAssociated(
          mixinElementInternals(LitElement),
        ) {
          override requestUpdate(
            ...args: Parameters<LitElement['requestUpdate']>
          ) {
            // Suppress errors that will occur async when the element is
            // initialized. This is harder to test in jasmine, so we explicitly
            // call the getFormValue function to test the error.
            try {
              super.requestUpdate(...args);
            } catch {}
          }
        }

        const element = new TestBadFormAssociated();
        element[getFormValue]();
      }).toThrowError(/getFormValue/);
    });

    it('should not add form data without a name', () => {
      const {element, form} = setupTestWithForm();
      element.value = 'value';
      const data = new FormData(form);
      expect(Array.from(data.entries())).toHaveSize(0);
    });

    it('should synchronously add value to form data', () => {
      const {element, form} = setupTestWithForm();
      element.name = 'foo';
      element.value = 'value';
      const data = new FormData(form);
      expect(data.get('foo')).withContext('FormData "foo" value').toBe('value');
    });
  });

  describe('[getFormState]()', () => {
    it('should return form value by default', () => {
      const {element} = setupTestWithoutForm();
      element.value = 'value';
      element.useCustomGetFormStateImpl = false;
      expect(element[getFormState]())
        .withContext('[getFormState]() return')
        .toBe('value');
    });

    it('should be able to return a custom state', () => {
      const {element} = setupTestWithoutForm();
      element.useCustomGetFormStateImpl = true;
      element.value = 'value';
      expect(element[getFormState]())
        .withContext('[getFormState]() custom return')
        .toBe(element.state);
    });

    it('should be provided as the second argument to `internals.setFormValue()`', () => {
      const {element} = setupTestWithoutForm();
      element.useCustomGetFormStateImpl = true;
      spyOn(element[internals], 'setFormValue').and.callThrough();
      element.value = 'value';
      expect(element[internals].setFormValue).toHaveBeenCalledOnceWith(
        element.value,
        element.state,
      );
    });
  });

  describe('formDisabledCallback()', () => {
    it('should set `element.disabled` to the provided value', () => {
      const {element} = setupTestWithoutForm();
      element.formDisabledCallback(true);
      expect(element.disabled)
        .withContext('element.disabled after callback with true')
        .toBeTrue();
      element.formDisabledCallback(false);
      expect(element.disabled)
        .withContext('element.disabled after callback with false')
        .toBeFalse();
    });

    it('should set `disabled` when control is disabled from fieldset', () => {
      const {root, element} = setupTestWithoutForm();
      render(html`<fieldset disabled>${element}</fieldset>`, root);
      expect(element.disabled).withContext('element.disabled').toBeTrue();
    });
  });
});
