/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {MdDialog} from './dialog.js';
import {DialogHarness} from './harness.js';

function isDocumentScrollingDisabled() {
  return getComputedStyle(document.body).overflow === 'hidden';
}

interface DialogTestProps {
  modeless?: boolean;
}

function getDialogTemplate(props?: DialogTestProps) {
  return html`
    <md-dialog
      .modeless=${props?.modeless ?? false}
      style="
        --md-dialog-opening-transition-duration: 0ms;
        --md-dialog-closing-transition-duration: 0ms;
      ">
      <div class="content">Content
        <input dialog-focus>
      </div>
      <button slot="footer" dialog-action="button">Close</button>
    </md-dialog>`;
}


describe('<md-dialog>', () => {
  const realTimeout = globalThis.setTimeout;
  const env = new Environment();

  function setClockEnabled(enable = false) {
    const isEnabled = globalThis.setTimeout !== realTimeout;
    if (isEnabled !== enable) {
      if (enable) {
        jasmine.clock().install();
      } else {
        jasmine.clock().uninstall();
      }
    }
  }


  async function setupTest(
      props?: DialogTestProps, template = getDialogTemplate) {
    const root = env.render(template(props));
    await env.waitForStability();
    setClockEnabled(false);
    const dialog = root.querySelector<MdDialog>('md-dialog')!;
    const harness = new DialogHarness(dialog);
    const contentElement = root.querySelector<HTMLElement>('.content')!;
    const focusElement = root.querySelector<HTMLElement>('[dialog-focus]')!;
    return {harness, root, contentElement, focusElement};
  }


  afterEach(() => {
    setClockEnabled(true);
  });

  describe('.styles', () => {
    createTokenTests(MdDialog.styles);
  });

  describe('basic', () => {
    it('initializes as an md-dialog', async () => {
      const {harness} = await setupTest();
      expect(harness.element).toBeInstanceOf(MdDialog);
      expect(await harness.getInteractiveElement())
          .toBeInstanceOf(HTMLDialogElement);
    });

    it('renders open state by setting open property', async () => {
      const {harness} = await setupTest();
      expect(await harness.isDialogVisible()).toBeFalse();
      harness.element.open = true;
      expect(await harness.isDialogVisible()).toBeTrue();

      harness.element.open = false;
      expect(await harness.isDialogVisible()).toBeFalse();
      harness.element.open = true;
      expect(await harness.isDialogVisible()).toBeTrue();
      harness.element.open = false;
      expect(await harness.isDialogVisible()).toBeFalse();
    });

    it('renders open state by calling show()/close()/toggleShow()',
       async () => {
         const {harness} = await setupTest();
         harness.element.show();
         expect(await harness.isDialogVisible()).toBeTrue();
         harness.element.close();
         expect(await harness.isDialogVisible()).toBeFalse();
         harness.element.toggleShow();
         expect(await harness.isDialogVisible()).toBeTrue();
         harness.element.toggleShow();
         expect(await harness.isDialogVisible()).toBeFalse();
       });

    it('renders scrim', async () => {
      const {harness} = await setupTest();
      expect(await harness.isScrimVisible()).toBeFalse();
      harness.element.open = true;
      expect(await harness.isScrimVisible()).toBeTrue();
      harness.element.open = false;
      expect(await harness.isScrimVisible()).toBeFalse();
    });

    it('prevents document scrolling when open', async () => {
      const {harness} = await setupTest();
      expect(isDocumentScrollingDisabled()).toBeFalse();
      harness.element.open = true;
      await harness.transitionComplete();
      expect(isDocumentScrollingDisabled()).toBeTrue();
      harness.element.open = false;
      await harness.transitionComplete();
      expect(isDocumentScrollingDisabled()).toBeFalse();
    });

    it('fires open/close events', async () => {
      const {harness} = await setupTest();
      const openingHandler = jasmine.createSpy('openingHandler');
      const openedHandler = jasmine.createSpy('openedHandler');
      const closingHandler = jasmine.createSpy('closingHandler');
      const closedHandler = jasmine.createSpy('closedHandler');
      harness.element.addEventListener('opening', openingHandler);
      harness.element.addEventListener('opened', openedHandler);
      harness.element.addEventListener('closing', closingHandler);
      harness.element.addEventListener('closed', closedHandler);
      harness.element.show();
      await harness.transitionComplete();
      expect(openingHandler).toHaveBeenCalledTimes(1);
      expect(openedHandler).toHaveBeenCalledTimes(1);
      expect(closingHandler).toHaveBeenCalledTimes(0);
      expect(closedHandler).toHaveBeenCalledTimes(0);
      harness.element.close('testing');
      await harness.transitionComplete();
      expect(openingHandler).toHaveBeenCalledTimes(1);
      expect(openedHandler).toHaveBeenCalledTimes(1);
      expect(closingHandler).toHaveBeenCalledTimes(1);
      expect(closingHandler.calls.mostRecent().args[0].detail.action)
          .toBe('testing');
      expect(closedHandler).toHaveBeenCalledTimes(1);
      expect(closedHandler.calls.mostRecent().args[0].detail.action)
          .toBe('testing');
    });

    it('closes when element with action is clicked', async () => {
      const {harness} = await setupTest();
      harness.element.show();
      await harness.transitionComplete();
      const closedHandler = jasmine.createSpy('closedHandler');
      harness.element.addEventListener('closed', closedHandler);
      harness.element
          .querySelector<HTMLButtonElement>(
              '[dialog-action="button"]')!.click();
      await harness.transitionComplete();
      expect(harness.element.open).toBeFalse();
      expect(closedHandler.calls.mostRecent().args[0].detail.action)
          .toBe('button');
    });

    it('closes with click outside dialog', async () => {
      const {harness, contentElement} = await setupTest();
      harness.element.show();
      contentElement.click();
      await harness.transitionComplete();
      expect(harness.element.open).toBeTrue();
      const dialogElement = await harness.getInteractiveElement();
      dialogElement.click();
      await harness.transitionComplete();
      expect(harness.element.open).toBeFalse();
    });

    it('focses element with focus attribute when shown and previously focused element when closed',
       async () => {
         const {harness, focusElement} = await setupTest();
         const button = document.createElement('button');
         document.body.append(button);
         button.focus();
         expect(document.activeElement).toBe(button);
         harness.element.show();
         await harness.transitionComplete();
         expect(document.activeElement).toBe(focusElement);
         harness.element.close();
         await harness.transitionComplete();
         expect(document.activeElement).toBe(button);
         button.remove();
       });

    describe('modeless', () => {
      it('does not render srcrim', async () => {
        const {harness} = await setupTest({modeless: true});
        expect(await harness.isScrimVisible()).toBeFalse();
        harness.element.open = true;
        expect(await harness.isScrimVisible()).toBeFalse();
        harness.element.open = false;
        expect(await harness.isScrimVisible()).toBeFalse();
      });

      it('does not close on external click', async () => {
        const {harness} = await setupTest({modeless: true});
        harness.element.show();
        const dialogElement = await harness.getInteractiveElement();
        dialogElement.click();
        await harness.transitionComplete();
        expect(harness.element.open).toBeTrue();
        harness.element.close();
        await harness.transitionComplete();
      });
      it('does not prevent document scrolling', async () => {
        const {harness} = await setupTest({modeless: true});
        expect(isDocumentScrollingDisabled()).toBeFalse();
        harness.element.open = true;
        await harness.transitionComplete();
        expect(isDocumentScrollingDisabled()).toBeFalse();
        harness.element.open = false;
        await harness.transitionComplete();
        expect(isDocumentScrollingDisabled()).toBeFalse();
      });
    });
  });
});
