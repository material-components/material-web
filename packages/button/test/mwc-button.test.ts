/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {Button} from '@material/mwc-button';
import {html} from 'lit-html';

import {fixture, rafPromise, TestFixture} from '../../../test/src/util/helpers';

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

suite('mwc-button', () => {
  let fixt: TestFixture;
  let element: Button;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultButton);
      element = fixt.root.querySelector('mwc-button')!;
    });

    test('initializes as an mwc-button', () => {
      assert.instanceOf(element, Button);
      assert.isFalse(element.raised);
      assert.isFalse(element.unelevated);
      assert.isFalse(element.outlined);
      assert.isFalse(element.dense);
      assert.isFalse(element.disabled);
      assert.isFalse(element.trailingIcon);
      assert.isFalse(element.fullwidth);
      assert.equal(element.icon, '');
      assert.equal(element.label, '');
    });
  });

  suite('disabled', () => {
    setup(async () => {
      fixt = await fixture(button({disabled: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    test(
        'updates the disabled property on the native button element',
        async () => {
          const button = element.shadowRoot!.querySelector('button')!;

          assert.isTrue(button.hasAttribute('disabled'));

          element.disabled = false;
          await element.updateComplete;
          assert.isFalse(button.hasAttribute('disabled'));
        });
  });

  suite('icon', () => {
    setup(async () => {
      fixt = await fixture(button({icon: 'check'}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    test('adds an icon to the button', async () => {
      let icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      assert.instanceOf(icon, Element);

      element.icon = '';
      await element.updateComplete;
      icon = element.shadowRoot!.querySelector(ICON_SELECTOR);
      assert.equal(icon, null);
    });

    test(
        'setting `trailingIcon` displays icon in a trailing position',
        async () => {
          element.trailingIcon = true;
          await rafPromise();

          const leadingIcon = element.shadowRoot!.querySelector(
              `.leading-icon ${ICON_SELECTOR}`);
          const trailingIcon = element.shadowRoot!.querySelector(
              `.trailing-icon ${ICON_SELECTOR}`);
          assert.equal(leadingIcon, null);
          assert.instanceOf(trailingIcon, Element);
        });

    test('sets `aria-label` of the button when `icon` is set', async () => {
      const button = element.shadowRoot!.querySelector('#button');
      assert.equal(button!.getAttribute('aria-label'), 'check');
    });
  });

  suite('label', () => {
    setup(async () => {
      fixt = await fixture(button({label: 'Unit Test Button'}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    test('sets `aria-label` of the button when `label` is set', async () => {
      const button = element.shadowRoot!.querySelector('#button');
      assert.equal(button!.getAttribute('aria-label'), 'Unit Test Button');
    });
  });

  suite('raised', () => {
    setup(async () => {
      fixt = await fixture(button({raised: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    test('sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const raisedClass = 'mdc-button--raised';
      assert.isTrue(button.classList.contains(raisedClass));
      element.raised = false;
      await element.updateComplete;
      assert.isFalse(button.classList.contains(raisedClass));
    });
  });

  suite('unelevated', () => {
    setup(async () => {
      fixt = await fixture(button({unelevated: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    test('sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const unelevatedClass = 'mdc-button--unelevated';
      assert.isTrue(button.classList.contains(unelevatedClass));
      element.unelevated = false;
      await element.updateComplete;
      assert.isFalse(button.classList.contains(unelevatedClass));
    });
  });

  suite('outlined', () => {
    setup(async () => {
      fixt = await fixture(button({outlined: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    test('sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const outlinedClass = 'mdc-button--outlined';
      assert.isTrue(button.classList.contains(outlinedClass));
      element.outlined = false;
      await element.updateComplete;
      assert.isFalse(button.classList.contains(outlinedClass));
    });
  });

  suite('dense', () => {
    setup(async () => {
      fixt = await fixture(button({dense: true}));
      element = fixt.root.querySelector('mwc-button')!;
      await element.updateComplete;
    });

    test('sets correct internal button style', async () => {
      const button = element.shadowRoot!.querySelector('#button')!;
      const denseClass = 'mdc-button--dense';
      assert.isTrue(button.classList.contains(denseClass));
      element.dense = false;
      await element.updateComplete;
      assert.isFalse(button.classList.contains(denseClass));
    });
  });

  suite('focus', () => {
    setup(async () => {
      fixt = await fixture(defaultButton);
      element = fixt.root.querySelector('mwc-button')!;
    });

    test('highlights and blurs', async () => {
      const focusedClass = 'mdc-ripple-upgraded--background-focused';
      const nativeButton =
          element.shadowRoot!.querySelector<HTMLButtonElement>('#button')!;
      assert.isFalse(nativeButton.classList.contains(focusedClass));
      element.focus();
      const rippleElement = await element.ripple;
      const nativeRipple = rippleElement!.shadowRoot!.querySelector(
                               '.mdc-ripple-surface') as HTMLDivElement;
      await element.requestUpdate();
      await rafPromise();
      assert.isTrue(nativeRipple.classList.contains(focusedClass));
      element.blur();
      await element.requestUpdate();
      await rafPromise();
      assert.isFalse(nativeRipple.classList.contains(focusedClass));
    });
  });
});
