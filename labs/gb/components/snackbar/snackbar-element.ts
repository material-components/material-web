/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultOrNative, html, LitElement, nothing} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {button} from '../button/button.js';
import {iconButton} from '../iconbutton/icon-button.js';
import {hasSlotted} from '../shared/has-slotted.js';
import {CLOSE_REASONS, snackbarClasses} from './snackbar.js';

import buttonStyles from '../button/button.css' with {type: 'css'}; // github-only
// import buttonStyles from '../button/button.cssresult.js'; // google3-only
import focusRingStyles from '../focus/focus-ring.css' with {type: 'css'}; // github-only
// import focusRingStyles from '../focus/focus-ring.cssresult.js'; // google3-only
import iconButtonStyles from '../iconbutton/icon-button.css' with {type: 'css'}; // github-only
// import iconButtonStyles from '../iconbutton/icon-button.cssresult.js'; // google3-only
import rippleStyles from '../ripple/ripple.css' with {type: 'css'}; // github-only
// import rippleStyles from '../ripple/ripple.cssresult.js'; // google3-only
import snackbarStyles from './snackbar.css' with {type: 'css'}; // github-only
// import snackbarStyles from './snackbar.cssresult.js'; // google3-only

/**
 * Animation duration for snackbar appearance in milliseconds.
 */
export const OPEN_DURATION_MS = 150;

/**
 * Animation duration for snackbar disappearance in milliseconds.
 */
export const CLOSE_DURATION_MS = 75;

/**
 * A Material Design snackbar component.
 *
 * @fires {Event} open - Fired when the snackbar begins opening.
 * @fires {Event} opened - Fired when the snackbar has opened and animations finished.
 * @fires {CustomEvent<{reason: string}>} close - Fired when the snackbar begins closing.
 * @fires {CustomEvent<{reason: string}>} closed - Fired when the snackbar has closed.
 * @slot - Default slot for rich content (rendered after `label-text`). If both `label-text` and slotted content are provided, both render.
 * @slot action - Slot for a custom action button; replaces the built-in action rendered from `action-label`. Prefer the `action-label` attribute, which renders a text button matching the spec. A slotted plain `<button>` is styled by the snackbar, with hover, focus and pressed states. A slotted text `<md-gb-button>` gets the `--action-label-text*` colors and typography, but keeps its own 16px padding and pressed shape, because its component tokens can't be set from outside its shadow root.
 * @slot dismiss - Slot for dismiss button (falls back to close icon button when `has-close-button` is set).
 * @csspart surface - The surface container of the snackbar.
 * @csspart label - The container wrapping the label content.
 * @csspart actions - The container wrapping action and dismiss slots.
 * @cssprop --action-label-text-color - Action button label text color.
 * @cssprop --action-label-text - Action button label typography.
 * @cssprop --action-label-text-axes - Action button label typography font variation settings.
 * @cssprop --action-label-text-tracking - Action button label letter spacing.
 * @cssprop --container-color - Container background color.
 * @cssprop --container-elevation - Container box shadow elevation.
 * @cssprop --container-shape - Container border radius.
 * @cssprop --icon-color - Close icon color.
 * @cssprop --icon-size - Close icon size.
 * @cssprop --supporting-text - Supporting label typography.
 * @cssprop --supporting-text-axes - Supporting label typography font variation settings.
 * @cssprop --supporting-text-color - Supporting label text color.
 * @cssprop --supporting-text-tracking - Supporting label letter spacing.
 * @cssprop --min-width - Minimum surface width in wide layout.
 * @cssprop --max-width - Maximum surface width in wide layout.
 * @cssprop --min-height - Minimum surface height.
 * @cssprop --bottom-offset - Inset block end distance from container bottom.
 * @cssprop --position - CSS position property (`absolute` by default).
 * @cssprop --z-index - Z-index of the snackbar.
 */
export class SnackbarElement extends LitElement {
  // Layer order is pinned by the `@layer` statement at the top of
  // snackbar.scss, so `md.comp.snackbar` outranks the shared layers.
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [
    focusRingStyles,
    rippleStyles,
    iconButtonStyles,
    buttonStyles,
    snackbarStyles,
    css`
      :host {
        display: block;
      }

      :host([hidden]) {
        display: none;
      }

      :host([quick]) .snackbar-surface {
        transition: none;
      }
    `,
  ];

  private isOpenInternal = false;

  /**
   * Whether the snackbar is currently open.
   */
  @property({type: Boolean, reflect: true})
  get open(): boolean {
    return this.isOpenInternal;
  }
  set open(value: boolean) {
    if (value === this.isOpenInternal) {
      return;
    }
    if (value) {
      this.show();
    } else {
      this.close(CLOSE_REASONS.DISMISS);
    }
  }

