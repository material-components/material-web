/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement} from 'lit';

import {Environment} from '../../../../testing/environment.js';
import {Harness} from '../../../../testing/harness.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import focusRingStyles from '../focus/focus-ring.cssresult.js';
import rippleStyles from '../ripple/ripple.cssresult.js';
import './md-gb-segmented-button.js';

import {
  normalizeDensity,
  normalizeSegmentSelection,
  renderSegmentedButtonCheckmark,
  SEGMENTED_BUTTON_CHECKMARK_PATH,
  SEGMENTED_BUTTON_CLASSES,
  SEGMENTED_BUTTON_DENSITIES,
  SEGMENTED_BUTTON_SELECTIONS,
  SEGMENTED_BUTTON_SET_CLASSES,
  segmentedButton,
  segmentedButtonClasses,
  segmentedButtonSet,
  segmentedButtonSetClasses,
  setupSegmentedButton,
  setupSegmentedButtonSet,
} from './segmented-button.js';
import segmentedButtonStyles from './segmented-button.cssresult.js';

class TestHarness extends Harness<HTMLElement> {
  override async getInteractiveElement(): Promise<HTMLElement> {
    return this.element;
  }
}

function parsePx(value: string): number {
  return Number(value.replace(/px$/, ''));
}

beforeAll(() => {
  adoptStyles(document, [
    m3Styles,
    focusRingStyles,
    rippleStyles,
    segmentedButtonStyles,
  ]);
});

