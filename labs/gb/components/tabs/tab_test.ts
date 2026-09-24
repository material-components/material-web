/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-tab.js';
import './md-gb-tabs.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {hasState} from '../../../behaviors/custom-state-set.js';
import {internals} from '../../../behaviors/element-internals.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import focusRingStyles from '../focus/focus-ring.cssresult.js';
import rippleStyles from '../ripple/ripple.cssresult.js';
import {styles as tabsStyles} from './tabs.cssresult.js';

adoptStyles(document, [m3Styles, focusRingStyles, rippleStyles, tabsStyles]);

/** The frozen selected-state selector from the CSS contract. */
const SELECTED_SELECTOR =
  ':is(.selected, [aria-selected="true"], :state(selected))';

describe('md-gb-tab', () => {
  const env = new Environment();

  describe('element mode', () => {
    it('puts the .tab class on the host, in the light tree', async () => {
      const root = env.render(html`<md-gb-tab></md-gb-tab>`);
      await env.waitForStability();
      const tab = root.querySelector('md-gb-tab')!;

      expect(tab.classList.contains('tab')).toBeTrue();
      expect(tab.classList.contains('focus-ring-inner')).toBeTrue();
      expect(tab.classList.contains('ripple')).toBeTrue();
      expect(tab.shadowRoot!.querySelector('.tab'))
        .withContext('.tab must be a host class, not a shadow wrapper')
        .toBeNull();
    });

    it('sets the tab role', async () => {
      const root = env.render(html`<md-gb-tab></md-gb-tab>`);
      await env.waitForStability();

      expect(root.querySelector('md-gb-tab')![internals].role).toBe('tab');
    });

    it('drives the selected-state selector through AOM and :state()', async () => {
      const root = env.render(html`<md-gb-tab selected></md-gb-tab>`);
      await env.waitForStability();
      const tab = root.querySelector('md-gb-tab')!;

      expect(tab[internals].ariaSelected).toBe('true');
      expect(tab[hasState]('selected')).toBeTrue();
      expect(tab.matches(SELECTED_SELECTOR)).toBeTrue();

      tab.selected = false;
      await env.waitForStability();

      expect(tab[internals].ariaSelected).toBe('false');
      expect(tab[hasState]('selected')).toBeFalse();
      expect(tab.matches(SELECTED_SELECTOR)).toBeFalse();
    });

    it('reflects the selected property to its attribute', async () => {
      const root = env.render(html`<md-gb-tab></md-gb-tab>`);
      await env.waitForStability();
      const tab = root.querySelector('md-gb-tab')!;

      tab.selected = true;
      await env.waitForStability();
      expect(tab.hasAttribute('selected')).toBeTrue();
    });

    it('renders a default slot, a tab-label slot, and a badge slot', async () => {
      const root = env.render(html`<md-gb-tab></md-gb-tab>`);
      await env.waitForStability();
      const shadow = root.querySelector('md-gb-tab')!.shadowRoot!;
      const slots = Array.from(shadow.querySelectorAll('slot'));

      expect(slots.length).toBe(3);
      expect(slots[0].name).toBe('');
      expect(slots[1].name).toBe('label');
      expect(slots[1].classList.contains('tab-label')).toBeTrue();
      expect(slots[2].name).toBe('badge');
    });

    it('accepts slot="label" as the label', async () => {
      const root = env.render(html`
        <md-gb-tab><span slot="label">Flights</span></md-gb-tab>
      `);
      await env.waitForStability();
      const tab = root.querySelector('md-gb-tab')!;
      const label = tab.querySelector('span')!;
      const labelSlot =
        tab.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="label"]')!;

      expect(labelSlot.assignedElements()).toEqual([label]);
    });

    it('accepts class="tab-label" in the default slot as the label', async () => {
      const root = env.render(html`
        <md-gb-tab><span class="tab-label">Flights</span></md-gb-tab>
      `);
      await env.waitForStability();
      const tab = root.querySelector('md-gb-tab')!;
      const label = tab.querySelector('span')!;
      const defaultSlot =
        tab.shadowRoot!.querySelector<HTMLSlotElement>('slot:not([name])')!;

      expect(defaultSlot.assignedElements()).toEqual([label]);
    });
  });

  describe('raw HTML mode', () => {
    it('defines the --tab anchor name on raw .tab identically to the element', async () => {
      const root = env.render(html`
        <div class="tabs" role="tablist">
          <md-gb-tab id="element" selected>
            <span slot="label">Flights</span>
          </md-gb-tab>
          <button
            id="raw"
            class="tab focus-ring-inner ripple selected"
            role="tab"
            aria-selected="true">
            <span class="tab-label">Flights</span>
          </button>
        </div>
      `);
      await env.waitForStability();
      const element = root.querySelector('#element')!;
      const raw = root.querySelector('#raw')!;

      expect(getComputedStyle(raw).getPropertyValue('anchor-name').trim()).toBe(
        '--tab',
      );
      expect(
        getComputedStyle(element).getPropertyValue('anchor-name').trim(),
      ).toBe('--tab');
    });

    it('does not treat .active as selected', async () => {
      const root = env.render(html`
        <div class="tabs" role="tablist">
          <button id="active" class="tab active" role="tab">
            <span class="tab-label">Flights</span>
          </button>
          <button
            id="selected"
            class="tab selected"
            role="tab"
            aria-selected="true">
            <span class="tab-label">Trips</span>
          </button>
        </div>
      `);
      await env.waitForStability();

      const active = root.querySelector<HTMLElement>('#active')!;
      const selected = root.querySelector<HTMLElement>('#selected')!;
      expect(
        getComputedStyle(active).getPropertyValue('anchor-name').trim(),
      ).toBe('none');
      expect(
        getComputedStyle(selected).getPropertyValue('anchor-name').trim(),
      ).toBe('--tab');
    });
  });
});
