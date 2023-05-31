/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {animate, fadeIn, fadeOut} from '@lit-labs/motion';
import {EASING} from '@material/web/internal/motion/animation.js';
import {css, html, LitElement, nothing} from 'lit';
import {customElement, state} from 'lit/decorators.js';

import {drawerOpenSignal} from '../signals/drawer-open-state.js';
import {inertContentSignal, inertSidebarSignal} from '../signals/inert.js';
import {SignalElement} from '../signals/signal-element.js';

/**
 * A layout element that positions the top-app-bar, the main page content, and
 * the side navigation drawer.
 *
 * The drawer will automatically set itself as collapsible at narrower page
 * widths, and position itself inline with the page at wider page widths. Most
 * importantly, this sidebar is SSR compatible.
 */
@customElement('nav-drawer') export class NavDrawer extends SignalElement
(LitElement) {
  /**
   * Whether or not the side drawer is collapsible or inline.
   */
  @state() private isCollapsible = false;

  render() {
    const showModal = this.isCollapsible && drawerOpenSignal.value;

    // Values taken from internal material motion spec
    const drawerSlideAnimationDuration = showModal ? 500 : 150;
    const drawerContentOpacityDuration = showModal ? 300 : 150;
    const scrimOpacityDuration = 150;

    const drawerSlideAnimationEasing =
        showModal ? EASING.EMPHASIZED : EASING.EMPHASIZED_ACCELERATE;

    return html`
      <div class="root">
        <slot name="top-app-bar"></slot>
        <div class="body  ${drawerOpenSignal.value ? 'open' : ''}">
          <div class="spacer" ?inert=${inertSidebarSignal.value}>
            ${showModal
              ? html`<div
                  class="scrim"
                  @click=${this.onScrimClick}
                  ${animate({
                    properties: ['opacity'],
                    keyframeOptions: {
                      duration: scrimOpacityDuration,
                      easing: 'linear',
                    },
                    in: fadeIn,
                    out: fadeOut,
                  })}
                ></div>`
              : nothing}
            <aside
              ?inert=${this.isCollapsible && !drawerOpenSignal.value}
              ${animate({
                properties: ['transform'],
                keyframeOptions: {
                  duration: drawerSlideAnimationDuration,
                  easing: drawerSlideAnimationEasing,
                },
              })}
            >
              <slot
                ${animate({
                  properties: ['opacity'],
                  keyframeOptions: {
                    duration: drawerContentOpacityDuration,
                    easing: 'linear',
                  },
                })}
              ></slot>
            </aside>
          </div>
          <div class="content" ?inert=${showModal || inertContentSignal.value}>
            <slot name="app-content"></slot>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Closes the drawer on scrim click.
   */
  private onScrimClick() {
    drawerOpenSignal.value = false;
  }

  firstUpdated() {
    const queryResult = window.matchMedia('(max-width: 1500px)');
    this.isCollapsible = queryResult.matches;

    // Listen for page resizes to mark the drawer as collapsible.
    queryResult.addEventListener('change', (e) => {
      this.isCollapsible = e.matches;
    });
  }

  static styles = css`
    :host {
      --_max-width: 1760px;
      --_drawer-width: var(--catalog-drawer-width, 300px);
      --_item-border-radius: var(--md-dialog-container-shape, 28px);
      --_border-radius: calc(var(--_item-border-radius) + 12px);
      --_content-padding: 24px;
      min-height: 100dvh;
      display: flex;
      flex-direction: column;
    }

    ::slotted(*) {
      --md-list-item-list-item-container-shape: var(--_item-border-radius);
      --md-focus-ring-shape: var(--_item-border-radius);
    }

    .body {
      display: flex;
      flex-grow: 1;
    }

    .spacer {
      position: relative;
      transition: min-width 0.5s cubic-bezier(0.3, 0, 0, 1);
    }

    .spacer,
    aside {
      min-width: var(--_drawer-width);
      max-width: var(--_drawer-width);
    }

    .content {
      flex-grow: 1;
      display: flex;
      justify-content: center;
      box-sizing: border-box;
      padding-inline: var(--_content-padding);
      max-width: calc(100vw - var(--_drawer-width));
    }

    .content slot {
      display: block;
      width: 100%;
      max-width: min(100%, var(--_max-width));
    }

    aside {
      transition: transform 0.5s cubic-bezier(0.3, 0, 0, 1);
      position: fixed;
      isolation: isolate;
      inset: calc(
          var(--catalog-top-app-bar-height) + 2 * var(--catalog-top-app-bar-padding-block)
        )
        0 0 0;
      z-index: 12;
      border-radius: 0 var(--_border-radius) var(--_border-radius) 0;
      background-color: var(--md-sys-color-surface);
    }

    aside slot {
      display: block;
    }

    .scrim {
      background-color: var(--md-dialog-scrim-color, rgba(0, 0, 0, 0.32));
    }

    @media (max-width: 600px) {
      :host {
        --_content-padding: 8px;
      }
    }

    @media (max-width: 1500px) {
      .spacer {
        min-width: 0px;
      }

      .content {
        max-width: 100vw;
        padding-inline: var(--_content-padding);
      }

      .scrim {
        position: fixed;
        inset: 0;
      }

      aside {
        transition: unset;
        transform: translateX(-100%);
      }

      .open aside {
        transform: translateX(0);
      }

      aside slot {
        opacity: 0;
      }

      .open aside slot {
        opacity: 1;
      }

      .open .scrim {
        inset: 0;
        z-index: 11;
      }

      .root:has(.open) {
        --top-app-bar-color-background: var(--md-sys-color-surface-variant);
        --top-app-bar-color-on-background: var(
          --md-sys-color-on-surface-variant
        );
      }
    }

    @media (forced-colors: active) {
      aside {
        box-sizing: border-box;
        border: 1px solid CanvasText;
      }
    }
  `;
}
