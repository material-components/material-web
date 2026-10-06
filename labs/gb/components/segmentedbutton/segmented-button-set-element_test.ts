/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './md-gb-segmented-button.js';
import './md-gb-segmented-button-set.js';

import {html} from 'lit';

import {Environment} from '../../../../testing/environment.js';
import {Harness} from '../../../../testing/harness.js';
import {internals} from '../../../behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';

import {type SegmentedButtonSelection} from './segmented-button.js';
import {
  SegmentedButtonElement,
  segmentGroupDisabled,
  segmentOwner,
  segmentPosInSet,
  segmentSelected,
  segmentSelectionMode,
  segmentSetSize,
} from './segmented-button-element.js';
import {SegmentedButtonSetElement} from './segmented-button-set-element.js';

function parsePx(value: string): number {
  return Number(value.replace(/px$/, ''));
}

class SegmentHarness extends Harness<SegmentedButtonElement> {
  override async getInteractiveElement(): Promise<HTMLElement> {
    await this.element.updateComplete;
    return this.element.shadowRoot!.querySelector(
      '[part="segmented-btn"]',
    ) as HTMLElement;
  }
}

describe('SegmentedButtonSetElement', () => {
  const env = new Environment();

  beforeAll(() => {
    const noTransitions = new CSSStyleSheet();
    noTransitions.replaceSync(`
      md-gb-segmented-button-set,
      md-gb-segmented-button,
      md-gb-segmented-button::part(segmented-btn) {
        transition: none !important;
      }
    `);
    adoptStyles(document, [m3Styles, noTransitions]);
  });

  it('is registered', () => {
    const el = document.createElement('md-gb-segmented-button-set');
    expect(el).toBeInstanceOf(SegmentedButtonSetElement);
    expect(customElements.get('md-gb-segmented-button-set')).toBeDefined();
  });

  it('segmentSelected hook is symbol-keyed and not exposed on the public API', () => {
    const set = document.createElement(
      'md-gb-segmented-button-set',
    ) as unknown as Record<string | symbol, unknown>;
    expect(set['segmentSelected']).toBeUndefined();
    expect(typeof set[segmentSelected]).toBe('function');
  });

  it('has expected defaults', async () => {
    const root = env.render(
      html`<md-gb-segmented-button-set></md-gb-segmented-button-set>`,
    );
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;

    expect(set.selection).toBe('single');
    expect(set.density).toBe(0);
    expect(set.disabled).toBeFalse();
    expect(set.segments).toEqual([]);
    expect(set.selectedSegments).toEqual([]);
    expect(set.selectedIndex).toBe(-1);
    expect(set.selectedIndices).toEqual([]);
    expect(set.value).toBe('');
    expect(set.values).toEqual([]);
  });

  it('setting --outline-color on set changes segment computed border color', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set style="--outline-color: rgb(255, 0, 0);">
        <md-gb-segmented-button>Item</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const segment = root.querySelector(
      'md-gb-segmented-button',
    ) as SegmentedButtonElement;
    const button = segment.shadowRoot!.querySelector('button')!;
    expect(getComputedStyle(button).borderColor).toBe('rgb(255, 0, 0)');
  });

  it('sets host class and mirrors density', async () => {
    const root = env.render(
      html`<md-gb-segmented-button-set
        density="-1"></md-gb-segmented-button-set>`,
    );
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;

    expect(set.classList.contains('segmented-btn-set')).toBeTrue();
    expect(set.classList.contains('segmented-btn-set-dense-1')).toBeTrue();

    set.density = -2;
    await set.updateComplete;
    expect(set.classList.contains('segmented-btn-set-dense-2')).toBeTrue();
    expect(set.classList.contains('segmented-btn-set-dense-1')).toBeFalse();

    set.density = -3;
    await set.updateComplete;
    expect(set.classList.contains('segmented-btn-set-dense-3')).toBeTrue();

    set.disabled = true;
    await set.updateComplete;
    expect(set.classList.contains('disabled')).toBeTrue();
  });

  it('synchronizes child segment properties', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="day">Day</md-gb-segmented-button>
        <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
        <md-gb-segmented-button value="month">Month</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const segments = set.segments;

    expect(segments.length).toBe(3);
    for (let i = 0; i < 3; i++) {
      expect(segments[i][segmentOwner]).toBe(set);
      expect(segments[i][segmentSelectionMode]).toBe('single');
      expect(segments[i][segmentGroupDisabled]).toBeFalse();
      expect(segments[i][segmentPosInSet]).toBe(i + 1);
      expect(segments[i][segmentSetSize]).toBe(3);
    }
  });

  it('exposes position only on visible radios and updates on hidden toggle', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="a">A</md-gb-segmented-button>
        <md-gb-segmented-button value="b" hidden>B</md-gb-segmented-button>
        <md-gb-segmented-button value="c">C</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const inner = (s: Element) => s.shadowRoot!.querySelector('button')!;
    const [a, b, c] = set.segments;
    expect(inner(c).getAttribute('aria-posinset')).toBe('2');
    expect(inner(c).getAttribute('aria-setsize')).toBe('2');

    b.removeAttribute('hidden');
    await env.waitForStability();
    expect(inner(c).getAttribute('aria-posinset')).toBe('3');
    expect(inner(c).getAttribute('aria-setsize')).toBe('3');

    set.selection = 'multiple';
    await env.waitForStability();
    expect(inner(a).hasAttribute('aria-posinset')).toBeFalse();
    expect(inner(a).hasAttribute('aria-setsize')).toBeFalse();
  });

  it('defaults to single mode (radiogroup with exclusivity) when selection is none, unknown, or removed', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set
        selection=${'none' as unknown as SegmentedButtonSelection}>
        <md-gb-segmented-button value="a" selected>A</md-gb-segmented-button>
        <md-gb-segmented-button value="b" selected>B</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    expect(set.selectedSegments.length).toBe(1);
    expect(set.value).toBe('b');

    // Test with typo
    set.selection = 'invalid-mode' as unknown as SegmentedButtonSelection;
    await env.waitForStability();
    set.segments[0].selected = true;
    set.segments[1].selected = true;
    expect(set.selectedSegments.length).toBe(1);

    // Test with attribute removed
    set.removeAttribute('selection');
    await env.waitForStability();
    set.segments[0].selected = true;
    set.segments[1].selected = true;
    expect(set.selectedSegments.length).toBe(1);
  });

  it('single mode: enforces at most one selected segment, preferring the last one on init', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="day" selected
          >Day</md-gb-segmented-button
        >
        <md-gb-segmented-button value="week" selected
          >Week</md-gb-segmented-button
        >
        <md-gb-segmented-button value="month">Month</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [day, week, month] = set.segments;

    expect(day.selected).toBeFalse();
    expect(week.selected).toBeTrue();
    expect(month.selected).toBeFalse();
    expect(set.selectedIndex).toBe(1);
    expect(set.value).toBe('week');
  });

  it('single mode: selecting a segment synchronously unselects others', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="day" selected
          >Day</md-gb-segmented-button
        >
        <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
        <md-gb-segmented-button value="month">Month</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [day, week, month] = set.segments;

    expect(day.selected).toBeTrue();
    month.selected = true;

    expect(day.selected).toBeFalse();
    expect(week.selected).toBeFalse();
    expect(month.selected).toBeTrue();
    expect(set.selectedIndex).toBe(2);
    expect(set.value).toBe('month');
  });

  it('segment selected setter updates selectedIndex and value and can clear the selection', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="day">Day</md-gb-segmented-button>
        <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [day, week] = set.segments;

    week.selected = true;
    expect(day.selected).toBeFalse();
    expect(week.selected).toBeTrue();
    expect(set.selectedIndex).toBe(1);
    expect(set.value).toBe('week');

    week.selected = false;
    expect(day.selected).toBeFalse();
    expect(week.selected).toBeFalse();
    expect(set.selectedIndex).toBe(-1);
    expect(set.value).toBe('');
  });

  it('applies a value bound before the first render', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set .value=${'week'}>
        <md-gb-segmented-button value="day">Day</md-gb-segmented-button>
        <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    expect(set.value).toBe('week');
    expect(set.segments[1].selected).toBeTrue();
    expect(set.segments[0].selected).toBeFalse();
  });

  it('value setter updates selection in single mode', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="day">Day</md-gb-segmented-button>
        <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [day, week] = set.segments;

    set.value = 'day';
    expect(day.selected).toBeTrue();
    expect(week.selected).toBeFalse();
    expect(set.selectedIndex).toBe(0);

    set.value = 'nonexistent';
    expect(day.selected).toBeFalse();
    expect(week.selected).toBeFalse();
    expect(set.selectedIndex).toBe(-1);
  });

  it('value setter in multiple mode does nothing', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set selection="multiple">
        <md-gb-segmented-button value="b">Bold</md-gb-segmented-button>
        <md-gb-segmented-button value="i">Italic</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;

    set.value = 'b';
    expect(set.segments[0].selected).toBeFalse();
    expect(set.value).toBe('');
    expect(set.values).toEqual([]);
  });

  it('multiple mode: allows multiple selected segments', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set selection="multiple">
        <md-gb-segmented-button value="b" selected>Bold</md-gb-segmented-button>
        <md-gb-segmented-button value="i">Italic</md-gb-segmented-button>
        <md-gb-segmented-button value="u" selected
          >Underline</md-gb-segmented-button
        >
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [b, i, u] = set.segments;

    expect(b.selected).toBeTrue();
    expect(i.selected).toBeFalse();
    expect(u.selected).toBeTrue();
    expect(set.selectedIndices).toEqual([0, 2]);
    expect(set.values).toEqual(['b', 'u']);

    b.selected = false;
    i.selected = true;
    expect(b.selected).toBeFalse();
    expect(i.selected).toBeTrue();
    expect(u.selected).toBeTrue();
    expect(set.values).toEqual(['i', 'u']);
  });

  it('multiple mode: child buttons have role="checkbox"', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set selection="multiple">
        <md-gb-segmented-button>Item</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const button = set.segments[0].shadowRoot!.querySelector('button')!;

    expect(button.getAttribute('role')).toBe('checkbox');
  });

  it('disables child segments when set is disabled', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set disabled>
        <md-gb-segmented-button>Item 1</md-gb-segmented-button>
        <md-gb-segmented-button>Item 2</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;

    for (const segment of set.segments) {
      const button = segment.shadowRoot!.querySelector('button')!;
      expect(button.disabled).toBeTrue();
    }
  });

  it('aria-disabled attribute on element set does not style or disable child segments', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set aria-disabled="true">
        <md-gb-segmented-button value="item">Item</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const segment = set.segments[0];
    const button = segment.shadowRoot!.querySelector('button')!;
    expect(button.disabled).toBeFalse();
    expect(getComputedStyle(button).pointerEvents).toBe('auto');
  });

  it('click event handling: single mode clicks select segment and dispatch set-level input and change', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="day">Day</md-gb-segmented-button>
        <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [day, week] = set.segments;

    let inputCount = 0;
    let changeCount = 0;
    set.addEventListener('input', () => inputCount++);
    set.addEventListener('change', () => changeCount++);

    const harness = new SegmentHarness(day);
    await harness.clickWithMouse();

    expect(day.selected).toBeTrue();
    expect(set.value).toBe('day');
    expect(inputCount).toBe(1);
    expect(changeCount).toBe(1);

    // Clicking already selected segment in single mode does nothing
    await harness.clickWithMouse();
    expect(day.selected).toBeTrue();
    expect(inputCount).toBe(1);
    expect(changeCount).toBe(1);

    // Clicking another segment selects it and unselects first
    const weekHarness = new SegmentHarness(week);
    await weekHarness.clickWithMouse();
    expect(day.selected).toBeFalse();
    expect(week.selected).toBeTrue();
    expect(set.value).toBe('week');
    expect(inputCount).toBe(2);
    expect(changeCount).toBe(2);
  });

  it('click event handling: child input and change do not leak past the set', async () => {
    let parentInputCount = 0;
    let parentChangeCount = 0;
    const root = env.render(html`
      <div
        @input=${() => parentInputCount++}
        @change=${() => parentChangeCount++}>
        <md-gb-segmented-button-set>
          <md-gb-segmented-button value="day">Day</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      </div>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const day = set.segments[0];

    const harness = new SegmentHarness(day);
    await harness.clickWithMouse();

    // The set emits one input and one change, so parent receives exactly 1
    // each (not 2 from child + set)
    expect(parentInputCount).toBe(1);
    expect(parentChangeCount).toBe(1);
  });

  it('set input observes the committed selection', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="day" selected
          >Day</md-gb-segmented-button
        >
        <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [day, week] = set.segments;
    let valueOnInput = '';
    let daySelectedOnInput = true;
    let segmentInputs = 0;
    let segmentChanges = 0;
    week.addEventListener('input', () => segmentInputs++);
    week.addEventListener('change', () => segmentChanges++);
    set.addEventListener('input', () => {
      valueOnInput = set.value;
      daySelectedOnInput = day.selected;
    });

    await new SegmentHarness(week).clickWithMouse();

    expect(valueOnInput).toBe('week');
    expect(daySelectedOnInput).toBeFalse();
    expect(segmentInputs).toBe(1);
    expect(segmentChanges).toBe(1);
  });

  it('re-asserts rendered state when change listener rejects the switch', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="day" selected
          >Day</md-gb-segmented-button
        >
        <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [day, week] = set.segments;
    set.addEventListener('change', () => {
      set.value = 'day';
    });

    await new SegmentHarness(week).clickWithMouse();
    await env.waitForStability();

    const innerDay = day.shadowRoot!.querySelector('button')!;
    const innerWeek = week.shadowRoot!.querySelector('button')!;
    expect(day.selected).toBeTrue();
    expect(week.selected).toBeFalse();
    expect(innerDay.getAttribute('aria-checked')).toBe('true');
    expect(innerDay.classList.contains('segmented-btn-selected')).toBeTrue();
    expect(innerWeek.getAttribute('aria-checked')).toBe('false');
    expect(innerWeek.classList.contains('segmented-btn-selected')).toBeFalse();
  });

  it('multiple mode clicks toggle segment and dispatch set-level events', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set selection="multiple">
        <md-gb-segmented-button value="b">Bold</md-gb-segmented-button>
        <md-gb-segmented-button value="i">Italic</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [b, i] = set.segments;

    let inputCount = 0;
    let changeCount = 0;
    set.addEventListener('input', () => inputCount++);
    set.addEventListener('change', () => changeCount++);

    const bHarness = new SegmentHarness(b);
    await bHarness.clickWithMouse();
    expect(b.selected).toBeTrue();
    expect(set.values).toEqual(['b']);
    expect(inputCount).toBe(1);
    expect(changeCount).toBe(1);

    const iHarness = new SegmentHarness(i);
    await iHarness.clickWithMouse();
    expect(b.selected).toBeTrue();
    expect(i.selected).toBeTrue();
    expect(set.values).toEqual(['b', 'i']);
    expect(inputCount).toBe(2);
    expect(changeCount).toBe(2);

    // Clicking b again deselects it
    await bHarness.clickWithMouse();
    expect(b.selected).toBeFalse();
    expect(i.selected).toBeTrue();
    expect(set.values).toEqual(['i']);
    expect(inputCount).toBe(3);
    expect(changeCount).toBe(3);
  });

  it('Space and Enter each activate a multi-select segment once', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set selection="multiple">
        <md-gb-segmented-button value="b">Bold</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [bold] = set.segments;
    let inputs = 0;
    let changes = 0;
    set.addEventListener('input', () => inputs++);
    set.addEventListener('change', () => changes++);
    const harness = new SegmentHarness(bold);

    await harness.startClickWithKeyboard({key: ' '});
    expect(bold.selected).toBeTrue();
    expect([inputs, changes]).toEqual([1, 1]);

    await harness.startClickWithKeyboard({key: 'Enter'});
    expect(bold.selected).toBeFalse();
    expect([inputs, changes]).toEqual([2, 2]);
  });

  it('removing a selected segment leaves none selected and does not fire events', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button id="s1" selected>S1</md-gb-segmented-button>
        <md-gb-segmented-button id="s2">S2</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const s1 = root.querySelector('#s1') as SegmentedButtonElement;
    const s2 = root.querySelector('#s2') as SegmentedButtonElement;

    let inputFired = false;
    let changeFired = false;
    set.addEventListener('input', () => (inputFired = true));
    set.addEventListener('change', () => (changeFired = true));

    s1.remove();
    await env.waitForStability();

    expect(set.segments.length).toBe(1);
    expect(s2.selected).toBeFalse();
    expect(set.selectedIndex).toBe(-1);
    expect(inputFired).toBeFalse();
    expect(changeFired).toBeFalse();
  });

  it('resets state on removed segments and ignores selection calls from removed segments', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set disabled>
        <md-gb-segmented-button id="r1" value="r1" selected
          >R1</md-gb-segmented-button
        >
        <md-gb-segmented-button id="r2" value="r2">R2</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const r1 = root.querySelector('#r1') as SegmentedButtonElement;
    const r2 = root.querySelector('#r2') as SegmentedButtonElement;

    expect(r1[segmentGroupDisabled]).toBeTrue();
    expect(r1[segmentOwner]).toBe(set);

    r1.remove();
    await env.waitForStability();

    // Removed segment is cleaned up
    expect(r1[segmentOwner]).toBeNull();
    expect(r1[segmentGroupDisabled]).toBeFalse();
    expect(r1[segmentPosInSet]).toBe(0);
    expect(r1[segmentSetSize]).toBe(0);
    const innerR1 = r1.shadowRoot!.querySelector('button')!;
    expect(innerR1.hasAttribute('aria-posinset')).toBeFalse();
    expect(innerR1.hasAttribute('aria-setsize')).toBeFalse();

    // Selecting removed segment does not change the old set
    set.disabled = false;
    await env.waitForStability();
    r2.selected = true;
    expect(set.value).toBe('r2');
    r1.selected = true;
    expect(set.value).toBe('r2');
    expect(r2.selected).toBeTrue();
  });

  it('deselects selected segment when segment or set becomes disabled, and stays unselected when enabled again', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button id="s1" value="s1" selected
          >S1</md-gb-segmented-button
        >
        <md-gb-segmented-button id="s2" value="s2">S2</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const s1 = root.querySelector('#s1') as SegmentedButtonElement;
    const s2 = root.querySelector('#s2') as SegmentedButtonElement;

    expect(s1.selected).toBeTrue();
    expect(s2.selected).toBeFalse();
    expect(set.value).toBe('s1');
    expect(set.selectedSegments).toEqual([s1]);

    // Disabling the segment deselects it
    s1.disabled = true;
    await env.waitForStability();
    expect(s1.selected).toBeFalse();
    expect(set.value).toBe('');
    expect(set.selectedSegments).toEqual([]);

    // Re-enabling does not automatically re-select
    s1.disabled = false;
    await env.waitForStability();
    expect(s1.selected).toBeFalse();
    expect(set.value).toBe('');

    // Re-select s1, then disable the entire set
    s1.selected = true;
    await env.waitForStability();
    expect(s1.selected).toBeTrue();
    expect(set.value).toBe('s1');

    set.disabled = true;
    await env.waitForStability();
    expect(s1.selected).toBeFalse();
    expect(set.value).toBe('');
    expect(set.selectedSegments).toEqual([]);

    // Re-enabling the set does not automatically re-select
    set.disabled = false;
    await env.waitForStability();
    expect(s1.selected).toBeFalse();
    expect(set.value).toBe('');
  });

  it('selecting a removed segment synchronously does not deselect set segments or mutate set value', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="a" selected>A</md-gb-segmented-button>
        <md-gb-segmented-button value="b">B</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const [a, b] = set.segments;

    b.remove();
    b.selected = true;

    expect(a.selected).toBeTrue();
    expect(b.selected).toBeTrue();
    expect(set.value).toBe('a');
  });

  it('moving a segment between sets updates owner and mode to setB and leaves setA unaffected', async () => {
    const root = env.render(html`
      <div>
        <md-gb-segmented-button-set id="set-a">
          <md-gb-segmented-button value="a" selected>A</md-gb-segmented-button>
          <md-gb-segmented-button value="b" id="seg-b"
            >B</md-gb-segmented-button
          >
        </md-gb-segmented-button-set>
        <md-gb-segmented-button-set id="set-b" selection="multiple">
          <md-gb-segmented-button value="c" selected>C</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      </div>
    `);
    await env.waitForStability();
    const setA = root.querySelector('#set-a') as SegmentedButtonSetElement;
    const setB = root.querySelector('#set-b') as SegmentedButtonSetElement;
    const segB = root.querySelector('#seg-b') as SegmentedButtonElement;

    // Signal setB's slot first in the same task so setB's slotchange runs first.
    setB.append(document.createElement('md-gb-segmented-button'));
    setB.appendChild(segB);
    await env.waitForStability();

    expect(segB[segmentOwner]).toBe(setB);
    expect(segB[segmentSelectionMode]).toBe('multiple');
    expect(setA.segments.length).toBe(1);
    expect(setA.value).toBe('a');
    expect(setB.segments.length).toBe(3);
  });

  it('inserting a pre-selected C before a selected A normalizes value to c', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="a" selected>A</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const a = set.segments[0];

    const c = document.createElement('md-gb-segmented-button');
    c.value = 'c';
    c.selected = true;
    set.insertBefore(c, a);
    await env.waitForStability();

    expect(set.value).toBe('c');
    expect(c.selected).toBeTrue();
    expect(a.selected).toBeFalse();
  });

  it('removing and re-appending the set then toggling hidden updates positions and click relays once', async () => {
    const root = env.render(html`
      <div id="container">
        <md-gb-segmented-button-set>
          <md-gb-segmented-button value="a">A</md-gb-segmented-button>
          <md-gb-segmented-button value="b" id="seg-b"
            >B</md-gb-segmented-button
          >
          <md-gb-segmented-button value="c">C</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      </div>
    `);
    await env.waitForStability();
    const container = root.querySelector('#container') as HTMLElement;
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const segB = root.querySelector('#seg-b') as SegmentedButtonElement;

    set.remove();
    container.appendChild(set);
    await env.waitForStability();

    segB.hidden = true;
    await env.waitForStability();

    const [a, , c] = set.segments;
    expect(a[segmentPosInSet]).toBe(1);
    expect(a[segmentSetSize]).toBe(2);
    expect(c[segmentPosInSet]).toBe(2);
    expect(c[segmentSetSize]).toBe(2);

    let inputCount = 0;
    let changeCount = 0;
    set.addEventListener('input', () => inputCount++);
    set.addEventListener('change', () => changeCount++);

    await new SegmentHarness(c).clickWithMouse();

    expect(inputCount).toBe(1);
    expect(changeCount).toBe(1);
    expect(c.selected).toBeTrue();
  });

  it('reordering segments inside a set updates positions', async () => {
    const root = env.render(html`
      <md-gb-segmented-button-set>
        <md-gb-segmented-button value="a" id="seg-a">A</md-gb-segmented-button>
        <md-gb-segmented-button value="b" id="seg-b">B</md-gb-segmented-button>
      </md-gb-segmented-button-set>
    `);
    await env.waitForStability();
    const set = root.querySelector(
      'md-gb-segmented-button-set',
    ) as SegmentedButtonSetElement;
    const segA = root.querySelector('#seg-a') as SegmentedButtonElement;
    const segB = root.querySelector('#seg-b') as SegmentedButtonElement;

    expect(segA[segmentPosInSet]).toBe(1);
    expect(segB[segmentPosInSet]).toBe(2);

    set.insertBefore(segB, segA);
    await env.waitForStability();

    expect(segB[segmentPosInSet]).toBe(1);
    expect(segA[segmentPosInSet]).toBe(2);
  });

  describe('element-mode styles', () => {
    it('applies grid layout to host', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button>1</md-gb-segmented-button>
          <md-gb-segmented-button>2</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const set = root.querySelector(
        'md-gb-segmented-button-set',
      ) as SegmentedButtonSetElement;

      const style = getComputedStyle(set);
      expect(['grid', 'inline-grid']).toContain(style.display);
      expect(style.gridAutoFlow).toBe('column');
    });

    it('first and last children receive container-shape border radii on inner button', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button id="first">1</md-gb-segmented-button>
          <md-gb-segmented-button id="middle">2</md-gb-segmented-button>
          <md-gb-segmented-button id="last">3</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const first = root.querySelector('#first') as SegmentedButtonElement;
      const middle = root.querySelector('#middle') as SegmentedButtonElement;
      const last = root.querySelector('#last') as SegmentedButtonElement;

      const firstBtn = first.shadowRoot!.querySelector('button')!;
      const middleBtn = middle.shadowRoot!.querySelector('button')!;
      const lastBtn = last.shadowRoot!.querySelector('button')!;

      const firstStyle = getComputedStyle(firstBtn);
      const middleStyle = getComputedStyle(middleBtn);
      const lastStyle = getComputedStyle(lastBtn);

      expect(parsePx(firstStyle.borderStartStartRadius)).toBeGreaterThan(0);
      expect(parsePx(firstStyle.borderEndStartRadius)).toBeGreaterThan(0);
      expect(parsePx(firstStyle.borderStartEndRadius)).toBe(0);
      expect(parsePx(firstStyle.borderEndEndRadius)).toBe(0);

      expect(parsePx(middleStyle.borderStartStartRadius)).toBe(0);
      expect(parsePx(middleStyle.borderEndStartRadius)).toBe(0);
      expect(parsePx(middleStyle.borderStartEndRadius)).toBe(0);
      expect(parsePx(middleStyle.borderEndEndRadius)).toBe(0);

      expect(parsePx(lastStyle.borderStartStartRadius)).toBe(0);
      expect(parsePx(lastStyle.borderEndStartRadius)).toBe(0);
      expect(parsePx(lastStyle.borderStartEndRadius)).toBeGreaterThan(0);
      expect(parsePx(lastStyle.borderEndEndRadius)).toBeGreaterThan(0);
    });

    it('divider is dropped on non-last segments', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button id="first">1</md-gb-segmented-button>
          <md-gb-segmented-button id="last">2</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const first = root.querySelector('#first') as SegmentedButtonElement;
      const last = root.querySelector('#last') as SegmentedButtonElement;

      const firstBtn = first.shadowRoot!.querySelector('button')!;
      const lastBtn = last.shadowRoot!.querySelector('button')!;

      expect(getComputedStyle(firstBtn).borderInlineEndWidth).toBe('0px');
      expect(getComputedStyle(lastBtn).borderInlineEndWidth).toBe('1px');
    });

    it('skips hidden children when computing radii and divider dropping', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button id="hidden-first" hidden
            >0</md-gb-segmented-button
          >
          <md-gb-segmented-button id="first">1</md-gb-segmented-button>
          <md-gb-segmented-button id="last">2</md-gb-segmented-button>
          <md-gb-segmented-button id="hidden-last" hidden
            >3</md-gb-segmented-button
          >
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const first = root.querySelector('#first') as SegmentedButtonElement;
      const last = root.querySelector('#last') as SegmentedButtonElement;

      const firstBtn = first.shadowRoot!.querySelector('button')!;
      const lastBtn = last.shadowRoot!.querySelector('button')!;

      const firstStyle = getComputedStyle(firstBtn);
      const lastStyle = getComputedStyle(lastBtn);

      expect(parsePx(firstStyle.borderStartStartRadius)).toBeGreaterThan(0);
      expect(parsePx(firstStyle.borderEndStartRadius)).toBeGreaterThan(0);
      expect(firstStyle.borderInlineEndWidth).toBe('0px');

      expect(parsePx(lastStyle.borderStartEndRadius)).toBeGreaterThan(0);
      expect(parsePx(lastStyle.borderEndEndRadius)).toBeGreaterThan(0);
      expect(lastStyle.borderInlineEndWidth).toBe('1px');
    });

    it('elementFromPoint 4px above the visual top of a dense (-3) segment returns that segment', async () => {
      const root = env.render(html`
        <div style="padding: 30px;">
          <md-gb-segmented-button-set density="-3">
            <md-gb-segmented-button id="dense-seg"
              >Touch</md-gb-segmented-button
            >
          </md-gb-segmented-button-set>
        </div>
      `);
      await env.waitForStability();
      const seg = root.querySelector('#dense-seg') as SegmentedButtonElement;
      const button = seg.shadowRoot!.querySelector('button')!;
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;

      const abovePoint = document.elementFromPoint(centerX, rect.top - 4);
      expect(abovePoint).toBe(seg);
    });
  });

  describe('internals role and accessible attributes', () => {
    it('set internals role follows selection property', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button value="1">1</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const set = root.querySelector(
        'md-gb-segmented-button-set',
      ) as SegmentedButtonSetElement;

      expect(set[internals].role).toBe('radiogroup');

      set.selection = 'multiple';
      await env.waitForStability();
      expect(set[internals].role).toBe('group');

      set.selection = 'single';
      await env.waitForStability();
      expect(set[internals].role).toBe('radiogroup');
    });

    it('exposes aria-disabled on internals when set.disabled is true', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button value="1">1</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const set = root.querySelector(
        'md-gb-segmented-button-set',
      ) as SegmentedButtonSetElement;

      expect(set[internals].ariaDisabled).toBeNull();

      set.disabled = true;
      await env.waitForStability();
      expect(set[internals].ariaDisabled).toBe('true');

      set.disabled = false;
      await env.waitForStability();
      expect(set[internals].ariaDisabled).toBeNull();
    });

    it('setters and owner hook fire no events', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button value="a">A</md-gb-segmented-button>
          <md-gb-segmented-button value="b">B</md-gb-segmented-button>
          <md-gb-segmented-button value="c">C</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const set = root.querySelector(
        'md-gb-segmented-button-set',
      ) as SegmentedButtonSetElement;
      let events = 0;
      set.addEventListener('input', () => events++);
      set.addEventListener('change', () => events++);

      set.value = 'a';
      set[segmentSelected](set.segments[1]);

      expect(events).toBe(0);
    });

    it('clicking a disabled segment inside a set does nothing', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button value="a" selected>A</md-gb-segmented-button>
          <md-gb-segmented-button value="b" disabled>B</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const set = root.querySelector(
        'md-gb-segmented-button-set',
      ) as SegmentedButtonSetElement;
      const [a, b] = set.segments;
      let events = 0;
      set.addEventListener('input', () => events++);
      set.addEventListener('change', () => events++);

      await new SegmentHarness(b).clickWithMouse();

      expect(events).toBe(0);
      expect(a.selected).toBeTrue();
      expect(b.selected).toBeFalse();
    });

    it('setting set.disabled inside a set input listener still contains and redispatches change', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button value="day">Day</md-gb-segmented-button>
          <md-gb-segmented-button value="week">Week</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const set = root.querySelector(
        'md-gb-segmented-button-set',
      ) as SegmentedButtonSetElement;
      const [, week] = set.segments;

      const changeTargets: EventTarget[] = [];
      set.addEventListener('input', () => {
        set.disabled = true;
      });
      set.addEventListener('change', (e) => {
        changeTargets.push(e.target!);
      });

      const harness = new SegmentHarness(week);
      await harness.clickWithMouse();

      expect(changeTargets.length).toBe(1);
      expect(changeTargets[0]).toBe(set);
    });

    it('toggling set.disabled at runtime enables/disables child segments', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button value="a">A</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const set = root.querySelector(
        'md-gb-segmented-button-set',
      ) as SegmentedButtonSetElement;
      const segment = set.segments[0];
      const inner = segment.shadowRoot!.querySelector('button')!;

      expect(segment[segmentGroupDisabled]).toBeFalse();
      expect(inner.disabled).toBeFalse();

      set.disabled = true;
      await env.waitForStability();
      expect(segment[segmentGroupDisabled]).toBeTrue();
      expect(inner.disabled).toBeTrue();

      set.disabled = false;
      await env.waitForStability();
      expect(segment[segmentGroupDisabled]).toBeFalse();
      expect(inner.disabled).toBeFalse();
    });

    it('switching from multiple to single normalizes to at most one selection', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set selection="multiple">
          <md-gb-segmented-button value="a" selected>A</md-gb-segmented-button>
          <md-gb-segmented-button value="b" selected>B</md-gb-segmented-button>
          <md-gb-segmented-button value="c" selected>C</md-gb-segmented-button>
        </md-gb-segmented-button-set>
      `);
      await env.waitForStability();
      const set = root.querySelector(
        'md-gb-segmented-button-set',
      ) as SegmentedButtonSetElement;

      expect(set.selectedSegments.length).toBe(3);

      set.selection = 'single';
      await env.waitForStability();

      expect(set.selectedSegments.length).toBe(1);
      expect(set.value).toBe('c');
    });

    it('listeners added to set before upgrade receive exactly 1 input and 1 change with target === set', async () => {
      const doc = document.implementation.createHTMLDocument('');
      const set = doc.createElement(
        'md-gb-segmented-button-set',
      ) as SegmentedButtonSetElement;
      set.innerHTML = `
        <md-gb-segmented-button value="a" id="btn-a">A</md-gb-segmented-button>
        <md-gb-segmented-button value="b" id="btn-b">B</md-gb-segmented-button>
      `;
      const inputs: Event[] = [];
      const changes: Event[] = [];
      set.addEventListener('input', (e) => inputs.push(e));
      set.addEventListener('change', (e) => changes.push(e));

      const root = env.render(html`<div></div>`);
      await env.waitForStability();
      root.appendChild(set);
      await env.waitForStability();

      const segA = set.querySelector('#btn-a') as SegmentedButtonElement;
      await new SegmentHarness(segA).clickWithMouse();

      expect(inputs.length).toBe(1);
      expect(changes.length).toBe(1);
      expect(inputs[0].target).toBe(set);
      expect(changes[0].target).toBe(set);
    });

    it('disabled segment following enabled segment keeps solid outline on shared divider in custom elements', async () => {
      const root = env.render(html`
        <md-gb-segmented-button-set>
          <md-gb-segmented-button id="s1">1</md-gb-segmented-button>
          <md-gb-segmented-button id="s2" disabled>2</md-gb-segmented-button>
          <md-gb-segmented-button id="s3">3</md-gb-segmented-button>
        </md-gb-segmented-button-set>
        <span
          id="probe-enabled"
          style="color: var(--md-sys-color-outline);"></span>
        <span
          id="probe-disabled"
          style="color: hsl(from var(--md-sys-color-on-surface) h s l / 12%);"></span>
      `);
      await env.waitForStability();
      const s2 = root.querySelector('#s2') as SegmentedButtonElement;
      const b2 = s2.shadowRoot!.querySelector('button')!;
      const probeEnabled = root.querySelector('#probe-enabled') as HTMLElement;
      const probeDisabled = root.querySelector(
        '#probe-disabled',
      ) as HTMLElement;

      expect(getComputedStyle(b2).borderInlineStartColor).toBe(
        getComputedStyle(probeEnabled).color,
      );
      expect(getComputedStyle(b2).borderBlockStartColor).toBe(
        getComputedStyle(probeDisabled).color,
      );
      expect(getComputedStyle(b2).borderBlockEndColor).toBe(
        getComputedStyle(probeDisabled).color,
      );
    });

    it('syncs segments on reconnection without re-registering whenDefined listener', async () => {
      const root = env.render(html`
        <div id="container">
          <md-gb-segmented-button-set id="reconnect-set">
            <md-gb-segmented-button id="r1">One</md-gb-segmented-button>
            <md-gb-segmented-button id="r2">Two</md-gb-segmented-button>
          </md-gb-segmented-button-set>
        </div>
      `);
      await env.waitForStability();
      const set = root.querySelector(
        '#reconnect-set',
      ) as SegmentedButtonSetElement;
      const r1 = root.querySelector('#r1') as SegmentedButtonElement;
      const r2 = root.querySelector('#r2') as SegmentedButtonElement;

      expect(r1[segmentPosInSet]).toBe(1);
      expect(r2[segmentPosInSet]).toBe(2);

      set.remove();
      await env.waitForStability();
      root.querySelector('#container')!.appendChild(set);
      await env.waitForStability();

      expect(r1[segmentPosInSet]).toBe(1);
      expect(r2[segmentPosInSet]).toBe(2);
    });
  });
});
