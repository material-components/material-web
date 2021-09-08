/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {CircularProgressFourColor} from '@material/mwc-circular-progress-four-color';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

const INDETERMINATE_CLASS = 'mdc-circular-progress--indeterminate';

interface ProgressProps {
  ariaLabel: string|undefined;
  progress: number;
  indeterminate: true;
}

const defaultProgress = html`
  <mwc-circular-progress-four-color>
  </mwc-circular-progress-four-color>`;

const progress = (propsInit: Partial<ProgressProps>) => {
  return html`
    <mwc-circular-progress-four-color
      progress="${propsInit.progress ?? 0}"
      aria-label="${propsInit.ariaLabel ?? ''}"
      ?indeterminate=${propsInit.indeterminate === true}>
    </mwc-circular-progress-four-color>
  `;
};

describe('mwc-circular-progress-four-color', () => {
  let fixt: TestFixture;
  let element: CircularProgressFourColor;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultProgress);
      element = fixt.root.querySelector('mwc-circular-progress-four-color')!;
    });

    it('initializes as an mwc-circular-progress-four-color', () => {
      expect(element).toBeInstanceOf(CircularProgressFourColor);
      expect(element.indeterminate).toBeFalse();
      expect(element.progress).toEqual(0);
      expect(element.density).toEqual(0);
      expect(element.closed).toBeFalse();
      expect(element.ariaLabel).toBeFalsy();
    });

    it('open sets closed to false', async () => {
      element.closed = true;
      element.open();
      expect(element.closed).toEqual(false);
    });

    it('close sets closed to true', async () => {
      element.closed = false;
      element.close();
      expect(element.closed).toEqual(true);
    });
  });

  describe('ariaLabel', () => {
    beforeEach(async () => {
      fixt = await fixture(progress({ariaLabel: 'Unit Test Progress Bar'}));
      element = fixt.root.querySelector('mwc-circular-progress-four-color')!;
      await element.updateComplete;
    });

    it('sets `aria-label`', async () => {
      const progressBar =
          element.shadowRoot!.querySelector('.mdc-circular-progress')!;

      expect(progressBar.getAttribute('aria-label'))
          .toEqual('Unit Test Progress Bar');

      element.ariaLabel = 'Another label';
      await element.updateComplete;

      expect(progressBar.getAttribute('aria-label')).toEqual('Another label');
    });
  });

  describe('progress', () => {
    beforeEach(async () => {
      fixt = await fixture(progress({progress: 0.5}));
      element = fixt.root.querySelector('mwc-circular-progress-four-color')!;
      await element.updateComplete;
    });

    it('sets inner progress', async () => {
      const progressBar =
          element.shadowRoot!.querySelector('.mdc-circular-progress')!;
      expect(progressBar.getAttribute('aria-valuenow')).toEqual('0.5');
    });
  });

  describe('indeterminate', () => {
    beforeEach(async () => {
      fixt = await fixture(progress({indeterminate: true}));
      element = fixt.root.querySelector('mwc-circular-progress-four-color')!;
      await element.updateComplete;
    });

    it('sets correct inner class', async () => {
      const progressBar =
          element.shadowRoot!.querySelector('.mdc-circular-progress')!;
      expect(progressBar.classList.contains(INDETERMINATE_CLASS)).toBeTrue();
      element.indeterminate = false;
      await element.updateComplete;
      expect(progressBar.classList.contains(INDETERMINATE_CLASS)).toBeFalse();
    });
  });
});
