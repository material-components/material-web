/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CSSResultOrNative,
  html,
  LitElement,
  nothing,
  type PropertyValues,
} from 'lit';
import {property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';
import {adoptStyles} from '../../styles/adopt-styles.js';

import sheetStyles from './sheet.css' with {type: 'css'}; // github-only
// import {styles as sheetStyles} from './sheet.cssresult.js'; // google3-only

import {
  getDeepActiveElement,
  getFocusableElements,
  SHEET_POSITIONS,
  sheetClasses,
  type SheetCloseReason,
  type SheetPosition,
  startSheetDragGesture,
  trapTabFocus,
} from './sheet.js';

/**
 * A Material Design sheet component.
 *
 * @slot - Used to display the scrollable body content of the sheet.
 * @slot leading - Used to display leading header action (e.g. back button).
 * @slot headline - Used to display custom headline content.
 * @slot trailing - Used to display trailing header action (e.g. custom close action).
 * @slot drag-handle - Used to display an optional custom drag handle (bottom sheet only).
 * @slot actions - Used to display footer actions.
 * @fires sheet-close {CustomEvent<{reason: SheetCloseReason}>} Dispatched when the sheet requests closure via close button, Escape key, or scrim click.
 * @fires sheet-drag-handle-activate {CustomEvent<void>} Dispatched when the bottom sheet drag handle is activated via click or keyboard.
 * @fires sheet-back {CustomEvent<void>} Dispatched when the header back button is clicked. Cancelable; calling preventDefault() prevents the sheet from closing.
 * @csspart sheet - The internal surface container.
 * @cssprop --action-label-text-color
 * @cssprop --action-label-text-focus-color
 * @cssprop --action-label-text-hover-color
 * @cssprop --action-label-text-pressed-color
 * @cssprop --container-color
 * @cssprop --container-elevation
 * @cssprop --container-height
 * @cssprop --container-shape
 * @cssprop --container-width
 * @cssprop --divider-color
 * @cssprop --drag-handle-color
 * @cssprop --drag-handle-height
 * @cssprop --drag-handle-width
 * @cssprop --headline
 * @cssprop --headline-axes
 * @cssprop --headline-color
 * @cssprop --headline-font
 * @cssprop --headline-line-height
 * @cssprop --headline-size
 * @cssprop --headline-tracking
 * @cssprop --headline-weight
 */
export class SheetElement extends LitElement {
  /** @nocollapse */
  static override styles: CSSResultOrNative[] = [sheetStyles];

  /** The presentation position of the sheet. */
  @property({reflect: true}) position: SheetPosition = SHEET_POSITIONS.side;

  /** Whether the sheet is modal, rendering a backdrop scrim and trapping focus. */
  @property({type: Boolean, reflect: true}) modal = false;

  /** Whether the side sheet is detached from viewport edges with outer margins. */
  @property({type: Boolean, reflect: true}) detached = false;

  /** Whether the sheet is currently open and visible. */
  @property({type: Boolean, reflect: true}) open = false;

  /** Whether the bottom sheet is expanded to full height. */
  @property({type: Boolean, reflect: true}) expanded = false;

  /** Whether dividing border lines are rendered between body and actions. */
  @property({attribute: 'divide-action-buttons', type: Boolean, reflect: true})
  divideActionButtons = false;

  /** Whether to display an interactive drag handle on bottom sheets. */
  @property({attribute: 'has-drag-handle', type: Boolean, reflect: true})
  hasDragHandle = false;

  /** Alias for `hasDragHandle`. */
  @property({attribute: 'drag-handle', type: Boolean})
  get dragHandle(): boolean {
    return this.hasDragHandle;
  }
  set dragHandle(value: boolean) {
    this.hasDragHandle = value;
  }

  /** Accessible label for the drag handle button. */
  @property({attribute: 'drag-handle-label'})
  dragHandleLabel = 'Change sheet height';

  /** Whether to display a back icon button in the header. */
  @property({attribute: 'has-back-button', type: Boolean, reflect: true})
  hasBackButton = false;

  /** Accessible label for the leading back button. */
  @property({attribute: 'back-label'}) backLabel = 'Back';

  /** Whether to display a close icon button in the header. */
  @property({attribute: 'has-close-button', type: Boolean, reflect: true})
  hasCloseButton = false;

  /** Accessible label for the trailing close button. */
  @property({attribute: 'close-label'}) closeLabel = 'Close';

  /** Whether pressing Escape closes the sheet. */
  @property({attribute: 'close-on-escape', type: Boolean})
  closeOnEscape = true;

  /** Whether clicking the backdrop scrim closes modal sheets. */
  @property({attribute: 'close-on-scrim-click', type: Boolean})
  closeOnScrimClick = true;

  /** Accessible label forwarded to the internal sheet surface when no headline is rendered. */
  @property({attribute: 'aria-label'}) override ariaLabel: string | null = null;

  /** Headline text displayed in the header. */
  @property() headline = '';

  @state() private hasLeading = false;
  @state() private hasTrailing = false;
  @state() private hasActions = false;
  @state() private hasSlottedHeadline = false;

  private previousFocus: HTMLElement | null = null;
  private suppressNextDragClick = false;
  private cleanupActiveDrag: (() => void) | null = null;

  override connectedCallback() {
    super.connectedCallback();
    adoptStyles(this, sheetStyles);
    this.addEventListener('keydown', this.handleHostKeydown);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.cleanupActiveDrag?.();
    this.cleanupActiveDrag = null;
    this.removeEventListener('keydown', this.handleHostKeydown);
    if (this.previousFocus) {
      this.previousFocus.focus({preventScroll: true});
      this.previousFocus = null;
    }
  }

  protected override willUpdate() {
    this.hasLeading = Boolean(this.querySelector(':scope > [slot="leading"]'));
    this.hasTrailing = Boolean(
      this.querySelector(':scope > [slot="trailing"]'),
    );
    this.hasActions = Boolean(this.querySelector(':scope > [slot="actions"]'));
    this.hasSlottedHeadline = Boolean(
      this.querySelector(':scope > [slot="headline"]'),
    );
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);

    if (changedProperties.has('open') || changedProperties.has('modal')) {
      const wasModalOpen =
        (changedProperties.has('open')
          ? changedProperties.get('open')
          : this.open) &&
        (changedProperties.has('modal')
          ? changedProperties.get('modal')
          : this.modal);
      const isModalOpen = this.open && this.modal;

      if (isModalOpen && !wasModalOpen) {
        this.captureAndTrapFocus();
      } else if (!this.open && changedProperties.get('open') === true) {
        if (this.previousFocus) {
          this.previousFocus.focus({preventScroll: true});
          this.previousFocus = null;
        }
      }
    }
  }

  private getFocusableFromSlot(
    slot: HTMLSlotElement | null | undefined,
    fallbackSelector?: string,
  ): HTMLElement[] {
    if (!slot) return [];
    const assigned = slot.assignedElements({flatten: true}) as HTMLElement[];
    if (assigned.length > 0) {
      const results: HTMLElement[] = [];
      for (const el of assigned) {
        results.push(...getFocusableElements(el));
      }
      return results;
    }
    if (fallbackSelector && this.shadowRoot) {
      const fallback =
        this.shadowRoot.querySelector<HTMLElement>(fallbackSelector);
      if (fallback) {
        return getFocusableElements(fallback);
      }
    }
    return [];
  }

  private getComposedFocusableElements(): HTMLElement[] {
    if (!this.shadowRoot) return [];
    const elements: HTMLElement[] = [];

    // 1. Drag handle slot (or internal fallback .sheet-drag-handle)
    const dragHandleSlot = this.shadowRoot.querySelector<HTMLSlotElement>(
      'slot[name="drag-handle"]',
    );
    elements.push(
      ...this.getFocusableFromSlot(dragHandleSlot, '.sheet-drag-handle'),
    );

    // 2. Leading slot
    const leadingSlot = this.shadowRoot.querySelector<HTMLSlotElement>(
      'slot[name="leading"]',
    );
    elements.push(...this.getFocusableFromSlot(leadingSlot, '.sheet-back'));

    // 3. Trailing slot (or internal fallback .sheet-close)
    const trailingSlot = this.shadowRoot.querySelector<HTMLSlotElement>(
      'slot[name="trailing"]',
    );
    elements.push(...this.getFocusableFromSlot(trailingSlot, '.sheet-close'));

    // 4. Default body slot
    const defaultSlot =
      this.shadowRoot.querySelector<HTMLSlotElement>('slot:not([name])');
    elements.push(...this.getFocusableFromSlot(defaultSlot));

    // 5. Actions slot
    const actionsSlot = this.shadowRoot.querySelector<HTMLSlotElement>(
      'slot[name="actions"]',
    );
    elements.push(...this.getFocusableFromSlot(actionsSlot));

    return elements;
  }

  private async captureAndTrapFocus() {
    this.previousFocus = getDeepActiveElement();

    await this.updateComplete;
    if (!this.open || !this.modal || !this.isConnected) return;

    const autofocusEl =
      this.querySelector<HTMLElement>('[autofocus]') ||
      this.shadowRoot?.querySelector<HTMLElement>('[autofocus]');
    if (autofocusEl) {
      autofocusEl.focus({preventScroll: true});
      return;
    }

    const focusables = this.getComposedFocusableElements();
    if (focusables.length > 0) {
      focusables[0].focus({preventScroll: true});
      return;
    }

    const sheetContainer =
      this.shadowRoot?.querySelector<HTMLElement>('[part="sheet"]');
    sheetContainer?.focus({preventScroll: true});
  }

  private readonly handleHostKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      if (this.open && this.closeOnEscape) {
        event.stopPropagation();
        this.handleClose('escape');
      }
      return;
    }

    if (event.key === 'Tab' && this.modal && this.open) {
      this.handleModalTabWrapping(event);
    }
  };

  private handleModalTabWrapping(event: KeyboardEvent) {
    const focusables = this.getComposedFocusableElements();
    trapTabFocus(event, focusables);
  }

  private handleClose(reason: SheetCloseReason) {
    this.expanded = false;
    const event = new CustomEvent<{reason: SheetCloseReason}>('sheet-close', {
      bubbles: true,
      composed: true,
      detail: {reason},
    });
    this.dispatchEvent(event);
    this.open = false;
  }

  private handleBackButtonClick() {
    const backEvent = new CustomEvent<void>('sheet-back', {
      bubbles: true,
      composed: true,
      cancelable: true,
    });
    if (this.dispatchEvent(backEvent)) {
      this.handleClose('back-button');
    }
  }

  private handleCloseButtonClick() {
    this.handleClose('close-button');
  }

  private handleScrimClick() {
    if (this.closeOnScrimClick) {
      this.handleClose('scrim');
    }
  }

  private handleDragHandleClick() {
    if (this.suppressNextDragClick) {
      this.suppressNextDragClick = false;
      return;
    }
    this.expanded = !this.expanded;
    const event = new CustomEvent('sheet-drag-handle-activate', {
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private handleDragPointerDown(event: PointerEvent) {
    if (event.button !== 0) return;
    const sheetSurface =
      this.shadowRoot?.querySelector<HTMLElement>('[part="sheet"]');
    if (!sheetSurface) return;

    this.cleanupActiveDrag?.();
    this.suppressNextDragClick = false;
    this.cleanupActiveDrag = startSheetDragGesture({
      event,
      surface: sheetSurface,
      isExpanded: () => this.expanded,
      onDragStart: () => {
        this.suppressNextDragClick = true;
      },
      onExpand: () => {
        this.expanded = true;
        this.dispatchEvent(
          new CustomEvent('sheet-drag-handle-activate', {
            bubbles: true,
            composed: true,
          }),
        );
      },
      onCollapse: () => {
        this.expanded = false;
        this.dispatchEvent(
          new CustomEvent('sheet-drag-handle-activate', {
            bubbles: true,
            composed: true,
          }),
        );
      },
      onDismiss: () => {
        this.handleClose('drag');
      },
    });
  }

  private handleLeadingSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasLeading = slot.assignedNodes({flatten: true}).length > 0;
  }

  private handleTrailingSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasTrailing = slot.assignedNodes({flatten: true}).length > 0;
  }

  private handleHeadlineSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasSlottedHeadline = slot.assignedNodes({flatten: true}).length > 0;
  }

  private handleActionsSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this.hasActions = slot.assignedNodes({flatten: true}).length > 0;
  }

  protected override render() {
    const isBottom = this.position === SHEET_POSITIONS.bottom;
    const hasHeadline = Boolean(this.headline || this.hasSlottedHeadline);
    const hostAriaLabel = this.ariaLabel ?? this.getAttribute('aria-label');
    const hasTrailingAction = this.hasTrailing || this.hasCloseButton;
    const hasLeadingAction = this.hasLeading || this.hasBackButton;
    const hasHeader = hasHeadline || hasLeadingAction || hasTrailingAction;

    const containerClasses = sheetClasses({
      position: this.position,
      modal: this.modal,
      detached: this.detached,
      hasDragHandle: this.hasDragHandle,
      expanded: this.expanded,
      open: this.open,
      divideActionButtons: this.divideActionButtons,
    });

    return html`
      ${this.modal
        ? html`<div class="sheet-scrim" @click=${this.handleScrimClick}></div>`
        : nothing}
      <section
        part="sheet"
        tabindex="-1"
        class="${classMap(containerClasses)}"
        role=${this.modal ? 'dialog' : 'region'}
        aria-modal=${this.modal ? 'true' : nothing}
        aria-labelledby=${hasHeadline ? 'sheet-headline' : nothing}
        aria-label=${!hasHeadline && hostAriaLabel ? hostAriaLabel : nothing}>
        ${isBottom && this.hasDragHandle
          ? html`
              <slot name="drag-handle">
                <button
                  class="sheet-drag-handle"
                  type="button"
                  role=${'Drag handle' as unknown as 'button'}
                  aria-roledescription="Drag handle"
                  aria-label=${this.dragHandleLabel}
                  @pointerdown=${this.handleDragPointerDown}
                  @click=${this.handleDragHandleClick}></button>
              </slot>
            `
          : nothing}
        <header
          class="sheet-header ${classMap({
            'sheet-header-with-leading': hasLeadingAction,
            'sheet-header-with-trailing': hasTrailingAction,
          })}"
          ?hidden=${!hasHeader}>
          <slot name="leading" @slotchange=${this.handleLeadingSlotChange}>
            ${this.hasBackButton
              ? html`
                  <button
                    class="sheet-back"
                    type="button"
                    aria-label=${this.backLabel}
                    @click=${this.handleBackButtonClick}>
                    <svg
                      class="sheet-back-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true">
                      <path
                        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                    </svg>
                  </button>
                `
              : nothing}
          </slot>
          <h2
            id="sheet-headline"
            class="sheet-headline"
            aria-hidden=${hasHeadline ? nothing : 'true'}>
            <slot name="headline" @slotchange=${this.handleHeadlineSlotChange}
              >${this.headline}</slot
            >
          </h2>
          <slot name="trailing" @slotchange=${this.handleTrailingSlotChange}>
            ${this.hasCloseButton
              ? html`
                  <button
                    class="sheet-close"
                    type="button"
                    aria-label=${this.closeLabel}
                    @click=${this.handleCloseButtonClick}>
                    <svg
                      class="sheet-close-icon"
                      viewBox="0 0 24 24"
                      aria-hidden="true">
                      <path
                        d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                    </svg>
                  </button>
                `
              : nothing}
          </slot>
        </header>
        <div class="sheet-content">
          <slot></slot>
        </div>
        <footer class="sheet-actions" ?hidden=${!this.hasActions}>
          <slot
            name="actions"
            @slotchange=${this.handleActionsSlotChange}></slot>
        </footer>
      </section>
    `;
  }
}
