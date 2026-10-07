/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {internals} from '../../../behaviors/element-internals.js';
import '../../styles/icon/md-gb-icon.js';
import '../button/md-gb-button.js';
import './md-gb-button-group.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import {type ButtonElement} from '../button/button-element.js';
import {ButtonGroupElement} from './button-group-element.js';

function inner(b: ButtonElement): HTMLElement {
  return b.shadowRoot!.querySelector('[part="btn"]') as HTMLElement;
}

describe('ButtonGroupElement', () => {
  const env = new Environment();

  beforeAll(() => {
    const noTransitions = new CSSStyleSheet();
    noTransitions.replaceSync(`
      md-gb-button,
      md-gb-button::part(btn),
      md-gb-button-group {
        transition: none !important;
      }
    `);
    adoptStyles(document, [m3Styles, noTransitions]);
  });

  it('registers custom element md-gb-button-group', () => {
    const el = document.createElement('md-gb-button-group');
    expect(el).toBeInstanceOf(ButtonGroupElement);
    expect(customElements.get('md-gb-button-group')).toBeDefined();
  });

  it('has expected default properties', async () => {
    const root = env.render(html`<md-gb-button-group></md-gb-button-group>`);
    await env.waitForStability();
    const group = root.querySelector(
      'md-gb-button-group',
    ) as ButtonGroupElement;

    expect(group.variant).toBe('standard');
    expect(group.selection).toBe('none');
    expect(group.required).toBeFalse();
    expect(group.disabled).toBeFalse();
  });

  it('sets role to toolbar via ElementInternals', async () => {
    const root = env.render(html`<md-gb-button-group></md-gb-button-group>`);
    await env.waitForStability();
    const group = root.querySelector(
      'md-gb-button-group',
    ) as ButtonGroupElement;

    expect(group[internals].role).toBe('toolbar');
  });

  it('sprouts classes onto host', async () => {
    const root = env.render(html`
      <md-gb-button-group id="std"></md-gb-button-group>
      <md-gb-button-group
        id="conn"
        variant="connected"
        disabled></md-gb-button-group>
    `);
    await env.waitForStability();
    const std = root.querySelector('#std') as ButtonGroupElement;
    const conn = root.querySelector('#conn') as ButtonGroupElement;

    expect(std.classList.contains('btn-group')).toBeTrue();
    expect(std.classList.contains('btn-group-standard')).toBeTrue();
    expect(std.classList.contains('btn-group-connected')).toBeFalse();

    expect(conn.classList.contains('btn-group')).toBeTrue();
    expect(conn.classList.contains('btn-group-connected')).toBeTrue();
    expect(conn.classList.contains('disabled')).toBeTrue();
  });

  it('preserves selection event handling after disconnecting and reconnecting', async () => {
    const root = env.render(html`
      <md-gb-button-group selection="single">
        <md-gb-button value="a"></md-gb-button>
      </md-gb-button-group>
    `);
    await env.waitForStability();

    const group = root.querySelector(
      'md-gb-button-group',
    ) as ButtonGroupElement;
    const btn = root.querySelector('md-gb-button') as ButtonElement;

    let changeCount = 0;
    group.addEventListener('change', () => {
      changeCount++;
    });

    inner(btn).click();
    await env.waitForStability();
    expect(changeCount).toBe(1);

    // Disconnect and reconnect
    group.remove();
    root.appendChild(group);
    await env.waitForStability();

    inner(btn).click();
    await env.waitForStability();
    expect(changeCount).toBe(2);
  });

  it('sets default focusgroup attribute', async () => {
    const root = env.render(html` <md-gb-button-group></md-gb-button-group> `);
    await env.waitForStability();
    const group = root.querySelector(
      'md-gb-button-group',
    ) as ButtonGroupElement;

    expect(group.getAttribute('focusgroup')).toBe('toolbar wrap inline');
  });

  it('preserves author-specified focusgroup attribute', async () => {
    const root = env.render(html`
      <md-gb-button-group focusgroup="toolbar wrap block"></md-gb-button-group>
    `);
    await env.waitForStability();
    const group = root.querySelector(
      'md-gb-button-group',
    ) as ButtonGroupElement;

    expect(group.getAttribute('focusgroup')).toBe('toolbar wrap block');
  });

  it('preserves aria-label on the host element', async () => {
    const root = env.render(html`
      <md-gb-button-group aria-label="Text styling"></md-gb-button-group>
    `);
    await env.waitForStability();
    const group = root.querySelector(
      'md-gb-button-group',
    ) as ButtonGroupElement;

    expect(group.getAttribute('aria-label')).toBe('Text styling');
  });

  describe('cascade', () => {
    it('cascades type=button when selection=none and type=toggle when selection=single or multiple', async () => {
      const root = env.render(html`
        <div>
          <md-gb-button-group id="none-group" selection="none">
            <md-gb-button id="none-btn">None</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="single-group" selection="single">
            <md-gb-button id="single-btn">Single</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="multi-group" selection="multiple">
            <md-gb-button id="multi-btn">Multi</md-gb-button>
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();
      const noneBtn = root.querySelector('#none-btn') as ButtonElement;
      const singleBtn = root.querySelector('#single-btn') as ButtonElement;
      const multiBtn = root.querySelector('#multi-btn') as ButtonElement;

      expect(noneBtn.getAttribute('type')).toBe('button');
      expect(singleBtn.getAttribute('type')).toBe('toggle');
      expect(multiBtn.getAttribute('type')).toBe('toggle');
    });

    it('preserves type=link on children with href', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="link-btn" href="https://google.com"
            >Link</md-gb-button
          >
          <md-gb-button id="action-btn">Action</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const linkBtn = root.querySelector('#link-btn') as ButtonElement;
      const actionBtn = root.querySelector('#action-btn') as ButtonElement;

      expect(linkBtn.type).toBe('link');
      expect(actionBtn.type).toBe('toggle');
    });

    it('defaults uncolored child buttons to tonal and preserves explicit color', async () => {
      const root = env.render(html`
        <md-gb-button-group>
          <md-gb-button id="default-btn">Default</md-gb-button>
          <md-gb-button id="filled-btn" color="filled">Filled</md-gb-button>
          <md-gb-button id="outlined-btn" color="outlined"
            >Outlined</md-gb-button
          >
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const defaultBtn = root.querySelector('#default-btn') as ButtonElement;
      const filledBtn = root.querySelector('#filled-btn') as ButtonElement;
      const outlinedBtn = root.querySelector('#outlined-btn') as ButtonElement;

      expect(defaultBtn.getAttribute('color')).toBe('tonal');
      expect(defaultBtn.color).toBe('tonal');
      expect(filledBtn.getAttribute('color')).toBe('filled');
      expect(filledBtn.color).toBe('filled');
      expect(outlinedBtn.getAttribute('color')).toBe('outlined');
      expect(outlinedBtn.color).toBe('outlined');
    });

    it('coerces explicit color="text" to tonal and logs a console warning', async () => {
      const warnSpy = spyOn(console, 'warn');
      const root = env.render(html`
        <md-gb-button-group>
          <md-gb-button id="text-btn" color="text">Text</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const textBtn = root.querySelector('#text-btn') as ButtonElement;

      expect(textBtn.getAttribute('color')).toBe('tonal');
      expect(textBtn.color).toBe('tonal');
      expect(warnSpy).toHaveBeenCalled();
    });

    it('cascades selection type to newly appended children', async () => {
      const root = env.render(html`
        <md-gb-button-group id="group" selection="single">
          <md-gb-button id="btn1">One</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector('#group') as ButtonGroupElement;
      const btn2 = document.createElement('md-gb-button');
      btn2.id = 'btn2';
      btn2.textContent = 'Two';
      group.appendChild(btn2);

      await env.waitForStability();
      expect(btn2.getAttribute('type')).toBe('toggle');
    });

    it('disables all children on group.disabled=true and restores only group-disabled children on re-enable', async () => {
      const root = env.render(html`
        <md-gb-button-group id="group">
          <md-gb-button id="btn1">Enabled</md-gb-button>
          <md-gb-button id="btn2" disabled>Pre-disabled</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector('#group') as ButtonGroupElement;
      const btn1 = root.querySelector('#btn1') as ButtonElement;
      const btn2 = root.querySelector('#btn2') as ButtonElement;

      expect(btn1.disabled).toBeFalse();
      expect(btn2.disabled).toBeTrue();

      group.disabled = true;
      await env.waitForStability();
      expect(btn1.disabled).toBeTrue();
      expect(btn2.disabled).toBeTrue();

      group.disabled = false;
      await env.waitForStability();
      expect(btn1.disabled).toBeFalse();
      expect(btn2.disabled).toBeTrue();
    });

    it('ignores non-button children', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <span id="label">Label</span>
          <md-gb-button id="btn">Button</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const label = root.querySelector('#label') as HTMLElement;
      const btn = root.querySelector('#btn') as ButtonElement;

      expect(label.hasAttribute('type')).toBeFalse();
      expect(btn.getAttribute('type')).toBe('toggle');
    });
  });

  describe('selection and events', () => {
    it('manages single optional selection', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="b1" value="one">One</md-gb-button>
          <md-gb-button id="b2" value="two">Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const b1 = root.querySelector('#b1') as ButtonElement;
      const b2 = root.querySelector('#b2') as ButtonElement;

      expect(group.value).toBe('');
      expect(group.selectedIndex).toBe(-1);

      inner(b1).click();
      await env.waitForStability();
      expect(b1.selected).toBeTrue();
      expect(b2.selected).toBeFalse();
      expect(group.value).toBe('one');
      expect(group.selectedIndex).toBe(0);

      inner(b2).click();
      await env.waitForStability();
      expect(b1.selected).toBeFalse();
      expect(b2.selected).toBeTrue();
      expect(group.value).toBe('two');
      expect(group.selectedIndex).toBe(1);

      inner(b2).click();
      await env.waitForStability();
      expect(b1.selected).toBeFalse();
      expect(b2.selected).toBeFalse();
      expect(group.value).toBe('');
      expect(group.selectedIndex).toBe(-1);
    });

    it('manages single required selection and blocks deselecting active button', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single" required>
          <md-gb-button id="b1" value="one" selected>One</md-gb-button>
          <md-gb-button id="b2" value="two">Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const b1 = root.querySelector('#b1') as ButtonElement;
      const b2 = root.querySelector('#b2') as ButtonElement;

      expect(b1.selected).toBeTrue();
      expect(group.value).toBe('one');

      // Clicking already selected button must NOT deselect it
      inner(b1).click();
      await env.waitForStability();
      expect(b1.selected).toBeTrue();
      expect(group.value).toBe('one');

      // Switching is allowed
      inner(b2).click();
      await env.waitForStability();
      expect(b1.selected).toBeFalse();
      expect(b2.selected).toBeTrue();
      expect(group.value).toBe('two');
    });

    it('auto-selects first selectable button in required single mode when none preselected', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single" required>
          <md-gb-button id="b1" disabled>Disabled</md-gb-button>
          <md-gb-button id="b2" href="/link">Link</md-gb-button>
          <md-gb-button id="b3" value="three">Three</md-gb-button>
          <md-gb-button id="b4" value="four">Four</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const b3 = root.querySelector('#b3') as ButtonElement;

      expect(b3.selected).toBeTrue();
      expect(group.value).toBe('three');
      expect(group.selectedIndex).toBe(2);
    });

    it('normalizes multiple preselected buttons in single mode to last-wins', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="b1" value="one" selected>One</md-gb-button>
          <md-gb-button id="b2" value="two" selected>Two</md-gb-button>
          <md-gb-button id="b3" value="three" selected>Three</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const b1 = root.querySelector('#b1') as ButtonElement;
      const b2 = root.querySelector('#b2') as ButtonElement;
      const b3 = root.querySelector('#b3') as ButtonElement;

      expect(b1.selected).toBeFalse();
      expect(b2.selected).toBeFalse();
      expect(b3.selected).toBeTrue();
      expect(group.value).toBe('three');
    });

    it('manages multiple selection mode', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="multiple">
          <md-gb-button id="b1" value="one">One</md-gb-button>
          <md-gb-button id="b2" value="two">Two</md-gb-button>
          <md-gb-button id="b3" value="three">Three</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const b1 = root.querySelector('#b1') as ButtonElement;
      const b2 = root.querySelector('#b2') as ButtonElement;
      const b3 = root.querySelector('#b3') as ButtonElement;

      inner(b1).click();
      inner(b3).click();
      await env.waitForStability();

      expect(b1.selected).toBeTrue();
      expect(b2.selected).toBeFalse();
      expect(b3.selected).toBeTrue();
      expect(group.values).toEqual(['one', 'three']);
      expect(group.selectedIndices).toEqual([0, 2]);

      inner(b1).click();
      await env.waitForStability();
      expect(b1.selected).toBeFalse();
      expect(group.values).toEqual(['three']);
    });

    it('does not toggle in none mode', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="none">
          <md-gb-button id="b1" value="one">One</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const b1 = root.querySelector('#b1') as ButtonElement;

      inner(b1).click();
      await env.waitForStability();
      expect(b1.selected).toBeFalse();
      expect(group.value).toBe('');
    });

    it('dispatches group input and change events with target===group and updated values', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="b1" value="one">One</md-gb-button>
          <md-gb-button id="b2" value="two">Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const b1 = root.querySelector('#b1') as ButtonElement;

      let inputCount = 0;
      let changeCount = 0;
      let valueInInput = '';
      let valueInChange = '';
      let inputTarget: unknown = null;
      let changeTarget: unknown = null;

      group.addEventListener('input', (e) => {
        inputCount++;
        inputTarget = e.target;
        valueInInput = group.value;
      });

      group.addEventListener('change', (e) => {
        changeCount++;
        changeTarget = e.target;
        valueInChange = group.value;
      });

      inner(b1).click();
      await env.waitForStability();

      expect(inputCount).toBe(1);
      expect(changeCount).toBe(1);
      expect(inputTarget).toBe(group);
      expect(changeTarget).toBe(group);
      expect(valueInInput).toBe('one');
      expect(valueInChange).toBe('one');
    });

    it('sets value programmatically in single mode', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="b1" value="one">One</md-gb-button>
          <md-gb-button id="b2" value="two">Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const b1 = root.querySelector('#b1') as ButtonElement;
      const b2 = root.querySelector('#b2') as ButtonElement;

      group.value = 'two';
      await env.waitForStability();
      expect(b1.selected).toBeFalse();
      expect(b2.selected).toBeTrue();
      expect(group.value).toBe('two');
    });

    it('enforces single-selection exclusivity when button.selected is set programmatically', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="b1" value="one" selected>One</md-gb-button>
          <md-gb-button id="b2" value="two">Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const b1 = root.querySelector('#b1') as ButtonElement;
      const b2 = root.querySelector('#b2') as ButtonElement;

      expect(b1.selected).toBeTrue();
      expect(b2.selected).toBeFalse();

      b2.selected = true;
      await env.waitForStability();
      expect(b1.selected).toBeFalse();
      expect(b2.selected).toBeTrue();
      expect(group.value).toBe('two');
    });

    it('enforces exclusivity on programmatic b.selected=true after moving group in DOM', async () => {
      const root = env.render(html`
        <div id="parent-container">
          <md-gb-button-group id="move-group" selection="single">
            <md-gb-button id="mb1" selected>One</md-gb-button>
            <md-gb-button id="mb2">Two</md-gb-button>
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();
      const container = root.querySelector('#parent-container') as HTMLElement;
      const group = root.querySelector('#move-group') as ButtonGroupElement;
      const mb1 = root.querySelector('#mb1') as ButtonElement;
      const mb2 = root.querySelector('#mb2') as ButtonElement;

      expect(mb1.selected).toBeTrue();
      expect(mb2.selected).toBeFalse();

      group.remove();
      container.appendChild(group);
      await env.waitForStability();

      mb2.selected = true;
      await env.waitForStability();

      expect(mb1.selected).toBeFalse();
      expect(mb2.selected).toBeTrue();
    });

    it('normalizes to last-selected child on switch from multiple to single selection', async () => {
      const root = env.render(html`
        <md-gb-button-group id="mode-grp" selection="multiple">
          <md-gb-button id="m1" value="one" selected>One</md-gb-button>
          <md-gb-button id="m2" value="two" selected>Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector('#mode-grp') as ButtonGroupElement;
      const m1 = root.querySelector('#m1') as ButtonElement;
      const m2 = root.querySelector('#m2') as ButtonElement;

      expect(m1.selected).toBeTrue();
      expect(m2.selected).toBeTrue();

      // Switch to single: last-wins
      group.selection = 'single';
      await env.waitForStability();

      expect(m1.selected).toBeFalse();
      expect(m2.selected).toBeTrue();
      expect(group.value).toBe('two');
    });

    it('clears selection state and removes aria-pressed on switch to selection none', async () => {
      const root = env.render(html`
        <md-gb-button-group id="mode-grp" selection="multiple">
          <md-gb-button id="m1" value="one" selected>One</md-gb-button>
          <md-gb-button id="m2" value="two" selected>Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector('#mode-grp') as ButtonGroupElement;
      const m1 = root.querySelector('#m1') as ButtonElement;
      const m2 = root.querySelector('#m2') as ButtonElement;

      // Switch to none: sets type=button and no aria-pressed on inner button
      group.selection = 'none';
      await env.waitForStability();

      expect(m1.getAttribute('type')).toBe('button');
      expect(m2.getAttribute('type')).toBe('button');
      expect(inner(m1).hasAttribute('aria-pressed')).toBeFalse();
      expect(inner(m2).hasAttribute('aria-pressed')).toBeFalse();
    });

    it('auto-selects first selectable when required=true dynamically with zero selected', async () => {
      const root = env.render(html`
        <md-gb-button-group id="req-dyn-grp" selection="single">
          <md-gb-button id="rd1" disabled>Disabled</md-gb-button>
          <md-gb-button id="rd2" value="two">Selectable</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector('#req-dyn-grp') as ButtonGroupElement;
      const rd2 = root.querySelector('#rd2') as ButtonElement;

      expect(rd2.selected).toBeFalse();

      group.required = true;
      await env.waitForStability();

      expect(rd2.selected).toBeTrue();
      expect(group.value).toBe('two');
    });

    it('selects first remaining selectable button when selected child is removed in required-single', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single" required>
          <md-gb-button id="rem1" selected>One</md-gb-button>
          <md-gb-button id="rem2">Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const rem1 = root.querySelector('#rem1') as ButtonElement;
      const rem2 = root.querySelector('#rem2') as ButtonElement;

      expect(rem1.selected).toBeTrue();
      expect(rem2.selected).toBeFalse();

      rem1.remove();
      await env.waitForStability();

      expect(rem2.selected).toBeTrue();
    });

    it('prefers newly appended selected child over existing selected child', async () => {
      const root = env.render(html`
        <md-gb-button-group id="app-grp" selection="single">
          <md-gb-button id="app1" selected>One</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector('#app-grp') as ButtonGroupElement;
      const app1 = root.querySelector('#app1') as ButtonElement;

      expect(app1.selected).toBeTrue();

      const app2 = document.createElement('md-gb-button');
      app2.id = 'app2';
      app2.selected = true;
      group.appendChild(app2);
      await env.waitForStability();

      expect(app1.selected).toBeFalse();
      expect(app2.selected).toBeTrue();
    });

    it('causes no toggle and no group events when soft-disabled child is clicked', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="soft-btn" soft-disabled value="soft"
            >Soft</md-gb-button
          >
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const softBtn = root.querySelector('#soft-btn') as ButtonElement;

      let eventFired = false;
      group.addEventListener('input', () => {
        eventFired = true;
      });
      group.addEventListener('change', () => {
        eventFired = true;
      });

      inner(softBtn).click();
      await env.waitForStability();

      expect(softBtn.selected).toBeFalse();
      expect(eventFired).toBeFalse();
    });

    it('does not fire form submit on click in none mode inside a form', async () => {
      let formSubmitted = false;
      const root = env.render(html`
        <form
          @submit=${(e: Event) => {
            e.preventDefault();
            formSubmitted = true;
          }}>
          <md-gb-button-group selection="none">
            <md-gb-button id="form-btn">Action</md-gb-button>
          </md-gb-button-group>
        </form>
      `);
      await env.waitForStability();
      const btn = root.querySelector('#form-btn') as ButtonElement;

      inner(btn).click();
      await env.waitForStability();

      expect(formSubmitted).toBeFalse();
    });

    it('ensures child input/change do not reach group parent, only group events do', async () => {
      const targetsReceived: EventTarget[] = [];
      const root = env.render(html`
        <div
          id="parent-wrapper"
          @input=${(e: Event) => {
            targetsReceived.push(e.target!);
          }}
          @change=${(e: Event) => {
            targetsReceived.push(e.target!);
          }}>
          <md-gb-button-group selection="single">
            <md-gb-button id="esc-btn" value="esc">Click</md-gb-button>
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const btn = root.querySelector('#esc-btn') as ButtonElement;

      inner(btn).click();
      await env.waitForStability();

      expect(targetsReceived.length).toBe(2);
      for (const t of targetsReceived) {
        expect(t).toBe(group);
      }
    });

    it('does not swallow input or change from non-button slotted child and does not produce group change', async () => {
      const wrapperEvents: Event[] = [];
      const root = env.render(html`
        <div
          id="wrapper"
          @input=${(e: Event) => wrapperEvents.push(e)}
          @change=${(e: Event) => wrapperEvents.push(e)}>
          <md-gb-button-group selection="single">
            <span id="slotted-span">Not a button</span>
            <md-gb-button id="btn1" value="one">One</md-gb-button>
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const span = root.querySelector('#slotted-span') as HTMLElement;

      const spanChange = new Event('change', {bubbles: true, composed: true});
      span.dispatchEvent(spanChange);
      await env.waitForStability();

      expect(wrapperEvents.length).toBe(1);
      expect(wrapperEvents[0]).toBe(spanChange);
      expect(wrapperEvents[0].target).toBe(span);
      expect(group.value).toBe('');

      const spanInput = new Event('input', {bubbles: true, composed: true});
      span.dispatchEvent(spanInput);
      await env.waitForStability();

      expect(wrapperEvents.length).toBe(2);
      expect(wrapperEvents[1]).toBe(spanInput);
      expect(wrapperEvents[1].target).toBe(span);
      expect(group.value).toBe('');
    });

    it('fires change event once per click', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="rec-btn" value="rec">Recursion</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const btn = root.querySelector('#rec-btn') as ButtonElement;

      let changeCount = 0;
      group.addEventListener('change', () => {
        changeCount++;
      });

      inner(btn).click();
      await env.waitForStability();

      expect(changeCount).toBe(1);
    });

    it('values is final inside input and change handlers in multiple mode', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="multiple">
          <md-gb-button id="mul-1" value="one" selected>One</md-gb-button>
          <md-gb-button id="mul-2" value="two">Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector(
        'md-gb-button-group',
      ) as ButtonGroupElement;
      const mul2 = root.querySelector('#mul-2') as ButtonElement;

      let valuesAtInput: string[] = [];
      let valuesAtChange: string[] = [];

      group.addEventListener('input', () => {
        valuesAtInput = [...group.values];
      });
      group.addEventListener('change', () => {
        valuesAtChange = [...group.values];
      });

      inner(mul2).click();
      await env.waitForStability();

      expect(valuesAtInput).toEqual(['one', 'two']);
      expect(valuesAtChange).toEqual(['one', 'two']);
    });

    it('ensures listener attached directly to child md-gb-button receives change event', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="direct-btn" value="direct">Direct</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const btn = root.querySelector('#direct-btn') as ButtonElement;

      let childChangeFired = false;
      let childChangeTarget: unknown = null;
      btn.addEventListener('change', (e: Event) => {
        childChangeFired = true;
        childChangeTarget = e.target;
      });

      inner(btn).click();
      await env.waitForStability();

      expect(childChangeFired).toBeTrue();
      expect(childChangeTarget).toBe(btn);
    });

    it('renormalizes when programmatic selected=false is set on the only selected button in required-single', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single" required>
          <md-gb-button id="renorm-btn" value="renorm" selected
            >Only</md-gb-button
          >
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const btn = root.querySelector('#renorm-btn') as ButtonElement;

      expect(btn.selected).toBeTrue();

      btn.selected = false;
      await env.waitForStability();

      expect(btn.selected).toBeTrue();
    });
  });

  describe('styles and tokens', () => {
    it('applies outer start and inner end radii to first child, and inner start outer end to last child', async () => {
      const root = env.render(html`
        <md-gb-button-group variant="connected">
          <md-gb-button id="c1" size="sm">One</md-gb-button>
          <md-gb-button id="c2" size="sm">Two</md-gb-button>
          <md-gb-button id="c3" size="sm">Three</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const c1 = root.querySelector('#c1') as ButtonElement;
      const c2 = root.querySelector('#c2') as ButtonElement;
      const c3 = root.querySelector('#c3') as ButtonElement;

      const s1 = getComputedStyle(inner(c1));
      const s2 = getComputedStyle(inner(c2));
      const s3 = getComputedStyle(inner(c3));

      expect(s1.borderTopLeftRadius).toBe('20px');
      expect(s1.borderBottomLeftRadius).toBe('20px');
      expect(s1.borderTopRightRadius).toBe('8px');
      expect(s1.borderBottomRightRadius).toBe('8px');

      expect(s2.borderTopLeftRadius).toBe('8px');
      expect(s2.borderTopRightRadius).toBe('8px');

      expect(s3.borderTopLeftRadius).toBe('8px');
      expect(s3.borderBottomLeftRadius).toBe('8px');
      expect(s3.borderTopRightRadius).toBe('20px');
      expect(s3.borderBottomRightRadius).toBe('20px');
    });

    it('morphs inner corners of selected button into a pill', async () => {
      const root = env.render(html`
        <md-gb-button-group variant="connected" selection="single">
          <md-gb-button id="c1" size="sm">One</md-gb-button>
          <md-gb-button id="c2" size="sm" selected>Two</md-gb-button>
          <md-gb-button id="c3" size="sm">Three</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const c2 = root.querySelector('#c2') as ButtonElement;
      const s2 = getComputedStyle(inner(c2));

      expect(s2.borderTopLeftRadius).toBe('20px');
      expect(s2.borderTopRightRadius).toBe('20px');
      expect(s2.borderBottomLeftRadius).toBe('20px');
      expect(s2.borderBottomRightRadius).toBe('20px');
    });

    it('sets overflow: visible on the group', async () => {
      const root = env.render(html`
        <md-gb-button-group id="focus-group">
          <md-gb-button id="fb1">One</md-gb-button>
          <md-gb-button id="fb2">Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const group = root.querySelector('#focus-group') as ButtonGroupElement;

      expect(getComputedStyle(group).overflow).toBe('visible');
    });

    it('stacks focused button above siblings with z-index', async () => {
      const root = env.render(html`
        <md-gb-button-group id="focus-group">
          <md-gb-button id="fb1">One</md-gb-button>
          <md-gb-button id="fb2">Two</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const fb1 = root.querySelector('#fb1') as ButtonElement;

      inner(fb1).focus();
      await env.waitForStability();
      expect(getComputedStyle(fb1).zIndex).toBe('1');
    });

    it('assigns md-gb-icon without slot attribute to default slot', async () => {
      const root = env.render(html`
        <md-gb-button-group selection="single">
          <md-gb-button id="icon-btn" aria-label="Star">
            <md-gb-icon id="test-icon">star</md-gb-icon>
          </md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const iconBtn = root.querySelector('#icon-btn') as ButtonElement;
      const testIcon = root.querySelector('#test-icon') as HTMLElement;
      const defaultSlot = iconBtn.shadowRoot!.querySelector(
        'slot:not([name])',
      ) as HTMLSlotElement;

      expect(testIcon.assignedSlot).toBe(defaultSlot);
    });

    it('computes pill corners on selected button in square connected group in any position', async () => {
      const root = env.render(html`
        <md-gb-button-group variant="connected" selection="single">
          <md-gb-button id="sq-b1" size="sm" square selected>One</md-gb-button>
          <md-gb-button id="sq-b2" size="sm" square>Two</md-gb-button>
          <md-gb-button id="sq-b3" size="sm" square>Three</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const b1 = root.querySelector('#sq-b1') as ButtonElement;
      const b2 = root.querySelector('#sq-b2') as ButtonElement;

      const s1 = getComputedStyle(inner(b1));
      // Selected first button in square connected group blooms all 4 corners to pill:
      // container-height / 2 = 40px / 2 = 20px
      expect(s1.borderTopLeftRadius).toBe('20px');
      expect(s1.borderBottomLeftRadius).toBe('20px');
      expect(s1.borderTopRightRadius).toBe('20px');
      expect(s1.borderBottomRightRadius).toBe('20px');

      // Now select the middle button
      inner(b2).click();
      await env.waitForStability();

      const s2 = getComputedStyle(inner(b2));
      // Middle button has all 4 corners as inner corners, so all compute to pill (20px)
      expect(s2.borderTopLeftRadius).toBe('20px');
      expect(s2.borderTopRightRadius).toBe('20px');
      expect(s2.borderBottomLeftRadius).toBe('20px');
      expect(s2.borderBottomRightRadius).toBe('20px');

      // b1 is now unselected: outer corners 8px, inner corners sm token 8px
      const s1After = getComputedStyle(inner(b1));
      expect(s1After.borderTopLeftRadius).toBe('8px');
      expect(s1After.borderBottomLeftRadius).toBe('8px');
      expect(s1After.borderTopRightRadius).toBe('8px');
      expect(s1After.borderBottomRightRadius).toBe('8px');
    });

    it('real hit test for the xs/sm 48px touch target toggles button in Chrome and Firefox', async () => {
      const root = env.render(html`
        <div style="padding-top: 50px;">
          <md-gb-button-group selection="single">
            <md-gb-button id="hit-btn" size="xs" value="hit"
              >Touch</md-gb-button
            >
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();
      const btn = root.querySelector('#hit-btn') as ButtonElement;
      const rect = btn.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top - 6;

      const hit = document.elementFromPoint(x, y);
      expect(hit).toBe(btn);

      const resolved = (btn.shadowRoot?.elementFromPoint(x, y) ??
        inner(btn)) as HTMLElement;
      resolved.click();
      await env.waitForStability();

      expect(btn.selected).toBeTrue();
    });

    it('flips connected corner radii in RTL', async () => {
      const root = env.render(html`
        <div dir="rtl">
          <md-gb-button-group variant="connected">
            <md-gb-button id="rtl-c1" size="sm">One</md-gb-button>
            <md-gb-button id="rtl-c2" size="sm">Two</md-gb-button>
            <md-gb-button id="rtl-c3" size="sm">Three</md-gb-button>
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();
      const c1 = root.querySelector('#rtl-c1') as ButtonElement;
      const c3 = root.querySelector('#rtl-c3') as ButtonElement;

      const s1 = getComputedStyle(inner(c1));
      const s3 = getComputedStyle(inner(c3));

      // In RTL, first child has outer corners on the right and inner corners on the left
      expect(s1.borderTopRightRadius).toBe('20px');
      expect(s1.borderBottomRightRadius).toBe('20px');
      expect(s1.borderTopLeftRadius).toBe('8px');
      expect(s1.borderBottomLeftRadius).toBe('8px');

      // Last child has inner corners on the right and outer corners on the left
      expect(s3.borderTopRightRadius).toBe('8px');
      expect(s3.borderBottomRightRadius).toBe('8px');
      expect(s3.borderTopLeftRadius).toBe('20px');
      expect(s3.borderBottomLeftRadius).toBe('20px');
    });

    it('computes square outer corners on all four corners per size', async () => {
      const root = env.render(html`
        <div>
          <md-gb-button-group id="sq-xs-grp" variant="connected">
            <md-gb-button id="sq-xs-b" size="xs" square>XS</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="sq-sm-grp" variant="connected">
            <md-gb-button id="sq-sm-b" size="sm" square>SM</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="sq-md-grp" variant="connected">
            <md-gb-button id="sq-md-b" size="md" square>MD</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="sq-lg-grp" variant="connected">
            <md-gb-button id="sq-lg-b" size="lg" square>LG</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="sq-xl-grp" variant="connected">
            <md-gb-button id="sq-xl-b" size="xl" square>XL</md-gb-button>
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();

      const getCorners = (id: string) => {
        const style = getComputedStyle(
          inner(root.querySelector(id) as ButtonElement),
        );
        return [
          style.borderTopLeftRadius,
          style.borderTopRightRadius,
          style.borderBottomRightRadius,
          style.borderBottomLeftRadius,
        ];
      };

      expect(getCorners('#sq-xs-b')).toEqual(['4px', '4px', '4px', '4px']);
      expect(getCorners('#sq-sm-b')).toEqual(['8px', '8px', '8px', '8px']);
      expect(getCorners('#sq-md-b')).toEqual(['8px', '8px', '8px', '8px']);
      expect(getCorners('#sq-lg-b')).toEqual(['16px', '16px', '16px', '16px']);
      expect(getCorners('#sq-xl-b')).toEqual(['20px', '20px', '20px', '20px']);
    });

    it('computes round outer corners on all four corners for single child connected group', async () => {
      const root = env.render(html`
        <md-gb-button-group variant="connected">
          <md-gb-button id="round-only-b" size="sm">Single</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();
      const btn = root.querySelector('#round-only-b') as ButtonElement;
      const style = getComputedStyle(inner(btn));

      expect(style.borderTopLeftRadius).toBe('20px');
      expect(style.borderTopRightRadius).toBe('20px');
      expect(style.borderBottomRightRadius).toBe('20px');
      expect(style.borderBottomLeftRadius).toBe('20px');
    });

    it('renders correct physical distance gap between buttons across variants and sizes', async () => {
      const root = env.render(html`
        <div>
          <md-gb-button-group id="gap-xs" variant="standard">
            <md-gb-button id="b-xs-1" size="xs">1</md-gb-button>
            <md-gb-button id="b-xs-2" size="xs">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="gap-sm" variant="standard">
            <md-gb-button id="b-sm-1" size="sm">1</md-gb-button>
            <md-gb-button id="b-sm-2" size="sm">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="gap-md" variant="standard">
            <md-gb-button id="b-md-1" size="md">1</md-gb-button>
            <md-gb-button id="b-md-2" size="md">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="gap-lg" variant="standard">
            <md-gb-button id="b-lg-1" size="lg">1</md-gb-button>
            <md-gb-button id="b-lg-2" size="lg">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="gap-xl" variant="standard">
            <md-gb-button id="b-xl-1" size="xl">1</md-gb-button>
            <md-gb-button id="b-xl-2" size="xl">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="gap-con" variant="connected">
            <md-gb-button id="b-con-1" size="sm">1</md-gb-button>
            <md-gb-button id="b-con-2" size="sm">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="gap-default">
            <md-gb-button id="b-def-1">1</md-gb-button>
            <md-gb-button id="b-def-2">2</md-gb-button>
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();

      const getDistance = (b1Id: string, b2Id: string) => {
        const b1 = root.querySelector(b1Id) as HTMLElement;
        const b2 = root.querySelector(b2Id) as HTMLElement;
        return Math.round(
          b2.getBoundingClientRect().left - b1.getBoundingClientRect().right,
        );
      };

      expect(getDistance('#b-xs-1', '#b-xs-2')).toBe(18);
      expect(getDistance('#b-sm-1', '#b-sm-2')).toBe(12);
      expect(getDistance('#b-md-1', '#b-md-2')).toBe(8);
      expect(getDistance('#b-lg-1', '#b-lg-2')).toBe(8);
      expect(getDistance('#b-xl-1', '#b-xl-2')).toBe(8);
      expect(getDistance('#b-con-1', '#b-con-2')).toBe(2);
      expect(getDistance('#b-def-1', '#b-def-2')).toBe(12);
    });

    it('computes inner corner radii per size on connected group', async () => {
      const root = env.render(html`
        <div>
          <md-gb-button-group id="rc-xs" variant="connected">
            <md-gb-button id="rc-xs-1" size="xs">1</md-gb-button>
            <md-gb-button id="rc-xs-2" size="xs">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="rc-sm" variant="connected">
            <md-gb-button id="rc-sm-1" size="sm">1</md-gb-button>
            <md-gb-button id="rc-sm-2" size="sm">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="rc-md" variant="connected">
            <md-gb-button id="rc-md-1" size="md">1</md-gb-button>
            <md-gb-button id="rc-md-2" size="md">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="rc-lg" variant="connected">
            <md-gb-button id="rc-lg-1" size="lg">1</md-gb-button>
            <md-gb-button id="rc-lg-2" size="lg">2</md-gb-button>
          </md-gb-button-group>
          <md-gb-button-group id="rc-xl" variant="connected">
            <md-gb-button id="rc-xl-1" size="xl">1</md-gb-button>
            <md-gb-button id="rc-xl-2" size="xl">2</md-gb-button>
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();

      const getInnerCorner = (id: string) =>
        getComputedStyle(inner(root.querySelector(id) as ButtonElement))
          .borderTopRightRadius;

      expect(getInnerCorner('#rc-xs-1')).toBe('4px');
      expect(getInnerCorner('#rc-sm-1')).toBe('8px');
      expect(getInnerCorner('#rc-md-1')).toBe('8px');
      expect(getInnerCorner('#rc-lg-1')).toBe('16px');
      expect(getInnerCorner('#rc-xl-1')).toBe('20px');
    });

    it('ensures children in connected xs and sm have min width 48px and pass hit-test', async () => {
      const root = env.render(html`
        <div style="padding-top: 50px;">
          <md-gb-button-group id="con-touch-xs" variant="connected">
            <md-gb-button id="icon-xs" size="xs" aria-label="XS Icon"
              ><md-gb-icon>star</md-gb-icon></md-gb-button
            >
          </md-gb-button-group>
          <md-gb-button-group id="con-touch-sm" variant="connected">
            <md-gb-button id="icon-sm" size="sm" aria-label="SM Icon"
              ><md-gb-icon>star</md-gb-icon></md-gb-button
            >
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();
      const btnXs = root.querySelector('#icon-xs') as ButtonElement;
      const btnSm = root.querySelector('#icon-sm') as ButtonElement;

      expect(btnXs.getBoundingClientRect().width).toBeGreaterThanOrEqual(48);
      expect(btnSm.getBoundingClientRect().width).toBeGreaterThanOrEqual(48);

      // Hit test above button element
      const rect = btnXs.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top - 6;
      const hit = document.elementFromPoint(x, y);
      expect(hit).toBe(btnXs);
    });

    it('keeps single-line and height 40 with long label in standard and connected sm groups', async () => {
      const root = env.render(html`
        <div>
          <md-gb-button-group
            id="long-std"
            variant="standard"
            selection="single">
            <md-gb-button id="std-long-btn" size="sm" value="long"
              >Click Me Long Label</md-gb-button
            >
          </md-gb-button-group>
          <md-gb-button-group
            id="long-con"
            variant="connected"
            selection="single">
            <md-gb-button id="con-long-btn" size="sm" value="long"
              >Click Me Long Label</md-gb-button
            >
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();
      const stdBtn = root.querySelector('#std-long-btn') as ButtonElement;
      const conBtn = root.querySelector('#con-long-btn') as ButtonElement;

      expect(Math.round(stdBtn.getBoundingClientRect().height)).toBe(40);
      expect(Math.round(conBtn.getBoundingClientRect().height)).toBe(40);

      // Set selected = true and force active
      stdBtn.selected = true;
      conBtn.selected = true;
      inner(stdBtn).classList.add('active');
      inner(conBtn).classList.add('active');
      await env.waitForStability();

      expect(Math.round(stdBtn.getBoundingClientRect().height)).toBe(40);
      expect(Math.round(conBtn.getBoundingClientRect().height)).toBe(40);
      expect(getComputedStyle(stdBtn).whiteSpace).toBe('nowrap');
      expect(getComputedStyle(conBtn).whiteSpace).toBe('nowrap');
    });

    it('computes zero visible outline and inverse-surface background on selected outlined button in standard variant', async () => {
      const root = env.render(html`
        <md-gb-button-group variant="standard" selection="single">
          <md-gb-button id="out-std-1" color="outlined" selected
            >Selected</md-gb-button
          >
          <md-gb-button id="out-std-2" color="outlined"
            >Unselected</md-gb-button
          >
        </md-gb-button-group>
      `);
      await env.waitForStability();

      const isOutlineInvisible = (style: CSSStyleDeclaration) =>
        style.borderTopColor === 'transparent' ||
        style.borderTopColor === 'rgba(0, 0, 0, 0)';

      const isOutlineVisible = (style: CSSStyleDeclaration) =>
        style.borderTopWidth !== '0px' &&
        style.borderTopColor !== 'transparent' &&
        style.borderTopColor !== 'rgba(0, 0, 0, 0)';

      const std1 = inner(root.querySelector('#out-std-1') as ButtonElement);
      const std2 = inner(root.querySelector('#out-std-2') as ButtonElement);
      const sStd1 = getComputedStyle(std1);
      const sStd2 = getComputedStyle(std2);

      expect(sStd1.backgroundColor).toBe('rgb(50, 47, 53)');
      expect(isOutlineInvisible(sStd1)).toBeTrue();
      // Border width must be preserved to prevent layout shift
      expect(sStd1.borderTopWidth).toBe('1px');

      expect(sStd2.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(isOutlineVisible(sStd2)).toBeTrue();
    });

    it('computes zero visible outline and inverse-surface background on selected outlined button in connected variant', async () => {
      const root = env.render(html`
        <md-gb-button-group variant="connected" selection="single">
          <md-gb-button id="out-con-1" color="outlined" selected
            >Selected</md-gb-button
          >
          <md-gb-button id="out-con-2" color="outlined"
            >Unselected</md-gb-button
          >
        </md-gb-button-group>
      `);
      await env.waitForStability();

      const isOutlineInvisible = (style: CSSStyleDeclaration) =>
        style.borderTopColor === 'transparent' ||
        style.borderTopColor === 'rgba(0, 0, 0, 0)';

      const isOutlineVisible = (style: CSSStyleDeclaration) =>
        style.borderTopWidth !== '0px' &&
        style.borderTopColor !== 'transparent' &&
        style.borderTopColor !== 'rgba(0, 0, 0, 0)';

      const con1 = inner(root.querySelector('#out-con-1') as ButtonElement);
      const con2 = inner(root.querySelector('#out-con-2') as ButtonElement);
      const sCon1 = getComputedStyle(con1);
      const sCon2 = getComputedStyle(con2);

      expect(sCon1.backgroundColor).toBe('rgb(50, 47, 53)');
      expect(isOutlineInvisible(sCon1)).toBeTrue();
      expect(sCon1.borderTopWidth).toBe('1px');

      expect(sCon2.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      expect(isOutlineVisible(sCon2)).toBeTrue();

      // Pressed/active state on selected outlined button does not reintroduce outline
      con1.classList.add('active');
      await env.waitForStability();
      const sCon1Active = getComputedStyle(con1);
      expect(isOutlineInvisible(sCon1Active)).toBeTrue();
      expect(sCon1Active.borderTopWidth).toBe('1px');
      con1.classList.remove('active');
    });

    it('preserves button dimensions and neighbour position when selecting outlined button in standard variant', async () => {
      const root = env.render(html`
        <md-gb-button-group variant="standard" selection="single">
          <md-gb-button id="ls-std-1" color="outlined" size="sm"
            >Button 1</md-gb-button
          >
          <md-gb-button id="ls-std-2" color="outlined" size="sm"
            >Button 2</md-gb-button
          >
        </md-gb-button-group>
      `);
      await env.waitForStability();

      const b1 = root.querySelector('#ls-std-1') as ButtonElement;
      const b2 = root.querySelector('#ls-std-2') as ButtonElement;

      const rect1Before = b1.getBoundingClientRect();
      const rect2Before = b2.getBoundingClientRect();

      inner(b1).click();
      await env.waitForStability();

      const rect1After = b1.getBoundingClientRect();
      const rect2After = b2.getBoundingClientRect();

      expect(Math.round(rect1After.width)).toBe(Math.round(rect1Before.width));
      expect(Math.round(rect1After.height)).toBe(
        Math.round(rect1Before.height),
      );
      expect(Math.round(rect2After.left)).toBe(Math.round(rect2Before.left));
    });

    it('preserves button dimensions and neighbour position when selecting xl outlined button in connected variant', async () => {
      const root = env.render(html`
        <md-gb-button-group variant="connected" selection="single">
          <md-gb-button id="ls-con-xl-1" color="outlined" size="xl"
            >Button 1</md-gb-button
          >
          <md-gb-button id="ls-con-xl-2" color="outlined" size="xl"
            >Button 2</md-gb-button
          >
        </md-gb-button-group>
      `);
      await env.waitForStability();

      const b1 = root.querySelector('#ls-con-xl-1') as ButtonElement;
      const b2 = root.querySelector('#ls-con-xl-2') as ButtonElement;

      const rect1Before = b1.getBoundingClientRect();
      const rect2Before = b2.getBoundingClientRect();

      inner(b1).click();
      await env.waitForStability();

      const rect1After = b1.getBoundingClientRect();
      const rect2After = b2.getBoundingClientRect();

      expect(Math.round(rect1After.width)).toBe(Math.round(rect1Before.width));
      expect(Math.round(rect1After.height)).toBe(
        Math.round(rect1Before.height),
      );
      expect(Math.round(rect2After.left)).toBe(Math.round(rect2Before.left));
    });

    it('computes full pill corners on selected button in connected lg group', async () => {
      const root = env.render(html`
        <md-gb-button-group variant="connected" selection="single">
          <md-gb-button id="lg-b1" size="lg" selected>First</md-gb-button>
          <md-gb-button id="lg-b2" size="lg">Second</md-gb-button>
        </md-gb-button-group>
      `);
      await env.waitForStability();

      const b1 = inner(root.querySelector('#lg-b1') as ButtonElement);
      const s1 = getComputedStyle(b1);

      // container-height 96px / 2 = 48px on all 4 corners
      expect(s1.borderTopLeftRadius).toBe('48px');
      expect(s1.borderTopRightRadius).toBe('48px');
      expect(s1.borderBottomLeftRadius).toBe('48px');
      expect(s1.borderBottomRightRadius).toBe('48px');
    });

    it('computes full pill corners on selected first button in connected group with RTL direction', async () => {
      const root = env.render(html`
        <div dir="rtl">
          <md-gb-button-group
            id="rtl-grp"
            variant="connected"
            selection="single">
            <md-gb-button id="rtl-b1" size="sm" square selected
              >First in DOM</md-gb-button
            >
            <md-gb-button id="rtl-b2" size="sm" square
              >Second in DOM</md-gb-button
            >
          </md-gb-button-group>
        </div>
      `);
      await env.waitForStability();

      const b1 = inner(root.querySelector('#rtl-b1') as ButtonElement);
      const s1 = getComputedStyle(b1);
      // All 4 corners bloom to pill (20px) even in RTL
      expect(s1.borderTopLeftRadius).toBe('20px');
      expect(s1.borderTopRightRadius).toBe('20px');
      expect(s1.borderBottomLeftRadius).toBe('20px');
      expect(s1.borderBottomRightRadius).toBe('20px');
    });

    it(
      'expands pressed button and shrinks adjacent buttons relative to the ' +
        'pressed button growth in standard variant',
      async () => {
        if (!CSS.supports('width', 'calc-size(auto, size)')) {
          return;
        }
        const root = env.render(html`
          <md-gb-button-group variant="standard">
            <md-gb-button id="p1" size="sm">Short</md-gb-button>
            <md-gb-button id="p2" size="sm"
              >Much Wider Middle Button</md-gb-button
            >
            <md-gb-button id="p3" size="sm">End</md-gb-button>
          </md-gb-button-group>
        `);
        await env.waitForStability();

        const p1 = root.querySelector('#p1') as ButtonElement;
        const p2 = root.querySelector('#p2') as ButtonElement;
        const p3 = root.querySelector('#p3') as ButtonElement;

        const w1Base = p1.getBoundingClientRect().width;
        const w2Base = p2.getBoundingClientRect().width;
        const w3Base = p3.getBoundingClientRect().width;

        // Press middle button (p2): p2 grows by 15% of w2Base, and both
        // adjacent buttons (p1, p3) shrink by half of p2's growth.
        p2.classList.add('active');
        await env.waitForStability();

        const p2Growth = w2Base * 0.15;
        expect(p2.getBoundingClientRect().width).toBeCloseTo(
          w2Base + p2Growth,
          0,
        );
        expect(p1.getBoundingClientRect().width).toBeCloseTo(
          w1Base - p2Growth / 2,
          0,
        );
        expect(p3.getBoundingClientRect().width).toBeCloseTo(
          w3Base - p2Growth / 2,
          0,
        );

        p2.classList.remove('active');
        await env.waitForStability();

        // Press first button (p1): p1 grows by 15% of w1Base, and its single
        // adjacent neighbor (p2) shrinks by the full growth of p1.
        p1.classList.add('active');
        await env.waitForStability();

        const p1Growth = w1Base * 0.15;
        expect(p1.getBoundingClientRect().width).toBeCloseTo(
          w1Base + p1Growth,
          0,
        );
        expect(p2.getBoundingClientRect().width).toBeCloseTo(
          w2Base - p1Growth,
          0,
        );
        expect(p3.getBoundingClientRect().width).toBeCloseTo(w3Base, 0);

        p1.classList.remove('active');
        await env.waitForStability();
      },
    );
  });
});
