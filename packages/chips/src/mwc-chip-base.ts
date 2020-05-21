/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {MDCChipAdapter} from '@material/chips/chip/adapter.js';
import {MDCChipFoundation} from '@material/chips/chip/foundation.js';
import {MDCChipInteractionEventDetail, MDCChipNavigationEventDetail, MDCChipRemovalEventDetail, MDCChipSelectionEventDetail} from '@material/chips/chip/types';
import {BaseElement} from '@material/mwc-base/base-element.js';
import {observer} from '@material/mwc-base/observer.js';
import {addHasRemoveClass, isRTL} from '@material/mwc-base/utils.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';
import {html, property, query} from 'lit-element';
import {nothing} from 'lit-html';
import {classMap} from 'lit-html/directives/class-map';
import {ifDefined} from 'lit-html/directives/if-defined';

export class ChipBase extends BaseElement {
  @query('.mdc-chip') protected mdcRoot!: HTMLElement;
  protected mdcFoundation!: MDCChipFoundation;
  protected readonly mdcFoundationClass = MDCChipFoundation;

  @property() label = '';
  @property({reflect: true}) type?: ChipType;
  @property({type: Boolean})
  get selected() {
    return this._selected;
  }

  set selected(selected) {
    this._selected = selected;
    this.mdcFoundation.setSelected(selected);
  }

  private _selected = false;

  @property() icon = '';
  @property() iconClass = 'material-icons';
  @property({type: Boolean})
  @observer(function(this: ChipBase, value: boolean) {
    this.mdcFoundation.setShouldRemoveOnTrailingIconClick(value);
  })
  removable = false;
  @property() removeIcon = 'close';
  @property() removeIconClass = 'material-icons';
  @property({type: Boolean}) removeIconFocusable = false;

  @query(MDCChipFoundation.strings.LEADING_ICON_SELECTOR)
  protected leadingIconElement!: HTMLElement|null;
  @query(MDCChipFoundation.strings.CHECKMARK_SELECTOR)
  protected checkmarkElement!: HTMLElement|null;
  @query(MDCChipFoundation.strings.PRIMARY_ACTION_SELECTOR)
  protected primaryActionElement!: HTMLElement|null;
  @query(MDCChipFoundation.strings.TRAILING_ACTION_SELECTOR)
  protected trailingActionElement!: HTMLElement|any;

  protected createAdapter(): MDCChipAdapter {
    return <MDCChipAdapter>{
      ...addHasRemoveClass(this.mdcRoot),
      addClassToLeadingIcon: (className: string) => {
        if (this.leadingIconElement) {
          this.leadingIconElement.classList.add(className);
        }
      },
      removeClassFromLeadingIcon: (className) => {
        if (this.leadingIconElement) {
          this.leadingIconElement.classList.remove(className);
        }
      },
      removeTrailingActionFocus: () => {
        if (this.trailingActionElement) {
          this.trailingActionElement.removeFocus();
        }
      },
      eventTargetHasClass: (target, className) =>
          target ? (target as Element).classList.contains(className) : false,
      notifyInteraction: () => {
        const detail: MDCChipInteractionEventDetail = {chipId: this.id};
        this.dispatchEvent(new CustomEvent(
            MDCChipFoundation.strings.INTERACTION_EVENT,
            {detail, bubbles: true, composed: true}));
      },
      notifySelection: (selected, shouldIgnore) => {
        const detail: MDCChipSelectionEventDetail = {
          chipId: this.id,
          selected,
          shouldIgnore
        };
        this.dispatchEvent(new CustomEvent(
            MDCChipFoundation.strings.SELECTION_EVENT,
            {detail, bubbles: true, composed: true}));
      },
      notifyTrailingIconInteraction: () => {
        const detail: MDCChipInteractionEventDetail = {chipId: this.id};
        this.dispatchEvent(new CustomEvent(
            MDCChipFoundation.strings.TRAILING_ICON_INTERACTION_EVENT,
            {detail, bubbles: true, composed: true}));
      },
      notifyRemoval: () => this.dispatchRemovalEvent(),
      notifyNavigation: (key, source) => {
        const detail:
            MDCChipNavigationEventDetail = {chipId: this.id, key, source};
        this.dispatchEvent(new CustomEvent(
            MDCChipFoundation.strings.NAVIGATION_EVENT,
            {detail, bubbles: true, composed: true}));
      },
      getComputedStyleValue: (propertyName) =>
          getComputedStyle(this.mdcRoot).getPropertyValue(propertyName),
      setStyleProperty: (propertyName, value) =>
          this.mdcRoot.style.setProperty(propertyName, value),
      hasLeadingIcon: () => !!this.leadingIconElement,
      getAttribute: attr => this.mdcRoot.getAttribute(attr),
      getRootBoundingClientRect: () => this.mdcRoot.getBoundingClientRect(),
      getCheckmarkBoundingClientRect: () => this.checkmarkElement &&
          this.checkmarkElement.getBoundingClientRect(),
      setPrimaryActionAttr: (attr, value) => {
        if (this.primaryActionElement) {
          this.primaryActionElement.setAttribute(attr, value);
        }
      },
      focusPrimaryAction: () => {
        if (this.primaryActionElement) {
          this.primaryActionElement.focus();
        }
      },
      hasTrailingAction: () => !!this.trailingActionElement,
      setTrailingActionAttr: (attr, value) => {
        if (this.trailingActionElement) {
          this.trailingActionElement.setAttribute(attr, value);
        }
      },
      focusTrailingAction: () => {
        if (this.trailingActionElement) {
          this.trailingActionElement.focus();
        }
      },
      isRTL: () => isRTL(this.mdcRoot),
      isTrailingActionNavigable: () => {
        if (this.trailingActionElement) {
          return this.trailingActionElement.isNavigable();
        }
        return false;
      }
    };
  }

