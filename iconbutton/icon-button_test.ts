/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../icon/icon.js';
import './icon-button.js';

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {IconButtonHarness} from './harness.js';
import {MdIconButton} from './icon-button.js';

const ICON_BUTTON_TEMPLATE = html`
  <md-icon-button aria-label="Star">
    <md-icon>star</md-icon>
  </md-icon-button>
`;
const LINK_ICON_BUTTON_TEMPLATE = html`
  <md-icon-button aria-label="Star" href="https://google.com">
    <md-icon>star</md-icon>
  </md-icon-button>
`;
const ICON_BUTTON_TOGGLE_TEMPLATE = html`
  <md-icon-button toggle aria-label="Star">
    <md-icon slot="onIcon">star</md-icon>
    <md-icon slot="offIcon">star_border</md-icon>
  </md-icon-button>
`;

interface IconButtonInternals {
  flipIcon: boolean;
}

describe('icon button tests', () => {
  const env = new Environment();

  describe('.styles', () => {
    createTokenTests(MdIconButton.styles);
  });

  describe('md-icon-button', () => {
    it(
      'setting `disabled` updates the disabled attribute on the native ' +
        'button element',
      async () => {
        const {element} = await setUpTest('button');
        const button = element.shadowRoot!.querySelector('button')!;

        element.disabled = true;
        await element.updateComplete;
        expect(button.hasAttribute('disabled')).toBeTrue();

        element.disabled = false;
        await element.updateComplete;
        expect(button.hasAttribute('disabled')).toBeFalse();
      },
    );

    it(
      'setting `ariaLabel` updates the aria-label attribute on the native ' +
        'button element',
      async () => {
        const {element} = await setUpTest('button');
        const button = element.shadowRoot!.querySelector('button')!;

        element.ariaLabel = 'test';
        await element.updateComplete;
        expect(button.getAttribute('aria-label')).toBe('test');
      },
    );
  });

  describe('md-icon-button link', () => {
    it(
      'setting `ariaLabel` updates the aria-label attribute on the anchor' +
        'tag',
      async () => {
        const {element} = await setUpTest('link');
        const anchor = element.shadowRoot!.querySelector('a')!;
        expect(anchor).not.toBeNull();

        element.ariaLabel = 'test';
        await element.updateComplete;
        expect(anchor.getAttribute('aria-label')).toBe('test');
      },
    );
  });

  describe('md-icon-button toggle', () => {
    it(
      'setting `disabled` updates the disabled attribute on the native ' +
        'button element',
      async () => {
        const {element} = await setUpTest('toggle');
        const button = element.shadowRoot!.querySelector('button')!;

        element.disabled = true;
        await element.updateComplete;
        expect(button.hasAttribute('disabled')).toBeTrue();

        element.disabled = false;
        await element.updateComplete;
        expect(button.hasAttribute('disabled')).toBeFalse();
      },
    );

    it(
      'setting `ariaLabel` updates the aria-label attribute on the native ' +
        'button element',
      async () => {
        const {element} = await setUpTest('toggle');
        const button = element.shadowRoot!.querySelector('button')!;

        element.ariaLabel = 'test';
        await element.updateComplete;
        expect(button.getAttribute('aria-label')).toBe('test');
      },
    );

    it('toggles the `selected` state when button is clicked', async () => {
      const {element, harness} = await setUpTest('toggle');

      expect(element.selected).toBeFalse();
      await harness.clickWithMouse();
      expect(element.selected).toBeTrue();
      await harness.clickWithMouse();
      expect(element.selected).toBeFalse();
    });

    it('fires input and change events when clicked', async () => {
      const {element, harness} = await setUpTest('toggle');
      let changeEvent = false;
      let inputEvent = false;
      element.addEventListener('input', () => (inputEvent = true));
      element.addEventListener('change', () => (changeEvent = true));
      expect(element.selected).toBeFalse();
      await harness.clickWithMouse();
      expect(element.selected).toBeTrue();
      expect(inputEvent).toBeTrue();
      expect(changeEvent).toBeTrue();
    });

    it('setting `selected` updates the aria-pressed attribute on the native button element', async () => {
      const {element} = await setUpTest('toggle');

      element.selected = true;
      await element.updateComplete;
      const button = element.shadowRoot!.querySelector('button')!;
      expect(button.getAttribute('aria-pressed')).toEqual('true');

      element.selected = false;
      await element.updateComplete;
      expect(button.getAttribute('aria-pressed')).toEqual('false');
    });

    it('button with toggled aria label toggles aria label', async () => {
      const {element, harness} = await setUpTest('toggle');
      element.ariaLabelSelected = 'aria label on';
      element.ariaLabel = 'aria label off';
      await element.updateComplete;

      const button = element.shadowRoot!.querySelector('button')!;
      expect(element.selected).toBeFalse();
      expect(button.getAttribute('aria-label')).toEqual('aria label off');

      // Toggle
      await harness.clickWithMouse();
      await element.updateComplete;
      expect(element.selected).toBeTrue();
      expect(button.getAttribute('aria-label')).toEqual('aria label on');
    });

    it('if `flipsIconInRtl=true`, flips icon in an RTL context', async () => {
      const template = html` <div dir="rtl">
        <md-icon-button aria-label="Star" .flipIconInRtl="${true}">
          star
        </md-icon-button>
      </div>`;
      const element = env.render(template).querySelector('md-icon-button')!;
      await env.waitForStability();

      expect((element as unknown as IconButtonInternals).flipIcon).toBeTrue();
    });

    it('if `flipsIconInRtl=true`, does not flip icon in an LTR context', async () => {
      const template = html` <div dir="ltr">
        <md-icon-button aria-label="Star" .flipIconInRtl="${true}">
          star
        </md-icon-button>
      </div>`;
      const element = env.render(template).querySelector('md-icon-button')!;
      await env.waitForStability();

      expect((element as unknown as IconButtonInternals).flipIcon).toBeFalse();
    });

    it('should allow preventing toggle click event', async () => {
      const {element, harness} = await setUpTest('toggle');

      element.addEventListener('click', (event) => {
        event.preventDefault();
      });

      expect(element.selected).withContext('selected before click').toBeFalse();
      await harness.clickWithMouse();
      expect(element.selected)
        .withContext('selected after prevent default click')
        .toBeFalse();
    });
  });

  async function setUpTest(type: string) {
    let template;
    switch (type) {
      case 'button':
        template = ICON_BUTTON_TEMPLATE;
        break;
      case 'link':
        template = LINK_ICON_BUTTON_TEMPLATE;
        break;
      case 'toggle':
        template = ICON_BUTTON_TOGGLE_TEMPLATE;
        break;
      default:
        throw new Error('Invalid tag name: ' + type);
    }

    const element = env.render(template).querySelector('md-icon-button')!;
    await env.waitForStability();
    return {
      element,
      harness: new IconButtonHarness(element),
    };
  }
});
