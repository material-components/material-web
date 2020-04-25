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

import '@material/mwc-list/mwc-list-item';

import {List} from '@material/mwc-list';
import {ListItem} from '@material/mwc-list/mwc-list-item';
import {Menu} from '@material/mwc-menu';
import {Corner, MenuSurface} from '@material/mwc-menu/mwc-menu-surface';
import {html, TemplateResult} from 'lit-html';

import {Fake, fixture, ieSafeKeyboardEvent, rafPromise, TestFixture} from '../../../../test/src/util/helpers';

const defaultMenu = html`<mwc-menu></mwc-menu>`;
const defaultSurface = html`<mwc-menu-surface></mwc-menu-surface>`;

interface MenuProps {
  open: boolean;
  quick: boolean;
  wrapFocus: boolean;
  innerRole: 'menu'|'listbox';
  corner: Corner;
  x: number;
  y: number;
  absolute: boolean;
  multi: boolean;
  activatable: boolean;
  fixed: boolean;
  fullwidth: boolean;
  forceGroupSelection: boolean;
  contents: TemplateResult;
}

interface SurfaceProps {
  quick: boolean;
  open: boolean;
  fixed: boolean;
  fullwidth: boolean;
  contents: TemplateResult;
}

type WindowWithShadyDOM = {
  ShadyDOM?: {inUse: boolean};
}&Window;

const menu = (propsInit: Partial<MenuProps>) => {
  return html`
    <mwc-menu
      .open=${propsInit.open === true}
      .quick=${propsInit.quick === true}
      .wrapFocus=${propsInit.wrapFocus === true}
      .innerRole=${propsInit.innerRole ?? 'menu'}
      .corner=${propsInit.corner ?? 'TOP_START'}
      .x=${propsInit.x ?? null}
      .y=${propsInit.y ?? null}
      .absolute=${propsInit.absolute === true}
      .multi=${propsInit.multi === true}
      .activatable=${propsInit.activatable === true}
      .fixed=${propsInit.fixed === true}
      .fullwidth=${propsInit.fullwidth === true}
      .forceGroupSelection=${propsInit.forceGroupSelection === true}>
      ${propsInit.contents ?? html``}
    </mwc-menu>
  `;
};

const surface = (propsInit: Partial<SurfaceProps>) => {
  return html`
    <mwc-menu-surface
      .quick=${propsInit.quick === true}
      .fixed=${propsInit.fixed === true}
      .fullwidth=${propsInit.fullwidth === true}
      .open=${propsInit.open === true}>
      ${propsInit.contents}
    </mwc-menu-surface>`;
};

