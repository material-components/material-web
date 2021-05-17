/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
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

suite('mwc-circular-progress-four-color', () => {
  let fixt: TestFixture;
  let element: CircularProgressFourColor;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultProgress);
      element = fixt.root.querySelector('mwc-circular-progress-four-color')!;
    });

    test('initializes as an mwc-circular-progress-four-color', () => {
      assert.instanceOf(element, CircularProgressFourColor);
      assert.isFalse(element.indeterminate);
      assert.equal(element.progress, 0);
      assert.equal(element.density, 0);
      assert.isFalse(element.closed);
      assert.equal(element.ariaLabel, undefined);
    });

    test('open sets closed to false', async () => {
      element.closed = true;
      element.open();
      assert.equal(element.closed, false);
    });

    test('close sets closed to true', async () => {
      element.closed = false;
      element.close();
      assert.equal(element.closed, true);
    });
  });

  suite('ariaLabel', () => {
    setup(async () => {
      fixt = await fixture(progress({ariaLabel: 'Unit Test Progress Bar'}));
      element = fixt.root.querySelector('mwc-circular-progress-four-color')!;
      await element.updateComplete;
    });

    test('sets `aria-label`', async () => {
      const progressBar =
          element.shadowRoot!.querySelector('.mdc-circular-progress')!;

      assert.equal(
          progressBar.getAttribute('aria-label'), 'Unit Test Progress Bar');

      element.ariaLabel = 'Another label';
      await element.updateComplete;

      assert.equal(progressBar.getAttribute('aria-label'), 'Another label');
    });
  });

  suite('progress', () => {
    setup(async () => {
      fixt = await fixture(progress({progress: 0.5}));
      element = fixt.root.querySelector('mwc-circular-progress-four-color')!;
      await element.updateComplete;
    });

    test('sets inner progress', async () => {
      const progressBar =
          element.shadowRoot!.querySelector('.mdc-circular-progress')!;
      assert.equal(progressBar.getAttribute('aria-valuenow'), '0.5');
    });
  });

  suite('indeterminate', () => {
    setup(async () => {
      fixt = await fixture(progress({indeterminate: true}));
      element = fixt.root.querySelector('mwc-circular-progress-four-color')!;
      await element.updateComplete;
    });

    test('sets correct inner class', async () => {
      const progressBar =
          element.shadowRoot!.querySelector('.mdc-circular-progress')!;
      assert.isTrue(progressBar.classList.contains(INDETERMINATE_CLASS));
      element.indeterminate = false;
      await element.updateComplete;
      assert.isFalse(progressBar.classList.contains(INDETERMINATE_CLASS));
    });
  });
});
