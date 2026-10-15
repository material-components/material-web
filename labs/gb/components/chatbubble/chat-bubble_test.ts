/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {Environment} from '../../../../testing/environment.js';
import {
  CHAT_BUBBLE_CLASSES,
  chatBubble,
  chatBubbleClasses,
} from './chat-bubble.js';
import {ChatBubbleElement} from './chat-bubble-element.js';
import './md-gb-chat-bubble.js';

describe('chat-bubble', () => {
  const env = new Environment();

  describe('chatBubbleClasses()', () => {
    it('returns base chat-bubble class by default', () => {
      const classes = chatBubbleClasses();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubble]).toBeTrue();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleEditing]).toBeFalse();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleExpanded]).toBeFalse();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleOverflowing]).toBeFalse();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleTransitioning]).toBeFalse();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleExpanding]).toBeFalse();
    });

    it('applies state classes when enabled', () => {
      const classes = chatBubbleClasses({
        editing: true,
        expanded: true,
        overflowing: true,
        transitioning: true,
        expanding: true,
        hover: true,
        focus: true,
      });
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubble]).toBeTrue();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleEditing]).toBeTrue();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleExpanded]).toBeTrue();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleOverflowing]).toBeTrue();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleTransitioning]).toBeTrue();
      expect(classes[CHAT_BUBBLE_CLASSES.chatBubbleExpanding]).toBeTrue();
      expect(classes[CHAT_BUBBLE_CLASSES.hover]).toBeTrue();
      expect(classes[CHAT_BUBBLE_CLASSES.focus]).toBeTrue();
    });
  });

  describe('chatBubble() directive', () => {
    it('applies classes to elements via lit directive', () => {
      const root = env.render(
        html`<div
          class="${chatBubble({editing: true, expanded: true})}"></div>`,
      );
      const el = root.firstElementChild as HTMLElement;
      expect(el.classList.contains('chat-bubble')).toBeTrue();
      expect(el.classList.contains('chat-bubble-editing')).toBeTrue();
      expect(el.classList.contains('chat-bubble-expanded')).toBeTrue();
    });
  });

  describe('<md-gb-chat-bubble>', () => {
    async function setupTest({
      text = 'Hello, world!',
      editing = false,
      expanded = false,
      showEditButton = true,
      showCopyButton = true,
    } = {}) {
      const root = env.render(html`
        <md-gb-chat-bubble
          .text="${text}"
          ?editing="${editing}"
          ?expanded="${expanded}"
          .showEditButton="${showEditButton}"
          .showCopyButton="${showCopyButton}">
        </md-gb-chat-bubble>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-chat-bubble') as ChatBubbleElement;
      return el;
    }

    it('renders text and default configuration', async () => {
      const el = await setupTest({text: 'Test message'});
      expect(el.text).toBe('Test message');
      expect(el.editing).toBeFalse();
      expect(el.expanded).toBeFalse();
      expect(el.showEditButton).toBeTrue();
      expect(el.showCopyButton).toBeTrue();

      const shadowRoot = el.shadowRoot!;
      const textEl = shadowRoot.querySelector(
        '.chat-bubble-text',
      ) as HTMLElement;
      expect(textEl).not.toBeNull();
      expect(textEl.textContent).toContain('Test message');
    });

    it('updates text via setText() with event', async () => {
      const el = await setupTest({text: 'Initial text'});
      const listener = jasmine.createSpy('listener');
      el.addEventListener('chat-bubble-updated', listener);

      el.setText('Updated text', true);
      await env.waitForStability();

      expect(el.text).toBe('Updated text');
      expect(listener).toHaveBeenCalled();
      const event = listener.calls.mostRecent().args[0] as CustomEvent<{
        text: string;
      }>;
      expect(event.detail.text).toBe('Updated text');
    });

    it('toggles expand state and emits chat-bubble-expand event', async () => {
      const el = await setupTest({text: 'Long message'});
      const listener = jasmine.createSpy('listener');
      el.addEventListener('chat-bubble-expand', listener);

      el.toggleExpand();
      await env.waitForStability();

      expect(el.expanded).toBeTrue();
      expect(listener).toHaveBeenCalled();
      const event = listener.calls.mostRecent().args[0] as CustomEvent<{
        expanded: boolean;
      }>;
      expect(event.detail.expanded).toBeTrue();

      el.toggleExpand();
      await env.waitForStability();
      expect(el.expanded).toBeFalse();
    });

    it('copies text and emits chat-bubble-copy event', async () => {
      const el = await setupTest({text: 'Copyable prompt'});
      const listener = jasmine.createSpy('listener');
      el.addEventListener('chat-bubble-copy', listener);

      await el.copyText();

      expect(listener).toHaveBeenCalled();
      const event = listener.calls.mostRecent().args[0] as CustomEvent<{
        text: string;
      }>;
      expect(event.detail.text).toBe('Copyable prompt');
    });

    it('enters edit mode on edit button click and dispatches event', async () => {
      const el = await setupTest({text: 'Editable text'});
      const listener = jasmine.createSpy('listener');
      el.addEventListener('chat-bubble-edit-state-changed', listener);

      const shadowRoot = el.shadowRoot!;
      const editBtn = shadowRoot.querySelector(
        '.chat-bubble-edit-btn',
      ) as HTMLButtonElement;
      expect(editBtn).not.toBeNull();

      editBtn.click();
      await env.waitForStability();

      expect(el.editing).toBeTrue();
      expect(listener).toHaveBeenCalled();
      const event = listener.calls.mostRecent().args[0] as CustomEvent<{
        state: string;
        editing: boolean;
      }>;
      expect(event.detail.state).toBe('entered');
      expect(event.detail.editing).toBeTrue();
    });

    it('cancels edit on cancel button click without saving', async () => {
      const el = await setupTest({text: 'Original text'});
      el.toggleEdit(true);
      await env.waitForStability();

      const shadowRoot = el.shadowRoot!;
      const textarea = shadowRoot.querySelector(
        '.chat-bubble-textarea',
      ) as HTMLTextAreaElement;
      textarea.value = 'Modified draft text';
      textarea.dispatchEvent(new Event('input'));
      await env.waitForStability();

      const cancelBtn = shadowRoot.querySelector(
        '[part="cancel-btn"]',
      ) as HTMLButtonElement;
      expect(cancelBtn).not.toBeNull();
      cancelBtn.click();
      await env.waitForStability();

      expect(el.editing).toBeFalse();
      expect(el.text).toBe('Original text');
    });

    it('saves edit on update button click and emits updated event', async () => {
      const el = await setupTest({text: 'Original text'});
      const updateListener = jasmine.createSpy('updateListener');
      const stateListener = jasmine.createSpy('stateListener');
      el.addEventListener('chat-bubble-updated', updateListener);
      el.addEventListener('chat-bubble-edit-state-changed', stateListener);

      el.toggleEdit(true);
      await env.waitForStability();

      const shadowRoot = el.shadowRoot!;
      const textarea = shadowRoot.querySelector(
        '.chat-bubble-textarea',
      ) as HTMLTextAreaElement;
      textarea.value = 'Newly updated text';
      textarea.dispatchEvent(new Event('input'));
      await env.waitForStability();

      const updateBtn = shadowRoot.querySelector(
        '[part="update-btn"]',
      ) as HTMLButtonElement;
      expect(updateBtn.disabled).toBeFalse();
      updateBtn.click();
      await env.waitForStability();

      expect(el.editing).toBeFalse();
      expect(el.text).toBe('Newly updated text');
      expect(updateListener).toHaveBeenCalled();
      const updateEvent = updateListener.calls.mostRecent()
        .args[0] as CustomEvent<{
        text: string;
      }>;
      expect(updateEvent.detail.text).toBe('Newly updated text');
      expect(stateListener).toHaveBeenCalled();
    });

    it('handles keyboard shortcuts in textarea (Enter to save, Escape to cancel)', async () => {
      const el = await setupTest({text: 'Keyboard test'});
      el.toggleEdit(true);
      await env.waitForStability();

      const shadowRoot = el.shadowRoot!;
      const textarea = shadowRoot.querySelector(
        '.chat-bubble-textarea',
      ) as HTMLTextAreaElement;

      // Escape cancels
      textarea.value = 'Modified';
      textarea.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Escape', bubbles: true}),
      );
      await env.waitForStability();
      expect(el.editing).toBeFalse();
      expect(el.text).toBe('Keyboard test');

      // Enter saves
      el.toggleEdit(true);
      await env.waitForStability();
      textarea.value = 'Saved with enter';
      textarea.dispatchEvent(new Event('input'));
      await env.waitForStability();
      textarea.dispatchEvent(
        new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}),
      );
      await env.waitForStability();
      expect(el.editing).toBeFalse();
      expect(el.text).toBe('Saved with enter');
    });

    it('hides actions when showEditButton or showCopyButton is false', async () => {
      const el = await setupTest({
        text: 'Action visibility',
        showEditButton: false,
        showCopyButton: false,
      });
      const shadowRoot = el.shadowRoot!;
      expect(shadowRoot.querySelector('.chat-bubble-edit-btn')).toBeNull();
      expect(shadowRoot.querySelector('.chat-bubble-copy-btn')).toBeNull();
    });

    it('sets setIsEditing with options', async () => {
      const el = await setupTest({text: 'Initial'});
      el.setIsEditing(true, {emitEvent: true});
      await env.waitForStability();
      expect(el.editing).toBeTrue();

      el.setIsEditing(false, {emitEvent: true, saveTextOnExit: false});
      await env.waitForStability();
      expect(el.editing).toBeFalse();
    });

    it('locks .chat-bubble width and preserves right alignment when entering edit mode via toggleEdit()', async () => {
      const root = env.render(html`
        <div style="width: 600px;">
          <md-gb-chat-bubble
            .text="${'Can you help me debug this issue in my code?'}">
          </md-gb-chat-bubble>
        </div>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-chat-bubble') as ChatBubbleElement;
      const shadowRoot = el.shadowRoot!;
      const bubbleRoot = shadowRoot.querySelector(
        '.chat-bubble',
      ) as HTMLElement;
      const readView = shadowRoot.querySelector(
        '.chat-bubble-read-view',
      ) as HTMLElement;

      const initialReadRect = readView.getBoundingClientRect();
      const initialRight = bubbleRoot.getBoundingClientRect().right;
      expect(initialReadRect.width).toBeGreaterThan(0);

      el.toggleEdit(true);
      await env.waitForStability();

      expect(el.style.width).toBe('');
      expect(bubbleRoot.style.width).toBe(`${initialReadRect.width}px`);
      expect(bubbleRoot.getBoundingClientRect().right).toBeCloseTo(
        initialRight,
        1,
      );

      el.cancelEdit();
      await env.waitForStability();
      expect(bubbleRoot.style.width).toBe('');
    });

    it('locks .chat-bubble width and preserves right alignment when entering edit mode via element.editing = true', async () => {
      const root = env.render(html`
        <div style="width: 600px;">
          <md-gb-chat-bubble
            .text="${'Can you help me debug this issue in my code?'}">
          </md-gb-chat-bubble>
        </div>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-chat-bubble') as ChatBubbleElement;
      const shadowRoot = el.shadowRoot!;
      const bubbleRoot = shadowRoot.querySelector(
        '.chat-bubble',
      ) as HTMLElement;
      const readView = shadowRoot.querySelector(
        '.chat-bubble-read-view',
      ) as HTMLElement;

      const initialReadRect = readView.getBoundingClientRect();
      const initialRight = bubbleRoot.getBoundingClientRect().right;
      expect(initialReadRect.width).toBeGreaterThan(0);

      el.editing = true;
      await env.waitForStability();

      expect(el.style.width).toBe('');
      expect(bubbleRoot.style.width).toBe(`${initialReadRect.width}px`);
      expect(bubbleRoot.getBoundingClientRect().right).toBeCloseTo(
        initialRight,
        1,
      );

      el.editing = false;
      await env.waitForStability();
      expect(bubbleRoot.style.width).toBe('');
    });

    it('retains locked .chat-bubble width after transition completes and after typing in textarea', async () => {
      const root = env.render(html`
        <div style="width: 600px;">
          <md-gb-chat-bubble
            .text="${'Can you help me debug this issue in my code?'}">
          </md-gb-chat-bubble>
        </div>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-chat-bubble') as ChatBubbleElement;
      const shadowRoot = el.shadowRoot!;
      const bubbleRoot = shadowRoot.querySelector(
        '.chat-bubble',
      ) as HTMLElement;
      const readView = shadowRoot.querySelector(
        '.chat-bubble-read-view',
      ) as HTMLElement;

      const initialReadRect = readView.getBoundingClientRect();
      expect(initialReadRect.width).toBeGreaterThan(0);

      el.toggleEdit(true);
      await env.waitForStability();
      expect(bubbleRoot.style.width).toBe(`${initialReadRect.width}px`);

      // Trigger transitionend on textarea container so this.transitioning becomes false and triggers a Lit re-render
      const textareaContainer = shadowRoot.querySelector(
        '.chat-bubble-textarea-container',
      ) as HTMLElement;
      textareaContainer.dispatchEvent(
        new TransitionEvent('transitionend', {propertyName: 'transform'}),
      );
      await env.waitForStability();

      expect(
        bubbleRoot.classList.contains('chat-bubble-transitioning'),
      ).toBeFalse();
      expect(bubbleRoot.style.width).toBe(`${initialReadRect.width}px`);

      // Type into the textarea to trigger another Lit re-render via this.currentEditText
      const textarea = shadowRoot.querySelector(
        '.chat-bubble-textarea',
      ) as HTMLTextAreaElement;
      textarea.value = 'Can you help me debug this issue in my code? Updated!';
      textarea.dispatchEvent(new Event('input'));
      await env.waitForStability();

      expect(bubbleRoot.style.width).toBe(`${initialReadRect.width}px`);
    });

    it('locks .chat-bubble width to read-view width even when initialized with editing = true and does not jump when exiting edit mode', async () => {
      const root = env.render(html`
        <div style="width: 600px;">
          <md-gb-chat-bubble
            .text="${'Drafting a revised prompt with inline editing support'}"
            ?editing="${true}">
          </md-gb-chat-bubble>
        </div>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-chat-bubble') as ChatBubbleElement;
      const shadowRoot = el.shadowRoot!;
      const bubbleRoot = shadowRoot.querySelector(
        '.chat-bubble',
      ) as HTMLElement;

      const editingRect = bubbleRoot.getBoundingClientRect();
      expect(editingRect.width).toBeGreaterThan(0);
      expect(editingRect.width).toBeLessThan(600);

      el.cancelEdit();
      await env.waitForStability();

      const readRect = bubbleRoot.getBoundingClientRect();
      expect(readRect.width).toBeCloseTo(editingRect.width, 1);
      expect(readRect.right).toBeCloseTo(editingRect.right, 1);
    });

    it('does not jump in width when entering edit mode on a short prompt narrower than 280px', async () => {
      const root = env.render(html`
        <div style="width: 600px;">
          <md-gb-chat-bubble .text="${'Hello'}"></md-gb-chat-bubble>
        </div>
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-chat-bubble') as ChatBubbleElement;
      const shadowRoot = el.shadowRoot!;
      const bubbleRoot = shadowRoot.querySelector(
        '.chat-bubble',
      ) as HTMLElement;

      const readRect = bubbleRoot.getBoundingClientRect();
      expect(readRect.width).toBeGreaterThan(0);
      expect(readRect.width).toBeLessThan(280);

      el.toggleEdit(true);
      await env.waitForStability();

      const editingRect = bubbleRoot.getBoundingClientRect();
      expect(editingRect.width).toBeCloseTo(readRect.width, 1);
      expect(editingRect.right).toBeCloseTo(readRect.right, 1);
    });

    it('renders slotted content and updates when slotted text changes dynamically', async () => {
      const root = env.render(html`
        <md-gb-chat-bubble
          ><span id="slot-child">Initial slotted text</span></md-gb-chat-bubble
        >
      `);
      await env.waitForStability();
      const el = root.querySelector('md-gb-chat-bubble') as ChatBubbleElement;
      const slotChild = root.querySelector('#slot-child') as HTMLElement;
      const shadowRoot = el.shadowRoot!;
      const slotEl = shadowRoot.querySelector('slot') as HTMLSlotElement;

      expect(slotEl).not.toBeNull();
      expect(slotEl.hidden).toBeFalse();

      const copyListener = jasmine.createSpy('copyListener');
      el.addEventListener('chat-bubble-copy', copyListener);
      await el.copyText();
      expect(
        (copyListener.calls.mostRecent().args[0] as CustomEvent<{text: string}>)
          .detail.text,
      ).toBe('Initial slotted text');

      slotChild.textContent = 'Dynamically updated slotted text';
      slotEl.dispatchEvent(new Event('slotchange'));
      await env.waitForStability();

      expect(el.text).toBe('');
      await el.copyText();
      expect(
        (copyListener.calls.mostRecent().args[0] as CustomEvent<{text: string}>)
          .detail.text,
      ).toBe('Dynamically updated slotted text');
    });

    it('announces chatBubbleUpdatedAnnouncement in live region when saving edit', async () => {
      const el = await setupTest({text: 'Original prompt'});
      el.chatBubbleUpdatedAnnouncement = 'Prompt saved';
      el.toggleEdit(true);
      await env.waitForStability();

      const shadowRoot = el.shadowRoot!;
      const liveRegion = shadowRoot.querySelector(
        '[part="live-region"]',
      ) as HTMLElement;
      expect(liveRegion).not.toBeNull();
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
      expect(liveRegion.textContent?.trim()).toBe('');

      const textarea = shadowRoot.querySelector(
        '.chat-bubble-textarea',
      ) as HTMLTextAreaElement;
      textarea.value = 'Updated prompt';
      textarea.dispatchEvent(new Event('input'));
      await env.waitForStability();

      el.saveEdit();
      await env.waitForStability();

      expect(liveRegion.textContent?.trim()).toBe('Prompt saved');
    });

    it('saves valid text and rejects whitespace-only text in setIsEditing(false, {saveTextOnExit: true})', async () => {
      const el = await setupTest({text: 'Initial prompt'});
      el.setIsEditing(true);
      await env.waitForStability();

      const shadowRoot = el.shadowRoot!;
      const textarea = shadowRoot.querySelector(
        '.chat-bubble-textarea',
      ) as HTMLTextAreaElement;

      // Whitespace-only text should be rejected and revert to 'Initial prompt'
      textarea.value = '   ';
      textarea.dispatchEvent(new Event('input'));
      await env.waitForStability();

      el.setIsEditing(false, {saveTextOnExit: true});
      await env.waitForStability();
      expect(el.editing).toBeFalse();
      expect(el.text).toBe('Initial prompt');

      // Valid text should be saved on exit
      el.setIsEditing(true);
      await env.waitForStability();
      textarea.value = 'Valid saved prompt';
      textarea.dispatchEvent(new Event('input'));
      await env.waitForStability();

      el.setIsEditing(false, {saveTextOnExit: true});
      await env.waitForStability();
      expect(el.editing).toBeFalse();
      expect(el.text).toBe('Valid saved prompt');
    });

    it('does not trigger saveEdit on Shift+Enter in textarea', async () => {
      const el = await setupTest({text: 'Multiline prompt'});
      el.toggleEdit(true);
      await env.waitForStability();

      const shadowRoot = el.shadowRoot!;
      const textarea = shadowRoot.querySelector(
        '.chat-bubble-textarea',
      ) as HTMLTextAreaElement;
      textarea.value = 'Line 1\nLine 2';
      textarea.dispatchEvent(new Event('input'));
      await env.waitForStability();

      const shiftEnterEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        shiftKey: true,
        bubbles: true,
        cancelable: true,
      });
      textarea.dispatchEvent(shiftEnterEvent);
      await env.waitForStability();

      expect(shiftEnterEvent.defaultPrevented).toBeFalse();
      expect(el.editing).toBeTrue();
      expect(el.text).toBe('Multiline prompt');
    });
  });
});