suite('mwc-menu', () => {
  let fixt: TestFixture;
  let element: Menu;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultMenu);
      element = fixt.root.querySelector('mwc-menu')!;
      await element.updateComplete;
    });

    test('initializes as an mwc-menu', () => {
      assert.instanceOf(element, Menu);
      assert.equal(element.open, false);
      assert.equal(element.quick, false);
      assert.equal(element.wrapFocus, false);
      assert.equal(element.innerRole, 'menu');
      assert.equal(element.corner, 'TOP_START');
      assert.equal(element.x, null);
      assert.equal(element.y, null);
      assert.equal(element.absolute, false);
      assert.equal(element.multi, false);
      assert.equal(element.activatable, false);
      assert.equal(element.fixed, false);
      assert.equal(element.forceGroupSelection, false);
      assert.equal(element.fullwidth, false);
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

    test('`items` returns list items', async () => {
      element.innerHTML = '<mwc-list-item>1</mwc-list-item>';
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

    test('`activatable` is set on inner list', async () => {
      const list = element.shadowRoot!.querySelector<List>('.mdc-list')!;
      assert.equal(element.activatable, false);
      assert.equal(list.activatable, false);
      element.activatable = true;
      await element.updateComplete;
      assert.equal(element.activatable, true);
      assert.equal(list.activatable, true);
    });
  });

  suite('multi', () => {
    setup(async () => {
      fixt = await fixture(menu({
        multi: true,
        open: true,
        contents: html`
          <mwc-list-item>1</mwc-list-item>
          <mwc-list-item>2</mwc-list-item>`
      }));
      element = fixt.root.querySelector('mwc-menu')!;
      await element.updateComplete;
    });

    test('`multi` is set on inner list', async () => {
      const list = element.shadowRoot!.querySelector<List>('.mdc-list')!;
      assert.equal(element.multi, true);
      assert.equal(list.multi, true);
      element.multi = false;
      await element.updateComplete;
      assert.equal(element.multi, false);
      assert.equal(list.multi, false);
    });

    test('clicking items sets selection', async () => {
      const item0 = element.children[0] as ListItem;
      const item1 = element.children[1] as ListItem;
      item0.click();
      item1.click();
      const items = element.selected! as ListItem[];
      assert.equal(items[0], item0);
      assert.equal(items[1], item1);
    });
  });

  suite('grouped', () => {
    let originalSetTimeout: typeof window.setTimeout;

    setup(async () => {
      originalSetTimeout = window.setTimeout;
      (window as any).setTimeout = (fn: Function) => {
        fn();
        return -1;
      };
      fixt = await fixture(menu({
        multi: true,
        open: true,
        contents: html`
          <mwc-list-item group="a">1a</mwc-list-item>
          <mwc-list-item group="a">1b</mwc-list-item>
          <mwc-list-item group="b">2a</mwc-list-item>
          <mwc-list-item group="b">2b</mwc-list-item>`
      }));
      element = fixt.root.querySelector('mwc-menu')!;
      await element.updateComplete;
    });

    teardown(() => {
      window.setTimeout = originalSetTimeout;
    });

    test(
        'clicking items within one group overrides previous selection',
        async () => {
          const [item1a, item1b, item2a, item2b] =
              element.children as unknown as ListItem[];
          item1a.click();
          assert.deepEqual(element.selected!, [item1a]);
          item1b.click();
          assert.deepEqual(element.selected!, [item1b]);
          item2a.click();
          assert.deepEqual(element.selected!, [item1b, item2a]);
          item2b.click();
          assert.deepEqual(element.selected!, [item1b, item2b]);
        });
  });

  suite('show()', () => {
    setup(async () => {
      fixt = await fixture(defaultMenu);
      element = fixt.root.querySelector('mwc-menu')!;
      await element.updateComplete;
    });

    test('opens the menu', async () => {
      assert.isFalse(element.open);
      element.show();
      assert.isTrue(element.open);
    });
  });

  suite('close()', () => {
    setup(async () => {
      fixt = await fixture(menu({open: true}));
      element = fixt.root.querySelector('mwc-menu')!;
      await element.updateComplete;
    });

    test('closes the menu', async () => {
      assert.isTrue(element.open);
      element.close();
      assert.isFalse(element.open);
    });
  });

  suite('selection', () => {
    setup(async () => {
      fixt = await fixture(menu({
        open: true,
        contents: html`
          <mwc-list-item>1</mwc-list-item>
          <mwc-list-item>2</mwc-list-item>`
      }));
      element = fixt.root.querySelector('mwc-menu')!;
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

    test('clicking an item closes the menu', async () => {
      const item = element.children[1] as ListItem;
      item.click();
      assert.equal(element.open, false);
      assert.equal(element.selected, item);
    });
  });
});

suite('mwc-menu-surface', () => {
  let fixt: TestFixture;
  let element: MenuSurface;

  teardown(() => {
    fixt.remove();
  });

  suite('basic', () => {
    setup(async () => {
      fixt = await fixture(defaultSurface);
      element = fixt.root.querySelector('mwc-menu-surface')!;
      await element.updateComplete;
    });

    test('initializes as an mwc-menu-surface', () => {
      assert.instanceOf(element, MenuSurface);
      assert.equal(element.absolute, false);
      assert.equal(element.fullwidth, false);
      assert.equal(element.fixed, false);
      assert.equal(element.x, null);
      assert.equal(element.y, null);
      assert.equal(element.quick, false);
      assert.equal(element.open, false);
      assert.equal(element.corner, 'TOP_START');
    });
  });

  suite('fixed', () => {
    setup(async () => {
      fixt = await fixture(surface({fixed: true}));
      element = fixt.root.querySelector('mwc-menu-surface')!;
      await element.updateComplete;
    });

    test('sets correct class', async () => {
      const fixedClass = 'mdc-menu-surface--fixed';
      const surface = element.shadowRoot!.querySelector('.mdc-menu-surface')!;
      assert.isTrue(surface.classList.contains(fixedClass));
      element.fixed = false;
      await element.updateComplete;
      assert.isFalse(surface.classList.contains(fixedClass));
    });
  });

  suite('fullwidth', () => {
    setup(async () => {
      fixt = await fixture(surface({fullwidth: true}));
      element = fixt.root.querySelector('mwc-menu-surface')!;
      await element.updateComplete;
    });

    test('sets correct class', async () => {
      const fullwidthClass = 'mdc-menu-surface--fullwidth';
      const surface = element.shadowRoot!.querySelector('.mdc-menu-surface')!;
      assert.isTrue(surface.classList.contains(fullwidthClass));
      element.fullwidth = false;
      await element.updateComplete;
      assert.isFalse(surface.classList.contains(fullwidthClass));
    });
  });

  suite('open/close', () => {
    setup(async () => {
      fixt = await fixture(surface({quick: true}));
      element = fixt.root.querySelector('mwc-menu-surface')!;
      await element.updateComplete;
    });

    test('`show()` opens surface', async () => {
      element.show();
      await element.updateComplete;
      assert.equal(element.open, true);
    });

    test('`close()` closes surface', async () => {
      element.show();
      await element.updateComplete;
      element.close();
      assert.equal(element.open, false);
    });

    test('closing fires the closed event', async () => {
      const fake = new Fake<[], void>();
      element.addEventListener('closed', fake.handler);
      element.show();
      await element.updateComplete;
      await rafPromise();
      element.close();
      await element.updateComplete;
      await rafPromise();
      assert.isTrue(fake.called);
    });

    test('opening fires the opened event', async () => {
      const fake = new Fake<[], void>();
      element.addEventListener('opened', fake.handler);
      element.show();
      await element.updateComplete;
      await rafPromise();
      assert.isTrue(fake.called);
    });

    test('escape key closes surface', async () => {
      const surface = element.shadowRoot!.querySelector('.mdc-menu-surface')!;
      element.show();
      await element.updateComplete;
      await rafPromise();

      // escape keycode
      const escEv = ieSafeKeyboardEvent('keydown', 27);
      surface.dispatchEvent(escEv);

      await rafPromise();
      await element.updateComplete;
      assert.isFalse(element.open);
    });

    test('clicking outside the surface closes surface', async () => {
      element.show();
      await element.updateComplete;
      await rafPromise();
      document.body.dispatchEvent(new MouseEvent('click'));
      await rafPromise();
      await element.updateComplete;
      assert.isFalse(element.open);
    });
  });

  suite('focus', () => {
    let focusedElement: HTMLElement;
    let innerFocusedElement: HTMLElement;

    setup(async () => {
      focusedElement = document.createElement('input');
      document.body.appendChild(focusedElement);
      const contents = html`<input>`;
      fixt = await fixture(surface({quick: true, contents}));
      element = fixt.root.querySelector('mwc-menu-surface')!;
      innerFocusedElement = fixt.root.querySelector('input')!;
      await element.updateComplete;
    });

    teardown(() => {
      focusedElement.parentNode!.removeChild(focusedElement);
    });

    test('focus is restored after closing', async () => {
      const w: WindowWithShadyDOM = window;
      if (w.ShadyDOM && w.ShadyDOM.inUse) {
        /*
         * skip tests in IE due to rendering bug. Absolute div will not show
         * unless mouse interaction causes it to render. This means that the
         * inner input cannot be focused.
         */
        return;
      }

      focusedElement.focus();
      element.show();
      await element.updateComplete;
      await rafPromise();
      innerFocusedElement.focus();
      await rafPromise();
      assert.equal(document.activeElement, fixt);
      assert.equal(fixt.shadowRoot!.activeElement, innerFocusedElement);
      element.close();
      await rafPromise();
      await element.updateComplete;
      assert.equal(document.activeElement, focusedElement);
    });
  });
});
