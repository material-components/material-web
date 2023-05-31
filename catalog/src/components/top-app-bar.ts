/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/focus/focus-ring.js';
import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/icon/icon.js';
import '@material/web/focus/focus-ring.js';

import type {MdStandardIconButton} from '@material/web/iconbutton/standard-icon-button.js';
import {css, html, LitElement} from 'lit';
import {customElement, query, state} from 'lit/decorators.js';
import {live} from 'lit/directives/live.js';

import {drawerOpenSignal} from '../signals/drawer-open-state.js';
import {inertContentSignal, inertSidebarSignal} from '../signals/inert.js';
import {SignalElement} from '../signals/signal-element.js';
import {materialDesign} from '../svg/material-design-logo.js';

/**
 * Top app bar of the catalog. It changes elevation and "floats" when the
 * "is-sticky" class is set on it. (this is currently done in
 * pages/global.ts)
 */
@customElement('top-app-bar') export class TopAppBar extends SignalElement
(LitElement) {
  /**
   * Whether or not the color picker menu is open.
   */
  @state() private menuOpen = false;

  @query('.end md-standard-icon-button')
  private paletteButton!: MdStandardIconButton;

  render() {
    return html`
      <header>
        <div class="default-content">
          <section class="start">
            <md-standard-icon-button
              toggle
              class="menu-button"
              .selected=${live(drawerOpenSignal.value)}
              @input=${this.onMenuIconToggle}
            >
              <span><md-icon>menu</md-icon></span>
              <span slot="selectedIcon"><md-icon>menu_open</md-icon></span>
            </md-standard-icon-button>
            <md-standard-icon-button href="/material-web/" class="home-button">
              ${materialDesign}
            </md-standard-icon-button>
          </section>

          <a href="/material-web/" id="home-link">
            Material Web
            <md-focus-ring for="home-link"></md-focus-ring>
          </a>

          <section class="end">
            <lit-island
              on:interaction="pointerenter,focusin,pointerdown"
              import="/material-web/js/hydration-entrypoints/menu.js"
              id="menu-island"
            >
              <md-menu
                .anchor=${this.paletteButton}
                menu-corner="START_END"
                anchor-corner="END_END"
                stay-open-on-focusout
                .open=${this.menuOpen}
                @closed=${this.onMenuClosed}
              >
                <theme-changer></theme-changer>
              </md-menu>
              <md-standard-icon-button @click="${this.onPaletteClick}">
                <md-icon>palette</md-icon>
              </md-standard-icon-button>
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

  /**
   * Toggles the sidebar's open state.
   */
  private onMenuIconToggle(e: InputEvent) {
    drawerOpenSignal.value = (e.target as MdStandardIconButton).selected;
  }

  static styles = css`
    :host,
    header {
      display: block;
      height: var(--catalog-top-app-bar-height);
      padding: var(--catalog-top-app-bar-padding-block) 8px;
    }

    header {
      position: fixed;
      inset: 0 0 auto 0;
      padding-block-start: var(--catalog-top-app-bar-padding-block);
      background-color: var(
        --top-app-bar-color-background,
        var(--md-sys-color-background)
      );
      color: var(
        --top-app-bar-color-on-background,
        var(--md-sys-color-on-background)
      );
      transition: background 0.3s linear;
      z-index: 12;
    }

    .default-content {
      display: flex;
      align-items: center;
    }

    :host(.is-sticky) header {
      background-color: var(
        --top-app-bar-color-background,
        var(--md-sys-color-surface-container-highest)
      );
      color: var(
        --top-app-bar-color-on-background,
        var(--md-sys-color-on-surface-container)
      );
    }

    md-standard-icon-button:not(:defined) {
      width: 40px;
      height: 40px;
      display: flex;
      visibility: hidden;
    }

    md-standard-icon-button * {
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

    @media (max-width: 1500px) {
      .start .home-button {
        display: none;
      }

      .start .menu-button {
        display: flex;
      }
    }

    @media (forced-colors: active) {
      header {
        border-block-end: 1px solid CanvasText;
      }
    }
  `;
}

declare global {
  interface HTMLElementTagNameMap {
    'top-app-bar': TopAppBar;
  }
}
