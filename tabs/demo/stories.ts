/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/tabs/tabs.js';

import {MaterialStoryInit} from './material-collection.js';
import {MdTabs, TabVariant} from '@material/web/tabs/tabs.js';
import {css, html, nothing} from 'lit';
import {classMap} from 'lit/directives/class-map.js';

/** Knob types for Tabs stories. */
export interface StoryKnobs {
  selected: number;
  disabled: boolean;
  selectOnFocus: boolean;
  inlineIcon: boolean;
  content: string;
}

// TODO(b/293506179): remove vertical logic and styles
const styles = css`
  .content:not([hidden]) {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 8px;
    min-block-size: 24px;
    font-family: Roboto, Material Sans, system-ui;
  }

  .vertical:not([hidden]) {
    display: inline-flex;
    align-items: stretch;
  }

  md-tabs:not([variant~="vertical"]) {
    --inline-size: 50vw;
    min-inline-size: var(--inline-size);
  }

  md-tabs:not([variant~="vertical"]).scrolling {
    inline-size: var(--inline-size);
  }

  md-tabs[variant~="vertical"].scrolling {
    block-size: 50vh;
  }

  .controls {
    height: 48px;
  }
  `;

const primary: MaterialStoryInit<StoryKnobs> = {
  name: 'Primary Tabs',
  styles,
  render(knobs) {
    const tabContent = getTabContentGenerator(knobs);
    const inlineIcon = knobs.inlineIcon;
    const vertical = '';
    const variant = `primary ${vertical}` as TabVariant;
    const classes = {vertical};

    return html`
      <md-tabs
          class=${classMap(classes)}
          .variant=${variant}
          .selected=${knobs.selected}
          .disabled=${knobs.disabled}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('piano', 'Keyboard')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('tune', 'Guitar')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('graphic_eq', 'Drums')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('speaker', 'Bass')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('nightlife', 'Saxophone')}
        </md-tab>
      </md-tabs>`;
  }
};

const secondary: MaterialStoryInit<StoryKnobs> = {
  name: 'Secondary Tabs',
  styles,
  render(knobs) {
    const tabContent = getTabContentGenerator(knobs);
    const inlineIcon = knobs.inlineIcon;
    const vertical = '';
    const variant = `secondary ${vertical}` as TabVariant;
    const classes = {vertical};

    return html`
      <md-tabs
          class=${classMap(classes)}
          .variant=${variant}
          .selected=${knobs.selected}
          .disabled=${knobs.disabled}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('flight', 'Travel')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('hotel', 'Hotel')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('hiking', 'Activities')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('restaurant', 'Food')}
        </md-tab>
      </md-tabs>`;
  }
};

const scrolling: MaterialStoryInit<StoryKnobs> = {
  name: 'Scrolling Tabs',
  styles,
  render(knobs) {
    const tabContent = getTabContentGenerator(knobs);
    const inlineIcon = knobs.inlineIcon;
    const vertical = '';
    const variant = `primary ${vertical}` as TabVariant;
    const classes = {vertical, scrolling: true};

    return html`
      <md-tabs
          class=${classMap(classes)}
          .variant=${variant}
          .selected=${knobs.selected}
          .disabled=${knobs.disabled}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        ${new Array(10).fill(html`
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('piano', 'Keyboard')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('tune', 'Guitar')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('graphic_eq', 'Drums')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('speaker', 'Bass')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('nightlife', 'Saxophone')}
        </md-tab>
        `)}
      </md-tabs>`;
  }
};

