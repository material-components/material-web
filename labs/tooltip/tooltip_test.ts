/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html} from 'lit';

import {Environment} from '../../testing/environment.js';

import {TooltipHarness} from './harness.js';
import {MdTooltip} from './tooltip.js';

import './tooltip.js';

describe('<md-tooltip>', () => {
  const env = new Environment();

  async function setup(text = 'Helpful text') {
    const element = env
      .render(html`
        <md-tooltip text=${text}>
          <button type="button">Action</button>
        </md-tooltip>
      `)
      .querySelector('md-tooltip') as MdTooltip;
    await env.waitForStability();
    return {element, harness: new TooltipHarness(element)};
  }

  it('renders a tooltip that is hidden by default', async () => {
    const {element, harness} = await setup();

    expect(element.open).toBeFalse();
    expect(harness.popup.getAttribute('role')).toBe('tooltip');
    expect(harness.popup.hidden).toBeTrue();
  });

  it('describes the slotted trigger', async () => {
    const {element} = await setup();
    const trigger = element.querySelector('button')!;

    expect(trigger.getAttribute('aria-describedby')).toContain('md-tooltip-');
  });

  it('shows and hides on focus', async () => {
    const {element, harness} = await setup();
    const trigger = element.querySelector('button')!;

    trigger.focus();
    await env.waitForStability();
    expect(element.open).toBeTrue();

    trigger.blur();
    await env.waitForStability();
    expect(element.open).toBeFalse();
    expect(harness.popup.hidden).toBeTrue();
  });

  it('can be controlled imperatively', async () => {
    const {harness} = await setup();

    await harness.show();
    expect(harness.popup.hidden).toBeFalse();
    await harness.hide();
    expect(harness.popup.hidden).toBeTrue();
  });

  it('hides on Escape without moving focus', async () => {
    const {element} = await setup();
    const trigger = element.querySelector('button')!;
    trigger.focus();
    await env.waitForStability();

    trigger.dispatchEvent(
      new KeyboardEvent('keydown', {bubbles: true, key: 'Escape'}),
    );
    await env.waitForStability();

    expect(element.open).toBeFalse();
    expect(document.activeElement).toBe(trigger);
  });

  it('does not show without tooltip content', async () => {
    const {element} = await setup('');
    const trigger = element.querySelector('button')!;

    trigger.focus();
    await env.waitForStability();

    expect(element.open).toBeFalse();
  });
});
