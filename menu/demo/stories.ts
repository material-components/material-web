/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/button/filled-button.js';
import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';
import '@material/web/menu/menu.js';
import '@material/web/menu/menu-item.js';
import '@material/web/menu/sub-menu.js';

import {MaterialStoryInit} from './material-collection.js';
import {CloseMenuEvent} from '@material/web/menu/internal/controllers/shared.js';
import {Corner, FocusState, MdMenu, MenuItem} from '@material/web/menu/menu.js';
import {css, html} from 'lit';

/** Knob types for Menu stories. */
export interface StoryKnobs {
  menu: void;
  anchorCorner: Corner | undefined;
  menuCorner: Corner | undefined;
  defaultFocus: FocusState | undefined;
  positioning: 'absolute' | 'fixed' | 'document' | 'popover' | undefined;
  open: boolean;
  quick: boolean;
  hasOverflow: boolean;
  stayOpenOnOutsideClick: boolean;
  stayOpenOnFocusout: boolean;
  skipRestoreFocus: boolean;
  xOffset: number;
  yOffset: number;
  typeaheadDelay: number;
  listTabIndex: number;

  'menu-item': void;
  keepOpen: boolean;
  disabled: boolean;
  href: string;
  'link icon': string;

  'sub-menu': void;
  'submenu.anchorCorner': Corner | undefined;
  'submenu.menuCorner': Corner | undefined;
  hoverOpenDelay: number;
  hoverCloseDelay: number;
  'submenu item icon': string;
}

const fruitNames = [
  'Apple',
  'Apricot',
  'Avocado',
  'Green Apple',
  'Green Grapes',
  'Olive',
  'Orange',
];

const sharedStyle = css`
  #anchor {
    display: block;
    border: 1px solid var(--md-sys-color-on-background);
    color: var(--md-sys-color-on-background);
    width: 100px;
    padding: 16px;
    text-align: center;
  }
  .md-stories-bg-override {
    display: flex;
    justify-content: center;
    width: min(700px, 80vw);
  }
  .root {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .output {
    color: var(--md-sys-color-on-background);
    margin-top: 4px;
    font-family: sans-serif;
  }
  [dir='rtl'] md-icon {
    transform: scaleX(-1);
  }
  [slot='headline'] {
    white-space: nowrap;
  }
`;

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Menu with items',
  styles: sharedStyle,
  render(knobs) {
    return html`
      <div class="root">
        <div
          style="${knobs.positioning === 'document'
            ? ''
            : 'position:relative;'}">
          <md-filled-button
            @click=${toggleMenu}
            @keydown=${toggleMenu}
            aria-haspopup="true"
            aria-controls="menu"
            aria-expanded="false"
            id="button">
            Open Menu
          </md-filled-button>
          <md-menu
            id="menu"
            anchor="button"
            tabindex=${knobs.defaultFocus === 'list-root' ? '0' : '-1'}
            style=${knobs.defaultFocus === 'list-root' ? 'display:flex;' : ''}
            .quick=${knobs.quick}
            .hasOverflow=${knobs.hasOverflow}
            aria-label="Menu of fruit"
            .anchorCorner="${knobs.anchorCorner!}"
            .menuCorner="${knobs.menuCorner!}"
            .xOffset=${knobs.xOffset}
            .yOffset=${knobs.yOffset}
            .positioning=${knobs.positioning!}
            .defaultFocus=${knobs.defaultFocus!}
            .skipRestoreFocus=${knobs.skipRestoreFocus}
            .typeaheadDelay=${knobs.typeaheadDelay}
            .stayOpenOnOutsideClick=${knobs.stayOpenOnOutsideClick}
            .stayOpenOnFocusout=${knobs.stayOpenOnFocusout}
            @close-menu=${displayCloseEvent}
            @closed=${setButtonAriaExpandedFalse}>
            ${fruitNames.map(
              (name, index) => html` <md-menu-item
                id=${index}
                .keepOpen=${knobs.keepOpen}
                .disabled=${knobs.disabled}>
                <div slot="headline">${name}</div>
              </md-menu-item>`,
            )}
          </md-menu>
        </div>
        <pre class="output"></pre>
      </div>
    `;
  },
};

