/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/focus/md-focus-ring.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';

import type {MdIconButton} from '@material/web/iconbutton/icon-button.js';
import {css, html, LitElement} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {live} from 'lit/directives/live.js';

import {drawerOpenSignal} from '../signals/drawer-open-state.js';
import {inertContentSignal, inertSidebarSignal} from '../signals/inert.js';
import {SignalElement} from '../signals/signal-element.js';
import {materialDesign} from '../svg/material-design-logo.js';

/**
 * Top app bar of the catalog.
 */
@customElement('top-app-bar')
export class TopAppBar extends SignalElement(LitElement) {
  /**
   * Whether or not the color picker menu is open.
   */
  @state() private menuOpen = false;
  @query('theme-changer') private themeChanger!: HTMLElement;

  render() {
    return html`
      <header>
        <div class="default-content">
          <section class="start">
            <md-icon-button
              toggle
              class="menu-button"
              aria-label-selected="open navigation menu"
              aria-label="close navigation menu"
              aria-expanded=${drawerOpenSignal.value ? 'false' : 'true'}
              title="${!drawerOpenSignal.value
                ? 'Open'
                : 'Close'} navigation menu"
              .selected=${live(!drawerOpenSignal.value)}
              @input=${this.onMenuIconToggle}>
              <md-icon slot="selected">menu</md-icon>
              <md-icon>menu_open</md-icon>
            </md-icon-button>
            <md-icon-button
              href="/"
              class="home-button"
              title="Home"
              aria-label="Home">
              ${materialDesign}
            </md-icon-button>
          </section>

          <a href="/" id="home-link">
            Material Web
            <md-focus-ring for="home-link"></md-focus-ring>
          </a>

          <a id="skip-to-main" href="#main-content" tabindex="0">
            Skip to main content
          </a>

          <section class="end">
            <lit-island
              on:interaction="pointerenter,focusin,pointerdown"
              import="/js/hydration-entrypoints/menu.js"
              id="menu-island">
              <md-icon-button
                title="GitHub repository"
                aria-label="GitHub repository"
                href="https://github.com/material-components/material-web"
                target="_blank">
                <md-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 98 96">
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
                  </svg>
                </md-icon>
              </md-icon-button>
              <md-icon-button
                id="theme-button"
                @click="${this.onPaletteClick}"
                title="Page theme controls"
                aria-label="Page theme controls"
                aria-haspopup="dialog"
                aria-expanded=${this.menuOpen ? 'true' : 'false'}>
                <md-icon>palette</md-icon>
              </md-icon-button>
              <md-menu
                anchor="theme-button"
                menu-corner="start-end"
                anchor-corner="end-end"
                default-focus="none"
                role="dialog"
                aria-label="Page color theme controls"
                .open=${this.menuOpen}
                @opened=${this.onMenuOpened}
                @closed=${this.onMenuClosed}
                @keydown=${this.onKeydown}>
                <theme-changer></theme-changer>
              </md-menu>
            </lit-island>
          </section>
        </div>
        <slot></slot>
      </header>
    `;
  }

  /**
   * Opens the theme changer menu and inerts the rest of the page.
   */
  private onPaletteClick() {
    this.menuOpen = true;
    inertContentSignal.value = true;
    inertSidebarSignal.value = true;
    drawerOpenSignal.value = false;
  }

  /**
   * Syncs current menu state with actual menu state and makes the rest of the
   * page interactive again.
   */
  private onMenuClosed() {
    this.menuOpen = false;
    inertContentSignal.value = false;
    inertSidebarSignal.value = false;
  }

  private onMenuOpened() {
    this.themeChanger.focus();
  }

  private onKeydown(e: KeyboardEvent) {
    if (!e.defaultPrevented && e.key === 'Escape') {
      e.preventDefault();
      this.menuOpen = false;
    }
  }

  /**
   * Toggles the sidebar's open state.
   */
  private onMenuIconToggle(e: InputEvent) {
    drawerOpenSignal.value = !(e.target as MdIconButton).selected;
  }

  static styles = css`
    :host,
    header {
      display: block;
      height: var(--catalog-top-app-bar-height);
    }

    header {
      position: fixed;
      inset: 0 0 auto 0;
      display: flex;
      align-items: center;
      box-sizing: border-box;
      padding: var(--catalog-spacing-m) var(--catalog-spacing-l);
      background-color: var(--md-sys-color-surface-container);
      color: var(--md-sys-color-on-surface);
      z-index: 12;
    }

    .default-content {
      width: 100%;
      display: flex;
      align-items: center;
    }

    md-icon-button:not(:defined) {
      width: 40px;
      height: 40px;
      display: flex;
      visibility: hidden;
    }

    md-icon-button * {
      display: block;
    }

    a {
      color: var(--md-sys-color-primary);
      font-size: max(var(--catalog-title-l-font-size), 22px);
      text-decoration: none;
      padding-inline: 12px;
      position: relative;
      outline: none;
      vertical-align: middle;
    }

    .start .menu-button {
      display: none;
    }

    .start .home-button * {
      color: var(--md-sys-color-primary);
    }

    .end {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
    }

    #menu-island {
      position: relative;
    }

    #skip-to-main {
      padding: var(--catalog-spacing-s);
      border-radius: var(--catalog-shape-m);
      background-color: var(--md-sys-color-inverse-surface);
      color: var(--md-sys-color-inverse-on-surface);
      opacity: 0;
      position: absolute;
      pointer-events: none;
    }

    #skip-to-main:focus-visible {
      opacity: 1;
      pointer-events: auto;
    }

    @media (max-width: 1500px) {
      .start .home-button {
        display: none;
      }

      .start .menu-button {
        display: flex;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'top-app-bar': TopAppBar;
  }
}
