/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {IconButtonHarness} from '../harness.js';

import {IconButton} from './icon-button.js';

@customElement('test-icon-button')
class TestIconButton extends IconButton {}

describe('IconButton', () => {
  const env = new Environment();

  async function setupTest() {
    const iconButton = new TestIconButton();
    env.render(html`${iconButton}`);
    await env.waitForStability();
    return {iconButton, harness: new IconButtonHarness(iconButton)};
  }

  it('should not be focusable when disabled', async () => {
    const {iconButton} = await setupTest();
    iconButton.disabled = true;
    await env.waitForStability();

    iconButton.focus();
    expect(document.activeElement).toEqual(document.body);
  });

  it('should be focusable when disabled and alwaysFocusable', async () => {
    const {iconButton} = await setupTest();
    iconButton.disabled = true;
    iconButton.alwaysFocusable = true;
    await env.waitForStability();

    iconButton.focus();
    expect(document.activeElement).toEqual(iconButton);
  });

  it('should not be clickable when disabled', async () => {
    const clickListener = jasmine.createSpy('clickListener');
    const {iconButton} = await setupTest();
    iconButton.disabled = true;
    iconButton.addEventListener('click', clickListener);
    await env.waitForStability();

    iconButton.click();
    expect(clickListener).not.toHaveBeenCalled();
  });

  it('should not be clickable when disabled and alwaysFocusable', async () => {
    const clickListener = jasmine.createSpy('clickListener');
    const {iconButton} = await setupTest();
    iconButton.disabled = true;
    iconButton.alwaysFocusable = true;
    iconButton.addEventListener('click', clickListener);
    await env.waitForStability();

    iconButton.click();
    expect(clickListener).not.toHaveBeenCalled();
  });
});
