/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {Harness} from '../../../../testing/harness.js';
import {adoptStyles} from '../../styles/adopt-styles.js';
import {styles as m3Styles} from '../../styles/m3.cssresult.js';
import './md-gb-sheet.js';
import {
  setupSheet,
  sheet,
  SHEET_CLASSES,
  sheetClasses,
  type SheetCloseReason,
} from './sheet.js';
import {SheetElement} from './sheet-element.js';
import {styles as sheetStyles} from './sheet.cssresult.js';

// Adopt shared stylesheets globally for computed-style assertions in Light DOM.
adoptStyles(document, [m3Styles, sheetStyles]);

function parsePixels(value: string): number {
  return Number(value.replace('px', ''));
}

class TestCustomFocusable extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    const btn = document.createElement('button');
    btn.id = 'shadow-inner-btn';
    btn.textContent = 'Shadow Button';
    shadow.appendChild(btn);
  }
}
customElements.define('test-custom-focusable', TestCustomFocusable);

declare global {
  interface HTMLElementTagNameMap {
    'test-custom-focusable': TestCustomFocusable;
  }
}

class SheetHarness extends Harness<SheetElement> {
  override async getInteractiveElement(): Promise<HTMLElement> {
    return this.element;
  }

  async pressEscape() {
    this.element.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        composed: true,
      }),
    );
  }
}

