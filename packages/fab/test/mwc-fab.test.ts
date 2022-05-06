/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {Fab} from '@material/mwc-fab/mwc-fab.js';
import {html} from 'lit';

import {fixture, TestFixture} from '../../../test/src/util/helpers.js';

interface FabProps {
  text: string;
  mini: boolean;
  exited: boolean;
  disabled: boolean;
  extended: boolean;
  showIconAtEnd: boolean;
  icon: string;
  label: string;
  reducedTouchTarget: boolean;
}

const defaultFab = html`<mwc-fab></mwc-fab>`;

const fab = (propsInit: Partial<FabProps>) => {
  return html`
    <mwc-fab
      ?mini=${propsInit.mini === true}
      ?exited=${propsInit.exited === true}
      ?disabled=${propsInit.disabled === true}
      ?extended=${propsInit.extended === true}
      .showIconAtEnd=${propsInit.showIconAtEnd === true}
      .reducedTouchTarget=${propsInit.reducedTouchTarget === true}
      icon=${propsInit.icon ?? ''}
      label=${propsInit.label ?? ''}>${propsInit.text ?? ''}</mwc-fab>
  `;
};

const ICON_SELECTOR = '.mdc-fab__icon';
const LABEL_SELECTOR = '.mdc-fab__label';
const TOUCH_SELECTOR = '.mdc-fab__touch';
const TOUCH_CLASS = 'mdc-fab--touch';

describe('mwc-fab', () => {
  let fixt: TestFixture;
  let element: Fab;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultFab);
      element = fixt.root.querySelector('mwc-fab')!;
    });

    it('initializes as an mwc-fab', () => {
      expect(element).toBeInstanceOf(Fab);
      expect(element.mini).toEqual(false);
      expect(element.exited).toEqual(false);
      expect(element.disabled).toEqual(false);
      expect(element.extended).toEqual(false);
      expect(element.showIconAtEnd).toEqual(false);
      expect(element.reducedTouchTarget).toEqual(false);
      expect(element.icon).toEqual('');
      expect(element.label).toEqual('');
    });
  });

  describe('disabled', () => {
    beforeEach(async () => {
      fixt = await fixture(fab({disabled: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    it('set updates the disabled property on the native button element',
       async () => {
         const button = element.shadowRoot!.querySelector('button')!;
         expect(element.disabled).toEqual(true);
         expect(button.hasAttribute('disabled')).toEqual(true);

         element.disabled = false;
         await element.updateComplete;
         expect(button.hasAttribute('disabled')).toEqual(false);
       });
  });

  describe('icon', () => {
    beforeEach(async () => {
      fixt = await fixture(fab({icon: 'check'}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    it('setting adds an icon to the fab', async () => {
      let icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      expect(element.icon).toEqual('check');
      expect(icon).toBeInstanceOf(Element);

      element.icon = 'home';
      await element.updateComplete;
      icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      expect(icon).toBeInstanceOf(Element);

      element.icon = '';
      await element.updateComplete;
      icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      const iconText = icon?.textContent?.replace(/\s/g, '') ?? '';
      expect(iconText).toEqual('');
    });

    it('sets `aria-label` of the button', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      expect(button.getAttribute('aria-label')).toEqual('check');
    });
  });

  describe('label', () => {
    beforeEach(async () => {
      fixt = await fixture(fab({label: 'label text', icon: 'check'}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    it('sets `aria-label` of the button, overriding `icon`', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      expect(element.label).toEqual('label text');
      expect(button.getAttribute('aria-label')).toEqual('label text');

      element.label = '';
      await element.updateComplete;
      expect(button.getAttribute('aria-label')).toEqual('check');
    });
  });

  describe('mini', () => {
    beforeEach(async () => {
      fixt = await fixture(fab({mini: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    it('sets the correct inner class', async () => {
      const miniClass = 'mdc-fab--mini';
      const button = element.shadowRoot!.querySelector('.mdc-fab')!;
      expect(element.mini).toBeTrue();
      expect(button.classList.contains(miniClass)).toBeTrue();
      element.mini = false;
      await element.updateComplete;
      expect(button.classList.contains(miniClass)).toBeFalse();
    });
  });

  describe('exited', () => {
    beforeEach(async () => {
      fixt = await fixture(fab({exited: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    it('sets the correct inner class', async () => {
      const exitedClass = 'mdc-fab--exited';
      const button = element.shadowRoot!.querySelector('.mdc-fab')!;
      expect(element.exited).toBeTrue();
      expect(button.classList.contains(exitedClass)).toBeTrue();
      element.exited = false;
      await element.updateComplete;
      expect(button.classList.contains(exitedClass)).toBeFalse();
    });
  });

  describe('extended', () => {
    beforeEach(async () => {
      fixt = await fixture(fab({extended: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    it('sets the correct inner class', async () => {
      const extendedClass = 'mdc-fab--extended';
      const button = element.shadowRoot!.querySelector('.mdc-fab')!;
      expect(element.extended).toBeTrue();
      expect(button.classList.contains(extendedClass)).toBeTrue();
      element.extended = false;
      await element.updateComplete;
      expect(button.classList.contains(extendedClass)).toBeFalse();
    });

    it('displays label if set', async () => {
      let label = element.shadowRoot!.querySelector(LABEL_SELECTOR);
      expect(label).toEqual(null);
      element.label = 'foo';
      await element.updateComplete;
      label = element.shadowRoot!.querySelector(LABEL_SELECTOR);
      expect(label).toBeInstanceOf(Element);
      expect(label!.textContent).toEqual('foo');
      element.extended = false;
      await element.updateComplete;
      label = element.shadowRoot!.querySelector(LABEL_SELECTOR);
      expect(label).toEqual(null);
    });
  });

  describe('showIconAtEnd', () => {
    beforeEach(async () => {
      fixt = await fixture(fab(
          {showIconAtEnd: true, icon: 'check', label: 'foo', extended: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    it('displays icon after label', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-fab')!;
      const LABEL_CLASS = 'mdc-fab__label';
      const ICON_CLASS = 'mdc-fab__icon';

      const children = root.children;

      expect(element.showIconAtEnd).toBeTrue();
      expect(children[1].classList.contains(ICON_CLASS)).toBeTrue();
      expect(children[0].classList.contains(LABEL_CLASS)).toBeTrue();

      element.showIconAtEnd = false;
      await element.updateComplete;

      expect(children.length).toEqual(2);
      expect(children[0].classList.contains(ICON_CLASS)).toBeTrue();
      expect(children[1].classList.contains(LABEL_CLASS)).toBeTrue();
    });
  });

  describe('reducedTouchTarget', () => {
    beforeEach(async () => {
      fixt = await fixture(
          fab({reducedTouchTarget: true, mini: true, icon: 'check'}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    it('sets correct classes', async () => {
      const button = element.shadowRoot!.querySelector('.mdc-fab')!;

      expect(button.classList.contains(TOUCH_CLASS)).toBeFalse();

      element.reducedTouchTarget = false;
      await element.updateComplete;

      expect(button.classList.contains(TOUCH_CLASS)).toBeTrue();
    });

    it('hides touch target', async () => {
      let target = element.shadowRoot!.querySelector(TOUCH_SELECTOR);
      expect(element.reducedTouchTarget).toBeTrue();
      expect(target).toEqual(null);

      element.reducedTouchTarget = false;
      await element.updateComplete;

      target = element.shadowRoot!.querySelector(TOUCH_SELECTOR);
      expect(target).toBeInstanceOf(Element);
    });
  });
});
