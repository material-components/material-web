/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-circular-progress.js';

import {html} from 'lit';

import {Environment} from '../../../../testing/environment.js';

import {circularWavePath} from './circular-progress.js';
import {CircularProgressElement} from './circular-progress-element.js';

describe('<md-gb-circular-progress>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-gb-circular-progress></md-gb-circular-progress>`,
  ) {
    const root = env.render(template);
    const element = root.querySelector('md-gb-circular-progress');
    if (!(element instanceof CircularProgressElement)) {
      throw new Error('Could not find CircularProgressElement');
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

  it('renders the circular-progress root class', async () => {
    const {progressbar} = await setupTest();
    expect(progressbar.classList.contains('circular-progress')).toBeTrue();
  });

  it('reflects value and max to ARIA', async () => {
    const {progressbar} = await setupTest(
      html`<md-gb-circular-progress
        .value=${0.5}
        .max=${2}></md-gb-circular-progress>`,
    );
    expect(progressbar.getAttribute('aria-valuemax')).toBe('2');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('0.5');
  });

  it('removes aria-valuenow when indeterminate', async () => {
    const {progressbar} = await setupTest(
      html`<md-gb-circular-progress indeterminate></md-gb-circular-progress>`,
    );
    expect(progressbar.hasAttribute('aria-valuenow')).toBeFalse();
  });

  it('delegates host aria-label to the progressbar', async () => {
    const {progressbar} = await setupTest(
      html`<md-gb-circular-progress
        aria-label="Loading"></md-gb-circular-progress>`,
    );
    expect(progressbar.getAttribute('aria-label')).toBe('Loading');
  });

  it('reveals the active path via stroke-dashoffset when determinate', async () => {
    const {element} = await setupTest(
      html`<md-gb-circular-progress
        .value=${0.25}
        .max=${1}></md-gb-circular-progress>`,
    );
    const active = element.shadowRoot!.querySelector(
      'svg path.circular-progress-active',
    );
    const track = element.shadowRoot!.querySelector(
      'svg path.circular-progress-track',
    );
    expect(active).not.toBeNull();
    expect(track).not.toBeNull();
    // (1 - 0.25 / 1) * 100 = 75
    expect(active!.getAttribute('stroke-dashoffset')).toBe('75');
  });

  it('renders both the track and active paths when indeterminate', async () => {
    const {element} = await setupTest(
      html`<md-gb-circular-progress indeterminate></md-gb-circular-progress>`,
    );
    expect(
      element.shadowRoot!.querySelector('svg path.circular-progress-active'),
    ).not.toBeNull();
    expect(
      element.shadowRoot!.querySelector('svg path.circular-progress-track'),
    ).not.toBeNull();
  });

  it('draws a smooth active by default and a wavy active when wavy', async () => {
    const {element: standard} = await setupTest(
      html`<md-gb-circular-progress .value=${0.5}></md-gb-circular-progress>`,
    );
    const {element: wavy} = await setupTest(
      html`<md-gb-circular-progress
        .value=${0.5}
        wavy></md-gb-circular-progress>`,
    );
    const standardPath = standard
      .shadowRoot!.querySelector('svg path.circular-progress-active')!
      .getAttribute('d')!;
    const wavyPath = wavy
      .shadowRoot!.querySelector('svg path.circular-progress-active')!
      .getAttribute('d')!;
    expect(standardPath.length).toBeGreaterThan(0);
    expect(wavyPath.length).toBeGreaterThan(0);
    expect(standardPath).not.toEqual(wavyPath);
  });

  describe('circularWavePath', () => {
    const base = {size: 48, strokeWidth: 6, wavelength: 15};

    it('returns a closed path that starts with a move command', () => {
      const path = circularWavePath({...base, amplitude: 1.6, wavy: true});
      expect(path.startsWith('M')).toBeTrue();
      expect(path.endsWith('Z')).toBeTrue();
    });

    it('returns an empty string when the radius is not positive', () => {
      expect(
        circularWavePath({
          size: 4,
          strokeWidth: 20,
          amplitude: 0,
          wavelength: 15,
        }),
      ).toBe('');
    });

    it('renders a wave only when wavy, amplitude and wavelength are positive', () => {
      const wavy = circularWavePath({...base, amplitude: 1.6, wavy: true});
      const flatByAmplitude = circularWavePath({
        ...base,
        amplitude: 0,
        wavy: true,
      });
      const flatByWavy = circularWavePath({
        ...base,
        amplitude: 1.6,
        wavy: false,
      });
      const flatByWavelength = circularWavePath({
        ...base,
        amplitude: 1.6,
        wavelength: 0,
        wavy: true,
      });

      expect(wavy).not.toEqual(flatByAmplitude);
      expect(wavy).not.toEqual(flatByWavy);
      expect(wavy).not.toEqual(flatByWavelength);
      // Zeroing the wavelength or disabling wavy both flatten to the same ring
      // (radius still reserves the amplitude).
      expect(flatByWavelength).toEqual(flatByWavy);
    });
  });
});
