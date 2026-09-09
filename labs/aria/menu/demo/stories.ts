/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/aria/menu/md-aria-menuitem.js';
import '@material/web/labs/aria/menu/md-aria-menulist.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

export interface StoryKnobs {}

const menu: MaterialStoryInit<StoryKnobs> = {
  name: 'Menu',
  styles: css``,
  render(knobs) {
    return html`
      <button popovertarget="the-menu">Menu</button>
      <md-aria-menulist id="the-menu">
        <md-aria-menuitem autofocus>Item 1</md-aria-menuitem>
        <md-aria-menuitem>Item 2</md-aria-menuitem>
        <hr />
        <md-aria-menuitem disabled>Item 3</md-aria-menuitem>
        <md-aria-menuitem>Item 4</md-aria-menuitem>
      </md-aria-menulist>
    `;
  },
};

const menuWithDialog: MaterialStoryInit<StoryKnobs> = {
  name: 'Menu with dialog',
  styles: css``,
  render(knobs) {
    return html`
      <button popovertarget="the-menu">Menu</button>
      <md-aria-menulist id="the-menu">
        <md-aria-menuitem
          commandfor="the-dialog"
          command="show-modal"
          autofocus>
          Open dialog...
        </md-aria-menuitem>
      </md-aria-menulist>
      <dialog id="the-dialog">
        <button popovertarget="the-dialog-menu" autofocus>Menu</button>
        <md-aria-menulist id="the-dialog-menu">
          <md-aria-menuitem commandfor="the-dialog" command="close" autofocus>
            Close
          </md-aria-menuitem>
          <md-aria-menuitem commandfor="the-dialog" command="request-close">
            Request close
          </md-aria-menuitem>
        </md-aria-menulist>
        <hr />
        This is a dialog.
      </dialog>
    `;
  },
};

const menuWithPopover: MaterialStoryInit<StoryKnobs> = {
  name: 'Menu with popover',
  styles: css``,
  render(knobs) {
    return html`
      <button popovertarget="the-menu">Menu</button>
      <md-aria-menulist id="the-menu">
        <md-aria-menuitem
          popovertarget="the-popover"
          popovertargetaction="show"
          autofocus>
          Open popover...
        </md-aria-menuitem>
      </md-aria-menulist>
      <div id="the-popover" popover="manual">
        <button popovertarget="the-popover-menu" autofocus>Menu</button>
        <md-aria-menulist id="the-popover-menu">
          <md-aria-menuitem
            popovertarget="the-popover"
            popovertargetaction="hide"
            autofocus>
            Hide
          </md-aria-menuitem>
        </md-aria-menulist>
        <hr />
        This is a popover.
      </div>
    `;
  },
};

export const stories = [menu, menuWithDialog, menuWithPopover];
