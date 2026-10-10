/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  CSSResultOrNative,
  html,
  LitElement,
  nothing,
  PropertyValues,
} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {ARIAMixinStrict} from '../../../../internal/aria/aria.js';
import {mixinDelegatesAria} from '../../../../internal/aria/delegate.js';
import {button} from '../button/button.js';

import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import buttonStyles from '../button/button.css' with {type: 'css'}; // github-only
// import buttonStyles from '../button/button.cssresult.js'; // google3-only
import chatBubbleStyles from './chat-bubble.css' with {type: 'css'}; // github-only
// import chatBubbleStyles from './chat-bubble.cssresult.js'; // google3-only

import '../../styles/icon/md-gb-icon.js';
import {chatBubble} from './chat-bubble.js';

// Separate variable needed for closure.
const baseClass = mixinDelegatesAria(LitElement);

/**
 * Options for programmatic edit state transitions.
 */
export interface EditStateOptions {
  emitEvent?: boolean;
  saveTextOnExit?: boolean;
}

/**
 * A Material Design chat bubble component (`md-gb-chat-bubble`).
 *
 * Touch interaction support:
 * On touch / coarse pointer devices (detected via `@media (hover: none)`), the
 * action toolbar buttons (copy, edit) remain persistently visible rather than
 * relying on hover reveal, and the hover hit-area bridge is suppressed to
 * prevent accidental touch blocking.
 *
 * @slot - Used to display the chat bubble text.
 * @fires {CustomEvent<{text: string}>} chat-bubble-updated - Fired when bubble text is updated. --bubbles --composed
 * @fires {CustomEvent<{state: 'entered' | 'exited'; editing: boolean}>} chat-bubble-edit-state-changed - Fired when editing state changes. --bubbles --composed
 * @fires {CustomEvent<{text: string}>} chat-bubble-copy - Fired when bubble text is copied. --bubbles --composed
 * @fires {CustomEvent<{expanded: boolean}>} chat-bubble-expand - Fired when bubble is expanded/collapsed. --bubbles --composed
 * @csspart chat-bubble - The chat bubble's root element.
 * @csspart read-view - The read-only view container.
 * @csspart block-internal - The internal bubble text block.
 * @csspart text - The text element container.
 * @csspart expand-icon - The container wrapping the expand button.
 * @csspart expand-btn - The button to toggle expansion.
 * @csspart actions - The action toolbar container.
 * @csspart copy-btn - The copy action button.
 * @csspart edit-btn - The edit action button.
 * @csspart edit-view - The inline editing view container.
 * @csspart edit-box - The edit box wrapping the textarea block.
 * @csspart block - The textarea wrapper.
 * @csspart textarea-container - The styled border container for the textarea.
 * @csspart textarea - The textarea input element.
 * @csspart edit-actions - The action buttons in edit mode (Cancel, Update).
 * @csspart cancel-btn - The cancel button.
 * @csspart update-btn - The update/save button.
 * @csspart live-region - The visually-hidden live announcement region.
 * @cssprop --actions-width
 * @cssprop --actions-width-compact
 * @cssprop --container-color
 * @cssprop --container-shape
 * @cssprop --container-shape-top-leading
 * @cssprop --container-shape-top-trailing
 * @cssprop --container-shape-bottom-leading
 * @cssprop --container-shape-bottom-trailing
 * @cssprop --editing-actions-gap
 * @cssprop --editing-caret-color
 * @cssprop --editing-container-color
 * @cssprop --editing-max-height
 * @cssprop --editing-motion-duration
 * @cssprop --editing-motion-easing
 * @cssprop --editing-outline-color
 * @cssprop --editing-shape
 * @cssprop --editing-text-color
 * @cssprop --expand-button-color
 * @cssprop --expand-button-icon-color
 * @cssprop --max-width
 * @cssprop --padding-bottom
 * @cssprop --padding-leading
 * @cssprop --padding-top
 * @cssprop --padding-trailing
 * @cssprop --text-color
 * @cssprop --text-font
 * @cssprop --text-font-axes
 * @cssprop --text-font-compact
 * @cssprop --text-line-height
 * @cssprop --text-line-height-compact
 * @cssprop --text-tracking
 * @cssprop --text-tracking-compact
 */
