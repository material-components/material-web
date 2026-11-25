/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './menu.js';
import './sub-menu.js';

import {html, LitElement, nothing, render} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {createTokenTests} from '../testing/tokens.js';

import {MenuHarness, MenuItemHarness} from './harness.js';
import {MenuItemController} from './internal/controllers/menuItemController.js';
import {
  CloseReason,
  MdMenu,
  type CloseMenuEvent,
  type MenuItem,
} from './menu.js';
import {MdMenuItem} from './menu-item.js';
import {MdSubMenu} from './sub-menu.js';

@customElement('test-wrapped-menu-item')
class TestWrappedMenuItem extends LitElement implements MenuItem {
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({type: Boolean, reflect: true}) disabled = false;
  @property() typeaheadText = '';
  @property({type: Boolean}) selected = false;
  @property() type: 'menuitem' | 'option' | 'button' | 'link' = 'menuitem';

  override connectedCallback() {
    super.connectedCallback();
    this.toggleAttribute('md-menu-item', true);
  }

  get innerItem(): MdMenuItem {
    return this.renderRoot.querySelector('md-menu-item')!;
  }

  override focus() {
    this.innerItem?.focus();
  }

  protected override render() {
    return html`
      <md-menu-item
        ?disabled=${this.disabled}
        .typeaheadText=${this.typeaheadText}
        .selected=${this.selected}
        .type=${this.type}>
        <slot name="headline" slot="headline"></slot>
      </md-menu-item>
    `;
  }
}

describe('<md-menu>', () => {
  describe('.styles', () => {
    createTokenTests(MdMenu.styles);
  });

  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root?.remove();
  });

  it('escape on list root closes menu', async () => {
    render(
      html`
        <button>OpenMenu</button>
        <md-menu quick></md-menu>
      `,
      root,
    );

    const button = root.querySelector('button')!;
    const menu = root.querySelector('md-menu')!;
    menu.anchorElement = button;
    menu.show();

    expect(menu.open).toBeTrue();

    const escapeKeydownEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    menu.dispatchEvent(escapeKeydownEvent);

    await menu.updateComplete;

    expect(menu.open).toBeFalse();
    expect(escapeKeydownEvent.defaultPrevented).toBeTrue();
  });

  // Regression test for b/314706578.
  it('escape on submenu items closes menu', async () => {
    render(
      html`
        <button>OpenMenu</button>
        <md-menu quick>
          <md-sub-menu hover-open-delay="0" hover-close-delay="0">
            <md-menu-item id="submenu-item" slot="item">
              <div slot="headline">Link Item 1</div>
            </md-menu-item>
            <md-menu quick slot="menu">
              <md-menu-item slot="item">
                <div slot="headline">Submenu Item 1</div>
              </md-menu-item>
            </md-menu>
          </md-sub-menu>
        </md-menu>
      `,
      root,
    );

    const button = root.querySelector('button')!;
    const menu = root.querySelector('md-menu')!;
    const submenuItemHarness = new MenuItemHarness(
      menu.querySelector('#submenu-item')!,
    );
    menu.anchorElement = button;
    menu.show();

    expect(menu.open).toBeTrue();

    const escapeKeydownEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      code: 'Escape',
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    const interactiveElement = await submenuItemHarness.getInteractiveElement();
    interactiveElement.dispatchEvent(escapeKeydownEvent);

    await menu.updateComplete;

    expect(menu.open).toBeFalse();
    expect(escapeKeydownEvent.defaultPrevented).toBeTrue();
  });
});

