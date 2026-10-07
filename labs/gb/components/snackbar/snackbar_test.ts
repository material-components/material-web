/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../button/md-gb-button.js';

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import {SnackbarHarness} from './harness.js';
import './md-gb-snackbar.js';
import {CLOSE_REASONS, setupSnackbar, SNACKBAR_CLASSES} from './snackbar.js';
import snackbarStyles from './snackbar.cssresult.js';

// The utility classes must be styled in the document for Light DOM usage.
// Element mode adopts the same sheet in its shadow root.
adoptStyles(document, snackbarStyles);

describe('<md-gb-snackbar>', () => {
  const env = new Environment();

  async function setupTest(
    template = html`<md-gb-snackbar
      label-text="Test message"
      quick></md-gb-snackbar>`,
  ) {
    const root = env.render(template);
    await env.waitForStability();
    const snackbar = root.querySelector('md-gb-snackbar');
    if (!snackbar) {
      throw new Error('Failed to query rendered <md-gb-snackbar>');
    }
    const harness = new SnackbarHarness(snackbar);
    return {harness, root, snackbar};
  }

  describe('initial properties', () => {
    it('initializes with default values', async () => {
      const {snackbar} = await setupTest();
      expect(snackbar.open).toBeFalse();
      expect(snackbar.timeoutMs).toBe(5000);
      expect(snackbar.fixed).toBeFalse();
      expect(snackbar.closeLabel).toBe('Close');
      expect(snackbar.labelText).toBe('Test message');
      expect(snackbar.actionLabel).toBe('');
      expect(snackbar.hasCloseButton).toBeFalse();
    });

    it('has accessible status and live attributes', async () => {
      const {snackbar} = await setupTest();
      const statusEl = snackbar.shadowRoot?.querySelector('[role="status"]');
      expect(statusEl).withContext('role="status" element').not.toBeNull();
      expect(statusEl?.getAttribute('aria-live')).toBe('polite');
      expect(statusEl?.getAttribute('aria-atomic')).toBe('true');
    });
  });

  describe('open attribute', () => {
    it('renders open with visible text when instantiated with open attribute', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar
          open
          label-text="Initial open message"
          quick></md-gb-snackbar>`,
      );
      await env.waitForStability();
      expect(snackbar.open).toBeTrue();
      const label = harness.getLabelElement();
      expect(label).not.toBeNull();
      expect(label!.textContent?.trim()).toBe('Initial open message');
      const surface = harness.getSurfaceElement()!;
      expect(surface.offsetHeight).toBeGreaterThan(0);
    });
  });

  describe('show and close', () => {
    it('sets open to true on show() and false on close()', async () => {
      const {snackbar} = await setupTest();
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      await snackbar.close();
      expect(snackbar.open).toBeFalse();
    });

    it('fires open and opened events on show()', async () => {
      const {snackbar} = await setupTest();
      const openSpy = jasmine.createSpy('open');
      const openedSpy = jasmine.createSpy('opened');
      snackbar.addEventListener('open', openSpy);
      snackbar.addEventListener('opened', openedSpy);

      await snackbar.show();
      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openedSpy).toHaveBeenCalledTimes(1);
    });

    it('fires close and closed events on close() with reason', async () => {
      const {snackbar} = await setupTest();
      await snackbar.show();

      let closeReason = '';
      let closedReason = '';
      snackbar.addEventListener('close', (e: Event) => {
        closeReason = (e as CustomEvent<{reason: string}>).detail.reason;
      });
      snackbar.addEventListener('closed', (e: Event) => {
        closedReason = (e as CustomEvent<{reason: string}>).detail.reason;
      });

      await snackbar.close(CLOSE_REASONS.ACTION);
      expect(closeReason).toBe(CLOSE_REASONS.ACTION);
      expect(closedReason).toBe(CLOSE_REASONS.ACTION);
    });

    it('syncs open property with show() and close()', async () => {
      const {snackbar} = await setupTest();
      spyOn(snackbar, 'show').and.callThrough();
      spyOn(snackbar, 'close').and.callThrough();

      snackbar.open = true;
      await env.waitForStability();
      expect(snackbar.show).toHaveBeenCalled();

      snackbar.open = false;
      await env.waitForStability();
      expect(snackbar.close).toHaveBeenCalled();
    });

    it('opens and closes via open property assignment and dispatches events', async () => {
      const {snackbar} = await setupTest();
      const openSpy = jasmine.createSpy('open');
      const openedSpy = jasmine.createSpy('opened');
      const closeSpy = jasmine.createSpy('close');
      const closedSpy = jasmine.createSpy('closed');
      snackbar.addEventListener('open', openSpy);
      snackbar.addEventListener('opened', openedSpy);
      snackbar.addEventListener('close', closeSpy);
      snackbar.addEventListener('closed', closedSpy);

      snackbar.open = true;
      await env.waitForStability();
      expect(snackbar.open).toBeTrue();
      expect(openSpy).toHaveBeenCalledTimes(1);
      expect(openedSpy).toHaveBeenCalledTimes(1);

      snackbar.open = false;
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(closedSpy).toHaveBeenCalledTimes(1);
    });

    it('cancels show() when open event is defaultPrevented', async () => {
      const {snackbar} = await setupTest();
      snackbar.addEventListener('open', (e) => {
        e.preventDefault();
      });
      await snackbar.show();
      expect(snackbar.open).toBeFalse();
    });

    it('cancels close() when close event is defaultPrevented', async () => {
      const {snackbar} = await setupTest();
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      snackbar.addEventListener('close', (e) => {
        e.preventDefault();
      });
      await snackbar.close();
      expect(snackbar.open).toBeTrue();
    });
  });

  describe('animation timing', () => {
    it('waits for OPEN_DURATION_MS on show and CLOSE_DURATION_MS on close when quick is false', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar label-text="Animation test"></md-gb-snackbar>`,
      );
      let opened = false;
      snackbar.addEventListener('opened', () => {
        opened = true;
      });
      const showPromise = snackbar.show();
      await snackbar.updateComplete;
      expect(opened).toBeFalse();

      jasmine.clock().tick(150);
      await showPromise;
      expect(opened).toBeTrue();

      let closed = false;
      snackbar.addEventListener('closed', () => {
        closed = true;
      });
      const closePromise = snackbar.close();
      await snackbar.updateComplete;
      expect(closed).toBeFalse();

      jasmine.clock().tick(75);
      await closePromise;
      expect(closed).toBeTrue();
    });

    it('respects prefers-reduced-motion: reduce', async () => {
      spyOn(window, 'matchMedia').and.callFake(
        (query: string) =>
          ({
            matches: query === '(prefers-reduced-motion: reduce)',
            media: query,
            onchange: null,
            addListener: () => {},
            removeListener: () => {},
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => false,
          }) as MediaQueryList,
      );

      const {snackbar} = await setupTest(
        html`<md-gb-snackbar label-text="Reduced motion"></md-gb-snackbar>`,
      );
      let opened = false;
      snackbar.addEventListener('opened', () => {
        opened = true;
      });
      await snackbar.show();
      expect(opened).toBeTrue();
    });

    it('supersedes opening when close() is called during open animation', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Interrupted open"
          timeout-ms="1000"></md-gb-snackbar>`,
      );
      const openedSpy = jasmine.createSpy('opened');
      const closedSpy = jasmine.createSpy('closed');
      snackbar.addEventListener('opened', openedSpy);
      snackbar.addEventListener('closed', closedSpy);

      const showPromise = snackbar.show();
      await snackbar.updateComplete;

      jasmine.clock().tick(50);

      const closePromise = snackbar.close();
      await snackbar.updateComplete;

      jasmine.clock().tick(150);
      await Promise.all([showPromise, closePromise]);

      expect(openedSpy).not.toHaveBeenCalled();
      expect(snackbar.open).toBeFalse();

      closedSpy.calls.reset();
      jasmine.clock().tick(2000);
      await env.waitForStability();
      expect(closedSpy).not.toHaveBeenCalled();
    });

    it('supersedes closing when show() is called during close animation', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Interrupted close"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      snackbar.quick = false;
      const closedSpy = jasmine.createSpy('closed');
      snackbar.addEventListener('closed', closedSpy);

      const closePromise = snackbar.close();
      await snackbar.updateComplete;

      jasmine.clock().tick(25);

      const showPromise = snackbar.show();
      await snackbar.updateComplete;

      jasmine.clock().tick(200);
      await Promise.all([closePromise, showPromise]);

      expect(closedSpy).not.toHaveBeenCalled();
      expect(snackbar.open).toBeTrue();
    });
  });

  describe('auto-dismiss and pause', () => {
    it('auto-dismisses after timeoutMs', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Auto-dismiss test"
          timeout-ms="1000"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(999);
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(2);
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
    });

    it('triggers auto-dismiss when opened via open property', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Prop auto-dismiss"
          timeout-ms="1000"
          quick></md-gb-snackbar>`,
      );
      snackbar.open = true;
      await env.waitForStability();
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(1001);
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
    });

    it('does not auto-dismiss when timeoutMs is -1', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Indeterminate test"
          timeout-ms="-1"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(10000);
      await env.waitForStability();
      expect(snackbar.open).toBeTrue();
    });

    it('pauses auto-dismiss on mouseenter and resumes on mouseleave', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Pause test"
          timeout-ms="1000"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(500);

      snackbar.dispatchEvent(new MouseEvent('mouseenter'));
      jasmine.clock().tick(1000);
      expect(snackbar.open).toBeTrue();

      snackbar.dispatchEvent(new MouseEvent('mouseleave'));
      jasmine.clock().tick(1001);
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
    });

    it('resets pause state and auto-dismisses when reopened after closing while hovered', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Hover reset test"
          timeout-ms="1000"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      snackbar.dispatchEvent(new MouseEvent('mouseenter'));

      await snackbar.close();
      expect(snackbar.open).toBeFalse();

      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(1001);
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
    });

    it('closes immediately on resume if remaining time is expired', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Expired resume test"
          timeout-ms="1000"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();

      jasmine.clock().mockDate(new Date(Date.now() + 1500));
      snackbar.dispatchEvent(new MouseEvent('mouseenter'));

      let closedReason = '';
      snackbar.addEventListener('closed', (e: Event) => {
        closedReason = (e as CustomEvent<{reason: string}>).detail.reason;
      });

      snackbar.dispatchEvent(new MouseEvent('mouseleave'));
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
      expect(closedReason).toBe(CLOSE_REASONS.TIMEOUT);
    });

    it('pauses auto-dismiss if mouseenter occurs during open animation window', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Open animation pause test"
          timeout-ms="1000"></md-gb-snackbar>`,
      );
      const showPromise = snackbar.show();
      await snackbar.updateComplete;

      jasmine.clock().tick(50);
      snackbar.dispatchEvent(new MouseEvent('mouseenter'));

      jasmine.clock().tick(100);
      await showPromise;
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(1500);
      await env.waitForStability();
      expect(snackbar.open).toBeTrue();

      let closedReason = '';
      snackbar.addEventListener('closed', (e: Event) => {
        closedReason = (e as CustomEvent<{reason: string}>).detail.reason;
      });

      snackbar.quick = true;
      snackbar.dispatchEvent(new MouseEvent('mouseleave'));
      jasmine.clock().tick(1001);
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
      expect(closedReason).toBe(CLOSE_REASONS.TIMEOUT);
    });
  });

  describe('focus pause and resume', () => {
    it('pauses auto-dismiss on focusin and resumes on focusout', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Focus pause test"
          timeout-ms="1000"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(500);

      snackbar.dispatchEvent(new FocusEvent('focusin'));
      jasmine.clock().tick(1000);
      expect(snackbar.open).toBeTrue();

      snackbar.dispatchEvent(new FocusEvent('focusout'));
      jasmine.clock().tick(1001);
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
    });

    it('does not resume auto-dismiss on mouseleave while still focused', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Focus hover test"
          timeout-ms="1000"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(500);

      snackbar.dispatchEvent(new MouseEvent('mouseenter'));
      snackbar.dispatchEvent(new FocusEvent('focusin'));

      snackbar.dispatchEvent(new MouseEvent('mouseleave'));
      jasmine.clock().tick(1000);
      expect(snackbar.open).toBeTrue();

      snackbar.dispatchEvent(new FocusEvent('focusout'));
      jasmine.clock().tick(1001);
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
    });
  });

  describe('Escape key dismissal', () => {
    it('closes on Escape key press with reason "dismiss"', async () => {
      const {snackbar} = await setupTest();
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      let closedReason = '';
      snackbar.addEventListener('closed', (e: Event) => {
        closedReason = (e as CustomEvent<{reason: string}>).detail.reason;
      });

      snackbar.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );
      await env.waitForStability();

      expect(snackbar.open).toBeFalse();
      expect(closedReason).toBe(CLOSE_REASONS.DISMISS);
    });
  });

  describe('built-in action', () => {
    it('renders a button from action-label, and nothing when empty', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar
          label-text="Built-in action"
          action-label="Undo"
          quick></md-gb-snackbar>`,
      );
      const action = harness.getActionButton();
      expect(action).withContext('built-in action').not.toBeNull();
      expect(action!.textContent!.trim()).toBe('Undo');

      snackbar.actionLabel = '';
      await snackbar.updateComplete;
      expect(harness.getActionButton()).toBeNull();
    });

    it('is replaced by a slotted action', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar
          label-text="Slotted action"
          action-label="Built-in"
          quick>
          <button slot="action" id="slotted">Slotted</button>
        </md-gb-snackbar>`,
      );
      await snackbar.show();
      const slotted = snackbar.querySelector('#slotted');
      expect(harness.getActionButton()).toBe(slotted as HTMLElement);
    });

    it('closes with reason "action" when clicked', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar
          label-text="Built-in action"
          action-label="Undo"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();
      const closeSpy = jasmine.createSpy('close');
      const closedSpy = jasmine.createSpy('closed');
      snackbar.addEventListener('close', closeSpy);
      snackbar.addEventListener('closed', closedSpy);

      await harness.clickActionWithMouse();
      await env.waitForStability();

      expect(snackbar.open).toBeFalse();
      expect(closeSpy).toHaveBeenCalledTimes(1);
      expect(closedSpy).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({detail: {reason: CLOSE_REASONS.ACTION}}),
      );
    });

    it('does not render for a whitespace-only action-label', async () => {
      const {harness} = await setupTest(
        html`<md-gb-snackbar
          label-text="Whitespace"
          action-label="  "
          quick></md-gb-snackbar>`,
      );
      expect(harness.getActionButton()).toBeNull();
    });
  });

  describe('slotted action', () => {
    it('closes with reason "action" when a slotted <button slot="action"> is clicked', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar label-text="Action test" quick>
          <button slot="action" id="action-btn">Undo</button>
        </md-gb-snackbar>`,
      );
      await snackbar.show();

      let closedReason = '';
      snackbar.addEventListener('closed', (e: Event) => {
        closedReason = (e as CustomEvent<{reason: string}>).detail.reason;
      });

      await harness.clickActionWithMouse();
      await env.waitForStability();

      expect(snackbar.open).toBeFalse();
      expect(closedReason).toBe(CLOSE_REASONS.ACTION);
    });

    it('closes with reason "action" when a slotted md-gb-button host is clicked', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar label-text="gb action" quick>
          <md-gb-button slot="action">Undo</md-gb-button>
        </md-gb-snackbar>`,
      );
      await snackbar.show();
      const closedSpy = jasmine.createSpy('closed');
      snackbar.addEventListener('closed', closedSpy);

      await harness.clickActionWithMouse();
      await env.waitForStability();

      expect(snackbar.open).toBeFalse();
      expect(closedSpy).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({detail: {reason: CLOSE_REASONS.ACTION}}),
      );
    });
  });

  describe('dismiss button', () => {
    it('renders close button when hasCloseButton is true and closes on click with reason "dismiss"', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar
          label-text="Close button test"
          has-close-button
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();

      const dismissBtn = harness.getDismissButton();
      expect(dismissBtn).withContext('dismiss button').not.toBeNull();
      expect(dismissBtn?.getAttribute('aria-label')).toBe('Close');

      let closedReason = '';
      snackbar.addEventListener('closed', (e: Event) => {
        closedReason = (e as CustomEvent<{reason: string}>).detail.reason;
      });

      await harness.clickDismissWithMouse();
      await env.waitForStability();

      expect(snackbar.open).toBeFalse();
      expect(closedReason).toBe(CLOSE_REASONS.DISMISS);
    });

    it('closes with reason "dismiss" when a slotted dismiss element is clicked', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar label-text="Custom dismiss" quick>
          <button slot="dismiss" aria-label="Dismiss">x</button>
        </md-gb-snackbar>`,
      );
      await snackbar.show();
      const closedSpy = jasmine.createSpy('closed');
      snackbar.addEventListener('closed', closedSpy);

      await harness.clickDismissWithMouse();
      await env.waitForStability();

      expect(snackbar.open).toBeFalse();
      expect(closedSpy).toHaveBeenCalledOnceWith(
        jasmine.objectContaining({detail: {reason: CLOSE_REASONS.DISMISS}}),
      );
    });
  });

  describe('slots', () => {
    it('renders both labelText and default slot content', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar label-text="Label text" quick>
          <span id="custom-content">Custom slotted text</span>
        </md-gb-snackbar>`,
      );
      await snackbar.show();
      const labelEl = harness.getLabelElement();
      expect(labelEl).not.toBeNull();
      expect(labelEl!.textContent).toContain('Label text');

      const customContent = snackbar.querySelector('#custom-content');
      expect(customContent).not.toBeNull();
      expect(customContent?.textContent).toBe('Custom slotted text');

      const slot = labelEl!.querySelector('slot');
      expect(slot?.assignedNodes({flatten: true})).toContain(customContent!);
    });

    it('renders label visibly when open and has whitespace plus a slotted action child', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar label-text="Test message" quick>
          <button slot="action">Action</button>
        </md-gb-snackbar>`,
      );
      await snackbar.show();
      const labelEl = harness.getLabelElement();
      expect(labelEl).not.toBeNull();
      expect(labelEl!.innerText.trim()).toBe('Test message');
    });
  });

  describe('fixed property', () => {
    it('adds fixed class when fixed is true', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar label-text="Fixed" fixed quick></md-gb-snackbar>`,
      );
      const rootEl = snackbar.shadowRoot?.querySelector('.snackbar');
      expect(rootEl?.classList.contains(SNACKBAR_CLASSES.fixed)).toBeTrue();
    });
  });

  describe('disconnect and reconnect semantics', () => {
    it('cleans up mid-open transition on disconnect, does not leave isOpening stuck true, and restarts timeout on reconnect', async () => {
      const {snackbar, root} = await setupTest(
        html`<md-gb-snackbar
          label-text="Disconnect test"
          timeout-ms="1000"></md-gb-snackbar>`,
      );
      const closedSpy = jasmine.createSpy('closed');
      snackbar.addEventListener('closed', closedSpy);

      const showPromise = snackbar.show();
      await snackbar.updateComplete;
      jasmine.clock().tick(50);

      snackbar.remove();
      jasmine.clock().tick(100);
      await showPromise;

      jasmine.clock().tick(2000);
      expect(closedSpy).not.toHaveBeenCalled();

      snackbar.quick = true;
      root.appendChild(snackbar);
      await env.waitForStability();
      expect(snackbar.open).toBeTrue();

      jasmine.clock().tick(1001);
      await env.waitForStability();
      expect(snackbar.open).toBeFalse();
      expect(closedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          detail: {reason: CLOSE_REASONS.TIMEOUT},
        }),
      );
    });

    it('still finishes in closed state and dispatches closed event when disconnected mid-close', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar
          label-text="Disconnect mid-close test"
          quick></md-gb-snackbar>`,
      );
      await snackbar.show();
      expect(snackbar.open).toBeTrue();

      const closedSpy = jasmine.createSpy('closed');
      snackbar.addEventListener('closed', closedSpy);

      snackbar.quick = false;
      const closePromise = snackbar.close('dismiss');
      await snackbar.updateComplete;
      jasmine.clock().tick(25);

      snackbar.remove();
      jasmine.clock().tick(100);
      await closePromise;

      expect(snackbar.open).toBeFalse();
      expect(closedSpy).toHaveBeenCalledWith(
        jasmine.objectContaining({
          detail: {reason: 'dismiss'},
        }),
      );
    });
  });

  describe('harness getDismissButton', () => {
    it('returns slotted light-DOM dismiss element when present, falling back to shadow dismiss button', async () => {
      const t1 = await setupTest(
        html`<md-gb-snackbar quick>
          <button slot="dismiss" id="custom-dismiss">Custom</button>
        </md-gb-snackbar>`,
      );
      const customDismiss = t1.harness.getDismissButton();
      expect(customDismiss?.id).toBe('custom-dismiss');

      const t2 = await setupTest(
        html`<md-gb-snackbar has-close-button quick></md-gb-snackbar>`,
      );
      const shadowDismiss = t2.harness.getDismissButton();
      expect(shadowDismiss?.classList.contains('snackbar-dismiss')).toBeTrue();
    });
  });

  describe('setupSnackbar', () => {
    it('does nothing on Escape when open is false, and calls preventDefault and closes when open is true', () => {
      const el = document.createElement('div') as HTMLElement & {
        open?: boolean;
        close?: (reason?: string) => void;
      };
      setupSnackbar(el);

      el.open = false;
      let closeDispatched = false;
      el.addEventListener('close', () => {
        closeDispatched = true;
      });
      const event1 = new KeyboardEvent('keydown', {
        key: 'Escape',
        cancelable: true,
      });
      el.dispatchEvent(event1);
      expect(closeDispatched).toBeFalse();
      expect(event1.defaultPrevented).toBeFalse();

      el.open = true;
      const event2 = new KeyboardEvent('keydown', {
        key: 'Escape',
        cancelable: true,
      });
      el.dispatchEvent(event2);
      expect(closeDispatched).toBeTrue();
      expect(event2.defaultPrevented).toBeTrue();
    });
  });

  describe('attributes', () => {
    it('sets properties from the kebab-case attributes', async () => {
      const {snackbar, harness} = await setupTest(
        html`<md-gb-snackbar
          label-text="Kebab label"
          timeout-ms="1234"
          action-label="Undo"
          close-label="Dismiss"
          has-close-button
          quick></md-gb-snackbar>`,
      );
      expect(snackbar.labelText).toBe('Kebab label');
      expect(snackbar.timeoutMs).toBe(1234);
      expect(snackbar.actionLabel).toBe('Undo');
      expect(snackbar.closeLabel).toBe('Dismiss');
      expect(snackbar.hasCloseButton).toBeTrue();
      expect(harness.getLabelElement()!.textContent).toContain('Kebab label');
    });

    it('ignores the lowercase labeltext and timeoutms attributes', async () => {
      const {snackbar} = await setupTest(
        html`<md-gb-snackbar quick></md-gb-snackbar>`,
      );
      snackbar.setAttribute('labeltext', 'Old label');
      snackbar.setAttribute('timeoutms', '1234');
      await snackbar.updateComplete;
      expect(snackbar.labelText).toBe('');
      expect(snackbar.timeoutMs).toBe(5000);
    });
  });
});
