/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/labs/gb/components/button/md-gb-button.js';
import '@material/web/labs/gb/components/list/md-gb-list.js';
import '@material/web/labs/gb/components/list/md-gb-list-item.js';
import '@material/web/labs/gb/components/sheet/md-gb-sheet.js';
import '@material/web/labs/gb/components/switch/md-gb-switch.js';
import '@material/web/labs/gb/styles/icon/md-gb-icon.js';

import {type MaterialStoryInit} from './material-collection.js';
import {
  sheet,
  type SheetPosition,
} from '@material/web/labs/gb/components/sheet/sheet.js';
import {type SheetElement} from '@material/web/labs/gb/components/sheet/sheet-element.js';
import {styles as sheetStyles} from '@material/web/labs/gb/components/sheet/sheet.cssresult.js';
import {adoptStyles} from '@material/web/labs/gb/styles/adopt-styles.js';
import {styles as m3Styles} from '@material/web/labs/gb/styles/m3.cssresult.js';
import {css, html, nothing} from 'lit';
import {live} from 'lit/directives/live.js';

/** Knob types for sheet stories. */
export interface StoryKnobs {
  headline?: string;
  position?: SheetPosition;
  open: boolean;
  modal: boolean;
  detached: boolean;
  hasDragHandle: boolean;
  hasBackButton: boolean;
  hasCloseButton: boolean;
  hasActionButtons: boolean;
  divideActionButtons: boolean;
}

adoptStyles(document, [
  m3Styles,
  css`
    :root {
      --md-icon-font: 'Material Symbols Outlined';
    }
  `,
]);

const styles = css`
  .demo-app-frame {
    display: flex;
    flex-direction: column;
    resize: horizontal;
    overflow: hidden;
    inline-size: 100%;
    max-inline-size: 100%;
    min-inline-size: 360px;
    block-size: 520px;
    border: 2px dashed var(--md-sys-color-outline-variant);
    border-radius: 16px;
    position: relative;
    background-color: var(--md-sys-color-surface);
    box-shadow: var(--md-sys-elevation-shadow-1);
    margin-block-end: 24px;
    container-type: inline-size;
  }

  .demo-app-body {
    display: flex;
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .demo-app-body-bottom {
    flex-direction: column;
    justify-content: flex-end;
  }

  .demo-app-body-floating {
    align-items: center;
    justify-content: center;
  }

  .demo-app-body-floating .demo-app-main {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .demo-app-body md-gb-sheet[modal][open],
  .demo-mini-frame md-gb-sheet[modal][open],
  .demo-mini-frame .sheet.sheet-modal.sheet-open {
    position: absolute;
    z-index: 10;
  }

  .demo-app-main {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .demo-app-main h4 {
    margin: 0;
    font: var(--md-sys-typescale-title-md);
    letter-spacing: var(--md-sys-typescale-title-md-tracking);
    font-variation-settings: var(--md-sys-typescale-title-md-axes);
    color: var(--md-sys-color-on-surface);
  }

  .demo-app-main p,
  .sheet-description {
    margin: 0;
    font: var(--md-sys-typescale-body-md);
    letter-spacing: var(--md-sys-typescale-body-md-tracking);
    font-variation-settings: var(--md-sys-typescale-body-md-axes);
    color: var(--md-sys-color-on-surface-variant);
  }

  .sheet-description {
    margin-block-end: 12px;
  }

  md-gb-list {
    margin-inline: -16px;
  }

  md-gb-list-item::part(list-item) {
    --label-text: var(--md-sys-typescale-body-md);
    --label-text-tracking: var(--md-sys-typescale-body-md-tracking);
    --label-text-axes: var(--md-sys-typescale-body-md-axes);
  }

  .demo-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    margin-block-end: 24px;
  }

  .demo-mini-frame {
    display: flex;
    inline-size: 480px;
    max-inline-size: calc(100vw - 380px);
    block-size: 420px;
    border: 1px solid var(--md-sys-color-outline-variant);
    border-radius: 16px;
    overflow: hidden;
    position: relative;
    background-color: var(--md-sys-color-surface);
    box-shadow: var(--md-sys-elevation-shadow-1);
    container-type: inline-size;
  }
`;