export class ChatBubbleElement extends baseClass {
  /** @nocollapse */
  static override shadowRootOptions: ShadowRootInit = {
    mode: 'open',
  };

  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    buttonStyles,
    chatBubbleStyles,
    css`
      :host {
        display: block;
        width: 100%;
      }
    `,
  ];

  /** The text displayed in the chat bubble. */
  @property({type: String}) text = '';

  /** Whether the chat bubble is in edit mode. */
  @property({type: Boolean, reflect: true}) editing = false;

  /** Whether the chat bubble is expanded to show all text. */
  @property({type: Boolean, reflect: true}) expanded = false;

  /** Whether to show the edit button in the action toolbar. */
  @property({type: Boolean, attribute: 'show-edit-button'}) showEditButton =
    true;

  /** Whether to show the copy button in the action toolbar. */
  @property({type: Boolean, attribute: 'show-copy-button'}) showCopyButton =
    true;

  /** Screen reader announcement message when chat bubble is updated. */
  @property({type: String, attribute: 'chat-bubble-updated-announcement'})
  chatBubbleUpdatedAnnouncement = 'Chat bubble updated';

  /** Accessible label for the expand button when collapsed. */
  @property({type: String, attribute: 'expand-button-aria-label'})
  expandButtonAriaLabel = 'Expand chat bubble text';

  /** Accessible label for the expand button when expanded. */
  @property({type: String, attribute: 'collapse-button-aria-label'})
  collapseButtonAriaLabel = 'Collapse chat bubble text';

  /** Tooltip title for the expand button when collapsed. */
  @property({type: String, attribute: 'expand-button-title'})
  expandButtonTitle = 'Expand text';

  /** Tooltip title for the expand button when expanded. */
  @property({type: String, attribute: 'collapse-button-title'})
  collapseButtonTitle = 'Collapse text';

  /** Accessible label and tooltip for the copy button. */
  @property({type: String, attribute: 'copy-button-aria-label'})
  copyButtonAriaLabel = 'Copy prompt';

  /** Accessible label and tooltip for the edit button. */
  @property({type: String, attribute: 'edit-button-aria-label'})
  editButtonAriaLabel = 'Edit prompt';

  /** Accessible label for the edit mode textarea. */
  @property({type: String, attribute: 'edit-textarea-aria-label'})
  editTextareaAriaLabel = 'Edit chat bubble';

  /** Visible label for the cancel button in edit mode. */
  @property({type: String, attribute: 'cancel-button-label'})
  cancelButtonLabel = 'Cancel';

  /** Visible label for the update/save button in edit mode. */
  @property({type: String, attribute: 'update-button-label'})
  updateButtonLabel = 'Update';

  @state() private overflowing = false;
  @state() private transitioning = false;
  @state() private expanding = false;
  @state() private currentEditText = '';
  @state() private isSaveDisabled = true;
  @state() private slottedText = '';
  @state() private liveAnnouncement = '';

  @query('.chat-bubble') private readonly rootEl?: HTMLElement;
  @query('.chat-bubble-text') private readonly textEl?: HTMLElement;
  @query('.chat-bubble-read-view') private readonly readViewEl?: HTMLElement;
  @query('.chat-bubble-textarea-container')
  private readonly textareaContainerEl?: HTMLElement;
  @query('.chat-bubble-textarea')
  private readonly textareaEl?: HTMLTextAreaElement;
  @query('.chat-bubble-copy-btn') private readonly copyBtnEl?: HTMLElement;
  @query('.chat-bubble-edit-btn') private readonly editBtnEl?: HTMLElement;

  private resizeObserver?: ResizeObserver;
  private initialEditText = '';
  private lastReadRect?: DOMRect;
  private editTransitionCleanup?: () => void;
  private expandTransitionCleanup?: () => void;
  private announcementTimerId?: ReturnType<typeof setTimeout>;

  private get effectiveText(): string {
    return this.text || this.slottedText;
  }

  override focus(options?: FocusOptions): void {
    if (this.editing) {
      this.textareaEl?.focus(options);
    } else {
      (this.editBtnEl ?? this.copyBtnEl)?.focus(options);
    }
  }

  override connectedCallback() {
    super.connectedCallback();
    this.setupOverflowObserver();
    if (this.hasUpdated) {
      if (this.textEl) {
        this.resizeObserver?.observe(this.textEl);
      }
      if (this.readViewEl) {
        this.resizeObserver?.observe(this.readViewEl);
      }
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.resizeObserver?.disconnect();
    this.editTransitionCleanup?.();
    this.editTransitionCleanup = undefined;
    this.expandTransitionCleanup?.();
    this.expandTransitionCleanup = undefined;
    if (this.announcementTimerId !== undefined) {
      clearTimeout(this.announcementTimerId);
      this.announcementTimerId = undefined;
    }
  }

  private setupOverflowObserver() {
    if (typeof ResizeObserver === 'undefined') return;
    this.resizeObserver = new ResizeObserver(() => {
      this.checkOverflow();
      if (!this.editing && this.readViewEl) {
        const rect = this.readViewEl.getBoundingClientRect();
        if (rect.width > 0) {
          this.lastReadRect = rect;
        }
      }
    });
  }

  private measureReadViewRect(): DOMRect | undefined {
    if (!this.readViewEl || !this.rootEl) return undefined;
    if (!this.editing) {
      const rect = this.readViewEl.getBoundingClientRect();
      if (rect.width > 0) {
        this.lastReadRect = rect;
      }
      return this.lastReadRect;
    }
    const prevRootWidth = this.rootEl.style.width;
    this.rootEl.style.width = '100%';
    this.readViewEl.style.position = 'absolute';
    this.readViewEl.style.visibility = 'hidden';
    this.readViewEl.style.display = 'flex';
    this.readViewEl.style.width = 'fit-content';
    const rect = this.readViewEl.getBoundingClientRect();
    this.readViewEl.style.position = '';
    this.readViewEl.style.visibility = '';
    this.readViewEl.style.display = '';
    this.readViewEl.style.width = '';
    this.rootEl.style.width = prevRootWidth;
    if (rect.width > 0) {
      this.lastReadRect = rect;
    }
    return this.lastReadRect;
  }

  protected override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    if (this.textEl) {
      this.resizeObserver?.observe(this.textEl);
    }
    if (this.readViewEl) {
      this.resizeObserver?.observe(this.readViewEl);
      this.measureReadViewRect();
    }
    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!this.isConnected) return;
        this.checkOverflow();
        this.measureReadViewRect();
        if (
          this.editing &&
          this.rootEl &&
          this.lastReadRect &&
          this.lastReadRect.width > 0
        ) {
          this.rootEl.style.width = `${this.lastReadRect.width}px`;
        }
      });
    }
    this.checkOverflow();
  }

  protected override willUpdate(changedProperties: PropertyValues) {
    super.willUpdate(changedProperties);
    if (changedProperties.has('editing')) {
      if (this.editing && !changedProperties.get('editing')) {
        this.transitioning = true;
        const rect = this.readViewEl?.getBoundingClientRect();
        if (rect && rect.width > 0) {
          this.lastReadRect = rect;
        }
      } else if (!this.editing) {
        this.transitioning = false;
      }
    }
  }

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('text')) {
      this.checkOverflow();
      if (!this.editing) {
        this.currentEditText = this.effectiveText;
      }
      this.measureReadViewRect();
      if (
        this.editing &&
        this.rootEl &&
        this.lastReadRect &&
        this.lastReadRect.width > 0
      ) {
        this.rootEl.style.width = `${this.lastReadRect.width}px`;
      }
    }
    if (changedProperties.has('editing')) {
      if (this.editing) {
        if (!this.lastReadRect || this.lastReadRect.width === 0) {
          this.measureReadViewRect();
        }
        const initialText = this.effectiveText;
        this.currentEditText = initialText;
        this.initialEditText = initialText;
        this.isSaveDisabled = true;
        this.applyEditModeLayout();
      } else {
        this.editTransitionCleanup?.();
        this.editTransitionCleanup = undefined;
        if (this.rootEl) {
          this.rootEl.style.width = '';
        }
        this.style.width = '';
      }
    }
  }

  private adjustTextareaHeight() {
    if (!this.textareaEl) return;
    this.textareaEl.style.height = 'auto';
    if (this.textareaEl.scrollHeight > 0) {
      this.textareaEl.style.height = `${this.textareaEl.scrollHeight}px`;
    }
  }

  private applyEditModeLayout() {
    this.editTransitionCleanup?.();
    this.editTransitionCleanup = undefined;

    const readRect = this.lastReadRect;
    const initialWidth = readRect?.width;
    const initialHeight = readRect?.height;
    const initialY = readRect?.y;

    if (this.rootEl && initialWidth && initialWidth > 0) {
      this.rootEl.style.width = `${initialWidth}px`;
    }

    void this.focusTextarea();

    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (
      !prefersReducedMotion &&
      this.textareaContainerEl &&
      initialHeight &&
      initialY !== undefined
    ) {
      const containerEl = this.textareaContainerEl;
      this.adjustTextareaHeight();
      const containerRect = containerEl.getBoundingClientRect();
      const yOffset = initialY - containerRect.y;

      containerEl.style.transition = 'none';
      containerEl.style.transform = `translateY(${yOffset}px)`;
      containerEl.style.height = `${initialHeight}px`;

      // Force reflow
      containerEl.getBoundingClientRect();

      containerEl.style.transition = '';
      containerEl.style.transform = 'none';
      containerEl.style.height = `${containerRect.height}px`;

      let ended = false;
      let timerId: ReturnType<typeof setTimeout> | undefined;
      const onEnd = (e?: Event) => {
        if (ended) return;
        if (e instanceof TransitionEvent && e.propertyName !== 'transform') {
          return;
        }
        if (e && e.target && e.target !== containerEl) {
          return;
        }
        ended = true;
        containerEl.removeEventListener('transitionend', onEnd);
        if (timerId !== undefined) {
          clearTimeout(timerId);
          timerId = undefined;
        }
        this.editTransitionCleanup = undefined;
        this.transitioning = false;
        containerEl.style.height = '';
      };
      this.editTransitionCleanup = () => {
        ended = true;
        containerEl.removeEventListener('transitionend', onEnd);
        if (timerId !== undefined) {
          clearTimeout(timerId);
          timerId = undefined;
        }
        this.transitioning = false;
        containerEl.style.transition = '';
        containerEl.style.transform = '';
        containerEl.style.height = '';
      };
      containerEl.addEventListener('transitionend', onEnd);
      timerId = setTimeout(onEnd, 350);
    } else {
      this.transitioning = false;
    }
  }

  private checkOverflow() {
    if (!this.textEl) return;
    const isOverflowing =
      this.textEl.scrollHeight > this.textEl.clientHeight || this.expanded;
    if (this.overflowing !== isOverflowing) {
      this.overflowing = isOverflowing;
    }
  }

  /**
   * Sets the bubble text programmatically.
   *
   * @param text The new text content.
   * @param emitEvent Whether to emit the `chat-bubble-updated` event.
   */
  setText(text: string, emitEvent = false): void {
    this.text = text;
    this.currentEditText = text;
    if (emitEvent) {
      this.dispatchEvent(
        new CustomEvent('chat-bubble-updated', {
          detail: {text},
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  /**
   * Sets the editing state programmatically.
   *
   * @param isEditing Whether the bubble should be in edit mode.
   * @param options Additional options for controlling events and save behavior on exit.
   */
  setIsEditing(
    isEditing: boolean,
    {emitEvent = false, saveTextOnExit = false}: EditStateOptions = {},
  ): void {
    if (this.editing === isEditing) return;

    if (isEditing) {
      this.toggleEditInternal(true, emitEvent);
    } else {
      if (
        saveTextOnExit &&
        this.currentEditText !== this.effectiveText &&
        this.currentEditText.trim() !== ''
      ) {
        this.saveEditInternal(emitEvent);
      } else {
        this.cancelEditInternal(emitEvent);
      }
    }
  }

  /**
   * Toggles edit mode.
   *
   * @param willBeEditing Optional explicit target edit state.
   */
  toggleEdit(willBeEditing = !this.editing): void {
    this.toggleEditInternal(willBeEditing, true);
  }

  private async toggleEditInternal(
    willBeEditing: boolean,
    emitEvent: boolean,
  ): Promise<void> {
    if (willBeEditing) {
      const readRect = this.readViewEl?.getBoundingClientRect();
      if (readRect && readRect.width > 0) {
        this.lastReadRect = readRect;
      }

      const initialText = this.effectiveText;
      this.editing = true;
      this.currentEditText = initialText;
      this.initialEditText = initialText;
      this.isSaveDisabled = true;
      this.transitioning = true;

      if (this.rootEl && this.lastReadRect && this.lastReadRect.width > 0) {
        this.rootEl.style.width = `${this.lastReadRect.width}px`;
      }

      await this.updateComplete;

      if (emitEvent) {
        this.dispatchEvent(
          new CustomEvent('chat-bubble-edit-state-changed', {
            detail: {state: 'entered', editing: true},
            bubbles: true,
            composed: true,
          }),
        );
      }
    } else {
      const hadFocus =
        this.matches(':focus-within') ||
        Boolean(this.shadowRoot?.activeElement);
      this.editTransitionCleanup?.();
      this.editTransitionCleanup = undefined;
      this.currentEditText = this.effectiveText;
      this.editing = false;
      this.transitioning = false;
      if (this.rootEl) {
        this.rootEl.style.width = '';
      }
      this.style.width = '';
      if (emitEvent) {
        this.dispatchEvent(
          new CustomEvent('chat-bubble-edit-state-changed', {
            detail: {state: 'exited', editing: false},
            bubbles: true,
            composed: true,
          }),
        );
      }
      if (hadFocus) {
        this.restoreFocus();
      }
    }
  }

  private async focusTextarea() {
    await this.updateComplete;
    if (this.textareaEl) {
      this.adjustTextareaHeight();
      this.textareaEl.focus();
      const len = this.textareaEl.value.length;
      this.textareaEl.selectionStart = len;
      this.textareaEl.selectionEnd = len;
    }
  }

  /**
   * Toggles the expanded/collapsed state for long overflowing text.
   */
  toggleExpand(): void {
    this.expandTransitionCleanup?.();
    this.expandTransitionCleanup = undefined;

    const willBeExpanded = !this.expanded;
    const textEl = this.textEl;
    const rootEl = this.rootEl;

    if (!textEl || !rootEl || typeof window === 'undefined') {
      this.expanded = willBeExpanded;
      this.expanding = false;
      this.dispatchEvent(
        new CustomEvent('chat-bubble-expand', {
          detail: {expanded: this.expanded},
          bubbles: true,
          composed: true,
        }),
      );
      return;
    }

    const computedStyle = window.getComputedStyle(textEl);
    const lineHeight = Number(computedStyle.lineHeight.replace('px', '')) || 24;
    let collapsedHeight = lineHeight * 5;

    const wasExpanded = !willBeExpanded;
    if (wasExpanded) {
      rootEl.classList.remove('chat-bubble-expanded');
    }
    const maxHeightValue = Number(
      window
        .getComputedStyle(textEl)
        .getPropertyValue('max-height')
        .replace('px', ''),
    );
    if (maxHeightValue && !isNaN(maxHeightValue)) {
      collapsedHeight = maxHeightValue;
    }
    if (wasExpanded) {
      rootEl.classList.add('chat-bubble-expanded');
    }

    const initialHeight = textEl.clientHeight;
    if (willBeExpanded) {
      rootEl.classList.add('chat-bubble-expanded');
    }
    textEl.style.display = 'block';
    const expandedHeight = textEl.scrollHeight;
    const targetHeight = willBeExpanded ? expandedHeight : collapsedHeight;

    const prefersReducedMotion =
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (!prefersReducedMotion && initialHeight !== targetHeight) {
      this.expanded = willBeExpanded;
      this.expanding = true;

      textEl.style.transition = 'none';
      textEl.style.maxHeight = `${initialHeight}px`;

      // Force reflow
      textEl.getBoundingClientRect();

      rootEl.classList.add('chat-bubble-expanding');
      textEl.style.transition = '';
      textEl.style.maxHeight = `${targetHeight}px`;

      let ended = false;
      let timerId: ReturnType<typeof setTimeout> | undefined;
      const onEnd = (e?: Event) => {
        if (ended) return;
        if (e instanceof TransitionEvent && e.propertyName !== 'max-height') {
          return;
        }
        if (e && e.target && e.target !== textEl) {
          return;
        }
        ended = true;
        textEl.removeEventListener('transitionend', onEnd);
        if (timerId !== undefined) {
          clearTimeout(timerId);
          timerId = undefined;
        }
        this.expandTransitionCleanup = undefined;
        if (!willBeExpanded) {
          textEl.style.display = '';
        }
        textEl.style.maxHeight = '';
        this.expanding = false;
        this.checkOverflow();
      };
      this.expandTransitionCleanup = () => {
        ended = true;
        textEl.removeEventListener('transitionend', onEnd);
        if (timerId !== undefined) {
          clearTimeout(timerId);
          timerId = undefined;
        }
        textEl.style.transition = '';
        textEl.style.display = '';
        textEl.style.maxHeight = '';
        this.expanding = false;
      };
      textEl.addEventListener('transitionend', onEnd);
      timerId = setTimeout(onEnd, 350);
    } else {
      if (!willBeExpanded) {
        textEl.style.display = '';
      }
      textEl.style.maxHeight = '';
      this.expanded = willBeExpanded;
      this.expanding = false;
      this.checkOverflow();
    }

    this.dispatchEvent(
      new CustomEvent('chat-bubble-expand', {
        detail: {expanded: this.expanded},
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Copies the chat bubble text to the clipboard.
   */
  async copyText(): Promise<void> {
    const textToCopy = this.effectiveText;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(textToCopy);
      } catch {
        // Fallback or ignore clipboard permission errors in test environments
      }
    }

    this.dispatchEvent(
      new CustomEvent('chat-bubble-copy', {
        detail: {text: textToCopy},
        bubbles: true,
        composed: true,
      }),
    );
  }

  /**
   * Saves the current text from the textarea and exits edit mode.
   */
  saveEdit(): void {
    this.saveEditInternal(true);
  }

  private saveEditInternal(emitEvent: boolean): void {
    const hadFocus =
      this.matches(':focus-within') || Boolean(this.shadowRoot?.activeElement);
    this.editTransitionCleanup?.();
    this.editTransitionCleanup = undefined;

    const newText = this.currentEditText;
    this.text = newText;
    this.editing = false;
    this.transitioning = false;
    if (this.rootEl) {
      this.rootEl.style.width = '';
    }
    this.style.width = '';

    if (this.announcementTimerId !== undefined) {
      clearTimeout(this.announcementTimerId);
    }
    this.liveAnnouncement = this.chatBubbleUpdatedAnnouncement;
    this.announcementTimerId = setTimeout(() => {
      this.liveAnnouncement = '';
      this.announcementTimerId = undefined;
    }, 3000);

    if (emitEvent) {
      this.dispatchEvent(
        new CustomEvent('chat-bubble-updated', {
          detail: {text: newText},
          bubbles: true,
          composed: true,
        }),
      );
      this.dispatchEvent(
        new CustomEvent('chat-bubble-edit-state-changed', {
          detail: {state: 'exited', editing: false},
          bubbles: true,
          composed: true,
        }),
      );
    }
    if (hadFocus) {
      this.restoreFocus();
    }
  }

  /**
   * Cancels editing without saving and exits edit mode.
   */
  cancelEdit(): void {
    this.cancelEditInternal(true);
  }

  private cancelEditInternal(emitEvent: boolean): void {
    const hadFocus =
      this.matches(':focus-within') || Boolean(this.shadowRoot?.activeElement);
    this.editTransitionCleanup?.();
    this.editTransitionCleanup = undefined;

    this.currentEditText = this.effectiveText;
    this.editing = false;
    this.transitioning = false;
    if (this.rootEl) {
      this.rootEl.style.width = '';
    }
    this.style.width = '';

    if (emitEvent) {
      this.dispatchEvent(
        new CustomEvent('chat-bubble-edit-state-changed', {
          detail: {state: 'exited', editing: false},
          bubbles: true,
          composed: true,
        }),
      );
    }
    if (hadFocus) {
      this.restoreFocus();
    }
  }

  private restoreFocus(): void {
    this.updateComplete.then(() => {
      this.editBtnEl?.focus();
    });
  }

  private handleTextareaInput(e: Event) {
    const target = e.target as HTMLTextAreaElement;
    this.currentEditText = target.value;
    this.adjustTextareaHeight();
    this.isSaveDisabled =
      this.currentEditText === this.initialEditText ||
      this.currentEditText.trim() === '';
  }

  private handleTextareaKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (!this.isSaveDisabled) {
        e.preventDefault();
        this.saveEdit();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      this.cancelEdit();
    }
  }

  private handleSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const nodes = slot.assignedNodes({flatten: true});
    const textContent = nodes
      .map((node) => node.textContent || '')
      .join('')
      .trim();
    this.slottedText = textContent;
    if (!this.editing) {
      this.currentEditText = this.effectiveText;
    }
    this.checkOverflow();
    this.measureReadViewRect();
  }

  protected override render() {
    const {ariaLabel} = this as ARIAMixinStrict;
    const actionsWidth =
      this.showCopyButton && this.showEditButton
        ? 100
        : this.showCopyButton || this.showEditButton
          ? 48
          : 0;
    const actionsWidthCompact =
      this.showCopyButton || this.showEditButton ? 48 : 0;

    const displayText = this.effectiveText;
    const resolvedAriaLabel =
      ariaLabel ||
      (displayText ? `${displayText} - Chat Bubble` : 'Chat Bubble');

    const classes = chatBubble({
      editing: this.editing,
      expanded: this.expanded,
      overflowing: this.overflowing,
      transitioning: this.transitioning,
      expanding: this.expanding,
    });

    const editingWidthStyle =
      this.editing && this.lastReadRect && this.lastReadRect.width > 0
        ? `width: ${this.lastReadRect.width}px;`
        : '';

    return html`
      <div
        part="chat-bubble"
        class="${classes}"
        style="--gm3-chat-bubble-actions-width: ${actionsWidth}px; --gm3-chat-bubble-actions-width-compact: ${actionsWidthCompact}px; ${editingWidthStyle}"
        role="group"
        aria-label="${resolvedAriaLabel}">
        <div
          part="live-region"
          class="chat-bubble-sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
          >${this.liveAnnouncement}</div
        >
        <!-- Read View -->
        <div part="read-view" class="chat-bubble-read-view">
          <div part="block-internal" class="chat-bubble-block-internal">
            <!-- Expand Button -->
            <div part="expand-icon" class="chat-bubble-expand-icon">
              <button
                type="button"
                part="expand-btn"
                class="chat-bubble-expand-btn"
                aria-label="${this.expanded
                  ? this.collapseButtonAriaLabel
                  : this.expandButtonAriaLabel}"
                aria-expanded="${this.expanded ? 'true' : 'false'}"
                title="${this.expanded
                  ? this.collapseButtonTitle
                  : this.expandButtonTitle}"
                @click="${this.toggleExpand}">
                <md-gb-icon class="chat-bubble-expand-arrow"
                  >keyboard_arrow_down</md-gb-icon
                >
              </button>
            </div>

            <!-- Text -->
            <div part="text" class="chat-bubble-text"
              >${this.text}<slot
                ?hidden="${Boolean(this.text)}"
                @slotchange="${this.handleSlotChange}"></slot
            ></div>
          </div>

          <!-- Actions -->
          <div part="actions" class="chat-bubble-actions">
            ${this.showCopyButton
              ? html`<button
                  type="button"
                  part="copy-btn"
                  class="chat-bubble-action-btn chat-bubble-copy-btn"
                  aria-label="${this.copyButtonAriaLabel}"
                  title="${this.copyButtonAriaLabel}"
                  @click="${this.copyText}">
                  <md-gb-icon>content_copy</md-gb-icon>
                </button>`
              : nothing}
            ${this.showEditButton
              ? html`<button
                  type="button"
                  part="edit-btn"
                  class="chat-bubble-action-btn chat-bubble-edit-btn"
                  aria-label="${this.editButtonAriaLabel}"
                  title="${this.editButtonAriaLabel}"
                  @click="${() => {
                    this.toggleEdit(true);
                  }}">
                  <md-gb-icon>edit</md-gb-icon>
                </button>`
              : nothing}
          </div>
        </div>

        <!-- Edit View -->
        <div part="edit-view" class="chat-bubble-edit-view">
          <div part="edit-box" class="chat-bubble-edit-box">
            <div part="block" class="chat-bubble-block">
              <div
                part="textarea-container"
                class="chat-bubble-textarea-container">
                <textarea
                  part="textarea"
                  class="chat-bubble-textarea"
                  rows="1"
                  aria-label="${this.editTextareaAriaLabel}"
                  .value="${this.currentEditText}"
                  @input="${this.handleTextareaInput}"
                  @keydown="${this.handleTextareaKeydown}"></textarea>
              </div>
            </div>
          </div>
          <div part="edit-actions" class="chat-bubble-edit-actions">
            <button
              type="button"
              part="cancel-btn"
              class="${button({color: 'text'})}"
              @click="${this.cancelEdit}">
              ${this.cancelButtonLabel}
            </button>
            <button
              type="button"
              part="update-btn"
              class="${button({color: 'filled'})}"
              ?disabled="${this.isSaveDisabled}"
              @click="${this.saveEdit}">
              ${this.updateButtonLabel}
            </button>
          </div>
        </div>
      </div>
    `;
  }
}
