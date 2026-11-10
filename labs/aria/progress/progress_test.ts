/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-aria-progress.js';

import {html} from 'lit';

import {Environment} from '../../../testing/environment.js';
import {internals} from '../../behaviors/element-internals.js';

function getCustomProperty(element: Element, name: string) {
  return getComputedStyle(element).getPropertyValue(name).trim();
}

describe('md-aria-progress', () => {
  const env = new Environment();

  async function setUpTest(
    // This wrapper `<div>` is used so that test styles don't apply `display:
    // block;` directly to the component.
    template = html`<div><md-aria-progress></md-aria-progress></div>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const progress = root.querySelector('md-aria-progress')!;
    return {root, progress};
  }

  describe('properties', () => {
    describe('value', () => {
      it('is null when the `value` attribute is not set', async () => {
        const {progress} = await setUpTest();

        expect(progress.value).toBeNull();
      });

      it('is parsed from the `value` attribute', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress value="25"></md-aria-progress></div>
        `);

        expect(progress.value).toBe(25);
      });

      it('is not clamped to `max`', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress value="20" max="10"></md-aria-progress></div>
        `);

        expect(progress.value).toBe(20);
      });

      it('is not clamped to `min`', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress value="-1"></md-aria-progress></div>
        `);

        expect(progress.value).toBe(-1);
      });

      it('reflects to the `value` attribute when set', async () => {
        const {progress} = await setUpTest();

        expect(progress.getAttribute('value')).toBeNull();

        progress.value = 50;
        await env.waitForStability();

        expect(progress.getAttribute('value')).toBe('50');
      });

      it('removes the `value` attribute when set to null', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress value="50"></md-aria-progress></div>
        `);

        progress.value = null;
        await env.waitForStability();

        expect(progress.hasAttribute('value')).toBeFalse();
      });

      it('returns to null when the `value` attribute is removed', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress value="50"></md-aria-progress></div>
        `);

        progress.removeAttribute('value');
        await env.waitForStability();

        expect(progress.value).toBeNull();
      });
    });

    describe('min', () => {
      it('is 0 when the `min` attribute is not set', async () => {
        const {progress} = await setUpTest();

        expect(progress.min).toBe(0);
      });

      it('does not reflect its default value', async () => {
        const {progress} = await setUpTest();

        expect(progress.hasAttribute('min')).toBeFalse();
      });

      it('is parsed from the `min` attribute', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress min="10"></md-aria-progress></div>
        `);

        expect(progress.min).toBe(10);
      });

      it('reflects to the `min` attribute when set', async () => {
        const {progress} = await setUpTest();

        progress.min = 5;
        await env.waitForStability();

        expect(progress.getAttribute('min')).toBe('5');
      });

      it('returns to 0 when the `min` attribute is removed', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress min="10"></md-aria-progress></div>
        `);

        progress.removeAttribute('min');
        await env.waitForStability();

        expect(progress.min).toBe(0);
      });
    });

    describe('max', () => {
      it('is 100 when the `max` attribute is not set', async () => {
        const {progress} = await setUpTest();

        expect(progress.max).toBe(100);
      });

      it('does not reflect its default value', async () => {
        const {progress} = await setUpTest();

        expect(progress.hasAttribute('max')).toBeFalse();
      });

      it('is parsed from the `max` attribute', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress max="10"></md-aria-progress></div>
        `);

        expect(progress.max).toBe(10);
      });

      it('reflects to the `max` attribute when set', async () => {
        const {progress} = await setUpTest();

        progress.max = 2;
        await env.waitForStability();

        expect(progress.getAttribute('max')).toBe('2');
      });

      it('returns to 100 when the `max` attribute is removed', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress max="10"></md-aria-progress></div>
        `);

        progress.removeAttribute('max');
        await env.waitForStability();

        expect(progress.max).toBe(100);
      });

      it('is not modified when less than `min`', async () => {
        const {progress} = await setUpTest(html`
          <div><md-aria-progress min="10" max="2"></md-aria-progress></div>
        `);

        expect(progress.max).toBe(2);
        expect(progress.getAttribute('max')).toBe('2');
      });
    });
  });

  describe('ARIA', () => {
    it('sets role to "progressbar"', async () => {
      const {progress} = await setUpTest();

      expect(progress[internals].role).toBe('progressbar');
    });

    it('sets ariaValueNow, ariaValueMin, and ariaValueMax when determinate', async () => {
      const {progress} = await setUpTest(html`
        <div>
          <md-aria-progress value="3" min="1" max="10"></md-aria-progress>
        </div>
      `);

      expect(progress[internals].ariaValueNow).toBe('3');
      expect(progress[internals].ariaValueMin).toBe('1');
      expect(progress[internals].ariaValueMax).toBe('10');
    });

    it('defaults ariaValueMin to 0 and ariaValueMax to 100', async () => {
      const {progress} = await setUpTest(html`
        <div><md-aria-progress value="50"></md-aria-progress></div>
      `);

      expect(progress[internals].ariaValueMin).toBe('0');
      expect(progress[internals].ariaValueMax).toBe('100');
    });

    it('clamps ariaValueNow to max', async () => {
      const {progress} = await setUpTest(html`
        <div><md-aria-progress value="20" max="10"></md-aria-progress></div>
      `);

      expect(progress[internals].ariaValueNow).toBe('10');
    });

    it('clamps ariaValueNow to min', async () => {
      const {progress} = await setUpTest(html`
        <div><md-aria-progress value="5" min="10"></md-aria-progress></div>
      `);

      expect(progress[internals].ariaValueNow).toBe('10');
    });

    it('updates the clamped ariaValueNow when `min` and `max` change', async () => {
      const {progress} = await setUpTest(html`
        <div><md-aria-progress value="50"></md-aria-progress></div>
      `);

      progress.max = 20;
      await env.waitForStability();
      expect(progress[internals].ariaValueNow).toBe('20');

      progress.max = 100;
      progress.min = 60;
      await env.waitForStability();
      expect(progress[internals].ariaValueNow).toBe('60');
    });

    it('clears ariaValueNow when indeterminate', async () => {
      const {progress} = await setUpTest();

      expect(progress[internals].ariaValueNow).toBeNull();
    });

    it('updates ariaValueNow when `value` changes', async () => {
      const {progress} = await setUpTest();

      progress.value = 25;
      await env.waitForStability();
      expect(progress[internals].ariaValueNow).toBe('25');

      progress.removeAttribute('value');
      await env.waitForStability();
      expect(progress[internals].ariaValueNow).toBeNull();
    });

    it('updates ariaValueMin and ariaValueMax when `min` and `max` change', async () => {
      const {progress} = await setUpTest();

      progress.min = 10;
      progress.max = 20;
      await env.waitForStability();

      expect(progress[internals].ariaValueMin).toBe('10');
      expect(progress[internals].ariaValueMax).toBe('20');
    });

    it('raises ariaValueMax to min when max is less than min', async () => {
      const {progress} = await setUpTest(html`
        <div>
          <md-aria-progress value="5" min="10" max="2"></md-aria-progress>
        </div>
      `);

      expect(progress[internals].ariaValueMin).toBe('10');
      expect(progress[internals].ariaValueMax).toBe('10');
      expect(progress[internals].ariaValueNow).toBe('10');
    });
  });

  describe(':state(indeterminate)', () => {
    it('matches when `value` is not set', async () => {
      const {progress} = await setUpTest();

      expect(progress.matches(':state(indeterminate)')).toBeTrue();
    });

    it('does not match when `value` is set', async () => {
      const {progress} = await setUpTest(html`
        <div><md-aria-progress value="50"></md-aria-progress></div>
      `);

      expect(progress.matches(':state(indeterminate)')).toBeFalse();
    });

    it('does not match when `value` is 0', async () => {
      const {progress} = await setUpTest(html`
        <div><md-aria-progress value="0"></md-aria-progress></div>
      `);

      expect(progress.matches(':state(indeterminate)')).toBeFalse();
    });

    it('stops matching when the `value` property is set', async () => {
      const {progress} = await setUpTest();

      progress.value = 50;
      await env.waitForStability();

      expect(progress.matches(':state(indeterminate)')).toBeFalse();
    });

    it('matches when the `value` property is set to null', async () => {
      const {progress} = await setUpTest(html`
        <div><md-aria-progress value="50"></md-aria-progress></div>
      `);

      progress.value = null;
      await env.waitForStability();

      expect(progress.matches(':state(indeterminate)')).toBeTrue();
    });

    it('toggles when the `value` attribute is added and removed', async () => {
      const {progress} = await setUpTest();

      progress.setAttribute('value', '50');
      await env.waitForStability();
      expect(progress.matches(':state(indeterminate)')).toBeFalse();

      progress.removeAttribute('value');
      await env.waitForStability();
      expect(progress.matches(':state(indeterminate)')).toBeTrue();
    });
  });

  describe('custom properties', () => {
    async function setUpCustomContentTest(attributes: {
      value?: number;
      min?: number;
      max?: number;
    }) {
      const {root, progress} = await setUpTest();
      for (const name of ['value', 'min', 'max'] as const) {
        const value = attributes[name];
        if (value !== undefined) {
          progress.setAttribute(name, String(value));
        }
      }

      // Custom content uses `--progress` to size itself, as in the demo's
      // custom progress story.
      const content = document.createElement('div');
      content.style.setProperty('inline-size', 'calc(100px * var(--progress))');
      progress.append(content);
      await env.waitForStability();

      return {root, progress, content};
    }

    describe('--progress-value', () => {
      it('is the current value', async () => {
        const {content} = await setUpCustomContentTest({value: 3, max: 10});

        expect(getCustomProperty(content, '--progress-value')).toBe('3');
      });

      it('is clamped to max', async () => {
        const {content} = await setUpCustomContentTest({value: 20, max: 10});

        expect(getCustomProperty(content, '--progress-value')).toBe('10');
      });

      it('is clamped to min', async () => {
        const {content} = await setUpCustomContentTest({value: 5, min: 10});

        expect(getCustomProperty(content, '--progress-value')).toBe('10');
      });

      it('defaults to 0 when indeterminate', async () => {
        const {content} = await setUpCustomContentTest({});

        expect(getCustomProperty(content, '--progress-value')).toBe('0');
      });

      it('updates when `value` changes', async () => {
        const {progress, content} = await setUpCustomContentTest({value: 1});

        progress.value = 25;
        await env.waitForStability();
        expect(getCustomProperty(content, '--progress-value')).toBe('25');

        progress.removeAttribute('value');
        await env.waitForStability();
        expect(getCustomProperty(content, '--progress-value')).toBe('0');
      });
    });

    describe('--progress-min', () => {
      it('is the current min', async () => {
        const {content} = await setUpCustomContentTest({value: 3, min: 2});

        expect(getCustomProperty(content, '--progress-min')).toBe('2');
      });

      it('defaults to 0', async () => {
        const {content} = await setUpCustomContentTest({value: 50});

        expect(getCustomProperty(content, '--progress-min')).toBe('0');
      });

      it('updates when `min` changes', async () => {
        const {progress, content} = await setUpCustomContentTest({value: 50});

        progress.min = 10;
        await env.waitForStability();

        expect(getCustomProperty(content, '--progress-min')).toBe('10');
      });
    });

    describe('--progress-max', () => {
      it('is the current max', async () => {
        const {content} = await setUpCustomContentTest({value: 3, max: 10});

        expect(getCustomProperty(content, '--progress-max')).toBe('10');
      });

      it('defaults to 100', async () => {
        const {content} = await setUpCustomContentTest({value: 50});

        expect(getCustomProperty(content, '--progress-max')).toBe('100');
      });

      it('updates when `max` changes', async () => {
        const {progress, content} = await setUpCustomContentTest({value: 50});

        progress.max = 200;
        await env.waitForStability();

        expect(getCustomProperty(content, '--progress-max')).toBe('200');
      });

      it('is raised to min when max is less than min', async () => {
        const {content} = await setUpCustomContentTest({
          value: 5,
          min: 10,
          max: 2,
        });

        expect(getCustomProperty(content, '--progress-max')).toBe('10');
      });
    });

    describe('--progress', () => {
      it('is "indeterminate" when indeterminate', async () => {
        const {content} = await setUpCustomContentTest({});

        expect(getCustomProperty(content, '--progress')).toBe('indeterminate');
      });

      it('is the progress of value between the default min and max', async () => {
        const {content} = await setUpCustomContentTest({value: 25});

        expect(content.getBoundingClientRect().width).toBe(25);
      });

      it('is the progress of value between 0 and max', async () => {
        const {content} = await setUpCustomContentTest({value: 3, max: 8});

        expect(content.getBoundingClientRect().width).toBe(37.5);
      });

      it('is the progress of value between min and max', async () => {
        const {content} = await setUpCustomContentTest({
          value: 30,
          min: 20,
          max: 60,
        });

        expect(content.getBoundingClientRect().width).toBe(25);
      });

      it('supports a negative min', async () => {
        const {content} = await setUpCustomContentTest({
          value: 0,
          min: -10,
          max: 10,
        });

        expect(content.getBoundingClientRect().width).toBe(50);
      });

      it('is clamped to 0 when value is below min', async () => {
        const {content} = await setUpCustomContentTest({value: 5, min: 10});

        expect(content.getBoundingClientRect().width).toBe(0);
      });

      it('is clamped to 1 when value is above max', async () => {
        const {content} = await setUpCustomContentTest({value: 20, max: 10});

        expect(content.getBoundingClientRect().width).toBe(100);
      });

      it('updates when `value`, `min`, and `max` change', async () => {
        const {progress, content} = await setUpCustomContentTest({value: 0});

        progress.value = 3;
        progress.min = 2;
        progress.max = 6;
        await env.waitForStability();

        expect(content.getBoundingClientRect().width).toBe(25);
      });
    });
  });
});
