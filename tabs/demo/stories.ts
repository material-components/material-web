/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/tabs/tabs.js';
import '@material/web/tabs/primary-tab.js';
import '@material/web/tabs/secondary-tab.js';

import {MaterialStoryInit} from './material-collection.js';
import {MdTabs} from '@material/web/tabs/tabs.js';
import {css, html, nothing} from 'lit';

/** Knob types for Tabs stories. */
export interface StoryKnobs {
  selected: number;
  selectOnFocus: boolean;
  inlineIcon: boolean;
  content: string;
}

const styles = css`
  .content:not([hidden]) {
    display: flex;
    align-items: center;
    padding: 16px;
    gap: 8px;
    min-block-size: 24px;
    font-family: Roboto, Material Sans, system-ui;
  }

  md-tabs {
    --inline-size: 50vw;
    min-inline-size: var(--inline-size);
  }

  md-tabs.scrolling {
    inline-size: var(--inline-size);
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

    return html`
      <md-tabs
          .selected=${knobs.selected}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('piano', 'Keyboard')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('tune', 'Guitar')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('graphic_eq', 'Drums')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('speaker', 'Bass')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('nightlife', 'Saxophone')}
        </md-primary-tab>
      </md-tabs>`;
  }
};

const secondary: MaterialStoryInit<StoryKnobs> = {
  name: 'Secondary Tabs',
  styles,
  render(knobs) {
    const tabContent = getTabContentGenerator(knobs);
    const inlineIcon = knobs.inlineIcon;

    return html`
      <md-tabs
          .selected=${knobs.selected}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        <md-secondary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('flight', 'Travel')}
        </md-secondary-tab>
        <md-secondary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('hotel', 'Hotel')}
        </md-secondary-tab>
        <md-secondary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('hiking', 'Activities')}
        </md-secondary-tab>
        <md-secondary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('restaurant', 'Food')}
        </md-secondary-tab>
      </md-tabs>`;
  }
};

const scrolling: MaterialStoryInit<StoryKnobs> = {
  name: 'Scrolling Tabs',
  styles,
  render(knobs) {
    const tabContent = getTabContentGenerator(knobs);
    const inlineIcon = knobs.inlineIcon;

    return html`
      <md-tabs
          class="scrolling"
          .selected=${knobs.selected}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        ${new Array(10).fill(html`
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('piano', 'Keyboard')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('tune', 'Guitar')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('graphic_eq', 'Drums')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('speaker', 'Bass')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('nightlife', 'Saxophone')}
        </md-primary-tab>
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
      }

      .custom::part(divider) {
        --md-divider-color: var(--active-color);
        --md-divider-thickness: 4px;
      }
    `,
  ],
  render(knobs) {
    const tabContent = getTabContentGenerator(knobs);
    const inlineIcon = knobs.inlineIcon;

    return html`
      <md-tabs
          class="custom"
          .selected=${knobs.selected}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('flight', 'Travel')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('hotel', 'Hotel')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('hiking', 'Activities')}
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          ${tabContent('restaurant', 'Food')}
        </md-primary-tab>
      </md-tabs>`;
  }
};

const primaryAndSecondary: MaterialStoryInit<StoryKnobs> = {
  name: 'Primary and Secondary Tabs',
  styles,
  render(knobs) {
    const tabContent = getTabContentGenerator(knobs);
    const inlineIcon = knobs.inlineIcon;

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
      <div>
        <md-tabs
          .selected=${knobs.selected}
          .selectOnFocus=${knobs.selectOnFocus}
          @change=${handlePrimaryTabsChange}
        >
          <md-primary-tab .inlineIcon=${inlineIcon}>
            ${tabContent('videocam', 'Movies')}
          </md-primary-tab>
          <md-primary-tab .inlineIcon=${inlineIcon}>
            ${tabContent('photo', 'Photos')}
          </md-primary-tab>
          <md-primary-tab .inlineIcon=${inlineIcon}>
            ${tabContent('audiotrack', 'Music')}
          </md-primary-tab>
        </md-tabs>
        <div>
          <md-tabs
            .selected=${knobs.selected}
            .selectOnFocus=${knobs.selectOnFocus}
            @change=${handleSecondaryTabsChange}
          >
            <md-secondary-tab>Star Wars</md-secondary-tab>
            <md-secondary-tab>Avengers</md-secondary-tab>
            <md-secondary-tab>Jaws</md-secondary-tab>
            <md-secondary-tab>Frozen</md-secondary-tab>
          </md-tabs>
          <div class="content"></div>
          <md-tabs
            hidden
            .selected=${knobs.selected}
            .selectOnFocus=${knobs.selectOnFocus}
            @change=${handleSecondaryTabsChange}
          >
            <md-secondary-tab>Yosemite</md-secondary-tab>
            <md-secondary-tab>Mona Lisa</md-secondary-tab>
            <md-secondary-tab>Swiss Alps</md-secondary-tab>
            <md-secondary-tab>Niagra Falls</md-secondary-tab>
          </md-tabs>
          <div hidden class="content"></div>
          <md-tabs
            hidden
            .selected=${knobs.selected}
            .selectOnFocus=${knobs.selectOnFocus}
            @change=${handleSecondaryTabsChange}
          >
            <md-secondary-tab>Rock</md-secondary-tab>
            <md-secondary-tab>Ambient</md-secondary-tab>
            <md-secondary-tab>Soundscapes</md-secondary-tab>
            <md-secondary-tab>White Noise</md-secondary-tab>
          </md-tabs>
          <div hidden class="content"></div>
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

    function getTabs(event: Event) {
      return ((event.target! as Element).getRootNode() as ShadowRoot)
          .querySelector('md-tabs')!;
    }

    function addTab(event: Event) {
      const tabs = getTabs(event);
      const count = tabs.childElementCount;
      const tab = document.createElement('md-primary-tab');
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
        <md-icon-button @click=${addTab}><md-icon>add</md-icon></md-icon-button>
        <md-icon-button @click=${
        removeTab}><md-icon>remove</md-icon></md-icon-button>
        <md-icon-button @click=${
        moveTabTowardsStart}><md-icon>chevron_left</md-icon></md-icon-button>
        <md-icon-button @click=${
        moveTabTowardsEnd}><md-icon>chevron_right</md-icon></md-icon-button>
      </div>
      <md-tabs
          class="scrolling"
          .selected=${knobs.selected}
          .selectOnFocus=${knobs.selectOnFocus}
      >
        <md-primary-tab .inlineIcon=${inlineIcon}>
          Tab 1
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          Tab 2
        </md-primary-tab>
        <md-primary-tab .inlineIcon=${inlineIcon}>
          Tab 3
        </md-primary-tab>
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
