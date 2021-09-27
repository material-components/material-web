/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {MDCResizeObserver, WithMDCResizeObserver} from '@material/linear-progress/types';
import {LinearProgress} from '@material/mwc-linear-progress';
import {html} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

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

interface ElWithRO {
  resizeObserver: MDCResizeObserver|null;
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

describe('mwc-linear-progress', () => {
  let fixt: TestFixture;
  let element: LinearProgress;

  afterEach(() => {
    if (fixt) {
      fixt.remove();
    }
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultLinearProgressElement);
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    it('initializes as an mwc-linear-progress', () => {
      expect(element).toBeInstanceOf(LinearProgress);
      expect(element.indeterminate).toEqual(false);
      expect(element.closed).toEqual(false);
      expect(element.reverse).toEqual(false);
      expect(element.progress).toEqual(0);
      expect(element.buffer).toEqual(1);
    });

    it('internal classes set correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress')!;
      expect(root).not.toBeNull();

      const classlist = root.classList;

      expect(classlist.contains('mdc-linear-progress--closed')).toBeFalse();
      expect(classlist.contains('mdc-linear-progress--indeterminate'))
          .toBeFalse();
      expect(root.getAttribute('dir') === 'rtl').toBeFalse();
      expect(classlist.contains('mdc-linear-progress--animation-ready'))
          .toBeTrue();
    });

    it('sets internal styles correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      const primaryBar =
          element.shadowRoot!.querySelector(
              '.mdc-linear-progress__primary-bar') as HTMLElement;
      const bufferBar = element.shadowRoot!.querySelector(
                            '.mdc-linear-progress__buffer-bar') as HTMLElement;
      expect(root).not.toBeNull();
      expect(primaryBar).not.toBeNull();
      expect(bufferBar).not.toBeNull();

      expect(root.style.getPropertyValue('--mdc-linear-progress-primary-half'))
          .toEqual('');
      expect(
          root.style.getPropertyValue('--mdc-linear-progress-primary-half-neg'))
          .toEqual('');
      expect(root.style.getPropertyValue('--mdc-linear-progress-primary-full'))
          .toEqual('');
      expect(
          root.style.getPropertyValue('--mdc-linear-progress-primary-full-neg'))
          .toEqual('');
      expect(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-quarter'))
          .toEqual('');
      expect(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-quarter-neg'))
          .toEqual('');
      expect(
          root.style.getPropertyValue('--mdc-linear-progress-secondary-half'))
          .toEqual('');
      expect(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-half-neg'))
          .toEqual('');
      expect(
          root.style.getPropertyValue('--mdc-linear-progress-secondary-full'))
          .toEqual('');
      expect(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-full-neg'))
          .toEqual('');
      expect(primaryBar.style.getPropertyValue('transform'))
          .toEqual('scaleX(0)');
      expect(bufferBar.style.getPropertyValue('flex-basis')).toEqual('100%');
    });

    it('attaches a resize observer if available', async () => {
      fixt = await fixture(
          linearProgressElement({indeterminate: true, width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;

      await awaitIndeterminateReady(element);

      if ((window as unknown as WithMDCResizeObserver).ResizeObserver) {
        expect((element as unknown as ElWithRO).resizeObserver).not.toBeNull();
      } else {
        expect((element as unknown as ElWithRO).resizeObserver).toBeNull();
      }
    });
  });

  describe('indeterminate', () => {
    beforeEach(async () => {
      fixt = await fixture(
          linearProgressElement({indeterminate: true, width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    it('internal classes set correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress')!;
      expect(root).not.toBeNull();

      const classlist = root.classList;

      expect(classlist.contains('mdc-linear-progress--indeterminate'))
          .toBeTrue();
      expect(classlist.contains('mdc-linear-progress--animation-ready'))
          .toBeTrue();
    });

    it('sets internal styles correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      const primaryBar =
          element.shadowRoot!.querySelector(
              '.mdc-linear-progress__primary-bar') as HTMLElement;
      const bufferBar = element.shadowRoot!.querySelector(
                            '.mdc-linear-progress__buffer-bar') as HTMLElement;
      expect(root).not.toBeNull();
      expect(primaryBar).not.toBeNull();
      expect(bufferBar).not.toBeNull();

      expect(primaryBar.style.getPropertyValue('transform'))
          .toEqual('scaleX(1)');
      expect(bufferBar.style.getPropertyValue('flex-basis')).toEqual('100%');

      if (!(window as unknown as WithMDCResizeObserver).ResizeObserver) {
        return;
      }
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-half')))
          .toEqual('83.671px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-half-neg')))
          .toEqual('-83.671px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-full')))
          .toEqual('200.611px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-full-neg')))
          .toEqual('-200.611px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-quarter')))
          .toEqual('37.651px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-quarter-neg')))
          .toEqual('-37.651px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-half')))
          .toEqual('84.386px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-half-neg')))
          .toEqual('-84.386px');
      expect(truncatePixelValue(
                 root.style.getPropertyValue(
                     '--mdc-linear-progress-secondary-full'),
                 2))
          .toEqual('160.27px');
      expect(truncatePixelValue(
                 root.style.getPropertyValue(
                     '--mdc-linear-progress-secondary-full-neg'),
                 2))
          .toEqual('-160.27px');
    });

    it('updates custom props if resized', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      expect(root).not.toBeNull();

      if (!(window as unknown as WithMDCResizeObserver).ResizeObserver) {
        return;
      }

      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-half')))
          .toEqual('83.671px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-half-neg')))
          .toEqual('-83.671px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-full')))
          .toEqual('200.611px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-full-neg')))
          .toEqual('-200.611px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-quarter')))
          .toEqual('37.651px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-quarter-neg')))
          .toEqual('-37.651px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-half')))
          .toEqual('84.386px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-half-neg')))
          .toEqual('-84.386px');
      expect(truncatePixelValue(
                 root.style.getPropertyValue(
                     '--mdc-linear-progress-secondary-full'),
                 2))
          .toEqual('160.27px');
      expect(truncatePixelValue(
                 root.style.getPropertyValue(
                     '--mdc-linear-progress-secondary-full-neg'),
                 2))
          .toEqual('-160.27px');

      element.style.setProperty('width', '10px');

      await awaitIndeterminateReady(element);

      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-half')))
          .toEqual('8.367px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-half-neg')))
          .toEqual('-8.367px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-full')))
          .toEqual('20.061px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-full-neg')))
          .toEqual('-20.061px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-quarter')))
          .toEqual('3.765px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-quarter-neg')))
          .toEqual('-3.765px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-half')))
          .toEqual('8.438px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-half-neg')))
          .toEqual('-8.438px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-full')))
          .toEqual('16.027px');
      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-secondary-full-neg')))
          .toEqual('-16.027px');
    });

    it('does not update custom props if determinate', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      expect(root).not.toBeNull();

      if (!(window as unknown as WithMDCResizeObserver).ResizeObserver) {
        return;
      }

      element.indeterminate = false;
      await awaitIndeterminateReady(element);

      element.style.setProperty('width', '10px');

      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-half')))
          .toEqual('83.671px');

      element.indeterminate = true;
      await awaitIndeterminateReady(element);

      expect(truncatePixelValue(root.style.getPropertyValue(
                 '--mdc-linear-progress-primary-half')))
          .toEqual('8.367px');
    });
  });

  describe('reverse', () => {
    beforeEach(async () => {
      fixt =
          await fixture(linearProgressElement({reverse: true, width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    it('sets the correct attributes', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      expect(root).not.toBeNull();

      expect(root.getAttribute('dir') === 'rtl').toBeTrue();
    });
  });

  describe('open, close, closed', () => {
    beforeEach(async () => {
      fixt =
          await fixture(linearProgressElement({closed: true, width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    it('sets the correct classes', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      expect(root).not.toBeNull();

      await element.updateComplete;
      expect(root.classList.contains('mdc-linear-progress--closed')).toBeTrue();
      expect(
          root.classList.contains('mdc-linear-progress--closed-animation-off'))
          .toBeTrue();

      element.closed = false;

      await element.updateComplete;

      expect(root.classList.contains('mdc-linear-progress--closed'))
          .toBeFalse();
      expect(
          root.classList.contains('mdc-linear-progress--closed-animation-off'))
          .toBeFalse();
    });

    it('open, close methods set the correct classes', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      expect(root).not.toBeNull();

      expect(root.classList.contains('mdc-linear-progress--closed')).toBeTrue();

      element.open();

      await element.updateComplete;

      expect(root.classList.contains('mdc-linear-progress--closed'))
          .toBeFalse();

      element.close();

      await element.updateComplete;

      expect(root.classList.contains('mdc-linear-progress--closed')).toBeTrue();
    });
  });

  describe('progress', () => {
    beforeEach(async () => {
      fixt = await fixture(linearProgressElement({width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    it('sets the correct determinate styles', async () => {
      const primary = element.shadowRoot!.querySelector(
                          '.mdc-linear-progress__primary-bar') as HTMLElement;
      expect(primary).not.toBeNull();

      expect(element.progress).toEqual(0);
      expect(primary.style.getPropertyValue('transform')).toEqual('scaleX(0)');

      element.progress = 0.5;
      await element.updateComplete;

      expect(element.progress).toEqual(0.5);
      expect(primary.style.getPropertyValue('transform'))
          .toEqual('scaleX(0.5)');
    });

    it('doesn\'t set style if indeterminate', async () => {
      const primary = element.shadowRoot!.querySelector(
                          '.mdc-linear-progress__primary-bar') as HTMLElement;
      expect(primary).not.toBeNull();

      element.progress = 0.5;
      await element.updateComplete;

      expect(element.progress).toEqual(0.5);
      expect(primary.style.getPropertyValue('transform'))
          .toEqual('scaleX(0.5)');

      element.indeterminate = true;

      await awaitIndeterminateReady(element);

      expect(element.progress).toEqual(0.5);
      expect(primary.style.getPropertyValue('transform')).toEqual('scaleX(1)');

      element.progress = 0.6;
      await element.updateComplete;

      expect(element.progress).toEqual(0.6);
      expect(primary.style.getPropertyValue('transform')).toEqual('scaleX(1)');
    });

    it('aria-valuenow set correctly', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      expect(root).not.toBeNull();

      expect(root.getAttribute('aria-valuenow')).toEqual('0');

      element.progress = 0.5;
      await element.updateComplete;

      expect(root.getAttribute('aria-valuenow')).toEqual('0.5');

      element.progress = 2;
      await element.updateComplete;

      expect(root.getAttribute('aria-valuenow')).toEqual('2');
    });

    it('aria-valuenow removed if indeterminate', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;
      expect(root).not.toBeNull();

      expect(root.getAttribute('aria-valuenow')).toEqual('0');

      element.indeterminate = true;
      await awaitIndeterminateReady(element);


      element.progress = 0.5;
      await element.updateComplete;

      expect(root.getAttribute('aria-valuenow')).toBeNull();
    });
  });

  describe('buffer', () => {
    beforeEach(async () => {
      fixt = await fixture(linearProgressElement({width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    it('sets the correct determinate styles', async () => {
      const secondary = element.shadowRoot!.querySelector(
                            '.mdc-linear-progress__buffer-bar') as HTMLElement;
      expect(secondary).not.toBeNull();

      expect(element.buffer).toEqual(1);
      expect(secondary.style.getPropertyValue('flex-basis')).toEqual('100%');

      element.buffer = 0.5;
      await element.updateComplete;

      expect(element.buffer).toEqual(0.5);
      expect(secondary.style.getPropertyValue('flex-basis')).toEqual('50%');
    });

    it('doesn\'t set style if indeterminate', async () => {
      const secondary = element.shadowRoot!.querySelector(
                            '.mdc-linear-progress__buffer-bar') as HTMLElement;
      expect(secondary).not.toBeNull();

      element.buffer = 0.5;
      await element.updateComplete;

      expect(element.buffer).toEqual(0.5);
      expect(secondary.style.getPropertyValue('flex-basis')).toEqual('50%');

      element.indeterminate = true;

      await awaitIndeterminateReady(element);

      expect(element.buffer).toEqual(0.5);
      expect(secondary.style.getPropertyValue('flex-basis')).toEqual('100%');

      element.buffer = 0.6;
      await element.updateComplete;

      expect(element.buffer).toEqual(0.6);
      expect(secondary.style.getPropertyValue('flex-basis')).toEqual('100%');
    });
  });

  describe('ariaLabel', () => {
    beforeEach(async () => {
      fixt = await fixture(linearProgressElement({width: '100px'}));
      element = fixt.root.querySelector('mwc-linear-progress')!;
      await awaitIndeterminateReady(element);
    });

    it('defaults to no aria-label', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;

      expect(root).not.toBeNull();

      expect(root.getAttribute('aria-label')).toBeNull();
    });

    it('correctly sets to aria-label with .ariaLabel', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;

      expect(root).not.toBeNull();

      element.ariaLabel = 'test label';

      await element.updateComplete;

      expect(root.getAttribute('aria-label')).toEqual('test label');
    });

    it('correctly sets to aria-label with aria-label', async () => {
      const root = element.shadowRoot!.querySelector('.mdc-linear-progress') as
          HTMLElement;

      expect(root).not.toBeNull();

      element.setAttribute('aria-label', 'test label');

      await element.updateComplete;

      expect(root.getAttribute('aria-label')).toEqual('test label');
    });
  });
});
