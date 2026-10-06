/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CSSResultOrNative,
  LitElement,
  PropertyValues,
  TemplateResult,
  css,
  html,
} from 'lit';
import {property} from 'lit/decorators.js';
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

      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        display: contents;
      }

      button {
        appearance: none;

        display: inline-flex;
        align-items: center;
        gap: 1ch;

        border: none;
        background: none;
        padding: initial;
        font: initial;

        &::before {
          content: '\u25B6' / ''; /* &rtrif; */
          font-size: 0.75em;
        }

        :host(:state(open)) &::before {
          transform: rotate(90deg);
        }
      }

      :host(:not(:state(open))) slot[name='content'] {
        display: none;
      }
    `,
  ];

  private internalOpen = false;
  private internalName: string | null = null;

  @property()
  get open(): boolean {
    return this.internalOpen;
  }
  set open(value: boolean) {
    this.internalOpen = value;
    this.ensureExclusivity(true);
  }

  @property()
  get name(): string | null {
    return this.internalName;
  }
  set name(value: string | null) {
    this.internalName = value;
    this.ensureExclusivity(false);
  }

  @property()
  headingLevel?: number;

  constructor() {
    super();

    this[internals].role = 'group';
    this[toggleState]('open', false);
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
      `md-aria-accordion[name="${CSS.escape(this.name)}"]`,
    ) as NodeListOf<AriaAccordionElement>;
    for (const other of others) {
      if (other === this) {
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
      ${this.wrapWithHeading(html`
        <button
          part="button"
          aria-expanded=${this.open}
          aria-controls="content"
          @click=${() => {
            this.open = !this.open;
            this.dispatchEvent(
              new ToggleEvent('toggle', {
                oldState: this.open ? 'closed' : 'open',
                newState: this.open ? 'open' : 'closed',
              }),
            );
          }}>
          <slot name="title"></slot>
        </button>
      `)}
      <slot name="content"></slot>
    `;
  }

  protected wrapWithHeading(content: TemplateResult): TemplateResult {
    switch (this.headingLevel) {
      case 1:
        return html`<h1>${content}</h1>`;
      case 2:
        return html`<h2>${content}</h2>`;
      case 3:
        return html`<h3>${content}</h3>`;
      case 4:
        return html`<h4>${content}</h4>`;
      case 5:
        return html`<h5>${content}</h5>`;
      case 6:
        return html`<h6>${content}</h6>`;
      default:
        return content;
    }
  }
}
