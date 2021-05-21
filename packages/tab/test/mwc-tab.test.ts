/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
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

describe('mwc-tab', () => {
  let fixt: TestFixture|undefined;
  let element: Tab;

  afterEach(() => {
    fixt?.remove();
    fixt = undefined;
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultTab);
      element = fixt.root.querySelector('mwc-tab')!;
    });

    it('initializes as an mwc-tab', () => {
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

    it('fires interacted event on click', () => {
      const interactedHandler = hanbi.spy();
      element.addEventListener('MDCTab:interacted', interactedHandler.handler);
      const tab = element.shadowRoot!.querySelector<HTMLElement>('.mdc-tab')!;
      tab.click();
      assert.isTrue(interactedHandler.called);
    });
  });

  describe('minWidth', () => {
    beforeEach(async () => {
      fixt = await fixture(tab({minWidth: true}));
      element = fixt.root.querySelector('mwc-tab')!;
      await rafPromise();
    });

    it('sets the correct classes', () => {
      const tab = element.shadowRoot!.querySelector('.mdc-tab')!;
      assert.isTrue(tab.classList.contains('mdc-tab--min-width'));
    });
  });

  describe('stacked', () => {
    beforeEach(async () => {
      fixt = await fixture(tab({stacked: true}));
      element = fixt.root.querySelector('mwc-tab')!;
      await element.updateComplete;
    });

    it('sets the correct classes', () => {
      const tab = element.shadowRoot!.querySelector('.mdc-tab')!;
      assert.isTrue(tab.classList.contains('mdc-tab--stacked'));
    });
  });

  describe('label', () => {
    beforeEach(async () => {
      fixt = await fixture(tab({label: 'foo'}));
      element = fixt.root.querySelector('mwc-tab')!;
      await element.updateComplete;
    });

    it('displays label text', () => {
      const content = element.shadowRoot!.querySelector('.mdc-tab__content')!;
      assert.equal(content.textContent!.trim(), 'foo');
    });
  });

  describe('icon', () => {
    beforeEach(async () => {
      fixt = await fixture(tab({icon: 'add'}));
      element = fixt.root.querySelector('mwc-tab')!;
      await element.updateComplete;
    });

    it('displays icon', () => {
      const content = element.shadowRoot!.querySelector('.mdc-tab__icon')!;
      assert.equal(content.textContent!.trim(), 'add');
    });
  });

  describe('activate', () => {
    afterEach(() => {
      const tabs = document.body.querySelectorAll('mwc-tab');

      for (const tab of tabs) {
        document.body.removeChild(tab);
      }
    });

    it('don\'t throw if active is called before firstRender', async () => {
      const dummyClientRect = document.body.getBoundingClientRect();
      render(defaultTab, document.body);
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
