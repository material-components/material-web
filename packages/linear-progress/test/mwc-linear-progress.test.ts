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
import {LinearProgress} from '@material/mwc-linear-progress';
import {html} from 'lit-html';
import {styleMap} from 'lit-html/directives/style-map';

import {fixture, rafPromise, TestFixture} from '../../../test/src/util/helpers';

const awaitIndeterminateReady = async (element: LinearProgress) => {
  await element.updateComplete;
  await rafPromise();
  await rafPromise();
  await rafPromise();
};

const truncatePixelValue = (cssValue: string, decimals = 3) => {
  const cssPixelVal = Number(cssValue.replace('px', ''));
  if (Number.isNaN(cssPixelVal)) {
    throw new Error(`${cssValue} is not of format: \\d+\\.?\\d*px`);
  }
  let truncatedValue = cssPixelVal;
  const magnitude = Math.pow(10, decimals);

  if (cssPixelVal < 0) {
    truncatedValue = Math.ceil(cssPixelVal * magnitude) / magnitude;
  } else {
    truncatedValue = Math.floor(cssPixelVal * magnitude) / magnitude;
  }

  return `${truncatedValue}px`;
};

interface WithResizeObserver {
  resizeObserver: ResizeObserver|null;
}

const defaultLinearProgressProps = {
  indeterminate: false,
  closed: false,
  reverse: false,
  progress: 0,
  buffer: 1,
  width: '100px',
};

type LinearProgressProps = typeof defaultLinearProgressProps;

const defaultLinearProgressElement =
    html`<mwc-linear-progress></mwc-linear-progress>`;

const linearProgressElement =
    (propsInit: Partial<LinearProgressProps> = {}) => {
      const props:
          LinearProgressProps = {...defaultLinearProgressProps, ...propsInit};
      const styles = {
        width: props.width,
      };
      return html`
    <mwc-linear-progress
        ?indeterminate=${props.indeterminate}
        ?closed=${props.closed}
        ?reverse=${props.reverse}
        .progress=${props.progress}
        .buffer=${props.buffer}
        style=${styleMap(styles)}>
    </mwc-linear-progress>
  `;
    };

