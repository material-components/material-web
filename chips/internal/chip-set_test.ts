/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {Harness} from '../../testing/harness.js';
import {ChipHarness} from '../harness.js';

import {AssistChip} from './assist-chip.js';
import {Chip} from './chip.js';
import {ChipSet} from './chip-set.js';
import {InputChip} from './input-chip.js';

@customElement('test-chip-set')
class TestChipSet extends ChipSet {}
@customElement('test-chip-set-assist-chip')
class TestAssistChip extends AssistChip {}
@customElement('test-chip-set-input-chip')
class TestInputChip extends InputChip {}

describe('Chip set', () => {
  const env = new Environment();

  async function setupTest(children: Node[]) {
    const chipSet = new TestChipSet();
    env.render(html`
      <style>
        /* Help visualize focus rings while debugging */
        test-chip-set-assist-chip,
        test-chip-set-input-chip,
        test-chip-set-filter-chip {
          position: relative;
        }
      </style>
      ${chipSet}
    `);
    chipSet.append(...children);
    await env.waitForStability();
    return chipSet;
  }

  describe('chips', () => {
    it('should return only chip children', async () => {
      const notAChip = document.createElement('div');
      const chip = new TestAssistChip();
      const chipSet = await setupTest([notAChip, chip]);

      expect(chipSet.chips).toEqual([chip]);
    });
  });

  describe('navigation', () => {
    it('should add tabindex="-1" to all chips except the first', async () => {
      const chipSet = await setupTest([
        new TestAssistChip(),
        new TestAssistChip(),
        new TestAssistChip(),
      ]);

      expect(chipSet.chips[0].getAttribute('tabindex'))
        .withContext('first tabindex')
        .toBe('0');
      expect(chipSet.chips[1].getAttribute('tabindex'))
        .withContext('second tabindex')
        .toBe('-1');
      expect(chipSet.chips[2].getAttribute('tabindex'))
        .withContext('third tabindex')
        .toBe('-1');
    });

    async function testNavigation({
      chipSet,
      ltrKey,
      rtlKey,
      current,
      next,
    }: {
      chipSet: ChipSet;
      ltrKey: string;
      rtlKey: string;
      current: Chip | null;
      next: Chip;
    }) {
      const harness = current ? new ChipHarness(current) : new Harness(chipSet);
      // Don't use harness focusing since we need to test real focus states
      current?.focus();
      await harness.keypress(ltrKey);
      expect(next.matches(':focus-within'))
        .withContext(`next chip is focused in LTR after ${ltrKey}`)
        .toBeTrue();

      next.blur();
      chipSet.style.direction = 'rtl';
      current?.focus();
      await harness.keypress(rtlKey);
      expect(next.matches(':focus-within'))
        .withContext(`next chip is focused in RTL after ${rtlKey}`)
        .toBeTrue();
    }

    it('should navigate forward on horizontal arrow keys', async () => {
      const first = new TestAssistChip();
      const second = new TestAssistChip();
      const third = new TestAssistChip();
      const chipSet = await setupTest([first, second, third]);
      await testNavigation({
        chipSet,
        ltrKey: 'ArrowRight',
        rtlKey: 'ArrowLeft',
        current: first,
        next: second,
      });
    });

    it('should navigate backward on horizontal keys', async () => {
      const first = new TestAssistChip();
      const second = new TestAssistChip();
      const third = new TestAssistChip();
      const chipSet = await setupTest([first, second, third]);
      await testNavigation({
        chipSet,
        ltrKey: 'ArrowLeft',
        rtlKey: 'ArrowRight',
        current: second,
        next: first,
      });
    });

    it('should navigate to the first chip on Home', async () => {
      const first = new TestAssistChip();
      const second = new TestAssistChip();
      const third = new TestAssistChip();
      const chipSet = await setupTest([first, second, third]);
      await testNavigation({
        chipSet,
        ltrKey: 'Home',
        rtlKey: 'Home',
        current: second,
        next: first,
      });
    });

    it('should navigate to the last chip on End', async () => {
      const first = new TestAssistChip();
      const second = new TestAssistChip();
      const third = new TestAssistChip();
      const chipSet = await setupTest([first, second, third]);
      await testNavigation({
        chipSet,
        ltrKey: 'End',
        rtlKey: 'End',
        current: second,
        next: third,
      });
    });

    it('should navigate to first chip on forward when none focused', async () => {
      const first = new TestAssistChip();
      const second = new TestAssistChip();
      const third = new TestAssistChip();
      const chipSet = await setupTest([first, second, third]);
      await testNavigation({
        chipSet,
        ltrKey: 'ArrowRight',
        rtlKey: 'ArrowLeft',
        current: null,
        next: first,
      });
    });

    it('should navigate to last chip on backward when none focused', async () => {
      const first = new TestAssistChip();
      const second = new TestAssistChip();
      const third = new TestAssistChip();
      const chipSet = await setupTest([first, second, third]);
      await testNavigation({
        chipSet,
        ltrKey: 'ArrowLeft',
        rtlKey: 'ArrowRight',
        current: null,
        next: third,
      });
    });

    it('should skip over disabled chips', async () => {
      const first = new TestAssistChip();
      const second = new TestAssistChip();
      second.disabled = true;
      const third = new TestAssistChip();
      const chipSet = await setupTest([first, second, third]);
      await testNavigation({
        chipSet,
        ltrKey: 'ArrowRight',
        rtlKey: 'ArrowLeft',
        current: first,
        next: third,
      });
    });

    it('should NOT skip over disabled always focusable chips', async () => {
      const first = new TestAssistChip();
      const second = new TestAssistChip();
      second.disabled = true;
      second.alwaysFocusable = true;
      const third = new TestAssistChip();
      const chipSet = await setupTest([first, second, third]);
      await testNavigation({
        chipSet,
        ltrKey: 'ArrowRight',
        rtlKey: 'ArrowLeft',
        current: first,
        next: second,
      });
    });

    it('should focus trailing actions when navigating backwards', async () => {
      const first = new TestInputChip();
      const second = new TestInputChip();
      const third = new TestInputChip();
      await setupTest([first, second, third]);

      const harness = new ChipHarness(second);
      // Don't use harness focusing since we need to test real focus states
      second.focus();
      await harness.keypress('ArrowLeft');
      const {trailingAction} = first as unknown as {
        trailingAction: HTMLElement;
      };
      expect(trailingAction.matches(':focus-within'))
        .withContext('trailing action of first chip is focused')
        .toBeTrue();
    });

    it('should ignore other keyboard events', async () => {
      const first = new TestAssistChip();
      const second = new TestAssistChip();
      const third = new TestAssistChip();
      await setupTest([first, second, third]);

      const harness = new ChipHarness(first);
      // Don't use harness focusing since we need to test real focus states
      first.focus();
      await harness.keypress('Enter');
      expect(first.matches(':focus-within'))
        .withContext('first chip is still focused')
        .toBeTrue();
    });

    it('should do nothing if there are not at least two chips', async () => {
      const single = new TestAssistChip();
      await setupTest([single]);

      const harness = new ChipHarness(single);
      // Don't use harness focusing since we need to test real focus states
      single.focus();
      await harness.keypress('ArrowRight');
      expect(single.matches(':focus-within'))
        .withContext('single chip is still focused')
        .toBeTrue();
    });
  });
});
