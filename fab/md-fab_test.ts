/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {fixture, TestFixture} from '@material/web/compat/testing/helpers.js';  // TODO(b/235474830): remove the use of fixtures
import {MdFocusRing} from '@material/web/focus/focus-ring.js';
import {MdIcon} from '@material/web/icon/icon.js';
import {html} from 'lit';

import {MdFabExtended} from './fab-extended.js';
import {FabHarness} from './harness.js';

describe('md-fab-extended', () => {
  let fixt: TestFixture;
  let element: MdFabExtended;
  let harness: FabHarness;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(html`<md-fab-extended></md-fab-extended>`);
      element = fixt.root.querySelector('md-fab-extended')!;
      harness = new FabHarness(element);
    });

    it('initializes as an md-fab-extended', () => {
      expect(element).toBeInstanceOf(MdFabExtended);
      expect(element.lowered).toEqual(false);
      expect(element.disabled).toEqual(false);
      expect(element.label).toEqual('');
      expect(element.icon).toEqual('');
    });
  });

  describe('lowered', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-fab-extended
          ?lowered=${true}>
        </md-fab-extended>
      `);
      element = fixt.root.querySelector('md-fab-extended')!;
      harness = new FabHarness(element);
      await element.updateComplete;
    });

    it('sets the correct classes', async () => {
      const button = await harness.getInteractiveElement();
      expect(button.classList.contains('md3-fab--lowered')).toBeTrue();
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-fab-extended
          ?disabled=${true}>
        </md-fab-extended>
      `);
      element = fixt.root.querySelector('md-fab-extended')!;
      harness = new FabHarness(element);
      await element.updateComplete;
    });

    it('get/set updates the disabled property on the native button element',
       async () => {
         const button = await harness.getInteractiveElement();

         expect(button.disabled).toEqual(true);
         element.disabled = false;
         await element.updateComplete;
         expect(button.disabled).toEqual(false);
       });
  });

  describe('icon', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-fab-extended
          icon="star">
        </md-fab-extended>
      `);
      element = fixt.root.querySelector('md-fab-extended')!;
      harness = new FabHarness(element);
      await element.updateComplete;
    });

    it('will generate an md-icon', async () => {
      const icon = (await harness.getInteractiveElement())
                       .querySelector<MdIcon>('md-icon')!;
      expect(icon.textContent!.trim()).toEqual('star');
    });

    it('serves as `aria-label` of native button when label is empty',
       async () => {
         const button = await harness.getInteractiveElement();
         expect(button.getAttribute('aria-label')).toEqual('star');
       });
  });

  describe('icon slot', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-fab-extended>
          <i slot="icon" class="material-icons">star</i>
        </md-fab-extended>
      `);
      element = fixt.root.querySelector('md-fab-extended')!;
      harness = new FabHarness(element);
      await element.updateComplete;
    });

    it('node with `slot=icon` will serve as the fab icon', () => {
      const icon = element.querySelector<HTMLElement>('[slot="icon"]')!;
      expect(icon.textContent!.trim()).toEqual('star');
    });
  });

  describe('label', () => {
    beforeEach(async () => {
      fixt = await fixture(html`
        <md-fab-extended
          label="foo">
        </md-fab-extended>
      `);
      element = fixt.root.querySelector('md-fab-extended')!;
      harness = new FabHarness(element);
      await element.updateComplete;
    });

    it('displays label text', async () => {
      const content = (await harness.getInteractiveElement())
                          .querySelector('.md3-fab__label')!;
      expect(content.textContent!.trim()).toEqual('foo');
    });

    it('serves as `aria-label` of native button', async () => {
      const button = await harness.getInteractiveElement();
      expect(button.getAttribute('aria-label')).toEqual('foo');
    });
  });

  describe('focus ring', () => {
    let focusRing: MdFocusRing;

    beforeEach(async () => {
      fixt = await fixture(html`<md-fab-extended></md-fab-extended>`);
      element = fixt.root.querySelector('md-fab-extended')!;
      focusRing = element.shadowRoot!.querySelector('md-focus-ring')!;
      harness = new FabHarness(element);
    });

    it('hidden on non-keyboard focus', async () => {
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });

    it('visible on keyboard focus and hides on blur', async () => {
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.blur();
      expect(focusRing.visible).toBeFalse();
    });

    it('hidden after pointer interaction', async () => {
      await harness.focusWithKeyboard();
      expect(focusRing.visible).toBeTrue();
      await harness.clickWithMouse();
      expect(focusRing.visible).toBeFalse();
    });
  });
});