  /**
   * Time in milliseconds before the snackbar automatically dismisses.
   * Set to 0 or a negative value (e.g. -1) to disable auto-dismiss. Read when
   * the snackbar opens; changing it while open takes effect on the next open.
   */
  @property({type: Number, attribute: 'timeout-ms'}) timeoutMs = 5000;

  /**
   * Whether the snackbar should be positioned relative to the viewport (fixed).
   */
  @property({type: Boolean, reflect: true}) fixed = false;

  /**
   * Accessible label for the built-in dismiss button.
   */
  @property({attribute: 'close-label'}) closeLabel = 'Close';

  /**
   * Supporting message text to display. Rendered before default slot content.
   */
  @property({attribute: 'label-text'}) labelText = '';

  /**
   * Visible text of the built-in action button. Rendered only when non-empty
   * and nothing is slotted into `action`.
   */
  @property({attribute: 'action-label'}) actionLabel = '';

  /**
   * Whether to display a close icon button.
   */
  @property({type: Boolean, attribute: 'has-close-button'})
  hasCloseButton = false;

  /**
   * Whether to skip opening and closing transition delays.
   */
  @property({type: Boolean, reflect: true}) quick = false;

  @state() private isOpening = false;
  @state() private isClosing = false;

  private isHovered = false;
  private isFocused = false;
  private isPaused = false;
  private autoDismissTimerId: number | null = null;
  private remainingTimeMs = 0;
  private timerStartTime = 0;
  private transitionCounter = 0;

  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('mouseenter', this.handleMouseEnter);
    this.addEventListener('mouseleave', this.handleMouseLeave);
    this.addEventListener('focusin', this.handleFocusIn);
    this.addEventListener('focusout', this.handleFocusOut);
    this.addEventListener('keydown', this.handleKeyDown);
    this.addEventListener('click', this.handleClick);
    if (this.open && !this.isOpening && !this.isClosing) {
      this.startAutoDismissTimer();
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('mouseenter', this.handleMouseEnter);
    this.removeEventListener('mouseleave', this.handleMouseLeave);
    this.removeEventListener('focusin', this.handleFocusIn);
    this.removeEventListener('focusout', this.handleFocusOut);
    this.removeEventListener('keydown', this.handleKeyDown);
    this.removeEventListener('click', this.handleClick);
    this.clearAutoDismissTimer();
  }

  /**
   * Opens the snackbar.
   */
  async show(): Promise<void> {
    if (this.isOpenInternal && !this.isClosing) {
      return;
    }

    const preventOpen = !this.dispatchEvent(
      new Event('open', {bubbles: true, cancelable: true}),
    );
    if (preventOpen) {
      return;
    }

    const token = ++this.transitionCounter;
    this.clearAutoDismissTimer();
    this.isHovered = false;
    this.isFocused = false;
    this.isPaused = false;
    const prev = this.isOpenInternal;
    this.isOpenInternal = true;
    this.requestUpdate('open', prev);
    this.isClosing = false;
    this.isOpening = true;
    this.requestUpdate();
    await this.updateComplete;
    if (token !== this.transitionCounter) {
      return;
    }

    await this.waitForAnimation(OPEN_DURATION_MS);
    if (token !== this.transitionCounter) {
      return;
    }

    this.isOpening = false;
    this.requestUpdate();
    this.dispatchEvent(new Event('opened', {bubbles: true}));

    if (!this.isConnected) {
      return;
    }
    this.startAutoDismissTimer();
  }

  /**
   * Closes the snackbar.
   *
   * @param reason The reason for closing (e.g. 'action', 'dismiss', 'timeout').
   */
  async close(reason: string = CLOSE_REASONS.DISMISS): Promise<void> {
    if (!this.isOpenInternal && !this.isOpening) {
      return;
    }

    const preventClose = !this.dispatchEvent(
      new CustomEvent('close', {
        bubbles: true,
        cancelable: true,
        detail: {reason},
      }),
    );
    if (preventClose) {
      return;
    }

    const token = ++this.transitionCounter;
    this.clearAutoDismissTimer();
    this.isHovered = false;
    this.isFocused = false;
    this.isPaused = false;
    const prev = this.isOpenInternal;
    this.isOpenInternal = false;
    this.requestUpdate('open', prev);
    this.isOpening = false;
    this.isClosing = true;
    this.requestUpdate();
    await this.updateComplete;
    if (token !== this.transitionCounter) {
      return;
    }

    await this.waitForAnimation(CLOSE_DURATION_MS);
    if (token !== this.transitionCounter) {
      return;
    }

    this.isClosing = false;
    this.requestUpdate();
    this.dispatchEvent(
      new CustomEvent('closed', {
        bubbles: true,
        detail: {reason},
      }),
    );
  }

