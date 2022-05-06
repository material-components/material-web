/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {Button} from '@material/mwc-button/mwc-button.js';
import {html} from 'lit';

import {fixture, rafPromise, TestFixture} from '../../../test/src/util/helpers.js';

const ICON_SELECTOR = '.mdc-button__icon';

interface ButtonProps {
  disabled: boolean;
  unelevated: boolean;
  raised: boolean;
  dense: boolean;
  outlined: boolean;
  text: string;
  label: string;
  icon: string;
  trailingIcon: boolean;
}

const defaultButton = html`<mwc-button></mwc-button>`;

const button = (propsInit: Partial<ButtonProps>) => {
  return html`
    <mwc-button
      ?disabled=${propsInit.disabled === true}
      ?unelevated=${propsInit.unelevated === true}
      ?raised=${propsInit.raised === true}
      ?dense=${propsInit.dense === true}
      ?outlined=${propsInit.outlined === true}
      ?trailingIcon=${propsInit.trailingIcon === true}
      label=${propsInit.label ?? ''}
      icon=${propsInit.icon ?? ''}>${propsInit.text ?? ''}</mwc-button>
  `;
};

describe('mwc-button', () => {
  let fixt: TestFixture;
  let element: Button;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultButton);
      element = fixt.root.querySelector('mwc-button')!;
    });

    it('initializes as an mwc-button', () => {
      expect(element).toBeInstanceOf(Button);
      expect(element.raised).toBeFalse();
      expect(element.unelevated).toBeFalse();
      expect(element.outlined).toBeFalse();
      expect(element.dense).toBeFalse();
      expect(element.disabled).toBeFalse();
      expect(element.trailingIcon).toBeFalse();
      expect(element.fullwidth).toBeFalse();
      expect(element.icon).toEqual('');
      expect(element.label).toEqual('');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      fixt = await fixture(button({disabled: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    it('updates the disabled property on the native button element',
       async () => {
         const button = element.shadowRoot!.querySelector('button')!;

         expect(button.hasAttribute('disabled')).toBeTrue();

         element.disabled = false;
         await element.updateComplete;
         expect(button.hasAttribute('disabled')).toBeFalse();
       });
  });

  describe('icon', () => {
    beforeEach(async () => {
      fixt = await fixture(button({icon: 'check'}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    it('adds an icon to the button', async () => {
      let icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      expect(icon).toBeInstanceOf(Element);

      element.icon = '';
      await element.updateComplete;
      icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      expect(icon).toEqual(null);
    });

    it('setting `trailingIcon` displays icon in a trailing position',
       async () => {
         element.trailingIcon = true;
         await rafPromise();

         const leadingIcon = element.shadowRoot!.querySelector(
             `.leading-icon ${ICON_SELECTOR}`);
         const trailingIcon = element.shadowRoot!.querySelector(
             `.trailing-icon ${ICON_SELECTOR}`);
         expect(leadingIcon).toEqual(null);
         expect(trailingIcon).toBeInstanceOf(Element);
       });

    it('sets `aria-label` of the button when `icon` is set', async () => {
      const button = element.shadowRoot!.querySelector('#button');
      expect(button!.getAttribute('aria-label')).toEqual('check');
    });
  });

  describe('label', () => {
    beforeEach(async () => {
      fixt = await fixture(button({label: 'Unit Test Button'}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    it('sets `aria-label` of the button when `label` is set', async () => {
      const button = element.shadowRoot!.querySelector('#button');
      expect(button!.getAttribute('aria-label')).toEqual('Unit Test Button');
    });
  });

  describe('raised', () => {
    beforeEach(async () => {
      fixt = await fixture(button({raised: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    it('sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const raisedClass = 'mdc-button--raised';
      expect(button.classList.contains(raisedClass)).toBeTrue();
      element.raised = false;
      await element.updateComplete;
      expect(button.classList.contains(raisedClass)).toBeFalse();
    });
  });

  describe('unelevated', () => {
    beforeEach(async () => {
      fixt = await fixture(button({unelevated: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    it('sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const unelevatedClass = 'mdc-button--unelevated';
      expect(button.classList.contains(unelevatedClass)).toBeTrue();
      element.unelevated = false;
      await element.updateComplete;
      expect(button.classList.contains(unelevatedClass)).toBeFalse();
    });
  });

  describe('outlined', () => {
    beforeEach(async () => {
      fixt = await fixture(button({outlined: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    it('sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const outlinedClass = 'mdc-button--outlined';
      expect(button.classList.contains(outlinedClass)).toBeTrue();
      element.outlined = false;
      await element.updateComplete;
      expect(button.classList.contains(outlinedClass)).toBeFalse();
    });
  });

  describe('dense', () => {
    beforeEach(async () => {
      fixt = await fixture(button({dense: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    it('sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const denseClass = 'mdc-button--dense';
      expect(button.classList.contains(denseClass)).toBeTrue();
      element.dense = false;
      await element.updateComplete;
      expect(button.classList.contains(denseClass)).toBeFalse();
    });
  });

  describe('focus', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultButton);
      element = fixt.root.querySelector('mwc-button')!;
    });

    it('highlights and blurs', async () => {
      const focusedClass = 'mdc-ripple-upgraded--background-focused';
      const nativeButton =
          element.shadowRoot!.querySelector<HTMLButtonElement>('#button')!;
      expect(nativeButton.classList.contains(focusedClass)).toBeFalse();
      element.focus();
      const rippleElement = await element.ripple;
      const nativeRipple = rippleElement!.shadowRoot!.querySelector(
                               '.mdc-ripple-surface') as HTMLDivElement;
      element.requestUpdate();
      await element.updateComplete;
      await rafPromise();
      expect(nativeRipple.classList.contains(focusedClass)).toBeTrue();
      element.blur();
      element.requestUpdate();
      await element.updateComplete;
      await rafPromise();
      expect(nativeRipple.classList.contains(focusedClass)).toBeFalse();
    });
  });
});
