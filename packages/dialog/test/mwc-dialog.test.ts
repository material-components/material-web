/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import '@material/mwc-button';
import '@material/mwc-dialog';
import '@material/mwc-menu';
import '@material/mwc-select';
import '@material/mwc-textarea';

import {Button} from '@material/mwc-button';
import {Dialog} from '@material/mwc-dialog';
import {DocumentWithBlockingElements} from 'blocking-elements';
import {customElement, LitElement} from 'lit-element';
import {html} from 'lit-html';

import {fixture, rafPromise, TestFixture} from '../../../test/src/util/helpers';

const blockingElements =
    (document as DocumentWithBlockingElements).$blockingElements;

const OPENING_EVENT = 'opening';
const OPENED_EVENT = 'opened';
const CLOSING_EVENT = 'closing';
const CLOSED_EVENT = 'closed';

interface HasKeyCode {
  keyCode: number;
}

@customElement('my-test-element')
export class MyTestElement extends LitElement {
  override render() {
    return html`
      <mwc-dialog>
        <slot></slot>
        <slot name="primaryAction" slot="primaryAction"></slot>
        <slot name="secondaryAction" slot="secondaryAction"></slot>
      </mwc-dialog>
    `;
  }
}


const awaitEvent =
    (element: Dialog, eventName: string): Promise<CustomEvent> => {
      return new Promise((res) => {
        const listener = (e: CustomEvent) => {
          element.removeEventListener(eventName, listener as EventListener);
          res(e);
        };

        element.addEventListener(eventName, listener as EventListener);
      });
    };

const distributedFocusContent = html`
  <my-test-element>
    <div>
      <mwc-button id="wrappedContentButton">wrapped content button</mwc-button>
    </div>
    <mwc-button id="contentButton">content button</mwc-button>
    <mwc-button
        slot="primaryAction"
        data-dialogAction="ok">
      Ok
    </mwc-button>
    <mwc-button
        slot="secondaryAction">
      Cancel
    </mwc-button>
  </my-test-element>
`;

const basic = html`
  <mwc-dialog></mwc-dialog>
`;

const opened = html`
  <mwc-dialog open></mwc-dialog>
`;

const withButtons = html`
  <mwc-dialog heading="myTitle" actionAttribute="data-dialogAction">
    <mwc-button
        slot="primaryAction"
        data-dialogAction="ok">
      Ok
    </mwc-button>
    <mwc-button
        slot="secondaryAction">
      Cancel
    </mwc-button>
  </mwc-dialog>
`;

const withSuppressContent = html`
  <mwc-dialog>
    <mwc-textarea></mwc-textarea>
    <mwc-select>
      <mwc-list-item id="select-item"></mwc-list-item>
    </mwc-select>
    <mwc-menu>
      <mwc-list-item id="menu-item"></mwc-list-item>
    </mwc-menu>
    <mwc-button
        slot="primaryAction"
        data-dialogAction="ok">
      Ok
    </mwc-button>
    <mwc-button
        slot="secondaryAction">
      Cancel
    </mwc-button>
  </mwc-dialog>
`;

