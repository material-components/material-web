/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {Environment} from '../../testing/environment.js';

import {AssistChip} from './assist-chip.js';

customElements.define('test-assist-chip', AssistChip);

describe('Assist chip', () => {
  const env = new Environment();

  async function setupTest() {
    const chip = new AssistChip();
    env.render(html`${chip}`);
    await env.waitForStability();
    return chip;
  }

  describe('links', () => {
    it('should render a link when provided an href', async () => {
      const chip = await setupTest();
      chip.href = 'link';
      await chip.updateComplete;

      expect(chip.renderRoot.querySelector('a'))
        .withContext('should have a rendered <a> link')
        .toBeTruthy();
    });

    it('should not allow link chips to be disabled', async () => {
      const chip = await setupTest();
      chip.href = 'link';
      chip.disabled = true;
      await chip.updateComplete;

      expect(chip.renderRoot.querySelector('.disabled,:disabled'))
        .withContext('should not have any disabled styling or behavior')
        .toBeNull();
    });
  });
});
