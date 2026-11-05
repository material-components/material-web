/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {
  FAB_MENU_CLASSES,
  FAB_MENU_COLORS,
  FAB_MENU_ITEM_CLASSES,
  fabMenu,
  fabMenuClasses,
  fabMenuItem,
  fabMenuItemClasses,
} from './fab-menu.js';

describe('FAB Menu class API', () => {
  const env = new Environment();

  describe('constants', () => {
    it('defines expected color constants', () => {
      expect(FAB_MENU_COLORS.standard).toBe('standard');
      expect(FAB_MENU_COLORS.vibrant).toBe('vibrant');
    });
  });

  describe('fabMenuClasses()', () => {
    it('defaults to standard menu', () => {
      const classes = fabMenuClasses();
      expect(classes[FAB_MENU_CLASSES.fabMenu]).toBeTrue();
      expect(classes[FAB_MENU_CLASSES.fabMenuVibrant]).toBeFalsy();
      expect(classes[FAB_MENU_CLASSES.open]).toBeFalsy();
    });

    it('applies vibrant menu class', () => {
      const classes = fabMenuClasses({menuColor: 'vibrant'});
      expect(classes[FAB_MENU_CLASSES.fabMenuVibrant]).toBeTrue();
    });

    it('applies open class', () => {
      const classes = fabMenuClasses({open: true});
      expect(classes[FAB_MENU_CLASSES.open]).toBeTrue();
    });
  });

  describe('fabMenuItemClasses()', () => {
    it('defaults to enabled unchecked item', () => {
      const classes = fabMenuItemClasses();
      expect(classes[FAB_MENU_ITEM_CLASSES.fabMenuItem]).toBeTrue();
      expect(classes[FAB_MENU_ITEM_CLASSES.checked]).toBeFalsy();
      expect(classes[FAB_MENU_ITEM_CLASSES.disabled]).toBeFalsy();
      expect(classes[FAB_MENU_ITEM_CLASSES.hover]).toBeFalsy();
      expect(classes[FAB_MENU_ITEM_CLASSES.focus]).toBeFalsy();
      expect(classes[FAB_MENU_ITEM_CLASSES.active]).toBeFalsy();
    });

    it('applies checked and disabled classes', () => {
      const classes = fabMenuItemClasses({checked: true, disabled: true});
      expect(classes[FAB_MENU_ITEM_CLASSES.checked]).toBeTrue();
      expect(classes[FAB_MENU_ITEM_CLASSES.disabled]).toBeTrue();
    });

    it('applies pseudo classes', () => {
      const classes = fabMenuItemClasses({
        hover: true,
        focus: true,
        active: true,
      });
      expect(classes[FAB_MENU_ITEM_CLASSES.hover]).toBeTrue();
      expect(classes[FAB_MENU_ITEM_CLASSES.focus]).toBeTrue();
      expect(classes[FAB_MENU_ITEM_CLASSES.active]).toBeTrue();
    });
  });

  describe('fabMenu and fabMenuItem directives', () => {
    it('renders fabMenu classes onto element', async () => {
      const root = env.render(
        html`<div
          class="${fabMenu({
            menuColor: 'vibrant',
            open: true,
          })}"></div>`,
      );
      await env.waitForStability();
      const el = root.firstElementChild as HTMLElement;
      expect(el.classList.contains('fab-menu')).toBeTrue();
      expect(el.classList.contains('menu-vibrant')).toBeTrue();
      expect(el.classList.contains('open')).toBeTrue();
    });

    it('renders fabMenuItem classes onto element', async () => {
      const root = env.render(
        html`<button
          class="${fabMenuItem({
            checked: true,
            disabled: true,
          })}"></button>`,
      );
      await env.waitForStability();
      const el = root.firstElementChild as HTMLElement;
      expect(el.classList.contains('fab-menu-item')).toBeTrue();
      expect(el.classList.contains('checked')).toBeTrue();
      expect(el.classList.contains('disabled')).toBeTrue();
    });
  });
});