const linkable: MaterialStoryInit<StoryKnobs> = {
  name: 'Menu with links',
  styles: sharedStyle,
  render(knobs) {
    const items = fruitNames.map((name, index) => {
      return html` <md-menu-item
          id=${index}
          target="_blank"
          .disabled=${knobs.disabled}
          .href=${knobs.href}>
          <div slot="headline">${name}</div>
          <md-icon slot="end"> ${knobs['link icon']} </md-icon>
        </md-menu-item>
        ${index === 2
          ? html`<md-divider role="separator" tabindex="-1"></md-divider>`
          : ''}`;
    });

    return html`
      <div class="root">
        <div
          style="${knobs.positioning === 'document'
            ? ''
            : 'position:relative;'}">
          <md-filled-button
            @click=${toggleMenu}
            @keydown=${toggleMenu}
            aria-haspopup="true"
            aria-controls="menu"
            aria-expanded="false"
            id="button">
            Open Menu
          </md-filled-button>
          <md-menu
            id="menu"
            anchor="button"
            tabindex=${knobs.defaultFocus === 'list-root' ? '0' : '-1'}
            style=${knobs.defaultFocus === 'list-root' ? 'display:flex;' : ''}
            .quick=${knobs.quick}
            .hasOverflow=${knobs.hasOverflow}
            aria-label="Menu with links"
            .anchorCorner="${knobs.anchorCorner!}"
            .menuCorner="${knobs.menuCorner!}"
            .xOffset=${knobs.xOffset}
            .yOffset=${knobs.yOffset}
            .positioning=${knobs.positioning!}
            .defaultFocus=${knobs.defaultFocus!}
            .skipRestoreFocus=${knobs.skipRestoreFocus}
            .typeaheadDelay=${knobs.typeaheadDelay}
            .stayOpenOnOutsideClick=${knobs.stayOpenOnOutsideClick}
            .stayOpenOnFocusout=${knobs.stayOpenOnFocusout}
            @close-menu=${displayCloseEvent}
            @closed=${setButtonAriaExpandedFalse}>
            ${items}
          </md-menu>
        </div>
        <pre class="output"></pre>
      </div>
    `;
  },
};

