/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../styles/icon/md-gb-icon.js';
import './md-gb-slider.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {
  computeSliderProperties,
  computeStopIntervals,
  formatValueIndicatorLabel,
  HANDLE_CLASSES,
  HANDLE_HALF_WIDTH_PX,
  handleClasses,
  handleNubClasses,
  iconMinActiveTrackPx,
  setupSlider,
  SLIDER_CLASSES,
  SLIDER_GAP_PX,
  sliderClasses,
} from './slider.js';

describe('md-gb-slider', () => {
  const env = new Environment();

  describe('element mode', () => {
    it('renders with default properties and classes', async () => {
      const root = env.render(html`<md-gb-slider></md-gb-slider>`);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;

      expect(el.min).toBe(0);
      expect(el.max).toBe(100);
      expect(el.value).toBe(50);
      expect(el.step).toBe(1);
      expect(el.size).toBe('xs');
      expect(el.orientation).toBe('horizontal');
      expect(el.range).toBeFalse();
      expect(el.centered).toBeFalse();
      expect(el.ticks).toBeFalse();
      expect(el.labeled).toBeFalse();
      expect(el.disabled).toBeFalse();

      const sliderRoot = el.shadowRoot!.querySelector('.slider')!;
      expect(sliderRoot).not.toBeNull();
      expect(sliderRoot.classList.contains('slider')).toBeTrue();
      expect(sliderRoot.classList.contains('slider-ranged')).toBeFalse();
      expect(sliderRoot.classList.contains('slider-centered')).toBeFalse();
      expect(sliderRoot.classList.contains('slider-vertical')).toBeFalse();

      const inputEnd = el.shadowRoot!.querySelector('input.slider-end')!;
      expect(inputEnd).not.toBeNull();
      expect(el.shadowRoot!.querySelector('input.slider-start')).toBeNull();

      const handleEnd = el.shadowRoot!.querySelector(
        '.slider-handle.slider-end',
      )!;
      expect(handleEnd).not.toBeNull();
      expect(
        el.shadowRoot!.querySelector('.slider-handle.slider-start'),
      ).toBeNull();
    });

    it('reflects size, orientation, range, centered, and disabled attributes', async () => {
      const root = env.render(html`
        <md-gb-slider
          size="lg"
          orientation="vertical"
          range
          centered
          disabled></md-gb-slider>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;

      expect(el.getAttribute('size')).toBe('lg');
      expect(el.getAttribute('orientation')).toBe('vertical');
      expect(el.hasAttribute('range')).toBeTrue();
      expect(el.hasAttribute('centered')).toBeTrue();
      expect(el.hasAttribute('disabled')).toBeTrue();

      const sliderRoot = el.shadowRoot!.querySelector('.slider')!;
      expect(sliderRoot.classList.contains('slider-vertical')).toBeTrue();
      expect(sliderRoot.classList.contains('slider-ranged')).toBeFalse();
      expect(sliderRoot.classList.contains('disabled')).toBeTrue();
      expect(el.shadowRoot!.querySelector('input.slider-start')).toBeNull();
      expect(
        el.shadowRoot!.querySelector('.slider-handle.slider-start'),
      ).toBeNull();

      const inputEnd = el.shadowRoot!.querySelector('input.slider-end')!;
      expect(inputEnd.getAttribute('orient')).toBe('vertical');
      expect((inputEnd as HTMLInputElement).disabled).toBeTrue();
    });

    it('falls back to valueEnd when vertical orientation suppresses range', async () => {
      const root = env.render(html`
        <md-gb-slider
          orientation="vertical"
          range
          min="0"
          max="100"
          value-start="10"
          value-end="80"></md-gb-slider>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;

      expect(inputEnd.valueAsNumber).toBe(80);
      expect(el.value).toBe(80);
    });

    it('does not react to pointer, keyboard, or focus interactions when disabled', async () => {
      const root = env.render(
        html`<md-gb-slider
          disabled
          labeled
          min="0"
          max="100"
          value="50"></md-gb-slider>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;
      const handleEnd = el.shadowRoot!.querySelector(
        '.slider-handle.slider-end',
      )!;

      inputEnd.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          composed: true,
          button: 0,
        }),
      );
      inputEnd.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      inputEnd.dispatchEvent(new FocusEvent('focus', {bubbles: true}));
      await env.waitForStability();

      expect(handleEnd.classList.contains('active')).toBeFalse();
      expect(handleEnd.classList.contains('hover')).toBeFalse();
      expect(handleEnd.classList.contains('focus-visible')).toBeFalse();
    });

    it('updates value and dispatches input and change events on interaction', async () => {
      const root = env.render(
        html`<md-gb-slider min="0" max="100" value="25"></md-gb-slider>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;

      let inputCount = 0;
      let changeCount = 0;
      el.addEventListener('input', () => {
        inputCount++;
      });
      el.addEventListener('change', () => {
        changeCount++;
      });

      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;
      inputEnd.value = '75';
      inputEnd.dispatchEvent(
        new InputEvent('input', {bubbles: true, composed: true}),
      );
      inputEnd.dispatchEvent(new Event('change', {bubbles: true}));
      await env.waitForStability();

      expect(el.value).toBe(75);
      expect(inputCount).toBe(1);
      expect(changeCount).toBe(1);
    });

    it('clamps single value within min and max boundaries', async () => {
      const root = env.render(
        html`<md-gb-slider min="10" max="50" value="0"></md-gb-slider>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;
      expect(inputEnd.valueAsNumber).toBe(10);

      el.value = 60;
      await env.waitForStability();
      expect(inputEnd.valueAsNumber).toBe(50);
    });

    it('renders centered slider track properties and elements', async () => {
      const root = env.render(
        html`<md-gb-slider
          centered
          min="-50"
          max="50"
          value="25"></md-gb-slider>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const sliderRoot = el.shadowRoot!.querySelector<HTMLElement>('.slider')!;

      expect(sliderRoot.classList.contains('slider-centered')).toBeTrue();
      expect(
        el.shadowRoot!.querySelector('.slider-inactive-lead'),
      ).not.toBeNull();
      expect(el.shadowRoot!.querySelector('.slider-active')).not.toBeNull();
      expect(
        el.shadowRoot!.querySelector('.slider-inactive-trail'),
      ).not.toBeNull();

      expect(
        sliderRoot.style.getPropertyValue('--__active-start-fraction'),
      ).toBe('0.5');
      expect(sliderRoot.style.getPropertyValue('--__active-end-fraction')).toBe(
        '0.75',
      );
    });

    it('supports range mode with valueStart and valueEnd', async () => {
      const root = env.render(html`
        <md-gb-slider
          range
          min="0"
          max="100"
          value-start="20"
          value-end="80"></md-gb-slider>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;

      expect(el.valueStart).toBe(20);
      expect(el.valueEnd).toBe(80);

      const inputStart =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-start')!;
      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;
      expect(inputStart).not.toBeNull();
      expect(inputEnd).not.toBeNull();
      expect(inputStart.valueAsNumber).toBe(20);
      expect(inputEnd.valueAsNumber).toBe(80);

      const handleStart = el.shadowRoot!.querySelector(
        '.slider-handle.slider-start',
      )!;
      const handleEnd = el.shadowRoot!.querySelector(
        '.slider-handle.slider-end',
      )!;
      expect(handleStart).not.toBeNull();
      expect(handleEnd).not.toBeNull();
    });

    it('clamps range handles at each other rather than crossing over', async () => {
      const root = env.render(html`
        <md-gb-slider
          range
          min="0"
          max="100"
          value-start="20"
          value-end="40"></md-gb-slider>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;

      const inputStart =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-start')!;
      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;
      const handleStart = el.shadowRoot!.querySelector(
        '.slider-handle.slider-start',
      )!;
      const handleEnd = el.shadowRoot!.querySelector(
        '.slider-handle.slider-end',
      )!;

      inputStart.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          composed: true,
          button: 0,
        }),
      );
      // Simulate blur on the previously focused input when focus moves to inputStart on pointerdown.
      inputEnd.dispatchEvent(new FocusEvent('blur', {bubbles: true}));
      inputStart.value = '60';
      inputStart.dispatchEvent(
        new InputEvent('input', {bubbles: true, composed: true}),
      );
      inputStart.value = '80';
      inputStart.dispatchEvent(
        new InputEvent('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(el.valueStart).toBe(40);
      expect(el.valueEnd).toBe(40);
      expect(inputStart.valueAsNumber).toBe(40);
      expect(inputEnd.valueAsNumber).toBe(40);
      expect(handleStart.classList.contains('active')).toBeTrue();
      expect(handleEnd.classList.contains('active')).toBeFalse();

      inputStart.dispatchEvent(
        new PointerEvent('pointerup', {
          bubbles: true,
          composed: true,
          button: 0,
        }),
      );
      await env.waitForStability();

      el.valueStart = 20;
      el.valueEnd = 40;
      await env.waitForStability();

      inputEnd.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          composed: true,
          button: 0,
        }),
      );
      inputEnd.value = '10';
      inputEnd.dispatchEvent(
        new InputEvent('input', {bubbles: true, composed: true}),
      );
      await env.waitForStability();

      expect(el.valueStart).toBe(20);
      expect(el.valueEnd).toBe(20);
      expect(inputStart.valueAsNumber).toBe(20);
      expect(inputEnd.valueAsNumber).toBe(20);
      expect(handleStart.classList.contains('active')).toBeFalse();
      expect(handleEnd.classList.contains('active')).toBeTrue();
    });

    it('marks coincident range handles with slider-is-coincident class', async () => {
      const root = env.render(html`
        <md-gb-slider
          range
          min="0"
          max="100"
          value-start="50"
          value-end="50"></md-gb-slider>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;

      const handleStart = el.shadowRoot!.querySelector(
        '.slider-handle.slider-start',
      )!;
      const handleEnd = el.shadowRoot!.querySelector(
        '.slider-handle.slider-end',
      )!;

      expect(handleStart.classList.contains('slider-is-coincident')).toBeTrue();
      expect(handleEnd.classList.contains('slider-is-coincident')).toBeTrue();
    });

    it('handles keyboard navigation with arrow keys', async () => {
      const root = env.render(
        html`<md-gb-slider
          min="0"
          max="100"
          value="50"
          step="5"></md-gb-slider>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;

      inputEnd.focus();
      inputEnd.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true}),
      );
      await env.waitForStability();
      inputEnd.dispatchEvent(new KeyboardEvent('keyup', {bubbles: true}));
      await env.waitForStability();

      expect(inputEnd.valueAsNumber).toBeGreaterThanOrEqual(50);
    });

    it('navigates vertical sliders with arrow keys', async () => {
      const root = env.render(html`
        <md-gb-slider
          orientation="vertical"
          min="0"
          max="100"
          value="50"
          step="10"></md-gb-slider>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;

      inputEnd.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true}),
      );
      await env.waitForStability();
      expect(inputEnd.valueAsNumber).toBe(60);
      expect(el.value).toBe(60);

      inputEnd.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}),
      );
      await env.waitForStability();
      expect(inputEnd.valueAsNumber).toBe(50);
      expect(el.value).toBe(50);
    });

    it('ignores Tab keydown and does not latch active state', async () => {
      const root = env.render(
        html`<md-gb-slider
          min="0"
          max="100"
          value="50"
          labeled></md-gb-slider>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;

      inputEnd.focus();
      inputEnd.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Tab', bubbles: true}),
      );
      await env.waitForStability();

      const handleEnd = el.shadowRoot!.querySelector(
        '.slider-handle.slider-end',
      )!;
      expect(handleEnd.classList.contains('active')).toBeFalse();
    });

    it('hides value indicator label immediately on blur', async () => {
      const root = env.render(
        html`<md-gb-slider
          min="0"
          max="100"
          value="50"
          labeled></md-gb-slider>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const inputEnd =
        el.shadowRoot!.querySelector<HTMLInputElement>('input.slider-end')!;

      inputEnd.focus();
      inputEnd.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}),
      );
      await env.waitForStability();

      const label = el.shadowRoot!.querySelector<HTMLElement>('.slider-label')!;
      expect(label).not.toBeNull();

      inputEnd.dispatchEvent(new FocusEvent('blur', {bubbles: true}));
      await env.waitForStability();

      expect(getComputedStyle(label).opacity).toBe('0');
    });

    it('attaches focus-ring classes to slider-handle-nub', async () => {
      const root = env.render(
        html`<md-gb-slider min="0" max="100" value="50"></md-gb-slider>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const nub = el.shadowRoot!.querySelector('.slider-handle-nub')!;

      expect(nub.classList.contains('slider-handle-nub')).toBeTrue();
      expect(nub.classList.contains('focus-ring-outer')).toBeTrue();
    });

    it('displays formatted and custom value indicator labels', async () => {
      const root = env.render(html`
        <md-gb-slider
          labeled
          min="0"
          max="100"
          value="45.678"
          value-label="Custom 45"></md-gb-slider>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const labelContent = el.shadowRoot!.querySelector(
        '.slider-label-content',
      )!;

      expect(labelContent.textContent?.trim()).toBe('Custom 45');
    });

    it('renders slotted md-gb-icon with size-specific dimensions on md, lg, and xl horizontal sliders', async () => {
      for (const size of ['md', 'lg', 'xl'] as const) {
        const root = env.render(html`
          <md-gb-slider min="0" max="100" value="30" .size=${size}>
            <md-gb-icon slot="icon">volume_up</md-gb-icon>
          </md-gb-slider>
        `);
        await env.waitForStability();
        const el = root.querySelector('md-gb-slider')!;

        const iconEl =
          el.shadowRoot!.querySelector<HTMLElement>('.slider-icon')!;
        expect(iconEl).not.toBeNull();
        const iconSlot = iconEl.querySelector('slot')!;
        expect(iconSlot).not.toBeNull();
        expect(iconSlot.getAttribute('name')).toBe('icon');

        const expectedSize = size === 'xl' ? '32px' : '24px';
        const computed = getComputedStyle(iconEl);
        expect(computed.inlineSize).toBe(expectedSize);
        expect(computed.blockSize).toBe(expectedSize);
        expect(computed.getPropertyValue('--md-icon-size').trim()).toBe(
          expectedSize,
        );
      }
    });

    it('does not render slotted icon on xs, sm, vertical, centered, or range sliders', async () => {
      for (const size of ['xs', 'sm'] as const) {
        const root = env.render(html`
          <md-gb-slider min="0" max="100" value="30" .size=${size}>
            <md-gb-icon slot="icon">volume_up</md-gb-icon>
          </md-gb-slider>
        `);
        await env.waitForStability();
        const el = root.querySelector('md-gb-slider')!;

        expect(el.shadowRoot!.querySelector('.slider-icon')).toBeNull();
      }

      const incompatible = env.render(html`
        <md-gb-slider id="vertical" orientation="vertical" size="md" value="30">
          <md-gb-icon slot="icon">volume_up</md-gb-icon>
        </md-gb-slider>
        <md-gb-slider id="centered" centered size="md" value="0">
          <md-gb-icon slot="icon">volume_up</md-gb-icon>
        </md-gb-slider>
        <md-gb-slider
          id="range"
          range
          size="md"
          value-start="20"
          value-end="80">
          <md-gb-icon slot="icon">volume_up</md-gb-icon>
        </md-gb-slider>
      `);
      await env.waitForStability();
      for (const id of ['#vertical', '#centered', '#range']) {
        const el = incompatible.querySelector<HTMLElement>(id)!;
        expect(el.shadowRoot!.querySelector('.slider-icon')).toBeNull();
      }
    });

    it('keeps the end stop dot square and centered 6px from the track end', async () => {
      const root = env.render(
        html`<md-gb-slider min="0" max="100" value="50"></md-gb-slider>`,
      );
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const track = el
        .shadowRoot!.querySelector<HTMLElement>('.slider-track')!
        .getBoundingClientRect();
      const stop = el
        .shadowRoot!.querySelector<HTMLElement>(
          '.slider-boundary-stop.slider-end',
        )!
        .getBoundingClientRect();

      expect(stop.width).toBe(stop.height);
      // handle-width / 2 (2px) + 4px inset.
      expect(track.right - (stop.left + stop.width / 2)).toBeCloseTo(6, 1);
    });

    it('sets slider-over-active on the icon when the active track fits it', async () => {
      const root = env.render(html`
        <md-gb-slider min="0" max="100" value="90" size="lg">
          <md-gb-icon slot="icon">volume_up</md-gb-icon>
        </md-gb-slider>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;
      const iconEl = el.shadowRoot!.querySelector('.slider-icon')!;

      expect(iconEl.classList.contains('slider-over-active')).toBeTrue();
    });

    describe('inset icon placement', () => {
      // Default host inline-size is 280px, so travel = 280 - 4 = 276px.
      async function renderIconSlider(
        value: number,
        size: 'md' | 'lg' | 'xl' = 'md',
        dir: 'ltr' | 'rtl' = 'ltr',
      ) {
        const root = env.render(html`
          <div dir=${dir}>
            <md-gb-slider min="0" max="100" .value=${value} .size=${size}>
              <md-gb-icon slot="icon">volume_up</md-gb-icon>
            </md-gb-slider>
          </div>
        `);
        await env.waitForStability();
        const el = root.querySelector('md-gb-slider')!;
        await el.updateComplete;
        const track =
          el.shadowRoot!.querySelector<HTMLElement>('.slider-track')!;
        const icon = el.shadowRoot!.querySelector<HTMLElement>('.slider-icon')!;
        return {
          icon,
          trackRect: track.getBoundingClientRect(),
          iconRect: icon.getBoundingClientRect(),
        };
      }

      it('keeps the icon on the active track with 10px padding when it fits', async () => {
        const {icon, trackRect, iconRect} = await renderIconSlider(50);

        expect(icon.classList.contains('slider-over-active')).toBeTrue();
        expect(iconRect.left - trackRect.left).toBeCloseTo(10, 0);
      });

      it('moves the icon past the handle onto the inactive track at low values', async () => {
        // value 5: handle center = 2 + 276 * 0.05 = 15.8px; active track ends
        // at 7.8px (< 44px), so the icon starts at 15.8 + 8 + 10 = 33.8px.
        const {icon, trackRect, iconRect} = await renderIconSlider(5);

        expect(icon.classList.contains('slider-over-active')).toBeFalse();
        expect(iconRect.left - trackRect.left).toBeCloseTo(33.8, 0);
      });

      it('moves the icon past the handle at the minimum value', async () => {
        // value 0: handle center = 2px, icon starts at 2 + 8 + 10 = 20px.
        const {icon, trackRect, iconRect} = await renderIconSlider(0);

        expect(icon.classList.contains('slider-over-active')).toBeFalse();
        expect(iconRect.left - trackRect.left).toBeCloseTo(20, 0);
      });

      it('moves the icon past the handle for lg', async () => {
        const {icon, trackRect, iconRect} = await renderIconSlider(5, 'lg');

        expect(icon.classList.contains('slider-over-active')).toBeFalse();
        expect(iconRect.left - trackRect.left).toBeCloseTo(33.8, 0);
      });

      it('switches sides at the md threshold', async () => {
        // value 18: active track ends at 43.68px (< 44px); value 19: 46.44px.
        const below = await renderIconSlider(18);
        const above = await renderIconSlider(19);

        expect(below.icon.classList.contains('slider-over-active')).toBeFalse();
        expect(above.icon.classList.contains('slider-over-active')).toBeTrue();
        expect(above.iconRect.left - above.trackRect.left).toBeCloseTo(10, 0);
      });

      it('never lets the handle and its gaps overlap the icon', async () => {
        const travel = 280 - 2 * HANDLE_HALF_WIDTH_PX;
        for (const value of [0, 1, 5, 10, 17, 18, 19, 20, 30, 50, 90, 100]) {
          const {icon, trackRect, iconRect} = await renderIconSlider(value);
          const handleCenter =
            trackRect.left + HANDLE_HALF_WIDTH_PX + travel * (value / 100);
          const gapStart = handleCenter - SLIDER_GAP_PX;
          const gapEnd = handleCenter + SLIDER_GAP_PX;
          const overlaps = iconRect.right > gapStart && iconRect.left < gapEnd;

          expect(overlaps)
            .withContext(
              `value=${value} over-active=${icon.classList.contains(
                'slider-over-active',
              )}`,
            )
            .toBeFalse();
        }
      });

      it('uses the inactive icon color on the inactive track', async () => {
        const root = env.render(html`
          <md-gb-slider
            id="active"
            size="md"
            value="50"
            style="--icon-color: rgb(1, 2, 3); --icon-color-active: rgb(4, 5, 6)">
            <md-gb-icon slot="icon">volume_up</md-gb-icon>
          </md-gb-slider>
          <md-gb-slider
            id="inactive"
            size="md"
            value="5"
            style="--icon-color: rgb(1, 2, 3); --icon-color-active: rgb(4, 5, 6)">
            <md-gb-icon slot="icon">volume_up</md-gb-icon>
          </md-gb-slider>
        `);
        await env.waitForStability();
        const iconColor = (id: string) =>
          getComputedStyle(
            root
              .querySelector(id)!
              .shadowRoot!.querySelector<HTMLElement>('.slider-icon')!,
          ).color;

        expect(iconColor('#active')).toBe('rgb(4, 5, 6)');
        expect(iconColor('#inactive')).toBe('rgb(1, 2, 3)');
      });

      it('uses a larger threshold for the 32px xl icon', async () => {
        // value 20: active track ends at 2 + 55.2 - 8 = 49.2px, which fits a
        // 24px icon (44px) but not a 32px icon (52px).
        const md = await renderIconSlider(20, 'md');
        const xl = await renderIconSlider(20, 'xl');

        expect(md.icon.classList.contains('slider-over-active')).toBeTrue();
        expect(xl.icon.classList.contains('slider-over-active')).toBeFalse();
      });

      it('mirrors the inactive track placement in RTL', async () => {
        const {icon, trackRect, iconRect} = await renderIconSlider(
          5,
          'md',
          'rtl',
        );

        expect(icon.classList.contains('slider-over-active')).toBeFalse();
        expect(trackRect.right - iconRect.right).toBeCloseTo(33.8, 0);
      });
    });

    it('computes icon placement from active track length', () => {
      const props = (value: number, size: 'md' | 'xl') =>
        computeSliderProperties({
          min: 0,
          max: 100,
          value,
          size,
          trackLength: 280,
        })['--__icon-over-active'];

      expect(iconMinActiveTrackPx()).toBe(44);
      expect(iconMinActiveTrackPx(32)).toBe(52);
      // Active track end = 2 + 276 * fraction - 8.
      expect(props(5, 'md')).toBe('0'); // 7.8px
      expect(props(18, 'md')).toBe('0'); // 43.68px < 44px
      expect(props(19, 'md')).toBe('1'); // 46.44px
      expect(props(20, 'xl')).toBe('0'); // 49.2px < 52px
      expect(props(22, 'xl')).toBe('1'); // 54.72px
    });

    it('delegates ARIA attributes to native input elements', async () => {
      const root = env.render(html`
        <md-gb-slider
          range
          aria-label-start="Minimum temperature"
          aria-label-end="Maximum temperature"
          aria-valuetext-start="20 degrees"
          aria-valuetext-end="80 degrees"
          min="0"
          max="100"
          value-start="20"
          value-end="80"></md-gb-slider>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;

      const inputStart = el.shadowRoot!.querySelector('input.slider-start')!;
      const inputEnd = el.shadowRoot!.querySelector('input.slider-end')!;

      expect(inputStart.getAttribute('aria-label')).toBe('Minimum temperature');
      expect(inputEnd.getAttribute('aria-label')).toBe('Maximum temperature');
      expect(inputStart.getAttribute('aria-valuetext')).toBe('20 degrees');
      expect(inputEnd.getAttribute('aria-valuetext')).toBe('80 degrees');
    });

    it('supports form association and reset callbacks', async () => {
      const root = env.render(html`
        <form id="test-form">
          <md-gb-slider name="volume" value="70"></md-gb-slider>
        </form>
      `);
      await env.waitForStability();
      const form = root.querySelector<HTMLFormElement>('#test-form')!;
      const el = root.querySelector('md-gb-slider')!;

      const formData = new FormData(form);
      expect(formData.get('volume')).toBe('70');

      el.value = 90;
      await env.waitForStability();
      expect(new FormData(form).get('volume')).toBe('90');

      form.reset();
      await env.waitForStability();
      expect(el.value).toBe(70);
    });

    it('supports form association in range mode with FormData', async () => {
      const root = env.render(html`
        <form id="range-form">
          <md-gb-slider
            range
            name="price"
            name-start="min_price"
            name-end="max_price"
            value-start="15"
            value-end="85"></md-gb-slider>
        </form>
      `);
      await env.waitForStability();
      const form = root.querySelector<HTMLFormElement>('#range-form')!;

      const formData = new FormData(form);
      expect(formData.get('min_price')).toBe('15');
      expect(formData.get('max_price')).toBe('85');
    });
  });

  describe('slider part', () => {
    it('exposes part="slider" on the token root', async () => {
      const root = env.render(html`<md-gb-slider></md-gb-slider>`);
      await env.waitForStability();
      const el = root.querySelector('md-gb-slider')!;

      const sliderRoot = el.shadowRoot!.querySelector('.slider')!;
      expect(sliderRoot.getAttribute('part')).toBe('slider');
    });

    it('applies tokens set through ::part(slider) over size defaults', async () => {
      const root = env.render(html`
        <style>
          #part-styled::part(slider) {
            --track-height: 4px;
            --handle-height: 20px;
            --active-track-color: rgb(1, 2, 3);
          }
        </style>
        <md-gb-slider id="part-styled" size="md"></md-gb-slider>
        <md-gb-slider id="stock" size="md"></md-gb-slider>
      `);
      await env.waitForStability();
      const inner = (id: string, selector: string) =>
        root
          .querySelector(id)!
          .shadowRoot!.querySelector<HTMLElement>(selector)!;

      expect(getComputedStyle(inner('#part-styled', '.slider')).height).toBe(
        '20px',
      );
      expect(
        getComputedStyle(inner('#part-styled', '.slider-track')).height,
      ).toBe('4px');
      expect(
        getComputedStyle(inner('#part-styled', '.slider-active'))
          .backgroundColor,
      ).toBe('rgb(1, 2, 3)');
      expect(getComputedStyle(inner('#stock', '.slider')).height).toBe('52px');
      expect(getComputedStyle(inner('#stock', '.slider-track')).height).toBe(
        '40px',
      );
    });
  });

  describe('helper functions', () => {
    it('sliderClasses() applies state flags with slider- prefix and suppresses ranged when vertical', () => {
      const classes = sliderClasses({
        disabled: true,
        ranged: true,
        centered: false,
        vertical: true,
      });

      expect(classes[SLIDER_CLASSES.slider]).toBeTrue();
      expect(classes[SLIDER_CLASSES.ranged]).toBeFalse();
      expect(classes[SLIDER_CLASSES.disabled]).toBeTrue();
      expect(classes[SLIDER_CLASSES.centered]).toBeFalse();
      expect(classes[SLIDER_CLASSES.vertical]).toBeTrue();

      const horizontalRanged = sliderClasses({
        ranged: true,
        vertical: false,
      });
      expect(horizontalRanged[SLIDER_CLASSES.ranged]).toBeTrue();
    });

    it('handleClasses() applies handle state flags with slider- prefix', () => {
      const classes = handleClasses({
        start: true,
        onTop: true,
        isOverlapping: true,
        hover: true,
        active: true,
        focusVisible: true,
      });

      expect(classes[HANDLE_CLASSES.handle]).toBeTrue();
      expect(classes[HANDLE_CLASSES.start]).toBeTrue();
      expect(classes[HANDLE_CLASSES.onTop]).toBeTrue();
      expect(classes[HANDLE_CLASSES.isOverlapping]).toBeTrue();
      expect(classes[HANDLE_CLASSES.hover]).toBeTrue();
      expect(classes[HANDLE_CLASSES.active]).toBeTrue();
      expect(classes[HANDLE_CLASSES.focusVisible]).toBeTrue();
    });

    it('handleNubClasses() includes slider-handle-nub and focus-ring-outer', () => {
      const classes = handleNubClasses({focusVisible: true});
      expect(classes['slider-handle-nub']).toBeTrue();
      expect(classes['focus-ring-outer']).toBeTrue();
      expect(classes['focus-visible']).toBeTrue();
    });

    it('formatValueIndicatorLabel() formats numbers to at most 4 characters', () => {
      expect(formatValueIndicatorLabel(undefined)).toBe('');
      expect(formatValueIndicatorLabel(1000)).toBe('1000');
      expect(formatValueIndicatorLabel(-50)).toBe('-50');
      expect(formatValueIndicatorLabel(0.25)).toBe('0.25');
      expect(formatValueIndicatorLabel(73.625)).toBe('73.6');
      expect(formatValueIndicatorLabel(100.5)).toBe('101');
      expect(formatValueIndicatorLabel(-12.75)).toBe('-13');
    });

    it('computeStopIntervals() computes discrete stop counts', () => {
      expect(computeStopIntervals(0, 100, 10)).toBe(10);
      expect(computeStopIntervals(0, 100, 'any')).toBe(0);
      expect(computeStopIntervals(0, 100, 0)).toBe(100);
      expect(computeStopIntervals(100, 0, 10)).toBe(0);
      expect(computeStopIntervals(0, 100, 0.001)).toBe(0);
    });

    it('computeSliderProperties() calculates correct fractions', () => {
      const continuous = computeSliderProperties({
        min: 0,
        max: 100,
        value: 50,
      });
      expect(continuous['--__end-fraction']).toBe('0.5');
      expect(continuous['--__active-start-fraction']).toBe('0');
      expect(continuous['--__active-end-fraction']).toBe('0.5');

      const centered = computeSliderProperties({
        min: -50,
        max: 50,
        value: 25,
        centered: true,
      });
      expect(centered['--__active-start-fraction']).toBe('0.5');
      expect(centered['--__active-end-fraction']).toBe('0.75');

      const range = computeSliderProperties({
        min: 0,
        max: 100,
        range: true,
        valueStart: 25,
        valueEnd: 75,
      });
      expect(range['--__start-fraction']).toBe('0.25');
      expect(range['--__end-fraction']).toBe('0.75');
      expect(range['--__active-start-fraction']).toBe('0.25');
      expect(range['--__active-end-fraction']).toBe('0.75');
    });

    it('setupSlider() initializes raw HTML elements and listeners', async () => {
      const root = env.render(html`
        <div class="slider" style="width: 200px;">
          <input
            type="range"
            class="slider-end focus-ring-target"
            min="0"
            max="100"
            value="30" />
          <div class="slider-track">
            <div class="slider-inactive-lead slider-track-box"></div>
            <div class="slider-active slider-track-box"></div>
            <div class="slider-inactive-trail slider-track-box"></div>
            <div class="slider-boundary-stop slider-end"></div>
          </div>
          <div class="slider-handles">
            <div class="slider-handle slider-end">
              <div class="slider-handle-nub focus-ring-outer"></div>
            </div>
          </div>
        </div>
      `);
      await env.waitForStability();
      const sliderEl = root.querySelector<HTMLElement>('.slider')!;
      setupSlider(sliderEl);

      expect(sliderEl.style.getPropertyValue('--__end-fraction')).toBe('0.3');

      const inputEnd =
        sliderEl.querySelector<HTMLInputElement>('input.slider-end')!;
      inputEnd.value = '80';
      inputEnd.dispatchEvent(new Event('input', {bubbles: true}));

      expect(sliderEl.style.getPropertyValue('--__end-fraction')).toBe('0.8');
    });
  });
});
