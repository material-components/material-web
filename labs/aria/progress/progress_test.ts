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

  async function setupTest(
    // This wrapper `<div>` is used so that test styles don't apply `display:
    // block;` directly to the component.
    template = html`<div><md-aria-progress></md-aria-progress></div>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const progress = root.querySelector('md-aria-progress')!;
    return {root, progress};
  }

  it('has computed display inline-block by default', async () => {
    const {progress} = await setupTest();
    expect(getComputedStyle(progress).display).toBe('inline-block');
  });

  describe('properties', () => {
    describe('value', () => {
      it('is 0 when the `value` attribute is not set', async () => {
        const {progress} = await setupTest();

        expect(progress.value).toBe(0);
      });

      it('is parsed from the `value` attribute', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress value="0.25"></md-aria-progress></div>
        `);

        expect(progress.value).toBe(0.25);
      });

      it('is 0 when the `value` attribute is not a number', async () => {
        const {progress} = await setupTest();
        progress.setAttribute('value', 'abc');
        await env.waitForStability();

        expect(progress.value).toBe(0);
      });

      it('is clamped to 0 when the `value` attribute is negative', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress value="-1"></md-aria-progress></div>
        `);

        expect(progress.value).toBe(0);
      });

      it('is clamped to `max` when the `value` attribute exceeds it', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress value="20" max="10"></md-aria-progress></div>
        `);

        expect(progress.value).toBe(10);
      });

      it('sets the `value` attribute when set', async () => {
        const {progress} = await setupTest();

        progress.value = 0.5;
        await env.waitForStability();

        expect(progress.getAttribute('value')).toBe('0.5');
        expect(progress.value).toBe(0.5);
      });

      it('sets the `value` attribute to 0 when set to a negative number', async () => {
        const {progress} = await setupTest();

        progress.value = -1;
        await env.waitForStability();

        expect(progress.getAttribute('value')).toBe('0');
        expect(progress.value).toBe(0);
      });

      it('sets the `value` attribute to a value above `max` without clamping', async () => {
        const {progress} = await setupTest();

        progress.value = 5;
        await env.waitForStability();

        expect(progress.getAttribute('value')).toBe('5');
        expect(progress.value).toBe(1);
      });

      it('is clamped when `max` is reduced below it', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress value="5" max="10"></md-aria-progress></div>
        `);

        progress.max = 2;
        await env.waitForStability();

        expect(progress.value).toBe(2);
        expect(progress.getAttribute('value')).toBe('5');
      });
    });

    describe('max', () => {
      it('is 1 when the `max` attribute is not set', async () => {
        const {progress} = await setupTest();

        expect(progress.max).toBe(1);
      });

      it('is parsed from the `max` attribute', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress max="10"></md-aria-progress></div>
        `);

        expect(progress.max).toBe(10);
      });

      for (const invalidMax of ['abc', '0', '-1']) {
        it(`is 1 when the \`max\` attribute is "${invalidMax}"`, async () => {
          const {progress} = await setupTest();
          progress.setAttribute('max', invalidMax);
          await env.waitForStability();

          expect(progress.max).toBe(1);
        });
      }

      it('returns to 1 when the `max` attribute is removed', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress max="10"></md-aria-progress></div>
        `);

        progress.removeAttribute('max');
        await env.waitForStability();

        expect(progress.max).toBe(1);
      });

      it('sets the `max` attribute when set', async () => {
        const {progress} = await setupTest();

        progress.max = 2;
        await env.waitForStability();

        expect(progress.getAttribute('max')).toBe('2');
        expect(progress.max).toBe(2);
      });

      for (const invalidMax of [0, -1]) {
        it(`ignores being set to ${invalidMax}`, async () => {
          const {progress} = await setupTest(html`
            <div><md-aria-progress max="10"></md-aria-progress></div>
          `);

          progress.max = invalidMax;
          await env.waitForStability();

          expect(progress.getAttribute('max')).toBe('10');
          expect(progress.max).toBe(10);
        });
      }
    });

    describe('position', () => {
      it('is -1 when indeterminate', async () => {
        const {progress} = await setupTest();

        expect(progress.position).toBe(-1);
      });

      it('is the ratio of value to the default max', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress value="0.25"></md-aria-progress></div>
        `);

        expect(progress.position).toBe(0.25);
      });

      it('is the ratio of value to max', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress value="3" max="8"></md-aria-progress></div>
        `);

        expect(progress.position).toBe(0.375);
      });

      it('is 0 when the `value` attribute is negative', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress value="-1"></md-aria-progress></div>
        `);

        expect(progress.position).toBe(0);
      });

      it('is 1 when value exceeds max', async () => {
        const {progress} = await setupTest(html`
          <div><md-aria-progress value="20" max="10"></md-aria-progress></div>
        `);

        expect(progress.position).toBe(1);
      });

      it('updates when the `value` attribute is added and removed', async () => {
        const {progress} = await setupTest();

        progress.setAttribute('value', '0.5');
        await env.waitForStability();
        expect(progress.position).toBe(0.5);

        progress.removeAttribute('value');
        await env.waitForStability();
        expect(progress.position).toBe(-1);
      });
    });
  });

  describe('ARIA', () => {
    it('sets role to "progressbar"', async () => {
      const {progress} = await setupTest();

      expect(progress[internals].role).toBe('progressbar');
    });

    it('sets ariaValueNow and ariaValueMax when determinate', async () => {
      const {progress} = await setupTest(html`
        <div><md-aria-progress value="3" max="10"></md-aria-progress></div>
      `);

      expect(progress[internals].ariaValueNow).toBe('3');
      expect(progress[internals].ariaValueMax).toBe('10');
    });

    it('defaults ariaValueMax to 1', async () => {
      const {progress} = await setupTest(html`
        <div><md-aria-progress value="0.5"></md-aria-progress></div>
      `);

      expect(progress[internals].ariaValueMax).toBe('1');
    });

    it('clamps ariaValueNow to max', async () => {
      const {progress} = await setupTest(html`
        <div><md-aria-progress value="20" max="10"></md-aria-progress></div>
      `);

      expect(progress[internals].ariaValueNow).toBe('10');
    });

    it('clears ariaValueNow when indeterminate', async () => {
      const {progress} = await setupTest();

      expect(progress[internals].ariaValueNow).toBeNull();
    });

    it('updates ariaValueNow when `value` changes', async () => {
      const {progress} = await setupTest();

      progress.value = 0.25;
      await env.waitForStability();
      expect(progress[internals].ariaValueNow).toBe('0.25');

      progress.removeAttribute('value');
      await env.waitForStability();
      expect(progress[internals].ariaValueNow).toBeNull();
    });
  });

  describe(':state(indeterminate)', () => {
    it('matches when `value` is not set', async () => {
      const {progress} = await setupTest();

      expect(progress.matches(':state(indeterminate)')).toBeTrue();
    });

    it('does not match when `value` is set', async () => {
      const {progress} = await setupTest(html`
        <div><md-aria-progress value="0.5"></md-aria-progress></div>
      `);

      expect(progress.matches(':state(indeterminate)')).toBeFalse();
    });

    it('does not match when `value` is 0', async () => {
      const {progress} = await setupTest(html`
        <div><md-aria-progress value="0"></md-aria-progress></div>
      `);

      expect(progress.matches(':state(indeterminate)')).toBeFalse();
    });

    it('does not match when the `value` attribute is not a number', async () => {
      const {progress} = await setupTest();
      progress.setAttribute('value', 'abc');
      await env.waitForStability();

      expect(progress.matches(':state(indeterminate)')).toBeFalse();
    });

    it('stops matching when the `value` property is set', async () => {
      const {progress} = await setupTest();

      progress.value = 0.5;
      await env.waitForStability();

      expect(progress.matches(':state(indeterminate)')).toBeFalse();
    });

    it('toggles when the `value` attribute is added and removed', async () => {
      const {progress} = await setupTest();

      progress.setAttribute('value', '0.5');
      await env.waitForStability();
      expect(progress.matches(':state(indeterminate)')).toBeFalse();

      progress.removeAttribute('value');
      await env.waitForStability();
      expect(progress.matches(':state(indeterminate)')).toBeTrue();
    });
  });

  describe('custom properties', () => {
    async function setupCustomContentTest(attributes: {
      value?: number;
      max?: number;
    }) {
      const {root, progress} = await setupTest();
      if (attributes.value !== undefined) {
        progress.setAttribute('value', String(attributes.value));
      }
      if (attributes.max !== undefined) {
        progress.setAttribute('max', String(attributes.max));
      }

      // Custom content uses `--md-aria-progress-position` to size itself, as
      // in the demo's custom progress story.
      const content = document.createElement('div');
      content.style.setProperty(
        'inline-size',
        'calc(100px * var(--md-aria-progress-position))',
      );
      progress.append(content);
      await env.waitForStability();

      return {root, progress, content};
    }

    describe('--md-aria-progress-value', () => {
      it('is the current value when determinate', async () => {
        const {content} = await setupCustomContentTest({value: 3, max: 10});

        expect(getCustomProperty(content, '--md-aria-progress-value')).toBe(
          '3',
        );
      });

      it('is clamped to max', async () => {
        const {content} = await setupCustomContentTest({value: 20, max: 10});

        expect(getCustomProperty(content, '--md-aria-progress-value')).toBe(
          '10',
        );
      });

      it('is "indeterminate" when indeterminate', async () => {
        const {content} = await setupCustomContentTest({});

        expect(getCustomProperty(content, '--md-aria-progress-value')).toBe(
          'indeterminate',
        );
      });

      it('updates when `value` changes', async () => {
        const {progress, content} = await setupCustomContentTest({value: 1});

        progress.value = 0.25;
        await env.waitForStability();
        expect(getCustomProperty(content, '--md-aria-progress-value')).toBe(
          '0.25',
        );

        progress.removeAttribute('value');
        await env.waitForStability();
        expect(getCustomProperty(content, '--md-aria-progress-value')).toBe(
          'indeterminate',
        );
      });
    });

    describe('--md-aria-progress-max', () => {
      it('is the current max', async () => {
        const {content} = await setupCustomContentTest({value: 3, max: 10});

        expect(getCustomProperty(content, '--md-aria-progress-max')).toBe('10');
      });

      it('defaults to 1', async () => {
        const {content} = await setupCustomContentTest({value: 0.5});

        expect(getCustomProperty(content, '--md-aria-progress-max')).toBe('1');
      });

      it('is 1 when the `max` attribute is invalid', async () => {
        const {content} = await setupCustomContentTest({value: 0.5, max: 0});

        expect(getCustomProperty(content, '--md-aria-progress-max')).toBe('1');
      });
    });

    describe('--md-aria-progress-position', () => {
      it('is "indeterminate" when indeterminate', async () => {
        const {content} = await setupCustomContentTest({});

        expect(getCustomProperty(content, '--md-aria-progress-position')).toBe(
          'indeterminate',
        );
      });

      it('is the ratio of value to the default max', async () => {
        const {content} = await setupCustomContentTest({value: 0.25});

        expect(content.getBoundingClientRect().width).toBe(25);
      });

      it('is the ratio of value to max', async () => {
        const {content} = await setupCustomContentTest({value: 3, max: 8});

        expect(content.getBoundingClientRect().width).toBe(37.5);
      });

      it('is clamped to 0 when value is below 0', async () => {
        const {content} = await setupCustomContentTest({value: -1});

        expect(content.getBoundingClientRect().width).toBe(0);
      });

      it('is clamped to 1 when value is above max', async () => {
        const {content} = await setupCustomContentTest({value: 20, max: 10});

        expect(content.getBoundingClientRect().width).toBe(100);
      });

      it('updates when `value` and `max` change', async () => {
        const {progress, content} = await setupCustomContentTest({value: 0});

        progress.value = 2;
        progress.max = 4;
        await env.waitForStability();

        expect(content.getBoundingClientRect().width).toBe(50);
      });
    });
  });

  describe('slotted content', () => {
    it('renders default track and bar when no content is slotted', async () => {
      const {progress} = await setupTest();

      const slot = progress.shadowRoot!.querySelector('slot')!;
      expect(slot.assignedNodes()).toEqual([]);
      expect(progress.shadowRoot!.querySelector('#track')).not.toBeNull();
      expect(progress.shadowRoot!.querySelector('#bar')).not.toBeNull();
    });

    it('assigns custom content to the default slot', async () => {
      const {progress} = await setupTest(html`
        <div>
          <md-aria-progress><div id="custom"></div></md-aria-progress>
        </div>
      `);

      const slot = progress.shadowRoot!.querySelector('slot')!;
      expect(slot.name).toBe('');
      expect(slot.assignedElements()).toEqual([
        progress.querySelector('#custom')!,
      ]);
    });
  });
});
