/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-linear-progress.js';

import {html} from 'lit';

import {Environment} from '../../../../testing/environment.js';

import {linearWavePath} from './linear-progress.js';
import {LinearProgressElement} from './linear-progress-element.js';

describe('<md-gb-linear-progress>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-gb-linear-progress></md-gb-linear-progress>`,
  ) {
    const root = env.render(template);
    const element = root.querySelector('md-gb-linear-progress');
    if (!(element instanceof LinearProgressElement)) {
      throw new Error('Could not find LinearProgressElement');
    }
    await env.waitForStability();
    const progressbar = element.shadowRoot!.querySelector<HTMLElement>(
      '[role="progressbar"]',
    )!;
    return {element, progressbar};
  }

  it('renders a progressbar with default ARIA values', async () => {
    const {progressbar} = await setupTest();
    expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('1');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('0');
  });

  it('renders the linear-progress root class', async () => {
    const {progressbar} = await setupTest();
    expect(progressbar.classList.contains('linear-progress')).toBeTrue();
  });

  it('reflects value and max to ARIA', async () => {
    const {progressbar} = await setupTest(
      html`<md-gb-linear-progress
        .value=${0.5}
        .max=${2}></md-gb-linear-progress>`,
    );
    expect(progressbar.getAttribute('aria-valuemax')).toBe('2');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('0.5');
  });

  it('removes aria-valuenow when indeterminate', async () => {
    const {progressbar} = await setupTest(
      html`<md-gb-linear-progress indeterminate></md-gb-linear-progress>`,
    );
    expect(progressbar.hasAttribute('aria-valuenow')).toBeFalse();
  });

  it('delegates host aria-label to the progressbar', async () => {
    const {progressbar} = await setupTest(
      html`<md-gb-linear-progress
        aria-label="Loading"></md-gb-linear-progress>`,
    );
    expect(progressbar.getAttribute('aria-label')).toBe('Loading');
  });

  it('reveals the active path via stroke-dashoffset when determinate', async () => {
    const {element} = await setupTest(
      html`<md-gb-linear-progress
        .value=${0.5}
        .max=${1}></md-gb-linear-progress>`,
    );
    const active = element.shadowRoot!.querySelector(
      'svg path.linear-progress-active',
    )!;
    // (1 - 0.5 / 1) * 100 = 50
    expect(active.getAttribute('stroke-dashoffset')).toBe('50');
  });

  it('measures its width and renders a sized indicator viewBox', async () => {
    const {element} = await setupTest(
      html`<md-gb-linear-progress
        style="width: 200px"
        .value=${0.5}></md-gb-linear-progress>`,
    );
    const svg = element.shadowRoot!.querySelector<SVGElement>(
      'svg.linear-progress-indicator',
    )!;
    const viewBoxWidth = Number(svg.getAttribute('viewBox')!.split(' ')[2]);
    expect(viewBoxWidth).toBeGreaterThan(0);
  });

  it('renders a stop indicator when determinate', async () => {
    const {element} = await setupTest(
      html`<md-gb-linear-progress .value=${0.5}></md-gb-linear-progress>`,
    );
    expect(
      element.shadowRoot!.querySelector('.linear-progress-stop-indicator'),
    ).not.toBeNull();
  });

  it('hides buffer dots when there is no buffer', async () => {
    const {element} = await setupTest(
      html`<md-gb-linear-progress .value=${0.5}></md-gb-linear-progress>`,
    );
    expect(
      element
        .shadowRoot!.querySelector('.linear-progress-dots')!
        .hasAttribute('hidden'),
    ).toBeTrue();
  });

  it('shows dots and an inactive track when the buffer is set', async () => {
    const {element} = await setupTest(
      html`<md-gb-linear-progress
        .value=${0.3}
        .buffer=${0.6}></md-gb-linear-progress>`,
    );
    const dots = element.shadowRoot!.querySelector('.linear-progress-dots')!;
    const inactiveTrack = element.shadowRoot!.querySelector(
      '.linear-progress-inactive-track',
    );
    expect(dots.hasAttribute('hidden')).toBeFalse();
    expect(inactiveTrack).not.toBeNull();
  });

  it('renders an inactive track but no dots or stop indicator when indeterminate', async () => {
    const {element} = await setupTest(
      html`<md-gb-linear-progress
        indeterminate
        .value=${0.3}
        .buffer=${0.5}></md-gb-linear-progress>`,
    );
    expect(
      element.shadowRoot!.querySelector('svg path.linear-progress-active'),
    ).not.toBeNull();
    expect(
      element.shadowRoot!.querySelector('.linear-progress-inactive-track'),
    ).not.toBeNull();
    expect(
      element.shadowRoot!.querySelector('.linear-progress-dots'),
    ).toBeNull();
    expect(
      element.shadowRoot!.querySelector('.linear-progress-stop-indicator'),
    ).toBeNull();
  });

  it('hides dots when the buffer reaches max', async () => {
    const {element} = await setupTest(
      html`<md-gb-linear-progress
        .value=${0.3}
        .buffer=${1}
        .max=${1}></md-gb-linear-progress>`,
    );
    expect(
      element
        .shadowRoot!.querySelector('.linear-progress-dots')!
        .hasAttribute('hidden'),
    ).toBeTrue();
  });

  it('hides the dots and stop indicator when the value reaches max', async () => {
    const {element} = await setupTest(
      html`<md-gb-linear-progress
        .value=${1}
        .buffer=${0.6}
        .max=${1}></md-gb-linear-progress>`,
    );
    expect(
      element
        .shadowRoot!.querySelector('.linear-progress-dots')!
        .hasAttribute('hidden'),
    ).toBeTrue();
    expect(
      element
        .shadowRoot!.querySelector('.linear-progress-stop-indicator')!
        .hasAttribute('hidden'),
    ).toBeTrue();
  });

  it('draws a smooth active by default and a wavy active when wavy', async () => {
    const {element: standard} = await setupTest(
      html`<md-gb-linear-progress
        style="width: 200px"
        .value=${0.5}></md-gb-linear-progress>`,
    );
    const {element: wavy} = await setupTest(
      html`<md-gb-linear-progress
        style="width: 200px"
        .value=${0.5}
        wavy></md-gb-linear-progress>`,
    );
    const standardPath = standard
      .shadowRoot!.querySelector('svg path.linear-progress-active')!
      .getAttribute('d')!;
    const wavyPath = wavy
      .shadowRoot!.querySelector('svg path.linear-progress-active')!
      .getAttribute('d')!;
    expect(standardPath.length).toBeGreaterThan(0);
    expect(wavyPath.length).toBeGreaterThan(0);
    expect(standardPath).not.toEqual(wavyPath);
  });

  describe('linearWavePath', () => {
    const straight = 'M0,8 L100,8';

    it('returns a straight line when not wavy', () => {
      expect(
        linearWavePath({
          width: 100,
          height: 16,
          amplitude: 3,
          wavelength: 40,
          wavy: false,
        }),
      ).toBe(straight);
    });

    it('returns a straight line when amplitude is not positive', () => {
      expect(
        linearWavePath({
          width: 100,
          height: 16,
          amplitude: 0,
          wavelength: 40,
          wavy: true,
        }),
      ).toBe(straight);
    });

    it('returns a straight line when wavelength is not positive', () => {
      expect(
        linearWavePath({
          width: 100,
          height: 16,
          amplitude: 3,
          wavelength: 0,
          wavy: true,
        }),
      ).toBe(straight);
    });

    it('returns a zero-length line when width is not positive', () => {
      expect(
        linearWavePath({
          width: 0,
          height: 16,
          amplitude: 3,
          wavelength: 40,
          wavy: true,
        }),
      ).toBe('M0,8 L0,8');
    });

    it('renders a wave that differs from a straight line', () => {
      const wavy = linearWavePath({
        width: 100,
        height: 16,
        amplitude: 3,
        wavelength: 40,
        wavy: true,
      });
      expect(wavy.startsWith('M')).toBeTrue();
      expect(wavy).not.toEqual(straight);
    });
  });
});
