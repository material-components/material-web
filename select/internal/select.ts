/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../menu/menu.js';

import {html, isServer, LitElement, nothing, PropertyValues} from 'lit';
import {property, query, queryAssignedElements, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {styleMap} from 'lit/directives/style-map.js';
import {html as staticHtml, StaticValue} from 'lit/static-html.js';

import {Field} from '../../field/internal/field.js';
import {ARIAMixinStrict} from '../../internal/aria/aria.js';
import {requestUpdateOnAriaChange} from '../../internal/aria/delegate.js';
import {redispatchEvent} from '../../internal/events/redispatch-event.js';
import {
  createValidator,
  getValidityAnchor,
  mixinConstraintValidation,
} from '../../labs/behaviors/constraint-validation.js';
import {mixinElementInternals} from '../../labs/behaviors/element-internals.js';
import {
  getFormValue,
  mixinFormAssociated,
} from '../../labs/behaviors/form-associated.js';
import {
  mixinOnReportValidity,
  onReportValidity,
} from '../../labs/behaviors/on-report-validity.js';
import {SelectValidator} from '../../labs/behaviors/validators/select-validator.js';
import {getActiveItem} from '../../list/internal/list-navigation-helpers.js';
import {
  CloseMenuEvent,
  FocusState,
  isElementInSubtree,
  isSelectableKey,
} from '../../menu/internal/controllers/shared.js';
import {TYPEAHEAD_RECORD} from '../../menu/internal/controllers/typeaheadController.js';
import {DEFAULT_TYPEAHEAD_BUFFER_TIME, Menu} from '../../menu/internal/menu.js';
import {SelectOption} from './selectoption/select-option.js';
import {
  createRequestDeselectionEvent,
  createRequestSelectionEvent,
} from './selectoption/selectOptionController.js';
import {getSelectedItems, SelectOptionRecord} from './shared.js';

const VALUE = Symbol('value');

// Separate variable needed for closure.
const selectBaseClass = mixinOnReportValidity(
  mixinConstraintValidation(
    mixinFormAssociated(mixinElementInternals(LitElement)),
  ),
);

/**
 * @fires change {Event} The native `change` event on
 * [`<input>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event)
 * --bubbles
 * @fires input {InputEvent} The native `input` event on
 * [`<input>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/input_event)
 * --bubbles --composed
 * @fires opening {Event} Fired when the select's menu is about to open.
 * @fires opened {Event} Fired when the select's menu has finished animations
 * and opened.
 * @fires closing {Event} Fired when the select's menu is about to close.
 * @fires closed {Event} Fired when the select's menu has finished animations
 * and closed.
 */
export abstract class Select extends selectBaseClass {
  static {
    requestUpdateOnAriaChange(Select);
  }

  /** @nocollapse */
  static override shadowRootOptions = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  /**
   * Opens the menu synchronously with no animation.
   */
  @property({type: Boolean}) quick = false;

  /**
   * Whether or not the select is required.
   */
  @property({type: Boolean}) required = false;

  /**
   * The error message that replaces supporting text when `error` is true. If
   * `errorText` is an empty string, then the supporting text will continue to
   * show.
   *
   * This error message overrides the error message displayed by
   * `reportValidity()`.
   */
  @property({type: String, attribute: 'error-text'}) errorText = '';

  /**
   * The floating label for the field.
   */
  @property() label = '';

  /**
   * Conveys additional information below the select, such as how it should
   * be used.
   */
  @property({type: String, attribute: 'supporting-text'}) supportingText = '';

  /**
   * Gets or sets whether or not the select is in a visually invalid state.
   *
   * This error state overrides the error state controlled by
   * `reportValidity()`.
   */
  @property({type: Boolean, reflect: true}) error = false;

  /**
   * Whether or not the underlying md-menu should be position: fixed to display
   * in a top-level manner, or position: absolute.
   *
   * position:fixed is useful for cases where select is inside of another
   * element with stacking context and hidden overflows such as `md-dialog`.
   */
  @property({attribute: 'menu-positioning'})
  menuPositioning: 'absolute' | 'fixed' | 'popover' = 'popover';

  /**
   * Clamps the menu-width to the width of the select.
   */
  @property({type: Boolean, attribute: 'clamp-menu-width'})
  clampMenuWidth = false;

  /**
   * The max time between the keystrokes of the typeahead select / menu behavior
   * before it clears the typeahead buffer.
   */
  @property({type: Number, attribute: 'typeahead-delay'})
  typeaheadDelay = DEFAULT_TYPEAHEAD_BUFFER_TIME;

  /**
   * Whether or not the text field has a leading icon. Used for SSR.
   */
  @property({type: Boolean, attribute: 'has-leading-icon'})
  hasLeadingIcon = false;

  /**
   * Text to display in the field. Only set for SSR.
   */
  @property({attribute: 'display-text'}) displayText = '';

  /**
   * Whether the menu should be aligned to the start or the end of the select's
   * textbox.
   */
  @property({attribute: 'menu-align'}) menuAlign: 'start' | 'end' = 'start';

  /**
   * The value of the currently selected option.
   *
   * Note: For SSR, set `[selected]` on the requested option and `displayText`
   * rather than setting `value` setting `value` will incur a DOM query.
   */
  @property()
  get value(): string {
    return this[VALUE];
  }

  set value(value: string) {
    if (isServer) return;
    this.lastUserSetValue = value;
    this.select(value);
  }

  [VALUE] = '';

  get options() {
    // NOTE: this does a DOM query.
    return (this.menu?.items ?? []) as SelectOption[];
  }

  /**
   * The index of the currently selected option.
   *
   * Note: For SSR, set `[selected]` on the requested option and `displayText`
   * rather than setting `selectedIndex` setting `selectedIndex` will incur a
   * DOM query.
   */
  @property({type: Number, attribute: 'selected-index'})
  get selectedIndex(): number {
    // tslint:disable-next-line:enforce-name-casing
    const [_option, index] = (this.getSelectedOptions() ?? [])[0] ?? [];
    return index ?? -1;
  }

  set selectedIndex(index: number) {
    this.lastUserSetSelectedIndex = index;
    this.selectIndex(index);
  }

  /**
   * Returns an array of selected options.
   *
   * NOTE: md-select only suppoprts single selection.
   */
  get selectedOptions() {
    return (this.getSelectedOptions() ?? []).map(([option]) => option);
  }

  protected abstract readonly fieldTag: StaticValue;

  /**
   * Used for initializing select when the user sets the `value` directly.
   */
  private lastUserSetValue: string | null = null;

  /**
   * Used for initializing select when the user sets the `selectedIndex`
   * directly.
   */
  private lastUserSetSelectedIndex: number | null = null;

  /**
   * Used for `input` and `change` event change detection.
   */
  private lastSelectedOption: SelectOption | null = null;

  // tslint:disable-next-line:enforce-name-casing
  private lastSelectedOptionRecords: SelectOptionRecord[] = [];

  /**
   * Whether or not a native error has been reported via `reportValidity()`.
   */
  @state() private nativeError = false;

  /**
   * The validation message displayed from a native error via
   * `reportValidity()`.
   */
  @state() private nativeErrorText = '';
  private get hasError() {
    return this.error || this.nativeError;
  }

  @state() private focused = false;
  @state() private open = false;
  @state() private defaultFocus: FocusState = FocusState.NONE;
  @query('.field') private readonly field!: Field | null;
  @query('md-menu') private readonly menu!: Menu | null;
  @query('#label') private readonly labelEl!: HTMLElement;
  @queryAssignedElements({slot: 'leading-icon', flatten: true})
  private readonly leadingIcons!: Element[];
  // Have to keep track of previous open because it's state and private and thus
  // cannot be tracked in PropertyValues<this> map.
  private prevOpen = this.open;
  private selectWidth = 0;

  constructor() {
    super();
    if (isServer) {
      return;
    }

    this.addEventListener('focus', this.handleFocus.bind(this));
    this.addEventListener('blur', this.handleBlur.bind(this));
  }

  /**
   * Selects an option given the value of the option, and updates MdSelect's
   * value.
   */
  select(value: string) {
    const optionToSelect = this.options.find(
      (option) => option.value === value,
    );
    if (optionToSelect) {
      this.selectItem(optionToSelect);
    }
  }

  /**
   * Selects an option given the index of the option, and updates MdSelect's
   * value.
   */
  selectIndex(index: number) {
    const optionToSelect = this.options[index];
    if (optionToSelect) {
      this.selectItem(optionToSelect);
    }
  }

  /**
   * Reset the select to its default value.
   */
  reset() {
    for (const option of this.options) {
      option.selected = option.hasAttribute('selected');
    }

    this.updateValueAndDisplayText();
    this.nativeError = false;
    this.nativeErrorText = '';
  }

  [onReportValidity](invalidEvent: Event | null) {
    // Prevent default pop-up behavior.
    invalidEvent?.preventDefault();

    const prevMessage = this.getErrorText();
    this.nativeError = !!invalidEvent;
    this.nativeErrorText = this.validationMessage;

    if (prevMessage === this.getErrorText()) {
      this.field?.reannounceError();
    }
  }

  protected override update(changed: PropertyValues<Select>) {
    // In SSR the options will be ready to query, so try to figure out what
    // the value and display text should be.
    if (!this.hasUpdated) {
      this.initUserSelection();
    }

    // We have just opened the menu.
    // We are only able to check for the select's rect in `update()` instead of
    // having to wait for `updated()` because the menu can never be open on
    // first render since it is not settable and Lit SSR does not support click
    // events which would open the menu.
    if (this.prevOpen !== this.open && this.open) {
      const selectRect = this.getBoundingClientRect();
      this.selectWidth = selectRect.width;
    }

    this.prevOpen = this.open;
    super.update(changed);
  }

  protected override render() {
    return html`
      <span
        class="select ${classMap(this.getRenderClasses())}"
        @focusout=${this.handleFocusout}>
        ${this.renderField()} ${this.renderMenu()}
      </span>
    `;
  }

  protected override async firstUpdated(changed: PropertyValues<Select>) {
    await this.menu?.updateComplete;
    // If this has been handled on update already due to SSR, try again.
    if (!this.lastSelectedOptionRecords.length) {
      this.initUserSelection();
    }

    // Case for when the DOM is streaming, there are no children, and a child
    // has [selected] set on it, we need to wait for DOM to render something.
    if (
      !this.lastSelectedOptionRecords.length &&
      !isServer &&
      !this.options.length
    ) {
      setTimeout(() => {
        this.updateValueAndDisplayText();
      });
    }

    super.firstUpdated(changed);
  }

  private getRenderClasses(): ClassInfo {
    return {
      'disabled': this.disabled,
      'error': this.error,
      'open': this.open,
    };
  }

  private renderField() {
    return staticHtml`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          part="field"
          id="field"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-label=${(this as ARIAMixinStrict).ariaLabel || nothing}
          aria-describedby="description"
          aria-expanded=${this.open ? 'true' : 'false'}
          aria-controls="listbox"
          class="field"
          label=${this.label}
          .focused=${this.focused || this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.hasError}
          ?has-start=${this.hasLeadingIcon}
          has-end
          supporting-text=${this.supportingText}
          error-text=${this.getErrorText()}
          @keydown=${this.handleKeydown}
          @click=${this.handleClick}>
         ${this.renderFieldContent()}
         <div id="description" slot="aria-describedby"></div>
      </${this.fieldTag}>`;
  }

  private renderFieldContent() {
    return [
      this.renderLeadingIcon(),
      this.renderLabel(),
      this.renderTrailingIcon(),
    ];
  }

  private renderLeadingIcon() {
    return html`
      <span class="icon leading" slot="start">
        <slot name="leading-icon" @slotchange=${this.handleIconChange}></slot>
      </span>
    `;
  }

  private renderTrailingIcon() {
    return html`
      <span class="icon trailing" slot="end">
        <slot name="trailing-icon" @slotchange=${this.handleIconChange}>
          <svg height="5" viewBox="7 10 10 5" focusable="false">
            <polygon
              class="down"
              stroke="none"
              fill-rule="evenodd"
              points="7 10 12 15 17 10"></polygon>
            <polygon
              class="up"
              stroke="none"
              fill-rule="evenodd"
              points="7 15 12 10 17 15"></polygon>
          </svg>
        </slot>
      </span>
    `;
  }

  private renderLabel() {
    // need to render &nbsp; so that line-height can apply and give it a
    // non-zero height
    return html`<div id="label">${this.displayText || html`&nbsp;`}</div>`;
  }

  private renderMenu() {
    const ariaLabel = this.label || (this as ARIAMixinStrict).ariaLabel;
    return html`<div class="menu-wrapper">
      <md-menu
        id="listbox"
        .defaultFocus=${this.defaultFocus}
        role="listbox"
        tabindex="-1"
        aria-label=${ariaLabel || nothing}
        stay-open-on-focusout
        part="menu"
        exportparts="focus-ring: menu-focus-ring"
        anchor="field"
        style=${styleMap({
          '--__menu-min-width': `${this.selectWidth}px`,
          '--__menu-max-width': this.clampMenuWidth
            ? `${this.selectWidth}px`
            : undefined,
        })}
        no-navigation-wrap
        .open=${this.open}
        .quick=${this.quick}
        .positioning=${this.menuPositioning}
        .typeaheadDelay=${this.typeaheadDelay}
        .anchorCorner=${this.menuAlign === 'start' ? 'end-start' : 'end-end'}
        .menuCorner=${this.menuAlign === 'start' ? 'start-start' : 'start-end'}
        @opening=${this.handleOpening}
        @opened=${this.redispatchEvent}
        @closing=${this.redispatchEvent}
        @closed=${this.handleClosed}
        @close-menu=${this.handleCloseMenu}
        @request-selection=${this.handleRequestSelection}
        @request-deselection=${this.handleRequestDeselection}>
        ${this.renderMenuContent()}
      </md-menu>
    </div>`;
  }

  private renderMenuContent() {
    return html`<slot></slot>`;
  }

  /**
   * Handles opening the select on keydown and typahead selection when the menu
   * is closed.
   */
  private handleKeydown(event: KeyboardEvent) {
    if (this.open || this.disabled || !this.menu) {
      return;
    }

    const typeaheadController = this.menu.typeaheadController;
    const isOpenKey =
      event.code === 'Space' ||
      event.code === 'ArrowDown' ||
      event.code === 'ArrowUp' ||
      event.code === 'End' ||
      event.code === 'Home' ||
      event.code === 'Enter';

    // Do not open if currently typing ahead because the user may be typing the
    // spacebar to match a word with a space
    if (!typeaheadController.isTypingAhead && isOpenKey) {
      event.preventDefault();
      this.open = true;

      // https://www.w3.org/WAI/ARIA/apg/patterns/combobox/examples/combobox-select-only/#kbd_label
      switch (event.code) {
        case 'Space':
        case 'ArrowDown':
        case 'Enter':
          // We will handle focusing last selected item in this.handleOpening()
          this.defaultFocus = FocusState.NONE;
          break;
        case 'End':
          this.defaultFocus = FocusState.LAST_ITEM;
          break;
        case 'ArrowUp':
        case 'Home':
          this.defaultFocus = FocusState.FIRST_ITEM;
          break;
        default:
          break;
      }
      return;
    }

    const isPrintableKey = event.key.length === 1;

    // Handles typing ahead when the menu is closed by delegating the event to
    // the underlying menu's typeaheadController
    if (isPrintableKey) {
      typeaheadController.onKeydown(event);
      event.preventDefault();

      const {lastActiveRecord} = typeaheadController;

      if (!lastActiveRecord) {
        return;
      }

      this.labelEl?.setAttribute?.('aria-live', 'polite');
      const hasChanged = this.selectItem(
        lastActiveRecord[TYPEAHEAD_RECORD.ITEM] as SelectOption,
      );

      if (hasChanged) {
        this.dispatchInteractionEvents();
      }
    }
  }

  private handleClick() {
    this.open = !this.open;
  }

  private handleFocus() {
    this.focused = true;
  }

  private handleBlur() {
    this.focused = false;
  }

  /**
   * Handles closing the menu when the focus leaves the select's subtree.
   */
  private handleFocusout(event: FocusEvent) {
    // Don't close the menu if we are switching focus between menu,
    // select-option, and field
    if (event.relatedTarget && isElementInSubtree(event.relatedTarget, this)) {
      return;
    }

    this.open = false;
  }

  /**
   * Gets a list of all selected select options as a list item record array.
   *
   * @return An array of selected list option records.
   */
  private getSelectedOptions() {
    if (!this.menu) {
      this.lastSelectedOptionRecords = [];
      return null;
    }

    const items = this.menu.items as SelectOption[];
    this.lastSelectedOptionRecords = getSelectedItems(items);
    return this.lastSelectedOptionRecords;
  }

  override async getUpdateComplete() {
    await this.menu?.updateComplete;
    return super.getUpdateComplete();
  }

  /**
   * Gets the selected options from the DOM, and updates the value and display
   * text to the first selected option's value and headline respectively.
   *
   * @return Whether or not the selected option has changed since last update.
   */
  private updateValueAndDisplayText() {
    const selectedOptions = this.getSelectedOptions() ?? [];
    // Used to determine whether or not we need to fire an input / change event
    // which fire whenever the option element changes (value or selectedIndex)
    // on user interaction.
    let hasSelectedOptionChanged = false;

    if (selectedOptions.length) {
      const [firstSelectedOption] = selectedOptions[0];
      hasSelectedOptionChanged =
        this.lastSelectedOption !== firstSelectedOption;
      this.lastSelectedOption = firstSelectedOption;
      this[VALUE] = firstSelectedOption.value;
      this.displayText = firstSelectedOption.displayText;
    } else {
      hasSelectedOptionChanged = this.lastSelectedOption !== null;
      this.lastSelectedOption = null;
      this[VALUE] = '';
      this.displayText = '';
    }

    return hasSelectedOptionChanged;
  }

  /**
   * Focuses and activates the last selected item upon opening, and resets other
   * active items.
   */
  private async handleOpening(e: Event) {
    this.labelEl?.removeAttribute?.('aria-live');
    this.redispatchEvent(e);

    // FocusState.NONE means we want to handle focus ourselves and focus the
    // last selected item.
    if (this.defaultFocus !== FocusState.NONE) {
      return;
    }

    const items = this.menu!.items as SelectOption[];
    const activeItem = getActiveItem(items)?.item;
    let [selectedItem] = this.lastSelectedOptionRecords[0] ?? [null];

    // This is true if the user keys through the list but clicks out of the menu
    // thus no close-menu event is fired by an item and we can't clean up in
    // handleCloseMenu.
    if (activeItem && activeItem !== selectedItem) {
      activeItem.tabIndex = -1;
    }

    // in the case that nothing is selected, focus the first item
    selectedItem = selectedItem ?? items[0];

    if (selectedItem) {
      selectedItem.tabIndex = 0;
      selectedItem.focus();
    }
  }

  private redispatchEvent(e: Event) {
    redispatchEvent(this, e);
  }

  private handleClosed(e: Event) {
    this.open = false;
    this.redispatchEvent(e);
  }

  /**
   * Determines the reason for closing, and updates the UI accordingly.
   */
  private handleCloseMenu(event: CloseMenuEvent) {
    const reason = event.detail.reason;
    const item = event.detail.itemPath[0] as SelectOption;
    this.open = false;
    let hasChanged = false;

    if (reason.kind === 'click-selection') {
      hasChanged = this.selectItem(item);
    } else if (reason.kind === 'keydown' && isSelectableKey(reason.key)) {
      hasChanged = this.selectItem(item);
    } else {
      // This can happen on ESC being pressed
      item.tabIndex = -1;
      item.blur();
    }

    // Dispatch interaction events since selection has been made via keyboard
    // or mouse.
    if (hasChanged) {
      this.dispatchInteractionEvents();
    }
  }

  /**
   * Selects a given option, deselects other options, and updates the UI.
   *
   * @return Whether the last selected option has changed.
   */
  private selectItem(item: SelectOption) {
    const selectedOptions = this.getSelectedOptions() ?? [];
    selectedOptions.forEach(([option]) => {
      if (item !== option) {
        option.selected = false;
      }
    });
    item.selected = true;

    return this.updateValueAndDisplayText();
  }

  /**
   * Handles updating selection when an option element requests selection via
   * property / attribute change.
   */
  private handleRequestSelection(
    event: ReturnType<typeof createRequestSelectionEvent>,
  ) {
    const requestingOptionEl = event.target as SelectOption & HTMLElement;

    // No-op if this item is already selected.
    if (
      this.lastSelectedOptionRecords.some(
        ([option]) => option === requestingOptionEl,
      )
    ) {
      return;
    }

    this.selectItem(requestingOptionEl);
  }

  /**
   * Handles updating selection when an option element requests deselection via
   * property / attribute change.
   */
  private handleRequestDeselection(
    event: ReturnType<typeof createRequestDeselectionEvent>,
  ) {
    const requestingOptionEl = event.target as SelectOption & HTMLElement;

    // No-op if this item is not even in the list of tracked selected items.
    if (
      !this.lastSelectedOptionRecords.some(
        ([option]) => option === requestingOptionEl,
      )
    ) {
      return;
    }

    this.updateValueAndDisplayText();
  }

  /**
   * Attempts to initialize the selected option from user-settable values like
   * SSR, setting `value`, or `selectedIndex` at startup.
   */
  private initUserSelection() {
    // User has set `.value` directly, but internals have not yet booted up.
    if (this.lastUserSetValue && !this.lastSelectedOptionRecords.length) {
      this.select(this.lastUserSetValue);

      // User has set `.selectedIndex` directly, but internals have not yet
      // booted up.
    } else if (
      this.lastUserSetSelectedIndex !== null &&
      !this.lastSelectedOptionRecords.length
    ) {
      this.selectIndex(this.lastUserSetSelectedIndex);

      // Regular boot up!
    } else {
      this.updateValueAndDisplayText();
    }
  }

  private handleIconChange() {
    this.hasLeadingIcon = this.leadingIcons.length > 0;
  }

  /**
   * Dispatches the `input` and `change` events.
   */
  private dispatchInteractionEvents() {
    this.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  private getErrorText() {
    return this.error ? this.errorText : this.nativeErrorText;
  }

  // Writable mixin properties for lit-html binding, needed for lit-analyzer
  declare disabled: boolean;
  declare name: string;

  override [getFormValue]() {
    return this.value;
  }

  override formResetCallback() {
    this.reset();
  }

  override formStateRestoreCallback(state: string) {
    this.value = state;
  }

  [createValidator]() {
    return new SelectValidator(() => this);
  }

  [getValidityAnchor]() {
    return this.field;
  }
}
