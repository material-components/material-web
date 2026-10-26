/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-aria-slider.js';

import {TemplateResult, html} from 'lit';
import {Environment} from '../../../testing/environment.js';
import {hasState} from '../../behaviors/custom-state-set.js';
import {internals} from '../../behaviors/element-internals.js';
import {AriaSliderElement} from './slider.js';

describe('md-aria-slider', () => {
  const env = new Environment();

  async function setupTest(
    template: TemplateResult = html`<md-aria-slider>
      <input type="range" min="0" max="100" value="50" />
    </md-aria-slider>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const slider = root.querySelector('md-aria-slider') as AriaSliderElement;
    const startInput = root.querySelector(
      'input[slot="start"]',
    ) as HTMLInputElement | null;
    const endInput = root.querySelector(
      'input:not([slot="start"])',
    ) as HTMLInputElement | null;
    return {root, slider, startInput, endInput};
  }

  async function interact(input: HTMLInputElement, value: number) {
    input.focus();
    input.dispatchEvent(
      new PointerEvent('pointerdown', {bubbles: true, composed: true}),
    );
    input.value = String(value);
    input.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    input.dispatchEvent(
      new PointerEvent('pointerup', {bubbles: true, composed: true}),
    );
    input.dispatchEvent(new Event('change', {bubbles: true}));
    await env.waitForStability();
  }

  describe('registration and host semantics', () => {
    it('defines the md-aria-slider custom element', () => {
      expect(customElements.get('md-aria-slider')).toBeDefined();
    });

    it('sets no host internals role (role is null)', async () => {
      const {slider} = await setupTest();
      expect(slider[internals].role).toBeNull();
    });

    it('renders a start slot before the default slot', async () => {
      const {slider} = await setupTest();
      const slots = Array.from(slider.renderRoot.querySelectorAll('slot'));
      expect(slots.map((s) => s.name)).toEqual(['start', '']);
    });
  });

  describe('input resolution and fractions (single thumb)', () => {
    it('publishes --md-aria-slider-end-fraction from the slotted input', async () => {
      const {slider} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="25" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.25');
    });

    it('publishes --md-aria-slider-start-fraction as 0 when not range', async () => {
      const {slider} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="25" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-start-fraction'),
      ).toBe('0');
    });

    it('is inert when no range input is slotted', async () => {
      const {slider} = await setupTest(html`<md-aria-slider></md-aria-slider>`);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('');
      expect(
        slider.style.getPropertyValue('--md-aria-slider-start-fraction'),
      ).toBe('');
    });

    it('ignores slotted inputs that are not type=range', async () => {
      const {slider} = await setupTest(html`
        <md-aria-slider>
          <input type="text" value="25" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('');
    });

    it('recomputes fractions when the slotted input dispatches input', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="25" />
        </md-aria-slider>
      `);
      endInput!.value = '75';
      endInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.75');
    });

    it('resolves an input added after first render (slotchange)', async () => {
      const {slider} = await setupTest(html`<md-aria-slider></md-aria-slider>`);
      const input = document.createElement('input');
      input.type = 'range';
      input.min = '0';
      input.max = '100';
      input.value = '40';
      slider.appendChild(input);
      await env.waitForStability();
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.4');
    });
  });

  describe('range mode and focus', () => {
    it('reflects the range property to the range attribute', async () => {
      const {slider} = await setupTest();
      expect(slider.hasAttribute('range')).toBeFalse();
      slider.range = true;
      await env.waitForStability();
      expect(slider.hasAttribute('range')).toBeTrue();
      slider.range = false;
      await env.waitForStability();
      expect(slider.hasAttribute('range')).toBeFalse();
    });

    it('resolves slot=start as the start thumb and the default slot as the end thumb', async () => {
      const {slider} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-start-fraction'),
      ).toBe('0.2');
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.8');
    });

    it('publishes both fractions in range mode', async () => {
      const {slider} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="10" max="50" value="30" />
          <input type="range" min="10" max="50" value="40" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-start-fraction'),
      ).toBe('0.5');
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.75');
    });

    it('degrades to single-thumb coordination when range is set but only one input is slotted', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-start-fraction'),
      ).toBe('0');
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.5');
      expect(getComputedStyle(endInput!).clipPath).toBe('none');
    });

    it('ignores slot=start when range is not set', async () => {
      const {slider} = await setupTest(html`
        <md-aria-slider>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-start-fraction'),
      ).toBe('0');
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.8');
    });

    it('does not set a positive tabindex on either input', async () => {
      const {startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      expect(startInput!.tabIndex).toBe(0);
      expect(endInput!.tabIndex).toBe(0);
    });

    it('delegates focus() to the first slotted input', async () => {
      const {slider, startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      slider.focus();
      expect(document.activeElement).toBe(startInput);
    });

    it('skips disabled input when focusing', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input
            type="range"
            slot="start"
            disabled
            min="0"
            max="100"
            value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      slider.focus();
      expect(document.activeElement).toBe(endInput);
    });
  });

  describe('range-mode stylesheet', () => {
    it('stacks and clips the two inputs to opposite sides of the midpoint in range mode', async () => {
      const {startInput, endInput} = await setupTest(html`
        <md-aria-slider
          range
          style="display: block; inline-size: 200px; block-size: 30px;">
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      const startStyle = getComputedStyle(startInput!);
      const endStyle = getComputedStyle(endInput!);
      expect(startStyle.position).toBe('absolute');
      expect(endStyle.position).not.toBe('absolute');
      expect(startStyle.clipPath).not.toBe('none');
      expect(endStyle.clipPath).not.toBe('none');
      expect(startStyle.clipPath).not.toEqual(endStyle.clipPath);
    });

    it('applies no positioning to a single slotted input', async () => {
      const {endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="25" />
        </md-aria-slider>
      `);
      const endStyle = getComputedStyle(endInput!);
      expect(endStyle.position).not.toBe('absolute');
      expect(endStyle.clipPath).toBe('none');
    });

    it('unstyled range slider has non-zero dimensions', async () => {
      const {slider} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      const rect = slider.getBoundingClientRect();
      expect(rect.width).toBeGreaterThan(0);
      expect(rect.height).toBeGreaterThan(0);
    });

    it('routes pointer events to the nearer thumb via elementFromPoint', async () => {
      const {slider, startInput, endInput} = await setupTest(html`
        <md-aria-slider
          range
          style="display: block; inline-size: 200px; block-size: 30px;">
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      const rect = slider.getBoundingClientRect();
      const ptLeft = {
        x: rect.left + rect.width * 0.25,
        y: rect.top + rect.height * 0.5,
      };
      const ptRight = {
        x: rect.left + rect.width * 0.75,
        y: rect.top + rect.height * 0.5,
      };
      expect(document.elementFromPoint(ptLeft.x, ptLeft.y)).toBe(startInput);
      expect(document.elementFromPoint(ptRight.x, ptRight.y)).toBe(endInput);

      startInput!.value = '90';
      endInput!.value = '95';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      endInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      const ptNearStart = {
        x: rect.left + rect.width * 0.91,
        y: rect.top + rect.height * 0.5,
      };
      const ptNearEnd = {
        x: rect.left + rect.width * 0.98,
        y: rect.top + rect.height * 0.5,
      };
      expect(document.elementFromPoint(ptNearStart.x, ptNearStart.y)).toBe(
        startInput,
      );
      expect(document.elementFromPoint(ptNearEnd.x, ptNearEnd.y)).toBe(
        endInput,
      );
    });

    it('sets opposite clip-paths in RTL range mode', async () => {
      const {startInput, endInput} = await setupTest(html`
        <md-aria-slider
          range
          dir="rtl"
          style="display: block; inline-size: 200px; block-size: 30px;">
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      const startStyle = getComputedStyle(startInput!);
      const endStyle = getComputedStyle(endInput!);
      expect(startStyle.clipPath).not.toBe('none');
      expect(endStyle.clipPath).not.toBe('none');
      expect(startStyle.clipPath).not.toEqual(endStyle.clipPath);
    });
  });

  describe('clamping', () => {
    it('clamps the start thumb so it cannot move past the end thumb', async () => {
      const {startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      await interact(startInput!, 90);
      expect(startInput!.valueAsNumber).toBe(80);
    });

    it('clamps the end thumb so it cannot move below the start thumb', async () => {
      const {endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      await interact(endInput!, 10);
      expect(endInput!.valueAsNumber).toBe(20);
    });

    it('suppresses the input event when the interaction was fully clamped', async () => {
      const {slider, startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      startInput!.value = '50';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      const inputSpy = jasmine.createSpy('input');
      slider.addEventListener('input', inputSpy);
      startInput!.value = '60';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(startInput!.valueAsNumber).toBe(50);
      expect(inputSpy).not.toHaveBeenCalled();
    });

    it('dispatches input when a clamp produces a net value change', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      const inputSpy = jasmine.createSpy('input');
      slider.addEventListener('input', inputSpy);

      endInput!.focus();
      endInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      endInput!.value = '10';
      endInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(endInput!.valueAsNumber).toBe(20);
      expect(inputSpy).toHaveBeenCalledTimes(1);
    });

    it('does not clamp in single-thumb mode', async () => {
      const {endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      await interact(endInput!, 90);
      expect(endInput!.valueAsNumber).toBe(90);
    });

    it('enforces start <= end even when step is mismatched', async () => {
      const {startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input
            type="range"
            slot="start"
            min="0"
            max="100"
            step="10"
            value="0" />
          <input type="range" min="0" max="100" step="3" value="9" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      startInput!.value = '20';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(startInput!.valueAsNumber).toBeLessThanOrEqual(
        endInput!.valueAsNumber,
      );
    });

    it('enforces start <= end even when min/max are mismatched', async () => {
      const {startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="10" max="60" value="20" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      startInput!.value = '60';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(startInput!.valueAsNumber).toBeLessThanOrEqual(
        endInput!.valueAsNumber,
      );
    });
  });

  describe('flipping and event plumbing', () => {
    it('flips the action to the other thumb when coincident thumbs are dragged across', async () => {
      const {startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="50" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      startInput!.value = '70';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(startInput!.valueAsNumber).toBe(50);
      expect(endInput!.valueAsNumber).toBe(70);
    });

    it('handles dragging across and back in one action without corrupting thumbs', async () => {
      const {startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="50" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      // Step 1: drag across to 70 -> flips, moving endInput to 70
      startInput!.value = '70';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(startInput!.valueAsNumber).toBe(50);
      expect(endInput!.valueAsNumber).toBe(70);
      expect(startInput!.valueAsNumber).toBeLessThanOrEqual(
        endInput!.valueAsNumber,
      );

      // Step 2: without releasing pointer, drag back to 30
      startInput!.value = '30';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(startInput!.valueAsNumber).toBe(50);
      expect(endInput!.valueAsNumber).toBe(50);
      expect(startInput!.valueAsNumber).toBeLessThanOrEqual(
        endInput!.valueAsNumber,
      );
    });

    it('does not flip for keyboard interactions (canFlip is pointerdown-only)', async () => {
      const {startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="50" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      startInput!.value = '70';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(startInput!.valueAsNumber).toBe(50);
      expect(endInput!.valueAsNumber).toBe(50);
    });

    it('re-dispatches input from the flipped input exactly once', async () => {
      const {slider, startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="50" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      let inputTarget: EventTarget | null = null;
      let count = 0;
      slider.addEventListener('input', (e) => {
        count++;
        inputTarget = e.target;
      });

      startInput!.focus();
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      startInput!.value = '70';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(count).toBe(1);
      expect(inputTarget as unknown).toBe(endInput);
    });

    it('fires change from the flipped input after pointerup', async () => {
      const {slider, startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="50" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      let changeTarget: EventTarget | null = null;
      slider.addEventListener('change', (e) => {
        changeTarget = e.target;
      });

      startInput!.focus();
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      startInput!.value = '70';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      startInput!.dispatchEvent(
        new PointerEvent('pointerup', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(changeTarget as unknown).toBe(endInput);
    });

    it('squelches change when a keyboard interaction clamped to no net change', async () => {
      const {slider, startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="50" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      const changeSpy = jasmine.createSpy('change');
      slider.addEventListener('change', changeSpy);

      startInput!.focus();
      startInput!.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      startInput!.value = '60';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      startInput!.dispatchEvent(new Event('change', {bubbles: true}));
      await env.waitForStability();

      expect(changeSpy).not.toHaveBeenCalled();
    });

    it('clears the action on keyup', async () => {
      const {slider, startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeTrue();

      startInput!.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'ArrowRight',
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeFalse();
    });
  });

  describe('announced bounds (APG multi-thumb)', () => {
    it('sets aria-valuemax on the start input to the end thumb value', async () => {
      const {startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      expect(startInput!.ariaValueMax).toBe('80');
    });

    it('sets aria-valuemin on the end input to the start thumb value', async () => {
      const {endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      expect(endInput!.ariaValueMin).toBe('20');
    });

    it('updates the announced bounds after an interaction', async () => {
      const {startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      await interact(startInput!, 40);
      expect(endInput!.ariaValueMin).toBe('40');
    });

    it('sets no aria bounds in single-thumb mode', async () => {
      const {endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      expect(endInput!.ariaValueMin).toBeNull();
      expect(endInput!.ariaValueMax).toBeNull();
    });

    it('preserves consumer-authored aria-valuemin on single-thumb input', async () => {
      const root = env.render(html`
        <md-aria-slider>
          <input type="range" aria-valuemin="10" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      await env.waitForStability();
      const input = root.querySelector('input') as HTMLInputElement;
      expect(input.getAttribute('aria-valuemin')).toBe('10');
    });
  });

  describe('dragging custom state', () => {
    it('matches :state(dragging) between pointerdown and pointerup', async () => {
      const {slider, startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(slider.matches(':state(dragging)')).toBeTrue();
      expect(slider[hasState]('dragging')).toBeTrue();

      startInput!.dispatchEvent(
        new PointerEvent('pointerup', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(slider.matches(':state(dragging)')).toBeFalse();
      expect(slider[hasState]('dragging')).toBeFalse();
    });

    it('matches :state(dragging) through keyboard input and change events until keyup', async () => {
      const {slider, startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeTrue();

      startInput!.value = '21';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      startInput!.dispatchEvent(new Event('change', {bubbles: true}));
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeTrue();

      startInput!.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'ArrowRight',
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeFalse();
    });

    it('does not enter :state(dragging) when pointerdown is default-prevented', async () => {
      const {slider, startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      startInput!.addEventListener('pointerdown', (e) => {
        e.preventDefault();
      });
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeFalse();
    });

    it('does not enter :state(dragging) when keydown is default-prevented', async () => {
      const {slider, startInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="20" />
          <input type="range" min="0" max="100" value="80" />
        </md-aria-slider>
      `);
      startInput!.addEventListener('keydown', (e) => {
        e.preventDefault();
      });
      startInput!.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          composed: true,
          cancelable: true,
        }),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeFalse();
    });

    it('enters :state(dragging) in single-thumb mode', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      endInput!.focus();
      endInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeTrue();

      endInput!.dispatchEvent(
        new PointerEvent('pointerup', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeFalse();
    });

    it('clears dragging state and resets action on pointercancel', async () => {
      const {slider, startInput, endInput} = await setupTest(html`
        <md-aria-slider range>
          <input type="range" slot="start" min="0" max="100" value="50" />
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      startInput!.focus();
      startInput!.dispatchEvent(
        new PointerEvent('pointerdown', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeTrue();

      startInput!.dispatchEvent(
        new PointerEvent('pointercancel', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(slider[hasState]('dragging')).toBeFalse();

      startInput!.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'ArrowRight',
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      startInput!.value = '60';
      startInput!.dispatchEvent(
        new Event('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();
      expect(startInput!.valueAsNumber).toBe(50);
      expect(endInput!.valueAsNumber).toBe(50);
    });
  });

  describe('native form participation (zero-mock, asserts negative)', () => {
    it('submits the slotted input under its own name via a real form', async () => {
      const root = env.render(html`
        <form>
          <md-aria-slider>
            <input type="range" name="volume" min="0" max="100" value="42" />
          </md-aria-slider>
        </form>
      `);
      await env.waitForStability();
      const form = root.querySelector('form') as HTMLFormElement;
      const data = new FormData(form);
      expect(data.get('volume')).toBe('42');
    });

    it('submits both slotted inputs in range mode', async () => {
      const root = env.render(html`
        <form>
          <md-aria-slider range>
            <input
              type="range"
              slot="start"
              name="min_price"
              min="0"
              max="100"
              value="15" />
            <input type="range" name="max_price" min="0" max="100" value="75" />
          </md-aria-slider>
        </form>
      `);
      await env.waitForStability();
      const form = root.querySelector('form') as HTMLFormElement;
      const data = new FormData(form);
      expect(data.get('min_price')).toBe('15');
      expect(data.get('max_price')).toBe('75');
    });

    it('contributes no form entry of its own', async () => {
      const root = env.render(html`
        <form>
          <md-aria-slider name="slider">
            <input type="range" name="volume" min="0" max="100" value="42" />
          </md-aria-slider>
        </form>
      `);
      await env.waitForStability();
      const form = root.querySelector('form') as HTMLFormElement;
      const data = new FormData(form);
      expect(Array.from(data.keys())).toEqual(['volume']);
      expect(data.get('slider')).toBeNull();
    });

    it('does not interfere with label activation', async () => {
      const root = env.render(html`
        <label for="vol" id="lbl">Volume</label>
        <md-aria-slider>
          <input type="range" id="vol" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      await env.waitForStability();
      const label = root.querySelector('#lbl') as HTMLLabelElement;
      const input = root.querySelector('#vol') as HTMLInputElement;
      label.click();
      expect(document.activeElement).toBe(input);
    });
  });

  describe('declarative attribute changes (MutationObserver)', () => {
    it('recomputes fractions when the slotted input max attribute changes', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.5');
      endInput!.setAttribute('max', '200');
      await env.waitForStability();
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.25');
    });

    it('recomputes fractions when the slotted input min attribute changes', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="50" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.5');
      endInput!.setAttribute('min', '50');
      await env.waitForStability();
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0');
    });

    it('recomputes fractions when the slotted input step attribute changes', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" step="10" value="50" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.5');
      endInput!.setAttribute('step', '25');
      await env.waitForStability();
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.5');
    });

    it('recomputes fractions when the value attribute changes before any interaction', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="20" />
        </md-aria-slider>
      `);
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.2');
      endInput!.setAttribute('value', '80');
      await env.waitForStability();
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.8');
    });

    it('stops observing after disconnect', async () => {
      const {slider, endInput} = await setupTest(html`
        <md-aria-slider>
          <input type="range" min="0" max="100" value="20" />
        </md-aria-slider>
      `);
      slider.remove();
      await env.waitForStability();
      endInput!.setAttribute('max', '200');
      await env.waitForStability();
      expect(
        slider.style.getPropertyValue('--md-aria-slider-end-fraction'),
      ).toBe('0.2');
    });
  });
});
