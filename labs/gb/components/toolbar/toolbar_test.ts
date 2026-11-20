/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import '../../styles/icon/md-gb-icon.js';
import '../button/md-gb-button.js';
import '../iconbutton/md-gb-icon-button.js';
import './md-gb-toolbar.js';

import {html} from 'lit';

import {Environment} from '../../../../testing/environment.js';
import {Harness} from '../../../../testing/harness.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import m3Styles from '../../styles/m3.css' with {type: 'css'}; // github-only
// import {styles as m3Styles} from '../../styles/m3.cssresult.js'; // google3-only
import {ButtonElement} from '../button/button-element.js';
import {IconButtonElement} from '../iconbutton/icon-button-element.js';

import {ToolbarElement} from './toolbar-element.js';
import toolbarStyles from './toolbar.css' with {type: 'css'}; // github-only
// import {styles as toolbarStyles} from './toolbar.cssresult.js'; // google3-only

describe('md-gb-toolbar', () => {
  const env = new Environment();

  beforeAll(() => {
    const noTransitions = new CSSStyleSheet();
    noTransitions.replaceSync(`
      md-gb-toolbar,
      md-gb-button,
      md-gb-icon-button,
      md-gb-button::part(btn),
      md-gb-icon-button::part(icon-btn) {
        transition: none !important;
      }
    `);
    adoptStyles(document, [m3Styles, toolbarStyles, noTransitions]);
  });

  describe('R2 & F3 & F5: button shapes & locked states', () => {
    it('sets circular shape for icon buttons and full pill shape for labeled buttons across rest, active, and selected', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn" type="toggle">Edit</md-gb-button>
          <md-gb-icon-button
            id="icon"
            type="toggle"
            aria-label="Favorite"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const btn = root.querySelector('#btn')! as ButtonElement;
      const icon = root.querySelector('#icon')! as IconButtonElement;

      const innerBtn = btn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      const innerIcon = icon.shadowRoot!.querySelector(
        '[part="icon-btn"]',
      ) as HTMLElement;

      // 1. Rest state
      const iconRadiusRest = getComputedStyle(innerIcon).borderRadius;
      const btnRadiusRest = getComputedStyle(innerBtn).borderRadius;
      expect(iconRadiusRest).toBe('50%');
      expect(btnRadiusRest).toBe('9999px');

      // 2. Active / pressed state
      btn.classList.add('active');
      icon.classList.add('active');
      await env.waitForStability();

      const iconRadiusActive = getComputedStyle(innerIcon).borderRadius;
      const btnRadiusActive = getComputedStyle(innerBtn).borderRadius;
      expect(iconRadiusActive).toBe('50%');
      expect(btnRadiusActive).toBe('9999px');

      btn.classList.remove('active');
      icon.classList.remove('active');

      // 3. Selected / toggled state
      btn.selected = true;
      icon.selected = true;
      await env.waitForStability();

      const iconRadiusSelected = getComputedStyle(innerIcon).borderRadius;
      const btnRadiusSelected = getComputedStyle(innerBtn).borderRadius;
      expect(iconRadiusSelected).toBe('50%');
      expect(btnRadiusSelected).toBe('9999px');
    });
  });

  describe('R3 & F5: vertical alignment & RTL', () => {
    it('applies computed align-items and logical margins in LTR and RTL', async () => {
      const root = env.render(html`
        <div
          id="container"
          style="display: flex; flex-direction: column; width: 200px;">
          <md-gb-toolbar id="tb" orientation="vertical" align="start">
            <md-gb-icon-button aria-label="Action"></md-gb-icon-button>
          </md-gb-toolbar>
        </div>
      `);
      await env.waitForStability();
      const container = root.querySelector('#container')! as HTMLElement;
      const toolbar = root.querySelector('#tb')! as ToolbarElement;
      const toolbarDiv = toolbar.shadowRoot!.querySelector(
        '[part="toolbar"]',
      )! as HTMLElement;

      // LTR - align: start
      expect(getComputedStyle(toolbarDiv).alignItems).toBe('flex-start');
      expect(getComputedStyle(toolbar).marginInlineStart).toBe('0px');

      // LTR - align: end
      toolbar.align = 'end';
      await env.waitForStability();
      expect(getComputedStyle(toolbarDiv).alignItems).toBe('flex-end');
      expect(getComputedStyle(toolbar).marginInlineEnd).toBe('0px');

      // RTL - align: start
      container.dir = 'rtl';
      toolbar.align = 'start';
      await env.waitForStability();
      expect(getComputedStyle(toolbarDiv).alignItems).toBe('flex-start');
      expect(getComputedStyle(toolbar).marginInlineStart).toBe('0px');

      // RTL - align: end
      toolbar.align = 'end';
      await env.waitForStability();
      expect(getComputedStyle(toolbarDiv).alignItems).toBe('flex-end');
      expect(getComputedStyle(toolbar).marginInlineEnd).toBe('0px');
    });
  });

  describe('R4 & F4 & F5: touch target size', () => {
    it('creates 48x48 touch target area on icon button and collapsed labeled button in hide-labels mode', async () => {
      const root = env.render(html`
        <md-gb-toolbar hide-labels>
          <md-gb-icon-button id="icon" aria-label="Action"></md-gb-icon-button>
          <md-gb-button id="btn"
            ><md-gb-icon>edit</md-gb-icon>Edit</md-gb-button
          >
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const icon = root.querySelector('#icon')! as IconButtonElement;
      const btn = root.querySelector('#btn')! as ButtonElement;

      expect(
        getComputedStyle(toolbar)
          .getPropertyValue('--touch-target-size')
          .trim(),
      ).toBe('48px');

      // Icon button ::before target
      const iconBtn = icon.shadowRoot!.querySelector('[part="icon-btn"]')!;
      const iconBeforeStyle = getComputedStyle(iconBtn, '::before');
      expect(iconBeforeStyle.width).toBe('48px');
      expect(iconBeforeStyle.height).toBe('48px');

      // Collapsed button in hide-labels mode ::before target (F4)
      const btnEl = btn.shadowRoot!.querySelector('[part="btn"]')!;
      const btnBeforeStyle = getComputedStyle(btnEl, '::before');
      expect(btnBeforeStyle.width).toBe('48px');
      expect(btnBeforeStyle.height).toBe('48px');
    });

    it('expands vertical touch target to 48px with width 100% on labeled buttons', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn">Action</md-gb-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const btn = root.querySelector('#btn')! as ButtonElement;
      const innerBtn = btn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;

      expect(getComputedStyle(innerBtn).position).toBe('relative');

      const beforeStyle = getComputedStyle(innerBtn, '::before');
      expect(beforeStyle.height).toBe('48px');
      const beforeWidth = Number(beforeStyle.width.replace('px', ''));
      expect(beforeWidth).toBeGreaterThan(0);
      expect(beforeWidth).toBeCloseTo(innerBtn.clientWidth, 0);
    });
  });

  describe('R5 & F5: slots and 4dp spacing', () => {
    it('applies has-slotted to non-empty slots, hides empty slots, and has 4px computed gap', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-icon-button
            slot="leading"
            aria-label="Leading"></md-gb-icon-button>
          <md-gb-icon-button aria-label="Default"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const leadingSlot = toolbar.shadowRoot!.querySelector(
        'slot[name="leading"]',
      ) as HTMLSlotElement;
      const defaultSlot = toolbar.shadowRoot!.querySelector(
        'slot:not([name])',
      ) as HTMLSlotElement;
      const trailingSlot = toolbar.shadowRoot!.querySelector(
        'slot[name="trailing"]',
      ) as HTMLSlotElement;

      expect(leadingSlot.classList.contains('has-slotted')).toBeTrue();
      expect(defaultSlot.classList.contains('has-slotted')).toBeTrue();
      expect(trailingSlot.classList.contains('has-slotted')).toBeFalse();

      expect(getComputedStyle(trailingSlot).display).toBe('none');
      expect(getComputedStyle(defaultSlot).display).toBe('flex');
      expect(getComputedStyle(defaultSlot).gap).toBe('4px');
    });

    it('places 40px buttons 4px apart in a floating toolbar', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-icon-button
            id="icon1"
            aria-label="Action 1"></md-gb-icon-button>
          <md-gb-icon-button
            id="icon2"
            aria-label="Action 2"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const icon1 = root.querySelector('#icon1')! as IconButtonElement;
      const icon2 = root.querySelector('#icon2')! as IconButtonElement;

      const rect1 = icon1.getBoundingClientRect();
      const rect2 = icon2.getBoundingClientRect();
      expect(Math.round(rect1.width)).toBe(40);
      expect(Math.round(rect2.left - rect1.right)).toBe(4);
    });

    it('has 8px inline padding between the floating container edge and its buttons', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-icon-button
            id="icon1"
            aria-label="Action 1"></md-gb-icon-button>
          <md-gb-icon-button
            id="icon2"
            aria-label="Action 2"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const container = toolbar.shadowRoot!.querySelector(
        '[part="toolbar"]',
      ) as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const rect1 = root.querySelector('#icon1')!.getBoundingClientRect();
      const rect2 = root.querySelector('#icon2')!.getBoundingClientRect();

      expect(Math.round(rect1.left - containerRect.left)).toBe(8);
      expect(Math.round(containerRect.right - rect2.right)).toBe(8);
    });

    it('keeps at least a 4px gap between buttons in a docked toolbar', async () => {
      // A 0px max forces clamp(min, 4vw, max) to its minimum, as on a narrow
      // screen where 4vw falls below the minimum spacing. The override targets
      // the inner container because it re-declares the toolbar tokens.
      const root = env.render(html`
        <style>
          .narrow::part(toolbar) {
            --docked-container-max-spacing: 0px;
          }
        </style>
        <md-gb-toolbar class="narrow" docked>
          <md-gb-icon-button
            id="icon1"
            aria-label="Action 1"></md-gb-icon-button>
          <md-gb-icon-button
            id="icon2"
            aria-label="Action 2"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const rect1 = root.querySelector('#icon1')!.getBoundingClientRect();
      const rect2 = root.querySelector('#icon2')!.getBoundingClientRect();

      expect(Math.round(rect2.left - rect1.right)).toBe(4);
    });
  });

  describe('R6 & F2 & F5: hide-labels without mutating light-DOM', () => {
    it('derives aria-label from direct text nodes without mutating DOM, preserves consumer aria-label, and reverts on toggle', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn"
            ><md-gb-icon>edit</md-gb-icon>Edit</md-gb-button
          >
          <md-gb-button id="customBtn" aria-label="Custom Name"
            ><md-gb-icon>star</md-gb-icon>Starred</md-gb-button
          >
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const btn = root.querySelector('#btn')! as ButtonElement;
      const customBtn = root.querySelector('#customBtn')! as ButtonElement;

      // 1. Initially hideLabels = false
      expect(btn.childNodes.length).toBe(2);
      expect(btn.childNodes[0].nodeName.toLowerCase()).toBe('md-gb-icon');
      expect(btn.childNodes[1].nodeType).toBe(Node.TEXT_NODE);
      expect(btn.hasAttribute('aria-label')).toBeFalse();
      expect(customBtn.getAttribute('aria-label')).toBe('Custom Name');

      // 2. Toggle hideLabels = true
      toolbar.hideLabels = true;
      await env.waitForStability();

      // Child DOM must NOT be mutated (no span wrappers inserted)
      expect(btn.childNodes.length).toBe(2);
      expect(btn.childNodes[1].nodeType).toBe(Node.TEXT_NODE);
      expect(btn.querySelector('.toolbar-label')).toBeNull();

      // Accessible name derived strictly from direct TEXT_NODE (ignoring
      // icon ligatures)
      expect(btn.getAttribute('aria-label')).toBe('Edit');
      expect(btn.hasAttribute('data-toolbar-label')).toBeTrue();

      // Consumer's pre-existing aria-label is preserved
      expect(customBtn.getAttribute('aria-label')).toBe('Custom Name');
      expect(customBtn.hasAttribute('data-toolbar-label')).toBeFalse();

      // Button geometry: 40x40 circle
      expect(btn.offsetWidth).toBeGreaterThanOrEqual(36);
      expect(btn.offsetWidth).toBeLessThanOrEqual(44);
      expect(btn.offsetHeight).toBeGreaterThanOrEqual(36);
      expect(btn.offsetHeight).toBeLessThanOrEqual(44);

      // Label is visually hidden
      expect(getComputedStyle(btn).fontSize).toBe('0px');
      const innerBtn = btn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      expect(getComputedStyle(innerBtn).fontSize).toBe('0px');
      const icon = btn.querySelector('md-gb-icon') as HTMLElement;
      expect(icon.offsetWidth).toBeGreaterThan(0);

      // 3. Toggle hideLabels = false (revert)
      toolbar.hideLabels = false;
      await env.waitForStability();

      // Auto-applied aria-label is removed
      expect(btn.hasAttribute('aria-label')).toBeFalse();
      expect(btn.hasAttribute('data-toolbar-label')).toBeFalse();

      // Consumer aria-label is still preserved
      expect(customBtn.getAttribute('aria-label')).toBe('Custom Name');

      // Label is visible again
      expect(getComputedStyle(btn).fontSize).not.toBe('0px');
    });

    it('extracts aria-label from text inside child elements while excluding md-gb-icon, .icon, and slot=container', async () => {
      const root = env.render(html`
        <md-gb-toolbar hide-labels>
          <md-gb-button id="spanBtn">
            <md-gb-icon>search</md-gb-icon>
            <span class="icon">ignored-icon</span>
            <div slot="container">ignored container</div>
            <span>Search</span>
          </md-gb-button>
          <md-gb-button id="nestedBtn">
            <span class="icon">ignored</span>
            <span>Nested <span>Text</span></span>
          </md-gb-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const spanBtn = root.querySelector('#spanBtn')! as ButtonElement;
      const nestedBtn = root.querySelector('#nestedBtn')! as ButtonElement;

      expect(spanBtn.getAttribute('aria-label')).toBe('Search');
      expect(nestedBtn.getAttribute('aria-label')).toBe('Nested Text');
    });

    it('collapses slotted light-DOM .btn dimensions, sets font-size: 0px, and provides ::before touch target', async () => {
      const root = env.render(html`
        <md-gb-toolbar hide-labels>
          <button class="btn" id="lightBtn">
            <md-gb-icon>edit</md-gb-icon>
            Edit
          </button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const lightBtn = root.querySelector('#lightBtn')! as HTMLButtonElement;

      // Verify dimensions collapsed to ~40x40px
      expect(lightBtn.offsetWidth).toBeGreaterThanOrEqual(36);
      expect(lightBtn.offsetWidth).toBeLessThanOrEqual(44);
      expect(lightBtn.offsetHeight).toBeGreaterThanOrEqual(36);
      expect(lightBtn.offsetHeight).toBeLessThanOrEqual(44);

      // Verify font-size: 0px
      expect(getComputedStyle(lightBtn).fontSize).toBe('0px');

      // Verify ::before touch target pseudo-element computed sizing
      const beforeStyle = getComputedStyle(lightBtn, '::before');
      expect(beforeStyle.content).not.toBe('none');
      expect(beforeStyle.position).toBe('absolute');
    });
  });

  describe('Hide-labels button shape stability and transition (no square overshoot)', () => {
    it('preserves --container-shape as var(--button-shape) and circular border-radius when hideLabels is toggled', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn"
            ><md-gb-icon>edit</md-gb-icon>Edit</md-gb-button
          >
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const btn = root.querySelector('#btn')! as ButtonElement;
      const innerBtn = btn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;

      toolbar.hideLabels = true;
      await env.waitForStability();

      const shape = getComputedStyle(innerBtn)
        .getPropertyValue('--container-shape')
        .trim();
      expect(shape).toMatch(/var\(--button-shape\)|9999px/);

      const borderRadius = getComputedStyle(innerBtn).borderRadius;
      expect(borderRadius).toMatch(/^(9999px|20px)( (9999px|20px))*$/);
      expect(borderRadius).not.toBe('0px');

      toolbar.hideLabels = false;
      await env.waitForStability();

      const revertedShape = getComputedStyle(innerBtn)
        .getPropertyValue('--container-shape')
        .trim();
      expect(revertedShape).toMatch(/var\(--button-shape\)|9999px/);
      expect(getComputedStyle(innerBtn).borderRadius).not.toBe('0px');
    });

    it('suppresses border-radius transitions on innerBtn to prevent cubic-bezier overshoot', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn"
            ><md-gb-icon>edit</md-gb-icon>Edit</md-gb-button
          >
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const btn = root.querySelector('#btn')! as ButtonElement;
      const innerBtn = btn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;

      const computedStyle = getComputedStyle(innerBtn);
      const properties = computedStyle.transitionProperty
        .split(',')
        .map((s) => s.trim());
      const durations = computedStyle.transitionDuration
        .split(',')
        .map((s) => s.trim());
      const borderRadiusIndex = properties.indexOf('border-radius');

      if (borderRadiusIndex !== -1) {
        const duration = durations[borderRadiusIndex % durations.length];
        expect(['0s', '0ms']).toContain(duration);
      } else {
        expect(properties).not.toContain('border-radius');
      }
    });

    it('maintains circular border-radius without square state when button is selected or active and hideLabels is toggled', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="toggleBtn" type="toggle" selected>
            <md-gb-icon>check</md-gb-icon>Done
          </md-gb-button>
          <md-gb-button id="activeBtn" class="active">
            <md-gb-icon>star</md-gb-icon>Star
          </md-gb-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const toggleBtn = root.querySelector('#toggleBtn')! as ButtonElement;
      const activeBtn = root.querySelector('#activeBtn')! as ButtonElement;
      const innerToggle = toggleBtn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      const innerActive = activeBtn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;

      // Toggle hideLabels = true
      toolbar.hideLabels = true;
      await env.waitForStability();

      const toggleShape = getComputedStyle(innerToggle)
        .getPropertyValue('--container-shape')
        .trim();
      expect(toggleShape).toMatch(/var\(--button-shape\)|9999px/);
      expect(getComputedStyle(innerToggle).borderRadius).toMatch(
        /^(9999px|20px)( (9999px|20px))*$/,
      );
      expect(getComputedStyle(innerToggle).borderRadius).not.toBe('0px');

      const activeShape = getComputedStyle(innerActive)
        .getPropertyValue('--container-shape')
        .trim();
      expect(activeShape).toMatch(/var\(--button-shape\)|9999px/);
      expect(getComputedStyle(innerActive).borderRadius).toMatch(
        /^(9999px|20px)( (9999px|20px))*$/,
      );
      expect(getComputedStyle(innerActive).borderRadius).not.toBe('0px');

      // Toggle hideLabels = false
      toolbar.hideLabels = false;
      await env.waitForStability();

      expect(getComputedStyle(innerToggle).borderRadius).toMatch(
        /^(9999px|20px)( (9999px|20px))*$/,
      );
      expect(getComputedStyle(innerToggle).borderRadius).not.toBe('0px');
      expect(getComputedStyle(innerActive).borderRadius).toMatch(
        /^(9999px|20px)( (9999px|20px))*$/,
      );
      expect(getComputedStyle(innerActive).borderRadius).not.toBe('0px');
    });

    it('maintains --container-shape as var(--button-shape) on slotted light-DOM .btn elements in hide-labels mode', async () => {
      const root = env.render(html`
        <md-gb-toolbar hide-labels>
          <button class="btn" id="lightBtn">Action</button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const lightBtn = root.querySelector('#lightBtn') as HTMLElement;
      const shape = getComputedStyle(lightBtn)
        .getPropertyValue('--container-shape')
        .trim();
      expect(shape).toMatch(/var\(--button-shape\)|9999px/);

      const computedStyle = getComputedStyle(lightBtn);
      const properties = computedStyle.transitionProperty
        .split(',')
        .map((s) => s.trim());
      const durations = computedStyle.transitionDuration
        .split(',')
        .map((s) => s.trim());
      const borderRadiusIndex = properties.indexOf('border-radius');

      if (borderRadiusIndex !== -1) {
        const duration = durations[borderRadiusIndex % durations.length];
        expect(['0s', '0ms']).toContain(duration);
      }
    });
  });

  describe('individually disabled buttons', () => {
    const DISABLED_CONTENT =
      'hsl(from var(--md-sys-color-on-surface) h s l / 38%)';
    const TRANSPARENT = 'rgba(0, 0, 0, 0)';

    /** Resolves a CSS color expression to its computed `color` value. */
    function resolveColor(root: HTMLElement, value: string): string {
      const probe = document.createElement('div');
      probe.style.color = value;
      root.appendChild(probe);
      const resolved = getComputedStyle(probe).color;
      probe.remove();
      return resolved;
    }

    /** Resolves a CSS color expression to its computed `background-color`. */
    function resolveBackground(root: HTMLElement, value: string): string {
      const probe = document.createElement('div');
      probe.style.backgroundColor = value;
      root.appendChild(probe);
      const resolved = getComputedStyle(probe).backgroundColor;
      probe.remove();
      return resolved;
    }

    function innerIconButton(icon: IconButtonElement): HTMLElement {
      return icon.shadowRoot!.querySelector('[part="icon-btn"]')!;
    }

    function innerButton(btn: ButtonElement): HTMLElement {
      return btn.shadowRoot!.querySelector('[part="btn"]')!;
    }

    for (const attr of ['disabled', 'soft-disabled'] as const) {
      for (const color of ['standard', 'vibrant'] as const) {
        for (const selected of [false, true]) {
          const state = selected ? 'selected' : 'unselected';

          it(`renders a ${attr} ${state} icon button in a ${color} toolbar with on-surface 38% icon color`, async () => {
            const root = env.render(html`
              <md-gb-toolbar color=${color}>
                <md-gb-icon-button
                  id="icon"
                  type="toggle"
                  aria-label="Favorite"
                  ?selected=${selected}
                  ?disabled=${attr === 'disabled'}
                  ?soft-disabled=${attr === 'soft-disabled'}>
                  <md-gb-icon>favorite</md-gb-icon>
                </md-gb-icon-button>
              </md-gb-toolbar>
            `);
            await env.waitForStability();
            const icon = root.querySelector('#icon')! as IconButtonElement;
            const glyph = icon.querySelector('md-gb-icon')! as HTMLElement;

            const expected = resolveColor(root, DISABLED_CONTENT);
            expect(getComputedStyle(innerIconButton(icon)).color).toBe(
              expected,
            );
            expect(getComputedStyle(glyph).color).toBe(expected);
          });

          it(`renders a ${attr} ${state} icon button in a ${color} toolbar with a transparent container`, async () => {
            const root = env.render(html`
              <md-gb-toolbar color=${color}>
                <md-gb-icon-button
                  id="icon"
                  type="toggle"
                  aria-label="Favorite"
                  ?selected=${selected}
                  ?disabled=${attr === 'disabled'}
                  ?soft-disabled=${attr === 'soft-disabled'}>
                  <md-gb-icon>favorite</md-gb-icon>
                </md-gb-icon-button>
              </md-gb-toolbar>
            `);
            await env.waitForStability();
            const icon = root.querySelector('#icon')! as IconButtonElement;

            expect(
              getComputedStyle(innerIconButton(icon)).backgroundColor,
            ).toBe(TRANSPARENT);
          });

          it(`renders a ${attr} ${state} labeled button in a ${color} toolbar with on-surface 38% label and icon colors`, async () => {
            const root = env.render(html`
              <md-gb-toolbar color=${color}>
                <md-gb-button
                  id="btn"
                  type="toggle"
                  ?selected=${selected}
                  ?disabled=${attr === 'disabled'}
                  ?soft-disabled=${attr === 'soft-disabled'}>
                  <md-gb-icon>edit</md-gb-icon>
                  Edit
                </md-gb-button>
              </md-gb-toolbar>
            `);
            await env.waitForStability();
            const btn = root.querySelector('#btn')! as ButtonElement;
            const glyph = btn.querySelector('md-gb-icon')! as HTMLElement;

            const expected = resolveColor(root, DISABLED_CONTENT);
            expect(getComputedStyle(innerButton(btn)).color).toBe(expected);
            expect(getComputedStyle(glyph).color).toBe(expected);
          });

          it(`renders a ${attr} ${state} labeled button in a ${color} toolbar with a transparent container`, async () => {
            const root = env.render(html`
              <md-gb-toolbar color=${color}>
                <md-gb-button
                  id="btn"
                  type="toggle"
                  ?selected=${selected}
                  ?disabled=${attr === 'disabled'}
                  ?soft-disabled=${attr === 'soft-disabled'}>
                  <md-gb-icon>edit</md-gb-icon>
                  Edit
                </md-gb-button>
              </md-gb-toolbar>
            `);
            await env.waitForStability();
            const btn = root.querySelector('#btn')! as ButtonElement;

            expect(getComputedStyle(innerButton(btn)).backgroundColor).toBe(
              TRANSPARENT,
            );
          });
        }
      }
    }

    it('removes the state layer from disabled buttons', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-icon-button id="icon" aria-label="Favorite" disabled>
            <md-gb-icon>favorite</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-button id="btn" disabled>Edit</md-gb-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const icon = root.querySelector('#icon')! as IconButtonElement;
      const btn = root.querySelector('#btn')! as ButtonElement;

      expect(getComputedStyle(innerIconButton(icon)).backgroundImage).toBe(
        'none',
      );
      expect(getComputedStyle(innerButton(btn)).backgroundImage).toBe('none');
    });

    it('does not toggle disabled toggle buttons when clicked', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-icon-button
            id="icon"
            type="toggle"
            aria-label="Favorite"
            disabled>
            <md-gb-icon>favorite</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-button id="btn" type="toggle" disabled>Edit</md-gb-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const icon = root.querySelector('#icon')! as IconButtonElement;
      const btn = root.querySelector('#btn')! as ButtonElement;

      await new Harness(innerIconButton(icon)).clickWithMouse();
      await new Harness(innerButton(btn)).clickWithMouse();
      await env.waitForStability();

      expect(icon.selected).toBeFalse();
      expect(btn.selected).toBeFalse();
    });

    it('toggles an enabled sibling of a disabled button when clicked', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="disabled" type="toggle" disabled>Edit</md-gb-button>
          <md-gb-button id="enabled" type="toggle">Share</md-gb-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const enabled = root.querySelector('#enabled')! as ButtonElement;

      await new Harness(innerButton(enabled)).clickWithMouse();
      await env.waitForStability();

      expect(enabled.selected).toBeTrue();
    });

    it('keeps toolbar colors on an enabled sibling of a disabled button', async () => {
      const root = env.render(html`
        <md-gb-toolbar color="standard">
          <md-gb-button id="disabled" disabled>Edit</md-gb-button>
          <md-gb-button id="enabled">Share</md-gb-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const enabled = root.querySelector('#enabled')! as ButtonElement;
      const inner = getComputedStyle(innerButton(enabled));

      expect(inner.color).toBe(
        resolveColor(root, 'var(--md-sys-color-on-surface-variant)'),
      );
      expect(inner.backgroundColor).toBe(
        resolveBackground(root, 'var(--md-sys-color-surface-container)'),
      );
    });

    it('restores toolbar colors when a disabled button is re-enabled', async () => {
      const root = env.render(html`
        <md-gb-toolbar color="vibrant">
          <md-gb-icon-button id="icon" aria-label="Favorite" disabled>
            <md-gb-icon>favorite</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-button id="btn" disabled>Edit</md-gb-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const icon = root.querySelector('#icon')! as IconButtonElement;
      const btn = root.querySelector('#btn')! as ButtonElement;

      icon.disabled = false;
      btn.disabled = false;
      await env.waitForStability();

      const primary = resolveColor(root, 'var(--md-sys-color-primary)');
      const container = resolveBackground(
        root,
        'var(--md-sys-color-primary-container)',
      );
      expect(getComputedStyle(innerIconButton(icon)).color).toBe(primary);
      expect(getComputedStyle(innerIconButton(icon)).backgroundColor).toBe(
        container,
      );
      expect(getComputedStyle(innerButton(btn)).color).toBe(primary);
      expect(getComputedStyle(innerButton(btn)).backgroundColor).toBe(
        container,
      );
    });
  });
});