describe('<md-menu-item>', () => {
  describe('.styles', () => {
    createTokenTests(MdMenuItem.styles);
  });

  describe('href', () => {
    it('sanitizes javascript: URLs in href', async () => {
      const item = new MdMenuItem();
      item.href = 'javascript:alert(1)';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('href')).toBeNull();
      item.remove();
    });
  });

  describe('rel and referrerpolicy', () => {
    it('omits rel and referrerpolicy when unset', async () => {
      const item = new MdMenuItem();
      item.href = 'https://example.com';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.hasAttribute('rel')).toBeFalse();
      expect(anchor.hasAttribute('referrerpolicy')).toBeFalse();
      item.remove();
    });

    it('propagates rel and referrerpolicy to the anchor tag', async () => {
      const item = new MdMenuItem();
      item.href = 'https://example.com';
      item.rel = 'noopener noreferrer';
      item.referrerPolicy = 'no-referrer';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('rel')).toBe('noopener noreferrer');
      expect(anchor.getAttribute('referrerpolicy')).toBe('no-referrer');
      item.remove();
    });

    it('reflects rel and referrerpolicy attributes to properties and anchor', async () => {
      const item = new MdMenuItem();
      item.setAttribute('href', 'https://example.com');
      item.setAttribute('rel', 'noreferrer');
      item.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      document.body.appendChild(item);
      await item.updateComplete;

      expect(item.rel).toBe('noreferrer');
      expect(item.referrerPolicy).toBe('strict-origin-when-cross-origin');

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.getAttribute('rel')).toBe('noreferrer');
      expect(anchor.getAttribute('referrerpolicy')).toBe(
        'strict-origin-when-cross-origin',
      );
      item.remove();
    });

    it('does not default rel when target="_blank"', async () => {
      const item = new MdMenuItem();
      item.href = 'https://example.com';
      item.target = '_blank';
      document.body.appendChild(item);
      await item.updateComplete;

      const anchor = item.renderRoot.querySelector('a')!;
      expect(anchor.hasAttribute('rel')).toBeFalse();
      item.remove();
    });
  });

  describe('keyboard activation', () => {
    let root: HTMLDivElement;

    beforeEach(() => {
      root = document.createElement('div');
      document.body.appendChild(root);
    });

    afterEach(() => {
      root.remove();
    });

    async function setupSingleItemMenu(options: {
      type?: 'menuitem' | 'option' | 'button' | 'link';
      href?: string;
      keepOpen?: boolean;
      disabled?: boolean;
      slot?: string;
    }) {
      const events: Array<
        | {event: 'close-menu'; reason: CloseMenuEvent['detail']['reason']}
        | {event: 'click'}
      > = [];
      const closeMenuSpy = jasmine
        .createSpy('close-menu')
        .and.callFake((event: CloseMenuEvent) => {
          events.push({event: 'close-menu', reason: event.detail.reason});
        });
      const clickSpy = jasmine
        .createSpy('click')
        .and.callFake((event: MouseEvent) => {
          event.preventDefault();
          events.push({event: 'click'});
        });
      const keydownSpy = jasmine.createSpy('keydown');

      render(
        html`
          <button>Open</button>
          <md-menu quick>
            <md-menu-item
              slot=${options.slot ?? nothing}
              .type=${options.type ?? 'menuitem'}
              .href=${options.href ?? ''}
              ?keep-open=${options.keepOpen ?? false}
              ?disabled=${options.disabled ?? false}>
              <div slot="headline">Action</div>
            </md-menu-item>
          </md-menu>
        `,
        root,
      );

      const anchor = root.querySelector('button')!;
      const menu = root.querySelector('md-menu')!;
      const item = root.querySelector('md-menu-item')!;
      menu.addEventListener('close-menu', closeMenuSpy as EventListener);
      item.addEventListener('click', clickSpy as EventListener);
      item.addEventListener('keydown', keydownSpy as EventListener);
      menu.anchorElement = anchor;
      await new MenuHarness(menu).show();
      const itemHarness = new MenuItemHarness(item);

      return {
        menu,
        item,
        itemHarness,
        events,
        closeMenuSpy,
        clickSpy,
        keydownSpy,
      };
    }

    async function waitForSubmenuOpen(
      triggerHarness: MenuItemHarness,
      nestedMenu: MdMenu,
      nestedItem: LitElement,
      key: string,
      init: KeyboardEventInit = {},
    ) {
      const opened = new Promise<void>((resolve) => {
        nestedMenu.addEventListener(
          'opened',
          () => {
            resolve();
          },
          {once: true},
        );
      });
      await triggerHarness.keypress(key, init);
      await opened;
      await nestedItem.updateComplete;
      await Promise.resolve();
    }

    it('dispatches close-menu before click on Enter for menuitem', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({type: 'menuitem'});

      await itemHarness.keypress('Enter', {code: 'Enter'});
      await menu.updateComplete;

      expect(events).toEqual([
        {event: 'close-menu', reason: {kind: CloseReason.KEYDOWN, key: 'Enter'}},
        {event: 'click'},
      ]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeFalse();
    });

    it('normalizes NumpadEnter to Enter in close-menu before click for menuitem', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({type: 'menuitem'});

      await itemHarness.keypress('Enter', {code: 'NumpadEnter'});
      await menu.updateComplete;

      expect(events).toEqual([
        {event: 'close-menu', reason: {kind: CloseReason.KEYDOWN, key: 'Enter'}},
        {event: 'click'},
      ]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeFalse();
    });

    it('dispatches close-menu before click on Space for menuitem', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({type: 'menuitem'});

      await itemHarness.keypress(' ', {code: 'Space'});
      await menu.updateComplete;

      expect(events).toEqual([
        {event: 'close-menu', reason: {kind: CloseReason.KEYDOWN, key: 'Space'}},
        {event: 'click'},
      ]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeFalse();
    });

    it('dispatches close-menu before click on Enter for option', async () => {
      const {menu, itemHarness, events} = await setupSingleItemMenu({
        type: 'option',
      });

      await itemHarness.keypress('Enter', {code: 'Enter'});
      await menu.updateComplete;

      expect(events).toEqual([
        {event: 'close-menu', reason: {kind: CloseReason.KEYDOWN, key: 'Enter'}},
        {event: 'click'},
      ]);
      expect(menu.open).toBeFalse();
    });

    it('dispatches close-menu before click on Enter for button', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({type: 'button'});

      await itemHarness.keypress('Enter', {code: 'Enter'});
      await menu.updateComplete;

      expect(events).toEqual([
        {event: 'close-menu', reason: {kind: CloseReason.KEYDOWN, key: 'Enter'}},
        {event: 'click'},
      ]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeFalse();
    });

    it('dispatches close-menu before click on Space for button', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({type: 'button'});

      await itemHarness.keypress(' ', {code: 'Space'});
      await menu.updateComplete;

      expect(events).toEqual([
        {event: 'close-menu', reason: {kind: CloseReason.KEYDOWN, key: 'Space'}},
        {event: 'click'},
      ]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeFalse();
    });

    it('dispatches a single KEYDOWN close-menu before click on Enter for link', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({href: 'https://example.com'});

      await itemHarness.keypress('Enter', {code: 'Enter'});
      await menu.updateComplete;

      expect(events).toEqual([
        {event: 'close-menu', reason: {kind: CloseReason.KEYDOWN, key: 'Enter'}},
        {event: 'click'},
      ]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeFalse();
    });

    it('dispatches close-menu before click on Space for link', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({href: 'https://example.com'});

      await itemHarness.keypress(' ', {code: 'Space'});
      await menu.updateComplete;

      expect(events).toEqual([
        {event: 'close-menu', reason: {kind: CloseReason.KEYDOWN, key: 'Space'}},
        {event: 'click'},
      ]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeFalse();
    });

    it('does not synthesize click on Enter or Space when activateOnKeydown is omitted', () => {
      const closeReasons: Array<CloseMenuEvent['detail']['reason']> = [];
      const host = document.createElement('div') as unknown as MenuItem &
        LitElement;
      host.disabled = false;
      host.type = 'option';
      host.addController = () => {};
      host.addEventListener('close-menu', ((event: CloseMenuEvent) => {
        closeReasons.push(event.detail.reason);
      }) as EventListener);
      root.appendChild(host);

      const interactiveEl = document.createElement('li');
      const clickSpy = jasmine.createSpy('click');
      interactiveEl.addEventListener('click', clickSpy);
      host.appendChild(interactiveEl);

      const controller = new MenuItemController(host, {
        getHeadlineElements: () => [],
        getSupportingTextElements: () => [],
        getDefaultElements: () => [],
        getInteractiveElement: () => interactiveEl,
      });

      controller.onKeydown(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          code: 'Enter',
          cancelable: true,
        }),
      );
      controller.onKeydown(
        new KeyboardEvent('keydown', {
          key: ' ',
          code: 'Space',
          cancelable: true,
        }),
      );

      expect(clickSpy).not.toHaveBeenCalled();
      expect(closeReasons).toEqual([
        {kind: CloseReason.KEYDOWN, key: 'Enter'},
        {kind: CloseReason.KEYDOWN, key: 'Space'},
      ]);
    });

    it('clicks keep-open item on Space and prevents scroll without closing menu', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({keepOpen: true});

      await itemHarness.keypress(' ', {code: 'Space'});
      await menu.updateComplete;

      expect(events).toEqual([{event: 'click'}]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeTrue();
    });

    it('retains roving tabIndex and focus on keep-open item on NumpadEnter with Enterprise sibling', async () => {
      const closeMenuSpy = jasmine.createSpy('close-menu');
      const pinClickSpy = jasmine.createSpy('pin-click');
      const enterpriseClickSpy = jasmine.createSpy('enterprise-click');

      render(
        html`
          <button>Open</button>
          <md-menu quick>
            <md-menu-item id="pin" keep-open>
              <div slot="headline">Pin</div>
            </md-menu-item>
            <md-menu-item id="enterprise">
              <div slot="headline">Enterprise</div>
            </md-menu-item>
          </md-menu>
        `,
        root,
      );

      const menu = root.querySelector('md-menu')!;
      const pinItem = root.querySelector<MdMenuItem>('#pin')!;
      const enterpriseItem = root.querySelector<MdMenuItem>('#enterprise')!;
      menu.addEventListener('close-menu', closeMenuSpy);
      pinItem.addEventListener('click', pinClickSpy);
      enterpriseItem.addEventListener('click', enterpriseClickSpy);
      menu.anchorElement = root.querySelector('button')!;
      await new MenuHarness(menu).show();

      const pinHarness = new MenuItemHarness(pinItem);
      await pinHarness.keypress('Enter', {code: 'NumpadEnter'});
      await menu.updateComplete;

      expect(pinClickSpy).toHaveBeenCalledTimes(1);
      expect(enterpriseClickSpy).not.toHaveBeenCalled();
      expect(closeMenuSpy).not.toHaveBeenCalled();
      expect(pinItem.tabIndex).toBe(0);
      expect(enterpriseItem.tabIndex).toBe(-1);
      expect(document.activeElement).toBe(pinItem);
      expect(menu.open).toBeTrue();
    });

    it('closes menu without clicking when Escape is pressed on keep-open item', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({keepOpen: true});

      await itemHarness.keypress('Escape', {code: 'Escape'});
      await menu.updateComplete;

      expect(events).toEqual([
        {
          event: 'close-menu',
          reason: {kind: CloseReason.KEYDOWN, key: 'Escape'},
        },
      ]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeFalse();
    });

    it('prevents default without clicking or closing on disabled item Space', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({disabled: true});

      await itemHarness.keypress(' ', {code: 'Space'});
      await menu.updateComplete;

      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeTrue();
    });

    it('prevents default without clicking or closing on focusable disabled link Enter', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({
          disabled: true,
          href: 'https://example.com',
        });
      const interactiveEl = await itemHarness.getInteractiveElement();
      interactiveEl.focus();

      await itemHarness.keypress('Enter', {code: 'Enter'});
      await menu.updateComplete;

      expect(interactiveEl.tabIndex).toBe(0);
      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeTrue();
    });

    it('prevents default without clicking on Ctrl+Enter for focusable disabled link', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({
          disabled: true,
          href: 'https://example.com',
        });
      const interactiveEl = await itemHarness.getInteractiveElement();
      interactiveEl.focus();

      await itemHarness.keypress('Enter', {code: 'Enter', ctrlKey: true});
      await menu.updateComplete;

      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeTrue();
    });

    it('closes menu on Escape from focused disabled link without clicking', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({
          disabled: true,
          href: 'https://example.com',
        });
      const interactiveEl = await itemHarness.getInteractiveElement();
      interactiveEl.focus();

      await itemHarness.keypress('Escape', {code: 'Escape'});
      await menu.updateComplete;

      expect(events).toEqual([
        {
          event: 'close-menu',
          reason: {kind: CloseReason.KEYDOWN, key: 'Escape'},
        },
      ]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeFalse();
    });

    it('prevents default without clicking or closing on repeated Enter', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({href: 'https://example.com'});

      await itemHarness.keypress('Enter', {code: 'Enter', repeat: true});
      await menu.updateComplete;

      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeTrue();
    });

    it('leaves Enter untouched during IME composition', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({type: 'menuitem'});

      await itemHarness.keypress('Enter', {code: 'Enter', isComposing: true});
      await menu.updateComplete;

      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeFalse();
      expect(menu.open).toBeTrue();
    });

    it('leaves Ctrl+Enter un-prevented with zero synthetic clicks on link item', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({href: 'https://example.com'});

      await itemHarness.keypress('Enter', {code: 'Enter', ctrlKey: true});
      await menu.updateComplete;

      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeFalse();
      expect(menu.open).toBeTrue();
    });

    it('leaves Meta+Enter un-prevented with zero synthetic clicks on link item', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({href: 'https://example.com'});

      await itemHarness.keypress('Enter', {code: 'Enter', metaKey: true});
      await menu.updateComplete;

      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeFalse();
      expect(menu.open).toBeTrue();
    });

    it('suppresses click and prevents scroll on Shift+Space for link item', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({href: 'https://example.com'});

      await itemHarness.keypress(' ', {code: 'Space', shiftKey: true});
      await menu.updateComplete;

      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeTrue();
    });

    it('suppresses click and calls preventDefault on Alt+Enter for button item', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({type: 'button'});

      await itemHarness.keypress('Enter', {code: 'Enter', altKey: true});
      await menu.updateComplete;

      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeTrue();
    });

    it('suppresses click and prevents scroll on Shift+Space for menuitem', async () => {
      const {menu, itemHarness, events, keydownSpy} =
        await setupSingleItemMenu({type: 'menuitem'});

      await itemHarness.keypress(' ', {code: 'Space', shiftKey: true});
      await menu.updateComplete;

      expect(events).toEqual([]);
      expect(keydownSpy.calls.mostRecent().args[0].defaultPrevented).toBeTrue();
      expect(menu.open).toBeTrue();
    });

    it('ignores Enter and Space originating from a slotted end button', async () => {
      const closeMenuSpy = jasmine.createSpy('close-menu');
      const itemClickSpy = jasmine.createSpy('item-click');

      render(
        html`
          <button id="anchor">Open</button>
          <md-menu quick>
            <md-menu-item>
              <div slot="headline">Row</div>
              <button id="slotted-btn" slot="end">Trailing</button>
            </md-menu-item>
          </md-menu>
        `,
        root,
      );

      const menu = root.querySelector('md-menu')!;
      const item = root.querySelector('md-menu-item')!;
      const slottedBtn = root.querySelector<HTMLButtonElement>('#slotted-btn')!;
      menu.addEventListener('close-menu', closeMenuSpy);
      item.addEventListener('click', itemClickSpy);
      menu.anchorElement = root.querySelector('#anchor')!;
      await new MenuHarness(menu).show();
      slottedBtn.focus();

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      const spaceEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      slottedBtn.dispatchEvent(enterEvent);
      slottedBtn.dispatchEvent(spaceEvent);
      await menu.updateComplete;

      expect(enterEvent.defaultPrevented).toBeFalse();
      expect(spaceEvent.defaultPrevented).toBeFalse();
      expect(itemClickSpy).not.toHaveBeenCalled();
      expect(closeMenuSpy).not.toHaveBeenCalled();
      expect(menu.open).toBeTrue();
    });

    it('activates item from inert slotted headline while ignoring focusable slotted descendants', async () => {
      const closeMenuSpy = jasmine.createSpy('close-menu');
      const controlsItemClickSpy = jasmine.createSpy('controls-item-click');
      const headlineItemClickSpy = jasmine.createSpy('headline-item-click');

      render(
        html`
          <button id="anchor">Open</button>
          <md-menu quick>
            <md-menu-item id="controls-item">
              <div id="tabindex-el" slot="start" tabindex="-1">Focusable</div>
              <div id="editable-el" slot="supporting-text" contenteditable="true">
                Editable
              </div>
              <div id="delegates-focus-el" slot="end"></div>
            </md-menu-item>
            <md-menu-item id="headline-item">
              <div id="inert-headline" slot="headline">Add a session</div>
            </md-menu-item>
          </md-menu>
        `,
        root,
      );

      const menu = root.querySelector('md-menu')!;
      const controlsItem = root.querySelector<MdMenuItem>('#controls-item')!;
      const headlineItem = root.querySelector<MdMenuItem>('#headline-item')!;
      const tabindexEl = root.querySelector<HTMLElement>('#tabindex-el')!;
      const editableEl = root.querySelector<HTMLElement>('#editable-el')!;
      const delegatesFocusEl =
        root.querySelector<HTMLElement>('#delegates-focus-el')!;
      delegatesFocusEl.attachShadow({mode: 'open', delegatesFocus: true});
      const inertHeadline = root.querySelector<HTMLElement>('#inert-headline')!;
      menu.addEventListener('close-menu', closeMenuSpy);
      controlsItem.addEventListener('click', controlsItemClickSpy);
      headlineItem.addEventListener('click', headlineItemClickSpy);
      menu.anchorElement = root.querySelector('#anchor')!;
      await new MenuHarness(menu).show();

      const tabindexEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      const editableEvent = new KeyboardEvent('keydown', {
        key: ' ',
        code: 'Space',
        bubbles: true,
        cancelable: true,
      });
      const delegatesFocusEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      tabindexEl.dispatchEvent(tabindexEvent);
      editableEl.dispatchEvent(editableEvent);
      delegatesFocusEl.dispatchEvent(delegatesFocusEvent);
      await menu.updateComplete;

      expect(tabindexEvent.defaultPrevented).toBeFalse();
      expect(editableEvent.defaultPrevented).toBeFalse();
      expect(delegatesFocusEvent.defaultPrevented).toBeFalse();
      expect(controlsItemClickSpy).not.toHaveBeenCalled();
      expect(closeMenuSpy).not.toHaveBeenCalled();
      expect(menu.open).toBeTrue();

      const headlineEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      inertHeadline.dispatchEvent(headlineEvent);
      await menu.updateComplete;

      expect(headlineEvent.defaultPrevented).toBeTrue();
      expect(headlineItemClickSpy).toHaveBeenCalledTimes(1);
      expect(closeMenuSpy).toHaveBeenCalledTimes(1);
      expect(menu.open).toBeFalse();
    });

    it('recovers CLICK_SELECTION after interactiveElement.click() throws during Enter', () => {
      const closeReasons: Array<CloseMenuEvent['detail']['reason']> = [];
      const host = document.createElement('div') as unknown as MenuItem &
        LitElement;
      host.disabled = false;
      host.type = 'menuitem';
      host.keepOpen = false;
      host.addController = () => {};
      host.addEventListener('close-menu', ((event: CloseMenuEvent) => {
        closeReasons.push(event.detail.reason);
      }) as EventListener);
      root.appendChild(host);

      const interactiveEl = document.createElement('li');
      host.appendChild(interactiveEl);
      spyOn(interactiveEl, 'click').and.throwError(
        new Error('synthetic click error'),
      );

      const controller = new MenuItemController(host, {
        getHeadlineElements: () => [],
        getSupportingTextElements: () => [],
        getDefaultElements: () => [],
        getInteractiveElement: () => interactiveEl,
        activateOnKeydown: true,
      });

      const enterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        code: 'Enter',
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      Object.defineProperty(enterEvent, 'target', {value: interactiveEl});
      spyOn(enterEvent, 'composedPath').and.returnValue([interactiveEl, host]);

      expect(() => {
        controller.onKeydown(enterEvent);
      }).toThrowError('synthetic click error');

      closeReasons.length = 0;
      controller.onClick();

      expect(closeReasons).toEqual([{kind: CloseReason.CLICK_SELECTION}]);
    });

    async function setupDirectSubmenu() {
      const triggerClickSpy = jasmine.createSpy('trigger-click');

      render(
        html`
          <button>Open</button>
          <md-menu quick has-overflow>
            <md-sub-menu hover-open-delay="0" hover-close-delay="0">
              <md-menu-item id="trigger" slot="item">
                <div slot="headline">More</div>
              </md-menu-item>
              <md-menu id="nested-menu" quick slot="menu">
                <md-menu-item id="nested-item">
                  <div slot="headline">Nested 1</div>
                </md-menu-item>
              </md-menu>
            </md-sub-menu>
          </md-menu>
        `,
        root,
      );

      const anchor = root.querySelector('button')!;
      const menu = root.querySelector<MdMenu>('md-menu')!;
      const subMenu = root.querySelector<MdSubMenu>('md-sub-menu')!;
      const trigger = root.querySelector<MdMenuItem>('#trigger')!;
      const nestedMenu = root.querySelector<MdMenu>('#nested-menu')!;
      const nestedItem = root.querySelector<MdMenuItem>('#nested-item')!;
      trigger.addEventListener('click', triggerClickSpy);
      menu.anchorElement = anchor;
      await new MenuHarness(menu).show();
      await subMenu.updateComplete;
      const triggerHarness = new MenuItemHarness(trigger);

      return {menu, nestedMenu, nestedItem, triggerHarness, triggerClickSpy};
    }

    it('opens direct md-sub-menu trigger and focuses first item on NumpadEnter without clicking trigger', async () => {
      const {menu, nestedMenu, nestedItem, triggerHarness, triggerClickSpy} =
        await setupDirectSubmenu();

      await waitForSubmenuOpen(triggerHarness, nestedMenu, nestedItem, 'Enter', {
        code: 'NumpadEnter',
      });

      expect(triggerClickSpy).not.toHaveBeenCalled();
      expect(menu.open).toBeTrue();
      expect(nestedMenu.open).toBeTrue();
      expect(document.activeElement).toBe(nestedItem);
    });

    it('opens direct md-sub-menu trigger and focuses first item on Space without clicking trigger', async () => {
      const {menu, nestedMenu, nestedItem, triggerHarness, triggerClickSpy} =
        await setupDirectSubmenu();

      await waitForSubmenuOpen(triggerHarness, nestedMenu, nestedItem, ' ', {
        code: 'Space',
      });

      expect(triggerClickSpy).not.toHaveBeenCalled();
      expect(menu.open).toBeTrue();
      expect(nestedMenu.open).toBeTrue();
      expect(document.activeElement).toBe(nestedItem);
    });

    it('opens Shadow DOM-wrapped md-sub-menu trigger and focuses first item on Enter without clicking trigger', async () => {
      const triggerClickSpy = jasmine.createSpy('trigger-click');

      render(
        html`
          <button>Open</button>
          <md-menu quick has-overflow>
            <md-sub-menu hover-open-delay="0" hover-close-delay="0">
              <test-wrapped-menu-item id="wrapped-trigger" slot="item">
                <div slot="headline">Wrapped More</div>
              </test-wrapped-menu-item>
              <md-menu id="nested-menu" quick slot="menu">
                <md-menu-item id="nested-item">
                  <div slot="headline">Nested 1</div>
                </md-menu-item>
              </md-menu>
            </md-sub-menu>
          </md-menu>
        `,
        root,
      );

      const menu = root.querySelector<MdMenu>('md-menu')!;
      const subMenu = root.querySelector<MdSubMenu>('md-sub-menu')!;
      const wrappedTrigger =
        root.querySelector<TestWrappedMenuItem>('#wrapped-trigger')!;
      const nestedMenu = root.querySelector<MdMenu>('#nested-menu')!;
      const nestedItem = root.querySelector<MdMenuItem>('#nested-item')!;
      wrappedTrigger.addEventListener('click', triggerClickSpy);
      menu.anchorElement = root.querySelector('button')!;
      await new MenuHarness(menu).show();
      await subMenu.updateComplete;
      await wrappedTrigger.updateComplete;
      const triggerHarness = new MenuItemHarness(wrappedTrigger.innerItem);

      await waitForSubmenuOpen(triggerHarness, nestedMenu, nestedItem, 'Enter', {
        code: 'Enter',
      });

      expect(triggerClickSpy).not.toHaveBeenCalled();
      expect(menu.open).toBeTrue();
      expect(nestedMenu.open).toBeTrue();
      expect(document.activeElement).toBe(nestedItem);
    });

    it('dispatches close-menu before click when md-menu-item with slot="item" is placed directly inside md-menu', async () => {
      const {menu, itemHarness, events} = await setupSingleItemMenu({
        slot: 'item',
      });

      await itemHarness.keypress('Enter', {code: 'Enter'});
      await menu.updateComplete;

      expect(events).toEqual([
        {event: 'close-menu', reason: {kind: CloseReason.KEYDOWN, key: 'Enter'}},
        {event: 'click'},
      ]);
    });

    it('activates wrapped leaf item inside a 2-level nested md-sub-menu and closes all menus on Enter', async () => {
      const leafClickSpy = jasmine.createSpy('leaf-click');

      render(
        html`
          <button>Open</button>
          <md-menu id="root-menu" quick has-overflow>
            <md-sub-menu id="sub-1" hover-open-delay="0" hover-close-delay="0">
              <md-menu-item id="trigger-1" slot="item">
                <div slot="headline">Level 1</div>
              </md-menu-item>
              <md-menu id="menu-1" quick has-overflow slot="menu">
                <md-sub-menu
                  id="sub-2"
                  hover-open-delay="0"
                  hover-close-delay="0">
                  <md-menu-item id="trigger-2" slot="item">
                    <div slot="headline">Level 2</div>
                  </md-menu-item>
                  <md-menu id="menu-2" quick slot="menu">
                    <test-wrapped-menu-item id="wrapped-leaf">
                      <div slot="headline">Wrapped Leaf</div>
                    </test-wrapped-menu-item>
                  </md-menu>
                </md-sub-menu>
              </md-menu>
            </md-sub-menu>
          </md-menu>
        `,
        root,
      );

      const rootMenu = root.querySelector<MdMenu>('#root-menu')!;
      const sub1 = root.querySelector<MdSubMenu>('#sub-1')!;
      const trigger1 = root.querySelector<MdMenuItem>('#trigger-1')!;
      const menu1 = root.querySelector<MdMenu>('#menu-1')!;
      const sub2 = root.querySelector<MdSubMenu>('#sub-2')!;
      const trigger2 = root.querySelector<MdMenuItem>('#trigger-2')!;
      const menu2 = root.querySelector<MdMenu>('#menu-2')!;
      const wrappedLeaf =
        root.querySelector<TestWrappedMenuItem>('#wrapped-leaf')!;
      wrappedLeaf.addEventListener('click', leafClickSpy);
      rootMenu.anchorElement = root.querySelector('button')!;
      await new MenuHarness(rootMenu).show();
      await sub1.updateComplete;
      await sub2.updateComplete;
      await wrappedLeaf.updateComplete;

      await waitForSubmenuOpen(
        new MenuItemHarness(trigger1),
        menu1,
        trigger2,
        'Enter',
        {code: 'Enter'},
      );
      await waitForSubmenuOpen(
        new MenuItemHarness(trigger2),
        menu2,
        wrappedLeaf,
        'Enter',
        {code: 'Enter'},
      );

      const leafHarness = new MenuItemHarness(wrappedLeaf.innerItem);
      await leafHarness.keypress('Enter', {code: 'Enter'});
      await menu2.updateComplete;
      await menu1.updateComplete;
      await rootMenu.updateComplete;

      expect(leafClickSpy).toHaveBeenCalledTimes(1);
      expect(menu2.open).toBeFalse();
      expect(menu1.open).toBeFalse();
      expect(rootMenu.open).toBeFalse();
    });

    async function setupTypeaheadMenu() {
      const closeMenuSpy = jasmine.createSpy('close-menu');
      const clickSpy = jasmine.createSpy('click');

      render(
        html`
          <button>Open</button>
          <md-menu quick>
            <md-menu-item id="banana">
              <div slot="headline">Banana</div>
            </md-menu-item>
            <md-menu-item id="applet">
              <div slot="headline">Applet</div>
            </md-menu-item>
            <md-menu-item id="apple-pie">
              <div slot="headline">Apple Pie</div>
            </md-menu-item>
          </md-menu>
        `,
        root,
      );

      const menu = root.querySelector('md-menu')!;
      const banana = root.querySelector<MdMenuItem>('#banana')!;
      const applet = root.querySelector<MdMenuItem>('#applet')!;
      const applePie = root.querySelector<MdMenuItem>('#apple-pie')!;
      menu.addEventListener('close-menu', closeMenuSpy);
      menu.addEventListener('click', clickSpy);
      menu.anchorElement = root.querySelector('button')!;
      await new MenuHarness(menu).show();

      return {
        menu,
        bananaHarness: new MenuItemHarness(banana),
        appletHarness: new MenuItemHarness(applet),
        applePie,
        closeMenuSpy,
        clickSpy,
      };
    }

    it('focuses matching item on mid-prefix typeahead Space without clicking or closing', async () => {
      const {
        menu,
        bananaHarness,
        appletHarness,
        applePie,
        closeMenuSpy,
        clickSpy,
      } = await setupTypeaheadMenu();

      await bananaHarness.keypress('a', {code: 'KeyA'});
      await appletHarness.keypress('p', {code: 'KeyP'});
      await appletHarness.keypress('p', {code: 'KeyP'});
      await appletHarness.keypress('l', {code: 'KeyL'});
      await appletHarness.keypress('e', {code: 'KeyE'});
      await appletHarness.keypress(' ', {code: 'Space'});
      await menu.updateComplete;

      expect(document.activeElement).toBe(applePie);
      expect(clickSpy).not.toHaveBeenCalled();
      expect(closeMenuSpy).not.toHaveBeenCalled();
      expect(menu.open).toBeTrue();
    });

    it('focuses matching item on mid-prefix typeahead Space without event.code without clicking or closing', async () => {
      const {
        menu,
        bananaHarness,
        appletHarness,
        applePie,
        closeMenuSpy,
        clickSpy,
      } = await setupTypeaheadMenu();

      await bananaHarness.keypress('a');
      await appletHarness.keypress('p');
      await appletHarness.keypress('p');
      await appletHarness.keypress('l');
      await appletHarness.keypress('e');
      await appletHarness.keypress(' ');
      await menu.updateComplete;

      expect(document.activeElement).toBe(applePie);
      expect(clickSpy).not.toHaveBeenCalled();
      expect(closeMenuSpy).not.toHaveBeenCalled();
      expect(menu.open).toBeTrue();
    });
  });
});
