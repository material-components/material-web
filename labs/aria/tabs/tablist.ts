/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  css,
  CSSResultGroup,
  html,
  isServer,
  LitElement,
  PropertyValues,
} from 'lit';
import {property, query} from 'lit/decorators.js';

import {
  afterDispatch,
  setupDispatchHooks,
} from '../../../internal/events/dispatch-hooks.js';
import {
  internals,
  mixinElementInternals,
} from '../../behaviors/element-internals.js';

const baseClass = mixinElementInternals(LitElement);

/**
 * An ARIA tablist element.
 */
export class AriaTablistElement extends baseClass {
  static override styles: CSSResultGroup = css`
    :host {
      display: flex;
    }
    :host([orientation='vertical']) {
      flex-direction: column;
    }
  `;

  /**
   * The tabs of this tablist.
   */
  get tabs(): HTMLElement[] {
    return (
      this.slotElement
        ?.assignedElements({flatten: true})
        .filter((el): el is HTMLElement => this.isTab(el as HTMLElement)) ?? []
    );
  }

  /**
   * The currently selected tab, `null` only when there are no tab children.
   *
   * @export
   */
  get selectedTab() {
    return this.tabs.find((tab) => this.isTabSelected(tab)) ?? null;
  }
  set selectedTab(tab: HTMLElement | null) {
    // Ignore setting selectedTab to null. As long as there are children, one
    // tab must be selected.
    if (tab) {
      this.updateSelectedTab(tab);
    }
  }

  /**
   * The index of the currently selected tab.
   *
   * @export
   */
  @property({type: Number})
  get selectedTabIndex() {
    return this.tabs.findIndex((tab) => this.isTabSelected(tab));
  }
  set selectedTabIndex(index: number) {
    const selectTabAtIndex = () => {
      const tab = this.tabs[index];
      // Ignore out-of-bound indices.
      if (tab) {
        this.updateSelectedTab(tab);
      }
    };

    if (!this.slotElement) {
      // This is needed to support setting the selectedTabIndex via a lit
      // property binding.
      //
      // ```ts
      // html`
      //   <md-aria-tablist .selectedTabIndex=${1}>
      //     <md-aria-tab>First</md-aria-tab>
      //     <md-aria-tab>Second</md-aria-tab>
      //   </md-aria-tablist>
      // `;
      // ```
      //
      // It's needed since lit's rendering lifecycle is asynchronous, and the
      // `<slot>` element hasn't rendered, so `tabs` is empty.
      this.updateComplete.then(selectTabAtIndex);
      return;
    }

    selectTabAtIndex();
  }

  /**
   * Whether or not to automatically select a tab when it is focused.
   */
  @property({type: Boolean}) autoSelect = false;

  /**
   * Orientation of the tablist ('horizontal' or 'vertical').
   */
  @property({reflect: true}) orientation: 'horizontal' | 'vertical' =
    'horizontal';

  @query('slot:not([name])')
  private readonly slotElement!: HTMLSlotElement | null;

  constructor() {
    super();
    if (isServer) return;
    this[internals].role = 'tablist';
    setupDispatchHooks(this, 'click', 'focusin');
    this.addEventListener('click', this.handleClick.bind(this));
    this.addEventListener('focusin', this.handleFocusin.bind(this));
  }

  protected override updated(changedProperties: PropertyValues<this>) {
    super.updated(changedProperties);
    if (
      changedProperties.has('orientation') ||
      !this.hasAttribute('focusgroup')
    ) {
      const isVertical = this.orientation === 'vertical';
      this[internals].ariaOrientation = isVertical ? 'vertical' : 'horizontal';
      this.setAttribute(
        'focusgroup',
        `tablist ${isVertical ? 'block' : 'inline'}`,
      );
    }
  }

  protected override render() {
    return html`<slot @slotchange=${this.handleSlotChange}></slot>`;
  }

  /**
   * Returns true if the element is a valid tab component or role. Subclasses
   * may override this method to determine if an element is a supported tab.
   */
  protected isTab(element: HTMLElement): boolean {
    return isAriaTabLike(element);
  }

  /**
   * Returns true if the tab is currently selected. Subclasses may override this
   * method to support custom tab selection implementations.
   */
  protected isTabSelected(tab: HTMLElement): boolean {
    if (!isAriaTabLike(tab)) return false;
    return tab.selected;
  }

  /**
   * Updates the selection state of the tab element and visibility of its
   * tabpanel. Subclasses may override this method to support custom tab
   * selection implementations.
   */
  protected setTabSelected(tab: HTMLElement, isSelected: boolean): void {
    if (!isAriaTabLike(tab)) return;
    tab.selected = isSelected;
    const panel = tab.tabpanelElement as HTMLElement | null;
    if (panel) {
      panel.hidden = !isSelected;
    }
  }

  protected onTabChange(previousTab: HTMLElement | null): void {
    this.dispatchEvent(new Event('change', {bubbles: true}));
  }

  protected updateSelectedTab(tabToSelect: HTMLElement) {
    const {tabs} = this;
    const tabToSelectIndex = tabs.indexOf(tabToSelect);
    if (tabToSelectIndex === -1) {
      // Ignore setting selectedTab to a tab element that is not a child.
      return;
    }

    for (const tab of tabs) {
      this.setTabSelected(tab, tab === tabToSelect);
    }
  }

  private handleClick(event: Event) {
    // event.composedPath() needs to be called before dispatch completes.
    const tab = event
      .composedPath()
      .find((el): el is HTMLElement => this.isTab(el as HTMLElement));

    // Allow event to bubble
    afterDispatch(event, () => {
      if (event.defaultPrevented) {
        return;
      }

      if (tab && !this.isTabSelected(tab)) {
        const previousTab = this.selectedTab;
        this.updateSelectedTab(tab);
        this.onTabChange(previousTab);
      }
    });
  }

  private handleFocusin(event: FocusEvent) {
    if (this.autoSelect) {
      this.handleClick(event);
    }
  }

  protected handleSlotChange() {
    const tabToSelect = this.selectedTab ?? this.tabs[0];
    if (tabToSelect) {
      // Sync tab selection state when slotted content changes. If the active
      // tab was removed or none selected, auto-select the first tab. There
      // should always be a single selected tab while the tablist has children.
      this.updateSelectedTab(tabToSelect);
    }
  }
}

interface AriaTabLike extends HTMLElement {
  selected: boolean;
  tabpanelElement: Element | null;
}

function isAriaTabLike(element: unknown): element is AriaTabLike {
  return Boolean(
    element &&
      typeof element === 'object' &&
      'selected' in element &&
      'tabpanelElement' in element,
  );
}
