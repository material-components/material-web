/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-linear-progress.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {LINEAR_PROGRESS_CLASSES} from './linear-progress.js';
import {LinearProgressElement} from './linear-progress-element.js';

describe('md-gb-linear-progress', () => {
  const env = new Environment();

  it('renders default determinate progress element', async () => {
    const root = env.render(
      html`<md-gb-linear-progress></md-gb-linear-progress>`,
    );
    await env.waitForStability();
    const el = root.querySelector('md-gb-linear-progress');
    expect(el).toBeInstanceOf(LinearProgressElement);

    const container = el!.shadowRoot!.querySelector('.linear-progress');
    expect(container).not.toBeNull();
    expect(container!.getAttribute('role')).toBe('progressbar');
    expect(
      container!.classList.contains(LINEAR_PROGRESS_CLASSES.determinate),
    ).toBeTrue();
  });

  it('renders indeterminate mode with appropriate classes', async () => {
    const root = env.render(
      html`<md-gb-linear-progress indeterminate></md-gb-linear-progress>`,
    );
    await env.waitForStability();
    const el = root.querySelector('md-gb-linear-progress')!;
    const container = el.shadowRoot!.querySelector('.linear-progress')!;

    expect(
      container.classList.contains(LINEAR_PROGRESS_CLASSES.indeterminate),
    ).toBeTrue();
    expect(container.getAttribute('aria-valuenow')).toBeNull();
  });

  it('supports wavy and thick styles', async () => {
    const root = env.render(
      html`<md-gb-linear-progress wavy thick></md-gb-linear-progress>`,
    );
    await env.waitForStability();
    const el = root.querySelector('md-gb-linear-progress')!;
    const container = el.shadowRoot!.querySelector('.linear-progress')!;

    expect(
      container.classList.contains(LINEAR_PROGRESS_CLASSES.wavy),
    ).toBeTrue();
    expect(
      container.classList.contains(LINEAR_PROGRESS_CLASSES.thick),
    ).toBeTrue();
  });
});
