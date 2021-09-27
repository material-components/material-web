/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {Tab} from '@material/mwc-tab';
import * as hanbi from 'hanbi';
import {html, render} from 'lit';

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
      expect(element).toBeInstanceOf(Tab);
      expect(element.label).toEqual('');
      expect(element.icon).toEqual('');
      expect(element.hasImageIcon).toEqual(false);
      expect(element.isFadingIndicator).toEqual(false);
      expect(element.minWidth).toEqual(false);
      expect(element.isMinWidthIndicator).toEqual(false);
      expect(element.active).toEqual(false);
      expect(element.indicatorIcon).toEqual('');
      expect(element.stacked).toEqual(false);
      expect(element.focusOnActivate).toEqual(true);
    });

    it('fires interacted event on click', () => {
      const interactedHandler = hanbi.spy();
      element.addEventListener('MDCTab:interacted', interactedHandler.handler);
      const tab = element.shadowRoot!.querySelector<HTMLElement>('.mdc-tab')!;
      tab.click();
      expect(interactedHandler.called).toBeTrue();
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
      expect(tab.classList.contains('mdc-tab--min-width')).toBeTrue();
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
      expect(tab.classList.contains('mdc-tab--stacked')).toBeTrue();
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
      expect(content.textContent!.trim()).toEqual('foo');
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
      expect(content.textContent!.trim()).toEqual('add');
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
      expect(!!(tab as unknown as {mdcFoundation: boolean}).mdcFoundation)
          .toBeFalse();

      let didThrow = false;

      try {
        tab.activate(dummyClientRect);
      } catch (e) {
        didThrow = true;
      }

      expect(didThrow).toBeFalse();

      await tab.updateComplete;
      await tab.updateComplete;

      expect(!!(tab as unknown as {mdcFoundation: boolean}).mdcFoundation)
          .toBeTrue();
      expect(tab.active).toBeTrue();
    });
  });
});
