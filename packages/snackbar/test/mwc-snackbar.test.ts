/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {Snackbar} from '@material/mwc-snackbar';
import * as hanbi from 'hanbi';
import {html, TemplateResult} from 'lit-html';

import {fixture, ieSafeKeyboardEvent, rafPromise, TestFixture} from '../../../test/src/util/helpers';

interface SnackBarProps {
  timeoutMs: number;
  closeOnEscape: boolean;
  labelText: string;
  actionElement: TemplateResult;
  dismissElement: TemplateResult;
}

const defaultSnackBar = html`<mwc-snackbar></mwc-snackbar>`;

const snackBar = (propsInit: Partial<SnackBarProps>) => {
  return html`
    <mwc-snackbar
      .timeoutMs=${propsInit.timeoutMs ?? -1}
      .closeOnEscape=${propsInit.closeOnEscape === true}
      .labelText=${propsInit.labelText ?? ''}>
      ${propsInit.actionElement ?? html``}
      ${propsInit.dismissElement ?? html``}
    </mwc-snackbar>
  `;
};

const findLabelText = (element: Element) => {
  // Note that label text can either be in the label's textContent, or in its
  // ::before pseudo-element content (set via an attribute), for ARIA reasons.
  const label = element.shadowRoot!.querySelector('.mdc-snackbar__label')!;
  return label.getAttribute('data-mdc-snackbar-label-text') ||
      label.textContent;
};

describe('mwc-snackbar', () => {
  let fixt: TestFixture;
  let element: Snackbar;
  let originalSetTimeout: typeof window.setTimeout;

  beforeEach(() => {
    originalSetTimeout = window.setTimeout;
    // tslint:disable-next-line
    (window as any).setTimeout = (fn: () => unknown) => {
      fn();
      return -1;
    };
  });

  afterEach(() => {
    window.setTimeout = originalSetTimeout;
    element.parentNode!.removeChild(element);
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultSnackBar);
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    it('initializes as an mwc-snackbar', () => {
      expect(element).toBeInstanceOf(Snackbar);
      expect(element.open).toBeFalse();
      expect(element.timeoutMs).toEqual(5000);
      expect(element.closeOnEscape).toBeFalse();
      expect(element.labelText).toEqual('');
      expect(element.stacked).toBeFalse();
      expect(element.leading).toBeFalse();
    });
  });

  describe('open/close', () => {
    beforeEach(async () => {
      fixt = await fixture(snackBar({timeoutMs: -1}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    it('`show()` opens snack bar', async () => {
      const openedHandler = hanbi.spy();
      const openingHandler = hanbi.spy();
      element.addEventListener('MDCSnackbar:opened', openedHandler.handler);
      element.addEventListener('MDCSnackbar:opening', openingHandler.handler);
      expect(element.open).toEqual(false);
      element.show();
      await element.updateComplete;
      expect(openingHandler.called).toBeTrue();
      await rafPromise();
      expect(element.open).toBeTrue();
      expect(openedHandler.called).toBeTrue();
    });

    it('`open = true` opens snack bar', async () => {
      const openedHandler = hanbi.spy();
      const openingHandler = hanbi.spy();
      element.addEventListener('MDCSnackbar:opened', openedHandler.handler);
      element.addEventListener('MDCSnackbar:opening', openingHandler.handler);
      expect(element.open).toEqual(false);
      expect(openedHandler.called).toBeFalse();
      element.open = true;
      await element.updateComplete;
      expect(openingHandler.called).toBeTrue();
      await rafPromise();
      expect(element.open).toBeTrue();
      expect(openedHandler.called).toBeTrue();
    });

    it('`close()` closes snack bar', async () => {
      const closedHandler = hanbi.spy();
      element.addEventListener('MDCSnackbar:closed', closedHandler.handler);
      element.show();
      await element.updateComplete;
      await rafPromise();
      element.close();
      expect(element.open).toBeFalse();
      await element.updateComplete;
      expect(closedHandler.called).toBeTrue();
    });

    it('`open = false` closes snack bar', async () => {
      const closedHandler = hanbi.spy();
      element.addEventListener('MDCSnackbar:closed', closedHandler.handler);
      element.show();
      await element.updateComplete;
      await rafPromise();
      element.open = false;
      await element.updateComplete;
      expect(element.open).toBeFalse();
      expect(closedHandler.called).toBeTrue();
    });
  });

  describe('labelText', () => {
    beforeEach(async () => {
      fixt = await fixture(snackBar({labelText: 'foo'}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    it('set label text after opening', async () => {
      element.show();
      await element.updateComplete;
      expect(findLabelText(element)).toEqual('foo');

      element.labelText = 'bar';
      await element.updateComplete;
      expect(findLabelText(element)).toEqual('bar');

      element.labelText = 'baz';
      await element.updateComplete;
      expect(findLabelText(element)).toEqual('baz');
    });
  });

  describe('dismiss', () => {
    beforeEach(async () => {
      fixt = await fixture(
          snackBar({dismissElement: html`<span slot="dismiss">test</span>`}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    it('closes when dismissed', async () => {
      const close = element.querySelector<HTMLElement>('[slot="dismiss"]')!;
      const closedHandler = hanbi.spy();
      element.addEventListener('MDCSnackbar:closed', closedHandler.handler);
      element.show();
      await element.updateComplete;
      close.click();
      expect(element.open).toBeFalse();
      const ev = closedHandler.getCall(0).args[0] as CustomEvent;
      expect(ev.detail.reason).toEqual('dismiss');
    });
  });

  describe('action', () => {
    beforeEach(async () => {
      fixt = await fixture(
          snackBar({actionElement: html`<span slot="action">test</span>`}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    it('closes when actioned', async () => {
      const action = element.querySelector<HTMLElement>('[slot="action"]')!;
      const closedHandler = hanbi.spy();
      element.addEventListener('MDCSnackbar:closed', closedHandler.handler);
      element.show();
      await element.updateComplete;
      action.click();
      expect(element.open).toBeFalse();
      const ev = closedHandler.getCall(0).args[0] as CustomEvent;
      expect(ev.detail.reason).toEqual('action');
    });
  });

  describe('`closeOnEscape`', () => {
    beforeEach(async () => {
      fixt = await fixture(snackBar({closeOnEscape: true}));
      element = fixt.root.querySelector('mwc-snackbar')!;
      await element.updateComplete;
    });

    it('does not close when unset and esc is pressed', async () => {
      element.closeOnEscape = false;
      element.show();
      await element.updateComplete;
      await rafPromise();
      const bar = element.shadowRoot!.querySelector('.mdc-snackbar')!;
      expect(element.open).toEqual(true);

      // escape keycode
      const escEv = ieSafeKeyboardEvent('keydown', 27);
      bar.dispatchEvent(escEv);

      await element.updateComplete;
      expect(element.open).toEqual(true);
    });

    it('closes when set and esc is pressed', async () => {
      element.show();
      await element.updateComplete;
      await rafPromise();
      const bar = element.shadowRoot!.querySelector('.mdc-snackbar')!;
      expect(element.open).toEqual(true);

      // escape keycode
      const escEv = ieSafeKeyboardEvent('keydown', 27);
      bar.dispatchEvent(escEv);

      await element.updateComplete;
      expect(element.open).toEqual(false);
    });
  });
});
