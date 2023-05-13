import { LitElement, css, html, isServer } from 'lit';
import { live } from 'lit/directives/live.js';
import { customElement, property, query, state } from 'lit/decorators.js';
import '@material/web/focus/focus-ring.js';
import { SignalElement } from '../signals/signal-element.js';
import { drawerOpenSignal } from '../signals/drawer-open-state.js';
import type { MdStandardIconButton } from '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/icon/icon.js';
import '@material/web/focus/focus-ring.js';
import { materialDesign } from '../svg/material-design-logo.js';
import { inertContentSignal, inertSidebarSignal } from '../signals/inert.js';

@customElement('top-app-bar')
export class TopAppBar extends SignalElement(LitElement) {
  static styles = css`
    :host,
    header {
      display: block;
      height: var(--top-app-bar-height);
      padding: var(--top-app-bar-padding-block) 8px;
    }

    header {
      position: fixed;
      inset: 0 0 auto 0;
      padding-block-start: var(--top-app-bar-padding-block);
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
      font-size: var(--md-sys-typescale-title-large-size, 22px);
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

    @media (max-width: 900px) {
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

  @state() private showFocusRing = false;
  @state() private menuOpen = false;
  @property() baseURI = '';
  @query('.end md-standard-icon-button')
  private palleteButton!: MdStandardIconButton;

  render() {
    return html`
      <header>
        <section class="start">
          <md-standard-icon-button
            toggle
            class="menu-button"
            .selected=${live(drawerOpenSignal.value)}
            @click=${this.onClick}
            @input=${(e: InputEvent) => {
              drawerOpenSignal.value = (
                e.target as MdStandardIconButton
              ).selected;
            }}
          >
            <span><md-icon>menu</md-icon></span>
            <span slot="selectedIcon"><md-icon>menu_open</md-icon></span>
          </md-standard-icon-button>
          <md-standard-icon-button href="/material-web/" class="home-button">
            ${materialDesign()}
          </md-standard-icon-button>
        </section>
        <a href="/material-web/" @blur=${this.onBlur}>
          Material Web
          <md-focus-ring .visible=${this.showFocusRing}></md-focus-ring>
        </a>

        <section class="end">
          <lit-island
            on:interaction="pointerenter,focusin,pointerdown"
            import="/material-web/js/hydration-entrypoints/menu.js"
            id="menu-island"
          >
            <md-menu
              .anchor=${this.palleteButton}
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
      </header>
    `;
  }

  private onClick() {
    drawerOpenSignal.subscribe;
  }

  private async onBlur() {
    this.showFocusRing = false;
  }

  private onPaletteClick() {
    this.menuOpen = true;
    inertContentSignal.value = true;
    inertSidebarSignal.value = true;
    drawerOpenSignal.value = false;
  }

  private onMenuClosed() {
    this.menuOpen = false;
    inertContentSignal.value = false;
    inertSidebarSignal.value = false;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'top-app-bar': TopAppBar;
  }
}
