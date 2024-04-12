/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {ChipHarness} from '../harness.js';

import {Chip} from './chip.js';

@customElement('test-chip')
class TestChip extends Chip {
  primaryId = 'button';

  override renderPrimaryAction() {
    return html`<button id=${this.primaryId}>Chip</button>`;
  }
}

describe('Chip', () => {
  const env = new Environment();

  async function setupTest() {
    const chip = new TestChip();
    env.render(html`${chip}`);
    await env.waitForStability();
    return {chip, harness: new ChipHarness(chip)};
  }

  it('should dispatch `update-focus` for chip set when disabled changes', async () => {
    const {chip} = await setupTest();
    const updateFocusListener = jasmine.createSpy('updateFocusListener');
    chip.addEventListener('update-focus', updateFocusListener);

    chip.disabled = true;
    await env.waitForStability();
    expect(updateFocusListener).toHaveBeenCalled();
  });
});