const playground: MaterialStoryInit<StoryKnobs> = {
  name: 'Playground',
  styles,
  render(knobs) {
    const headline = knobs.headline ?? 'Sheet title';
    const position = knobs.position ?? 'side';
    const open = knobs.open ?? true;
    const modal = knobs.modal ?? true;
    const detached = Boolean(knobs.detached);
    const hasDragHandle = Boolean(knobs.hasDragHandle);
    const hasBackButton = Boolean(knobs.hasBackButton);
    const hasCloseButton =
      Boolean(knobs.hasCloseButton ?? true) &&
      !(position === 'bottom' && hasDragHandle);
    const hasActionButtons = knobs.hasActionButtons ?? true;
    const divideActionButtons = Boolean(knobs.divideActionButtons);

    const openSheet = (e: Event) => {
      const container = (e.target as HTMLElement).closest('.demo-app-frame');
      const sheetEl = container?.querySelector(
        'md-gb-sheet',
      ) as SheetElement | null;
      if (sheetEl) {
        sheetEl.open = true;
      }
    };

    const closeSheet = (e: Event) => {
      const sheetEl = (e.target as HTMLElement).closest(
        'md-gb-sheet',
      ) as SheetElement | null;
      if (sheetEl) {
        sheetEl.open = false;
      }
    };

    const bodyPositionClass =
      !modal && position === 'bottom'
        ? 'demo-app-body-bottom'
        : !modal && position === 'floating'
          ? 'demo-app-body-floating'
          : '';

    return html`
      <div class="demo-app-frame">
        <div class="demo-app-body ${bodyPositionClass}">
          <main class="demo-app-main">
            <h4>Interactive sheet playground</h4>
            <p>
              Use the knobs panel on the right to switch
              <code>position</code> (<code>side</code>, <code>bottom</code>,
              <code>floating</code>), toggle <code>modal</code> scrim,
              <code>detached</code> margins, <code>hasDragHandle</code>,
              <code>hasBackButton</code>, <code>hasCloseButton</code>,
              <code>hasActionButtons</code>, and
              <code>divideActionButtons</code> borders.
            </p>
            <p
              class="demo-hint"
              style="font: var(--md-sys-typescale-body-sm); color: var(--md-sys-color-outline); border: 1px dashed var(--md-sys-color-outline-variant); border-radius: 8px; padding: 8px 12px; margin: 0;">
              ↔ Drag the bottom-right corner to resize this container
              horizontally (demonstrating the 640px breakpoint where bottom
              sheets transition to 56px margins).
            </p>
            <div>
              <md-gb-button color="tonal" @click=${openSheet}>
                Open sheet
              </md-gb-button>
            </div>
          </main>

          <md-gb-sheet
            .headline=${live(headline)}
            .position=${live(position)}
            .open=${open}
            .modal=${live(modal)}
            .detached=${live(detached)}
            .hasDragHandle=${live(hasDragHandle)}
            .hasBackButton=${live(hasBackButton)}
            .hasCloseButton=${live(hasCloseButton)}
            .divideActionButtons=${live(divideActionButtons)}>
            <p class="sheet-description">
              Sheet content provides contextual actions, filters, or secondary
              tasks.
            </p>
            <md-gb-list>
              <md-gb-list-item static>
                Notifications
                <md-gb-switch
                  slot="trailing"
                  selected
                  aria-label="Notifications"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Auto-sync changes
                <md-gb-switch
                  slot="trailing"
                  aria-label="Auto-sync"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Dark theme
                <md-gb-switch
                  slot="trailing"
                  aria-label="Dark theme"></md-gb-switch>
              </md-gb-list-item>
            </md-gb-list>
            ${hasActionButtons
              ? html`
                  <md-gb-button
                    slot="actions"
                    color="filled"
                    @click=${closeSheet}>
                    Save
                  </md-gb-button>
                  <md-gb-button
                    slot="actions"
                    color="outlined"
                    @click=${closeSheet}>
                    Cancel
                  </md-gb-button>
                `
              : nothing}
          </md-gb-sheet>
        </div>
      </div>
    `;
  },
};

