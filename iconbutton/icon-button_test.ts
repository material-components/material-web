/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './standard-link-icon-button.js';
import './standard-icon-button.js';

import {html} from 'lit';

import {Environment} from '../testing/environment.js';

import {IconButtonHarness} from './harness.js';
import {MdStandardIconButton} from './standard-icon-button.js';

const ICON_BUTTON_TEMPLATE = html`
  <md-standard-icon-button aria-label="Star">
    star
  </md-standard-icon-button>
`;
const LINK_ICON_BUTTON_TEMPLATE = html`
  <md-standard-link-icon-button aria-label="Star">
    star
  </md-standard-link-icon-button>
`;
const ICON_BUTTON_TOGGLE_TEMPLATE = html`
  <md-standard-icon-button aria-label="Star">
      <md-icon slot="selectedIcon">star</md-icon>
      <md-icon>star_border</md-icon>
  </md-standard-icon-button>
`;

interface IconButtonInternals {
  flipIcon: boolean;
}

describe('icon button tests', () => {
  const env = new Environment();

  describe('md-standard-icon-button', () => {
    it('setting `disabled` updates the disabled attribute on the native ' +
           'button element',
       async () => {
         const {element} = await setUpTest('icon');
         const button = element.shadowRoot!.querySelector('button')!;

         element.disabled = true;
         await element.updateComplete;
         expect(button.hasAttribute('disabled')).toBeTrue();

         element.disabled = false;
         await element.updateComplete;
         expect(button.hasAttribute('disabled')).toBeFalse();
       });

    it('setting `ariaLabel` updates the aria-label attribute on the native ' +
           'button element',
       async () => {
         const {element} = await setUpTest('icon');
         const button = element.shadowRoot!.querySelector('button')!;

         element.ariaLabel = 'test';
         await element.updateComplete;
         expect(button.getAttribute('aria-label')).toBe('test');
       });
  });

  describe('md-standard-link-icon-button', () => {
    it('setting `ariaLabel` updates the aria-label attribute on the anchor' +
           'tag',
       async () => {
         const {element} = await setUpTest('link');
         const anchor = element.shadowRoot!.querySelector('a')!;

         element.ariaLabel = 'test';
         await element.updateComplete;
         expect(anchor.getAttribute('aria-label')).toBe('test');
       });
  });

  describe('md-standard-icon-button-toggle', () => {
    it('setting `disabled` updates the disabled attribute on the native ' +
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
       });

    it('setting `ariaLabel` updates the aria-label attribute on the native ' +
           'button element',
       async () => {
         const {element} = await setUpTest('toggle');
         const button = element.shadowRoot!.querySelector('button')!;

         element.ariaLabel = 'test';
         await element.updateComplete;
         expect(button.getAttribute('aria-label')).toBe('test');
       });

    it('toggles the `selected` state when button is clicked', async () => {
      const {element, harness} = await setUpTest('toggle');
      if (!(element instanceof MdStandardIconButton)) {
        throw new Error('Icon button is not instance of MdStandardIconButton.');
      }

      expect(element.selected).toBeFalse();
      await harness.clickWithMouse();
      expect(element.selected).toBeTrue();
      await harness.clickWithMouse();
      expect(element.selected).toBeFalse();
    });

    it('setting `selected` updates the aria-pressed attribute on the native button element',
       async () => {
         const {element} = await setUpTest('toggle');
         if (!(element instanceof MdStandardIconButton)) {
           throw new Error(
               'Icon button is not instance of MdStandardIconButton.');
         }

         element.selected = true;
         await element.updateComplete;
         const button = element.shadowRoot!.querySelector('button')!;
         expect(button.getAttribute('aria-pressed')).toEqual('true');

         element.selected = false;
         await element.updateComplete;
         expect(button.getAttribute('aria-pressed')).toEqual('false');
       });

    it('button with toggled aria label toggles aria label', async () => {
      const {element} = await setUpTest('toggle');
      if (!(element instanceof MdStandardIconButton)) {
        throw new Error('Icon button is not instance of MdStandardIconButton.');
      }
      element.ariaLabelSelected = 'aria label on';
      element.ariaLabel = 'aria label off';
      await element.updateComplete;

      const button = element.shadowRoot!.querySelector('button')!;
      expect(element.selected).toBeFalse();
      expect(button.getAttribute('aria-label')).toEqual('aria label off');
      expect(button.getAttribute('aria-pressed')).toBeNull();

      // Toggle
      button.click();
      await element.updateComplete;
      expect(element.selected).toBeTrue();
      expect(button.getAttribute('aria-label')).toEqual('aria label on');
      expect(button.getAttribute('aria-pressed')).toBeNull();
    });

    it('if `flipsIconInRtl=true`, flips icon in an RTL context', async () => {
      const template = html`
          <div dir="rtl">
            <md-standard-icon-button aria-label="Star" .flipIconInRtl="${true}">
                star
            </md-standard-icon-button>
          </div>`;
      const element =
          env.render(template).querySelector('md-standard-icon-button')!;
      await env.waitForStability();

      expect((element as unknown as IconButtonInternals).flipIcon).toBeTrue();
    });

    it('if `flipsIconInRtl=true`, does not flip icon in an LTR context',
       async () => {
         const template = html`
            <div dir="ltr">
              <md-standard-icon-button aria-label="Star" .flipIconInRtl="${
             true}">
                  star
              </md-standard-icon-button>
            </div>`;
         const element =
             env.render(template).querySelector('md-standard-icon-button')!;
         await env.waitForStability();

         expect((element as unknown as IconButtonInternals).flipIcon)
             .toBeFalse();
       });
  });

  async function setUpTest(suite: string) {
    let template;
    switch (suite) {
      case 'icon':
        template = ICON_BUTTON_TEMPLATE;
        break;
      case 'link':
        template = LINK_ICON_BUTTON_TEMPLATE;
        break;
      case 'toggle':
        template = ICON_BUTTON_TOGGLE_TEMPLATE;
        break;
      default:
        throw new Error(`Invalid suite name: ${suite}`);
    }

    const tagName = suite === 'link' ? 'md-standard-link-icon-button' :
                                       'md-standard-icon-button';

    const element = env.render(template).querySelector(tagName)!;
    await env.waitForStability();
    return {
      element,
      harness: new IconButtonHarness(element),
    };
  }
});
