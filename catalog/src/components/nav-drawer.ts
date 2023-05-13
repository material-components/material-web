import { LitElement, css, html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { SignalElement } from '../signals/signal-element.js';
import { drawerOpenSignal } from '../signals/drawer-open-state.js';
import { inertContentSignal, inertSidebarSignal } from '../signals/inert.js';
import { animate, fadeIn, fadeOut } from '@lit-labs/motion';
import { EASING } from '@material/web/motion/animation.js';

@customElement('nav-drawer')
export class NavDrawer extends SignalElement(LitElement) {
  static styles = css`
    :host {
      --_drawer-width: var(--drawer-width, 300px);
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
      padding-inline: var(--_content-padding);
      max-width: calc(
        100vw - var(--_drawer-width) - 2 * var(--_content-padding)
      );
    }

    aside {
      transition: transform 0.5s cubic-bezier(0.3, 0, 0, 1);
      position: fixed;
      isolation: isolate;
      inset: calc(
          var(--top-app-bar-height) + 2 * var(--top-app-bar-padding-block)
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

    @media (max-width: 900px) {
      .spacer {
        min-width: 0px;
      }

      .content {
        max-width: calc(100vw - 2 * var(--_content-padding));
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
        --top-app-bar-color-background: var(
          --md-sys-color-surface-variant
        );
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

  @state() private isMobile = false;

  render() {
    const showModal = this.isMobile && drawerOpenSignal.value;
    const durationIn = 500;
    const contentOpacityDurationIn = 300;
    const durationOut = 150;
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
                      duration: 150,
                      easing: 'linear',
                    },
                    in: fadeIn,
                    out: fadeOut,
                  })}
                ></div>`
              : nothing}
            <aside
              ?inert=${this.isMobile && !drawerOpenSignal.value}
              ${animate({
                properties: ['transform'],
                keyframeOptions: {
                  duration: showModal ? durationIn : durationOut,
                  easing: showModal
                    ? EASING.EMPHASIZED
                    : EASING.EMPHASIZED_ACCELERATE,
                },
              })}
            >
              <slot
                ${animate({
                  properties: ['opacity'],
                  keyframeOptions: {
                    duration: showModal
                      ? contentOpacityDurationIn
                      : durationOut,
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

  private onScrimClick() {
    drawerOpenSignal.value = false;
  }

  firstUpdated() {
    const mql = window.matchMedia('(max-width: 900px)');
    this.isMobile = mql.matches;
    mql.addEventListener('change', (e) => {
      this.isMobile = e.matches;
    });
  }
}