const sideSheetVariants: MaterialStoryInit<StoryKnobs> = {
  name: 'Side sheet variants',
  styles,
  render() {
    const reopenInFrame = (e: Event) => {
      const frame = (e.target as HTMLElement).closest('.demo-mini-frame');
      const sheetEl = frame?.querySelector(
        'md-gb-sheet',
      ) as SheetElement | null;
      if (sheetEl) sheetEl.open = true;
    };

    const closeInFrame = (e: Event) => {
      const sheetEl = (e.target as HTMLElement).closest(
        'md-gb-sheet',
      ) as SheetElement | null;
      if (sheetEl) sheetEl.open = false;
    };

    return html`
      <div class="demo-grid">
        <!-- Standard Docked Side Sheet -->
        <div class="demo-mini-frame">
          <div class="demo-app-main">
            <h4>Standard docked</h4>
            <p>Co-planar alongside content with 1px divider border.</p>
            <div>
              <md-gb-button color="tonal" @click=${reopenInFrame}>
                Open sheet
              </md-gb-button>
            </div>
          </div>
          <md-gb-sheet
            headline="Filters"
            position="side"
            has-close-button
            divide-action-buttons
            open>
            <p class="sheet-description">Filter items by status and label.</p>
            <md-gb-list>
              <md-gb-list-item static>
                Active only
                <md-gb-switch
                  slot="trailing"
                  selected
                  aria-label="Active only"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Starred
                <md-gb-switch
                  slot="trailing"
                  aria-label="Starred"></md-gb-switch>
              </md-gb-list-item>
            </md-gb-list>
            <md-gb-button slot="actions" color="filled" @click=${closeInFrame}>
              Save
            </md-gb-button>
            <md-gb-button
              slot="actions"
              color="outlined"
              @click=${closeInFrame}>
              Cancel
            </md-gb-button>
          </md-gb-sheet>
        </div>

        <!-- Modal Docked Side Sheet -->
        <div class="demo-mini-frame">
          <div class="demo-app-main">
            <h4>Modal side sheet</h4>
            <p>Modal side sheet with scrim and 16px inner corner radius.</p>
            <div>
              <md-gb-button color="tonal" @click=${reopenInFrame}>
                Open sheet
              </md-gb-button>
            </div>
          </div>
          <md-gb-sheet
            headline="Details"
            position="side"
            modal
            has-close-button
            divide-action-buttons
            open>
            <p class="sheet-description">
              Modal side sheets overlay content with a scrim and 16px inner
              corners.
            </p>
            <md-gb-button slot="actions" color="filled" @click=${closeInFrame}>
              Save
            </md-gb-button>
            <md-gb-button
              slot="actions"
              color="outlined"
              @click=${closeInFrame}>
              Cancel
            </md-gb-button>
          </md-gb-sheet>
        </div>

        <!-- Detached Modal Side Sheet -->
        <div class="demo-mini-frame">
          <div class="demo-app-main">
            <h4>Detached side sheet</h4>
            <p>
              Modal detached side sheet with 16px margins and 16px corner radii
              on all 4 corners.
            </p>
            <div>
              <md-gb-button color="tonal" @click=${reopenInFrame}>
                Open sheet
              </md-gb-button>
            </div>
          </div>
          <md-gb-sheet
            headline="Inspector"
            position="side"
            modal
            detached
            has-close-button
            divide-action-buttons
            open>
            <p class="sheet-description">
              Detached sheets provide clear separation from container edges.
            </p>
            <md-gb-button slot="actions" color="filled" @click=${closeInFrame}>
              Save
            </md-gb-button>
            <md-gb-button
              slot="actions"
              color="outlined"
              @click=${closeInFrame}>
              Cancel
            </md-gb-button>
          </md-gb-sheet>
        </div>

        <!-- Side Sheet with Back Button, Close Button, and Scrollable Content -->
        <div class="demo-mini-frame">
          <div class="demo-app-main">
            <h4>Pinned header & actions</h4>
            <p>
              Side sheet with back button, close button, divider, and long
              scrollable content demonstrating pinned top bar and bottom
              actions.
            </p>
            <div>
              <md-gb-button color="tonal" @click=${reopenInFrame}>
                Open sheet
              </md-gb-button>
            </div>
          </div>
          <md-gb-sheet
            headline="Settings"
            position="side"
            modal
            has-back-button
            has-close-button
            divide-action-buttons
            open>
            <p class="sheet-description">
              Scroll through the list below to observe that the header and
              action footer remain persistent.
            </p>
            <md-gb-list>
              <md-gb-list-item static>
                Notifications
                <md-gb-switch
                  slot="trailing"
                  selected
                  aria-label="Notifications"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Auto-sync
                <md-gb-switch
                  slot="trailing"
                  aria-label="Auto-sync"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Dark theme
                <md-gb-switch
                  slot="trailing"
                  aria-label="Dark theme"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Sound effects
                <md-gb-switch
                  slot="trailing"
                  selected
                  aria-label="Sound effects"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Haptic feedback
                <md-gb-switch
                  slot="trailing"
                  selected
                  aria-label="Haptic feedback"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Offline access
                <md-gb-switch
                  slot="trailing"
                  aria-label="Offline access"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Diagnostics
                <md-gb-switch
                  slot="trailing"
                  aria-label="Diagnostics"></md-gb-switch>
              </md-gb-list-item>
              <md-gb-list-item static>
                Developer mode
                <md-gb-switch
                  slot="trailing"
                  aria-label="Developer mode"></md-gb-switch>
              </md-gb-list-item>
            </md-gb-list>
            <md-gb-button slot="actions" color="filled" @click=${closeInFrame}>
              Save
            </md-gb-button>
            <md-gb-button
              slot="actions"
              color="outlined"
              @click=${closeInFrame}>
              Cancel
            </md-gb-button>
          </md-gb-sheet>
        </div>
      </div>
    `;
  },
};

