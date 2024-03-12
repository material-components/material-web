/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {Environment} from '../../testing/environment.js';
import {Harness} from '../../testing/harness.js';

import {Switch} from './switch.js';

@customElement('md-test-switch')
class TestSwitch extends Switch {}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-switch': TestSwitch;
  }
}

function renderSwitch(propsInit: Partial<TestSwitch> = {}) {
  return html`
    <md-test-switch
      ?selected=${propsInit.selected === true}
      ?disabled=${propsInit.disabled === true}
      .name=${propsInit.name ?? ''}
      value=${ifDefined(propsInit.value)}></md-test-switch>
  `;
}

function renderSwitchInForm(propsInit: Partial<TestSwitch> = {}) {
  return html` <form>${renderSwitch(propsInit)}</form> `;
}

function renderSwitchInLabel(propsInit: Partial<TestSwitch> = {}) {
  return html` <label>${renderSwitch(propsInit)}</label> `;
}

describe('md-switch', () => {
  const env = new Environment();

  async function switchElement(
    propsInit: Partial<TestSwitch> = {},
    template = renderSwitch,
  ) {
    const root = env.render(html`<div>${template(propsInit)}</div>`);
    await env.waitForStability();
    const element = root.querySelector('md-test-switch');
    if (!element) {
      throw new Error('Could not query rendered <md-test-switch>.');
    }
    return element;
  }

  let toggle: TestSwitch;

  beforeEach(async () => {
    toggle = await switchElement();
  });

  describe('selected', () => {
    let selected: TestSwitch;

    beforeEach(async () => {
      selected = await switchElement({selected: true});
    });

    it('is false by default', () => {
      expect(toggle.selected).toBeFalse();
    });

    it('adds selected class when true', () => {
      const toggleRoot = toggle.shadowRoot!.querySelector('.switch')!;
      expect(Array.from(toggleRoot.classList)).not.toContain('selected');

      const selectedRoot = selected.shadowRoot!.querySelector('.switch')!;
      expect(Array.from(selectedRoot.classList)).toContain('selected');
    });

    it('adds unselected class when false', () => {
      const toggleRoot = toggle.shadowRoot!.querySelector('.switch')!;
      expect(Array.from(toggleRoot.classList)).toContain('unselected');

      const selectedRoot = selected.shadowRoot!.querySelector('.switch')!;
      expect(Array.from(selectedRoot.classList)).not.toContain('unselected');
    });
  });

  describe('disabled', () => {
    let disabled: TestSwitch;

    beforeEach(async () => {
      disabled = await switchElement({disabled: true});
    });

    it('is false by default', () => {
      expect(toggle.disabled).toBeFalse();
    });

    it('sets disabled of input', () => {
      const toggleInput = toggle.shadowRoot!.querySelector('input')!;
      expect(toggleInput.disabled).toBeFalse();

      const selectedInput = disabled.shadowRoot!.querySelector('input')!;
      expect(selectedInput.disabled).toBeTrue();
    });
  });

  describe('aria', () => {
    it('delegates aria-label to the proper element', async () => {
      const input = toggle.shadowRoot!.querySelector('input')!;
      toggle.setAttribute('aria-label', 'foo');
      await toggle.updateComplete;
      expect(toggle.ariaLabel).toEqual('foo');
      expect(toggle.getAttribute('aria-label')).toEqual('foo');
      expect(input.getAttribute('aria-label')).toEqual('foo');
    });

    it('delegates .ariaLabel to the proper element', async () => {
      const input = toggle.shadowRoot!.querySelector('input')!;
      toggle.ariaLabel = 'foo';
      await toggle.updateComplete;
      expect(toggle.ariaLabel).toEqual('foo');
      expect(toggle.getAttribute('aria-label')).toEqual('foo');
      expect(input.getAttribute('aria-label')).toEqual('foo');
    });
  });

  describe('name', () => {
    it('is an empty string by default', () => {
      expect(toggle.name).toEqual('');
    });

    it('reflects as an attribute', async () => {
      toggle.name = 'foo';
      await toggle.updateComplete;
      expect(toggle.getAttribute('name')).toEqual('foo');
    });
  });

  describe('value', () => {
    it('is "on" by default', () => {
      expect(toggle.value).toEqual('on');
    });
  });

  describe('click()', () => {
    it('toggles element', () => {
      expect(toggle.selected).withContext('is false by default').toBeFalse();
      toggle.click();
      expect(toggle.selected).withContext('should toggle selected').toBeTrue();
    });

    it('does nothing if disabled', () => {
      expect(toggle.selected).withContext('is false by default').toBeFalse();
      toggle.disabled = true;
      toggle.click();
      expect(toggle.selected).withContext('should remain false').toBeFalse();
    });

    it('reflects `selected` state in input events', () => {
      let state = false;
      const inputHandler = jasmine
        .createSpy('inputHandler')
        .and.callFake(() => {
          state = toggle.selected;
        });

      toggle.addEventListener('input', inputHandler);

      toggle.click();
      expect(inputHandler).withContext('input listener').toHaveBeenCalled();
      expect(state)
        .withContext('switch.selected during input listener')
        .toBeTrue();
    });
  });

  describe('form submission', () => {
    async function switchInForm(
      propsInit: Partial<TestSwitch> = {},
      template = renderSwitchInForm,
    ) {
      const element = await switchElement(propsInit, template);
      return new Harness(element);
    }

    it('does not submit if not selected', async () => {
      const harness = await switchInForm({name: 'foo'});
      const formData = await harness.submitForm();
      expect(formData.get('foo')).toBeNull();
    });

    it('does not submit if disabled', async () => {
      const harness = await switchInForm({
        name: 'foo',
        selected: true,
        disabled: true,
      });
      const formData = await harness.submitForm();
      expect(formData.get('foo')).toBeNull();
    });

    it('does not submit if name is not provided', async () => {
      const harness = await switchInForm({selected: true});
      const formData = await harness.submitForm();
      const keys = Array.from(formData.keys());
      expect(keys.length).toEqual(0);
    });

    it('submits under correct conditions', async () => {
      const harness = await switchInForm({
        name: 'foo',
        selected: true,
        value: 'bar',
      });
      const formData = await harness.submitForm();
      expect(formData.get('foo')).toEqual('bar');
    });

    describe('label activation', () => {
      let label: HTMLLabelElement;

      it('toggles when label is clicked', async () => {
        toggle = await switchElement({}, renderSwitchInLabel);
        label = toggle.parentElement as HTMLLabelElement;
        label.click();
        await env.waitForStability();
        expect(toggle.selected).toBeTrue();
        label.click();
        await env.waitForStability();
        expect(toggle.selected).toBeFalse();
      });
    });
  });

  describe('validation', () => {
    it('should set valueMissing when required and not selected', async () => {
      toggle.required = true;

      expect(toggle.validity.valueMissing)
        .withContext('toggle.validity.valueMissing')
        .toBeTrue();
    });

    it('should not set valueMissing when required and selected', async () => {
      toggle.required = true;
      toggle.selected = true;

      expect(toggle.validity.valueMissing)
        .withContext('toggle.validity.valueMissing')
        .toBeFalse();
    });
  });
});
