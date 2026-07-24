/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css, CSSResultGroup, html, isServer, LitElement} from 'lit';
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
  @property({type: String, reflect: true})
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  @query('slot:not([name])')
  private readonly slotElement!: HTMLSlotElement | null;

  protected get focusedTab() {
    return this.tabs.find((tab) => tab.matches(':focus-within'));
  }

  constructor() {
    super();
    if (isServer) return;
    this[internals].role = 'tablist';
    setupDispatchHooks(this, 'click', 'keydown');
    this.addEventListener('click', this.handleClick.bind(this));
    this.addEventListener('keydown', this.handleKeydown.bind(this));
    this.addEventListener('focusout', this.handleFocusout.bind(this));
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

    this.updateFocusableTab(tabToSelect);
  }

  protected updateFocusableTab(focusableTab: HTMLElement) {
    for (const tab of this.tabs) {
      tab.tabIndex = tab === focusableTab ? 0 : -1;
    }
  }

  private async handleClick(event: Event) {
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

  protected handleSlotChange() {
    const tabToSelect = this.selectedTab ?? this.tabs[0];
    if (tabToSelect) {
      // Sync tab selection state when slotted content changes. If the active
      // tab was removed or none selected, auto-select the first tab. There
      // should always be a single selected tab while the tablist has children.
      this.updateSelectedTab(tabToSelect);
    }
  }

  // focus item on keydown and optionally select it
  private handleKeydown(event: KeyboardEvent) {
    // Allow event to bubble.
    afterDispatch(event, () => {
      const isLeft = event.key === 'ArrowLeft';
      const isRight = event.key === 'ArrowRight';
      const isUp = event.key === 'ArrowUp';
      const isDown = event.key === 'ArrowDown';
      const isHome = event.key === 'Home';
      const isEnd = event.key === 'End';
      const isVertical = this.orientation === 'vertical';
      const isDirectionKey = isVertical ? isUp || isDown : isLeft || isRight;
      // Ignore non-navigation keys
      if (event.defaultPrevented || (!isDirectionKey && !isHome && !isEnd)) {
        return;
      }

      const {tabs} = this;
      // Don't try to select another tab if there aren't any.
      if (tabs.length < 2) {
        return;
      }

      // Prevent default interactions, such as scrolling.
      event.preventDefault();

      let indexToFocus: number;
      if (isHome || isEnd) {
        indexToFocus = isHome ? 0 : tabs.length - 1;
      } else {
        // Check if moving forwards or backwards
        const isRtl = getComputedStyle(this).direction === 'rtl';
        const forwards = isVertical ? isDown : isRtl ? isLeft : isRight;
        const {focusedTab} = this;
        if (!focusedTab) {
          // If there is not already a tab focused, select the first or last tab
          // based on the direction we're traveling.
          indexToFocus = forwards ? 0 : tabs.length - 1;
        } else {
          const focusedIndex = this.tabs.indexOf(focusedTab);
          indexToFocus = forwards ? focusedIndex + 1 : focusedIndex - 1;
          if (indexToFocus >= tabs.length) {
            // Return to start if moving past the last item.
            indexToFocus = 0;
          } else if (indexToFocus < 0) {
            // Go to end if moving before the first item.
            indexToFocus = tabs.length - 1;
          }
        }
      }

      const tabToFocus = tabs[indexToFocus];
      tabToFocus.focus();
      if (this.autoSelect) {
        const previousTab = this.selectedTab;
        this.updateSelectedTab(tabToFocus);
        this.onTabChange(previousTab);
      } else {
        this.updateFocusableTab(tabToFocus);
      }
    });
  }

  private handleFocusout() {
    // restore focus to selected item when blurring the tab bar.
    if (this.matches(':focus-within')) {
      return;
    }

    const {selectedTab} = this;
    if (selectedTab) {
      this.updateFocusableTab(selectedTab);
    }
  }
}

interface AriaTabLike extends HTMLElement {
  selected: boolean;
  tabpanelElement: Element | null;
}

function isAriaTabLike(element: Element): element is AriaTabLike {
  return 'selected' in element && 'tabpanelElement' in element;
}