const custom: MaterialStoryInit<StoryKnobs> = {
  name: 'Custom Tabs',
  styles: [
    styles,
    css`
      .custom {
        /* text */
        --md-primary-tab-label-text-type: 0.8em cursive, system-ui;
        /* indicator */
        --md-primary-tab-active-indicator-color: firebrick;
        --md-primary-tab-active-indicator-height: 8px;
        --md-primary-tab-active-indicator-shape: 9999px 0;
        /* active/selected tab */
        --active-color: darkorange;
        --md-primary-tab-active-icon-color: var(--active-color);
        --md-primary-tab-active-label-text-color: var(--active-color);
        --md-primary-tab-active-focus-icon-color: var(--active-color);
        --md-primary-tab-active-focus-label-text-color: var(--active-color);
        --md-primary-tab-active-hover-icon-color: var(--active-color);
        --md-primary-tab-active-hover-label-text-color: var(--active-color);
        --md-primary-tab-active-pressed-icon-color: var(--active-color);
        --md-primary-tab-active-pressed-label-text-color: var(--active-color);
        /* divider */
        --md-primary-tab-divider-color: var(--active-color);
        --md-primary-tab-divider-thickness: 4px;
      }`,
  ],
  render(knobs) {
    const tabContent = getTabContentGenerator(knobs);
    const inlineIcon = knobs.inlineIcon;
    const vertical = '';
    const variant = `primary ${vertical}` as TabVariant;
    const classes = {vertical, custom: true};

    return html`
      <md-tabs
          class=${classMap(classes)}
          .variant=${variant}
          .selected=${knobs.selected}
          .disabled=${knobs.disabled}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('flight', 'Travel')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('hotel', 'Hotel')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('hiking', 'Activities')}
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          ${tabContent('restaurant', 'Food')}
        </md-tab>
      </md-tabs>`;
  }
};

const primaryAndSecondary: MaterialStoryInit<StoryKnobs> = {
  name: 'Primary and Secondary Tabs',
  styles,
  render(knobs) {
    const tabContent = getTabContentGenerator(knobs);
    const inlineIcon = knobs.inlineIcon;
    const vertical = '';
    const variant = `primary ${vertical}` as TabVariant;
    const secondaryVariant = `secondary ${vertical}` as TabVariant;
    const classes = {vertical};

    // show the selected secondary tabs
    const handlePrimaryTabsChange = ({target}: Event) => {
      const primaryTabs = target as MdTabs;
      const secondaryTabsContainer = primaryTabs.nextElementSibling!;
      const secondaryTabsList = Array.from(
          secondaryTabsContainer.querySelectorAll<MdTabs>('md-tabs'));
      secondaryTabsList.forEach((secondaryTabs, i) => {
        const hidden = i === primaryTabs.selected ? false : true;
        secondaryTabs.hidden = hidden;
        (secondaryTabs.nextElementSibling! as HTMLElement).hidden = hidden;
      });
    };

    // renders some relevant tabbed content based on the current selection
    function handleSecondaryTabsChange({target}: Event) {
      const secondaryTabs = target as MdTabs;
      const contentContainer = secondaryTabs.nextElementSibling!;
      const content = Array.from(secondaryTabs.selectedItem?.childNodes ?? [])
                          .map(child => child.cloneNode(true));
      contentContainer.replaceChildren(...content);
    }

    return html`
      <div class="${classMap(classes)}">
        <md-tabs
          class=${classMap(classes)}
          .variant=${variant}
          .selected=${knobs.selected}
          .disabled=${knobs.disabled}
          .selectOnFocus=${knobs.selectOnFocus}
          @change=${handlePrimaryTabsChange}
        >
          <md-tab .inlineIcon=${inlineIcon}>
            ${tabContent('videocam', 'Movies')}
          </md-tab>
          <md-tab .inlineIcon=${inlineIcon}>
            ${tabContent('photo', 'Photos')}
          </md-tab>
          <md-tab .inlineIcon=${inlineIcon}>
            ${tabContent('audiotrack', 'Music')}
          </md-tab>
        </md-tabs>
        <div class=${classMap(classes)}>
          <md-tabs
            class=${classMap(classes)}
            .variant=${secondaryVariant}
            .selected=${knobs.selected}
            .disabled=${knobs.disabled}
            .selectOnFocus=${knobs.selectOnFocus}
            @change=${handleSecondaryTabsChange}
          >
            <md-tab >Star Wars</md-tab>
            <md-tab>Avengers</md-tab>
            <md-tab>Jaws</md-tab>
            <md-tab>Frozen</md-tab>
          </md-tabs>
          <div class="content ${classMap(classes)}"></div>
          <md-tabs
            hidden
            class=${classMap(classes)}
            .variant=${secondaryVariant}
            .selected=${knobs.selected}
            .disabled=${knobs.disabled}
            .selectOnFocus=${knobs.selectOnFocus}
            @change=${handleSecondaryTabsChange}
          >
            <md-tab>Yosemite</md-tab>
            <md-tab>Mona Lisa</md-tab>
            <md-tab>Swiss Alps</md-tab>
            <md-tab>Niagra Falls</md-tab>
          </md-tabs>
          <div hidden class="content ${classMap(classes)}"></div>
          <md-tabs
            hidden
            class=${classMap(classes)}
            .variant=${secondaryVariant}
            .selected=${knobs.selected}
            .disabled=${knobs.disabled}
            .selectOnFocus=${knobs.selectOnFocus}
            @change=${handleSecondaryTabsChange}
          >
            <md-tab>Rock</md-tab>
            <md-tab>Ambient</md-tab>
            <md-tab>Soundscapes</md-tab>
            <md-tab>White Noise</md-tab>
          </md-tabs>
          <div hidden class="content ${classMap(classes)}"></div>
        </div>
      </div>
      `;
  }
};

