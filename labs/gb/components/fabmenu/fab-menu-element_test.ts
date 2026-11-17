/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {Harness} from '../../../../testing/harness.js';
import {internals} from '../../../behaviors/element-internals.js';
import {isFocusable} from '../../../behaviors/focusable.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {FabMenuElement} from './fab-menu-element.js';
import {FabMenuItemElement} from './fab-menu-item-element.js';
import './md-gb-fab-menu.js';
import './md-gb-fab-menu-item.js';

function getTrigger(menu: FabMenuElement): HTMLButtonElement {
  return menu.shadowRoot!.querySelector(
    'button.fab-menu-trigger',
  ) as HTMLButtonElement;
}

function getSurface(menu: FabMenuElement): HTMLDivElement {
  return menu.shadowRoot!.querySelector('.fab-menu-surface') as HTMLDivElement;
}

describe('FabMenuElement', () => {
  const env = new Environment();

  beforeAll(() => {
    const noTransitions = new CSSStyleSheet();
    noTransitions.replaceSync(`
      md-gb-fab-menu,
      md-gb-fab-menu-item {
        transition: none !important;
      }
    `);
    adoptStyles(document, [m3Styles, noTransitions]);
  });

  describe('custom element registration', () => {
    it('registers custom element md-gb-fab-menu', () => {
      const el = document.createElement('md-gb-fab-menu');
      expect(el).toBeInstanceOf(FabMenuElement);
      expect(customElements.get('md-gb-fab-menu')).toBeDefined();
    });

    it('registers custom element md-gb-fab-menu-item', () => {
      const el = document.createElement('md-gb-fab-menu-item');
      expect(el).toBeInstanceOf(FabMenuItemElement);
      expect(customElements.get('md-gb-fab-menu-item')).toBeDefined();
    });
  });

  describe('default properties', () => {
    it('has expected default properties on md-gb-fab-menu', async () => {
      const root = env.render(html`<md-gb-fab-menu></md-gb-fab-menu>`);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;

      expect(menu.color).toBe('primary-container');
      expect(menu.size).toBe('default');
      expect(menu.menuColor).toBe('standard');
      expect(menu.open).toBeFalse();
      expect(menu.icon).toBe('');
      expect(menu.label).toBe('');
    });

    it('has expected default properties on md-gb-fab-menu-item', async () => {
      const root = env.render(
        html`<md-gb-fab-menu-item>Item</md-gb-fab-menu-item>`,
      );
      await env.waitForStability();
      const item = root.querySelector(
        'md-gb-fab-menu-item',
      ) as FabMenuItemElement;

      expect(item.disabled).toBeFalse();
      expect(item.checked).toBeFalse();
      expect(item.selected).toBeFalse();
    });

    it('supports selected attribute and property alias on md-gb-fab-menu-item', async () => {
      const root = env.render(
        html`<md-gb-fab-menu-item checkable="single" selected
          >Item</md-gb-fab-menu-item
        >`,
      );
      await env.waitForStability();
      const item = root.querySelector(
        'md-gb-fab-menu-item',
      ) as FabMenuItemElement;

      expect(item.checked).toBeTrue();
      expect(item.selected).toBeTrue();

      item.selected = false;
      await env.waitForStability();
      expect(item.checked).toBeFalse();
    });
  });

  describe('ARIA semantics', () => {
    it('sets ARIA attributes on trigger and surface', async () => {
      const root = env.render(html`
        <md-gb-fab-menu aria-label="Quick actions" icon="add">
          <md-gb-fab-menu-item>Item 1</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const trigger = getTrigger(menu);
      const surface = getSurface(menu);

      expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
      expect(trigger.getAttribute('aria-controls')).toBe('menu');
      expect(trigger.getAttribute('aria-label')).toBe('Quick actions');
      expect(surface.getAttribute('role')).toBe('menu');

      menu.open = true;
      await env.waitForStability();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');
    });

    it('sets ARIA semantics and focusability on items', async () => {
      const root = env.render(html`
        <md-gb-fab-menu>
          <md-gb-fab-menu-item id="item1">Enabled</md-gb-fab-menu-item>
          <md-gb-fab-menu-item id="item2" disabled
            >Disabled</md-gb-fab-menu-item
          >
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const item1 = root.querySelector('#item1') as FabMenuItemElement;
      const item2 = root.querySelector('#item2') as FabMenuItemElement;

      expect(item1[internals].role).toBe('menuitem');
      expect(item1[internals].ariaDisabled).toBe('false');
      expect(item1[isFocusable]).toBeTrue();

      expect(item2[internals].role).toBe('menuitem');
      expect(item2[internals].ariaDisabled).toBe('true');
      expect(item2[isFocusable]).toBeFalse();
    });
  });

  describe('popover open/close & focus management', () => {
    it('toggles open state and popover on trigger click', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item>Item 1</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const trigger = getTrigger(menu);
      const surface = getSurface(menu);

      expect(menu.open).toBeFalse();
      expect(surface.matches(':popover-open')).toBeFalse();

      await new Harness(trigger).clickWithMouse();
      await env.waitForStability();
      expect(menu.open).toBeTrue();
      expect(surface.matches(':popover-open')).toBeTrue();

      await new Harness(trigger).clickWithMouse();
      await env.waitForStability();
      expect(menu.open).toBeFalse();
      expect(surface.matches(':popover-open')).toBeFalse();
    });

    it('opens and closes programmatically via menu.open', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item>Item 1</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const surface = getSurface(menu);

      menu.open = true;
      await env.waitForStability();
      expect(surface.matches(':popover-open')).toBeTrue();

      menu.open = false;
      await env.waitForStability();
      expect(surface.matches(':popover-open')).toBeFalse();
    });

    it('re-synchronizes popover open state when reconnected with open = true', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item>Item 1</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const surface = getSurface(menu);

      menu.remove();
      menu.open = true;
      await env.waitForStability();
      expect(surface.matches(':popover-open')).toBeFalse();

      root.appendChild(menu);
      await env.waitForStability();
      expect(surface.matches(':popover-open')).toBeTrue();
    });

    it('auto-focuses first enabled item on open', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="i1" disabled>Disabled</md-gb-fab-menu-item>
          <md-gb-fab-menu-item id="i2">First Enabled</md-gb-fab-menu-item>
          <md-gb-fab-menu-item id="i3">Second Enabled</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const trigger = getTrigger(menu);
      const i2 = root.querySelector('#i2') as FabMenuItemElement;

      await new Harness(trigger).clickWithMouse();
      await env.waitForStability();

      expect(document.activeElement).toBe(i2);
    });

    it('restores focus to trigger on Escape key', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="i1">Item 1</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const trigger = getTrigger(menu);
      const i1 = root.querySelector('#i1') as FabMenuItemElement;

      await new Harness(trigger).clickWithMouse();
      await env.waitForStability();
      expect(document.activeElement).toBe(i1);

      await new Harness(i1).keypress('Escape');
      await env.waitForStability();

      expect(menu.open).toBeFalse();
      expect(menu.shadowRoot!.activeElement).toBe(trigger);
    });

    it('does not steal focus on external light-dismiss if focus moved outside', async () => {
      const root = env.render(html`
        <div>
          <button id="external-btn">External</button>
          <md-gb-fab-menu icon="add">
            <md-gb-fab-menu-item id="i1">Item 1</md-gb-fab-menu-item>
          </md-gb-fab-menu>
        </div>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const externalBtn = root.querySelector(
        '#external-btn',
      ) as HTMLButtonElement;

      menu.open = true;
      await env.waitForStability();

      externalBtn.focus();
      menu.open = false;
      await env.waitForStability();

      expect(document.activeElement).toBe(externalBtn);
    });
  });

  describe('keyboard navigation', () => {
    it('navigates with ArrowDown/ArrowRight and ArrowUp/ArrowLeft wrapping around', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="item1">One</md-gb-fab-menu-item>
          <md-gb-fab-menu-item id="item2" disabled
            >Disabled</md-gb-fab-menu-item
          >
          <md-gb-fab-menu-item id="item3">Three</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const item1 = root.querySelector('#item1') as FabMenuItemElement;
      const item3 = root.querySelector('#item3') as FabMenuItemElement;
      const menuHarness = new Harness(menu);

      menu.open = true;
      await env.waitForStability();
      item1.focus();

      await menuHarness.keypress('ArrowDown');
      await env.waitForStability();
      expect(document.activeElement).toBe(item3);

      await menuHarness.keypress('ArrowDown');
      await env.waitForStability();
      expect(document.activeElement).toBe(item1);

      await menuHarness.keypress('ArrowUp');
      await env.waitForStability();
      expect(document.activeElement).toBe(item3);

      await menuHarness.keypress('ArrowLeft');
      await env.waitForStability();
      expect(document.activeElement).toBe(item1);

      await menuHarness.keypress('ArrowRight');
      await env.waitForStability();
      expect(document.activeElement).toBe(item3);
    });

    it('navigates with Home and End keys', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="item1">One</md-gb-fab-menu-item>
          <md-gb-fab-menu-item id="item2">Two</md-gb-fab-menu-item>
          <md-gb-fab-menu-item id="item3">Three</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const item1 = root.querySelector('#item1') as FabMenuItemElement;
      const item3 = root.querySelector('#item3') as FabMenuItemElement;
      const menuHarness = new Harness(menu);

      menu.open = true;
      await env.waitForStability();
      item1.focus();

      await menuHarness.keypress('End');
      await env.waitForStability();
      expect(document.activeElement).toBe(item3);

      await menuHarness.keypress('Home');
      await env.waitForStability();
      expect(document.activeElement).toBe(item1);
    });

    it('closes on Tab key without preventing default', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="item1">One</md-gb-fab-menu-item>
          <md-gb-fab-menu-item id="item2">Two</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const trigger = getTrigger(menu);
      const surface = getSurface(menu);

      menu.open = true;
      await env.waitForStability();

      let tabDefaultPrevented = false;
      let popoverOpenDuringKeydown = true;
      menu.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          tabDefaultPrevented = e.defaultPrevented;
          popoverOpenDuringKeydown = surface.matches(':popover-open');
        }
      });

      await new Harness(menu).keypress('Tab');
      await env.waitForStability();

      expect(menu.open).toBeFalse();
      expect(popoverOpenDuringKeydown).toBeFalse();
      expect(tabDefaultPrevented).toBeFalse();
      expect(menu.shadowRoot!.activeElement).toBe(trigger);
    });

    it('safely no-ops keyboard navigation when empty or all items disabled', async () => {
      const root = env.render(html`
        <md-gb-fab-menu id="m-empty" icon="add"></md-gb-fab-menu>
        <md-gb-fab-menu id="m-disabled" icon="add">
          <md-gb-fab-menu-item disabled>Disabled</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const mEmpty = root.querySelector('#m-empty') as FabMenuElement;
      const mDisabled = root.querySelector('#m-disabled') as FabMenuElement;
      const emptyHarness = new Harness(mEmpty);
      const disabledHarness = new Harness(mDisabled);

      await emptyHarness.keypress('ArrowDown');
      await emptyHarness.keypress('ArrowUp');
      await emptyHarness.keypress('Home');
      await emptyHarness.keypress('End');
      await disabledHarness.keypress('ArrowDown');
      await disabledHarness.keypress('ArrowUp');

      expect(mEmpty.open).toBeFalse();
      expect(mDisabled.open).toBeFalse();
    });
  });

  describe('item activation', () => {
    it('closes menu on item click', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="act-item">Action</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const item = root.querySelector('#act-item') as FabMenuItemElement;

      menu.open = true;
      await env.waitForStability();
      expect(menu.open).toBeTrue();

      await new Harness(item).clickWithMouse();
      await env.waitForStability();
      expect(menu.open).toBeFalse();
    });

    it('activates and closes menu on Enter and Space keys', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="enter-item">Action</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const item = root.querySelector('#enter-item') as FabMenuItemElement;
      const itemHarness = new Harness(item);

      menu.open = true;
      await env.waitForStability();

      await itemHarness.keypress('Enter');
      await env.waitForStability();
      expect(menu.open).toBeFalse();

      menu.open = true;
      await env.waitForStability();

      await itemHarness.keypress(' ');
      await env.waitForStability();
      expect(menu.open).toBeFalse();
    });

    it('does not close or activate when item is disabled', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="dis-item" disabled
            >Action</md-gb-fab-menu-item
          >
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const item = root.querySelector('#dis-item') as FabMenuItemElement;

      menu.open = true;
      await env.waitForStability();

      await new Harness(item).clickWithMouse();
      await env.waitForStability();
      expect(menu.open).toBeTrue();
    });

    it('does not close menu when item click is defaultPrevented', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="prev-item">Action</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('md-gb-fab-menu') as FabMenuElement;
      const item = root.querySelector('#prev-item') as FabMenuItemElement;

      item.addEventListener('click', (e) => {
        e.preventDefault();
      });

      menu.open = true;
      await env.waitForStability();

      await new Harness(item).clickWithMouse();
      await env.waitForStability();
      expect(menu.open).toBeTrue();
    });

    it('toggles checked and fires change and input events on checkable item', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="chk-item" checkable="single"
            >Checkable</md-gb-fab-menu-item
          >
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const item = root.querySelector('#chk-item') as FabMenuItemElement;

      let changeCount = 0;
      let inputCount = 0;
      item.addEventListener('change', () => {
        changeCount++;
      });
      item.addEventListener('input', () => {
        inputCount++;
      });

      await new Harness(item).clickWithMouse();
      await env.waitForStability();

      expect(item.checked).toBeTrue();
      expect(changeCount).toBe(1);
      expect(inputCount).toBe(1);

      await new Harness(item).clickWithMouse();
      await env.waitForStability();

      expect(item.checked).toBeTrue();
      expect(changeCount).toBe(1);
      expect(inputCount).toBe(1);
    });

    it('sets role, ariaChecked, and enforces mutual exclusion on single checkable items', async () => {
      const root = env.render(html`
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="radio1" checkable="single" checked
            >Radio 1</md-gb-fab-menu-item
          >
          <md-gb-fab-menu-item id="radio2" checkable="single"
            >Radio 2</md-gb-fab-menu-item
          >
          <md-gb-fab-menu-item id="checkbox" checkable="multiple"
            >Checkbox</md-gb-fab-menu-item
          >
          <md-gb-fab-menu-item id="regular">Regular</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const radio1 = root.querySelector('#radio1') as FabMenuItemElement;
      const radio2 = root.querySelector('#radio2') as FabMenuItemElement;
      const checkbox = root.querySelector('#checkbox') as FabMenuItemElement;
      const regular = root.querySelector('#regular') as FabMenuItemElement;

      expect(radio1[internals].role).toBe('menuitemradio');
      expect(radio1[internals].ariaChecked).toBe('true');
      expect(radio2[internals].role).toBe('menuitemradio');
      expect(radio2[internals].ariaChecked).toBe('false');
      expect(checkbox[internals].role).toBe('menuitemcheckbox');
      expect(checkbox[internals].ariaChecked).toBe('false');
      expect(regular[internals].role).toBe('menuitem');
      expect(regular[internals].ariaChecked).toBeNull();

      await new Harness(radio2).clickWithMouse();
      await env.waitForStability();

      expect(radio2.checked).toBeTrue();
      expect(radio2[internals].ariaChecked).toBe('true');
      expect(radio1.checked).toBeFalse();
      expect(radio1[internals].ariaChecked).toBe('false');
    });

    it('pierces shadow DOM boundaries for change and input events on checkable items', async () => {
      const root = env.render(html`<div></div>`);
      const wrapper = document.createElement('div');
      const shadow = wrapper.attachShadow({mode: 'open'});
      shadow.innerHTML = `
        <md-gb-fab-menu icon="add">
          <md-gb-fab-menu-item id="chk" checkable="multiple">Toggle</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `;
      root.appendChild(wrapper);
      await env.waitForStability();

      const item = shadow.querySelector('#chk') as FabMenuItemElement;
      let changeFiredOnWrapper = false;
      let inputFiredOnWrapper = false;

      wrapper.addEventListener('change', () => {
        changeFiredOnWrapper = true;
      });
      wrapper.addEventListener('input', () => {
        inputFiredOnWrapper = true;
      });

      await new Harness(item).clickWithMouse();
      await env.waitForStability();

      expect(changeFiredOnWrapper).toBeTrue();
      expect(inputFiredOnWrapper).toBeTrue();
    });
  });

  describe('dynamic items & DOM order', () => {
    it('maintains DOM order in menu.items on connect, disconnect, and reorder', async () => {
      const root = env.render(html`
        <md-gb-fab-menu id="dyn-menu" icon="add">
          <md-gb-fab-menu-item id="itemA">A</md-gb-fab-menu-item>
          <md-gb-fab-menu-item id="itemB">B</md-gb-fab-menu-item>
        </md-gb-fab-menu>
      `);
      await env.waitForStability();
      const menu = root.querySelector('#dyn-menu') as FabMenuElement;
      const itemA = root.querySelector('#itemA') as FabMenuItemElement;
      const itemB = root.querySelector('#itemB') as FabMenuItemElement;

      expect(menu.items).toEqual([itemA, itemB]);

      const itemC = document.createElement(
        'md-gb-fab-menu-item',
      ) as FabMenuItemElement;
      itemC.id = 'itemC';
      itemC.textContent = 'C';
      menu.appendChild(itemC);
      await env.waitForStability();
      expect(menu.items).toEqual([itemA, itemB, itemC]);

      menu.insertBefore(itemC, itemA);
      await env.waitForStability();
      expect(menu.items).toEqual([itemC, itemA, itemB]);

      itemB.remove();
      await env.waitForStability();
      expect(menu.items).toEqual([itemC, itemA]);
    });
  });
});
