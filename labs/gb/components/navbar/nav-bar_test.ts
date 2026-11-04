/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './md-gb-nav-bar.js';
import './md-gb-nav-bar-item.js';

import {html, render, type TemplateResult} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {Harness} from '../../../../testing/harness.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {NavBarElement} from './nav-bar-element.js';
import {NavBarItemElement} from './nav-bar-item-element.js';
import {styles as navBarStyles} from './nav-bar.cssresult.js';

adoptStyles(document, [m3Styles]);

class NavBarItemHarness extends Harness<NavBarItemElement> {
  override async getInteractiveElement(): Promise<HTMLElement> {
    return this.element;
  }

  part(selector: string): HTMLElement {
    const part = this.element.shadowRoot!.querySelector<HTMLElement>(selector);
    if (!part) {
      throw new Error(`Missing "${selector}" in nav bar item shadow root.`);
    }
    return part;
  }

  rect(selector: string): DOMRect {
    return this.part(selector).getBoundingClientRect();
  }

  /** The active indicator pill for the item's layout. */
  pillRect(): DOMRect {
    return this.element.itemLayout === 'horizontal'
      ? this.rect('.nav-bar-item-content')
      : this.rect('.nav-bar-item-icon-container');
  }
}

describe('md-gb-nav-bar', () => {
  const env = new Environment();

  async function setup(
    template: TemplateResult,
  ): Promise<{bar: NavBarElement; items: NavBarItemHarness[]}> {
    const root = env.render(template);
    await env.waitForStability();
    const bar = root.querySelector('md-gb-nav-bar')!;
    const items = Array.from(
      root.querySelectorAll('md-gb-nav-bar-item'),
      (item) => new NavBarItemHarness(item),
    );
    return {bar, items};
  }

  function barRect(bar: NavBarElement): DOMRect {
    return bar.shadowRoot!.querySelector('.nav-bar')!.getBoundingClientRect();
  }

  function verticalBar(itemBadges: string[] = ['', '', '', '']) {
    return html`
      <div style="inline-size: 412px">
        <md-gb-nav-bar item-layout="vertical" aria-label="Navigation">
          <md-gb-nav-bar-item active badge=${itemBadges[0]}
            >Home</md-gb-nav-bar-item
          >
          <md-gb-nav-bar-item badge=${itemBadges[1]}
            >Explore</md-gb-nav-bar-item
          >
          <md-gb-nav-bar-item badge=${itemBadges[2]}
            >Library</md-gb-nav-bar-item
          >
          <md-gb-nav-bar-item badge=${itemBadges[3]}
            >Profile</md-gb-nav-bar-item
          >
        </md-gb-nav-bar>
      </div>
    `;
  }

  function horizontalBar(width: number, dir: 'ltr' | 'rtl' = 'ltr') {
    return html`
      <div style="inline-size: ${width}px" dir=${dir}>
        <md-gb-nav-bar item-layout="horizontal" aria-label="Navigation">
          <md-gb-nav-bar-item active badge="dot">For You</md-gb-nav-bar-item>
          <md-gb-nav-bar-item badge="3">Saved</md-gb-nav-bar-item>
          <md-gb-nav-bar-item>Settings</md-gb-nav-bar-item>
          <md-gb-nav-bar-item>Library</md-gb-nav-bar-item>
        </md-gb-nav-bar>
      </div>
    `;
  }

  it('renders item content into its shadow root', async () => {
    const {items} = await setup(verticalBar());

    expect(items[0].element.shadowRoot!.innerHTML.length).toBeGreaterThan(0);
    expect(items[0].rect('.nav-bar-item-label').width).toBeGreaterThan(0);
  });

  describe('keyboard', () => {
    it('opts out of the tablist focusgroup so Tab moves between items', async () => {
      const {bar} = await setup(verticalBar());

      expect(bar.getAttribute('focusgroup')).toBe('none');
    });

    it('makes every item a Tab stop, not just the active one', async () => {
      const {items} = await setup(verticalBar());

      expect(items.map((item) => item.element.tabIndex)).toEqual([0, 0, 0, 0]);
    });

    it('draws the focus ring above the active indicator', async () => {
      const {items} = await setup(horizontalBar(600));

      // Set the ring token directly rather than relying on each browser's
      // :focus-visible heuristics for synthetic keyboard focus.
      const item = items[0].part('.nav-bar-item');
      item.style.setProperty('--focus-ring-outline', '3px solid');
      const ring = getComputedStyle(item, '::after');

      expect(getComputedStyle(item).outlineStyle).toBe('none');
      expect(ring.outlineStyle).toBe('solid');
      expect(Number(ring.zIndex)).toBeGreaterThan(
        Number(getComputedStyle(items[0].part('.nav-bar-item-badge')).zIndex),
      );
    });
  });

  describe('CSS-only class API', () => {
    it('sizes horizontal items to their content', async () => {
      const host = env.render(html`<div style="inline-size: 800px"></div>`)
        .firstElementChild as HTMLElement;
      const shadow = host.attachShadow({mode: 'open'});
      adoptStyles(shadow, [navBarStyles]);
      render(
        html`
          <nav class="nav-bar nav-bar-horizontal">
            <button class="nav-bar-item nav-bar-item-horizontal">
              <span class="nav-bar-item-content">
                <span class="nav-bar-item-label">Home</span>
              </span>
            </button>
            <button class="nav-bar-item nav-bar-item-horizontal">
              <span class="nav-bar-item-content">
                <span class="nav-bar-item-label">Explore</span>
              </span>
            </button>
          </nav>
        `,
        shadow,
      );
      await env.waitForStability();

      const nav = shadow.querySelector('nav')!.getBoundingClientRect();
      const [first, second] = Array.from(
        shadow.querySelectorAll('button'),
        (button) => button.getBoundingClientRect(),
      );

      expect(first.width).toBeLessThan(nav.width / 4);
      expect(first.left - nav.left).toBeCloseTo(nav.right - second.right, 0);
    });
  });

  describe('vertical items', () => {
    it('uses a 4px gap between the indicator and the label', async () => {
      const {items} = await setup(verticalBar());

      const pill = items[0].pillRect();
      const label = items[0].rect('.nav-bar-item-label');

      expect(label.top - pill.bottom).toBeCloseTo(4, 0);
    });

    it('pads the icon by 16px inside the active indicator', async () => {
      const {items} = await setup(verticalBar());

      const pill = items[0].pillRect();
      const icon = items[0].rect('.nav-bar-item-icon');

      expect(pill.width).toBeCloseTo(56, 0);
      expect(icon.left - pill.left).toBeCloseTo(16, 0);
      expect(pill.right - icon.right).toBeCloseTo(16, 0);
    });

    it('keeps 6px between the item content and the bar top and bottom', async () => {
      const {bar, items} = await setup(verticalBar());

      const container = barRect(bar);
      const pill = items[0].pillRect();
      const label = items[0].rect('.nav-bar-item-label');

      expect(container.height).toBeCloseTo(64, 0);
      expect(pill.top - container.top).toBeCloseTo(6, 0);
      expect(container.bottom - label.bottom).toBeCloseTo(6, 0);
    });

    it('keeps the outer indicators away from the bar edges', async () => {
      const {bar, items} = await setup(verticalBar());

      const container = barRect(bar);

      expect(items[0].pillRect().left - container.left).toBeGreaterThan(16);
      expect(container.right - items[3].pillRect().right).toBeGreaterThan(16);
    });
  });

  describe('horizontal items', () => {
    it('uses a 4px gap between the icon and the label', async () => {
      const {items} = await setup(horizontalBar(600));

      const icon = items[0].rect('.nav-bar-item-icon');
      const label = items[0].rect('.nav-bar-item-label');

      expect(label.left - icon.right).toBeCloseTo(4, 0);
    });

    it('pads the active indicator by 16px on each side', async () => {
      const {items} = await setup(horizontalBar(600));

      const style = getComputedStyle(items[0].part('.nav-bar-item-content'));

      expect(style.paddingInlineStart).toBe('16px');
      expect(style.paddingInlineEnd).toBe('16px');
    });

    it('adds extra space to the ends of the bar', async () => {
      const {bar, items} = await setup(horizontalBar(800));

      const container = barRect(bar);
      const first = items[0].element.getBoundingClientRect();
      const last = items[3].element.getBoundingClientRect();

      expect(first.left - container.left).toBeCloseTo(
        container.right - last.right,
        0,
      );
      expect(first.left - container.left).toBeGreaterThan(16);
    });

    it('keeps 16px between the outer indicators and the bar edges when full', async () => {
      const {bar, items} = await setup(horizontalBar(360));

      const container = barRect(bar);

      expect(
        Math.round(items[0].pillRect().left - container.left),
      ).toBeGreaterThanOrEqual(16);
      expect(
        Math.round(container.right - items[3].pillRect().right),
      ).toBeGreaterThanOrEqual(16);
    });
  });

  describe('badges', () => {
    it('overlaps a large badge on the top corner of the icon', async () => {
      const {items} = await setup(verticalBar(['', '3', '', '']));

      const icon = items[1].rect('.nav-bar-item-icon');
      const badge = items[1].rect('.nav-bar-item-badge');

      expect(badge.left).toBeCloseTo(icon.right - 12, 0);
      expect(badge.top).toBeCloseTo(icon.top - 2, 0);
    });

    it('places a small badge inside the top corner of the icon', async () => {
      const {items} = await setup(verticalBar(['', '', 'dot', '']));

      const icon = items[2].rect('.nav-bar-item-icon');
      const badge = items[2].rect('.nav-bar-item-badge');

      expect(badge.right).toBeCloseTo(icon.right, 0);
      expect(badge.top).toBeCloseTo(icon.top, 0);
    });

    it('anchors badges to the icon in horizontal items', async () => {
      const {items} = await setup(horizontalBar(600));

      const icon = items[0].rect('.nav-bar-item-icon');
      const badge = items[0].rect('.nav-bar-item-badge');

      expect(badge.right).toBeCloseTo(icon.right, 0);
      expect(badge.top).toBeCloseTo(icon.top, 0);
    });

    it('mirrors badges to the icon start corner in RTL', async () => {
      const {items} = await setup(horizontalBar(600, 'rtl'));

      const icon = items[0].rect('.nav-bar-item-icon');
      const badge = items[0].rect('.nav-bar-item-badge');

      expect(badge.left).toBeCloseTo(icon.left, 0);
      expect(badge.top).toBeCloseTo(icon.top, 0);
    });
  });
});