const dynamic: MaterialStoryInit<StoryKnobs> = {
  name: 'Dynamic Tabs',
  styles,
  render(knobs) {
    const inlineIcon = knobs.inlineIcon;
    const vertical = '';
    const variant = `primary ${vertical}` as TabVariant;
    const classes = {vertical, scrolling: true};

    function getTabs(event: Event) {
      return ((event.target! as Element).getRootNode() as ShadowRoot)
          .querySelector('md-tabs')!;
    }

    function addTab(event: Event) {
      const tabs = getTabs(event);
      const count = tabs.childElementCount;
      const tab = document.createElement('md-tab');
      tab.textContent = `Tab ${count + 1}`;
      if (tabs.selectedItem !== undefined) {
        tabs.selectedItem.after(tab);
        tabs.selected++;
      } else {
        tabs.append(tab);
        tabs.selected = count;
      }
    }
    function removeTab(event: Event) {
      const tabs = getTabs(event);
      if (tabs.selectedItem === undefined) {
        return;
      }
      tabs.selectedItem?.remove();
      const count = tabs.childElementCount;
      tabs.selected = Math.min(count - 1, tabs.selected);
    }

    function moveTabTowardsEnd(event: Event) {
      const tabs = getTabs(event);
      const next = tabs.selectedItem?.nextElementSibling;
      if (next) {
        next.after(tabs.selectedItem);
        tabs.selected++;
      }
    }

    function moveTabTowardsStart(event: Event) {
      const tabs = getTabs(event);
      const previous = tabs.selectedItem?.previousElementSibling;
      if (previous) {
        previous.before(tabs.selectedItem);
        tabs.selected--;
      }
    }

    return html`
      <div class="controls">
        <md-standard-icon-button @click=${
        addTab}><md-icon>add</md-icon></md-standard-icon-button>
        <md-standard-icon-button @click=${
        removeTab}><md-icon>remove</md-icon></md-standard-icon-button>
        <md-standard-icon-button @click=${
        moveTabTowardsStart}><md-icon>chevron_left</md-icon></md-standard-icon-button>
        <md-standard-icon-button @click=${
        moveTabTowardsEnd}><md-icon>chevron_right</md-icon></md-standard-icon-button>
      </div>
      <md-tabs
          class=${classMap(classes)}
          .variant=${variant}
          .selected=${knobs.selected}
          .disabled=${knobs.disabled}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        <md-tab .inlineIcon=${inlineIcon}>
          Tab 1
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          Tab 2
        </md-tab>
        <md-tab .inlineIcon=${inlineIcon}>
          Tab 3
        </md-tab>
      </md-tabs>`;
  }
};

function getTabContentGenerator(knobs: StoryKnobs) {
  const contentKnob = knobs.content;
  const useIcon = contentKnob !== 'label';
  const useLabel = contentKnob !== 'icon';
  return (icon: string, label: string) => {
    const iconTemplate =
        html`<md-icon aria-hidden="true" slot="icon">${icon}</md-icon>`;
    return html`
      ${useIcon ? iconTemplate : nothing}
      ${useLabel ? html`${label}` : nothing}
    `;
  };
}

/** Tabs stories. */
export const stories =
    [primary, secondary, scrolling, custom, primaryAndSecondary, dynamic];
