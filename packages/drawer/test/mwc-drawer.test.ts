/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {Drawer} from '@material/mwc-drawer';
import {html} from 'lit-html';

import {fixture, TestFixture, waitForEvent} from '../../../test/src/util/helpers';

const SCRIM_SELECTOR = '.mdc-drawer-scrim';
const HEADER_SELECTOR = '.mdc-drawer__header';
const DISMISSIBLE_CLASS = 'mdc-drawer--dismissible';

interface DrawerProps {
  hasHeader: boolean;
  type: string;
}

const defaultDrawer = html`<mwc-drawer></mwc-drawer>`;

const drawer = (propsInit: Partial<DrawerProps>) => {
  return html`
    <mwc-drawer
      .hasHeader=${propsInit.hasHeader === true}
      .type=${propsInit.type ?? ''}>
    </mwc-drawer>
  `;
};

const IS_SAFARI_13 =
    window.navigator.appVersion?.indexOf('AppleWebKit') !== -1 &&
    window.navigator.appVersion?.indexOf('Version/13.1') !== -1;

const transitionend = async (drawer: Element) => {
  if (IS_SAFARI_13) {
    await new Promise((resolve) => {
      setTimeout(resolve, 400);
    });
  } else {
    await waitForEvent(drawer, 'transitionend');
  }
};

describe('mwc-drawer', () => {
  let fixt: TestFixture;
  let element: Drawer;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultDrawer);
      element = fixt.root.querySelector('mwc-drawer')!;
    });

    it('initializes as an mwc-drawer', () => {
      expect(element).toBeInstanceOf(Drawer);
      expect(element.type).toEqual('');
      expect(element.open).toEqual(false);
      expect(element.hasHeader).toEqual(false);
    });

    it('opening/closing events are fired', async () => {
      const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
      let openedFired = false;
      let closedFired = false;
      element.addEventListener('MDCDrawer:opened', () => {
        openedFired = true;
      });
      element.addEventListener('MDCDrawer:closed', () => {
        closedFired = true;
      });
      element.type = 'dismissible';
      element.open = true;
      await transitionend(drawer);
      expect(openedFired).toEqual(true);
      element.open = false;
      await transitionend(drawer);

      expect(closedFired).toEqual(true);
    });
  });

  describe('hasHeader', () => {
    beforeEach(async () => {
      fixt = await fixture(drawer({hasHeader: true}));
      element = fixt.root.querySelector('mwc-drawer')!;
      await element.updateComplete;
    });

    it('displays a header if set', async () => {
      let header = element.shadowRoot!.querySelector(HEADER_SELECTOR);
      expect(header).toBeInstanceOf(Element);
      element.hasHeader = false;
      await element.updateComplete;
      header = element.shadowRoot!.querySelector(HEADER_SELECTOR);
      expect(header).toEqual(null);
    });
  });

  describe('modal type', () => {
    beforeEach(async () => {
      fixt = await fixture(drawer({type: 'modal'}));
      element = fixt.root.querySelector('mwc-drawer')!;
      await element.updateComplete;
    });

    it('displays scrim', async () => {
      const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
      const scrim = element.shadowRoot!.querySelector(SCRIM_SELECTOR)!;
      expect(scrim).toBeInstanceOf(Element);
      expect(drawer.classList.contains('mdc-drawer--modal')).toBeTrue();
    });

    it('closes on scrim click', async () => {
      const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
      const scrim =
          element.shadowRoot!.querySelector<HTMLElement>(SCRIM_SELECTOR)!;
      element.open = true;
      await transitionend(drawer);

      scrim.click();
      await transitionend(drawer);

      expect(element.open).toEqual(false);
    });
  });

  describe('dismissible type', () => {
    beforeEach(async () => {
      fixt = await fixture(drawer({type: 'dismissible'}));
      element = fixt.root.querySelector('mwc-drawer')!;
      await element.updateComplete;
    });

    it('sets correct classes', async () => {
      const drawer = element.shadowRoot!.querySelector('.mdc-drawer')!;
      expect(drawer.classList.contains(DISMISSIBLE_CLASS)).toBeTrue();
    });
  });
});
