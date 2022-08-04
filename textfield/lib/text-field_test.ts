/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';
import '@material/web/field/filled-field';

import {Environment} from '@material/web/testing/environment';
import {html} from 'lit';
import {customElement} from 'lit/decorators';

import {TextFieldHarness} from '../harness';

import {TextField} from './text-field';

declare global {
  interface HTMLElementTagNameMap {
    'md-test-text-field': TestTextField;
  }
}

@customElement('md-test-text-field')
class TestTextField extends TextField {
  get isDirty() {
    return this.dirty;
  }

  protected override renderField() {
    return html`
      <md-filled-field
        class="md3-text-field__field"
        ?disabled=${this.disabled}
        .error=${this.error}
        .label=${this.label}
        .populated=${Boolean(this.value)}
        .required=${this.required}
      >
        ${this.renderFieldContent()}
      </md-filled-field>
    `;
  }
}

describe('TextField', () => {
  const env = new Environment();

  async function setupTest() {
    // Variant type does not matter for shared tests
    const element = env.render(html`<md-test-text-field></md-test-text-field>`)
                        .querySelector('md-test-text-field');
    if (!element) {
      throw new Error('Could not query rendered <md-test-text-field>.');
    }

    await env.waitForStability();
    const input = element.renderRoot.querySelector('input');
    if (!input) {
      throw new Error('Could not query rendered <input>.');
    }

    return {
      input,
      testElement: element,
      harness: new TextFieldHarness(element),
    };
  }

  describe('focusing the input', () => {
    it('should call focus() click', async () => {
      const {harness} = await setupTest();
      spyOn(harness.element, 'focus').and.callThrough();

      await harness.clickWithMouse();

      expect(harness.element.focus).toHaveBeenCalled();
    });

    it('focus() should not focus when disabled', async () => {
      const {harness, input} = await setupTest();
      harness.element.disabled = true;
      spyOn(input, 'focus');

      harness.element.focus();

      expect(input.focus).not.toHaveBeenCalled();
    });

    it('focus() should focus input', async () => {
      const {harness, input} = await setupTest();
      spyOn(input, 'focus');

      harness.element.focus();

      expect(input.focus).toHaveBeenCalled();
    });
  });

  describe('input events', () => {
    it('should update the text field value', async () => {
      const {harness} = await setupTest();

      await harness.inputValue('Value');

      expect(harness.element.value).toEqual('Value');
    });

    it('should mark the text field as dirty', async () => {
      const {harness, testElement} = await setupTest();

      await harness.inputValue('Value');

      expect(testElement.isDirty).toBeTrue();
    });

    it('should redispatch input events', async () => {
      const {harness, input} = await setupTest();
      const inputHandler = jasmine.createSpy('inputHandler');
      harness.element.addEventListener('input', inputHandler);

      const event = new InputEvent('input');
      input.dispatchEvent(event);

      expect(inputHandler).toHaveBeenCalledWith(event);
    });
  });

  describe('resetting the input', () => {
    it('should set value back to default value', async () => {
      const {harness} = await setupTest();
      harness.element.defaultValue = 'Default';
      await env.waitForStability();

      await harness.deleteValue();
      await harness.inputValue('Value');
      harness.element.reset();

      expect(harness.element.defaultValue).toBe('Default');
      expect(harness.element.value).toBe('Default');
    });

    it('should set value to empty string if there is no default', async () => {
      const {harness} = await setupTest();

      await harness.inputValue('Value');
      harness.element.reset();

      expect(harness.element.defaultValue).toBe('');
      expect(harness.element.value).toBe('');
    });
  });

  describe('default value', () => {
    it('should update `value` before user input', async () => {
      const {harness} = await setupTest();

      harness.element.defaultValue = 'Default';
      await env.waitForStability();

      expect(harness.element.value).toBe('Default');
    });

    it('should NOT update `value` after user input', async () => {
      const {harness} = await setupTest();

      harness.element.defaultValue = 'First default';
      await env.waitForStability();
      await harness.deleteValue();
      await harness.inputValue('Value');

      harness.element.defaultValue = 'Second default';
      await env.waitForStability();

      expect(harness.element.value).toBe('Value');
    });
  });

  // TODO(b/235238545): Add shared FormController tests.
});
