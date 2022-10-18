/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './menu-surface.js';
import '../list/list-item.js';

import {html} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

import {Environment} from '../testing/environment.js';
import {listenOnce} from '../testing/events.js';

import {MdMenuSurface} from './menu-surface.js';

const ANCHOR_WIDTH = '100px';
const ANCHOR_HEIGHT = '50px';

describe('menu surface tests', () => {
  const env = new Environment();
  let surface: MdMenuSurface;
  let root: HTMLElement;  // Inner root element to which styling is applied.

  beforeEach(async () => {
    const el = env.render(getMenuSurfaceTemplate());
    surface = el.querySelector('md-menu-surface')!;
    const button = el.querySelector('button')!;
    surface.anchor = button;
    await surface.updateComplete;
    root = surface.shadowRoot!.querySelector('.md3-menu-surface')!;
  });

  describe('menu positioning options', () => {
    it('Corner.TOP_START positions menu correctly', async () => {
      surface.corner = 'TOP_START';
      await surface.updateComplete;
      surface.show();
      // TOOD(b/241244423): Waiting for the event fired can be removed when
      // this bug is fixed.
      await listenOnce(surface, 'opened');
      await surface.updateComplete;

      expect(root.style.top).toBe('0px');
      expect(root.style.left).toBe('0px');
    });

    it('Corner.TOP_END positions menu correctly', async () => {
      surface.corner = 'TOP_END';
      await surface.updateComplete;
      surface.show();
      // TOOD(b/241244423): Waiting for the event fired can be removed when
      // this bug is fixed.
      await listenOnce(surface, 'opened');
      await surface.updateComplete;

      expect(root.style.top).toBe('0px');
      expect(root.style.left).toBe(ANCHOR_WIDTH);
    });

    it('Corner.BOTTOM_START positions menu correctly', async () => {
      surface.corner = 'BOTTOM_START';
      await surface.updateComplete;
      surface.show();
      // TOOD(b/241244423): Waiting for the event fired can be removed when
      // this bug is fixed.
      await listenOnce(surface, 'opened');
      await surface.updateComplete;

      expect(root.style.top).toBe(ANCHOR_HEIGHT);
      expect(root.style.left).toBe('0px');
    });

    it('Corner.BOTTOM_END positions menu correctly', async () => {
      surface.corner = 'BOTTOM_END';
      await surface.updateComplete;
      surface.show();
      // TOOD(b/241244423): Waiting for the event fired can be removed when
      // this bug is fixed.
      await listenOnce(surface, 'opened');
      await surface.updateComplete;

      expect(root.style.top).toBe(ANCHOR_HEIGHT);
      expect(root.style.left).toBe(ANCHOR_WIDTH);
    });

    it('`flipMenuHorizontally` flips TOP_START corner', async () => {
      surface.corner = 'TOP_START';
      surface.flipMenuHorizontally = true;
      await surface.updateComplete;
      surface.show();
      // TOOD(b/241244423): Waiting for the event fired can be removed when
      // this bug is fixed.
      await listenOnce(surface, 'opened');
      await surface.updateComplete;

      expect(root.style.top).toBe('0px');
      expect(root.style.right).toBe('0px');
    });

    it('`flipMenuHorizontally` flips TOP_END corner', async () => {
      surface.corner = 'TOP_END';
      surface.flipMenuHorizontally = true;
      await surface.updateComplete;
      surface.show();
      // TOOD(b/241244423): Waiting for the event fired can be removed when
      // this bug is fixed.
      await listenOnce(surface, 'opened');
      await surface.updateComplete;

      expect(root.style.top).toBe('0px');
      expect(root.style.right).toBe(ANCHOR_WIDTH);
    });

    it('`flipMenuHorizontally` flips BOTTOM_START corner', async () => {
      surface.corner = 'BOTTOM_START';
      surface.flipMenuHorizontally = true;
      await surface.updateComplete;
      surface.show();
      // TOOD(b/241244423): Waiting for the event fired can be removed when
      // this bug is fixed.
      await listenOnce(surface, 'opened');
      await surface.updateComplete;

      expect(root.style.top).toBe(ANCHOR_HEIGHT);
      expect(root.style.right).toBe('0px');
    });

    it('`flipMenuHorizontally` flips BOTTOM_END corner', async () => {
      surface.corner = 'BOTTOM_END';
      surface.flipMenuHorizontally = true;
      await surface.updateComplete;
      surface.show();
      // TOOD(b/241244423): Waiting for the event fired can be removed when
      // this bug is fixed.
      await listenOnce(surface, 'opened');
      await surface.updateComplete;

      expect(root.style.top).toBe(ANCHOR_HEIGHT);
      expect(root.style.right).toBe(ANCHOR_WIDTH);
    });
  });
});

function getMenuSurfaceTemplate(propsInit: Partial<MdMenuSurface> = {}) {
  return html`
    <div class="root" style="position: relative; margin: 100px;">
      <button style="${styleMap({
    width: ANCHOR_WIDTH,
    height: ANCHOR_HEIGHT
  })}">
        Open Menu
      </button>
      <md-menu-surface .quick="${propsInit.quick ?? true}"
          .corner="${propsInit.corner ?? 'BOTTOM_START'}"
          .flipMenuHorizontally="${propsInit.flipMenuHorizontally ?? false}">
        Menu surface content
      </md-menu-surface>
    </div>
  `;
}