const bottomAndFloatingVariants: MaterialStoryInit<StoryKnobs> = {
  name: 'Bottom & floating variants',
  styles,
  render() {
    const reopenInFrame = (e: Event) => {
      const frame = (e.target as HTMLElement).closest('.demo-mini-frame');
      const sheetEl = frame?.querySelector(
        'md-gb-sheet',
      ) as SheetElement | null;
      if (sheetEl) sheetEl.open = true;
    };

    const closeInFrame = (e: Event) => {
      const sheetEl = (e.target as HTMLElement).closest(
        'md-gb-sheet',
      ) as SheetElement | null;
      if (sheetEl) sheetEl.open = false;
    };

    return html`
      <div class="demo-grid">
        <!-- Modal Bottom Sheet with Drag Handle -->
        <div
          class="demo-mini-frame"
          style="flex-direction: column; justify-content: flex-end; block-size: 480px;">
          <div class="demo-app-main">
            <h4>Modal bottom sheet</h4>
            <p>
              Modal bottom sheet with 28px top corners and an interactive drag
              handle. Tapping a list item selects an action and dismisses the
              sheet.
            </p>
            <div>
              <md-gb-button color="tonal" @click=${reopenInFrame}>
                Open sheet
              </md-gb-button>
            </div>
          </div>
          <md-gb-sheet
            position="bottom"
            modal
            has-drag-handle
            aria-label="Collection actions"
            open>
            <md-gb-list>
              <md-gb-list-item @click=${closeInFrame}>
                <md-gb-icon slot="leading">share</md-gb-icon>
                Share
              </md-gb-list-item>
              <md-gb-list-item @click=${closeInFrame}>
                <md-gb-icon slot="leading">link</md-gb-icon>
                Get link
              </md-gb-list-item>
              <md-gb-list-item @click=${closeInFrame}>
                <md-gb-icon slot="leading">edit</md-gb-icon>
                Edit name
              </md-gb-list-item>
              <md-gb-list-item @click=${closeInFrame}>
                <md-gb-icon slot="leading">delete</md-gb-icon>
                Delete collection
              </md-gb-list-item>
            </md-gb-list>
          </md-gb-sheet>
        </div>

        <!-- Standard Bottom Sheet with Drag Handle -->
        <div
          class="demo-mini-frame"
          style="flex-direction: column; justify-content: flex-end; block-size: 480px;">
          <div class="demo-app-main">
            <h4>Standard bottom sheet</h4>
            <p>
              Standard non-modal bottom sheet with 28px top corners, interactive
              drag handle, and elevation-3 surface prominence. Tapping a list
              item dismisses the sheet.
            </p>
            <div>
              <md-gb-button color="tonal" @click=${reopenInFrame}>
                Open sheet
              </md-gb-button>
            </div>
          </div>
          <md-gb-sheet
            position="bottom"
            has-drag-handle
            aria-label="Playback options"
            open>
            <md-gb-list>
              <md-gb-list-item @click=${closeInFrame}>
                <md-gb-icon slot="leading">queue_music</md-gb-icon>
                Add to queue
              </md-gb-list-item>
              <md-gb-list-item @click=${closeInFrame}>
                <md-gb-icon slot="leading">playlist_add</md-gb-icon>
                Save to playlist
              </md-gb-list-item>
              <md-gb-list-item @click=${closeInFrame}>
                <md-gb-icon slot="leading">album</md-gb-icon>
                View album
              </md-gb-list-item>
              <md-gb-list-item @click=${closeInFrame}>
                <md-gb-icon slot="leading">info</md-gb-icon>
                Track credits
              </md-gb-list-item>
            </md-gb-list>
          </md-gb-sheet>
        </div>

        <!-- Floating Sheet -->
        <div
          class="demo-mini-frame"
          style="align-items: center; justify-content: center;">
          <div
            class="demo-app-main"
            style="position: absolute; inset: 0; z-index: 0;">
            <h4>Floating sheet</h4>
            <p>
              Floating card container with 28px corner radius and margin,
              matching the Figma GM3 spec.
            </p>
            <div>
              <md-gb-button color="tonal" @click=${reopenInFrame}>
                Open sheet
              </md-gb-button>
            </div>
          </div>
          <md-gb-sheet
            headline="Quick actions"
            position="floating"
            modal
            has-close-button
            open>
            <p class="sheet-description">
              Floating sheets present secondary tasks with elevated surface
              prominence.
            </p>
            <md-gb-button slot="actions" color="filled" @click=${closeInFrame}>
              Continue
            </md-gb-button>
            <md-gb-button
              slot="actions"
              color="outlined"
              @click=${closeInFrame}>
              Dismiss
            </md-gb-button>
          </md-gb-sheet>
        </div>
      </div>
    `;
  },
};

