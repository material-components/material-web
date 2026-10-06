/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-aria-accordion.js';

import {html} from 'lit';
import {Environment} from '../../../testing/environment.js';

import {AriaAccordionElement} from './accordion.js';

describe('md-aria-accordion', () => {
  const env = new Environment();

  async function setUpTest(
    template = html` <md-aria-accordion></md-aria-accordion> `,
  ) {
    const root = env.render(template);
    await env.waitForStability();

    const accordion = root.querySelector(
      'md-aria-accordion',
    ) as AriaAccordionElement;
    return {root, accordion};
  }

  it('accordion', async () => {
    const {accordion} = await setUpTest();

    expect(accordion).toBeInstanceOf(AriaAccordionElement);
  });
});
