/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '../../menu/menu.js';

import {html, LitElement, nothing, PropertyValues, TemplateResult} from 'lit';
import {property, query, queryAssignedElements, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';
import {html as staticHtml, StaticValue} from 'lit/static-html.js';

import {Field} from '../../field/lib/field.js';
import {List} from '../../list/lib/list.js';
import {DEFAULT_TYPEAHEAD_BUFFER_TIME, Menu} from '../../menu/lib/menu.js';
import {DefaultCloseMenuEvent, isElementInSubtree, isSelectableKey} from '../../menu/lib/shared.js';
import {TYPEAHEAD_RECORD} from '../../menu/lib/typeaheadController.js';

import {getSelectedItems, RequestDeselectionEvent, RequestSelectionEvent, SelectOption, SelectOptionRecord} from './shared.js';

/**
 * @fires input Fired when a selection is made by the user via mouse or keyboard
 * interaction.
 * @fires change Fired when a selection is made by the user via mouse or
 * keyboard interaction.
 */
export abstract class Select extends LitElement {
  /**
   * Opens the menu synchronously with no animation.
   */
  @property({type: Boolean}) quick = false;
  /**
   * Whether or not the select is required.
   */
  @property({type: Boolean}) required = false;
  /**
   * Disables the select.
   */
  @property({type: Boolean, reflect: true}) disabled = false;
  /**
   * The error message that replaces supporting text when `error` is true. If
   * `errorText` is an empty string, then the supporting text will continue to
   * show.
   *
   * Calling `reportValidity()` will automatically update `errorText` to the
   * native `validationMessage`.
   */
  @property({type: String}) errorText = '';
  /**
   * The floating label for the field.
   */
  @property() label = '';
  /**
   * Conveys additional information below the text field, such as how it should
   * be used.
   */
  @property({type: String}) supportingText = '';
  /**
   * Gets or sets whether or not the text field is in a visually invalid state.
   *
   * Calling `reportValidity()` will automatically update `error`.
   */
  @property({type: Boolean, reflect: true}) error = false;
  /**
   * Whether or not the underlying md-menu should be position: fixed to display
   * in a top-level manner.
   */
  @property({type: Boolean}) menuFixed = false;
  /**
   * The max time between the keystrokes of the typeahead select / menu behavior
   * before it clears the typeahead buffer.
   */
  @property({type: Number}) typeaheadBufferTime = DEFAULT_TYPEAHEAD_BUFFER_TIME;
  /**
   * Whether or not the text field has a leading icon. Used for SSR.
   */
  @property({type: Boolean}) hasLeadingIcon = false;
  /**
   * Whether or not the text field has a trailing icon. Used for SSR.
   */
  @property({type: Boolean}) hasTrailingIcon = false;
  /**
   * Text to display in the field. Only set for SSR.
   */
  @property() displayText = '';
  /**
   * When set to true, the error text's `role="alert"` will be removed, then
   * re-added after an animation frame. This will re-announce an error message
   * to screen readers.
   */
  @state() protected refreshErrorAlert = false;
  @state() protected focused = false;
  @state() protected open = false;
  @query('.field') protected field!: Field;
  @query('md-menu') protected menu!: Menu;
  @queryAssignedElements({slot: 'leadingicon', flatten: true})
  protected readonly leadingIcons!: Element[];
  @queryAssignedElements({slot: 'trailingicon', flatten: true})
  protected readonly trailingIcons!: Element[];

  /**
   * The value of the currently selected option.
   *
   * Note: For SSR, set `[selected]` on the requested option and `displayText`
   * rather than setting `value` setting `value` will incur a DOM query.
   */
  @property()
  get value(): string {
    return this._value;
  }

  set value(value: string) {
    this.lastUserSetValue = value;
    this.select(value);
  }

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
  @property({type: Number})
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
  // tslint:disable-next-line:enforce-name-casing
  protected _value = '';

  /**
   * Used for initializing select when the user sets the `value` directly.
   */
  protected lastUserSetValue: string|null = null;

  /**
   * Used for initializing select when the user sets the `selectedIndex`
   * directly.
   */
  protected lastUserSetSelectedIndex: number|null = null;

  /**
   * Used for `input` and `change` event change detection.
   */
  protected lastSelectedOption: SelectOption|null = null;

  // tslint:disable-next-line:enforce-name-casing
  protected _lastSelectedOptionRecords: SelectOptionRecord[] = [];

  override render(): TemplateResult {
    return html`
      <span
          class="select ${classMap(this.getRenderClasses())}"
          @focusout=${this.handleFocusout}>
        ${this.renderField()}
        ${this.renderMenu()}
      </span>
    `;
  }

  protected getRenderClasses(): ClassInfo {
    return {
      'disabled': this.disabled,
      'error': this.error,
    };
  }

  protected renderField() {
    return staticHtml`
      <${this.fieldTag}
          aria-haspopup="listbox"
          role="combobox"
          tabindex=${this.disabled ? '-1' : '0'}
          aria-expanded=${this.open ? 'true' : 'false'}
          class="field"
          label=${this.label}
          .focused=${this.focused || this.open}
          .populated=${!!this.displayText}
          .disabled=${this.disabled}
          .required=${this.required}
          .error=${this.error}
          .hasStart=${this.hasLeadingIcon}
          .hasEnd=${this.hasTrailingIcon}
          @keydown =${this.handleKeydown}
          @click=${this.handleClick}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}>
        ${this.renderFieldContent()}
      </${this.fieldTag}>`;
  }

  protected renderFieldContent() {
    return [
      this.renderLeadingIcon(),
      this.renderLabel(),
      this.renderTrailingIcon(),
      this.renderSupportingText(),
    ];
  }

  protected renderLeadingIcon() {
    return html`
      <span class="icon leading" slot="start">
         <slot name="leadingicon" @slotchange=${this.handleIconChange}></slot>
      </span>
     `;
  }

  protected renderTrailingIcon() {
    return html`
      <span class="icon trailing" slot="end">
         <slot name="trailingicon" @slotchange=${this.handleIconChange}></slot>
      </span>
     `;
  }

  protected renderLabel() {
    // need to render &nbsp; so that line-height can apply and give it a
    // non-zero height
    return html`<div
        id="label"
        class="label">${this.displayText || html`&nbsp;`}</div>`;
  }

  protected renderSupportingText() {
    const text = this.getSupportingText();
    if (!text) {
      return nothing;
    }

    return html`<span id="support"
      slot="supporting-text"
      role=${this.shouldErrorAnnounce() ? 'alert' : nothing}>${text}</span>`;
  }

  protected getSupportingText() {
    return this.error && this.errorText ? this.errorText : this.supportingText;
  }

  protected shouldErrorAnnounce() {
    // Announce if there is an error and error text visible.
    // If refreshErrorAlert is true, do not announce. This will remove the
    // role="alert" attribute. Another render cycle will happen after an
    // animation frame to re-add the role.
    return this.error && !!this.errorText && !this.refreshErrorAlert;
  }

  protected renderMenu(): TemplateResult {
    return html`
      <md-menu
          id="listbox"
          default-focus="NONE"
          listTabIndex="-1"
          list-role="listbox"
          stay-open-on-focusout
          .anchor=${this.field}
          .open=${this.open}
          .quick=${this.quick}
          .fixed=${this.menuFixed}
          .typeaheadBufferTime=${this.typeaheadBufferTime}
          @opening=${this.handleOpening}
          @closing=${this.handleClosing}
          @close-menu=${this.handleCloseMenu}
          @request-selection=${this.handleRequestSelection}
          @request-deselection=${this.handleRequestDeselection}>
        ${this.renderMenuContent()}
      </md-menu>`;
  }

  protected renderMenuContent(): TemplateResult {
    return html`<slot></slot>`;
  }

  /**
   * Handles opening the select on keydown and typahead selection when the menu
   * is closed.
   */
  protected handleKeydown(e: KeyboardEvent) {
    if (this.open || this.disabled) {
      return;
    }

    const typeaheadController = this.menu?.typeaheadController;
    const isOpenKey =
        e.code === 'Space' || e.code === 'ArrowDown' || e.code === 'Enter';

    // Do not open if currently typing ahead because the user may be typing the
    // spacebar to match a word with a space
    if (!typeaheadController.isTypingAhead && isOpenKey) {
      e.preventDefault();
      this.open = true;
      return;
    }

    const isPrintableKey = e.key.length === 1;

    // Handles typing ahead when the menu is closed by delegating the event to
    // the underlying menu's typeaheadController
    if (isPrintableKey) {
      typeaheadController.onKeydown(e);
      e.preventDefault();

      const {lastActiveRecord} = typeaheadController;

      if (!lastActiveRecord) {
        return;
      }

      const hasChanged = this.selectItem(
          lastActiveRecord[TYPEAHEAD_RECORD.ITEM] as SelectOption);

      if (hasChanged) {
        this.dispatchInteractionEvents();
      }
    }
  }

  protected handleClick() {
    this.open = true;
  }

  protected handleFocus() {
    this.focused = true;
  }

  protected handleBlur() {
    this.focused = false;
  }

  /**
   * Handles closing the menu when the focus leaves the select's subtree.
   */
  protected handleFocusout(e: FocusEvent) {
    // Don't close the menu if we are switching focus between menu,
    // select-option, and field
    if (e.relatedTarget && isElementInSubtree(e.relatedTarget, this)) {
      return;
    }

    this.open = false;
  }

  /**
   * Gets a list of all selected select options as a list item record array.
   *
   * @return An array of selected list option records.
   */
  protected getSelectedOptions() {
    if (!this.menu) {
      this._lastSelectedOptionRecords = [];
      return null;
    }

    const items = this.menu.items as SelectOption[];
    this._lastSelectedOptionRecords = getSelectedItems(items);
    return this._lastSelectedOptionRecords;
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
  protected updateValueAndDisplayText() {
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
      this._value = firstSelectedOption.value;
      this.displayText = firstSelectedOption.headline;

    } else {
      hasSelectedOptionChanged = this.lastSelectedOption !== null;
      this.lastSelectedOption = null;
      this._value = '';
      this.displayText = '';
    }

    return hasSelectedOptionChanged;
  }

  override update(changed: PropertyValues<this>) {
    // In SSR the options will be ready to query, so try to figure out what
    // the value and display text should be.
    if (!this.hasUpdated) {
      this.initUserSelection();
    }

    super.update(changed);
  }

  override async firstUpdated(changed: PropertyValues<this>) {
    await this.menu.updateComplete;
    // If this has been handled on update already due to SSR, try again.
    if (!this._lastSelectedOptionRecords.length) {
      this.initUserSelection();
    }

    super.firstUpdated(changed);
  }

  protected override updated(changedProperties: PropertyValues) {
    // Keep changedProperties arg so that subclasses may call it

    if (this.refreshErrorAlert) {
      // The past render cycle removed the role="alert" from the error message.
      // Re-add it after an animation frame to re-announce the error.
      requestAnimationFrame(() => {
        this.refreshErrorAlert = false;
      });
    }
  }

  /**
   * Focuses and activates the last selected item upon opening, and resets other
   * active items.
   */
  protected async handleOpening() {
    const items = this.menu.items;
    const activeItem = List.getActiveItem(items)?.item;
    const [selectedItem] = this._lastSelectedOptionRecords[0] ?? [null];

    // This is true if the user keys through the list but clicks out of the menu
    // thus no close-menu event is fired by an item and we can't clean up in
    // handleCloseMenu.
    if (activeItem && activeItem !== selectedItem) {
      activeItem.active = false;
    }

    if (selectedItem) {
      selectedItem.active = true;
      selectedItem.focus();
    }
  }

  protected handleClosing() {
    this.open = false;
  }

  /**
   * Determines the reason for closing, and updates the UI accordingly.
   */
  protected handleCloseMenu(e: InstanceType<typeof DefaultCloseMenuEvent>) {
    const reason = e.reason;
    const item = e.itemPath[0] as SelectOption;
    this.open = false;
    let hasChanged = false;

    if (reason.kind === 'CLICK_SELECTION') {
      hasChanged = this.selectItem(item);
    } else if (reason.kind === 'KEYDOWN' && isSelectableKey(reason.key)) {
      hasChanged = this.selectItem(item);
    } else {
      // This can happen on ESC being pressed
      item.active = false;
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
  protected selectItem(item: SelectOption) {
    this._lastSelectedOptionRecords.forEach(([option]) => {
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
  protected handleRequestSelection(e: RequestSelectionEvent) {
    const requestingOptionEl = e.target as SelectOption & HTMLElement;

    // No-op if this item is already selected.
    if (this._lastSelectedOptionRecords.some(
            ([option]) => option === requestingOptionEl)) {
      return;
    }

    this.selectItem(requestingOptionEl);
  }

  /**
   * Handles updating selection when an option element requests deselection via
   * property / attribute change.
   */
  protected handleRequestDeselection(e: RequestDeselectionEvent) {
    const requestingOptionEl = e.target as SelectOption & HTMLElement;

    // No-op if this item is not even in the list of tracked selected items.
    if (!this._lastSelectedOptionRecords.some(
            ([option]) => option === requestingOptionEl)) {
      return;
    }

    this.updateValueAndDisplayText();
  }

  /**
   * Selects an option given the value of the option, and updates MdSelect's
   * value.
   */
  select(value: string) {
    const optionToSelect = this.options.find(option => option.value === value);
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
   * Attempts to initialize the selected option from user-settable values like
   * SSR, setting `value`, or `selectedIndex` at startup.
   */
  protected initUserSelection() {
    // User has set `.value` directly, but internals have not yet booted up.
    if (this.lastUserSetValue && !this._lastSelectedOptionRecords.length) {
      this.select(this.lastUserSetValue);

      // User has set `.selectedIndex` directly, but internals have not yet
      // booted up.
    } else if (
        this.lastUserSetSelectedIndex !== null &&
        !this._lastSelectedOptionRecords.length) {
      this.selectIndex(this.lastUserSetSelectedIndex);

      // Regular boot up!
    } else {
      this.updateValueAndDisplayText();
    }
  }

  protected handleIconChange() {
    this.hasLeadingIcon = this.leadingIcons.length > 0;
    this.hasTrailingIcon = this.trailingIcons.length > 0;
  }

  /**
   * Dispatches the `input` and `change` events.
   */
  protected dispatchInteractionEvents() {
    this.dispatchEvent(new Event('input', {bubbles: true, composed: true}));
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }
}
