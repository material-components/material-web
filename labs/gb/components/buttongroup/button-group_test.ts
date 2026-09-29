/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {
  BUTTON_GROUP_CLASSES,
  BUTTON_GROUP_SELECTIONS,
  BUTTON_GROUP_VARIANTS,
  buttonGroup,
  buttonGroupClasses,
  type ButtonGroupItem,
  normalizeSelection,
  shouldBlockToggle,
} from './button-group.js';
import buttonGroupStyles from './button-group.cssresult.js';

describe('ButtonGroup class API', () => {
  const env = new Environment();

  describe('class API styles', () => {
    beforeAll(() => {
      adoptStyles(document, [buttonGroupStyles]);
    });

    it('computes position: relative on .btn-xs and .btn-sm inside .btn-group', async () => {
      const root = env.render(html`
        <div class="btn-group">
          <button class="btn btn-xs" id="xs-btn">XS</button>
        </div>
        <div class="btn-group">
          <button class="btn btn-sm" id="sm-btn">SM</button>
        </div>
      `);
      await env.waitForStability();

      const xsBtn = root.querySelector('#xs-btn') as HTMLElement;
      const smBtn = root.querySelector('#sm-btn') as HTMLElement;

      expect(getComputedStyle(xsBtn).position).toBe('relative');
      expect(getComputedStyle(smBtn).position).toBe('relative');
    });
  });

  describe('constants', () => {
    it('defines expected variants', () => {
      expect(BUTTON_GROUP_VARIANTS.standard).toBe('standard');
      expect(BUTTON_GROUP_VARIANTS.connected).toBe('connected');
    });

    it('defines expected selections', () => {
      expect(BUTTON_GROUP_SELECTIONS.none).toBe('none');
      expect(BUTTON_GROUP_SELECTIONS.single).toBe('single');
      expect(BUTTON_GROUP_SELECTIONS.multiple).toBe('multiple');
    });
  });

  describe('buttonGroupClasses()', () => {
    it('defaults to standard variant', () => {
      const classes = buttonGroupClasses();
      expect(classes[BUTTON_GROUP_CLASSES.btnGroup]).toBeTrue();
      expect(classes[BUTTON_GROUP_CLASSES.btnGroupStandard]).toBeTrue();
      expect(classes[BUTTON_GROUP_CLASSES.btnGroupConnected]).toBeFalsy();
      expect(classes[BUTTON_GROUP_CLASSES.disabled]).toBeFalsy();
    });

    it('applies connected variant class', () => {
      const classes = buttonGroupClasses({variant: 'connected'});
      expect(classes[BUTTON_GROUP_CLASSES.btnGroupConnected]).toBeTrue();
      expect(classes[BUTTON_GROUP_CLASSES.btnGroupStandard]).toBeFalsy();
    });

    it('applies disabled class', () => {
      const classes = buttonGroupClasses({disabled: true});
      expect(classes[BUTTON_GROUP_CLASSES.disabled]).toBeTrue();
    });
  });

  describe('buttonGroup directive', () => {
    it('renders classes onto element', async () => {
      const root = env.render(
        html`<div
          class="${buttonGroup({
            variant: 'connected',
            disabled: true,
          })}"></div>`,
      );
      await env.waitForStability();
      const el = root.firstElementChild as HTMLElement;
      expect(el.classList.contains('btn-group')).toBeTrue();
      expect(el.classList.contains('btn-group-connected')).toBeTrue();
      expect(el.classList.contains('disabled')).toBeTrue();
    });
  });

  describe('normalizeSelection()', () => {
    it('clears all selections in none mode', () => {
      const items: ButtonGroupItem[] = [
        {selected: true},
        {selected: true},
        {selected: false},
      ];
      normalizeSelection(items, {selection: 'none', required: false});
      expect(items.map((i) => i.selected)).toEqual([false, false, false]);
    });

    it('enforces single selection keeping the last selected item', () => {
      const items: ButtonGroupItem[] = [
        {selected: true},
        {selected: true},
        {selected: false},
      ];
      normalizeSelection(items, {selection: 'single', required: false});
      expect(items.map((i) => i.selected)).toEqual([false, true, false]);
    });

    it('enforces single selection keeping the preferred item when selected', () => {
      const items: ButtonGroupItem[] = [
        {selected: true},
        {selected: true},
        {selected: false},
      ];
      normalizeSelection(items, {
        selection: 'single',
        required: false,
        preferred: items[0],
      });
      expect(items.map((i) => i.selected)).toEqual([true, false, false]);
    });

    it('allows 0 selected in optional single mode', () => {
      const items: ButtonGroupItem[] = [{selected: false}, {selected: false}];
      normalizeSelection(items, {selection: 'single', required: false});
      expect(items.map((i) => i.selected)).toEqual([false, false]);
    });

    it('auto-selects first selectable item in required single mode when none selected', () => {
      const items: ButtonGroupItem[] = [
        {selected: false, disabled: true},
        {selected: false, href: '/link'},
        {selected: false, softDisabled: true},
        {selected: false}, // first selectable
        {selected: false},
      ];
      normalizeSelection(items, {selection: 'single', required: true});
      expect(items.map((i) => i.selected)).toEqual([
        false,
        false,
        false,
        true,
        false,
      ]);
    });

    it('does nothing when nothing is selectable in required single mode', () => {
      const items: ButtonGroupItem[] = [
        {selected: false, disabled: true},
        {selected: false, href: '/link'},
      ];
      normalizeSelection(items, {selection: 'single', required: true});
      expect(items.map((i) => i.selected)).toEqual([false, false]);
    });

    it('preserves multiple selections in multiple mode', () => {
      const items: ButtonGroupItem[] = [
        {selected: true},
        {selected: false},
        {selected: true},
      ];
      normalizeSelection(items, {selection: 'multiple', required: false});
      expect(items.map((i) => i.selected)).toEqual([true, false, true]);
    });
  });

  describe('shouldBlockToggle()', () => {
    it('blocks deselecting the only selected button in required single mode', () => {
      const items: ButtonGroupItem[] = [{selected: true}, {selected: false}];
      expect(
        shouldBlockToggle(items, 0, {selection: 'single', required: true}),
      ).toBeTrue();
      expect(
        shouldBlockToggle(items, 1, {selection: 'single', required: true}),
      ).toBeFalse();
    });

    it('allows deselecting in optional single mode', () => {
      const items: ButtonGroupItem[] = [{selected: true}, {selected: false}];
      expect(
        shouldBlockToggle(items, 0, {selection: 'single', required: false}),
      ).toBeFalse();
    });

    it('allows toggle in multiple mode', () => {
      const items: ButtonGroupItem[] = [{selected: true}, {selected: false}];
      expect(
        shouldBlockToggle(items, 0, {selection: 'multiple', required: true}),
      ).toBeFalse();
    });
  });
});
