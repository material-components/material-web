/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {ARIARole} from '@material/web/types/aria';
import {html, LitElement, PropertyValues, TemplateResult} from 'lit';
import {queryAssignedElements} from 'lit/decorators';

import {ListItemInteractionEvent} from './listitem/constants';
import {ListItem} from './listitem/list-item';

/** @soyCompatible */
export class List extends LitElement {
  static override shadowRootOptions:
      ShadowRootInit = {mode: 'open', delegatesFocus: true};

  items: ListItem[] = [];

  @queryAssignedElements({flatten: true})
  protected assignedElements!: HTMLElement[]|null;

  override firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);

    this.updateItems();
  }

  /** @soyTemplate */
  protected getAriaRole(): ARIARole {
    return 'list';
  }

  /** @soyTemplate */
  override render(): TemplateResult {
    return html`
      <ul class="md3-list"
          tabindex="0"
          role=${this.getAriaRole()}
          @list-item-interaction=${this.handleItemInteraction}>
        <slot></slot>
      </ul>
    `;
  }

  handleItemInteraction(event: ListItemInteractionEvent) {
    if (event.detail.state.isSelected) {
      // TODO: manage selection state.
    }
  }

  /** Updates `this.items` based on slot elements in the DOM. */
  protected updateItems() {
    const elements = this.assignedElements || [];
    this.items = elements.filter(this.isListItem, this);
  }

  protected getListItemTagName() {
    return 'md-list-item';
  }

  /** @return Whether the given element is an <md-list-item> element. */
  private isListItem(element: Element): element is ListItem {
    return element.tagName.toLowerCase() === this.getListItemTagName();
  }
}
