/**
 * @license
 * Copyright 2024 Google LLC
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
    // Arrange
    const {button} = await setupTest();
    button.disabled = true;
    await env.waitForStability();

    // Act
    button.focus();

    // Assert
    expect(document.activeElement)
      .withContext('disabled button should not be focused')
      .not.toBe(button);
  });

  it('should be focusable when soft-disabled', async () => {
    // Arrange
    const {button} = await setupTest();
    button.softDisabled = true;
    await env.waitForStability();

    // Act
    button.focus();

    // Assert
    expect(document.activeElement)
      .withContext('soft-disabled button should be focused')
      .toBe(button);
  });

  it('should not be clickable when disabled', async () => {
    // Arrange
    const clickListener = jasmine.createSpy('clickListener');
    const {button} = await setupTest();
    button.disabled = true;
    button.addEventListener('click', clickListener);
    await env.waitForStability();

    // Act
    button.click();

    // Assert
    expect(clickListener).not.toHaveBeenCalled();
  });

  it('should not be clickable when soft-disabled', async () => {
    // Arrange
    const clickListener = jasmine.createSpy('clickListener');
    const {button} = await setupTest();
    button.softDisabled = true;
    button.addEventListener('click', clickListener);
    await env.waitForStability();

    // Act
    button.click();

    // Assert
    expect(clickListener).not.toHaveBeenCalled();
  });
});
