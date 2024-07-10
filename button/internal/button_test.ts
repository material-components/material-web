/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {ButtonHarness} from '../harness.js';

import {Button} from './button.js';

@customElement('test-button')
class TestButton extends Button {}

describe('Button', () => {
  const env = new Environment();

  async function setupTest() {
    const button = new TestButton();
    env.render(html`${button}`);
    await env.waitForStability();
    return {button, harness: new ButtonHarness(button)};
  }

  it('should not be focusable when disabled', async () => {
    const {button} = await setupTest();
    button.disabled = true;
    await env.waitForStability();

    button.focus();
    expect(document.activeElement).toEqual(document.body);
  });

  it('should be focusable when disabled and alwaysFocusable', async () => {
    const {button} = await setupTest();
    button.disabled = true;
    button.alwaysFocusable = true;
    await env.waitForStability();

    button.focus();
    expect(document.activeElement).toEqual(button);
  });

  it('should not be clickable when disabled', async () => {
    const clickListener = jasmine.createSpy('clickListener');
    const {button} = await setupTest();
    button.disabled = true;
    button.addEventListener('click', clickListener);
    await env.waitForStability();

    button.click();
    expect(clickListener).not.toHaveBeenCalled();
  });

  it('should not be clickable when disabled and alwaysFocusable', async () => {
    const clickListener = jasmine.createSpy('clickListener');
    const {button} = await setupTest();
    button.disabled = true;
    button.alwaysFocusable = true;
    button.addEventListener('click', clickListener);
    await env.waitForStability();

    button.click();
    expect(clickListener).not.toHaveBeenCalled();
  });
});
