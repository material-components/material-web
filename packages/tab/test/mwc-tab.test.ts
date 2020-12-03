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

import {Tab} from '@material/mwc-tab';
import * as hanbi from 'hanbi';
import {html, render} from 'lit-html';

import {fixture, rafPromise, TestFixture} from '../../../test/src/util/helpers';

interface TabProps {
  label: string;
  icon: string;
  minWidth: boolean;
  stacked: boolean;
}

const defaultTab = html`<mwc-tab></mwc-tab>`;

const tab = (propsInit: Partial<TabProps>) => {
  return html`
    <mwc-tab
      .minWidth=${propsInit.minWidth === true}
      .stacked=${propsInit.stacked === true}
      icon=${propsInit.icon ?? ''}
      label=${propsInit.label ?? ''}>
    </mwc-tab>
  `;
};

suite('mwc-tab', () => {
  let fixt: TestFixture;
  let element: Tab;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultTab);
      element = fixt.root.querySelector('mwc-tab')!;
    });

    test('initializes as an mwc-tab', () => {
      assert.instanceOf(element, Tab);
      assert.equal(element.label, '');
      assert.equal(element.icon, '');
      assert.equal(element.hasImageIcon, false);
      assert.equal(element.isFadingIndicator, false);
      assert.equal(element.minWidth, false);
      assert.equal(element.isMinWidthIndicator, false);
      assert.equal(element.active, false);
      assert.equal(element.indicatorIcon, '');
      assert.equal(element.stacked, false);
      assert.equal(element.focusOnActivate, true);
    });

    test('fires interacted event on click', () => {
      const interactedHandler = hanbi.spy();
      element.addEventListener('MDCTab:interacted', interactedHandler.handler);
      const tab = element.shadowRoot!.querySelector<HTMLElement>('.mdc-tab')!;
      tab.click();
      assert.isTrue(interactedHandler.called);
    });
  });

  suite('minWidth', () => {
    setup(async () => {
      fixt = await fixture(tab({minWidth: true}));
      element = fixt.root.querySelector('mwc-tab')!;
      await rafPromise();
    });

    test('sets the correct classes', () => {
      const tab = element.shadowRoot!.querySelector('.mdc-tab')!;
      assert.isTrue(tab.classList.contains('mdc-tab--min-width'));
    });
  });

  suite('stacked', () => {
    setup(async () => {
      fixt = await fixture(tab({stacked: true}));
      element = fixt.root.querySelector('mwc-tab')!;
      await element.updateComplete;
    });

    test('sets the correct classes', () => {
      const tab = element.shadowRoot!.querySelector('.mdc-tab')!;
      assert.isTrue(tab.classList.contains('mdc-tab--stacked'));
    });
  });

  suite('label', () => {
    setup(async () => {
      fixt = await fixture(tab({label: 'foo'}));
      element = fixt.root.querySelector('mwc-tab')!;
      await element.updateComplete;
    });

    test('displays label text', () => {
      const content = element.shadowRoot!.querySelector('.mdc-tab__content')!;
      assert.equal(content.textContent!.trim(), 'foo');
    });
  });

  suite('icon', () => {
    setup(async () => {
      fixt = await fixture(tab({icon: 'add'}));
      element = fixt.root.querySelector('mwc-tab')!;
      await element.updateComplete;
    });

    test('displays icon', () => {
      const content = element.shadowRoot!.querySelector('.mdc-tab__icon')!;
      assert.equal(content.textContent!.trim(), 'add');
    });
  });

  suite('activate', () => {
    teardown(() => {
      const tabs = document.body.querySelectorAll('mwc-tab');

      for (const tab of tabs) {
        document.body.removeChild(tab);
      }
    });

    test('don\'t throw if active is called before firstRender', async () => {
      const dummyClientRect = document.body.getBoundingClientRect();
      render(html`<mwc-tab></mwc-tab>`, document.body);
      const tab = document.body.querySelector('mwc-tab')!;
      assert.isFalse(
          !!(tab as unknown as {mdcFoundation: boolean}).mdcFoundation);

      let didThrow = false;

      try {
        tab.activate(dummyClientRect);
      } catch (e) {
        didThrow = true;
      }

      assert.isFalse(didThrow);

      await tab.updateComplete;
      await tab.updateComplete;

      assert.isTrue(
          !!(tab as unknown as {mdcFoundation: boolean}).mdcFoundation);
      assert.isTrue(tab.active);
    });
  });
});