  focusPrimaryAction() {
    this.mdcFoundation.focusPrimaryAction();
  }

  focusTrailingAction() {
    this.mdcFoundation.focusTrailingAction();
  }

  removeFocus() {
    this.mdcFoundation.removeFocus();
  }

  setSelectedFromChipSet(selected: boolean, shouldNotifyClients: boolean) {
    const oldValue = this._selected;
    this._selected = selected;
    this.mdcFoundation.setSelectedFromChipSet(selected, shouldNotifyClients);
    this.requestUpdate('selected', oldValue);
  }

  removeWithAnimation() {
    this.mdcFoundation.beginExit();
  }

  render() {
    const chipsetClasses = {
      'mdc-ship-set--input': this.type === 'input',
      'mdc-chip-set--choice': this.type === 'choice',
      'mdc-chip-set--filter': this.type === 'filter'
    };

    const classes = {
      'mdc-chip--selected': this.selected,
      'mdc-chip--deletable': this.removable
    };

    return html`
      <div class="fake-chip-set ${classMap(chipsetClasses)}">
        <div class="mdc-chip ${classMap(classes)}"
          role="row"
          .ripple=${ripple()}
          @click=${this.handleClick}
          @keydown=${this.handleKeydown}
          @transitionend=${this.handleTransitionEnd}
        >
          <div class="mdc-chip__ripple"></div>
          ${this.renderThumbnail()}
          ${this.renderCheckmark()}
          <span role="gridcell">
            ${this.renderPrimaryAction()}
          </span>
          ${this.renderRemoveIcon()}
        </div>
      </div>`;
  }

  renderLabel() {
    return html`${this.label}`;
  }

  renderThumbnail() {
    if (this.icon) {
      return html`
        <i class="mdc-chip__icon mdc-chip__icon--leading ${this.iconClass}">
          ${this.icon}
        </i>`;
    } else if (this.childElementCount > 0) {
      return html`
        <span class="mdc-chip__icon mdc-chip__icon--leading">
          <slot name="thumbnail"></slot>
        </span>`;
    } else {
      return html``;
    }
  }

  renderCheckmark() {
    return html`${
        this.type === 'filter' ? html`
      <span class="mdc-chip__checkmark">
        <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
          <path class="mdc-chip__checkmark-path" fill="none" stroke="black" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
        </svg>
      </span>` :
                                 nothing}`;
  }

  renderPrimaryAction() {
    const isFilter = this.type === 'filter';
    const role = isFilter ? 'checkbox' : 'button';
    const ariaChecked = isFilter ? String(this.selected) : undefined;
    return html`
      <span class="mdc-chip__text mdc-chip__primary-action" role="${
        role}" tabindex="0" aria-checked=${ifDefined(ariaChecked)}>
        ${this.renderLabel()}
      </span>`;
  }

  renderRemoveIcon() {
    const classes = {
      'mdc-chip__trailing-action': this.removeIconFocusable,
      [this.removeIconClass]: true
    };

    const icon = html`${
        this.removable ? html`
      <i class="mdc-chip__icon mdc-chip__icon--trailing ${classMap(classes)}"
        tabindex="-1"
        role=${ifDefined(this.removeIconFocusable ? 'button' : undefined)}
        aria-hidden=${ifDefined(this.removeIconFocusable ? undefined : 'true')}
        @click=${this.handleTrailingIconInteraction}
        @keydown=${this.handleTrailingIconInteraction}
      >${this.removeIcon}</i>` :
                         nothing}`;

    if (this.removeIconFocusable) {
      return html`<span role="gridcell">${icon}</span>`;
    } else {
      return icon;
    }
  }

  private dispatchRemovalEvent() {
    const detail: MDCChipRemovalEventDetail = {
      chipId: this.id,
      removedAnnouncement: null
    };
    this.dispatchEvent(new CustomEvent(
        MDCChipFoundation.strings.REMOVAL_EVENT,
        {detail, bubbles: true, composed: true}));
  }

  private handleClick() {
    this.mdcFoundation.handleClick();
  }

  private handleTransitionEnd(e: TransitionEvent) {
    this.mdcFoundation.handleTransitionEnd(e);
  }

  private handleTrailingIconInteraction() {
    this.mdcFoundation.handleTrailingActionInteraction();
  }

  private handleKeydown(e: KeyboardEvent) {
    this.mdcFoundation.handleKeydown(e);
  }
}

export type ChipType = 'action'|'input'|'choice'|'filter';
