/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CSSResultOrNative,
  LitElement,
  PropertyValues,
  css,
  html,
  nothing,
} from 'lit';
import {property} from 'lit/decorators.js';
import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../internal/events/dispatch-hooks.js';
import {
  mixinCustomStateSet,
  toggleState,
} from '../../behaviors/custom-state-set.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';

const baseClass = mixinCustomStateSet(mixinElementInternals(LitElement));

/**
 * An expandable accordion item.
 *
 * @fires {ToggleEvent} toggle - Dispatched when the item is opened or closed by
 *     the user.
 * @csspart button - The button that opens the item. This button's `::before`
 *     produces the disclosure triangle.
 * @cssstate open - Set when the item is open.
 */
export class AriaAccordionElement extends baseClass {
  static override styles: CSSResultOrNative[] = [
    css`
      :host {
        display: flex;
        flex-direction: column;
        align-items: stretch;
      }

      #heading {
        display: contents;
      }

      button {
        all: unset;

        display: inline-flex;
        align-items: center;
        gap: 1ch;

        &:focus-visible {
          outline: 1px auto AccentColor;
        }

        &::before {
          content: '\u25B6' / ''; /* &rtrif; */
          font-size: 0.75em;
        }

        :host(:state(open)) &::before {
          transform: rotate(90deg);
        }
      }

      slot[name='content'] {
        display: block;

        :host(:not(:state(open))) & {
          display: none;
        }
      }
    `,
  ];

  private internalOpen = false;
  private internalName: string | null = null;

  /** True if the accordion is open. */
  @property({type: Boolean, reflect: true})
  get open(): boolean {
    return this.internalOpen;
  }
  set open(value: boolean) {
    const oldValue = this.internalOpen;
    this.internalOpen = value;
    if (!oldValue && value) {
      this.ensureExclusivity(true);
    }
    this.requestUpdate('open', oldValue);
  }

  /**
   * Only one accordion in a root with the same, non-empty name may be at a
   * time.
   */
  @property({type: String, reflect: true})
  get name(): string | null {
    return this.internalName;
  }
  set name(value: string | null) {
    const oldValue = this.internalName;
    this.internalName = value;
    this.ensureExclusivity(false);
    this.requestUpdate('name', oldValue);
  }

  @property({type: Number})
  headingLevel?: number;

  /** The heading level, if `headingLevel` is a valid heading level. */
  private get usedHeadingLevel(): number | undefined {
    if (
      this.headingLevel !== undefined &&
      Number.isInteger(this.headingLevel) &&
      this.headingLevel >= 1
    ) {
      return this.headingLevel;
    } else {
      return undefined;
    }
  }

  constructor() {
    super();

    this[internals].role = 'group';
    this[toggleState]('open', false);

    setupDispatchHooks(this, 'click');
  }

  private handleClick(event: Event) {
    afterDispatch(event, () => {
      if (event.defaultPrevented) {
        return;
      }

      const wasOpen = this.open;
      this.open = !wasOpen;
      this.dispatchEvent(
        new ToggleEvent('toggle', {
          oldState: wasOpen ? 'open' : 'closed',
          newState: wasOpen ? 'closed' : 'open',
        }),
      );
    });
  }

  override connectedCallback() {
    super.connectedCallback();
    this.ensureExclusivity(false);
  }

  protected override updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);

    if (changedProperties.has('open')) {
      this[toggleState]('open', this.open);
    }
  }

  /**
   * Implements both the "ensure details exclusivity by closing other elements
   * if needed" and "ensure details exclusivity by closing the given element if
   * needed" steps, switching based on the passed flag.
   */
  private ensureExclusivity(closeOthers: boolean) {
    // Do nothing if potentially closing this element and it is already closed.
    if (!closeOthers && !this.open) {
      return;
    }

    // Both `null` and the empty string imply that this element is not part of a
    // group.
    if (!this.name) {
      return;
    }

    const others = (this.getRootNode() as ParentNode).querySelectorAll(
      `md-aria-accordion`,
    ) as NodeListOf<AriaAccordionElement>;
    for (const other of others) {
      if (other === this) {
        continue;
      }

      // Filter here instead of using an attribute selector in case it isn't
      // synced with the value.
      if (other.name !== this.name) {
        continue;
      }

      if (other.internalOpen) {
        if (closeOthers) {
          other.internalOpen = false;
          other.requestUpdate('open', true);
        } else {
          this.internalOpen = false;
          this.requestUpdate('open', true);
          break;
        }
      }
    }
  }

  protected override render() {
    return html`
      <div
        id="heading"
        role="${this.usedHeadingLevel ? 'heading' : nothing}"
        aria-level="${this.usedHeadingLevel ?? nothing}">
        <button
          id="button"
          part="button"
          aria-expanded=${this.open}
          aria-controls="content"
          @click=${this.handleClick}>
          <slot name="title"></slot>
        </button>
      </div>
      <slot
        id="content"
        name="content"
        role=${this.usedHeadingLevel ? 'region' : nothing}
        aria-labelledby=${this.usedHeadingLevel ? 'button' : nothing}></slot>
    `;
  }
}
