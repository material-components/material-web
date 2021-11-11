/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';
import {ifDefined} from 'lit/directives/if-defined';

import {fixture, rafPromise, TestFixture} from '../../../../test/src/util/helpers';

import {RTLElement} from './rtl-element';

function setDocumentDirection(direction: 'ltr'|'rtl') {
  document.documentElement.dir = direction;
}

function getLeftMargin(element: RTLElement) {
  return getComputedStyle(element.testElement).marginLeft;
}

const LTR_MARGIN = '10px';
const RTL_MARGIN = '20px';

const template = (direction?: 'ltr'|'rtl') => {
  return html`<rtl-element dir=${ifDefined(direction)}></rtl-element>`;
};

describe('RTLController', () => {
  let fixt: TestFixture;
  let element: RTLElement;

  beforeEach(() => {
    setDocumentDirection('ltr');
  });

  afterEach(() => {
    fixt.remove();
  });

  describe('standard', () => {
    beforeEach(async () => {
      fixt = await fixture(template());
      element = fixt.root.querySelector('rtl-element')!;
      await element.updateComplete;
    });

    it('syncs on insertion', async () => {
      setDocumentDirection('rtl');
      await rafPromise();
      expect(getLeftMargin(element)).toEqual(RTL_MARGIN);
    });

    it('syncs on document element direction change', async () => {
      expect(getLeftMargin(element)).toEqual(LTR_MARGIN);
      setDocumentDirection('rtl');
      await rafPromise();
      expect(getLeftMargin(element)).toEqual(RTL_MARGIN);
    });
  });

  describe('opt-out', () => {
    beforeEach(async () => {
      fixt = await fixture(template('rtl'));
      element = fixt.root.querySelector('rtl-element')!;
      await element.updateComplete;
    });

    it('can be opted out by setting direction manually', async () => {
      expect(getLeftMargin(element)).toEqual(RTL_MARGIN);
      setDocumentDirection('rtl');
      await rafPromise();
      expect(getLeftMargin(element)).toEqual(RTL_MARGIN);
      setDocumentDirection('ltr');
      await rafPromise();
      expect(getLeftMargin(element)).toEqual(RTL_MARGIN);
    });

    it('can be opted-in again by removing custom direction when not attached',
       async () => {
         expect(getLeftMargin(element)).toEqual(RTL_MARGIN);
         element.remove();
         element.dir = '';
         fixt.root.appendChild(element);
         await rafPromise();
         expect(getLeftMargin(element)).toEqual(LTR_MARGIN);
         setDocumentDirection('rtl');
         await rafPromise();
         expect(getLeftMargin(element)).toEqual(RTL_MARGIN);
       });

    it('will not automatically opt-in when disconnected and reconnected',
       async () => {
         element.remove();
         fixt.root.appendChild(element);
         await rafPromise();
         expect(getLeftMargin(element)).toEqual(RTL_MARGIN);
       });
  });
});