const baselineDirective: MaterialStoryInit<StoryKnobs> = {
  name: 'Baseline directive & light DOM',
  styles: [styles, sheetStyles],
  render() {
    const closeLightDomSheet = (e: Event) => {
      const frame = (e.target as HTMLElement).closest('.demo-mini-frame');
      const sheetEl = frame?.querySelector('.sheet');
      if (sheetEl) {
        sheetEl.classList.remove('sheet-open');
      }
    };

    const openLightDomSheet = (e: Event) => {
      const frame = (e.target as HTMLElement).closest('.demo-mini-frame');
      const el = frame?.querySelector('.sheet');
      if (el) el.classList.add('sheet-open');
    };

    return html`
      <div class="demo-grid">
        <!-- Standard Directive Sheet -->
        <div class="demo-mini-frame">
          <div class="demo-app-main">
            <h4>Directive (.sheet)</h4>
            <p>
              Styled using the <code>sheet()</code> Lit directive and
              <code>.sheet</code> CSS utility classes.
            </p>
            <div>
              <md-gb-button color="tonal" @click=${openLightDomSheet}>
                Open sheet
              </md-gb-button>
            </div>
          </div>
          <aside
            class="${sheet({
              position: 'side',
              open: true,
              divideActionButtons: true,
            })}"
            aria-label="Sheet title">
            <header class="sheet-header">
              <h2 class="sheet-headline">Sheet title</h2>
              <button
                class="sheet-close"
                type="button"
                aria-label="Close"
                @click=${closeLightDomSheet}>
                <md-gb-icon>close</md-gb-icon>
              </button>
            </header>
            <div class="sheet-content">
              <p class="sheet-description">
                Baseline DOM styling without Shadow DOM encapsulation.
              </p>
              <md-gb-list>
                <md-gb-list-item static>
                  Archive
                  <md-gb-switch
                    slot="trailing"
                    selected
                    aria-label="Archive"></md-gb-switch>
                </md-gb-list-item>
              </md-gb-list>
            </div>
            <footer class="sheet-actions">
              <md-gb-button color="filled" @click=${closeLightDomSheet}>
                Save
              </md-gb-button>
              <md-gb-button color="outlined" @click=${closeLightDomSheet}>
                Cancel
              </md-gb-button>
            </footer>
          </aside>
        </div>

        <!-- Detached Modal Side Sheet via directive -->
        <div class="demo-mini-frame">
          <div class="demo-app-main">
            <h4>Directive (.sheet-detached)</h4>
            <p>
              Detached modal side sheet configured via
              <code
                >sheet({position: 'side', modal: true, detached: true, open:
                true})</code
              >.
            </p>
            <div>
              <md-gb-button color="tonal" @click=${openLightDomSheet}>
                Open sheet
              </md-gb-button>
            </div>
          </div>
          <div class="sheet-scrim" @click=${closeLightDomSheet}></div>
          <aside
            class="${sheet({
              position: 'side',
              modal: true,
              detached: true,
              open: true,
            })}"
            aria-label="Inspector">
            <header class="sheet-header">
              <h2 class="sheet-headline">Inspector</h2>
              <button
                class="sheet-close"
                type="button"
                aria-label="Close"
                @click=${closeLightDomSheet}>
                <md-gb-icon>close</md-gb-icon>
              </button>
            </header>
            <div class="sheet-content">
              <p class="sheet-description">
                Detached side sheets float alongside page content with 16px
                margins and corner radius.
              </p>
            </div>
          </aside>
        </div>
      </div>
    `;
  },
};

/** Sheet stories. */
export const stories = [
  playground,
  sideSheetVariants,
  bottomAndFloatingVariants,
  baselineDirective,
];