  private async waitForAnimation(durationMs: number): Promise<void> {
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (this.quick || durationMs <= 0 || prefersReducedMotion) {
      return;
    }
    await new Promise<void>((resolve) => {
      globalThis.setTimeout(resolve, durationMs);
    });
  }

  private startAutoDismissTimer() {
    this.clearAutoDismissTimer();
    if (this.timeoutMs <= 0) {
      return;
    }
    this.remainingTimeMs = this.timeoutMs;
    if (this.isHovered || this.isFocused) {
      this.isPaused = true;
      return;
    }
    this.isPaused = false;
    this.timerStartTime = Date.now();
    this.scheduleAutoDismiss(this.remainingTimeMs);
  }

  private scheduleAutoDismiss(ms: number) {
    this.autoDismissTimerId = globalThis.setTimeout(() => {
      this.close(CLOSE_REASONS.TIMEOUT);
    }, ms);
  }

  private clearAutoDismissTimer() {
    if (this.autoDismissTimerId !== null) {
      globalThis.clearTimeout(this.autoDismissTimerId);
      this.autoDismissTimerId = null;
    }
  }

  private pauseAutoDismissTimer() {
    if (this.autoDismissTimerId !== null) {
      this.clearAutoDismissTimer();
      const elapsed = Date.now() - this.timerStartTime;
      this.remainingTimeMs = Math.max(0, this.remainingTimeMs - elapsed);
      this.isPaused = true;
    }
  }

  private resumeAutoDismissTimer() {
    if (
      !this.isHovered &&
      !this.isFocused &&
      this.isPaused &&
      this.isOpenInternal
    ) {
      this.isPaused = false;
      if (this.remainingTimeMs <= 0) {
        this.close(CLOSE_REASONS.TIMEOUT);
        return;
      }
      this.timerStartTime = Date.now();
      this.scheduleAutoDismiss(this.remainingTimeMs);
    }
  }

  private readonly handleMouseEnter = () => {
    this.isHovered = true;
    this.pauseAutoDismissTimer();
  };

  private readonly handleMouseLeave = () => {
    this.isHovered = false;
    if (!this.isFocused) {
      this.resumeAutoDismissTimer();
    }
  };

  private readonly handleFocusIn = () => {
    this.isFocused = true;
    this.pauseAutoDismissTimer();
  };

  private readonly handleFocusOut = () => {
    this.isFocused = false;
    if (!this.isHovered) {
      this.resumeAutoDismissTimer();
    }
  };

  private readonly handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && this.isOpenInternal) {
      event.preventDefault();
      this.close(CLOSE_REASONS.DISMISS);
    }
  };

  private readonly handleClick = (event: MouseEvent) => {
    const path = event.composedPath();
    for (const target of path) {
      if (!(target instanceof HTMLElement)) continue;
      if (
        target.getAttribute('slot') === 'action' ||
        target.classList.contains('snackbar-action')
      ) {
        this.close(CLOSE_REASONS.ACTION);
        return;
      }
      if (
        target.getAttribute('slot') === 'dismiss' ||
        target.classList.contains('snackbar-dismiss')
      ) {
        this.close(CLOSE_REASONS.DISMISS);
        return;
      }
    }
  };

  private readonly handleDismissClick = (event: MouseEvent) => {
    event.stopPropagation();
    this.close(CLOSE_REASONS.DISMISS);
  };

  override render() {
    const classes = snackbarClasses({
      open: this.isOpenInternal,
      opening: this.isOpening,
      closing: this.isClosing,
      fixed: this.fixed,
    });

    return html`
      <div
        class="${classMap(classes)}"
        role="status"
        aria-live="polite"
        aria-atomic="true">
        <div class="snackbar-surface" part="surface">
          <div class="snackbar-content">
            <div class="snackbar-label" part="label">
              ${this.labelText}<slot></slot>
            </div>
            <div class="snackbar-actions" part="actions">
              <slot name="action" ${hasSlotted()}>
                ${this.actionLabel?.trim()
                  ? html`
                      <button
                        type="button"
                        class="${button({
                          color: 'text',
                          size: 'sm',
                          classes: {'snackbar-action': true},
                        })}">
                        ${this.actionLabel}
                      </button>
                    `
                  : nothing}
              </slot>
              <slot name="dismiss" ${hasSlotted()}>
                ${this.hasCloseButton
                  ? html`
                      <button
                        type="button"
                        class="${iconButton({
                          color: 'standard',
                          size: 'sm',
                          classes: {'snackbar-dismiss': true},
                        })}"
                        aria-label="${this.closeLabel}"
                        @click="${this.handleDismissClick}">
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                      </button>
                    `
                  : nothing}
              </slot>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
