/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {CircularProgress} from '@material/mwc-circular-progress';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

const INDETERMINATE_CLASS = 'mdc-circular-progress--indeterminate';

interface ProgressProps {
  ariaLabel: string;
  progress: number;
  indeterminate: true;
  density: number;
}

const defaultProgress = html`
  <mwc-circular-progress>
  </mwc-circular-progress>`;

const progress = (propsInit: Partial<ProgressProps>) => {
  return html`
    <mwc-circular-progress
      progress=${propsInit.progress ?? 0}
      density=${propsInit.density ?? 0}
      aria-label=${propsInit.ariaLabel ?? ''}
      ?indeterminate=${propsInit.indeterminate === true}>
    </mwc-circular-progress>
  `;
};

describe('mwc-circular-progress', () => {
  let fixt: TestFixture;
  let element: CircularProgress;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultProgress);
      element = fixt.root.querySelector('mwc-circular-progress')!;
    });

    it('initializes as an mwc-circular-progress', () => {
      expect(element).toBeInstanceOf(CircularProgress);
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
      element = fixt.root.querySelector('mwc-circular-progress')!;
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
      element = fixt.root.querySelector('mwc-circular-progress')!;
      await element.updateComplete;
    });

    it('sets inner progress', async () => {
      const progressBar =
          element.shadowRoot!.querySelector('.mdc-circular-progress')!;
      expect(progressBar.getAttribute('aria-valuenow')).toEqual('0.5');
    });

    it('has an upper bound of 1', async () => {
      element.progress = 2;
      await element.updateComplete;
      expect(element.progress).toEqual(1);
    });

    it('has a lower bound of 0', async () => {
      element.progress = -1;
      await element.updateComplete;
      expect(element.progress).toEqual(0);
    });
  });

  describe('indeterminate', () => {
    beforeEach(async () => {
      fixt = await fixture(progress({indeterminate: true}));
      element = fixt.root.querySelector('mwc-circular-progress')!;
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

  describe('density', () => {
    beforeEach(async () => {
      fixt = await fixture(progress({density: 0.5}));
      element = fixt.root.querySelector('mwc-circular-progress')!;
      await element.updateComplete;
    });

    it('affects progress size', () => {
      const progressBar = element.shadowRoot!.querySelector<HTMLElement>(
          '.mdc-circular-progress')!;
      expect(progressBar.style.width).toEqual('50px');
      expect(progressBar.style.height).toEqual('50px');
    });
  });
});