const submenu: MaterialStoryInit<StoryKnobs> = {
  name: 'Menu with sub-menus',
  styles: sharedStyle,
  render(knobs) {
    let currentIndex = -1;

    // This is the third layer with all menu items which close on selection
    const layer2 = fruitNames.slice(4).map((name) => {
      currentIndex++;

      return html` <md-menu-item
        .keepOpen=${knobs.keepOpen}
        .disabled=${knobs.disabled}>
        <div slot="headline">${name}</div>
      </md-menu-item>`;
    });

    // This is the second layer with a mix of submenu items and menu items
    const layer1 = [
      ...fruitNames.slice(0, 2).map((name) => {
        currentIndex++;

        return html` <md-sub-menu
          id=${currentIndex}
          .anchorCorner=${knobs['submenu.anchorCorner']!}
          .menuCorner=${knobs['submenu.menuCorner']!}
          .hoverOpenDelay=${knobs.hoverOpenDelay}
          .hoverCloseDelay=${knobs.hoverCloseDelay}>
          <md-menu-item
            slot="item"
            id=${++currentIndex}
            .disabled=${knobs.disabled}>
            <div slot="headline">${name}</div>
            <md-icon slot="end"> ${knobs['submenu item icon']} </md-icon>
          </md-menu-item>
          <!-- NOTE: slot=submenu -->
          <md-menu
            slot="menu"
            aria-label="Second sub-menu of fruit"
            .xOffset=${knobs.xOffset}
            .yOffset=${knobs.yOffset}
            .positioning=${knobs.positioning!}
            .defaultFocus=${knobs.defaultFocus!}
            .typeaheadDelay=${knobs.typeaheadDelay}>
            ${layer2}
          </md-menu>
        </md-sub-menu>`;
      }),
      ...fruitNames.slice(2, 5).map((name) => {
        currentIndex++;

        return html` <md-menu-item
          id=${currentIndex}
          .keepOpen=${knobs.keepOpen}
          .disabled=${knobs.disabled}>
          <div slot="headline">${name}</div>
        </md-menu-item>`;
      }),
    ];

    // This is the first layer with all sub menu items
    const layer0 = fruitNames.map((name) => {
      currentIndex++;

      return html` <md-sub-menu
        id=${currentIndex}
        .anchorCorner=${knobs['submenu.anchorCorner']!}
        .menuCorner=${knobs['submenu.menuCorner']!}
        .hoverOpenDelay=${knobs.hoverOpenDelay}
        .hoverCloseDelay=${knobs.hoverCloseDelay}>
        <md-menu-item
          slot="item"
          id=${++currentIndex}
          .disabled=${knobs.disabled}>
          <div slot="headline">${name}</div>
          <md-icon slot="end"> ${knobs['submenu item icon']} </md-icon>
        </md-menu-item>
        <!-- NOTE: slot=submenu -->
        <md-menu
          slot="menu"
          aria-label="Sub-menu of fruit"
          .xOffset=${knobs.xOffset}
          .yOffset=${knobs.yOffset}
          .positioning=${knobs.positioning!}
          .defaultFocus=${knobs.defaultFocus!}
          .typeaheadDelay=${knobs.typeaheadDelay}>
          ${layer1}
        </md-menu>
      </md-sub-menu>`;
    });

    return html`
      <div class="root">
        <div
          style="${knobs.positioning === 'document'
            ? ''
            : 'position:relative;'}">
          <md-filled-button
            @click=${toggleMenu}
            @keydown=${toggleMenu}
            aria-haspopup="true"
            aria-controls="menu"
            aria-expanded="false"
            id="button">
            Open Menu
          </md-filled-button>
          <!-- NOTE: has-overflow -->
          <md-menu
            anchor="button"
            id="menu"
            tabindex=${knobs.defaultFocus === 'list-root' ? '0' : '-1'}
            style=${knobs.defaultFocus === 'list-root' ? 'display:flex;' : ''}
            has-overflow
            .quick=${knobs.quick}
            aria-label="Menu of fruit"
            .anchorCorner="${knobs.anchorCorner!}"
            .menuCorner="${knobs.menuCorner!}"
            .xOffset=${knobs.xOffset}
            .yOffset=${knobs.yOffset}
            .positioning=${knobs.positioning!}
            .defaultFocus=${knobs.defaultFocus!}
            .skipRestoreFocus=${knobs.skipRestoreFocus}
            .typeaheadDelay=${knobs.typeaheadDelay}
            .stayOpenOnOutsideClick=${knobs.stayOpenOnOutsideClick}
            .stayOpenOnFocusout=${knobs.stayOpenOnFocusout}
            @close-menu=${displayCloseEvent}
            @closed=${setButtonAriaExpandedFalse}>
            ${layer0}
          </md-menu>
        </div>
        <pre class="output"></pre>
      </div>
    `;
  },
};

