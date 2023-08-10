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

describe('<md-dialog>', () => {
  const env = new Environment();

  async function setupTest() {
    const root = env.render(html`
      <md-dialog>
        <form id="form" method="dialog" slot="content">
          Content
          <input autofocus>
        </form>
        <div slot="actions">
          <button form="form" value="button">Close</button>
        </div>
      </md-dialog>
    `);

    await env.waitForStability();
    const dialog = root.querySelector('md-dialog');
    if (!dialog) {
      throw new Error('Failed to query rendered <md-dialog>');
    }

    const harness = new DialogHarness(dialog);
    const dialogElement = dialog.shadowRoot?.querySelector('dialog');
    if (!dialogElement) {
      throw new Error('Failed to query rendered <dialog>');
    }

    const contentElement = root.querySelector<HTMLElement>('[slot=content]');
    if (!contentElement) {
      throw new Error('Failed to query rendered content.');
    }

    const focusElement = root.querySelector<HTMLElement>('[autofocus]');
    if (!focusElement) {
      throw new Error('Failed to query rendered autofocus element.');
    }

    return {harness, root, dialogElement, contentElement, focusElement};
  }

  describe('.styles', () => {
    createTokenTests(MdDialog.styles);
  });

  describe('basic', () => {
    it('open property calls show() and close()', async () => {
      const {harness} = await setupTest();
      spyOn(harness.element, 'show');
      spyOn(harness.element, 'close');

      harness.element.open = true;
      await env.waitForStability();
      expect(harness.element.show).toHaveBeenCalled();

      harness.element.open = false;
      await env.waitForStability();
      expect(harness.element.close).toHaveBeenCalled();
    });

    it('renders open state by calling show()/close()', async () => {
      const {harness, dialogElement} = await setupTest();
      await harness.element.show();
      expect(dialogElement.open).toBeTrue();
      await harness.element.close();
      expect(dialogElement.open).toBeFalse();
    });

    it('fires open/close events', async () => {
      const {harness} = await setupTest();
      const openHandler = jasmine.createSpy('openHandler');
      const openedHandler = jasmine.createSpy('openedHandler');
      const closeHandler = jasmine.createSpy('closeHandler');
      const closedHandler = jasmine.createSpy('closedHandler');
      harness.element.addEventListener('open', openHandler);
      harness.element.addEventListener('opened', openedHandler);
      harness.element.addEventListener('close', closeHandler);
      harness.element.addEventListener('closed', closedHandler);
      await harness.element.show();
      expect(openHandler).toHaveBeenCalledTimes(1);
      expect(openedHandler).toHaveBeenCalledTimes(1);
      expect(closeHandler).toHaveBeenCalledTimes(0);
      expect(closedHandler).toHaveBeenCalledTimes(0);
      await harness.element.close('testing');
      expect(openHandler).toHaveBeenCalledTimes(1);
      expect(openedHandler).toHaveBeenCalledTimes(1);
      expect(closeHandler).toHaveBeenCalledTimes(1);
      expect(closedHandler).toHaveBeenCalledTimes(1);
      expect(harness.element.returnValue).toBe('testing');
    });

    it('closes when element with action is clicked', async () => {
      const {harness} = await setupTest();
      await harness.element.show();
      const closedPromise = new Promise<void>(resolve => {
        harness.element.addEventListener('closed', () => {
          resolve();
        }, {once: true});
      });

      harness.element.querySelector<HTMLButtonElement>(
                         '[value="button"]')!.click();
      await closedPromise;
      expect(harness.element.open).toBeFalse();
      expect(harness.element.returnValue).toBe('button');
    });

    it('closes with click outside dialog', async () => {
      const {harness, dialogElement, contentElement} = await setupTest();
      const isClosing = jasmine.createSpy('isClosing');
      harness.element.addEventListener('close', isClosing);
      await harness.element.show();
      contentElement.click();
      expect(isClosing).not.toHaveBeenCalled();
      dialogElement.click();
      expect(isClosing).toHaveBeenCalled();
    });

    it('focuses element with autofocus when shown and previously focused element when closed',
       async () => {
         const {harness, focusElement} = await setupTest();
         const button = document.createElement('button');
         document.body.append(button);
         button.focus();
         expect(document.activeElement).toBe(button);
         await harness.element.show();
         expect(document.activeElement).toBe(focusElement);
         await harness.element.close();
         expect(document.activeElement).toBe(button);
         button.remove();
       });
  });

  it('should set returnValue during the close event', async () => {
    const {harness} = await setupTest();

    let returnValueDuringClose = '';
    harness.element.addEventListener('close', () => {
      returnValueDuringClose = harness.element.returnValue;
    });

    await harness.element.show();
    const returnValue = 'foo';
    await harness.element.close(returnValue);
    expect(returnValueDuringClose)
        .withContext('dialog.returnValue during close event')
        .toBe(returnValue);
  });

  it('should not change returnValue if close event is canceled', async () => {
    const {harness} = await setupTest();

    harness.element.addEventListener('close', event => {
      event.preventDefault();
    });

    await harness.element.show();
    const prevReturnValue = harness.element.returnValue;
    await harness.element.close('new return value');
    expect(harness.element.returnValue)
        .withContext('dialog.returnValue after close event canceled')
        .toBe(prevReturnValue);
  });
});