describe('md-gb-sheet', () => {
  const env = new Environment();

  // UT-1: Classes & Directive
  describe('UT-1: sheetClasses() and sheet() directive', () => {
    it('generates expected default class map', () => {
      const classes = sheetClasses();
      expect(classes[SHEET_CLASSES.sheet]).toBeTrue();
      expect(classes[SHEET_CLASSES.sheetSide]).toBeTrue();
      expect(classes[SHEET_CLASSES.sheetBottom]).toBeFalse();
      expect(classes[SHEET_CLASSES.sheetFloating]).toBeFalse();
      expect(classes[SHEET_CLASSES.sheetModal]).toBeFalse();
      expect(classes[SHEET_CLASSES.sheetDetached]).toBeFalse();
      expect(classes[SHEET_CLASSES.sheetWithDragHandle]).toBeFalse();
      expect(classes[SHEET_CLASSES.sheetExpanded]).toBeFalse();
      expect(classes[SHEET_CLASSES.sheetOpen]).toBeFalse();
      expect(classes[SHEET_CLASSES.sheetDivideActionButtons]).toBeFalse();

      const divided = sheetClasses({divideActionButtons: true});
      expect(divided[SHEET_CLASSES.sheetDivideActionButtons]).toBeTrue();
    });

    it('generates expected class map for bottom and floating positions', () => {
      const bottomClasses = sheetClasses({
        position: 'bottom',
        hasDragHandle: true,
        expanded: true,
        open: true,
      });
      expect(bottomClasses[SHEET_CLASSES.sheetBottom]).toBeTrue();
      expect(bottomClasses[SHEET_CLASSES.sheetWithDragHandle]).toBeTrue();
      expect(bottomClasses[SHEET_CLASSES.sheetExpanded]).toBeTrue();
      expect(bottomClasses[SHEET_CLASSES.sheetSide]).toBeFalse();
      expect(bottomClasses[SHEET_CLASSES.sheetOpen]).toBeTrue();

      const floatingClasses = sheetClasses({position: 'floating', open: true});
      expect(floatingClasses[SHEET_CLASSES.sheetFloating]).toBeTrue();
      expect(floatingClasses[SHEET_CLASSES.sheetSide]).toBeFalse();
      expect(floatingClasses[SHEET_CLASSES.sheetOpen]).toBeTrue();
    });

    it('applies classes via sheet() directive in Lit template', async () => {
      const container = document.createElement('div');
      render(
        html`<div
          class="${sheet({
            position: 'bottom',
            modal: true,
            hasDragHandle: true,
            open: true,
          })}"></div>`,
        container,
      );
      const el = container.firstElementChild as HTMLElement;
      expect(el.classList.contains('sheet')).toBeTrue();
      expect(el.classList.contains('sheet-bottom')).toBeTrue();
      expect(el.classList.contains('sheet-with-drag-handle')).toBeTrue();
      expect(el.classList.contains('sheet-modal')).toBeTrue();
      expect(el.classList.contains('sheet-open')).toBeTrue();
    });
  });

  // UT-2: Presentation Modifier Guards
  describe('UT-2: Presentation modifier guards (DF-5)', () => {
    it('ignores detached when position is bottom or floating', () => {
      const bottom = sheetClasses({
        position: 'bottom',
        detached: true,
      });
      expect(bottom[SHEET_CLASSES.sheetDetached]).toBeFalse();

      const floating = sheetClasses({
        position: 'floating',
        detached: true,
      });
      expect(floating[SHEET_CLASSES.sheetDetached]).toBeFalse();
    });

    it('ignores hasDragHandle and expanded when position is side or floating', () => {
      const side = sheetClasses({
        position: 'side',
        hasDragHandle: true,
        expanded: true,
      });
      expect(side[SHEET_CLASSES.sheetWithDragHandle]).toBeFalse();
      expect(side[SHEET_CLASSES.sheetExpanded]).toBeFalse();

      const floating = sheetClasses({
        position: 'floating',
        hasDragHandle: true,
        expanded: true,
      });
      expect(floating[SHEET_CLASSES.sheetWithDragHandle]).toBeFalse();
      expect(floating[SHEET_CLASSES.sheetExpanded]).toBeFalse();
    });

    it('does not render drag handle on side or floating elements even if has-drag-handle is set', async () => {
      const root = env.render(html`
        <md-gb-sheet
          id="side-sheet"
          position="side"
          has-drag-handle
          open></md-gb-sheet>
        <md-gb-sheet
          id="floating-sheet"
          position="floating"
          has-drag-handle
          open></md-gb-sheet>
      `);
      await env.waitForStability();

      const sideSheet = root.querySelector<SheetElement>('#side-sheet')!;
      const floatingSheet =
        root.querySelector<SheetElement>('#floating-sheet')!;

      expect(
        sideSheet.shadowRoot!.querySelector('.sheet-drag-handle'),
      ).toBeNull();
      expect(
        floatingSheet.shadowRoot!.querySelector('.sheet-drag-handle'),
      ).toBeNull();
    });
  });

  // UT-3: Computed Token Styles
  describe('UT-3: Computed token styles ([TEST-05])', () => {
    it('applies standard docked side sheet styles', async () => {
      const root = env.render(html`
        <md-gb-sheet position="side" open></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const style = getComputedStyle(container);

      expect(style.inlineSize).toBe('256px');
      expect(style.borderTopLeftRadius).toBe('0px');
      expect(style.borderBottomLeftRadius).toBe('0px');
      expect(style.borderTopRightRadius).toBe('0px');
      expect(style.borderBottomRightRadius).toBe('0px');
      expect(style.borderInlineStartWidth).toBe('1px');
    });

    it('applies modal docked side sheet styles with 16px inner corner radii', async () => {
      const root = env.render(html`
        <md-gb-sheet position="side" modal open></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const style = getComputedStyle(container);

      // In LTR (docked at end/right edge):
      // inner corners are start-start (top-left) and end-start (bottom-left) = 16px.
      expect(style.borderTopLeftRadius).toBe('16px');
      expect(style.borderBottomLeftRadius).toBe('16px');
      expect(style.borderTopRightRadius).toBe('0px');
      expect(style.borderBottomRightRadius).toBe('0px');
    });

    it('applies detached side sheet styles with 16px all corner radii and 16px margin', async () => {
      const root = env.render(html`
        <md-gb-sheet position="side" detached open></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const style = getComputedStyle(container);

      expect(style.borderTopLeftRadius).toBe('16px');
      expect(style.borderTopRightRadius).toBe('16px');
      expect(style.borderBottomLeftRadius).toBe('16px');
      expect(style.borderBottomRightRadius).toBe('16px');
      expect(style.marginTop).toBe('16px');
      expect(style.marginBottom).toBe('16px');
    });

    it('applies bottom sheet styles with 28px top corners unconditionally', async () => {
      const root = env.render(html`
        <md-gb-sheet
          id="drag-handle-bottom"
          position="bottom"
          has-drag-handle
          open></md-gb-sheet>
        <md-gb-sheet id="plain-bottom" position="bottom" open></md-gb-sheet>
      `);
      await env.waitForStability();

      const withHandle = root.querySelector<SheetElement>(
        '#drag-handle-bottom',
      )!;
      const withHandleContainer =
        withHandle.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const withHandleStyle = getComputedStyle(withHandleContainer);

      expect(withHandleStyle.borderTopLeftRadius).toBe('28px');
      expect(withHandleStyle.borderTopRightRadius).toBe('28px');
      expect(withHandleStyle.borderBottomLeftRadius).toBe('0px');
      expect(withHandleStyle.borderBottomRightRadius).toBe('0px');
      expect(withHandleStyle.maxInlineSize).toBe('640px');

      const plain = root.querySelector<SheetElement>('#plain-bottom')!;
      const plainContainer =
        plain.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const plainStyle = getComputedStyle(plainContainer);

      expect(plainStyle.borderTopLeftRadius).toBe('28px');
      expect(plainStyle.borderTopRightRadius).toBe('28px');
      expect(plainStyle.borderBottomLeftRadius).toBe('0px');
      expect(plainStyle.borderBottomRightRadius).toBe('0px');
    });

    it('applies padding-inline: 24px and padding-block-end: 24px on .sheet-content consistently for bottom and side sheets', async () => {
      const root = env.render(html`
        <md-gb-sheet id="bottom-sheet" position="bottom" open>
          <p>List item</p>
        </md-gb-sheet>
        <md-gb-sheet id="side-sheet" position="side" open>
          <p>Body item</p>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const bottomEl = root.querySelector<SheetElement>('#bottom-sheet')!;
      const bottomContent =
        bottomEl.shadowRoot!.querySelector<HTMLElement>('.sheet-content')!;
      const bottomStyle = getComputedStyle(bottomContent);
      expect(bottomStyle.paddingLeft).toBe('24px');
      expect(bottomStyle.paddingRight).toBe('24px');
      expect(bottomStyle.paddingBottom).toBe('24px');

      const sideEl = root.querySelector<SheetElement>('#side-sheet')!;
      const sideContent =
        sideEl.shadowRoot!.querySelector<HTMLElement>('.sheet-content')!;
      const sideStyle = getComputedStyle(sideContent);
      expect(sideStyle.paddingLeft).toBe('24px');
      expect(sideStyle.paddingBottom).toBe('24px');
    });

    it('applies elevation tokens matching Figma for bottom, floating, and side sheets', async () => {
      const root = env.render(html`
        <md-gb-sheet id="std-bottom" position="bottom" open></md-gb-sheet>
        <md-gb-sheet
          id="modal-bottom"
          position="bottom"
          modal
          open></md-gb-sheet>
        <md-gb-sheet id="std-floating" position="floating" open></md-gb-sheet>
        <md-gb-sheet
          id="modal-floating"
          position="floating"
          modal
          open></md-gb-sheet>
        <md-gb-sheet id="std-side" position="side" open></md-gb-sheet>
        <md-gb-sheet id="modal-side" position="side" modal open></md-gb-sheet>
      `);
      await env.waitForStability();

      const stdBottom = root.querySelector<SheetElement>('#std-bottom')!;
      const modalBottom = root.querySelector<SheetElement>('#modal-bottom')!;
      const stdFloating = root.querySelector<SheetElement>('#std-floating')!;
      const modalFloating =
        root.querySelector<SheetElement>('#modal-floating')!;
      const stdSide = root.querySelector<SheetElement>('#std-side')!;
      const modalSide = root.querySelector<SheetElement>('#modal-side')!;

      const stdBottomContainer =
        stdBottom.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const modalBottomContainer =
        modalBottom.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const stdFloatingContainer =
        stdFloating.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const modalFloatingContainer =
        modalFloating.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const stdSideContainer =
        stdSide.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const modalSideContainer =
        modalSide.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;

      // Modal bottom and floating sheets over scrim use elevation 0 (none)
      expect(getComputedStyle(modalBottomContainer).boxShadow).toBe('none');
      expect(getComputedStyle(modalFloatingContainer).boxShadow).toBe('none');
      expect(getComputedStyle(stdSideContainer).boxShadow).toBe('none');

      // Standard bottom and floating sheets use elevation 3
      expect(getComputedStyle(stdBottomContainer).boxShadow).not.toBe('none');
      expect(getComputedStyle(stdFloatingContainer).boxShadow).not.toBe('none');
      // Modal side sheet uses elevation 1
      expect(getComputedStyle(modalSideContainer).boxShadow).not.toBe('none');
    });

    it('applies 56px margins when container exceeds 640px for bottom sheet', async () => {
      const root = env.render(html`
        <div id="wide-host" style="inline-size: 800px;">
          <md-gb-sheet id="wide-bottom" position="bottom" open></md-gb-sheet>
        </div>
        <div id="narrow-host" style="inline-size: 480px;">
          <md-gb-sheet id="narrow-bottom" position="bottom" open></md-gb-sheet>
        </div>
      `);
      await env.waitForStability();

      const wideSheet = root.querySelector<SheetElement>('#wide-bottom')!;
      const wideContainer =
        wideSheet.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const wideStyle = getComputedStyle(wideContainer);

      expect(wideStyle.marginLeft).toBe('56px');
      expect(wideStyle.marginRight).toBe('56px');
      expect(wideStyle.marginTop).toBe('56px');

      const narrowSheet = root.querySelector<SheetElement>('#narrow-bottom')!;
      const narrowContainer =
        narrowSheet.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const narrowStyle = getComputedStyle(narrowContainer);

      expect(narrowStyle.marginLeft).toBe('0px');
      expect(narrowStyle.marginRight).toBe('0px');
      expect(narrowStyle.marginTop).toBe('0px');
    });

    it('does not clip content of non-modal bottom sheet inside a container', async () => {
      const root = env.render(html`
        <div
          style="block-size: 480px; display: flex; flex-direction: column; justify-content: flex-end;">
          <md-gb-sheet position="bottom" open>
            <div style="block-size: 200px; inline-size: 100%;">Content</div>
          </md-gb-sheet>
        </div>
      `);
      await env.waitForStability();

      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const surface =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const contentContainer =
        el.shadowRoot!.querySelector<HTMLElement>('.sheet-content')!;

      // Natural height is 200px content + 24px bottom padding = 224px.
      // Before the fix, max-block-size: calc(100% - 72px) reduced this to 224px - 72px = 152px.
      expect(surface.getBoundingClientRect().height).toBe(224);
      expect(contentContainer.scrollHeight).toBe(contentContainer.clientHeight);
    });

    it('applies floating sheet styles with 28px all corner radii and 56px margin', async () => {
      const root = env.render(html`
        <md-gb-sheet position="floating" open></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const style = getComputedStyle(container);

      expect(style.borderTopLeftRadius).toBe('28px');
      expect(style.borderTopRightRadius).toBe('28px');
      expect(style.borderBottomLeftRadius).toBe('28px');
      expect(style.borderBottomRightRadius).toBe('28px');
      expect(style.marginTop).toBe('56px');
      expect(style.marginBottom).toBe('56px');
      expect(style.minInlineSize).toBe('280px');
      expect(style.maxInlineSize).toBe('640px');
    });

    it('retains 16px corner radii on all 4 corners for modal detached side sheet', async () => {
      const root = env.render(html`
        <md-gb-sheet position="side" modal detached open></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const style = getComputedStyle(container);

      expect(style.borderTopLeftRadius).toBe('16px');
      expect(style.borderTopRightRadius).toBe('16px');
      expect(style.borderBottomLeftRadius).toBe('16px');
      expect(style.borderBottomRightRadius).toBe('16px');
    });

    it('hides .sheet-header when header has no headline, leading, trailing, and has-close-button is not set', async () => {
      const root = env.render(html`
        <md-gb-sheet
          position="bottom"
          has-drag-handle
          aria-label="Headerless Sheet"
          open></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const header =
        el.shadowRoot!.querySelector<HTMLElement>('.sheet-header')!;

      expect(header.hasAttribute('hidden')).toBeTrue();
      expect(getComputedStyle(header).display).toBe('none');
    });
  });

  // UT-4: RTL Logical Mirroring
  describe('UT-4: RTL logical mirroring ([GB-06])', () => {
    it('mirrors physical border width and corner radii under dir="rtl"', async () => {
      const root = env.render(html`
        <div dir="rtl">
          <md-gb-sheet id="rtl-standard" position="side" open></md-gb-sheet>
          <md-gb-sheet id="rtl-modal" position="side" modal open></md-gb-sheet>
        </div>
      `);
      await env.waitForStability();

      const standard = root.querySelector<SheetElement>('#rtl-standard')!;
      const stdContainer =
        standard.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const stdStyle = getComputedStyle(stdContainer);
      // In RTL, inline-start is on the right edge
      expect(stdStyle.borderRightWidth).toBe('1px');
      expect(stdStyle.borderLeftWidth).toBe('0px');

      const modal = root.querySelector<SheetElement>('#rtl-modal')!;
      const modalContainer =
        modal.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const modalStyle = getComputedStyle(modalContainer);
      // In RTL, start-start is top-right and end-start is bottom-right:
      expect(modalStyle.borderTopRightRadius).toBe('16px');
      expect(modalStyle.borderBottomRightRadius).toBe('16px');
      expect(modalStyle.borderTopLeftRadius).toBe('0px');
      expect(modalStyle.borderBottomLeftRadius).toBe('0px');
    });
  });

  // UT-5: ARIA Semantics, Naming & Closed Inertness
  describe('UT-5: ARIA semantics, naming, and closed inertness (DF-4)', () => {
    it('sets role="dialog" and aria-modal="true" when modal is true', async () => {
      const root = env.render(html`
        <md-gb-sheet modal open headline="Modal Title"></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;

      expect(container.getAttribute('role')).toBe('dialog');
      expect(container.getAttribute('aria-modal')).toBe('true');
      expect(container.getAttribute('aria-labelledby')).toBe('sheet-headline');
    });

    it('sets role="region" and omits aria-modal when modal is false', async () => {
      const root = env.render(html`
        <md-gb-sheet open headline="Region Title"></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;

      expect(container.getAttribute('role')).toBe('region');
      expect(container.hasAttribute('aria-modal')).toBeFalse();
    });

    it('falls back to host aria-label when no headline is provided', async () => {
      const root = env.render(html`
        <md-gb-sheet open aria-label="Accessible Sheet"></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;

      expect(container.getAttribute('aria-label')).toBe('Accessible Sheet');
      expect(container.hasAttribute('aria-labelledby')).toBeFalse();
    });

    it('applies display: none when open is false', async () => {
      const root = env.render(html` <md-gb-sheet></md-gb-sheet> `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      expect(getComputedStyle(el).display).toBe('none');
    });

    it('marks headline aria-hidden="true" when no headline is provided', async () => {
      const root = env.render(html`
        <md-gb-sheet open aria-label="Sheet Without Headline"></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const heading =
        el.shadowRoot!.querySelector<HTMLElement>('h2.sheet-headline')!;
      expect(heading.getAttribute('aria-hidden')).toBe('true');
    });

    it('ignores nested slot attributes on descendants inside child elements', async () => {
      const root = env.render(html`
        <md-gb-sheet open aria-label="Outer Sheet">
          <div id="nested-container">
            <span slot="leading">Nested leading</span>
            <span slot="headline">Nested headline</span>
            <span slot="actions">Nested action</span>
          </div>
        </md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const header =
        el.shadowRoot!.querySelector<HTMLElement>('.sheet-header')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;

      // Direct slot query must not match nested grandchildren
      expect(
        header.classList.contains('sheet-header-with-leading'),
      ).toBeFalse();
      expect(container.getAttribute('aria-label')).toBe('Outer Sheet');
      expect(container.hasAttribute('aria-labelledby')).toBeFalse();
    });

    it('reactively updates internal surface aria-label when el.ariaLabel is mutated', async () => {
      const root = env.render(html`
        <md-gb-sheet open aria-label="Initial Label"></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;

      expect(container.getAttribute('aria-label')).toBe('Initial Label');

      el.ariaLabel = 'Updated Dynamic Label';
      await env.waitForStability();

      expect(container.getAttribute('aria-label')).toBe(
        'Updated Dynamic Label',
      );
    });
  });

  // UT-6: Dismissal Events via Harness
  describe('UT-6: Dismissal events via Harness ([TEST-01])', () => {
    it('dispatches sheet-close with reason="close-button" on close button click', async () => {
      const root = env.render(html`
        <md-gb-sheet has-close-button open></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const closeBtn =
        el.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-close')!;
      expect(closeBtn).not.toBeNull();

      let closeReason = '';
      el.addEventListener('sheet-close', (e: Event) => {
        closeReason = (e as CustomEvent<{reason: SheetCloseReason}>).detail
          .reason;
      });

      const harness = new Harness(closeBtn);
      await harness.clickWithMouse();
      await env.waitForStability();

      expect(closeReason).toBe('close-button');
      expect(el.open).toBeFalse();
    });

    it('dispatches sheet-close with reason="escape" on Escape key press', async () => {
      const root = env.render(html` <md-gb-sheet modal open></md-gb-sheet> `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;

      let closeReason = '';
      el.addEventListener('sheet-close', (e: Event) => {
        closeReason = (e as CustomEvent<{reason: SheetCloseReason}>).detail
          .reason;
      });

      const harness = new SheetHarness(el);
      await harness.pressEscape();
      await env.waitForStability();

      expect(closeReason).toBe('escape');
      expect(el.open).toBeFalse();
    });

    it('dispatches sheet-close with reason="scrim" on scrim click', async () => {
      const root = env.render(html` <md-gb-sheet modal open></md-gb-sheet> `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const scrim = el.shadowRoot!.querySelector<HTMLElement>('.sheet-scrim')!;
      expect(scrim).not.toBeNull();

      let closeReason = '';
      el.addEventListener('sheet-close', (e: Event) => {
        closeReason = (e as CustomEvent<{reason: SheetCloseReason}>).detail
          .reason;
      });

      const harness = new Harness(scrim);
      await harness.clickWithMouse();
      await env.waitForStability();

      expect(closeReason).toBe('scrim');
      expect(el.open).toBeFalse();
    });

    it('does not close on Escape or scrim click when closeOnEscape and closeOnScrimClick are false', async () => {
      const root = env.render(html`
        <md-gb-sheet
          modal
          open
          .closeOnEscape=${false}
          .closeOnScrimClick=${false}></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const scrim = el.shadowRoot!.querySelector<HTMLElement>('.sheet-scrim')!;

      let closeFired = false;
      el.addEventListener('sheet-close', () => {
        closeFired = true;
      });

      const sheetHarness = new SheetHarness(el);
      await sheetHarness.pressEscape();
      const scrimHarness = new Harness(scrim);
      await scrimHarness.clickWithMouse();
      await env.waitForStability();

      expect(closeFired).toBeFalse();
      expect(el.open).toBeTrue();
    });
  });

  // UT-7: Bottom Sheet Drag Handle
  describe('UT-7: GAR 2025 bottom sheet drag handle button', () => {
    it('renders accessible full-width button drag handle, toggles expanded state, and dispatches sheet-drag-handle-activate', async () => {
      const root = env.render(html`
        <md-gb-sheet position="bottom" has-drag-handle open></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const dragHandle =
        el.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-drag-handle')!;

      expect(dragHandle).not.toBeNull();
      expect(dragHandle.getAttribute('type')).toBe('button');
      expect(dragHandle.getAttribute('aria-label')).toBe('Change sheet height');
      expect(dragHandle.getAttribute('role')).toBe('Drag handle');
      expect(dragHandle.getAttribute('aria-roledescription')).toBe(
        'Drag handle',
      );
      expect(el.expanded).toBeFalse();

      const style = getComputedStyle(dragHandle);
      expect(parsePixels(style.minInlineSize)).toBeGreaterThanOrEqual(48);
      expect(parsePixels(style.minBlockSize)).toBe(48);
      expect(parsePixels(style.height)).toBe(48);
      expect(dragHandle.getBoundingClientRect().width).toBe(
        container.getBoundingClientRect().width,
      );

      let activateCount = 0;
      el.addEventListener('sheet-drag-handle-activate', () => {
        activateCount++;
      });

      const harness = new Harness(dragHandle);
      await harness.clickWithMouse();
      await env.waitForStability();
      expect(activateCount).toBe(1);
      expect(el.expanded).toBeTrue();
      expect(container.classList.contains('sheet-expanded')).toBeTrue();

      activateCount = 0;
      dragHandle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          composed: true,
        }),
      );
      dragHandle.click();
      await env.waitForStability();
      expect(activateCount).toBe(1);
      expect(el.expanded).toBeFalse();
      expect(container.classList.contains('sheet-expanded')).toBeFalse();

      activateCount = 0;
      dragHandle.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          composed: true,
        }),
      );
      dragHandle.click();
      await env.waitForStability();
      expect(activateCount).toBe(1);
      expect(el.expanded).toBeTrue();
    });

    it('expands, collapses, and dismisses bottom sheet on pointer drag gestures', async () => {
      const root = env.render(html`
        <md-gb-sheet position="bottom" has-drag-handle open>
          <div style="height: 200px;">Content</div>
        </md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const dragHandle =
        el.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-drag-handle')!;

      // Drag upward by 50px -> expands sheet
      dragHandle.dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerId: 1,
          clientY: 300,
          button: 0,
          bubbles: true,
          composed: true,
        }),
      );
      dragHandle.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 1,
          clientY: 250,
          bubbles: true,
          composed: true,
        }),
      );
      dragHandle.dispatchEvent(
        new PointerEvent('pointerup', {
          pointerId: 1,
          clientY: 250,
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      expect(el.expanded).toBeTrue();
      expect(el.open).toBeTrue();

      // Drag downward by 50px while expanded -> collapses sheet without closing
      dragHandle.dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerId: 2,
          clientY: 100,
          button: 0,
          bubbles: true,
          composed: true,
        }),
      );
      dragHandle.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 2,
          clientY: 150,
          bubbles: true,
          composed: true,
        }),
      );
      dragHandle.dispatchEvent(
        new PointerEvent('pointerup', {
          pointerId: 2,
          clientY: 150,
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      expect(el.expanded).toBeFalse();
      expect(el.open).toBeTrue();

      // Drag downward by 80px while collapsed -> dismisses sheet with reason="drag"
      let closeReason = '';
      el.addEventListener('sheet-close', (e: Event) => {
        closeReason = (e as CustomEvent<{reason: SheetCloseReason}>).detail
          .reason;
      });
      dragHandle.dispatchEvent(
        new PointerEvent('pointerdown', {
          pointerId: 3,
          clientY: 200,
          button: 0,
          bubbles: true,
          composed: true,
        }),
      );
      dragHandle.dispatchEvent(
        new PointerEvent('pointermove', {
          pointerId: 3,
          clientY: 280,
          bubbles: true,
          composed: true,
        }),
      );
      dragHandle.dispatchEvent(
        new PointerEvent('pointerup', {
          pointerId: 3,
          clientY: 280,
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();
      expect(closeReason).toBe('drag');
      expect(el.open).toBeFalse();
    });

    it('resolves non-modal expanded bottom sheet height against parent container', async () => {
      const root = env.render(html`
        <div
          style="block-size: 400px; inline-size: 480px; display: flex; flex-direction: column;">
          <md-gb-sheet position="bottom" open expanded></md-gb-sheet>
        </div>
      `);
      await env.waitForStability();

      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const container =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;

      expect(parsePixels(getComputedStyle(container).height)).toBe(328);
    });
  });

  // UT-8: Modal Focus Trap & Restoration
  describe('UT-8: Modal focus trap and trigger restoration (DF-3)', () => {
    it('places focus in sheet on modal open and restores to trigger on close', async () => {
      const root = env.render(html`
        <button id="trigger-btn">Open Sheet</button>
        <md-gb-sheet modal headline="Test Modal">
          <button id="slotted-btn">Slotted Action</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const trigger = root.querySelector<HTMLButtonElement>('#trigger-btn')!;
      const sheetEl = root.querySelector<SheetElement>('md-gb-sheet')!;
      trigger.focus();
      expect(document.activeElement).toBe(trigger);

      sheetEl.open = true;
      await env.waitForStability();

      // Focus should move inside sheet
      const activeEl = document.activeElement;
      const isInsideSheet =
        activeEl === sheetEl ||
        sheetEl.contains(activeEl) ||
        sheetEl.shadowRoot?.contains(activeEl);
      expect(isInsideSheet).toBeTrue();

      sheetEl.open = false;
      await env.waitForStability();

      expect(document.activeElement).toBe(trigger);
    });

    it('does not steal focus on standard non-modal open', async () => {
      const root = env.render(html`
        <button id="standard-trigger">External Button</button>
        <md-gb-sheet headline="Standard Sheet">
          <button id="standard-inner">Inner Action</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const trigger =
        root.querySelector<HTMLButtonElement>('#standard-trigger')!;
      const sheetEl = root.querySelector<SheetElement>('md-gb-sheet')!;
      trigger.focus();

      sheetEl.open = true;
      await env.waitForStability();

      expect(document.activeElement).toBe(trigger);
    });

    it('wraps backward via Shift+Tab from leading button to last focusable element', async () => {
      const root = env.render(html`
        <md-gb-sheet modal open headline="Modal with Leading and Actions">
          <button slot="leading" id="leading-back">Back</button>
          <button id="body-action">Body Action</button>
          <button slot="actions" id="save-action">Save</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const leadingBtn =
        root.querySelector<HTMLButtonElement>('#leading-back')!;
      const saveBtn = root.querySelector<HTMLButtonElement>('#save-action')!;
      const sheetEl = root.querySelector<SheetElement>('md-gb-sheet')!;

      leadingBtn.focus();
      expect(document.activeElement).toBe(leadingBtn);

      sheetEl.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();

      expect(document.activeElement).toBe(saveBtn);

      sheetEl.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: false,
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();

      expect(document.activeElement).toBe(leadingBtn);
    });

    it('does not jump forward via Shift+Tab from internal close button when leading button is present', async () => {
      const root = env.render(html`
        <md-gb-sheet
          modal
          open
          has-close-button
          headline="Modal with Close and Leading">
          <button slot="leading" id="leading-back">Back</button>
          <button slot="actions" id="save-action">Save</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const leadingBtn =
        root.querySelector<HTMLButtonElement>('#leading-back')!;
      expect(leadingBtn).not.toBeNull();
      const sheetEl = root.querySelector<SheetElement>('md-gb-sheet')!;
      const closeBtn =
        sheetEl.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-close')!;
      const saveBtn = root.querySelector<HTMLButtonElement>('#save-action')!;

      closeBtn.focus();
      expect(sheetEl.shadowRoot!.activeElement).toBe(closeBtn);

      const event = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      sheetEl.dispatchEvent(event);
      await env.waitForStability();

      expect(event.defaultPrevented).toBeFalse();
      expect(document.activeElement).not.toBe(saveBtn);
    });

    it('respects [autofocus] for initial focus placement', async () => {
      const root = env.render(html`
        <md-gb-sheet modal open headline="Autofocus Sheet">
          <button id="btn-1">First</button>
          <button id="btn-autofocus" autofocus>Autofocused</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const autofocusBtn =
        root.querySelector<HTMLButtonElement>('#btn-autofocus')!;
      expect(document.activeElement).toBe(autofocusBtn);
    });

    it('traps focus when modal is dynamically toggled while open is true', async () => {
      const root = env.render(html`
        <button id="outer-btn">Outer</button>
        <md-gb-sheet open headline="Dynamic Modal">
          <button id="inner-btn">Inner</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const outerBtn = root.querySelector<HTMLButtonElement>('#outer-btn')!;
      const innerBtn = root.querySelector<HTMLButtonElement>('#inner-btn')!;
      const sheetEl = root.querySelector<SheetElement>('md-gb-sheet')!;

      outerBtn.focus();
      expect(document.activeElement).toBe(outerBtn);

      sheetEl.modal = true;
      await env.waitForStability();

      expect(document.activeElement).toBe(innerBtn);
    });

    it('traverses focus into open shadow roots of custom elements', async () => {
      const root = env.render(html`
        <md-gb-sheet modal open headline="Shadow Custom Element Modal">
          <test-custom-focusable id="custom-el"></test-custom-focusable>
          <button slot="actions" id="footer-btn">Footer</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const customEl = root.querySelector<HTMLElement>('#custom-el')!;
      const shadowBtn =
        customEl.shadowRoot!.querySelector<HTMLButtonElement>(
          '#shadow-inner-btn',
        )!;
      const footerBtn = root.querySelector<HTMLButtonElement>('#footer-btn')!;
      const sheetEl = root.querySelector<SheetElement>('md-gb-sheet')!;

      // Focus should start on the first focusable element inside the custom element
      expect(customEl.shadowRoot!.activeElement).toBe(shadowBtn);

      // Shift+Tab from custom element shadow root should wrap backward to footer button
      sheetEl.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
          composed: true,
        }),
      );
      await env.waitForStability();

      expect(document.activeElement).toBe(footerBtn);
    });
  });

  // UT-9: Header, Body & Actions Slot Composition
  describe('UT-9: Header, body, and actions slot composition', () => {
    it('applies Figma header padding (12px inline-end with close button, 24px without), top alignment, and 48px icon button dimensions', async () => {
      const root = env.render(html`
        <md-gb-sheet
          id="with-close"
          open
          has-close-button
          headline="Header Title"></md-gb-sheet>
        <md-gb-sheet
          id="without-close"
          open
          headline="Header Without Close"></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('#with-close')!;
      const header =
        el.shadowRoot!.querySelector<HTMLElement>('.sheet-header')!;
      const headline =
        el.shadowRoot!.querySelector<HTMLElement>('.sheet-headline')!;
      const closeBtn =
        el.shadowRoot!.querySelector<HTMLElement>('.sheet-close')!;

      const headerStyle = getComputedStyle(header);
      expect(headerStyle.alignItems).toBe('flex-start');
      expect(headerStyle.paddingBlockStart).toBe('12px');
      expect(headerStyle.paddingBlockEnd).toBe('16px');
      expect(headerStyle.paddingInlineStart).toBe('24px');
      expect(headerStyle.paddingInlineEnd).toBe('12px');

      const headlineStyle = getComputedStyle(headline);
      expect(headlineStyle.paddingBlockStart).toBe('12px');
      expect(headlineStyle.paddingBlockEnd).toBe('8px');

      const closeStyle = getComputedStyle(closeBtn);
      expect(closeStyle.inlineSize).toBe('48px');
      expect(closeStyle.blockSize).toBe('48px');

      const withoutCloseEl =
        root.querySelector<SheetElement>('#without-close')!;
      const withoutCloseHeader =
        withoutCloseEl.shadowRoot!.querySelector<HTMLElement>('.sheet-header')!;
      const withoutCloseHeaderStyle = getComputedStyle(withoutCloseHeader);
      expect(withoutCloseHeaderStyle.paddingInlineStart).toBe('24px');
      expect(withoutCloseHeaderStyle.paddingInlineEnd).toBe('24px');
    });

    it('adapts header padding when slot="leading" is provided', async () => {
      const root = env.render(html`
        <md-gb-sheet open headline="Header With Leading">
          <button slot="leading" id="back-btn">Back</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const header =
        el.shadowRoot!.querySelector<HTMLElement>('.sheet-header')!;

      expect(header.classList.contains('sheet-header-with-leading')).toBeTrue();
      const style = getComputedStyle(header);
      expect(style.paddingInlineStart).toBe('4px');
    });

    it('omits close button by default and renders it when has-close-button is present', async () => {
      const root = env.render(html`
        <md-gb-sheet id="default-sheet" open></md-gb-sheet>
        <md-gb-sheet id="close-btn-sheet" has-close-button open></md-gb-sheet>
      `);
      await env.waitForStability();
      const defaultEl = root.querySelector<SheetElement>('#default-sheet')!;
      expect(defaultEl.shadowRoot!.querySelector('.sheet-close')).toBeNull();

      const closeBtnEl = root.querySelector<SheetElement>('#close-btn-sheet')!;
      expect(
        closeBtnEl.shadowRoot!.querySelector('.sheet-close'),
      ).not.toBeNull();
    });

    it('hides .sheet-actions when slot="actions" is empty', async () => {
      const root = env.render(html`
        <md-gb-sheet open><p>Body text</p></md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const actions =
        el.shadowRoot!.querySelector<HTMLElement>('.sheet-actions')!;
      expect(getComputedStyle(actions).display).toBe('none');
    });

    it('left-aligns actions and renders divider above actions when divideActionButtons is true', async () => {
      const root = env.render(html`
        <md-gb-sheet divide-action-buttons open headline="Divided Sheet">
          <p>Body</p>
          <button slot="actions">Save</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      expect(el.divideActionButtons).toBeTrue();
      const actions =
        el.shadowRoot!.querySelector<HTMLElement>('.sheet-actions')!;
      const style = getComputedStyle(actions);
      expect(style.justifyContent).toBe('flex-start');
      expect(style.borderTopWidth).toBe('1px');
    });
  });

  // UT-10: Zero-Remount Responsive Switching
  describe('UT-10: Zero-remount responsive switching (Carbon Spec)', () => {
    it('preserves child element identity and input state across position changes', async () => {
      const root = env.render(html`
        <md-gb-sheet position="bottom" open>
          <input id="test-input" value="test-state" />
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const input = el.querySelector<HTMLInputElement>('#test-input')!;
      expect(input).not.toBeNull();
      expect(input.value).toBe('test-state');

      // Switch position to side
      el.position = 'side';
      await env.waitForStability();
      expect(el.querySelector<HTMLInputElement>('#test-input')).toBe(input);
      expect(input.value).toBe('test-state');

      const sideContainer =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      expect(getComputedStyle(sideContainer).inlineSize).toBe('256px');

      // Switch position to floating
      el.position = 'floating';
      await env.waitForStability();
      expect(el.querySelector<HTMLInputElement>('#test-input')).toBe(input);
      expect(input.value).toBe('test-state');

      const floatContainer =
        el.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      expect(getComputedStyle(floatContainer).borderTopLeftRadius).toBe('28px');
    });
  });

  // UT-11: Light DOM setupSheet() & AbortSignal Cleanup
  describe('UT-11: Light DOM setupSheet() and AbortSignal cleanup (DF-3)', () => {
    it('handles escape dismissal and cleans up via return callback', () => {
      const container = document.createElement('div');
      container.classList.add('sheet', 'sheet-open');
      document.body.appendChild(container);

      let closedReason = '';
      const cleanup = setupSheet(container, {
        onClose: (reason) => {
          closedReason = reason;
        },
      });

      container.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );
      expect(closedReason).toBe('escape');

      closedReason = '';
      cleanup();

      container.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );
      expect(closedReason).toBe('');

      container.remove();
    });

    it('cleans up listeners when AbortSignal aborts', () => {
      const container = document.createElement('div');
      container.classList.add('sheet', 'sheet-open');
      document.body.appendChild(container);

      const controller = new AbortController();
      let closedReason = '';
      setupSheet(container, {
        signal: controller.signal,
        onClose: (reason) => {
          closedReason = reason;
        },
      });

      container.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );
      expect(closedReason).toBe('escape');

      closedReason = '';
      controller.abort();

      container.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );
      expect(closedReason).toBe('');

      container.remove();
    });

    it('does not invoke onClose on Escape when sheet is closed (without .sheet-open)', () => {
      const container = document.createElement('div');
      container.classList.add('sheet');
      document.body.appendChild(container);

      let closedReason = '';
      setupSheet(container, {
        onClose: (reason) => {
          closedReason = reason;
        },
      });

      container.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );
      expect(closedReason).toBe('');

      container.remove();
    });

    it('removes .sheet-open and dispatches sheet-close CustomEvent when onClose is omitted', () => {
      const container = document.createElement('div');
      container.classList.add('sheet', 'sheet-open');
      document.body.appendChild(container);

      let eventFired = false;
      let closeReason = '';
      container.addEventListener('sheet-close', (e: Event) => {
        eventFired = true;
        closeReason = (e as CustomEvent<{reason: SheetCloseReason}>).detail
          .reason;
      });

      setupSheet(container);

      container.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );

      expect(eventFired).toBeTrue();
      expect(closeReason).toBe('escape');
      expect(container.classList.contains('sheet-open')).toBeFalse();

      container.remove();
    });

    it('dismisses modal Light DOM sheet on sibling .sheet-scrim click', () => {
      const wrapper = document.createElement('div');
      const scrim = document.createElement('div');
      scrim.classList.add('sheet-scrim');
      const container = document.createElement('div');
      container.classList.add('sheet', 'sheet-modal', 'sheet-open');
      wrapper.appendChild(scrim);
      wrapper.appendChild(container);
      document.body.appendChild(wrapper);

      let closedReason = '';
      setupSheet(container, {
        onClose: (reason) => {
          closedReason = reason;
          container.classList.remove('sheet-open');
        },
      });

      expect(getComputedStyle(scrim).display).not.toBe('none');
      scrim.click();

      expect(closedReason).toBe('scrim');
      expect(container.classList.contains('sheet-open')).toBeFalse();
      expect(getComputedStyle(scrim).display).toBe('none');

      wrapper.remove();
    });

    it('traps Tab focus within modal Light DOM sheet', () => {
      const container = document.createElement('div');
      container.classList.add('sheet', 'sheet-modal', 'sheet-open');
      const btn1 = document.createElement('button');
      btn1.id = 'light-btn-1';
      const btn2 = document.createElement('button');
      btn2.id = 'light-btn-2';
      container.appendChild(btn1);
      container.appendChild(btn2);
      document.body.appendChild(container);

      setupSheet(container);

      btn2.focus();
      expect(document.activeElement).toBe(btn2);

      container.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: false,
          bubbles: true,
        }),
      );
      expect(document.activeElement).toBe(btn1);

      container.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
        }),
      );
      expect(document.activeElement).toBe(btn2);

      container.remove();
    });

    it('handles pointer drag gestures on light DOM drag handle', () => {
      const container = document.createElement('div');
      container.classList.add('sheet', 'sheet-bottom', 'sheet-open');
      const handle = document.createElement('button');
      handle.classList.add('sheet-drag-handle');
      container.appendChild(handle);
      document.body.appendChild(container);

      let closeReason = '';
      setupSheet(container, {
        onClose: (reason) => {
          closeReason = reason;
        },
      });

      handle.dispatchEvent(
        new PointerEvent('pointerdown', {
          clientY: 200,
          button: 0,
          bubbles: true,
        }),
      );
      window.dispatchEvent(
        new PointerEvent('pointermove', {clientY: 280, bubbles: true}),
      );
      window.dispatchEvent(
        new PointerEvent('pointerup', {clientY: 280, bubbles: true}),
      );

      expect(closeReason).toBe('drag');
      expect(container.classList.contains('sheet-open')).toBeFalse();
      container.remove();
    });
  });

  // UT-12: adoptStyles & Test Hygiene
  describe('UT-12: adoptStyles and test hygiene ([TEST-02], [GB-13])', () => {
    it('adopts stylesheet in both shadowRoot and document', async () => {
      const root = env.render(html`<md-gb-sheet open></md-gb-sheet>`);
      await env.waitForStability();
      const el = root.querySelector<SheetElement>('md-gb-sheet')!;

      const shadowAdopted = el.shadowRoot!.adoptedStyleSheets;
      expect(shadowAdopted.length).toBeGreaterThan(0);
    });

    it('adopts sheetStyles into an enclosing host ShadowRoot', async () => {
      const hostContainer = document.createElement('div');
      document.body.appendChild(hostContainer);
      const hostShadow = hostContainer.attachShadow({mode: 'open'});

      const sheetEl = document.createElement('md-gb-sheet');
      hostShadow.appendChild(sheetEl);

      await env.waitForStability();

      if (sheetStyles.styleSheet) {
        expect(hostShadow.adoptedStyleSheets).toContain(sheetStyles.styleSheet);
      }
      // Ensure adopting sheetStyles into an enclosing ShadowRoot does not hide its host element
      expect(getComputedStyle(hostContainer).display).not.toBe('none');
      expect(getComputedStyle(sheetEl).display).toBe('none');

      hostContainer.remove();
    });

    it('keeps [part="sheet"] position relative inside modal <md-gb-sheet> while applying position fixed to Light DOM .sheet.sheet-modal.sheet-open', async () => {
      const root = env.render(html`
        <md-gb-sheet modal open headline="Modal Custom Element"></md-gb-sheet>
        <aside
          class="${sheet({position: 'side', modal: true, open: true})}"
          aria-label="Modal Light DOM"></aside>
      `);
      await env.waitForStability();

      const customEl = root.querySelector<SheetElement>('md-gb-sheet')!;
      const part =
        customEl.shadowRoot!.querySelector<HTMLElement>('[part="sheet"]')!;
      const lightDomEl = root.querySelector<HTMLElement>('aside.sheet')!;

      expect(getComputedStyle(customEl).position).toBe('fixed');
      expect(getComputedStyle(part).position).toBe('relative');
      expect(getComputedStyle(lightDomEl).position).toBe('fixed');
    });
  });

  // UT-14: Built-in Back Arrow Button
  describe('UT-14: Built-in back arrow button (hasBackButton)', () => {
    it('renders built-in back button when has-back-button is present', async () => {
      const root = env.render(html`
        <md-gb-sheet id="no-back" open headline="Title"></md-gb-sheet>
        <md-gb-sheet
          id="with-back"
          has-back-button
          open
          headline="Title"></md-gb-sheet>
      `);
      await env.waitForStability();

      const noBack = root.querySelector<SheetElement>('#no-back')!;
      expect(noBack.shadowRoot!.querySelector('.sheet-back')).toBeNull();

      const withBack = root.querySelector<SheetElement>('#with-back')!;
      const backBtn =
        withBack.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-back')!;
      expect(backBtn).not.toBeNull();
      expect(backBtn.getAttribute('type')).toBe('button');
      expect(backBtn.getAttribute('aria-label')).toBe('Back');
      expect(backBtn.querySelector('svg.sheet-back-icon')).not.toBeNull();

      const header = withBack.shadowRoot!.querySelector('.sheet-header')!;
      expect(header.classList.contains('sheet-header-with-leading')).toBeTrue();
      expect(getComputedStyle(header).paddingLeft).toBe('4px');
    });

    it('customizes back button aria-label with back-label', async () => {
      const root = env.render(html`
        <md-gb-sheet
          has-back-button
          back-label="Return to previous screen"
          open></md-gb-sheet>
      `);
      await env.waitForStability();

      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const backBtn =
        el.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-back')!;
      expect(backBtn.getAttribute('aria-label')).toBe(
        'Return to previous screen',
      );
    });

    it('dispatches cancelable sheet-back event and closes sheet with reason="back-button" by default', async () => {
      const root = env.render(html`
        <md-gb-sheet has-back-button open></md-gb-sheet>
      `);
      await env.waitForStability();

      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const backBtn =
        el.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-back')!;

      let backEvent: CustomEvent<void> | null = null;
      let closeReason = '';
      el.addEventListener('sheet-back', (e: Event) => {
        backEvent = e as CustomEvent<void>;
      });
      el.addEventListener('sheet-close', (e: Event) => {
        closeReason = (e as CustomEvent<{reason: SheetCloseReason}>).detail
          .reason;
      });

      backBtn.click();
      await env.waitForStability();

      expect(backEvent).not.toBeNull();
      expect(backEvent!.bubbles).toBeTrue();
      expect(backEvent!.composed).toBeTrue();
      expect(backEvent!.cancelable).toBeTrue();
      expect(closeReason).toBe('back-button');
      expect(el.open).toBeFalse();
    });

    it('prevents sheet from closing when event.preventDefault() is called on sheet-back', async () => {
      const root = env.render(html`
        <md-gb-sheet has-back-button open></md-gb-sheet>
      `);
      await env.waitForStability();

      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const backBtn =
        el.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-back')!;

      let closeFired = false;
      el.addEventListener('sheet-back', (e: Event) => {
        e.preventDefault();
      });
      el.addEventListener('sheet-close', () => {
        closeFired = true;
      });

      backBtn.click();
      await env.waitForStability();

      expect(closeFired).toBeFalse();
      expect(el.open).toBeTrue();
    });

    it('dispatches sheet-back, closes sheet with reason="back-button", and invokes opts.onBack in setupSheet', async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="sheet sheet-open sheet-side">
          <header class="sheet-header sheet-header-with-leading">
            <button class="sheet-back" type="button" aria-label="Back">
              <svg class="sheet-back-icon" viewBox="0 0 24 24"><path d="M0 0"/></svg>
            </button>
          </header>
        </div>
      `;
      document.body.appendChild(container);

      const sheetDiv = container.querySelector<HTMLElement>('.sheet')!;
      let onBackCalled = false;
      let backEvent: CustomEvent<void> | null = null;
      let closeReason = '';
      let callbackCloseReason = '';

      sheetDiv.addEventListener('sheet-back', (e: Event) => {
        backEvent = e as CustomEvent<void>;
      });
      sheetDiv.addEventListener('sheet-close', (e: Event) => {
        closeReason = (e as CustomEvent<{reason: SheetCloseReason}>).detail
          .reason;
      });

      const cleanup = setupSheet(sheetDiv, {
        onBack: (e) => {
          onBackCalled = true;
          expect(e.type).toBe('sheet-back');
        },
        onClose: (reason) => {
          callbackCloseReason = reason;
        },
      });

      const backBtn = sheetDiv.querySelector<HTMLButtonElement>('.sheet-back')!;
      backBtn.click();

      expect(backEvent).not.toBeNull();
      expect(backEvent!.bubbles).toBeTrue();
      expect(backEvent!.composed).toBeTrue();
      expect(backEvent!.cancelable).toBeTrue();
      expect(onBackCalled).toBeTrue();
      expect(closeReason).toBe('back-button');
      expect(callbackCloseReason).toBe('back-button');
      expect(sheetDiv.classList.contains('sheet-open')).toBeFalse();

      cleanup();
      container.remove();
    });

    it('prevents setupSheet closure when sheet-back listener calls event.preventDefault()', async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="sheet sheet-open sheet-side">
          <header class="sheet-header sheet-header-with-leading">
            <button class="sheet-back" type="button" aria-label="Back">
              <svg class="sheet-back-icon" viewBox="0 0 24 24"><path d="M0 0"/></svg>
            </button>
          </header>
        </div>
      `;
      document.body.appendChild(container);

      const sheetDiv = container.querySelector<HTMLElement>('.sheet')!;
      let closeFired = false;
      sheetDiv.addEventListener('sheet-back', (e: Event) => {
        e.preventDefault();
      });
      sheetDiv.addEventListener('sheet-close', () => {
        closeFired = true;
      });

      const cleanup = setupSheet(sheetDiv, {
        onClose: () => {
          closeFired = true;
        },
      });

      const backBtn = sheetDiv.querySelector<HTMLButtonElement>('.sheet-back')!;
      backBtn.click();

      expect(closeFired).toBeFalse();
      expect(sheetDiv.classList.contains('sheet-open')).toBeTrue();

      cleanup();
      container.remove();
    });

    it('prevents setupSheet closure when opts.onBack calls event.preventDefault()', async () => {
      const container = document.createElement('div');
      container.innerHTML = `
        <div class="sheet sheet-open sheet-side">
          <header class="sheet-header sheet-header-with-leading">
            <button class="sheet-back" type="button" aria-label="Back">
              <svg class="sheet-back-icon" viewBox="0 0 24 24"><path d="M0 0"/></svg>
            </button>
          </header>
        </div>
      `;
      document.body.appendChild(container);

      const sheetDiv = container.querySelector<HTMLElement>('.sheet')!;
      let closeFired = false;
      sheetDiv.addEventListener('sheet-close', () => {
        closeFired = true;
      });

      const cleanup = setupSheet(sheetDiv, {
        onBack: (e) => {
          e.preventDefault();
        },
        onClose: () => {
          closeFired = true;
        },
      });

      const backBtn = sheetDiv.querySelector<HTMLButtonElement>('.sheet-back')!;
      backBtn.click();

      expect(closeFired).toBeFalse();
      expect(sheetDiv.classList.contains('sheet-open')).toBeTrue();

      cleanup();
      container.remove();
    });

    it('prioritizes slotted leading element over built-in back button in focus order', async () => {
      const root = env.render(html`
        <md-gb-sheet has-back-button modal open>
          <button slot="leading" id="custom-leading">Custom Back</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const customBtn = el.querySelector<HTMLButtonElement>('#custom-leading')!;
      expect(customBtn).not.toBeNull();

      const leadingSlot = el.shadowRoot!.querySelector<HTMLSlotElement>(
        'slot[name="leading"]',
      )!;
      expect(leadingSlot.assignedElements()).toContain(customBtn);

      const focusables = el['getComposedFocusableElements']();
      expect(focusables).toContain(customBtn);
      const backBtn =
        el.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-back')!;
      expect(focusables).not.toContain(backBtn);
    });

    it('participates in modal focus trapping in DOM order', async () => {
      const root = env.render(html`
        <md-gb-sheet
          modal
          open
          has-back-button
          has-close-button
          headline="Focus test">
          <button slot="actions" id="action-btn">Done</button>
        </md-gb-sheet>
      `);
      await env.waitForStability();

      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const backBtn =
        el.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-back')!;
      const closeBtn =
        el.shadowRoot!.querySelector<HTMLButtonElement>('.sheet-close')!;
      const actionBtn = root.querySelector<HTMLButtonElement>('#action-btn')!;

      expect(backBtn).not.toBeNull();
      expect(closeBtn).not.toBeNull();

      // Focusing back button and pressing Shift+Tab should wrap to last focusable (action-btn)
      backBtn.focus();
      expect(el.shadowRoot!.activeElement).toBe(backBtn);

      const shiftTab = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: true,
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      el.dispatchEvent(shiftTab);
      await env.waitForStability();
      expect(document.activeElement).toBe(actionBtn);

      // From action button, pressing Tab should wrap to first focusable (back-btn)
      const tab = new KeyboardEvent('keydown', {
        key: 'Tab',
        shiftKey: false,
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      el.dispatchEvent(tab);
      await env.waitForStability();
      expect(el.shadowRoot!.activeElement).toBe(backBtn);
    });

    it('mirrors back icon in RTL when dir="rtl" is set directly on md-gb-sheet host', async () => {
      const root = env.render(html`
        <md-gb-sheet has-back-button open dir="rtl"></md-gb-sheet>
      `);
      await env.waitForStability();

      const el = root.querySelector<SheetElement>('md-gb-sheet')!;
      const backIcon =
        el.shadowRoot!.querySelector<SVGElement>('.sheet-back-icon')!;

      const style = getComputedStyle(backIcon);
      expect(style.transform).toBe('matrix(-1, 0, 0, 1, 0, 0)');
    });
  });
});