describe('mwc-dialog:', () => {
  let fixt: TestFixture;

  describe('basic', () => {
    let element: Dialog;
    beforeEach(async () => {
      fixt = await fixture(basic);

      element = fixt.root.querySelector('mwc-dialog')!;
    });

    it('initializes as an mwc-dialog', () => {
      expect(element).toBeInstanceOf(Dialog);
    });

    it('Title spacing is not displayed when there is no title', async () => {
      let titleTag = element.shadowRoot!.querySelector('.mdc-dialog__title');
      expect(titleTag).toBeNull();

      element.heading = 'This is my Title';
      element.requestUpdate();
      await element.updateComplete;
      titleTag = element.shadowRoot!.querySelector('.mdc-dialog__title');
      expect(titleTag).not.toBe(null);
      expect(titleTag!.textContent).toBe('This is my Title');
    });

    it('Dialog fires open and close events', async () => {
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

      expect(openingCalled).toBeFalse();
      expect(openedCalled).toBeFalse();
      expect(closingCalled).toBeFalse();
      expect(closedCalled).toBeFalse();

      expect(surfaceElement.offsetWidth).toBe(0);
      expect(surfaceElement.offsetHeight).toBe(0);

      element.heading = 'Basic title';
      element.hideActions = true;
      element.open = true;
      await openedPromise;

      expect(openingCalled).toBeTrue();
      expect(openedCalled).toBeTrue();
      expect(closingCalled).toBeFalse();
      expect(closedCalled).toBeFalse();

      expect(surfaceElement.offsetWidth > 0).toBeTrue();
      expect(surfaceElement.offsetHeight > 0).toBeTrue();

      openingCalled = false;
      openedCalled = false;
      element.open = false;

      await closedPromise;

      expect(openingCalled).toBeFalse();
      expect(openedCalled).toBeFalse();
      expect(closingCalled).toBeTrue();
      expect(closedCalled).toBeTrue();

      expect(surfaceElement.offsetWidth).toBe(0);
      expect(surfaceElement.offsetHeight).toBe(0);
    });

    it('Scrim closes dialog', async () => {
      const SCRIM_ACTION = 'SCRIM_CLOSE';
      element.scrimClickAction = SCRIM_ACTION;
      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      const scrim = element.shadowRoot!.querySelector('.mdc-dialog__scrim') as
          HTMLDivElement;

      scrim.click();

      const event = await awaitEvent(element, CLOSED_EVENT);

      const action = event.detail.action;
      expect(action).toBe(SCRIM_ACTION);
    });

    it('Escape closes dialog', async () => {
      const ESCAPE_ACTION = 'ESCAPE_CLOSE';
      element.escapeKeyAction = ESCAPE_ACTION;
      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      const init = {detail: 0, bubbles: true, cancelable: true, composed: true};
      const escDown = new CustomEvent('keydown', init);
      const escUp = new CustomEvent('keyup', init);

      (escDown as unknown as HasKeyCode).keyCode = 27;
      (escUp as unknown as HasKeyCode).keyCode = 27;

      document.dispatchEvent(escDown);
      document.dispatchEvent(escUp);

      const event = await awaitEvent(element, CLOSED_EVENT);

      const action = event.detail.action;
      expect(action).toBe(ESCAPE_ACTION);
    });

    it('Hide Actions hides empty whitespace', async () => {
      const actionsFooter =
          element.shadowRoot!.querySelector('#actions') as HTMLElement;

      element.open = true;
      await awaitEvent(element, OPENED_EVENT);

      expect(actionsFooter.offsetWidth > 0).toBeTrue();
      expect(actionsFooter.offsetHeight > 0).toBeTrue();

      element.hideActions = true;
      element.requestUpdate();
      await element.updateComplete;

      expect(actionsFooter.offsetHeight).toBe(0);
    });

    it('declaratively opens', async () => {
      const fixt = await fixture(opened);
      const element = fixt.root.firstElementChild as Dialog;

      let openedCalled = false;
      element.addEventListener(OPENED_EVENT, () => {
        openedCalled = true;
      });

      await awaitEvent(element, OPENED_EVENT);

      expect(openedCalled).toBeTrue();

      fixt.remove();
    });

    afterEach(async () => {
      if (element && element.open) {
        element.open = false;
        await awaitEvent(element, CLOSED_EVENT);
      }

      if (fixt) {
        fixt.remove();
      }
    });
  });

  describe('with actions', () => {
    let element: Dialog;
    let distFocusFixt: TestFixture;

    beforeEach(async () => {
      fixt = await fixture(withButtons);
      element = fixt.root.firstElementChild as Dialog;

      distFocusFixt = await fixture(distributedFocusContent);
    });

    it('Actions close dialog', async () => {
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

      expect(closedCalled).toBeFalse();

      primary.click();

      const action = await awaitEvent(element, CLOSED_EVENT);

      expect(closedCalled).toBeTrue();
      expect(action.detail.action).toBe('ok');

      closedCalled = false;

      element.open = true;
      await awaitEvent(element, OPENED_EVENT);

      secondary.setAttribute('data-dialogAction', 'cancel');

      secondary.click();

      const secondaryAction = await awaitEvent(element, CLOSED_EVENT);

      expect(closedCalled).toBeTrue();
      expect(secondaryAction.detail.action).toBe('cancel');
    });

    it('Initial focus attribute focuses', async () => {
      const button = element.firstElementChild as Button;

      expect(fixt.root.activeElement).toBeNull();

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      expect(fixt.root.activeElement).toBeNull();

      element.open = false;

      await awaitEvent(element, CLOSED_EVENT);

      expect(fixt.root.activeElement).toBeNull();

      button.setAttribute('dialogInitialFocus', '');

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      expect(fixt.root.activeElement).toBe(button);
    });

    it('initial focus not in light dom but still distributed', async () => {
      const testElement = distFocusFixt.root.firstElementChild!;
      const root = testElement.shadowRoot!;
      element = root.querySelector('mwc-dialog')!;

      await element.updateComplete;

      // secondary
      const primaryButton =
          testElement.querySelector('[slot="primaryAction"]') as Button;

      primaryButton.setAttribute('dialogInitialFocus', '');

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      expect(primaryButton.shadowRoot!.activeElement)
          .withContext('root slotted primary action is focused')
          .toBe(primaryButton.shadowRoot!.querySelector('button'));

      element.open = false;

      await awaitEvent(element, CLOSED_EVENT);

      primaryButton.removeAttribute('dialogInitialFocus');

      // secondary
      const secondaryButton =
          testElement.querySelector('[slot="secondaryAction"]') as Button;

      secondaryButton.setAttribute('dialogInitialFocus', '');

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      expect(secondaryButton.shadowRoot!.activeElement)
          .withContext('root slotted secondary action is focused')
          .toBe(secondaryButton.shadowRoot!.querySelector('button'));

      element.open = false;

      await awaitEvent(element, CLOSED_EVENT);

      secondaryButton.removeAttribute('dialogInitialFocus');

      // secondary
      const contentButton =
          testElement.querySelector('#contentButton') as Button;

      contentButton.setAttribute('dialogInitialFocus', '');

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      expect(contentButton.shadowRoot!.activeElement)
          .withContext('root slotted content focused')
          .toBe(contentButton.shadowRoot!.querySelector('button'));

      element.open = false;

      await awaitEvent(element, CLOSED_EVENT);

      contentButton.removeAttribute('dialogInitialFocus');

      // wrapped
      const wrappedContentButton =
          testElement.querySelector('#wrappedContentButton') as Button;

      wrappedContentButton.setAttribute('dialogInitialFocus', '');

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);

      expect(wrappedContentButton.shadowRoot!.activeElement)
          .withContext('wrapped slotted content focused')
          .toBe(wrappedContentButton.shadowRoot!.querySelector('button'));

      element.open = false;

      await awaitEvent(element, CLOSED_EVENT);

      wrappedContentButton.removeAttribute('dialogInitialFocus');
    });

    it('Stacking reverses actions', async () => {
      const primary = element.querySelector('[slot="primaryAction"]') as Button;
      const secondary =
          element.querySelector('[slot="secondaryAction"]') as Button;

      element.open = true;

      await awaitEvent(element, OPENED_EVENT);
      const topDiff = primary.offsetTop - secondary.offsetTop;

      // tops are within about 5 px of each other
      expect(Math.abs(topDiff) < 5).toBeTrue();
      expect(primary.offsetLeft > secondary.offsetLeft).toBeTrue();

      element.stacked = true;
      element.requestUpdate();
      await element.updateComplete;
      await rafPromise();

      const primaryRight = primary.offsetLeft + primary.offsetWidth;
      const secondaryRight = secondary.offsetLeft + secondary.offsetWidth;
      const rightDiff = primaryRight - secondaryRight;

      // rights are within about 5 px of each other: some browsers don't
      // calculate offsetLeft+offsetWidth to necessarily equal right
      expect(Math.abs(rightDiff) < 5).toBeTrue();
      expect(secondary.offsetTop > primary.offsetTop).toBeTrue();
    });

    it('Enter clicks primary action', async () => {
      const mdcRoot = element.shadowRoot!.querySelector('.mdc-dialog');
      expect(!!mdcRoot).withContext('root has rendered').toBeTrue();

      let clickCalled = false;
      const primary = element.querySelector('[slot="primaryAction"]') as Button;

      primary.addEventListener('click', () => {
        clickCalled = true;
      });

      element.open = true;
      await awaitEvent(element, OPENED_EVENT);

      expect(clickCalled).toBeFalse();

      const init = {detail: 0, bubbles: true, cancelable: true, composed: true};
      const enterDown = new CustomEvent('keydown', init);
      const enterUp = new CustomEvent('keyup', init);

      (enterDown as unknown as HasKeyCode).keyCode = 13;
      (enterUp as unknown as HasKeyCode).keyCode = 13;

      mdcRoot!.dispatchEvent(enterDown);
      mdcRoot!.dispatchEvent(enterUp);


      const action = await awaitEvent(element, CLOSED_EVENT);
      expect(clickCalled).toBeTrue();

      expect(action.detail.action).toBe('ok');
    });

    afterEach(async () => {
      if (element && element.open) {
        element.open = false;
        await awaitEvent(element, CLOSED_EVENT);
      }

      if (fixt) {
        fixt.remove();
      }

      if (distFocusFixt) {
        distFocusFixt.remove();
      }
    });
  });

  describe('disconnecting', () => {
    let container: HTMLElement;

    beforeEach(() => {
      container = document.createElement('div');
      document.body.appendChild(container);
    });

    afterEach(() => {
      document.body.removeChild(container);
      if (fixt) {
        fixt.remove();
      }
    });

    it('open event is cancelled when disconnected', async () => {
      const dialog = document.createElement('mwc-dialog');
      let sawOpenEvent = false;
      dialog.addEventListener(OPENED_EVENT, () => {
        sawOpenEvent = true;
      });
      container.appendChild(dialog);
      dialog.open = true;
      container.removeChild(dialog);
      // Wait according to MDC implementation plus a little more.
      await rafPromise();
      await new Promise((resolve) => {
        setTimeout(() => {
          // TODO(b/175626389): Expected 1 arguments, but got 0. Did you forget
          // to include 'void' in your type argument to 'Promise'?
          (resolve as any)();
        }, 150 + 10);
      });
      expect(sawOpenEvent).toBeFalse();
    });

    it('error not thrown after disconnect before animation', async () => {
      fixt = await fixture(withButtons);
      const dialog = fixt.root.querySelector('mwc-dialog')!;
      await dialog.updateComplete;
      dialog.open = true;
      await dialog.updateComplete;
      dialog.open = false;
      fixt.remove();
      await awaitEvent(dialog, OPENED_EVENT);
      // blocking elements throw should throw here and fail test
    });

    it('maintains open state when disconnected and reconnected', async () => {
      const dialog = document.createElement('mwc-dialog');
      container.appendChild(dialog);
      dialog.open = true;
      await awaitEvent(dialog, OPENED_EVENT);
      expect(dialog.open).toBeTrue();
      expect(blockingElements.top).toBe(dialog);

      container.removeChild(dialog);
      expect(dialog.open).toBeTrue();
      expect(blockingElements.top).toBe(null);
      await awaitEvent(dialog, CLOSED_EVENT);
      expect(dialog.open).toBeTrue();
      expect(blockingElements.top).toBe(null);

      container.appendChild(dialog);
      await awaitEvent(dialog, OPENED_EVENT);
      expect(dialog.open).toBeTrue();
      expect(blockingElements.top).toBe(dialog);
    });
  });

  it('should suppress default action for MWC elements', async () => {
    fixt = await fixture(withSuppressContent);

    const dialog = fixt.root.querySelector('mwc-dialog')!;
    dialog.open = true;
    await awaitEvent(dialog, OPENED_EVENT);

    let clickCalled = false;
    const primary = dialog.querySelector('[slot="primaryAction"]') as Button;
    primary.addEventListener('click', () => {
      clickCalled = true;
    });

    const init = {detail: 0, bubbles: true, cancelable: true, composed: true};
    const enterDown = new CustomEvent('keydown', init);
    const enterUp = new CustomEvent('keyup', init);
    (enterDown as unknown as HasKeyCode).keyCode = 13;
    (enterUp as unknown as HasKeyCode).keyCode = 13;

    const textarea = dialog.querySelector('mwc-textarea')!;
    const selectItem = dialog.querySelector('#select-item')!;
    const menuItem = dialog.querySelector('#menu-item')!;
    textarea.dispatchEvent(enterDown);
    textarea.dispatchEvent(enterUp);
    selectItem.dispatchEvent(enterDown);
    selectItem.dispatchEvent(enterUp);
    menuItem.dispatchEvent(enterDown);
    menuItem.dispatchEvent(enterUp);

    expect(clickCalled).toBeFalse();

    dialog.suppressDefaultPressSelector = '';
    textarea.dispatchEvent(enterDown);
    textarea.dispatchEvent(enterUp);

    expect(clickCalled).toBeTrue();

    if (dialog.open) {
      dialog.open = false;
      await awaitEvent(dialog, CLOSED_EVENT);
    }

    fixt.remove();
  });
});
