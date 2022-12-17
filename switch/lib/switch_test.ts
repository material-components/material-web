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
class TestSwitch extends Switch {
}

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
  return html`
    <form>${renderSwitch(propsInit)}</form>
  `;
}

function renderSwitchInLabel(propsInit: Partial<TestSwitch> = {}) {
  return html`
    <label>${renderSwitch(propsInit)}</label>
  `;
}

describe('md-switch', () => {
  const env = new Environment();

  async function switchElement(
      propsInit: Partial<TestSwitch> = {}, template = renderSwitch) {
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

    it('sets `aria-checked` of button', () => {
      const toggleButton = toggle.shadowRoot!.querySelector('button')!;
      expect(toggleButton.getAttribute('aria-checked')).toEqual('false');

      const selectedButton = selected.shadowRoot!.querySelector('button')!;
      expect(selectedButton.getAttribute('aria-checked')).toEqual('true');
    });

    it('adds md3-switch--selected class when true', () => {
      const toggleRoot = toggle.shadowRoot!.querySelector('.md3-switch')!;
      expect(Array.from(toggleRoot.classList))
          .not.toContain('md3-switch--selected');

      const selectedRoot = selected.shadowRoot!.querySelector('.md3-switch')!;
      expect(Array.from(selectedRoot.classList))
          .toContain('md3-switch--selected');
    });

    it('adds md3-switch--unselected class when false', () => {
      const toggleRoot = toggle.shadowRoot!.querySelector('.md3-switch')!;
      expect(Array.from(toggleRoot.classList))
          .toContain('md3-switch--unselected');

      const selectedRoot = selected.shadowRoot!.querySelector('.md3-switch')!;
      expect(Array.from(selectedRoot.classList))
          .not.toContain('md3-switch--unselected');
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

    it('sets disabled of button', () => {
      const toggleButton = toggle.shadowRoot!.querySelector('button')!;
      expect(toggleButton.disabled).toBeFalse();

      const selectedButton = disabled.shadowRoot!.querySelector('button')!;
      expect(selectedButton.disabled).toBeTrue();
    });
  });

  describe('aria', () => {
    it('is an empty string by default', () => {
      expect(toggle.ariaLabel).toEqual('');
    });

    it('delegates aria-label to the proper element', async () => {
      const button = toggle.shadowRoot!.querySelector('button')!;
      toggle.setAttribute('aria-label', 'foo');
      await toggle.updateComplete;
      expect(toggle.ariaLabel).toEqual('foo');
      expect(toggle.getAttribute('aria-label')).toEqual(null);
      expect(button.getAttribute('aria-label')).toEqual('foo');
    });

    it('delegates .ariaLabel to the proper element', async () => {
      const button = toggle.shadowRoot!.querySelector('button')!;
      toggle.ariaLabel = 'foo';
      await toggle.updateComplete;
      expect(toggle.ariaLabel).toEqual('foo');
      expect(toggle.getAttribute('aria-label')).toEqual(null);
      expect(button.getAttribute('aria-label')).toEqual('foo');
    });

    it('delegates aria-labelledby to the proper element', async () => {
      const button = toggle.shadowRoot!.querySelector('button')!;
      toggle.setAttribute('aria-labelledby', 'foo');
      await toggle.updateComplete;
      expect(toggle.ariaLabelledBy).toEqual('foo');
      expect(toggle.getAttribute('aria-labelledby')).toEqual(null);
      expect(button.getAttribute('aria-labelledby')).toEqual('foo');
    });

    it('delegates .ariaLabelledBy to the proper element', async () => {
      const button = toggle.shadowRoot!.querySelector('button')!;
      toggle.ariaLabelledBy = 'foo';
      await toggle.updateComplete;
      expect(toggle.ariaLabelledBy).toEqual('foo');
      expect(toggle.getAttribute('aria-labelledby')).toEqual(null);
      expect(button.getAttribute('aria-labelledby')).toEqual('foo');
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
  });

  describe('form submission', () => {
    async function switchInForm(
        propsInit: Partial<TestSwitch> = {}, template = renderSwitchInForm) {
      const element = await switchElement(propsInit, template);
      return new Harness(element);
    }

    it('does not submit if not selected', async () => {
      const harness = await switchInForm({name: 'foo'});
      const formData = await harness.submitForm();
      expect(formData.get('foo')).toBeNull();
    });

    it('does not submit if disabled', async () => {
      const harness =
          await switchInForm({name: 'foo', selected: true, disabled: true});
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
      const harness =
          await switchInForm({name: 'foo', selected: true, value: 'bar'});
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
});
