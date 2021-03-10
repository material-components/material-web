/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
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
import {CircularProgress} from '@material/mwc-circular-progress';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

const INDETERMINATE_CLASS = 'mdc-circular-progress--indeterminate';

interface ProgressProps {
  ariaLabel: string|undefined;
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

suite('mwc-circular-progress', () => {
  let fixt: TestFixture;
  let element: CircularProgress;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultProgress);
      element = fixt.root.querySelector('mwc-circular-progress')!;
    });

    test('initializes as an mwc-circular-progress', () => {
      assert.instanceOf(element, CircularProgress);
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
      element = fixt.root.querySelector('mwc-circular-progress')!;
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
      element = fixt.root.querySelector('mwc-circular-progress')!;
      await element.updateComplete;
    });

    test('sets inner progress', async () => {
      const progressBar =
          element.shadowRoot!.querySelector('.mdc-circular-progress')!;
      assert.equal(progressBar.getAttribute('aria-valuenow'), '0.5');
    });

    test('has an upper bound of 1', async () => {
      element.progress = 2;
      await element.updateComplete;
      assert.equal(element.progress, 1);
    });

    test('has a lower bound of 0', async () => {
      element.progress = -1;
      await element.updateComplete;
      assert.equal(element.progress, 0);
    });
  });

  suite('indeterminate', () => {
    setup(async () => {
      fixt = await fixture(progress({indeterminate: true}));
      element = fixt.root.querySelector('mwc-circular-progress')!;
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

  suite('density', () => {
    setup(async () => {
      fixt = await fixture(progress({density: 0.5}));
      element = fixt.root.querySelector('mwc-circular-progress')!;
      await element.updateComplete;
    });

    test('affects progress size', () => {
      const progressBar = element.shadowRoot!.querySelector<HTMLElement>(
          '.mdc-circular-progress')!;
      assert.equal(progressBar.style.width, '50px');
      assert.equal(progressBar.style.height, '50px');
    });
  });
});
