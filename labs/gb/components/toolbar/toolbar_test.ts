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
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {ButtonElement} from '../button/button-element.js';
import {IconButtonElement} from '../iconbutton/icon-button-element.js';

import {ToolbarElement} from './toolbar-element.js';
import {styles as toolbarStyles} from './toolbar.cssresult.js';

/** Reads the protected `internals` field of a toolbar for assertions. */
function getInternals(toolbar: ToolbarElement): ElementInternals {
  return (toolbar as unknown as {internals: ElementInternals}).internals;
}

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

  describe('R1 & F6: disabled state & marker tracking', () => {
    it('reflects disabled property to attribute and sets internals ariaDisabled', async () => {
      const root = env.render(html`<md-gb-toolbar></md-gb-toolbar>`);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;

      expect(toolbar.disabled).toBeFalse();
      expect(toolbar.hasAttribute('disabled')).toBeFalse();
      expect(getInternals(toolbar).ariaDisabled).not.toBe('true');

      toolbar.disabled = true;
      await env.waitForStability();
      expect(toolbar.hasAttribute('disabled')).toBeTrue();
      expect(getInternals(toolbar).ariaDisabled).toBe('true');

      toolbar.disabled = false;
      await env.waitForStability();
      expect(toolbar.hasAttribute('disabled')).toBeFalse();
      expect(getInternals(toolbar).ariaDisabled).not.toBe('true');
    });

    it('propagates disabled to slotted items and preserves individually disabled items on re-enable', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn1">Action 1</md-gb-button>
          <md-gb-button id="btn2" disabled>Action 2</md-gb-button>
          <md-gb-icon-button id="icon1" aria-label="Icon 1"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const btn1 = root.querySelector('#btn1')! as ButtonElement;
      const btn2 = root.querySelector('#btn2')! as ButtonElement;
      const icon1 = root.querySelector('#icon1')! as IconButtonElement;

      expect(btn1.disabled).toBeFalse();
      expect(btn2.disabled).toBeTrue();
      expect(icon1.disabled).toBeFalse();

      toolbar.disabled = true;
      await env.waitForStability();

      expect(btn1.disabled).toBeTrue();
      expect(btn1.hasAttribute('data-toolbar-disabled')).toBeTrue();
      expect(btn2.disabled).toBeTrue();
      expect(btn2.hasAttribute('data-toolbar-disabled')).toBeFalse();
      expect(icon1.disabled).toBeTrue();
      expect(icon1.hasAttribute('data-toolbar-disabled')).toBeTrue();

      toolbar.disabled = false;
      await env.waitForStability();

      expect(btn1.disabled).toBeFalse();
      expect(btn1.hasAttribute('data-toolbar-disabled')).toBeFalse();
      expect(btn2.disabled).toBeTrue();
      expect(icon1.disabled).toBeFalse();
      expect(icon1.hasAttribute('data-toolbar-disabled')).toBeFalse();
    });

    it('re-enables items removed while disabled and re-inserted into an enabled toolbar on slotchange', async () => {
      const root = env.render(html`
        <div>
          <md-gb-toolbar id="tb1" disabled>
            <md-gb-button id="moveBtn">Movable</md-gb-button>
          </md-gb-toolbar>
          <md-gb-toolbar id="tb2"> </md-gb-toolbar>
        </div>
      `);
      await env.waitForStability();
      const tb2 = root.querySelector('#tb2')! as ToolbarElement;
      const moveBtn = root.querySelector('#moveBtn')! as ButtonElement;

      expect(moveBtn.disabled).toBeTrue();
      expect(moveBtn.hasAttribute('data-toolbar-disabled')).toBeTrue();

      // Move to enabled toolbar tb2
      tb2.appendChild(moveBtn);
      await env.waitForStability();

      expect(moveBtn.disabled).toBeFalse();
      expect(moveBtn.hasAttribute('data-toolbar-disabled')).toBeFalse();
    });

    it('applies disabled color tokens to selected buttons and icon buttons when toolbar is disabled without retaining pressed state container token on icon button', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn" type="toggle" selected>Edit</md-gb-button>
          <md-gb-icon-button
            id="icon"
            type="toggle"
            selected
            aria-label="Favorite"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const btn = root.querySelector('#btn')! as ButtonElement;
      const icon = root.querySelector('#icon')! as IconButtonElement;

      const innerBtn = btn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      const innerIcon = icon.shadowRoot!.querySelector(
        '[part="icon-btn"]',
      ) as HTMLElement;

      toolbar.disabled = true;
      await env.waitForStability();

      const btnStyles = getComputedStyle(innerBtn);
      const iconStyles = getComputedStyle(innerIcon);

      // Icon button pressed state is not present with a disabled color token
      expect(iconStyles.getPropertyValue('--container-color').trim()).toBe(
        'transparent',
      );
      expect(iconStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );

      // Labeled button has standard button container and 38% disabled content opacity
      expect(btnStyles.getPropertyValue('--container-color').trim()).toMatch(
        /12%|hsl\(from .* \/ 12%\)/,
      );
      expect(btnStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
      expect(btnStyles.getPropertyValue('--label-text-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
    });

    it('applies disabled color tokens to unselected buttons and icon buttons when toolbar is disabled', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn">Edit</md-gb-button>
          <md-gb-icon-button
            id="icon"
            aria-label="Favorite"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const btn = root.querySelector('#btn')! as ButtonElement;
      const icon = root.querySelector('#icon')! as IconButtonElement;

      const innerBtn = btn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      const innerIcon = icon.shadowRoot!.querySelector(
        '[part="icon-btn"]',
      ) as HTMLElement;

      toolbar.disabled = true;
      await env.waitForStability();

      const btnStyles = getComputedStyle(innerBtn);
      const iconStyles = getComputedStyle(innerIcon);

      expect(btnStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
      expect(btnStyles.getPropertyValue('--label-text-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
      expect(iconStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
    });

    it('triggers standard enabled state and drops content to disabled opacity on vibrant toolbars when disabled', async () => {
      const root = env.render(html`
        <md-gb-toolbar color="vibrant">
          <md-gb-button id="unselectedBtn">Action</md-gb-button>
          <md-gb-button id="selectedBtn" type="toggle" selected
            >Selected</md-gb-button
          >
          <md-gb-icon-button
            id="icon"
            type="toggle"
            selected
            aria-label="Icon"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const unselectedBtn = root.querySelector(
        '#unselectedBtn',
      )! as ButtonElement;
      const selectedBtn = root.querySelector('#selectedBtn')! as ButtonElement;
      const icon = root.querySelector('#icon')! as IconButtonElement;

      const innerUnselectedBtn = unselectedBtn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      const innerSelectedBtn = selectedBtn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      const innerIcon = icon.shadowRoot!.querySelector(
        '[part="icon-btn"]',
      ) as HTMLElement;
      const toolbarDiv = toolbar.shadowRoot!.querySelector(
        '[part="toolbar"]',
      ) as HTMLElement;

      toolbar.disabled = true;
      await env.waitForStability();

      const toolbarStyles = getComputedStyle(toolbarDiv);
      const unselectedStyles = getComputedStyle(innerUnselectedBtn);
      const selectedStyles = getComputedStyle(innerSelectedBtn);
      const iconStyles = getComputedStyle(innerIcon);

      // Toolbar container triggers standard enabled container color
      expect(
        toolbarStyles.getPropertyValue('--container-color').trim(),
      ).toMatch(
        /var\(--md-sys-color-surface-container\)|surface-container|light-dark/,
      );

      // Transitions are disabled so content drops instantly
      expect(toolbarStyles.transitionDuration).toBe('0s');

      // Unselected items on vibrant toolbar have disabled tokens (38% opacity)
      expect(unselectedStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
      expect(
        unselectedStyles.getPropertyValue('--label-text-color').trim(),
      ).toMatch(/hsl\(from .* h s l\s*\/\s*38%\)/);

      // Previously pressed button has standard button container and 38% disabled content opacity
      expect(
        selectedStyles.getPropertyValue('--container-color').trim(),
      ).toMatch(/12%|hsl\(from .* \/ 12%\)/);
      expect(selectedStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
      expect(
        selectedStyles.getPropertyValue('--label-text-color').trim(),
      ).toMatch(/hsl\(from .* h s l\s*\/\s*38%\)/);

      // Previously pressed icon button has transparent container (no pressed disabled token) and 38% disabled opacity
      expect(iconStyles.getPropertyValue('--container-color').trim()).toBe(
        'transparent',
      );
      expect(iconStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
    });

    it('applies standard container and disabled color tokens on .toolbar.toolbar-vibrant.disabled in CSS cascade', () => {
      const el = document.createElement('div');
      el.className = 'toolbar toolbar-vibrant disabled';
      document.body.appendChild(el);

      const styles = getComputedStyle(el);
      expect(styles.getPropertyValue('--container-color').trim()).toMatch(
        /var\(--md-sys-color-surface-container\)|surface-container|light-dark/,
      );
      expect(styles.getPropertyValue('--toolbar-icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
      expect(
        styles.getPropertyValue('--toolbar-label-text-color').trim(),
      ).toMatch(/hsl\(from .* h s l\s*\/\s*38%\)/);

      el.remove();
    });
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

    it('creates 4dp layout gap ensuring 4dp gap between adjacent target areas', async () => {
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
      const defaultSlot = toolbar.shadowRoot!.querySelector(
        'slot:not([name])',
      ) as HTMLSlotElement;
      const icon1 = root.querySelector('#icon1')! as IconButtonElement;
      const icon2 = root.querySelector('#icon2')! as IconButtonElement;

      expect(getComputedStyle(defaultSlot).gap).toBe('4px');

      const rect1 = icon1.getBoundingClientRect();
      const rect2 = icon2.getBoundingClientRect();
      const visualGap = Math.round(rect2.left - rect1.right);
      expect(visualGap).toBeGreaterThanOrEqual(3);
      expect(visualGap).toBeLessThanOrEqual(5);

      // Distance from the end of one target area to another is 4dp
      const targetArea1Right = rect1.right;
      const targetArea2Left = rect2.left;
      const targetAreaGap = Math.round(targetArea2Left - targetArea1Right);
      expect(targetAreaGap).toBeGreaterThanOrEqual(3);
      expect(targetAreaGap).toBeLessThanOrEqual(5);
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
  });

  describe('Toolbar pressed state clearance on disabled transition', () => {
    it('clears pressed/active state on icon button when entering disabled', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-icon-button
            id="icon"
            type="toggle"
            selected
            class="active"
            aria-pressed="true"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const icon = root.querySelector('#icon')! as IconButtonElement;
      const innerIcon = icon.shadowRoot!.querySelector(
        '[part="icon-btn"]',
      ) as HTMLElement;

      expect(icon.selected).toBeTrue();
      expect(icon.classList.contains('active')).toBeTrue();
      expect(icon.getAttribute('aria-pressed')).toBe('true');
      expect(
        getComputedStyle(icon).getPropertyValue('--md-icon-fill').trim(),
      ).toBe('1');

      toolbar.disabled = true;
      await env.waitForStability();

      expect(icon.selected).toBeFalse();
      expect(icon.hasAttribute('selected')).toBeFalse();
      expect(icon.classList.contains('active')).toBeFalse();
      expect(icon.getAttribute('aria-pressed')).not.toBe('true');
      expect(icon.getAttribute('aria-pressed')).toBe('false');
      expect(
        getComputedStyle(icon).getPropertyValue('--md-icon-fill').trim(),
      ).toBe('0');
      expect(
        getComputedStyle(innerIcon)
          .getPropertyValue('--container-color')
          .trim(),
      ).toBe('transparent');
    });

    it('clears pressed/active state on labeled button when entering disabled', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button
            id="btn"
            type="toggle"
            selected
            class="active btn-selected"
            aria-pressed="true"
            >Action</md-gb-button
          >
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const btn = root.querySelector('#btn')! as ButtonElement;

      toolbar.disabled = true;
      await env.waitForStability();

      expect(btn.selected).toBeFalse();
      expect(btn.hasAttribute('selected')).toBeFalse();
      expect(btn.classList.contains('active')).toBeFalse();
      expect(btn.classList.contains('btn-selected')).toBeFalse();
      expect(btn.getAttribute('aria-pressed')).not.toBe('true');
    });

    it('does not resurrect pressed state when toolbar is re-enabled', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-icon-button
            id="icon"
            type="toggle"
            selected
            class="active"
            aria-pressed="true"></md-gb-icon-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const icon = root.querySelector('#icon')! as IconButtonElement;

      toolbar.disabled = true;
      await env.waitForStability();

      toolbar.disabled = false;
      await env.waitForStability();

      expect(icon.disabled).toBeFalse();
      expect(icon.selected).toBeFalse();
      expect(icon.hasAttribute('selected')).toBeFalse();
      expect(icon.classList.contains('active')).toBeFalse();
      expect(icon.getAttribute('aria-pressed')).toBe('false');
    });

    it('clears pressed state on nested slot items and individual disabled transitions', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <div>
            <md-gb-icon-button
              id="nestedIcon"
              type="toggle"
              selected
              class="active"
              aria-pressed="true"></md-gb-icon-button>
          </div>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const nestedIcon = root.querySelector(
        '#nestedIcon',
      )! as IconButtonElement;

      toolbar.disabled = true;
      await env.waitForStability();

      expect(nestedIcon.selected).toBeFalse();
      expect(nestedIcon.hasAttribute('selected')).toBeFalse();
      expect(nestedIcon.classList.contains('active')).toBeFalse();
      expect(nestedIcon.getAttribute('aria-pressed')).not.toBe('true');
      expect(nestedIcon.getAttribute('aria-pressed')).toBe('false');

      // Re-enable toolbar and re-activate nested item
      toolbar.disabled = false;
      await env.waitForStability();

      nestedIcon.selected = true;
      nestedIcon.classList.add('active');
      nestedIcon.setAttribute('aria-pressed', 'true');
      await env.waitForStability();

      expect(nestedIcon.selected).toBeTrue();
      expect(nestedIcon.classList.contains('active')).toBeTrue();

      // Dynamically disabling individual item clears pressed state
      nestedIcon.disabled = true;
      await env.waitForStability();

      expect(nestedIcon.selected).toBeFalse();
      expect(nestedIcon.hasAttribute('selected')).toBeFalse();
      expect(nestedIcon.classList.contains('active')).toBeFalse();
      expect(nestedIcon.getAttribute('aria-pressed')).not.toBe('true');
      expect(nestedIcon.getAttribute('aria-pressed')).toBe('false');
    });

    it('clears pressed state on nested buttons when an intermediate container dynamically receives disabled', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <div id="container">
            <md-gb-icon-button
              id="nestedIcon"
              type="toggle"
              selected
              class="active"
              aria-pressed="true"></md-gb-icon-button>
            <md-gb-button
              id="nestedBtn"
              type="toggle"
              selected
              class="active btn-selected"
              aria-pressed="true"
              >Action</md-gb-button
            >
          </div>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const container = root.querySelector('#container')! as HTMLDivElement;
      const nestedIcon = root.querySelector(
        '#nestedIcon',
      )! as IconButtonElement;
      const nestedBtn = root.querySelector('#nestedBtn')! as ButtonElement;

      expect(nestedIcon.selected).toBeTrue();
      expect(nestedIcon.classList.contains('active')).toBeTrue();
      expect(nestedIcon.getAttribute('aria-pressed')).toBe('true');
      expect(nestedBtn.selected).toBeTrue();
      expect(nestedBtn.classList.contains('active')).toBeTrue();
      expect(nestedBtn.getAttribute('aria-pressed')).toBe('true');

      // Dynamically disable the intermediate container
      container.setAttribute('disabled', '');
      await env.waitForStability();

      expect(nestedIcon.selected).toBeFalse();
      expect(nestedIcon.hasAttribute('selected')).toBeFalse();
      expect(nestedIcon.classList.contains('active')).toBeFalse();
      expect(nestedIcon.getAttribute('aria-pressed')).toBe('false');

      expect(nestedBtn.selected).toBeFalse();
      expect(nestedBtn.hasAttribute('selected')).toBeFalse();
      expect(nestedBtn.classList.contains('active')).toBeFalse();
      expect(nestedBtn.getAttribute('aria-pressed')).toBe('false');
    });

    it('handles custom elements with read-only selected getter gracefully', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <div id="customItem"></div>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const customItem = root.querySelector('#customItem')! as HTMLDivElement;

      Object.defineProperty(customItem, 'selected', {
        get() {
          return true;
        },
        configurable: true,
      });

      expect(() => {
        toolbar.disabled = true;
      }).not.toThrow();
    });
  });

  describe('Disabled state enhancements (propagation, tokens, suppression)', () => {
    it('propagates disabled state to native buttons, custom elements, links, role=button, and form controls', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <button id="nativeBtn">Native Button</button>
          <md-gb-button id="customBtn">Custom Button</md-gb-button>
          <md-gb-icon-button id="iconBtn" aria-label="Icon"></md-gb-icon-button>
          <a id="linkBtn" href="#">Link Action</a>
          <span id="roleBtn" role="button" tabindex="0">Role Button</span>
          <span id="roleBtnNoTabindex" role="button"
            >Role Button No Tabindex</span
          >
          <input id="inputEl" type="text" />
          <select id="selectEl"
            ><option>1</option></select
          >
          <textarea id="textareaEl"></textarea>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const nativeBtn = root.querySelector('#nativeBtn')! as HTMLButtonElement;
      const customBtn = root.querySelector('#customBtn')! as ButtonElement;
      const iconBtn = root.querySelector('#iconBtn')! as IconButtonElement;
      const linkBtn = root.querySelector('#linkBtn')! as HTMLAnchorElement;
      const roleBtn = root.querySelector('#roleBtn')! as HTMLSpanElement;
      const roleBtnNoTabindex = root.querySelector(
        '#roleBtnNoTabindex',
      )! as HTMLSpanElement;
      const inputEl = root.querySelector('#inputEl')! as HTMLInputElement;
      const selectEl = root.querySelector('#selectEl')! as HTMLSelectElement;
      const textareaEl = root.querySelector(
        '#textareaEl',
      )! as HTMLTextAreaElement;

      expect(nativeBtn.disabled).toBeFalse();
      expect(customBtn.disabled).toBeFalse();
      expect(iconBtn.disabled).toBeFalse();
      expect(inputEl.disabled).toBeFalse();
      expect(selectEl.disabled).toBeFalse();
      expect(textareaEl.disabled).toBeFalse();

      toolbar.disabled = true;
      await env.waitForStability();

      // Native button & custom elements
      expect(nativeBtn.disabled).toBeTrue();
      expect(nativeBtn.getAttribute('aria-disabled')).toBe('true');
      expect(nativeBtn.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(customBtn.disabled).toBeTrue();
      expect(customBtn.getAttribute('aria-disabled')).toBe('true');
      expect(customBtn.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(iconBtn.disabled).toBeTrue();
      expect(iconBtn.getAttribute('aria-disabled')).toBe('true');
      expect(iconBtn.hasAttribute('data-toolbar-disabled')).toBeTrue();

      // Form controls
      expect(inputEl.disabled).toBeTrue();
      expect(inputEl.getAttribute('aria-disabled')).toBe('true');
      expect(inputEl.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(selectEl.disabled).toBeTrue();
      expect(selectEl.getAttribute('aria-disabled')).toBe('true');
      expect(selectEl.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(textareaEl.disabled).toBeTrue();
      expect(textareaEl.getAttribute('aria-disabled')).toBe('true');
      expect(textareaEl.hasAttribute('data-toolbar-disabled')).toBeTrue();

      // Links & role="button" elements
      expect(linkBtn.getAttribute('aria-disabled')).toBe('true');
      expect(linkBtn.getAttribute('tabindex')).toBe('-1');
      expect(linkBtn.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(roleBtn.getAttribute('aria-disabled')).toBe('true');
      expect(roleBtn.getAttribute('tabindex')).toBe('-1');
      expect(roleBtn.getAttribute('data-toolbar-prev-tabindex')).toBe('0');
      expect(roleBtn.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(roleBtnNoTabindex.getAttribute('aria-disabled')).toBe('true');
      expect(roleBtnNoTabindex.getAttribute('tabindex')).toBe('-1');
      expect(
        roleBtnNoTabindex.hasAttribute('data-toolbar-prev-tabindex'),
      ).toBeFalse();
      expect(
        roleBtnNoTabindex.hasAttribute('data-toolbar-disabled'),
      ).toBeTrue();
    });

    it('restores state on re-enable while preserving pre-disabled states', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <button id="nativeBtn">Native Button</button>
          <button id="preNative" disabled>Pre-disabled Native</button>
          <md-gb-button id="customBtn">Custom Button</md-gb-button>
          <md-gb-button id="preCustom" disabled
            >Pre-disabled Custom</md-gb-button
          >
          <a id="linkBtn" href="#">Link Action</a>
          <a id="preLink" href="#" aria-disabled="true">Pre-disabled Link</a>
          <span id="roleBtn" role="button" tabindex="0">Role Button</span>
          <span id="preRole" role="button" aria-disabled="true" tabindex="-1"
            >Pre-disabled Role</span
          >
          <span id="roleNoTab" role="button">Role No Tab</span>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const nativeBtn = root.querySelector('#nativeBtn')! as HTMLButtonElement;
      const preNative = root.querySelector('#preNative')! as HTMLButtonElement;
      const customBtn = root.querySelector('#customBtn')! as ButtonElement;
      const preCustom = root.querySelector('#preCustom')! as ButtonElement;
      const linkBtn = root.querySelector('#linkBtn')! as HTMLAnchorElement;
      const preLink = root.querySelector('#preLink')! as HTMLAnchorElement;
      const roleBtn = root.querySelector('#roleBtn')! as HTMLSpanElement;
      const preRole = root.querySelector('#preRole')! as HTMLSpanElement;
      const roleNoTab = root.querySelector('#roleNoTab')! as HTMLSpanElement;

      toolbar.disabled = true;
      await env.waitForStability();

      // Pre-disabled items must not be marked with data-toolbar-disabled
      expect(preNative.hasAttribute('data-toolbar-disabled')).toBeFalse();
      expect(preCustom.hasAttribute('data-toolbar-disabled')).toBeFalse();
      expect(preLink.hasAttribute('data-toolbar-disabled')).toBeFalse();
      expect(preRole.hasAttribute('data-toolbar-disabled')).toBeFalse();

      // Toolbar is now re-enabled
      toolbar.disabled = false;
      await env.waitForStability();

      // Items that were not pre-disabled are restored
      expect(nativeBtn.disabled).toBeFalse();
      expect(nativeBtn.hasAttribute('aria-disabled')).toBeFalse();
      expect(nativeBtn.hasAttribute('data-toolbar-disabled')).toBeFalse();

      expect(customBtn.disabled).toBeFalse();
      expect(customBtn.hasAttribute('aria-disabled')).toBeFalse();
      expect(customBtn.hasAttribute('data-toolbar-disabled')).toBeFalse();

      expect(linkBtn.hasAttribute('aria-disabled')).toBeFalse();
      expect(linkBtn.hasAttribute('tabindex')).toBeFalse();
      expect(linkBtn.hasAttribute('data-toolbar-disabled')).toBeFalse();

      expect(roleBtn.hasAttribute('aria-disabled')).toBeFalse();
      expect(roleBtn.getAttribute('tabindex')).toBe('0');
      expect(roleBtn.hasAttribute('data-toolbar-prev-tabindex')).toBeFalse();
      expect(roleBtn.hasAttribute('data-toolbar-disabled')).toBeFalse();

      expect(roleNoTab.hasAttribute('aria-disabled')).toBeFalse();
      expect(roleNoTab.hasAttribute('tabindex')).toBeFalse();
      expect(roleNoTab.hasAttribute('data-toolbar-disabled')).toBeFalse();

      // Pre-disabled items retain their disabled state
      expect(preNative.disabled).toBeTrue();
      expect(preCustom.disabled).toBeTrue();
      expect(preLink.getAttribute('aria-disabled')).toBe('true');
      expect(preRole.getAttribute('aria-disabled')).toBe('true');
    });

    it('applies GM3 12% opacity token on contained buttons and 38% opacity token on icons and labels', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn">Contained Button</md-gb-button>
          <md-gb-icon-button
            id="iconBtn"
            aria-label="Icon Action"></md-gb-icon-button>
          <button id="cssBtn" class="btn">CSS Contained Button</button>
          <button
            id="cssIconBtn"
            class="icon-btn"
            aria-label="CSS Icon Action"></button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const btn = root.querySelector('#btn')! as ButtonElement;
      const iconBtn = root.querySelector('#iconBtn')! as IconButtonElement;
      const cssBtn = root.querySelector('#cssBtn')! as HTMLButtonElement;
      const cssIconBtn = root.querySelector(
        '#cssIconBtn',
      )! as HTMLButtonElement;

      toolbar.disabled = true;
      await env.waitForStability();

      const innerBtn = btn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      const innerIconBtn = iconBtn.shadowRoot!.querySelector(
        '[part="icon-btn"]',
      ) as HTMLElement;

      const innerBtnStyles = getComputedStyle(innerBtn);
      const iconBtnStyles = getComputedStyle(innerIconBtn);
      const cssBtnStyles = getComputedStyle(cssBtn);
      const cssIconBtnStyles = getComputedStyle(cssIconBtn);

      // Contained buttons have 12% on-surface container token
      expect(
        innerBtnStyles.getPropertyValue('--container-color').trim(),
      ).toMatch(/12%|hsl\(from .* \/ 12%\)/);
      expect(cssBtnStyles.getPropertyValue('--container-color').trim()).toMatch(
        /12%|hsl\(from .* \/ 12%\)/,
      );

      // Uncontained icon buttons have transparent container and fill: 0
      expect(iconBtnStyles.getPropertyValue('--container-color').trim()).toBe(
        'transparent',
      );
      expect(iconBtnStyles.getPropertyValue('--md-icon-fill').trim()).toBe('0');
      expect(
        cssIconBtnStyles.getPropertyValue('--container-color').trim(),
      ).toBe('transparent');
      expect(cssIconBtnStyles.getPropertyValue('--md-icon-fill').trim()).toBe(
        '0',
      );

      // 38% disabled tokens on icons and labels
      expect(innerBtnStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
      expect(
        innerBtnStyles.getPropertyValue('--label-text-color').trim(),
      ).toMatch(/hsl\(from .* h s l\s*\/\s*38%\)/);
    });

    it('suppresses pointer events, cursor, and state layers across host, slots, and descendants', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-button id="btn">Action</md-gb-button>
          <md-gb-icon-button
            id="iconBtn"
            aria-label="Icon Action"></md-gb-icon-button>
          <button id="nativeBtn">Native</button>
          <a id="linkBtn" href="#">Link</a>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const toolbarDiv = toolbar.shadowRoot!.querySelector(
        '[part="toolbar"]',
      )! as HTMLElement;
      const slot = toolbar.shadowRoot!.querySelector(
        'slot:not([name])',
      )! as HTMLSlotElement;
      const btn = root.querySelector('#btn')! as ButtonElement;
      const iconBtn = root.querySelector('#iconBtn')! as IconButtonElement;
      const nativeBtn = root.querySelector('#nativeBtn')! as HTMLButtonElement;
      const linkBtn = root.querySelector('#linkBtn')! as HTMLAnchorElement;

      toolbar.disabled = true;
      await env.waitForStability();

      // Host, toolbar part, slot, and items have pointer-events: none and cursor: default
      const tbStyles = getComputedStyle(toolbar);
      const partStyles = getComputedStyle(toolbarDiv);
      const slotStyles = getComputedStyle(slot);
      const btnStyles = getComputedStyle(btn);
      const iconBtnStyles = getComputedStyle(iconBtn);
      const nativeBtnStyles = getComputedStyle(nativeBtn);
      const linkBtnStyles = getComputedStyle(linkBtn);

      expect(tbStyles.pointerEvents).toBe('none');
      expect(tbStyles.cursor).toBe('default');
      expect(partStyles.pointerEvents).toBe('none');
      expect(partStyles.cursor).toBe('default');
      expect(slotStyles.pointerEvents).toBe('none');
      expect(slotStyles.cursor).toBe('default');
      expect(btnStyles.pointerEvents).toBe('none');
      expect(btnStyles.cursor).toBe('default');
      expect(iconBtnStyles.pointerEvents).toBe('none');
      expect(iconBtnStyles.cursor).toBe('default');
      expect(nativeBtnStyles.pointerEvents).toBe('none');
      expect(nativeBtnStyles.cursor).toBe('default');
      expect(linkBtnStyles.pointerEvents).toBe('none');
      expect(linkBtnStyles.cursor).toBe('default');

      // Ripple / state layer suppression tokens
      expect(
        tbStyles.getPropertyValue('--ripple-hover-opacity').trim(),
      ).toMatch(/^0%?$/);
      expect(
        tbStyles.getPropertyValue('--ripple-press-opacity').trim(),
      ).toMatch(/^0%?$/);
      expect(tbStyles.getPropertyValue('--state-layer-color').trim()).toBe(
        'transparent',
      );

      expect(
        btnStyles.getPropertyValue('--ripple-hover-opacity').trim(),
      ).toMatch(/^0%?$/);
      expect(
        btnStyles.getPropertyValue('--ripple-press-opacity').trim(),
      ).toMatch(/^0%?$/);
      expect(btnStyles.getPropertyValue('--state-layer-color').trim()).toBe(
        'transparent',
      );

      // Active / hover state transform suppression
      btn.classList.add('active');
      await env.waitForStability();
      expect(getComputedStyle(btn).transform).toBe('none');
      btn.classList.remove('active');
    });

    it('propagates disabled state to items dynamically appended into a nested container while disabled', async () => {
      const root = env.render(html`
        <md-gb-toolbar disabled>
          <div id="nestedContainer">
            <button id="initialBtn">Initial</button>
          </div>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const container = root.querySelector(
        '#nestedContainer',
      )! as HTMLDivElement;
      const initialBtn = root.querySelector(
        '#initialBtn',
      )! as HTMLButtonElement;

      expect(initialBtn.disabled).toBeTrue();
      expect(initialBtn.getAttribute('aria-disabled')).toBe('true');

      const dynamicBtn = document.createElement('button');
      dynamicBtn.id = 'dynamicBtn';
      dynamicBtn.textContent = 'Dynamic';
      container.appendChild(dynamicBtn);
      await env.waitForStability();

      expect(dynamicBtn.disabled).toBeTrue();
      expect(dynamicBtn.getAttribute('aria-disabled')).toBe('true');
      expect(dynamicBtn.hasAttribute('data-toolbar-disabled')).toBeTrue();
    });

    it('propagates disabled state and tabindex -1 to composite ARIA roles', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <div id="switchEl" role="switch" tabindex="0" aria-checked="false">
            Switch
          </div>
          <div id="menuItemEl" role="menuitem" tabindex="0">Menu Item</div>
          <span id="checkboxEl" role="checkbox" tabindex="0" aria-checked="true"
            >Checkbox</span
          >
          <span id="radioEl" role="radio" tabindex="-1" aria-checked="false"
            >Radio</span
          >
          <div id="noTabitem" role="menuitem">No Tab Item</div>
        </md-gb-toolbar>
      `);
      await env.waitForStability();
      const toolbar = root.querySelector('md-gb-toolbar')! as ToolbarElement;
      const switchEl = root.querySelector('#switchEl')! as HTMLDivElement;
      const menuItemEl = root.querySelector('#menuItemEl')! as HTMLDivElement;
      const checkboxEl = root.querySelector('#checkboxEl')! as HTMLSpanElement;
      const radioEl = root.querySelector('#radioEl')! as HTMLSpanElement;
      const noTabitem = root.querySelector('#noTabitem')! as HTMLDivElement;

      toolbar.disabled = true;
      await env.waitForStability();

      expect(switchEl.getAttribute('aria-disabled')).toBe('true');
      expect(switchEl.getAttribute('tabindex')).toBe('-1');
      expect(switchEl.getAttribute('data-toolbar-prev-tabindex')).toBe('0');
      expect(switchEl.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(menuItemEl.getAttribute('aria-disabled')).toBe('true');
      expect(menuItemEl.getAttribute('tabindex')).toBe('-1');
      expect(menuItemEl.getAttribute('data-toolbar-prev-tabindex')).toBe('0');
      expect(menuItemEl.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(checkboxEl.getAttribute('aria-disabled')).toBe('true');
      expect(checkboxEl.getAttribute('tabindex')).toBe('-1');
      expect(checkboxEl.getAttribute('data-toolbar-prev-tabindex')).toBe('0');
      expect(checkboxEl.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(radioEl.getAttribute('aria-disabled')).toBe('true');
      expect(radioEl.getAttribute('tabindex')).toBe('-1');
      expect(radioEl.getAttribute('data-toolbar-prev-tabindex')).toBe('-1');
      expect(radioEl.hasAttribute('data-toolbar-disabled')).toBeTrue();

      expect(noTabitem.getAttribute('aria-disabled')).toBe('true');
      expect(noTabitem.getAttribute('tabindex')).toBe('-1');
      expect(noTabitem.hasAttribute('data-toolbar-prev-tabindex')).toBeFalse();
      expect(noTabitem.hasAttribute('data-toolbar-disabled')).toBeTrue();

      toolbar.disabled = false;
      await env.waitForStability();

      expect(switchEl.hasAttribute('aria-disabled')).toBeFalse();
      expect(switchEl.getAttribute('tabindex')).toBe('0');
      expect(switchEl.hasAttribute('data-toolbar-disabled')).toBeFalse();

      expect(menuItemEl.hasAttribute('aria-disabled')).toBeFalse();
      expect(menuItemEl.getAttribute('tabindex')).toBe('0');
      expect(menuItemEl.hasAttribute('data-toolbar-disabled')).toBeFalse();

      expect(checkboxEl.hasAttribute('aria-disabled')).toBeFalse();
      expect(checkboxEl.getAttribute('tabindex')).toBe('0');
      expect(checkboxEl.hasAttribute('data-toolbar-disabled')).toBeFalse();

      expect(radioEl.hasAttribute('aria-disabled')).toBeFalse();
      expect(radioEl.getAttribute('tabindex')).toBe('-1');
      expect(radioEl.hasAttribute('data-toolbar-disabled')).toBeFalse();

      expect(noTabitem.hasAttribute('aria-disabled')).toBeFalse();
      expect(noTabitem.hasAttribute('tabindex')).toBeFalse();
      expect(noTabitem.hasAttribute('data-toolbar-disabled')).toBeFalse();
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

  describe('Toolbar slot item disabled state and selected state layer removal', () => {
    it('removes selected state layer and clears selected when individual default or trailing slot button becomes disabled', async () => {
      const root = env.render(html`
        <md-gb-toolbar>
          <md-gb-icon-button
            slot="leading"
            id="leadingIcon"
            type="toggle"
            selected
            aria-label="Undo">
            <md-gb-icon>undo</md-gb-icon>
          </md-gb-icon-button>
          <md-gb-button id="defaultBtn" type="toggle" selected>
            <md-gb-icon>edit</md-gb-icon>
            Edit
          </md-gb-button>
          <md-gb-button slot="trailing" id="trailingBtn" type="toggle" selected>
            <md-gb-icon>more_vert</md-gb-icon>
            Options
          </md-gb-button>
        </md-gb-toolbar>
      `);
      await env.waitForStability();

      const leadingIcon = root.querySelector(
        '#leadingIcon',
      )! as IconButtonElement;
      const defaultBtn = root.querySelector('#defaultBtn')! as ButtonElement;
      const trailingBtn = root.querySelector('#trailingBtn')! as ButtonElement;

      expect(leadingIcon.selected).toBeTrue();
      expect(defaultBtn.selected).toBeTrue();
      expect(trailingBtn.selected).toBeTrue();

      // Disabling default slot button removes its selected state layer
      defaultBtn.disabled = true;
      await env.waitForStability();

      expect(defaultBtn.selected).toBeFalse();
      expect(defaultBtn.hasAttribute('selected')).toBeFalse();

      const innerDefault = defaultBtn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      const defaultStyles = getComputedStyle(innerDefault);
      expect(
        defaultStyles.getPropertyValue('--container-color').trim(),
      ).toMatch(/12%|hsl\(from .* \/ 12%\)/);
      expect(defaultStyles.getPropertyValue('--md-icon-fill').trim()).toBe('0');
      expect(defaultStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
      expect(
        defaultStyles.getPropertyValue('--label-text-color').trim(),
      ).toMatch(/hsl\(from .* h s l\s*\/\s*38%\)/);

      // Disabling trailing slot button (icon with label) removes its selected state layer
      trailingBtn.disabled = true;
      await env.waitForStability();

      expect(trailingBtn.selected).toBeFalse();
      expect(trailingBtn.hasAttribute('selected')).toBeFalse();

      const innerTrailing = trailingBtn.shadowRoot!.querySelector(
        '[part="btn"]',
      ) as HTMLElement;
      const trailingStyles = getComputedStyle(innerTrailing);
      expect(
        trailingStyles.getPropertyValue('--container-color').trim(),
      ).toMatch(/12%|hsl\(from .* \/ 12%\)/);
      expect(trailingStyles.getPropertyValue('--md-icon-fill').trim()).toBe(
        '0',
      );
      expect(trailingStyles.getPropertyValue('--icon-color').trim()).toMatch(
        /hsl\(from .* h s l\s*\/\s*38%\)/,
      );
      expect(
        trailingStyles.getPropertyValue('--label-text-color').trim(),
      ).toMatch(/hsl\(from .* h s l\s*\/\s*38%\)/);

      // Disabling leading icon button also removes its selected state layer
      leadingIcon.disabled = true;
      await env.waitForStability();

      expect(leadingIcon.selected).toBeFalse();
      expect(leadingIcon.hasAttribute('selected')).toBeFalse();

      const innerLeading = leadingIcon.shadowRoot!.querySelector(
        '[part="icon-btn"]',
      ) as HTMLElement;
      const leadingStyles = getComputedStyle(innerLeading);
      expect(leadingStyles.getPropertyValue('--container-color').trim()).toBe(
        'transparent',
      );
      expect(leadingStyles.getPropertyValue('--md-icon-fill').trim()).toBe('0');
    });
  });
});