suite('mwc-linear-progress', () => {
  let fixt: TestFixture;
  let element: LinearProgress;

  teardown(() => {
    if (fixt) {
      fixt.remove();
    }
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultLinearProgressElement);
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    test('initializes as an mwc-linear-progress', () => {
      assert.instanceOf(element, LinearProgress);
      assert.equal(element.indeterminate, false);
      assert.equal(element.closed, false);
      assert.equal(element.reverse, false);
      assert.equal(element.progress, 0);
      assert.equal(element.buffer, 1);
    });

    test('internal classes set correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress')!;
      assert.isNotNull(root);

      const classlist = root.classList;

      assert.isFalse(classlist.contains('mdc-linear-progress--closed'));
      assert.isFalse(classlist.contains('mdc-linear-progress--indeterminate'));
      assert.isFalse(root.getAttribute('dir') === 'rtl');
      assert.isTrue(classlist.contains('mdc-linear-progress--animation-ready'));
    });

    test('sets internal styles correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      const primaryBar =
          element.shadowRoot!.querySelector(
              '.mdc-linear-progress__primary-bar') as HTMLElement;
      const bufferBar = element.shadowRoot!.querySelector(
                            '.mdc-linear-progress__buffer-bar') as HTMLElement;
      assert.isNotNull(root);
      assert.isNotNull(primaryBar);
      assert.isNotNull(bufferBar);

      assert.equal(
          root.style.getPropertyValue('--mdc-linear-progress-primary-half'),
          '');
      assert.equal(
          root.style.getPropertyValue('--mdc-linear-progress-primary-half-neg'),
          '');
      assert.equal(
          root.style.getPropertyValue('--mdc-linear-progress-primary-full'),
          '');
      assert.equal(
          root.style.getPropertyValue('--mdc-linear-progress-primary-full-neg'),
          '');
      assert.equal(
          root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-quarter'),
          '');
      assert.equal(
          root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-quarter-neg'),
          '');
      assert.equal(
          root.style.getPropertyValue('--mdc-linear-progress-secondary-half'),
          '');
      assert.equal(
          root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-half-neg'),
          '');
      assert.equal(
          root.style.getPropertyValue('--mdc-linear-progress-secondary-full'),
          '');
      assert.equal(
          root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-full-neg'),
          '');
      assert.equal(primaryBar.style.getPropertyValue('transform'), 'scaleX(0)');
      assert.equal(bufferBar.style.getPropertyValue('flex-basis'), '100%');
    });

    test('attaches a resize observer if available', async () => {
      fixt = await fixture(
          linearProgressElement({indeterminate: true, width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;

      await awaitIndeterminateReady(element);

      if (window.ResizeObserver) {
        assert.isNotNull(
            (element as unknown as WithResizeObserver).resizeObserver);
      } else {
        assert.isNull(
            (element as unknown as WithResizeObserver).resizeObserver);
      }
    });
  });

  suite('indeterminate', () => {
    setup(async () => {
      fixt = await fixture(
          linearProgressElement({indeterminate: true, width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    test('internal classes set correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress')!;
      assert.isNotNull(root);

      const classlist = root.classList;

      assert.isTrue(classlist.contains('mdc-linear-progress--indeterminate'));
      assert.isTrue(classlist.contains('mdc-linear-progress--animation-ready'));
    });

    test('sets internal styles correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      const primaryBar =
          element.shadowRoot!.querySelector(
              '.mdc-linear-progress__primary-bar') as HTMLElement;
      const bufferBar = element.shadowRoot!.querySelector(
                            '.mdc-linear-progress__buffer-bar') as HTMLElement;
      assert.isNotNull(root);
      assert.isNotNull(primaryBar);
      assert.isNotNull(bufferBar);

      assert.equal(primaryBar.style.getPropertyValue('transform'), 'scaleX(1)');
      assert.equal(bufferBar.style.getPropertyValue('flex-basis'), '100%');

      if (!window.ResizeObserver) {
        return;
      }
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-half')),
          '83.671px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-half-neg')),
          '-83.671px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-full')),
          '200.611px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-full-neg')),
          '-200.611px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-quarter')),
          '37.651px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-quarter-neg')),
          '-37.651px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-half')),
          '84.386px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-half-neg')),
          '-84.386px');
      assert.equal(
          truncatePixelValue(
              root.style.getPropertyValue(
                  '--mdc-linear-progress-secondary-full'),
              2),
          '160.27px');
      assert.equal(
          truncatePixelValue(
              root.style.getPropertyValue(
                  '--mdc-linear-progress-secondary-full-neg'),
              2),
          '-160.27px');
    });

    test('updates custom props if resized', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      assert.isNotNull(root);

      if (!window.ResizeObserver) {
        return;
      }

      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-half')),
          '83.671px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-half-neg')),
          '-83.671px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-full')),
          '200.611px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-full-neg')),
          '-200.611px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-quarter')),
          '37.651px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-quarter-neg')),
          '-37.651px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-half')),
          '84.386px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-half-neg')),
          '-84.386px');
      assert.equal(
          truncatePixelValue(
              root.style.getPropertyValue(
                  '--mdc-linear-progress-secondary-full'),
              2),
          '160.27px');
      assert.equal(
          truncatePixelValue(
              root.style.getPropertyValue(
                  '--mdc-linear-progress-secondary-full-neg'),
              2),
          '-160.27px');

      element.style.setProperty('width', '10px');

      await awaitIndeterminateReady(element);

      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-half')),
          '8.367px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-half-neg')),
          '-8.367px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-full')),
          '20.061px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-full-neg')),
          '-20.061px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-quarter')),
          '3.765px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-quarter-neg')),
          '-3.765px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-half')),
          '8.438px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-half-neg')),
          '-8.438px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-full')),
          '16.027px');
      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-secondary-full-neg')),
          '-16.027px');
    });

    test('does not update custom props if determinate', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      assert.isNotNull(root);

      if (!window.ResizeObserver) {
        return;
      }

      element.indeterminate = false;
      await awaitIndeterminateReady(element);

      element.style.setProperty('width', '10px');

      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-half')),
          '83.671px');

      element.indeterminate = true;
      await awaitIndeterminateReady(element);

      assert.equal(
          truncatePixelValue(root.style.getPropertyValue(
              '--mdc-linear-progress-primary-half')),
          '8.367px');
    });
  });

  suite('reverse', () => {
    setup(async () => {
      fixt =
          await fixture(linearProgressElement({reverse: true, width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    test('sets the correct attributes', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      assert.isNotNull(root);

      assert.isTrue(root.getAttribute('dir') === 'rtl');
    });
  });

  suite('open, close, closed', () => {
    setup(async () => {
      fixt =
          await fixture(linearProgressElement({closed: true, width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    test('sets the correct classes', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      assert.isNotNull(root);

      await element.updateComplete;
      assert.isTrue(root.classList.contains('mdc-linear-progress--closed'));
      assert.isTrue(
          root.classList.contains('mdc-linear-progress--closed-animation-off'));

      element.closed = false;

      await element.updateComplete;

      assert.isFalse(root.classList.contains('mdc-linear-progress--closed'));
      assert.isFalse(
          root.classList.contains('mdc-linear-progress--closed-animation-off'));
    });

    test('open, close methods set the correct classes', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      assert.isNotNull(root);

      assert.isTrue(root.classList.contains('mdc-linear-progress--closed'));

      element.open();

      await element.updateComplete;

      assert.isFalse(root.classList.contains('mdc-linear-progress--closed'));

      element.close();

      await element.updateComplete;

      assert.isTrue(root.classList.contains('mdc-linear-progress--closed'));
    });
  });

  suite('progress', () => {
    setup(async () => {
      fixt = await fixture(linearProgressElement({width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    test('sets the correct determinate styles', async () => {
      const primary = element.shadowRoot!.querySelector(
                          '.mdc-linear-progress__primary-bar') as HTMLElement;
      assert.isNotNull(primary);

      assert.equal(element.progress, 0);
      assert.equal(primary.style.getPropertyValue('transform'), 'scaleX(0)');

      element.progress = 0.5;
      await element.updateComplete;

      assert.equal(element.progress, 0.5);
      assert.equal(primary.style.getPropertyValue('transform'), 'scaleX(0.5)');
    });

    test('doesn\'t set style if indeterminate', async () => {
      const primary = element.shadowRoot!.querySelector(
                          '.mdc-linear-progress__primary-bar') as HTMLElement;
      assert.isNotNull(primary);

      element.progress = 0.5;
      await element.updateComplete;

      assert.equal(element.progress, 0.5);
      assert.equal(primary.style.getPropertyValue('transform'), 'scaleX(0.5)');

      element.indeterminate = true;

      await awaitIndeterminateReady(element);

      assert.equal(element.progress, 0.5);
      assert.equal(primary.style.getPropertyValue('transform'), 'scaleX(1)');

      element.progress = 0.6;
      await element.updateComplete;

      assert.equal(element.progress, 0.6);
      assert.equal(primary.style.getPropertyValue('transform'), 'scaleX(1)');
    });

    test('aria-valuenow set correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      assert.isNotNull(root);

      assert.equal(root.getAttribute('aria-valuenow'), '0');

      element.progress = 0.5;
      await element.updateComplete;

      assert.equal(root.getAttribute('aria-valuenow'), '0.5');

      element.progress = 2;
      await element.updateComplete;

      assert.equal(root.getAttribute('aria-valuenow'), '2');
    });

    test('aria-valuenow removed if indeterminate', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      assert.isNotNull(root);

      assert.equal(root.getAttribute('aria-valuenow'), '0');

      element.indeterminate = true;
      await awaitIndeterminateReady(element);


      element.progress = 0.5;
      await element.updateComplete;

      assert.isNull(root.getAttribute('aria-valuenow'));
    });
  });

  suite('buffer', () => {
    setup(async () => {
      fixt = await fixture(linearProgressElement({width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    test('sets the correct determinate styles', async () => {
      const secondary = element.shadowRoot!.querySelector(
                            '.mdc-linear-progress__buffer-bar') as HTMLElement;
      assert.isNotNull(secondary);

      assert.equal(element.buffer, 1);
      assert.equal(secondary.style.getPropertyValue('flex-basis'), '100%');

      element.buffer = 0.5;
      await element.updateComplete;

      assert.equal(element.buffer, 0.5);
      assert.equal(secondary.style.getPropertyValue('flex-basis'), '50%');
    });

    test('doesn\'t set style if indeterminate', async () => {
      const secondary = element.shadowRoot!.querySelector(
                            '.mdc-linear-progress__buffer-bar') as HTMLElement;
      assert.isNotNull(secondary);

      element.buffer = 0.5;
      await element.updateComplete;

      assert.equal(element.buffer, 0.5);
      assert.equal(secondary.style.getPropertyValue('flex-basis'), '50%');

      element.indeterminate = true;

      await awaitIndeterminateReady(element);

      assert.equal(element.buffer, 0.5);
      assert.equal(secondary.style.getPropertyValue('flex-basis'), '100%');

      element.buffer = 0.6;
      await element.updateComplete;

      assert.equal(element.buffer, 0.6);
      assert.equal(secondary.style.getPropertyValue('flex-basis'), '100%');
    });
  });

  suite('ariaLabel', () => {
    setup(async () => {
      fixt = await fixture(linearProgressElement({width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    test('defaults to no aria-label', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;

      assert.isNotNull(root);

      assert.isNull(root.getAttribute('aria-label'));
    });

    test('correctly sets to aria-label', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;

      assert.isNotNull(root);

      element.ariaLabel = 'test label';

      await element.updateComplete;

      assert.equal(root.getAttribute('aria-label'), 'test label');
    });
  });
});
