/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import '@material/web/menu/menu-item.js';
import '@material/web/menu/menu-item-link.js';
import '@material/web/menu/sub-menu-item.js';
import '@material/web/menu/menu.js';
import '@material/web/button/filled-button.js';
import '@material/web/divider/divider.js';
import '@material/web/icon/icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {CloseMenuEvent} from '@material/web/menu/lib/shared.js';
import {Corner, DefaultFocusState, MdMenu} from '@material/web/menu/menu.js';
import {css, html, nothing, TemplateResult} from 'lit';
import {createRef, ref, Ref} from 'lit/directives/ref.js';

/** Knob types for Menu stories. */
export interface StoryKnobs {
  menu: void;
  anchorCorner: Corner|undefined;
  menuCorner: Corner|undefined;
  defaultFocus: DefaultFocusState|undefined;
  open: boolean;
  fixed: boolean;
  quick: boolean;
  hasOverflow: boolean;
  stayOpenOnOutsideClick: boolean;
  stayOpenOnFocusout: boolean;
  skipRestoreFocus: boolean;
  xOffset: number;
  yOffset: number;
  typeaheadDelay: number;
  listTabIndex: number;
  ariaLabel: string;

  'menu-item': void;
  keepOpen: boolean;
  disabled: boolean;

  'menu-item-link': void;
  href: string;
  target: string;
  'link icon': string;