const menuWithoutButton: MaterialStoryInit<StoryKnobs> = {
  name: 'Menu without button',
  styles: [
    sharedStyle,
    css`
      #anchor {
        display: block;
        border: 1px solid var(--md-sys-color-on-background);
        color: var(--md-sys-color-on-background);
        width: 100px;
      }
      #storyWrapper {
        display: flex;
        justify-content: center;
        width: min(700px, 80vw);
      }
    `,
  ],
  render(knobs) {
    return html`
      <div
        class="root"
        style="${knobs.positioning === 'document' ? '' : 'position:relative;'}">
        <div id="anchor"> This is the anchor (use the "open" knob) </div>
        <md-menu
          slot="menu"
          anchor="anchor"
          .open=${knobs.open}
          .quick=${knobs.quick}
          .hasOverflow=${knobs.hasOverflow}
          aria-label="Menu of fruit"
          .anchorCorner="${knobs.anchorCorner!}"
          .menuCorner="${knobs.menuCorner!}"
          .xOffset=${knobs.xOffset}
          .yOffset=${knobs.yOffset}
          .positioning=${knobs.positioning!}
          .defaultFocus=${knobs.defaultFocus!}
          .skipRestoreFocus=${knobs.skipRestoreFocus}
          .typeaheadDelay=${knobs.typeaheadDelay}
          .stayOpenOnOutsideClick=${knobs.stayOpenOnOutsideClick}
          .stayOpenOnFocusout=${knobs.stayOpenOnFocusout}
          @close-menu=${displayCloseEvent}>
          ${fruitNames.map(
            (name, index) => html`
              <md-menu-item
                id=${index}
                .keepOpen=${knobs.keepOpen}
                .disabled=${knobs.disabled}>
                <div slot="headline">${name}</div>
              </md-menu-item>
            `,
          )}
        </md-menu>
        <pre class="output"></pre>
      </div>
    `;
  },
};

/**
 * Searches for an MdMenu with the id="menu" in the same shadow root and calls
 * `menu.show()` to open the menu. If it is a keyboard event, it will call show
 * only if the key is ArrowDown as is standard a11y practice. This function also
 * attempts to find a menu button with `#button` set on it and sets
 * aria-expanded=true.
 */
function toggleMenu(event: Event | KeyboardEvent) {
  // get the menu from the event
  const root = (event.target as HTMLElement).getRootNode() as ShadowRoot;
  const menu = root.querySelector('#menu') as MdMenu;

  // determine if is keyboard event
  const isKeyboardEvent = (
    event: KeyboardEvent | Event,
  ): event is KeyboardEvent => {
    return (event as KeyboardEvent).key !== undefined;
  };
  const isKeyboard = isKeyboardEvent(event);

  // if is a click, open the menu
  if (!isKeyboard) {
    menu.open = !menu.open;
    // if is arrow down, open the menu and prevent default to prevent scrolling
  } else if (event.key === 'ArrowDown') {
    menu.open = !menu.open;
    event.preventDefault();
  }

  // set aria-expanded true on the button
  root.querySelector('#button')?.setAttribute('aria-expanded', 'true');
}

/**
 * Searches for an element with `class="output"` set on it, and updates the
 * text of that element with the menu-closed event's content.
 */
function displayCloseEvent(event: CloseMenuEvent) {
  // get the output element from the shadow root
  const root = (event.target as HTMLElement).getRootNode() as ShadowRoot;
  const outputEl = root.querySelector('.output') as HTMLElement;

  const stringifyItem = (menuItem: MenuItem & HTMLElement) => {
    const tagName = menuItem.tagName.toLowerCase();
    const headline = menuItem.typeaheadText;
    return `${tagName}${
      menuItem.id ? `[id="${menuItem.id}"]` : ''
    } > [slot="headline"] > ${headline}`;
  };

  // display the event's details in the inner text of that output element
  outputEl.textContent = `CustomEvent {
  type: ${event.type},
  target: ${stringifyItem(event.target as unknown as MenuItem)},
  detail: {
    initiator: ${stringifyItem(event.detail.initiator)},
    itemPath: [
      ${event.detail.itemPath.map((item) => stringifyItem(item)).join(`,
      `)}
    ],
  },
  reason: ${JSON.stringify(event.detail.reason)}
}`;
}

function setButtonAriaExpandedFalse(e: Event) {
  const root = (e.target as HTMLElement).getRootNode() as ShadowRoot;
  // get the button element and remove aria-expaned if exists
  root.querySelector('#button')?.removeAttribute('aria-expanded');
}

/** Menu stories. */
export const stories = [standard, linkable, submenu, menuWithoutButton];
