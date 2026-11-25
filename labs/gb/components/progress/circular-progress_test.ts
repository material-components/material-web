/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-circular-progress.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {CIRCULAR_PROGRESS_CLASSES} from './circular-progress.js';
import {CircularProgressElement} from './circular-progress-element.js';

describe('md-gb-circular-progress', () => {
  const env = new Environment();

  it('renders default determinate progress element', async () => {
    const root = env.render(
      html`<md-gb-circular-progress></md-gb-circular-progress>`,
    );
    await env.waitForStability();
    const el = root.querySelector('md-gb-circular-progress');
    expect(el).toBeInstanceOf(CircularProgressElement);

    const container = el!.shadowRoot!.querySelector('.circular-progress');
    expect(container).not.toBeNull();
    expect(container!.getAttribute('role')).toBe('progressbar');
    expect(
      container!.classList.contains(CIRCULAR_PROGRESS_CLASSES.determinate),
    ).toBeTrue();
  });

  it('renders indeterminate mode with appropriate classes', async () => {
    const root = env.render(
      html`<md-gb-circular-progress indeterminate></md-gb-circular-progress>`,
    );
    await env.waitForStability();
    const el = root.querySelector('md-gb-circular-progress')!;
    const container = el.shadowRoot!.querySelector('.circular-progress')!;

    expect(
      container.classList.contains(CIRCULAR_PROGRESS_CLASSES.indeterminate),
    ).toBeTrue();
    expect(container.getAttribute('aria-valuenow')).toBeNull();
  });

  it('supports wavy and thick styles', async () => {
    const root = env.render(
      html`<md-gb-circular-progress wavy thick></md-gb-circular-progress>`,
    );
    await env.waitForStability();
    const el = root.querySelector('md-gb-circular-progress')!;
    const container = el.shadowRoot!.querySelector('.circular-progress')!;

    expect(
      container.classList.contains(CIRCULAR_PROGRESS_CLASSES.wavy),
    ).toBeTrue();
    expect(
      container.classList.contains(CIRCULAR_PROGRESS_CLASSES.thick),
    ).toBeTrue();
  });
});
