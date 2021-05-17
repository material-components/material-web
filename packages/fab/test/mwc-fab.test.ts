/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {Fab} from '@material/mwc-fab';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

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

suite('mwc-fab', () => {
  let fixt: TestFixture;
  let element: Fab;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultFab);
      element = fixt.root.querySelector('mwc-fab')!;
    });

    test('initializes as an mwc-fab', () => {
      assert.instanceOf(element, Fab);
      assert.equal(element.mini, false);
      assert.equal(element.exited, false);
      assert.equal(element.disabled, false);
      assert.equal(element.extended, false);
      assert.equal(element.showIconAtEnd, false);
      assert.equal(element.reducedTouchTarget, false);
      assert.equal(element.icon, '');
      assert.equal(element.label, '');
    });
  });

  suite('disabled', () => {
    setup(async () => {
      fixt = await fixture(fab({disabled: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    test(
        'set updates the disabled property on the native button element',
        async () => {
          const button = element.shadowRoot!.querySelector('button')!;
          assert.equal(element.disabled, true);
          assert.equal(button.hasAttribute('disabled'), true);

          element.disabled = false;
          await element.updateComplete;
          assert.equal(button.hasAttribute('disabled'), false);
        });
  });

  suite('icon', () => {
    setup(async () => {
      fixt = await fixture(fab({icon: 'check'}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    test('setting adds an icon to the fab', async () => {
      let icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      assert.equal(element.icon, 'check');
      assert.instanceOf(icon, Element);

      element.icon = 'home';
      await element.updateComplete;
      icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      assert.instanceOf(icon, Element);

      element.icon = '';
      await element.updateComplete;
      icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      assert.equal(icon, null);
    });

    test('sets `aria-label` of the button', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      assert.equal(button.getAttribute('aria-label'), 'check');
    });
  });

  suite('label', () => {
    setup(async () => {
      fixt = await fixture(fab({label: 'label text', icon: 'check'}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    test('sets `aria-label` of the button, overriding `icon`', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      assert.equal(element.label, 'label text');
      assert.equal(button.getAttribute('aria-label'), 'label text');

      element.label = '';
      await element.updateComplete;
      assert.equal(button.getAttribute('aria-label'), 'check');
    });
  });

  suite('mini', () => {
    setup(async () => {
      fixt = await fixture(fab({mini: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    test('sets the correct inner class', async () => {
      const miniClass = 'mdc-fab--mini';
      const button = element.shadowRoot!.querySelector('.mdc-fab')!;
      assert.isTrue(element.mini);
      assert.isTrue(button.classList.contains(miniClass));
      element.mini = false;
      await element.updateComplete;
      assert.isFalse(button.classList.contains(miniClass));
    });
  });

  suite('exited', () => {
    setup(async () => {
      fixt = await fixture(fab({exited: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    test('sets the correct inner class', async () => {
      const exitedClass = 'mdc-fab--exited';
      const button = element.shadowRoot!.querySelector('.mdc-fab')!;
      assert.isTrue(element.exited);
      assert.isTrue(button.classList.contains(exitedClass));
      element.exited = false;
      await element.updateComplete;
      assert.isFalse(button.classList.contains(exitedClass));
    });
  });

  suite('extended', () => {
    setup(async () => {
      fixt = await fixture(fab({extended: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    test('sets the correct inner class', async () => {
      const extendedClass = 'mdc-fab--extended';
      const button = element.shadowRoot!.querySelector('.mdc-fab')!;
      assert.isTrue(element.extended);
      assert.isTrue(button.classList.contains(extendedClass));
      element.extended = false;
      await element.updateComplete;
      assert.isFalse(button.classList.contains(extendedClass));
    });

    test('displays label if set', async () => {
      let label = element.shadowRoot!.querySelector(LABEL_SELECTOR);
      assert.equal(label, null);
      element.label = 'foo';
      await element.updateComplete;
      label = element.shadowRoot!.querySelector(LABEL_SELECTOR);
      assert.instanceOf(label, Element);
      assert.equal(label!.textContent, 'foo');
      element.extended = false;
      await element.updateComplete;
      label = element.shadowRoot!.querySelector(LABEL_SELECTOR);
      assert.equal(label, null);
    });
  });

  suite('showIconAtEnd', () => {
    setup(async () => {
      fixt = await fixture(fab(
          {showIconAtEnd: true, icon: 'check', label: 'foo', extended: true}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    test('displays icon after label', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-fab')!;
      const LABEL_CLASS = 'mdc-fab__label';
      const ICON_CLASS = 'mdc-fab__icon';

      const children = root.children;

      assert.isTrue(element.showIconAtEnd);
      assert.isTrue(
          children[1].querySelector(ICON_SELECTOR)!.classList.contains(
              ICON_CLASS));
      assert.isTrue(children[0].classList.contains(LABEL_CLASS));

      element.showIconAtEnd = false;
      await element.updateComplete;

      assert.equal(children.length, 2);
      assert.isTrue(
          children[0].querySelector(ICON_SELECTOR)!.classList.contains(
              ICON_CLASS));
      assert.isTrue(children[1].classList.contains(LABEL_CLASS));
    });
  });

  suite('reducedTouchTarget', () => {
    setup(async () => {
      fixt = await fixture(
          fab({reducedTouchTarget: true, mini: true, icon: 'check'}));
      element = fixt.root.querySelector('mwc-fab')!;
      await element.updateComplete;
    });

    test('sets correct classes', async () => {
      const button = element.shadowRoot!.querySelector('.mdc-fab')!;

      assert.isFalse(button.classList.contains(TOUCH_CLASS));

      element.reducedTouchTarget = false;
      await element.updateComplete;

      assert.isTrue(button.classList.contains(TOUCH_CLASS));
    });

    test('hides touch target', async () => {
      let target = element.shadowRoot!.querySelector(TOUCH_SELECTOR);
      assert.isTrue(element.reducedTouchTarget);
      assert.equal(target, null);

      element.reducedTouchTarget = false;
      await element.updateComplete;

      target = element.shadowRoot!.querySelector(TOUCH_SELECTOR);
      assert.instanceOf(target, Element);
    });
  });
});
