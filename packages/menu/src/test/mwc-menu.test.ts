/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {List} from '@material/mwc-list';
import {ListItem} from '@material/mwc-list/mwc-list-item';
import {Menu} from '@material/mwc-menu';
import {MenuSurface} from '@material/mwc-menu/mwc-menu-surface';
import {fake} from 'sinon';

import {rafPromise} from '../../../../test/src/util/helpers';

suite('mwc-menu', () => {
  let element: Menu;

  setup(async () => {
    element = document.createElement('mwc-menu');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  teardown(() => {
    element.remove();
  });

  test('initializes as an mwc-menu', () => {
    assert.instanceOf(element, Menu);
  });

  test('surface is visible when open', async () => {
    const surface =
        element.shadowRoot!.querySelector<MenuSurface>('.mdc-menu')!;
    assert.isTrue(surface.hasAttribute('hidden'));
    assert.isFalse(surface.open);
    element.open = true;
    await element.updateComplete;
    assert.isFalse(surface.hasAttribute('hidden'));
    assert.isTrue(surface.open);
  });

  test('`show()` opens the menu', async () => {
    assert.isFalse(element.open);
    element.show();
    assert.isTrue(element.open);
  });

  test('`close()` closes the menu', async () => {
    element.open = true;
    element.close();
    assert.isFalse(element.open);
  });

  test('`items` returns list items', async () => {
    element.innerHTML = '<mwc-list-item mwc-list-item>1</mwc-list-item>';
    element.layout(true);
    await element.updateComplete;
    const items = element.items;
    assert.equal(items.length, 1);
    assert.equal(items[0], element.children[0] as ListItem);
  });

  test('`anchor` is passed to surface', async () => {
    const surface =
        element.shadowRoot!.querySelector<MenuSurface>('.mdc-menu')!;
    assert.equal(element.anchor, null);
    assert.equal(surface.anchor, null);
    element.anchor = document.body;
    await element.updateComplete;
    assert.equal(surface.anchor, document.body);
  });

  test('`quick` is passed to surface', async () => {
    const surface =
        element.shadowRoot!.querySelector<MenuSurface>('.mdc-menu')!;
    assert.equal(element.quick, false);
    assert.equal(surface.quick, false);
    element.quick = true;
    await element.updateComplete;
    assert.equal(surface.quick, true);
  });

  test('`corner` is passed to surface', async () => {
    const surface =
        element.shadowRoot!.querySelector<MenuSurface>('.mdc-menu')!;
    assert.equal(element.corner, 'TOP_START');
    assert.equal(surface.corner, 'TOP_START');
    element.corner = 'BOTTOM_START';
    await element.updateComplete;
    assert.equal(surface.corner, 'BOTTOM_START');
  });

  test('`x` and `y` are passed to surface', async () => {
    const surface =
        element.shadowRoot!.querySelector<MenuSurface>('.mdc-menu')!;
    assert.equal(element.x, null);
    assert.equal(element.y, null);
    assert.equal(surface.x, null);
    assert.equal(surface.y, null);
    element.x = 111;
    element.y = 101;
    await element.updateComplete;
    assert.equal(element.x, 111);
    assert.equal(element.y, 101);
    assert.equal(surface.x, 111);
    assert.equal(surface.y, 101);
  });

  test('`absolute` is passed to surface', async () => {
    const surface =
        element.shadowRoot!.querySelector<MenuSurface>('.mdc-menu')!;
    assert.equal(element.absolute, false);
    assert.equal(surface.absolute, false);
    element.absolute = true;
    await element.updateComplete;
    assert.equal(element.absolute, true);
    assert.equal(surface.absolute, true);
  });

  test('`fixed` is passed to surface', async () => {
    const surface =
        element.shadowRoot!.querySelector<MenuSurface>('.mdc-menu')!;
    assert.equal(element.fixed, false);
    assert.equal(surface.fixed, false);
    element.fixed = true;
    await element.updateComplete;
    assert.equal(element.fixed, true);
    assert.equal(surface.fixed, true);
  });

  test('`fullwidth` is passed to surface', async () => {
    const surface =
        element.shadowRoot!.querySelector<MenuSurface>('.mdc-menu')!;
    assert.equal(element.fullwidth, false);
    assert.equal(surface.fullwidth, false);
    element.fullwidth = true;
    await element.updateComplete;
    assert.equal(element.fullwidth, true);
    assert.equal(surface.fullwidth, true);
  });

  test('correct roles are passed to inner list', async () => {
    const list = element.shadowRoot!.querySelector<List>('.mdc-list')!;
    assert.equal(element.innerRole, 'menu');
    assert.equal(list.innerRole, 'menu');
    assert.equal(list.itemRoles, 'menuitem');
    element.innerRole = 'listbox';
    await element.updateComplete;
    assert.equal(list.innerRole, 'listbox');
    assert.equal(list.itemRoles, 'option');
  });

  test('`multi` is set on inner list', async () => {
    const list = element.shadowRoot!.querySelector<List>('.mdc-list')!;
    assert.equal(element.multi, false);
    assert.equal(list.multi, false);
    element.multi = true;
    await element.updateComplete;
    assert.equal(element.multi, true);
    assert.equal(list.multi, true);
  });

  test('`activatable` is set on inner list', async () => {
    const list = element.shadowRoot!.querySelector<List>('.mdc-list')!;
    assert.equal(element.activatable, false);
    assert.equal(list.activatable, false);
    element.activatable = true;
    await element.updateComplete;
    assert.equal(element.activatable, true);
    assert.equal(list.activatable, true);
  });

  suite('selection', () => {
    setup(async () => {
      element.innerHTML = `
        <mwc-list-item mwc-list-item>1</mwc-list-item>
        <mwc-list-item mwc-list-item>2</mwc-list-item>`;
      element.layout(true);
      await element.updateComplete;
    });

    test('`index` returns selected index', async () => {
      const list = element.shadowRoot!.querySelector('mwc-list')!;
      assert.equal(list.index, -1);
      assert.equal(element.index, -1);
      element.select(1);
      await element.updateComplete;
      assert.equal(list.index, 1);
      assert.equal(element.index, 1);
    });

    test('`selected` returns selected item', async () => {
      const list = element.shadowRoot!.querySelector('mwc-list')!;
      const item = element.children[1] as ListItem;
      element.select(1);
      await element.updateComplete;
      assert.equal(element.selected, item);
      assert.equal(list.selected, item);
    });
  });
});

suite('mwc-menu-surface', () => {
  let element: MenuSurface;

  setup(async () => {
    element = document.createElement('mwc-menu-surface');
    document.body.appendChild(element);
    await element.updateComplete;
  });

  teardown(() => {
    element.remove();
  });

  test('initializes as an mwc-menu-surface', () => {
    assert.instanceOf(element, MenuSurface);
  });

  test('initializes defaults', () => {
    assert.equal(element.absolute, false);
    assert.equal(element.fullwidth, false);
    assert.equal(element.fixed, false);
    assert.equal(element.x, null);
    assert.equal(element.y, null);
    assert.equal(element.quick, false);
    assert.equal(element.open, false);
    assert.equal(element.corner, 'TOP_START');
  });

  test('`fixed` sets correct class', async () => {
    const fixedClass = 'mdc-menu-surface--fixed';
    const surface = element.shadowRoot!.querySelector('.mdc-menu-surface')!;
    assert.isFalse(surface.classList.contains(fixedClass));
    element.fixed = true;
    await element.updateComplete;
    assert.isTrue(surface.classList.contains(fixedClass));
  });

  test('`fullwidth` sets correct class', async () => {
    const fullwidthClass = 'fullwidth';
    const surface = element.shadowRoot!.querySelector('.mdc-menu-surface')!;
    assert.isFalse(surface.classList.contains(fullwidthClass));
    element.fullwidth = true;
    await element.updateComplete;
    assert.isTrue(surface.classList.contains(fullwidthClass));
  });

  test('closing fires the closed event', async () => {
    const handler = fake();
    element.addEventListener('closed', handler);
    element.quick = true;
    element.open = true;
    await element.updateComplete;
    await rafPromise();
    element.open = false;
    await element.updateComplete;
    await rafPromise();
    assert.isTrue(handler.called);
  });

  test('opening fires the opened event', async () => {
    const handler = fake();
    element.addEventListener('opened', handler);
    element.quick = true;
    element.open = true;
    await element.updateComplete;
    await rafPromise();
    assert.isTrue(handler.called);
  });

  test('escape key closes surface', async () => {
    const surface = element.shadowRoot!.querySelector('.mdc-menu-surface')!;
    element.quick = true;
    element.open = true;
    await element.updateComplete;
    await rafPromise();
    surface.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'}));
    await rafPromise();
    await element.updateComplete;
    assert.isFalse(element.open);
  });

  test('clicking outside the surface closes surface', async () => {
    element.quick = true;
    element.open = true;
    await element.updateComplete;
    await rafPromise();
    document.body.dispatchEvent(new MouseEvent('click'));
    await rafPromise();
    await element.updateComplete;
    assert.isFalse(element.open);
  });
});
