/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {ifDefined} from 'lit/directives/if-defined.js';

import {fixture, simulateFormDataEvent, TestFixture} from '../../../../test/src/util/helpers.js';

import {Switch} from './switch.js';

@customElement('md-test-switch')
class TestSwitch extends Switch {
}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-switch': TestSwitch;
  }
}

interface SwitchProps {
  selected: boolean;
  disabled: boolean;
  name: string;
  value: string;
}

function renderSwitch(propsInit: Partial<SwitchProps> = {}) {
  return html`
    <md-test-switch
      ?selected=${propsInit.selected === true}
      ?disabled=${propsInit.disabled === true}
      .name=${propsInit.name ?? ''}
      value=${ifDefined(propsInit.value)}></md-test-switch>
  `;
}

function renderSwitchInForm(propsInit: Partial<SwitchProps> = {}) {
  return html`
    <form>${renderSwitch(propsInit)}</form>
  `;
}

describe('md-switch', () => {
  const fixtures: TestFixture[] = [];

  async function switchElement(
      propsInit: Partial<SwitchProps> = {}, template = renderSwitch) {
    const fixt = await fixture(template(propsInit));

    fixtures.push(fixt);
    const element = fixt.root.querySelector('md-test-switch')!;
    await element.updateComplete;
    return element;
  }

  afterEach(() => {
    for (const fixt of fixtures) {
      fixt.remove();
    }
  });

  let toggle: TestSwitch;

  beforeEach(async () => {
    toggle = await switchElement();
  });

  describe('selected', () => {
    let selected: TestSwitch;

    beforeEach(async () => {
      selected = await switchElement({selected: true});
    });

    it('should be false by default', () => {
      expect(toggle.selected).toBeFalse();
    });

    it('should set `aria-checked` of button', () => {
      const toggleButton = toggle.shadowRoot!.querySelector('button')!;
      expect(toggleButton.getAttribute('aria-checked')).toEqual('false');

      const selectedButton = selected.shadowRoot!.querySelector('button')!;
      expect(selectedButton.getAttribute('aria-checked')).toEqual('true');
    });

    it('should set checked of hidden input', () => {
      const toggleInput = toggle.shadowRoot!.querySelector('input')!;
      expect(toggleInput.checked).toBeFalse();

      const selectedInput = selected.shadowRoot!.querySelector('input')!;
      expect(selectedInput.checked).toBeTrue();
    });

    it('should add md3-switch--selected class when true', () => {
      const toggleRoot = toggle.shadowRoot!.querySelector('.md3-switch')!;
      expect(Array.from(toggleRoot.classList))
          .not.toContain('md3-switch--selected');

      const selectedRoot = selected.shadowRoot!.querySelector('.md3-switch')!;
      expect(Array.from(selectedRoot.classList))
          .toContain('md3-switch--selected');
    });

    it('should add md3-switch--unselected class when false', () => {
      const toggleRoot = toggle.shadowRoot!.querySelector('.md3-switch')!;
      expect(Array.from(toggleRoot.classList))
          .toContain('md3-switch--unselected');

      const selectedRoot = selected.shadowRoot!.querySelector('.md3-switch')!;
      expect(Array.from(selectedRoot.classList))
          .not.toContain('md3-switch--unselected');
    });
  });

  describe('processing', () => {
    it('should be false by default', () => {
      expect(toggle.processing).toBeFalse();
    });
  });

  describe('disabled', () => {
    let disabled: TestSwitch;

    beforeEach(async () => {
      disabled = await switchElement({disabled: true});
    });

    it('should be false by default', () => {
      expect(toggle.disabled).toBeFalse();
    });

    it('should set disabled of button', () => {
      const toggleButton = toggle.shadowRoot!.querySelector('button')!;
      expect(toggleButton.disabled).toBeFalse();

      const selectedButton = disabled.shadowRoot!.querySelector('button')!;
      expect(selectedButton.disabled).toBeTrue();
    });
  });

  describe('aria', () => {
    it('should be an empty string by default', () => {
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
    let named: TestSwitch;

    beforeEach(async () => {
      named = await switchElement({name: 'foo'});
    });

    it('should be an empty string by default', () => {
      expect(toggle.name).toEqual('');
    });

    it('should reflect as an attribute', async () => {
      toggle.name = 'foo';
      await toggle.updateComplete;
      expect(toggle.getAttribute('name')).toEqual('foo');
    });

    it('should set name of hidden input', () => {
      const input = named.shadowRoot!.querySelector('input')!;
      expect(input.getAttribute('name')).toEqual('foo');
    });
  });

  describe('value', () => {
    let withValue: TestSwitch;

    beforeEach(async () => {
      withValue = await switchElement({value: 'bar'});
    });

    it('should be "on" by default', () => {
      expect(toggle.value).toEqual('on');
    });

    it('should set value of hidden input', () => {
      const input = withValue.shadowRoot!.querySelector('input')!;
      expect(input.value).toEqual('bar');
    });
  });

  describe('click()', () => {
    it('should toggle element', () => {
      expect(toggle.selected).withContext('is false by default').toBeFalse();
      toggle.click();
      expect(toggle.selected).withContext('should toggle selected').toBeTrue();
    });

    it('should do nothing if disabled', () => {
      expect(toggle.selected).withContext('is false by default').toBeFalse();
      toggle.disabled = true;
      toggle.click();
      expect(toggle.selected).withContext('should remain false').toBeFalse();
    });

    it('should not focus or click hidden input form element', () => {
      const input = toggle.shadowRoot!.querySelector('input')!;
      spyOn(input, 'focus');
      spyOn(input, 'click');
      toggle.click();
      expect(input.focus).not.toHaveBeenCalled();
      expect(input.click).not.toHaveBeenCalled();
    });
  });

  // IE11 can only append to FormData, not inspect it
  if (Boolean(FormData.prototype.get)) {
    describe('form submission', () => {
      let form: HTMLFormElement;

      it('does not submit if not selected', async () => {
        toggle = await switchElement({name: 'foo'}, renderSwitchInForm);
        form = toggle.parentElement as HTMLFormElement;
        const formData = simulateFormDataEvent(form);
        expect(formData.get('foo')).toBeNull();
      });

      it('does not submit if disabled', async () => {
        toggle = await switchElement(
            {name: 'foo', selected: true, disabled: true}, renderSwitchInForm);
        form = toggle.parentElement as HTMLFormElement;
        const formData = simulateFormDataEvent(form);
        expect(formData.get('foo')).toBeNull();
      });

      it('does not submit if name is not provided', async () => {
        toggle = await switchElement({selected: true}, renderSwitchInForm);
        form = toggle.parentElement as HTMLFormElement;
        const formData = simulateFormDataEvent(form);
        const keys = Array.from(formData.keys());
        expect(keys.length).toEqual(0);
      });

      it('submits under correct conditions', async () => {
        toggle = await switchElement(
            {name: 'foo', selected: true, value: 'bar'}, renderSwitchInForm);
        form = toggle.parentElement as HTMLFormElement;
        const formData = simulateFormDataEvent(form);
        expect(formData.get('foo')).toEqual('bar');
      });
    });
  }
});