describe('SegmentedButton tokens', () => {
  const env = new Environment();

  it('set root computes --container-height 40px and --outline-width 1px', async () => {
    const root = env.render(html`<div class="segmented-btn-set"></div>`);
    await env.waitForStability();
    const set = root.querySelector('.segmented-btn-set') as HTMLElement;
    expect(
      getComputedStyle(set).getPropertyValue('--container-height').trim(),
    ).toBe('40px');
    expect(
      getComputedStyle(set).getPropertyValue('--outline-width').trim(),
    ).toBe('1px');
  });

  it('segment root computes --icon-size 18px', async () => {
    const root = env.render(html`<button class="segmented-btn"></button>`);
    await env.waitForStability();
    const btn = root.querySelector('.segmented-btn') as HTMLElement;
    expect(getComputedStyle(btn).getPropertyValue('--icon-size').trim()).toBe(
      '18px',
    );
  });

  it('setting --outline-color on set changes segment computed border color', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set" style="--outline-color: rgb(255, 0, 0);">
        <button class="segmented-btn">Item</button>
      </div>
    `);
    await env.waitForStability();
    const btn = root.querySelector('.segmented-btn') as HTMLElement;
    expect(getComputedStyle(btn).borderColor).toBe('rgb(255, 0, 0)');
  });

  it('density classes set --container-height 36/32/28px', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set segmented-btn-set-dense-1" id="d1"></div>
      <div class="segmented-btn-set segmented-btn-set-dense-2" id="d2"></div>
      <div class="segmented-btn-set segmented-btn-set-dense-3" id="d3"></div>
    `);
    await env.waitForStability();
    const d1 = root.querySelector('#d1') as HTMLElement;
    const d2 = root.querySelector('#d2') as HTMLElement;
    const d3 = root.querySelector('#d3') as HTMLElement;
    expect(
      getComputedStyle(d1).getPropertyValue('--container-height').trim(),
    ).toBe('36px');
    expect(
      getComputedStyle(d2).getPropertyValue('--container-height').trim(),
    ).toBe('32px');
    expect(
      getComputedStyle(d3).getPropertyValue('--container-height').trim(),
    ).toBe('28px');
  });

  it('computes cursor pointer when enabled and default when disabled', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set">
        <button class="segmented-btn" id="enabled-btn">Enabled</button>
        <button class="segmented-btn" id="disabled-btn" disabled>
          Disabled
        </button>
      </div>
    `);
    await env.waitForStability();
    const enabledBtn = root.querySelector('#enabled-btn') as HTMLElement;
    const disabledBtn = root.querySelector('#disabled-btn') as HTMLElement;
    expect(getComputedStyle(enabledBtn).cursor).toBe('pointer');
    expect(getComputedStyle(disabledBtn).cursor).toBe('default');
  });
});

describe('SegmentedButton class API', () => {
  const env = new Environment();

  describe('constants', () => {
    it('defines SEGMENTED_BUTTON_SET_CLASSES', () => {
      expect(SEGMENTED_BUTTON_SET_CLASSES.segmentedBtnSet).toBe(
        'segmented-btn-set',
      );
      expect(SEGMENTED_BUTTON_SET_CLASSES.segmentedBtnSetDense1).toBe(
        'segmented-btn-set-dense-1',
      );
      expect(SEGMENTED_BUTTON_SET_CLASSES.segmentedBtnSetDense2).toBe(
        'segmented-btn-set-dense-2',
      );
      expect(SEGMENTED_BUTTON_SET_CLASSES.segmentedBtnSetDense3).toBe(
        'segmented-btn-set-dense-3',
      );
    });

    it('defines SEGMENTED_BUTTON_CLASSES', () => {
      expect(SEGMENTED_BUTTON_CLASSES.segmentedBtn).toBe('segmented-btn');
      expect(SEGMENTED_BUTTON_CLASSES.segmentedBtnSelected).toBe(
        'segmented-btn-selected',
      );
      expect(SEGMENTED_BUTTON_CLASSES.segmentedBtnWithIcon).toBe(
        'segmented-btn-with-icon',
      );
      expect(SEGMENTED_BUTTON_CLASSES.segmentedBtnIconOnly).toBe(
        'segmented-btn-icon-only',
      );
      expect(SEGMENTED_BUTTON_CLASSES.segmentedBtnGraphic).toBe(
        'segmented-btn-graphic',
      );
      expect(SEGMENTED_BUTTON_CLASSES.segmentedBtnCheckmark).toBe(
        'segmented-btn-checkmark',
      );
      expect(SEGMENTED_BUTTON_CLASSES.segmentedBtnIcon).toBe(
        'segmented-btn-icon',
      );
      expect(SEGMENTED_BUTTON_CLASSES.segmentedBtnLabel).toBe(
        'segmented-btn-label',
      );
    });

    it('defines selections and densities', () => {
      expect(SEGMENTED_BUTTON_SELECTIONS).toEqual({
        single: 'single',
        multiple: 'multiple',
      });
      expect(SEGMENTED_BUTTON_DENSITIES).toEqual([0, -1, -2, -3]);
    });
  });

  describe('normalizeDensity()', () => {
    it('clamps to [-3, 0], rounds, and maps NaN or undefined to 0', () => {
      expect(normalizeDensity(undefined)).toBe(0);
      expect(normalizeDensity(NaN)).toBe(0);
      expect(normalizeDensity(0)).toBe(0);
      expect(normalizeDensity(-1)).toBe(-1);
      expect(normalizeDensity(-2)).toBe(-2);
      expect(normalizeDensity(-3)).toBe(-3);
      expect(normalizeDensity(-0.8)).toBe(-1);
      expect(normalizeDensity(-2.4)).toBe(-2);
      expect(normalizeDensity(-5)).toBe(-3);
      expect(normalizeDensity(2)).toBe(0);
    });
  });

  describe('segmentedButtonSetClasses()', () => {
    it('returns only the base class by default', () => {
      const classes = segmentedButtonSetClasses();
      expect(classes['segmented-btn-set']).toBeTrue();
      expect(classes['segmented-btn-set-dense-1']).toBeFalsy();
      expect(classes['segmented-btn-set-dense-2']).toBeFalsy();
      expect(classes['segmented-btn-set-dense-3']).toBeFalsy();
    });

    it('adds dense-1/2/3 for density -1/-2/-3', () => {
      expect(
        segmentedButtonSetClasses({density: -1})['segmented-btn-set-dense-1'],
      ).toBeTrue();
      expect(
        segmentedButtonSetClasses({density: -2})['segmented-btn-set-dense-2'],
      ).toBeTrue();
      expect(
        segmentedButtonSetClasses({density: -3})['segmented-btn-set-dense-3'],
      ).toBeTrue();
    });

    it('handles disabled state', () => {
      expect(
        segmentedButtonSetClasses({disabled: true})['disabled'],
      ).toBeTrue();
    });
  });

  describe('segmentedButtonClasses()', () => {
    it('includes ripple and focus-ring classes', () => {
      const classes = segmentedButtonClasses();
      expect(classes['segmented-btn']).toBeTrue();
      expect(classes['ripple']).toBeTrue();
      expect(classes['focus-ring-outer']).toBeTrue();
    });

    it('toggles selected / with-icon / icon-only / disabled', () => {
      const classes = segmentedButtonClasses({
        selected: true,
        withIcon: true,
        iconOnly: true,
        disabled: true,
      });
      expect(classes['segmented-btn-selected']).toBeTrue();
      expect(classes['segmented-btn-with-icon']).toBeTrue();
      expect(classes['segmented-btn-icon-only']).toBeTrue();
      expect(classes['disabled']).toBeTrue();
    });
  });

  describe('renderSegmentedButtonCheckmark()', () => {
    it('renders an aria-hidden svg with checkmark class and path', async () => {
      const root = env.render(
        html`<div>${renderSegmentedButtonCheckmark()}</div>`,
      );
      await env.waitForStability();
      const svg = root.querySelector('svg');
      expect(svg).not.toBeNull();
      expect(svg!.classList.contains('segmented-btn-checkmark')).toBeTrue();
      expect(svg!.getAttribute('aria-hidden')).toBe('true');
      expect(svg!.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svg!.getAttribute('preserveAspectRatio')).toBe('xMidYMid slice');
      const path = svg!.querySelector('path');
      expect(path).not.toBeNull();
      expect(path!.getAttribute('d')).toBe(SEGMENTED_BUTTON_CHECKMARK_PATH);
      expect(path!.getAttribute('pathLength')).toBe('1');
    });
  });

  describe('directives', () => {
    it('segmentedButtonSet applies its classes in a Lit render', async () => {
      const root = env.render(
        html`<div class="${segmentedButtonSet({density: -1})}"></div>`,
      );
      await env.waitForStability();
      const el = root.querySelector('.segmented-btn-set');
      expect(el).not.toBeNull();
      expect(el!.classList.contains('segmented-btn-set-dense-1')).toBeTrue();
    });

    it('segmentedButton applies its classes in a Lit render', async () => {
      const root = env.render(
        html`<button class="${segmentedButton({selected: true})}"></button>`,
      );
      await env.waitForStability();
      const el = root.querySelector('.segmented-btn');
      expect(el).not.toBeNull();
      expect(el!.classList.contains('segmented-btn-selected')).toBeTrue();
    });
  });
});

describe('pure selection logic', () => {
  describe('normalizeSegmentSelection()', () => {
    it('single: keeps preferred when it is selected', () => {
      const result = normalizeSegmentSelection([true, true, false], {
        selection: 'single',
        preferred: 0,
      });
      expect(result).toEqual([true, false, false]);
    });

    it('single: otherwise keeps the last selected', () => {
      const result = normalizeSegmentSelection([true, true, false], {
        selection: 'single',
      });
      expect(result).toEqual([false, true, false]);
    });

    it('single: never auto-selects', () => {
      const result = normalizeSegmentSelection([false, false, false], {
        selection: 'single',
      });
      expect(result).toEqual([false, false, false]);
    });

    it('multiple: returns the input unchanged', () => {
      const input = [true, false, true];
      const result = normalizeSegmentSelection(input, {selection: 'multiple'});
      expect(result).toEqual(input);
      expect(result).not.toBe(input);
    });
  });
});

describe('plain-markup setup functions', () => {
  const env = new Environment();

  describe('setupSegmentedButton', () => {
    it('radio: clicking an unchecked segment sets aria-checked=true, then fires input then change', async () => {
      const root = env.render(html`
        <button class="segmented-btn" role="radio" aria-checked="false"
          >Item</button
        >
      `);
      await env.waitForStability();
      const btn = root.querySelector('button') as HTMLElement;
      setupSegmentedButton(btn);

      const events: string[] = [];
      btn.addEventListener('input', () => events.push('input'));
      btn.addEventListener('change', () => events.push('change'));

      const harness = new TestHarness(btn);
      await harness.clickWithMouse();

      expect(btn.getAttribute('aria-checked')).toBe('true');
      expect(btn.classList.contains('segmented-btn-selected')).toBeTrue();
      expect(events).toEqual(['input', 'change']);
    });

    it('radio: clicking a checked segment changes nothing and fires nothing', async () => {
      const root = env.render(html`
        <button
          class="segmented-btn segmented-btn-selected"
          role="radio"
          aria-checked="true"
          >Item</button
        >
      `);
      await env.waitForStability();
      const btn = root.querySelector('button') as HTMLElement;
      setupSegmentedButton(btn);

      const events: string[] = [];
      btn.addEventListener('input', () => events.push('input'));
      btn.addEventListener('change', () => events.push('change'));

      const harness = new TestHarness(btn);
      await harness.clickWithMouse();

      expect(btn.getAttribute('aria-checked')).toBe('true');
      expect(events.length).toBe(0);
    });

    it('checkbox: a click toggles aria-checked both ways and fires input + change each time', async () => {
      const root = env.render(html`
        <button class="segmented-btn" role="checkbox" aria-checked="false"
          >Item</button
        >
      `);
      await env.waitForStability();
      const btn = root.querySelector('button') as HTMLElement;
      setupSegmentedButton(btn);

      const events: string[] = [];
      btn.addEventListener('input', () => events.push('input'));
      btn.addEventListener('change', () => events.push('change'));

      const harness = new TestHarness(btn);
      await harness.clickWithMouse();
      expect(btn.getAttribute('aria-checked')).toBe('true');
      expect(btn.classList.contains('segmented-btn-selected')).toBeTrue();
      expect(events).toEqual(['input', 'change']);

      await harness.clickWithMouse();
      expect(btn.getAttribute('aria-checked')).toBe('false');
      expect(btn.classList.contains('segmented-btn-selected')).toBeFalse();
      expect(events).toEqual(['input', 'change', 'input', 'change']);
    });

    it('input is bubbles + composed; change bubbles and is not composed', async () => {
      const root = env.render(html`
        <button class="segmented-btn" role="radio" aria-checked="false"
          >Item</button
        >
      `);
      await env.waitForStability();
      const btn = root.querySelector('button') as HTMLElement;
      setupSegmentedButton(btn);

      let inputEvent: InputEvent | null = null;
      let changeEvent: Event | null = null;
      btn.addEventListener('input', (e) => {
        inputEvent = e as InputEvent;
      });
      btn.addEventListener('change', (e) => {
        changeEvent = e;
      });

      const harness = new TestHarness(btn);
      await harness.clickWithMouse();

      expect(inputEvent).not.toBeNull();
      expect(inputEvent!.bubbles).toBeTrue();
      expect(inputEvent!.composed).toBeTrue();

      expect(changeEvent).not.toBeNull();
      expect(changeEvent!.bubbles).toBeTrue();
      expect(changeEvent!.composed).toBeFalse();
    });

    it('ignores clicks when disabled or aria-disabled="true"', async () => {
      const root = env.render(html`
        <button class="segmented-btn" role="radio" aria-checked="false" disabled
          >Item 1</button
        >
        <button
          class="segmented-btn"
          role="radio"
          aria-checked="false"
          aria-disabled="true"
          >Item 2</button
        >
      `);
      await env.waitForStability();
      const [btn1, btn2] = Array.from(
        root.querySelectorAll('button'),
      ) as HTMLElement[];
      setupSegmentedButton(btn1);
      setupSegmentedButton(btn2);

      const events: string[] = [];
      btn1.addEventListener('input', () => events.push('btn1'));
      btn2.addEventListener('input', () => events.push('btn2'));

      await new TestHarness(btn1).clickWithMouse();
      await new TestHarness(btn2).clickWithMouse();

      expect(btn1.getAttribute('aria-checked')).toBe('false');
      expect(btn2.getAttribute('aria-checked')).toBe('false');
      expect(events.length).toBe(0);
    });

    it('respects preventDefault() from a consumer click listener', async () => {
      const root = env.render(html`
        <button class="segmented-btn" role="radio" aria-checked="false"
          >Item</button
        >
      `);
      await env.waitForStability();
      const btn = root.querySelector('button') as HTMLElement;
      setupSegmentedButton(btn);

      btn.addEventListener('click', (e) => {
        e.preventDefault();
      });

      const events: string[] = [];
      btn.addEventListener('input', () => events.push('input'));

      await new TestHarness(btn).clickWithMouse();
      expect(btn.getAttribute('aria-checked')).toBe('false');
      expect(events.length).toBe(0);
    });

    it('Space and Enter each activate a multi-select segment once in plain markup', async () => {
      const root = env.render(html`
        <div class="segmented-btn-set">
          <button class="segmented-btn" role="checkbox" aria-checked="false"
            >Bold</button
          >
        </div>
      `);
      await env.waitForStability();
      const btn = root.querySelector('button') as HTMLElement;
      setupSegmentedButton(btn);
      let inputs = 0;
      let changes = 0;
      btn.addEventListener('input', () => inputs++);
      btn.addEventListener('change', () => changes++);
      const harness = new TestHarness(btn);

      await harness.startClickWithKeyboard({key: ' '});
      expect(btn.getAttribute('aria-checked')).toBe('true');
      expect([inputs, changes]).toEqual([1, 1]);

      await harness.startClickWithKeyboard({key: 'Enter'});
      expect(btn.getAttribute('aria-checked')).toBe('false');
      expect([inputs, changes]).toEqual([2, 2]);
    });

    it('stops after the AbortSignal aborts', async () => {
      const root = env.render(html`
        <button class="segmented-btn" role="radio" aria-checked="false"
          >Item</button
        >
      `);
      await env.waitForStability();
      const btn = root.querySelector('button') as HTMLElement;
      const controller = new AbortController();
      setupSegmentedButton(btn, {signal: controller.signal});

      controller.abort();
      await new TestHarness(btn).clickWithMouse();

      expect(btn.getAttribute('aria-checked')).toBe('false');
    });
  });

  describe('setupSegmentedButtonSet', () => {
    it('checking a radio unchecks sibling radios', async () => {
      const root = env.render(html`
        <div class="segmented-btn-set">
          <button
            class="segmented-btn segmented-btn-selected"
            role="radio"
            aria-checked="true"
            id="btn1"
            >1</button
          >
          <button
            class="segmented-btn"
            role="radio"
            aria-checked="false"
            id="btn2"
            >2</button
          >
          <button
            class="segmented-btn"
            role="radio"
            aria-checked="false"
            id="btn3"
            >3</button
          >
        </div>
      `);
      await env.waitForStability();
      const set = root.querySelector('.segmented-btn-set') as HTMLElement;
      const [btn1, btn2, btn3] = Array.from(
        set.querySelectorAll('button'),
      ) as HTMLElement[];
      setupSegmentedButtonSet(set);
      setupSegmentedButton(btn1);
      setupSegmentedButton(btn2);
      setupSegmentedButton(btn3);

      await new TestHarness(btn2).clickWithMouse();

      expect(btn1.getAttribute('aria-checked')).toBe('false');
      expect(btn1.classList.contains('segmented-btn-selected')).toBeFalse();
      expect(btn2.getAttribute('aria-checked')).toBe('true');
      expect(btn2.classList.contains('segmented-btn-selected')).toBeTrue();
      expect(btn3.getAttribute('aria-checked')).toBe('false');
    });

    it('leaves checkbox siblings alone', async () => {
      const root = env.render(html`
        <div class="segmented-btn-set">
          <button
            class="segmented-btn segmented-btn-selected"
            role="checkbox"
            aria-checked="true"
            id="btn1"
            >1</button
          >
          <button
            class="segmented-btn"
            role="checkbox"
            aria-checked="false"
            id="btn2"
            >2</button
          >
        </div>
      `);
      await env.waitForStability();
      const set = root.querySelector('.segmented-btn-set') as HTMLElement;
      const [btn1, btn2] = Array.from(
        set.querySelectorAll('button'),
      ) as HTMLElement[];
      setupSegmentedButtonSet(set);
      setupSegmentedButton(btn1);
      setupSegmentedButton(btn2);

      await new TestHarness(btn2).clickWithMouse();

      expect(btn1.getAttribute('aria-checked')).toBe('true');
      expect(btn2.getAttribute('aria-checked')).toBe('true');
    });

    it('ignores non-segment children and nested descendants', async () => {
      const root = env.render(html`
        <div class="segmented-btn-set">
          <button
            class="segmented-btn"
            role="radio"
            aria-checked="true"
            id="btn1"
            >1</button
          >
          <div class="wrapper">
            <button
              class="segmented-btn"
              role="radio"
              aria-checked="false"
              id="nested-btn"
              >Nested</button
            >
          </div>
        </div>
      `);
      await env.waitForStability();
      const set = root.querySelector('.segmented-btn-set') as HTMLElement;
      const btn1 = root.querySelector('#btn1') as HTMLElement;
      const nestedBtn = root.querySelector('#nested-btn') as HTMLElement;
      setupSegmentedButtonSet(set);
      setupSegmentedButton(btn1);
      setupSegmentedButton(nestedBtn);

      await new TestHarness(nestedBtn).clickWithMouse();
      // btn1 should not be unchecked because nestedBtn is not a direct segment
      // child of set
      expect(btn1.getAttribute('aria-checked')).toBe('true');
    });

    it('fires input then change on the set once per user activation and stops child events', async () => {
      const root = env.render(html`
        <div class="segmented-btn-set">
          <button
            class="segmented-btn"
            role="radio"
            aria-checked="false"
            id="btn1"
            >1</button
          >
        </div>
      `);
      await env.waitForStability();
      const set = root.querySelector('.segmented-btn-set') as HTMLElement;
      const btn1 = root.querySelector('#btn1') as HTMLElement;
      setupSegmentedButtonSet(set);
      setupSegmentedButton(btn1);

      const setEvents: string[] = [];
      set.addEventListener('input', (e) => {
        expect(e.target).toBe(set);
        setEvents.push('set:input');
      });
      set.addEventListener('change', (e) => {
        expect(e.target).toBe(set);
        setEvents.push('set:change');
      });

      await new TestHarness(btn1).clickWithMouse();

      expect(setEvents).toEqual(['set:input', 'set:change']);
    });

    it('consumer listener registered before setupSegmentedButtonSet receives exactly 1 input and 1 change with target === set', async () => {
      const root = env.render(html`
        <div class="segmented-btn-set">
          <button
            class="segmented-btn"
            role="radio"
            aria-checked="false"
            id="b1"
            >1</button
          >
          <button
            class="segmented-btn"
            role="radio"
            aria-checked="false"
            id="b2"
            >2</button
          >
        </div>
      `);
      await env.waitForStability();
      const set = root.querySelector('.segmented-btn-set') as HTMLElement;
      const b1 = root.querySelector('#b1') as HTMLElement;
      const b2 = root.querySelector('#b2') as HTMLElement;

      const inputTargets: EventTarget[] = [];
      const changeTargets: EventTarget[] = [];
      set.addEventListener('input', (e) => inputTargets.push(e.target!));
      set.addEventListener('change', (e) => changeTargets.push(e.target!));

      setupSegmentedButtonSet(set);
      setupSegmentedButton(b1);
      setupSegmentedButton(b2);

      await new TestHarness(b1).clickWithMouse();

      expect(inputTargets.length).toBe(1);
      expect(inputTargets[0]).toBe(set);
      expect(changeTargets.length).toBe(1);
      expect(changeTargets[0]).toBe(set);
    });

    it('directive-managed set relays exactly once after its LitElement host moves', async () => {
      class SbHost extends LitElement {
        protected override createRenderRoot() {
          return this;
        }
        protected override render() {
          return html`<div class="${segmentedButtonSet()}" role="radiogroup">
            <button
              type="button"
              class="${segmentedButton({selected: false})}"
              role="radio"
              aria-checked="false"
              id="b1"
              >1</button
            >
            <button
              type="button"
              class="${segmentedButton({selected: false})}"
              role="radio"
              aria-checked="false"
              id="b2"
              >2</button
            >
          </div>`;
        }
      }
      customElements.define('test-sb-host', SbHost);
      const root = env.render(html`<div id="from"></div><div id="to"></div>`);
      const host = document.createElement('test-sb-host');
      root.querySelector('#from')!.append(host);
      await env.waitForStability();
      root.querySelector('#to')!.append(host);
      await env.waitForStability();
      const set = host.querySelector('.segmented-btn-set')!;
      let inputs = 0;
      let changes = 0;
      set.addEventListener('input', () => inputs++);
      set.addEventListener('change', () => changes++);
      await new TestHarness(
        host.querySelector('#b1') as HTMLElement,
      ).clickWithMouse();
      expect([inputs, changes]).toEqual([1, 1]);
    });

    it('plain markup: setting set disabled in set input listener still contains child change and dispatches set change', async () => {
      const root = env.render(html`
        <div class="segmented-btn-set">
          <button
            class="segmented-btn"
            role="radio"
            aria-checked="false"
            id="b1"
            >1</button
          >
        </div>
      `);
      await env.waitForStability();
      const set = root.querySelector('.segmented-btn-set') as HTMLElement;
      const b1 = root.querySelector('#b1') as HTMLElement;
      setupSegmentedButtonSet(set);
      setupSegmentedButton(b1);

      const changeTargets: EventTarget[] = [];
      set.addEventListener('input', () => {
        set.classList.add('disabled');
        set.setAttribute('aria-disabled', 'true');
      });
      set.addEventListener('change', (e) => changeTargets.push(e.target!));

      await new TestHarness(b1).clickWithMouse();

      expect(changeTargets.length).toBe(1);
      expect(changeTargets[0]).toBe(set);
    });

    it('plain markup: pre-checked radios [a, b] normalize to b at setup with no events', async () => {
      const root = env.render(html`
        <div class="segmented-btn-set">
          <button
            class="segmented-btn segmented-btn-selected"
            role="radio"
            aria-checked="true"
            id="a"
            >A</button
          >
          <button
            class="segmented-btn segmented-btn-selected"
            role="radio"
            aria-checked="true"
            id="b"
            >B</button
          >
        </div>
      `);
      await env.waitForStability();
      const set = root.querySelector('.segmented-btn-set') as HTMLElement;
      const a = root.querySelector('#a') as HTMLElement;
      const b = root.querySelector('#b') as HTMLElement;

      let events = 0;
      set.addEventListener('input', () => events++);
      set.addEventListener('change', () => events++);

      setupSegmentedButtonSet(set);
      setupSegmentedButton(a);
      setupSegmentedButton(b);

      expect(events).toBe(0);
      expect(a.getAttribute('aria-checked')).toBe('false');
      expect(a.classList.contains('segmented-btn-selected')).toBeFalse();
      expect(b.getAttribute('aria-checked')).toBe('true');
      expect(b.classList.contains('segmented-btn-selected')).toBeTrue();
    });

    it('stops after the AbortSignal aborts', async () => {
      const root = env.render(html`
        <div class="segmented-btn-set">
          <button
            class="segmented-btn segmented-btn-selected"
            role="radio"
            aria-checked="true"
            id="btn1"
            >1</button
          >
          <button
            class="segmented-btn"
            role="radio"
            aria-checked="false"
            id="btn2"
            >2</button
          >
        </div>
      `);
      await env.waitForStability();
      const set = root.querySelector('.segmented-btn-set') as HTMLElement;
      const [btn1, btn2] = Array.from(
        set.querySelectorAll('button'),
      ) as HTMLElement[];
      const controller = new AbortController();
      setupSegmentedButtonSet(set, {signal: controller.signal});
      setupSegmentedButton(btn1);
      setupSegmentedButton(btn2);

      controller.abort();

      await new TestHarness(btn2).clickWithMouse();
      // Sibling radio was NOT unchecked because set setup was aborted
      expect(btn1.getAttribute('aria-checked')).toBe('true');
    });
  });
});

describe('plain-markup styles', () => {
  const env = new Environment();

  it('segments have equal widths regardless of label length', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set">
        <button class="segmented-btn"
          ><span class="segmented-btn-label">A</span></button
        >
        <button class="segmented-btn"
          ><span class="segmented-btn-label"
            >A much longer label text</span
          ></button
        >
        <button class="segmented-btn"
          ><span class="segmented-btn-label">B</span></button
        >
      </div>
    `);
    await env.waitForStability();
    const btns = Array.from(
      root.querySelectorAll('.segmented-btn'),
    ) as HTMLElement[];
    const widths = btns.map((b) => b.getBoundingClientRect().width);
    expect(Math.abs(widths[0] - widths[1])).toBeLessThanOrEqual(1);
    expect(Math.abs(widths[1] - widths[2])).toBeLessThanOrEqual(1);
  });

  it('labels do not wrap and ellipsize when the set is constrained', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set" style="inline-size: 150px;">
        <button class="segmented-btn"
          ><span class="segmented-btn-label">First long label</span></button
        >
        <button class="segmented-btn"
          ><span class="segmented-btn-label">Second long label</span></button
        >
      </div>
    `);
    await env.waitForStability();
    const label = root.querySelector('.segmented-btn-label') as HTMLElement;
    const computed = getComputedStyle(label);
    expect(computed.overflow).toBe('hidden');
    expect(computed.textOverflow).toBe('ellipsis');
    expect(computed.whiteSpace).toBe('nowrap');
  });

  it('height is 40/36/32/28px for density 0/-1/-2/-3', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set" id="s0"
        ><button class="segmented-btn">0</button></div
      >
      <div class="segmented-btn-set segmented-btn-set-dense-1" id="s1"
        ><button class="segmented-btn">1</button></div
      >
      <div class="segmented-btn-set segmented-btn-set-dense-2" id="s2"
        ><button class="segmented-btn">2</button></div
      >
      <div class="segmented-btn-set segmented-btn-set-dense-3" id="s3"
        ><button class="segmented-btn">3</button></div
      >
    `);
    await env.waitForStability();
    const b0 = root.querySelector('#s0 .segmented-btn') as HTMLElement;
    const b1 = root.querySelector('#s1 .segmented-btn') as HTMLElement;
    const b2 = root.querySelector('#s2 .segmented-btn') as HTMLElement;
    const b3 = root.querySelector('#s3 .segmented-btn') as HTMLElement;
    expect(Math.round(b0.getBoundingClientRect().height)).toBe(40);
    expect(Math.round(b1.getBoundingClientRect().height)).toBe(36);
    expect(Math.round(b2.getBoundingClientRect().height)).toBe(32);
    expect(Math.round(b3.getBoundingClientRect().height)).toBe(28);
  });

  it('outer corners are full and inner corners are 0 (LTR)', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set">
        <button class="segmented-btn" id="first">1</button>
        <button class="segmented-btn" id="mid">2</button>
        <button class="segmented-btn" id="last">3</button>
      </div>
    `);
    await env.waitForStability();
    const first = root.querySelector('#first') as HTMLElement;
    const mid = root.querySelector('#mid') as HTMLElement;
    const last = root.querySelector('#last') as HTMLElement;

    const firstStyle = getComputedStyle(first);
    expect(parsePx(firstStyle.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(parsePx(firstStyle.borderBottomLeftRadius)).toBeGreaterThan(0);
    expect(parsePx(firstStyle.borderTopRightRadius)).toBe(0);
    expect(parsePx(firstStyle.borderBottomRightRadius)).toBe(0);

    const midStyle = getComputedStyle(mid);
    expect(parsePx(midStyle.borderTopLeftRadius)).toBe(0);
    expect(parsePx(midStyle.borderBottomLeftRadius)).toBe(0);
    expect(parsePx(midStyle.borderTopRightRadius)).toBe(0);
    expect(parsePx(midStyle.borderBottomRightRadius)).toBe(0);

    const lastStyle = getComputedStyle(last);
    expect(parsePx(lastStyle.borderTopLeftRadius)).toBe(0);
    expect(parsePx(lastStyle.borderBottomLeftRadius)).toBe(0);
    expect(parsePx(lastStyle.borderTopRightRadius)).toBeGreaterThan(0);
    expect(parsePx(lastStyle.borderBottomRightRadius)).toBeGreaterThan(0);
  });

  it('corners mirror in RTL', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set" dir="rtl">
        <button class="segmented-btn" id="rtl-first">1</button>
        <button class="segmented-btn" id="rtl-last">2</button>
      </div>
    `);
    await env.waitForStability();
    const first = root.querySelector('#rtl-first') as HTMLElement;
    const last = root.querySelector('#rtl-last') as HTMLElement;

    const firstStyle = getComputedStyle(first);
    expect(parsePx(firstStyle.borderTopRightRadius)).toBeGreaterThan(0);
    expect(parsePx(firstStyle.borderBottomRightRadius)).toBeGreaterThan(0);
    expect(parsePx(firstStyle.borderTopLeftRadius)).toBe(0);
    expect(parsePx(firstStyle.borderBottomLeftRadius)).toBe(0);

    const lastStyle = getComputedStyle(last);
    expect(parsePx(lastStyle.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(parsePx(lastStyle.borderBottomLeftRadius)).toBeGreaterThan(0);
    expect(parsePx(lastStyle.borderTopRightRadius)).toBe(0);
    expect(parsePx(lastStyle.borderBottomRightRadius)).toBe(0);
  });

  it('a lone segment gets all four corners', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set">
        <button class="segmented-btn" id="lone">Lone</button>
      </div>
    `);
    await env.waitForStability();
    const lone = root.querySelector('#lone') as HTMLElement;
    const style = getComputedStyle(lone);
    expect(parsePx(style.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(parsePx(style.borderBottomLeftRadius)).toBeGreaterThan(0);
    expect(parsePx(style.borderTopRightRadius)).toBeGreaterThan(0);
    expect(parsePx(style.borderBottomRightRadius)).toBeGreaterThan(0);
  });

  it('a hidden segment is skipped by corner and divider rules', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set">
        <button class="segmented-btn" hidden id="hidden-btn">Hidden</button>
        <button class="segmented-btn" id="first-visible">Visible 1</button>
        <button class="segmented-btn" id="last-visible">Visible 2</button>
      </div>
    `);
    await env.waitForStability();
    const hiddenBtn = root.querySelector('#hidden-btn') as HTMLElement;
    const firstVis = root.querySelector('#first-visible') as HTMLElement;
    const lastVis = root.querySelector('#last-visible') as HTMLElement;

    expect(getComputedStyle(hiddenBtn).display).toBe('none');

    const firstStyle = getComputedStyle(firstVis);
    expect(parsePx(firstStyle.borderTopLeftRadius)).toBeGreaterThan(0);
    expect(parsePx(firstStyle.borderBottomLeftRadius)).toBeGreaterThan(0);
    expect(firstStyle.borderInlineEndWidth).toBe('0px');

    const lastStyle = getComputedStyle(lastVis);
    expect(parsePx(lastStyle.borderTopRightRadius)).toBeGreaterThan(0);
    expect(parsePx(lastStyle.borderBottomRightRadius)).toBeGreaterThan(0);
    expect(lastStyle.borderInlineEndWidth).toBe('1px');
  });

  it('one 1px divider: only non-last visible segments drop border-inline-end', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set">
        <button class="segmented-btn" id="d-btn1">1</button>
        <button class="segmented-btn" id="d-btn2">2</button>
      </div>
    `);
    await env.waitForStability();
    const b1 = root.querySelector('#d-btn1') as HTMLElement;
    const b2 = root.querySelector('#d-btn2') as HTMLElement;

    expect(getComputedStyle(b1).borderInlineEndWidth).toBe('0px');
    expect(getComputedStyle(b2).borderInlineEndWidth).toBe('1px');
  });

  it('the touch target is 48px at every density', async () => {
    const root = env.render(html`
      <div style="padding: 20px;">
        <div class="segmented-btn-set segmented-btn-set-dense-3">
          <button class="segmented-btn" id="dense-btn">Touch</button>
        </div>
      </div>
    `);
    await env.waitForStability();
    const btn = root.querySelector('#dense-btn') as HTMLElement;
    const rect = btn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;

    const abovePoint = document.elementFromPoint(centerX, rect.top - 5);
    const belowPoint = document.elementFromPoint(centerX, rect.bottom + 5);
    expect(abovePoint).toBe(btn);
    expect(belowPoint).toBe(btn);
  });

  it('a keyboard-focused segment has z-index 1', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set">
        <button class="segmented-btn" id="f-btn">Focus</button>
      </div>
    `);
    await env.waitForStability();
    const btn = root.querySelector('#f-btn') as HTMLElement;
    expect(getComputedStyle(btn).zIndex).toBe('auto');

    await new TestHarness(btn).focusWithKeyboard();
    expect(getComputedStyle(btn).zIndex).toBe('1');
  });

  it('shows the focus ring when focused with the keyboard in class API', async () => {
    const root = env.render(html`
      <button class="segmented-btn focus-ring-outer">Focus</button>
    `);
    await env.waitForStability();
    const btn = root.querySelector('.segmented-btn') as HTMLElement;
    await new TestHarness(btn).focusWithKeyboard();
    expect(getComputedStyle(btn).outlineStyle).toBe('solid');
  });

  it('disabled segment has pointer-events: none', async () => {
    const root = env.render(html`
      <button class="segmented-btn" disabled id="dis-btn">Disabled</button>
    `);
    await env.waitForStability();
    const btn = root.querySelector('#dis-btn') as HTMLElement;
    expect(getComputedStyle(btn).pointerEvents).toBe('none');
  });

  it('segment with .disabled class has pointer-events: none', async () => {
    const root = env.render(html`
      <button class="segmented-btn disabled">Disabled</button>
    `);
    await env.waitForStability();
    const btn = root.querySelector('.segmented-btn') as HTMLElement;
    expect(getComputedStyle(btn).pointerEvents).toBe('none');
  });

  it('segment with .disabled class has disabled colors', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set">
        <button class="segmented-btn disabled">Disabled</button>
        <span
          id="probe"
          style="border-style: solid; color: hsl(from var(--md-sys-color-on-surface) h s l / 38%); border-color: hsl(from var(--md-sys-color-on-surface) h s l / 12%);"></span>
      </div>
    `);
    await env.waitForStability();
    const btn = root.querySelector('.segmented-btn') as HTMLElement;
    const probe = root.querySelector('#probe') as HTMLElement;
    expect(getComputedStyle(btn).color).toBe(getComputedStyle(probe).color);
    expect(getComputedStyle(btn).borderColor).toBe(
      getComputedStyle(probe).borderColor,
    );
  });

  it('selected segment with .disabled class has pointer-events: none', async () => {
    const root = env.render(html`
      <button class="segmented-btn segmented-btn-selected disabled"
        >Selected Disabled</button
      >
    `);
    await env.waitForStability();
    const btn = root.querySelector('.segmented-btn') as HTMLElement;
    expect(getComputedStyle(btn).pointerEvents).toBe('none');
  });

  it('selected segment with .disabled class has transparent background and 0px checkmark', async () => {
    const root = env.render(html`
      <button class="segmented-btn segmented-btn-selected disabled">
        <span class="segmented-btn-graphic"
          >${renderSegmentedButtonCheckmark()}</span
        >
        <span class="segmented-btn-label">Selected Disabled</span>
      </button>
      <span
        id="probe"
        style="color: hsl(from var(--md-sys-color-on-surface) h s l / 38%);"></span>
    `);
    await env.waitForStability();
    const btn = root.querySelector('.segmented-btn') as HTMLElement;
    const probe = root.querySelector('#probe') as HTMLElement;
    const checkmark = root.querySelector(
      '.segmented-btn-checkmark',
    ) as HTMLElement;
    expect(getComputedStyle(btn).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(getComputedStyle(btn).color).toBe(getComputedStyle(probe).color);
    expect(parsePx(getComputedStyle(checkmark).inlineSize)).toBe(0);
    expect(Number(getComputedStyle(checkmark).opacity)).toBe(0);
  });

  it('segment with aria-disabled="true" has pointer-events: none', async () => {
    const root = env.render(html`
      <button class="segmented-btn" aria-disabled="true">Aria Disabled</button>
    `);
    await env.waitForStability();
    const btn = root.querySelector('.segmented-btn') as HTMLElement;
    expect(getComputedStyle(btn).pointerEvents).toBe('none');
  });

  it('plain-markup set with aria-disabled="true" styles children as disabled with transparent background', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set" aria-disabled="true">
        <button class="segmented-btn" id="aria-child">1</button>
        <button
          class="segmented-btn segmented-btn-selected"
          id="aria-sel-child">
          <span class="segmented-btn-graphic"
            >${renderSegmentedButtonCheckmark()}</span
          >
          <span class="segmented-btn-label">2</span>
        </button>
        <span
          id="probe"
          style="color: hsl(from var(--md-sys-color-on-surface) h s l / 38%);"></span>
      </div>
    `);
    await env.waitForStability();
    const child = root.querySelector('#aria-child') as HTMLElement;
    const selChild = root.querySelector('#aria-sel-child') as HTMLElement;
    const probe = root.querySelector('#probe') as HTMLElement;
    const checkmark = selChild.querySelector(
      '.segmented-btn-checkmark',
    ) as HTMLElement;

    expect(getComputedStyle(child).pointerEvents).toBe('none');
    expect(getComputedStyle(child).color).toBe(getComputedStyle(probe).color);
    expect(getComputedStyle(selChild).backgroundColor).toBe('rgba(0, 0, 0, 0)');
    expect(parsePx(getComputedStyle(checkmark).inlineSize)).toBe(0);
    expect(Number(getComputedStyle(checkmark).opacity)).toBe(0);
  });

  it('disabled set in plain markup blocks child activation, deselects children, and styles as transparent', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set disabled">
        <button class="segmented-btn" role="radio" aria-checked="false" id="b1"
          >1</button
        >
        <button
          class="segmented-btn segmented-btn-selected"
          role="radio"
          aria-checked="true"
          id="b2"
          >2</button
        >
      </div>
    `);
    await env.waitForStability();
    const set = root.querySelector('.segmented-btn-set') as HTMLElement;
    setupSegmentedButtonSet(set);
    const b1 = root.querySelector('#b1') as HTMLElement;
    setupSegmentedButton(b1);
    const b2 = root.querySelector('#b2') as HTMLElement;
    setupSegmentedButton(b2);

    expect(getComputedStyle(b1).pointerEvents).toBe('none');
    expect(getComputedStyle(b2).pointerEvents).toBe('none');
    expect(getComputedStyle(b2).backgroundColor).toBe('rgba(0, 0, 0, 0)');

    let events = 0;
    set.addEventListener('input', () => events++);
    set.addEventListener('change', () => events++);
    b1.addEventListener('input', () => events++);
    b1.addEventListener('change', () => events++);

    await new TestHarness(b1).clickWithMouse();

    expect(events).toBe(0);
    expect(b1.getAttribute('aria-checked')).toBe('false');
    expect(b2.getAttribute('aria-checked')).toBe('false');
    expect(b2.classList.contains('segmented-btn-selected')).toBeFalse();
  });

  it('disabled segment following enabled segment keeps solid outline on shared divider', async () => {
    const root = env.render(html`
      <div class="segmented-btn-set">
        <button class="segmented-btn" id="b1">1</button>
        <button class="segmented-btn" id="b2" disabled>2</button>
        <button class="segmented-btn" id="b3">3</button>
      </div>
      <span
        id="probe-enabled"
        style="color: var(--md-sys-color-outline);"></span>
      <span
        id="probe-disabled"
        style="color: hsl(from var(--md-sys-color-on-surface) h s l / 12%);"></span>
    `);
    await env.waitForStability();
    const b2 = root.querySelector('#b2') as HTMLElement;
    const probeEnabled = root.querySelector('#probe-enabled') as HTMLElement;
    const probeDisabled = root.querySelector('#probe-disabled') as HTMLElement;

    // Touching enabled b1: borderInlineStartColor must be solid enabled outline
    expect(getComputedStyle(b2).borderInlineStartColor).toBe(
      getComputedStyle(probeEnabled).color,
    );
    // Top and bottom borders must remain disabled outline
    expect(getComputedStyle(b2).borderBlockStartColor).toBe(
      getComputedStyle(probeDisabled).color,
    );
    expect(getComputedStyle(b2).borderBlockEndColor).toBe(
      getComputedStyle(probeDisabled).color,
    );
  });

  it('width stability: unselected and selected have identical max-content width for label-only and icon-only', async () => {
    const root = env.render(html`
      <div style="display: flex;">
        <button class="segmented-btn" id="unselected-label">
          <span class="segmented-btn-label">Settings</span>
        </button>
        <button
          class="segmented-btn segmented-btn-selected"
          id="selected-label">
          <span class="segmented-btn-graphic">
            ${renderSegmentedButtonCheckmark()}
          </span>
          <span class="segmented-btn-label">Settings</span>
        </button>
        <button
          class="segmented-btn segmented-btn-with-icon segmented-btn-icon-only"
          id="unselected-icon">
          <span class="segmented-btn-graphic">
            ${renderSegmentedButtonCheckmark()}
            <span class="segmented-btn-icon"></span>
          </span>
        </button>
        <button
          class="segmented-btn segmented-btn-with-icon segmented-btn-icon-only segmented-btn-selected"
          id="selected-icon">
          <span class="segmented-btn-graphic">
            ${renderSegmentedButtonCheckmark()}
            <span class="segmented-btn-icon"></span>
          </span>
        </button>
      </div>
    `);
    await env.waitForStability();
    const uLabel = root.querySelector('#unselected-label') as HTMLElement;
    const sLabel = root.querySelector('#selected-label') as HTMLElement;
    const uIcon = root.querySelector('#unselected-icon') as HTMLElement;
    const sIcon = root.querySelector('#selected-icon') as HTMLElement;

    expect(Math.round(uLabel.getBoundingClientRect().width)).toBe(
      Math.round(sLabel.getBoundingClientRect().width),
    );
    expect(Math.round(uIcon.getBoundingClientRect().width)).toBe(
      Math.round(sIcon.getBoundingClientRect().width),
    );
  });
});

describe('checkmark and configuration', () => {
  const env = new Environment();

  describe('geometry', () => {
    it('label only, unselected: checkmark width 0', async () => {
      const root = env.render(html`
        <button class="segmented-btn">
          <span class="segmented-btn-graphic"
            >${renderSegmentedButtonCheckmark()}</span
          >
          <span class="segmented-btn-label">Label</span>
        </button>
      `);
      await env.waitForStability();
      const checkmark = root.querySelector(
        '.segmented-btn-checkmark',
      ) as HTMLElement;
      expect(checkmark.getBoundingClientRect().width).toBe(0);
    });

    it('label only, selected: checkmark 18 + 8 + label', async () => {
      const root = env.render(html`
        <button class="segmented-btn segmented-btn-selected">
          <span class="segmented-btn-graphic"
            >${renderSegmentedButtonCheckmark()}</span
          >
          <span class="segmented-btn-label">Label</span>
        </button>
      `);
      await env.waitForStability();
      const btn = root.querySelector('.segmented-btn') as HTMLElement;
      const graphic = root.querySelector(
        '.segmented-btn-graphic',
      ) as HTMLElement;
      const checkmark = root.querySelector(
        '.segmented-btn-checkmark',
      ) as HTMLElement;
      const label = root.querySelector('.segmented-btn-label') as HTMLElement;

      const checkmarkRect = checkmark.getBoundingClientRect();
      expect(Math.round(checkmarkRect.width)).toBe(18);
      expect(Math.round(checkmarkRect.height)).toBe(18);

      const graphicRect = graphic.getBoundingClientRect();
      expect(Math.round(graphicRect.width)).toBe(18);
      expect(Math.round(graphicRect.height)).toBe(18);

      expect(getComputedStyle(btn).columnGap).toBe('8px');
      expect(
        Math.round(label.getBoundingClientRect().left - checkmarkRect.right),
      ).toBe(8);
    });

    it('label + icon, unselected: icon opacity 1, checkmark hidden', async () => {
      const root = env.render(html`
        <button class="segmented-btn segmented-btn-with-icon">
          <span class="segmented-btn-graphic">
            ${renderSegmentedButtonCheckmark()}
            <span class="segmented-btn-icon"></span>
          </span>
          <span class="segmented-btn-label">Label</span>
        </button>
      `);
      await env.waitForStability();
      const checkmark = root.querySelector(
        '.segmented-btn-checkmark',
      ) as HTMLElement;
      const icon = root.querySelector('.segmented-btn-icon') as HTMLElement;

      expect(getComputedStyle(checkmark).opacity).toBe('0');
      expect(getComputedStyle(icon).opacity).toBe('1');
    });

    it('label + icon, selected: checkmark replaces icon and label does not move', async () => {
      const root = env.render(html`
        <div style="display: flex;">
          <button class="segmented-btn segmented-btn-with-icon" id="unselected">
            <span class="segmented-btn-graphic">
              ${renderSegmentedButtonCheckmark()}
              <span class="segmented-btn-icon"></span>
            </span>
            <span class="segmented-btn-label">Label</span>
          </button>
          <button
            class="segmented-btn segmented-btn-with-icon segmented-btn-selected"
            id="selected">
            <span class="segmented-btn-graphic">
              ${renderSegmentedButtonCheckmark()}
              <span class="segmented-btn-icon"></span>
            </span>
            <span class="segmented-btn-label">Label</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const unsel = root.querySelector('#unselected') as HTMLElement;
      const sel = root.querySelector('#selected') as HTMLElement;

      const selCheckmark = sel.querySelector(
        '.segmented-btn-checkmark',
      ) as HTMLElement;
      const selIcon = sel.querySelector('.segmented-btn-icon') as HTMLElement;
      const selGraphic = sel.querySelector(
        '.segmented-btn-graphic',
      ) as HTMLElement;

      expect(getComputedStyle(selCheckmark).opacity).toBe('1');
      expect(getComputedStyle(selIcon).opacity).toBe('0');

      const selCheckmarkRect = selCheckmark.getBoundingClientRect();
      expect(Math.round(selCheckmarkRect.width)).toBe(18);
      expect(Math.round(selCheckmarkRect.height)).toBe(18);

      const selGraphicRect = selGraphic.getBoundingClientRect();
      expect(Math.round(selGraphicRect.width)).toBe(18);
      expect(Math.round(selGraphicRect.height)).toBe(18);

      expect(getComputedStyle(sel).columnGap).toBe('8px');

      // The label inline-start relative to button inline-start is identical
      const unselLabel = unsel.querySelector(
        '.segmented-btn-label',
      ) as HTMLElement;
      const selLabel = sel.querySelector('.segmented-btn-label') as HTMLElement;
      const unselDist =
        unselLabel.getBoundingClientRect().left -
        unsel.getBoundingClientRect().left;
      const selDist =
        selLabel.getBoundingClientRect().left -
        sel.getBoundingClientRect().left;
      expect(Math.round(unselDist)).toBe(Math.round(selDist));
      expect(
        Math.round(
          selLabel.getBoundingClientRect().left - selCheckmarkRect.right,
        ),
      ).toBe(8);
    });

    it('icon only, unselected: icon centered, checkmark width 0', async () => {
      const root = env.render(html`
        <button
          class="segmented-btn segmented-btn-with-icon segmented-btn-icon-only">
          <span class="segmented-btn-graphic">
            ${renderSegmentedButtonCheckmark()}
            <span class="segmented-btn-icon"></span>
          </span>
        </button>
      `);
      await env.waitForStability();
      const checkmark = root.querySelector(
        '.segmented-btn-checkmark',
      ) as HTMLElement;
      expect(checkmark.getBoundingClientRect().width).toBe(0);
    });

    it('icon only, selected: checkmark 18 + 8 + icon 18 at inline-start (LTR and RTL)', async () => {
      const root = env.render(html`
        <div>
          <button
            class="segmented-btn segmented-btn-with-icon segmented-btn-icon-only segmented-btn-selected"
            id="ltr-icon-only">
            <span class="segmented-btn-graphic">
              ${renderSegmentedButtonCheckmark()}
              <span class="segmented-btn-icon"></span>
            </span>
          </button>
          <div dir="rtl">
            <button
              class="segmented-btn segmented-btn-with-icon segmented-btn-icon-only segmented-btn-selected"
              id="rtl-icon-only">
              <span class="segmented-btn-graphic">
                ${renderSegmentedButtonCheckmark()}
                <span class="segmented-btn-icon"></span>
              </span>
            </button>
          </div>
        </div>
      `);
      await env.waitForStability();
      const ltrBtn = root.querySelector('#ltr-icon-only') as HTMLElement;
      const rtlBtn = root.querySelector('#rtl-icon-only') as HTMLElement;

      const ltrCheck = ltrBtn.querySelector(
        '.segmented-btn-checkmark',
      ) as HTMLElement;
      const ltrIcon = ltrBtn.querySelector(
        '.segmented-btn-icon',
      ) as HTMLElement;
      const ltrCheckRect = ltrCheck.getBoundingClientRect();
      expect(Math.round(ltrCheckRect.width)).toBe(18);
      expect(Math.round(ltrCheckRect.height)).toBe(18);
      expect(Math.round(ltrIcon.getBoundingClientRect().width)).toBe(18);
      // In LTR, checkmark is to the left of icon with 8px gap
      expect(
        Math.round(ltrIcon.getBoundingClientRect().left - ltrCheckRect.right),
      ).toBe(8);

      const rtlCheck = rtlBtn.querySelector(
        '.segmented-btn-checkmark',
      ) as HTMLElement;
      const rtlIcon = rtlBtn.querySelector(
        '.segmented-btn-icon',
      ) as HTMLElement;
      const rtlCheckRect = rtlCheck.getBoundingClientRect();
      expect(Math.round(rtlCheckRect.width)).toBe(18);
      expect(Math.round(rtlCheckRect.height)).toBe(18);
      expect(Math.round(rtlIcon.getBoundingClientRect().width)).toBe(18);
      // In RTL, checkmark is to the right of icon (inline-start) with 8px gap
      expect(
        Math.round(rtlCheckRect.left - rtlIcon.getBoundingClientRect().right),
      ).toBe(8);
    });

    it('the checkmark stroke matches the label color', async () => {
      const root = env.render(html`
        <button class="segmented-btn segmented-btn-selected">
          <span class="segmented-btn-graphic"
            >${renderSegmentedButtonCheckmark()}</span
          >
          <span class="segmented-btn-label">Label</span>
        </button>
      `);
      await env.waitForStability();
      const checkmark = root.querySelector(
        '.segmented-btn-checkmark',
      ) as SVGElement;
      const label = root.querySelector('.segmented-btn-label') as HTMLElement;
      expect(getComputedStyle(checkmark).stroke).toBe(
        getComputedStyle(label).color,
      );
    });
  });

  describe('motion and media rules', () => {
    it('no CSS animation runs on first render of a selected segment', async () => {
      const root = env.render(html`
        <button class="segmented-btn segmented-btn-selected">
          <span class="segmented-btn-graphic"
            >${renderSegmentedButtonCheckmark()}</span
          >
          <span class="segmented-btn-label">First Render</span>
        </button>
      `);
      await env.waitForStability();
      const btn = root.querySelector('.segmented-btn') as HTMLElement;
      expect(btn.getAnimations({subtree: true}).length).toBe(0);
    });

    it('no padding-inline animation runs on initial render of an unselected label + icon segment', async () => {
      const root = env.render(html`
        <md-gb-segmented-button>
          <span slot="icon">*</span>
          Walking
        </md-gb-segmented-button>
      `);
      await env.waitForStability();
      const segment = root.querySelector(
        'md-gb-segmented-button',
      ) as HTMLElement;
      const button = segment.shadowRoot!.querySelector('button')!;
      const animations = button.getAnimations({subtree: true});
      const paddingAnimations = animations.filter((anim) =>
        (anim as CSSTransition).transitionProperty?.includes('padding-inline'),
      );
      expect(paddingAnimations.length).toBe(0);
    });

    it('the stylesheet defines transitions for checkmark stroke-dashoffset and inline-size', async () => {
      const root = env.render(html`
        <button class="segmented-btn">
          <span class="segmented-btn-graphic"
            >${renderSegmentedButtonCheckmark()}</span
          >
        </button>
      `);
      await env.waitForStability();
      const checkmark = root.querySelector(
        '.segmented-btn-checkmark',
      ) as HTMLElement;
      const transitionProperty = getComputedStyle(checkmark).transitionProperty;
      expect(transitionProperty).toContain('stroke-dashoffset');
      expect(transitionProperty).toContain('inline-size');
    });
  });
});
