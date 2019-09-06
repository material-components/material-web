/**
 * Copyright 2016 Google Inc. All Rights Reserved.
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

import '@material/mwc-button';

import {Button} from '@material/mwc-button';
import {Dialog} from '@material/mwc-dialog';
// import {cssClasses} from '@material/dialog/constants';
import {html} from 'lit-html';

import {fixture, rafPromise, TestFixture} from '../util/helpers';

const OPENING_EVENT = 'opening';
const OPENED_EVENT = 'opened';
const CLOSING_EVENT = 'closing';
const CLOSED_EVENT = 'closed';

const awaitEvent =
    (element: Dialog, eventName: string): Promise<CustomEvent> => {
      return new Promise(res => {
        const listener = (e: CustomEvent) => {
          element.removeEventListener(eventName, listener as EventListener);
          res(e);
        };

        element.addEventListener(eventName, listener as EventListener);
      });
    };

const basic = html`
  <mwc-dialog></mwc-dialog>
`;

const opened = html`
  <mwc-dialog open></mwc-dialog>
`;

const withButtons = html`
  <mwc-dialog title="myTitle">
    <mwc-button
        slot="primaryAction"
        dialog-action="ok">
      Ok
    </mwc-button>
    <mwc-button
        slot="secondaryAction">
      Cancel
    </mwc-button>
  </mwc-dialog>
`;

suite('mwc-dialog:', () => {
  let fixt: TestFixture;

  suite('basic', () => {
    let element: Dialog;
    setup(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-dialog')!;
    });

    test('initializes as an mwc-dialog', () => {
      assert.instanceOf(element, Dialog);
    });

    test('Title spacing is not displayed when there is no title', async () => {
      let titleTag = element.shadowRoot!.querySelector('.mdc-dialog__title');
      assert.isNull(titleTag)

      element.title = 'This is my Title';
      await element.requestUpdate();
      titleTag = element.shadowRoot!.querySelector('.mdc-dialog__title');
      assert.isOk(titleTag);
      assert.strictEqual(titleTag!.textContent, 'This is my Title')
    });

    test('Dialog fires open and close events', async () => {
      let openingCalled = false;
      let openedCalled = false;
      let closingCalled = false;
      let closedCalled = false;
      const surfaceElement = element.shadowRoot!.querySelector(
                                 '.mdc-dialog__surface') as HTMLDivElement;

      element.addEventListener(OPENING_EVENT, () => {
        openingCalled = true;
      });

      element.addEventListener(OPENED_EVENT, () => {
        openedCalled = true;
      });

      element.addEventListener(CLOSING_EVENT, () => {
        closingCalled = true;
      });

      element.addEventListener(CLOSED_EVENT, () => {
        closedCalled = true;
      });

      const openedPromise = awaitEvent(element, OPENED_EVENT);
      const closedPromise = awaitEvent(element, CLOSED_EVENT);

      assert.isFalse(openingCalled);
      assert.isFalse(openedCalled);
      assert.isFalse(closingCalled);
      assert.isFalse(closedCalled);

      assert.strictEqual(surfaceElement.offsetWidth, 0);
      assert.strictEqual(surfaceElement.offsetHeight, 0);

      element.title = 'Basic title';
      element.hideActions = true;
      element.open = true;
      await openedPromise;

      assert.isTrue(openingCalled);
      assert.isTrue(openedCalled);
      assert.isFalse(closingCalled);
      assert.isFalse(closedCalled);

      assert.isOk(surfaceElement.offsetWidth);
      assert.isOk(surfaceElement.offsetHeight);

      openingCalled = false;
      openedCalled = false;
      element.open = false;

      await closedPromise;

      assert.isFalse(openingCalled);
      assert.isFalse(openedCalled);
      assert.isTrue(closingCalled);
      assert.isTrue(closedCalled);

      assert.strictEqual(surfaceElement.offsetWidth, 0);
      assert.strictEqual(surfaceElement.offsetHeight, 0);
    });

    test('Scrim closes dialog', async () => {
      const SCRIM_ACTION = 'SCRIM_CLOSE';
      element.scrimClickAction = SCRIM_ACTION;
      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      const scrim = element.shadowRoot!.querySelector('.mdc-dialog__scrim') as
          HTMLDivElement;

      scrim.click();

      const event = await awaitEvent(element, CLOSED_EVENT);

      const action = event.detail.action;
      assert.strictEqual(action, SCRIM_ACTION);
    });

    test('Escape closes dialog', async () => {
      const ESCAPE_ACTION = 'ESCAPE_CLOSE';
      element.escapeKeyAction = ESCAPE_ACTION;
      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      const escDown = new KeyboardEvent(
          'keydown', {key: 'Escape', bubbles: true, composed: true});
      const escUp = new KeyboardEvent(
          'keyup', {key: 'Escape', bubbles: true, composed: true});

      element.dispatchEvent(escDown);
      element.dispatchEvent(escUp);

      const event = await awaitEvent(element, CLOSED_EVENT);

      const action = event.detail.action;
      assert.strictEqual(action, ESCAPE_ACTION);
    });

    test('Hide Actions hides empty whitespace', async () => {
      const actionsFooter =
          element.shadowRoot!.querySelector('#actions') as HTMLElement;

      element.open = true;
      await awaitEvent(element, OPENED_EVENT);

      assert.isOk(actionsFooter.offsetWidth);
      assert.isOk(actionsFooter.offsetHeight);

      element.hideActions = true;
      await element.requestUpdate();

      assert.strictEqual(actionsFooter.offsetHeight, 0);
    });

    test('declaratively opens', async () => {
      const fixt = await fixture(opened);
      const element = fixt.root.firstElementChild as Dialog;

      let openedCalled = false;
      element.addEventListener(OPENED_EVENT, () => {
        openedCalled = true;
      });

      await awaitEvent(element, OPENED_EVENT);

      assert.isTrue(openedCalled);

      fixt.remove();
    });

    teardown(async () => {
      if (element && element.open) {
        element.open = false;
        await awaitEvent(element, CLOSED_EVENT);
      }

      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('with actions', () => {
    let element: Dialog;

    setup(async () => {
      fixt = await fixture(withButtons);
      element = fixt.root.firstElementChild as Dialog;
    });

    test('Actions close dialog', async () => {
      element.open = true;
      await awaitEvent(element, OPENED_EVENT);

      let closedCalled = false;

      element.addEventListener(CLOSED_EVENT, () => {
        closedCalled = true;
      });

      const primary = element.querySelector('[slot="primaryAction"]') as Button;
      const secondary =
          element.querySelector('[slot="secondaryAction"]') as Button;

      secondary.click();

      assert.isFalse(closedCalled);

      primary.click();

      const action = await awaitEvent(element, CLOSED_EVENT);

      assert.isTrue(closedCalled);
      assert.strictEqual(action.detail.action, 'ok');

      closedCalled = false;

      element.open = true;
      await awaitEvent(element, OPENED_EVENT);

      secondary.setAttribute('dialog-action', 'cancel');

      secondary.click();

      const secondaryAction = await awaitEvent(element, CLOSED_EVENT);

      assert.isTrue(closedCalled);
      assert.strictEqual(secondaryAction.detail.action, 'cancel');
    });

    test('Initial focus attribute focuses', async () => {
      const button = element.firstElementChild as Button;

      assert.isNull(fixt.root.activeElement);

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      assert.isNull(fixt.root.activeElement);

      element.open = false;

      await awaitEvent(element, CLOSED_EVENT);

      assert.isNull(fixt.root.activeElement);


      button.toggleAttribute('dialog-initial-focus', true);

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      assert.strictEqual(fixt.root.activeElement, button);
    });

    test('Stacking reverses actions', async () => {
      const primary = element.querySelector('[slot="primaryAction"]') as Button;
      const secondary =
          element.querySelector('[slot="secondaryAction"]') as Button;

      const getSlots = (): HTMLSlotElement[] => {
        const actionsFooter = element.shadowRoot!.querySelector('#actions')!;
        return Array.from(actionsFooter.children) as unknown as
            HTMLSlotElement[];
      };

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);
      let [firstSlot, secondSlot] = getSlots();

      let firstNode = firstSlot.assignedNodes()[0];
      assert.strictEqual(firstNode, secondary);

      let secondNode = secondSlot.assignedNodes()[0];
      assert.strictEqual(secondNode, primary);

      element.stacked = true;
      await element.requestUpdate();
      await rafPromise();

      [firstSlot, secondSlot] = getSlots();

      firstNode = firstSlot.assignedNodes()[0];
      assert.strictEqual(firstNode, primary);

      secondNode = secondSlot.assignedNodes()[0];
      assert.strictEqual(secondNode, secondary);
    });

    test('Enter clicks primary action', async () => {
      let clickCalled = false;
      const primary = element.querySelector('[slot="primaryAction"]') as Button;

      primary.addEventListener('click', () => {
        clickCalled = true;
      });

      element.open = true;
      await awaitEvent(element, OPENED_EVENT);

      assert.isFalse(clickCalled);

      const enterDown = new KeyboardEvent(
          'keydown', {key: 'Enter', bubbles: true, composed: true});
      const enterUp = new KeyboardEvent(
          'keyup', {key: 'Enter', bubbles: true, composed: true});

      element.dispatchEvent(enterDown);
      element.dispatchEvent(enterUp);

      assert.isTrue(clickCalled);

      const action = await awaitEvent(element, CLOSED_EVENT);

      assert.strictEqual(action.detail.action, 'ok');
    });

    teardown(async () => {
      if (element && element.open) {
        element.open = false;
        await awaitEvent(element, CLOSED_EVENT);
      }

      if (fixt) {
        fixt.remove();
      }
    });
  });
});