  'sub-menu-item': void;
  'submenu.anchorCorner': Corner|undefined;
  'submenu.menuCorner': Corner|undefined;
  hoverOpenDelay: number;
  hoverCloseDelay: number;
  'submenu icon': string;
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
  }
  .md-stories-bg-override {
    display: flex;
    justify-content: center;
    width: min(700px, 80vw)
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
  [dir=rtl] md-icon {
    transform: scaleX(-1);
  }
`;

const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-menu> <md-menu-item>',
  styles: sharedStyle,
  render(knobs) {
    const showMenu = () => {
      firstMenuRef.value?.show?.();
    };

    const menu = renderMenu(
        knobs, firstAnchorRef, firstMenuRef, displayCloseEvent(firstOutputRef),
        false, renderItems(fruitNames, knobs));

    return html`
      <div class="root">
        <div style="position:relative;">

          <md-filled-button
              @click=${showMenu}
              ${ref(firstAnchorRef)}>
            Open Menu
          </md-filled-button>
          ${menu}

        </div>
        <div class="output" ${ref(firstOutputRef)}></div>
      </div>
    `;
  },
};

const linkable: MaterialStoryInit<StoryKnobs> = {
  name: '<md-menu-item-link>',
  styles: sharedStyle,
  render(knobs) {
    const showMenu = () => {
      secondMenuRef.value?.show?.();
    };

    const menu = renderMenu(
        knobs, secondAnchorRef, secondMenuRef,
        displayCloseEvent(secondOutputRef), false,
        renderLinkableItems(fruitNames, knobs));

    return html`
      <div class="root">
        <div style="position:relative;">

          <md-filled-button
              @click=${showMenu}
              ${ref(secondAnchorRef)}>
            Open Menu
          </md-filled-button>
          ${menu}

        </div>
        <div class="output" ${ref(secondOutputRef)}></div>
      </div>
    `;
  },
};

const submenu: MaterialStoryInit<StoryKnobs> = {
  name: '<md-sub-menu-item>',
  styles: sharedStyle,
  render(knobs) {
    const layer2 = renderItems(fruitNames, knobs).slice(4);
    const layer1 = [
      ...renderSubMenuItems(fruitNames, knobs, layer2).slice(0, 2),
      ...renderItems(fruitNames.slice(2, 4), knobs),
    ];
    const layer0 = renderSubMenuItems(fruitNames, knobs, layer1);

    const showMenu = () => {
      thirdMenuRef.value?.show?.();
    };

    const rootMenu = renderMenu(
        knobs, thirdAnchorRef, thirdMenuRef, displayCloseEvent(thirdOutputRef),
        true, layer0);

    return html`
      <div class="root">
        <div style="position:relative;">

          <md-filled-button
              @click=${showMenu}
              ${ref(thirdAnchorRef)}>
            Open Menu
          </md-filled-button>
          ${rootMenu}

        </div>
        <div class="output" ${ref(thirdOutputRef)}></div>
      </div>
    `;
  },
};

const menuWithoutButton: MaterialStoryInit<StoryKnobs> = {
  name: 'menu without menu-button',
  styles: [
    sharedStyle, css`
      #anchor {
        display: block;
        border: 1px solid var(--md-sys-color-on-background);
        color: var(--md-sys-color-on-background);
        width: 100px;
      }
      #storyWrapper {
        display: flex;
        justify-content: center;
        width: min(700px, 80vw)
      }
    `
  ],
  render(knobs) {
    return html`
      <div class="root" style="position:relative;">
        <div id="anchor" ${ref(fourthAnchorRef)}>
          This is the anchor (use the "open" knob)
        </div>
        <md-menu slot="menu"
            .open=${knobs.open}
            .quick=${knobs.quick}
            .hasOverflow=${knobs.hasOverflow}
            .ariaLabel=${knobs.ariaLabel}
            .anchor=${fourthAnchorRef.value || null}
            .anchorCorner="${knobs.anchorCorner!}"
            .menuCorner="${knobs.menuCorner!}"
            .xOffset=${knobs.xOffset}
            .yOffset=${knobs.yOffset}
            .fixed=${knobs.fixed}
            .defaultFocus=${knobs.defaultFocus!}
            .skipRestoreFocus=${knobs.skipRestoreFocus}
            .typeaheadDelay=${knobs.typeaheadDelay}
            .stayOpenOnOutsideClick=${knobs.stayOpenOnOutsideClick}
            .stayOpenOnFocusout=${knobs.stayOpenOnFocusout}
            @close-menu=${displayCloseEvent(fourthOutputRef)}>
          ${renderItems(fruitNames, knobs)}
        </md-menu>
        <div class="output" ${ref(fourthOutputRef)}></div>
      </div>
    `;
  },
};

function displayCloseEvent(outputRef: Ref<HTMLElement>) {
  return (e: CloseMenuEvent) => {
    if (!outputRef.value) return;

    outputRef.value.innerText = `Closed by item(s) with text: ${
        JSON.stringify(e.itemPath.map(
            item => item.headline))} For reason: ${JSON.stringify(e.reason)}`;
  };
}

function renderItems(names: string[], knobs: StoryKnobs) {
  return names.map(name => html`
    <md-menu-item
        headline=${name}
        .keepOpen=${knobs.keepOpen}
        .disabled=${knobs.disabled}>
    </md-menu-item>
  `);
}

function renderLinkableItems(names: string[], knobs: StoryKnobs) {
  return names.map(name => html`
    <md-menu-item-link
        headline=${name}
        .disabled=${knobs.disabled}
        .target=${knobs.target}
        .href=${knobs.href}>
      <md-icon data-variant="icon" slot="end">
        ${knobs['link icon']}
      </md-icon>
    </md-menu-item-link>
  `);
}

function renderSubMenuItems(
    names: string[], knobs: StoryKnobs,
    content?: TemplateResult|TemplateResult[]) {
  return names.map(name => html`
    <md-sub-menu-item
        headline=${name}
        .disabled=${knobs.disabled}
        .anchorCorner=${knobs['submenu.anchorCorner']!}
        .menuCorner=${knobs['submenu.menuCorner']!}
        .hoverOpenDelay=${knobs.hoverOpenDelay}
        .hoverCloseDelay=${knobs.hoverCloseDelay}>
      ${content ? renderSubMenu(knobs, content) : nothing}
      <md-icon data-variant="icon" slot="end">
        ${knobs['submenu icon']}
      </md-icon>
    </md-sub-menu-item>
  `);
}

function renderSubMenu(
    knobs: StoryKnobs, content: TemplateResult|TemplateResult[]) {
  return html`
    <md-menu
        slot="submenu"
        .quick=${knobs.quick}
        .ariaLabel=${knobs.ariaLabel}
        .xOffset=${knobs.xOffset}
        .yOffset=${knobs.yOffset}
        .fixed=${knobs.fixed}
        .defaultFocus=${knobs.defaultFocus!}
        .typeaheadDelay=${knobs.typeaheadDelay}>
      ${content}
      ${renderLinkableItems(['Link'], knobs)}
    </md-menu>`;
}

function renderMenu(
    knobs: StoryKnobs, anchorRef: Ref<HTMLElement>, menuRef: Ref<MdMenu>,
    onClose: (e: CloseMenuEvent) => void, hasOverflow: boolean,
    ...content: unknown[]) {
  return html`
    <md-menu
        ${ref(menuRef)}
        ${ref(() => {
    menuRef.value!.anchor = anchorRef.value || null;
  })}
        .quick=${knobs.quick}
        .hasOverflow=${hasOverflow ?? knobs.hasOverflow}
        .ariaLabel=${knobs.ariaLabel}
        .anchorCorner="${knobs.anchorCorner!}"
        .menuCorner="${knobs.menuCorner!}"
        .xOffset=${knobs.xOffset}
        .yOffset=${knobs.yOffset}
        .fixed=${knobs.fixed}
        .defaultFocus=${knobs.defaultFocus!}
        .skipRestoreFocus=${knobs.skipRestoreFocus}
        .typeaheadDelay=${knobs.typeaheadDelay}
        .stayOpenOnOutsideClick=${knobs.stayOpenOnOutsideClick}
        .stayOpenOnFocusout=${knobs.stayOpenOnFocusout}
        @close-menu=${onClose}>
      ${content}
    </md-menu>`;
}

const firstAnchorRef = createRef<HTMLElement>();
const firstMenuRef = createRef<MdMenu>();
const secondAnchorRef = createRef<HTMLElement>();
const secondMenuRef = createRef<MdMenu>();
const thirdAnchorRef = createRef<HTMLElement>();
const thirdMenuRef = createRef<MdMenu>();
const fourthAnchorRef = createRef<HTMLElement>();
const firstOutputRef = createRef<HTMLElement>();
const secondOutputRef = createRef<HTMLElement>();
const thirdOutputRef = createRef<HTMLElement>();
const fourthOutputRef = createRef<HTMLElement>();

/** Menu stories. */
export const stories = [standard, linkable, submenu, menuWithoutButton];
