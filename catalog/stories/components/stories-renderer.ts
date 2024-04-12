/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/* Slimmed down version of Lit stories stories-renderer without IE renderer */

import './story-knob-panel.js';
import './story-renderer.js';

import {css, html, LitElement, TemplateResult} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

import {KnobValues, PolymorphicArrayOfKnobs} from '../knobs.js';
import {Collection, Story} from '../story.js';

/**
 * Renders a sequence of stories, one after another, optionally with
 * their names and descriptions.
 */
@customElement('stories-renderer')
export class StoriesRenderer extends LitElement {
  static override styles = [
    css`
      :host {
        margin: 0 16px;
        display: flex;
        justify-content: space-between;
      }

      :host([hasknobs]) {
        margin-right: 0;
      }

      :host([fullscreen]) story-renderer {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
      }

      :host([fullwidth]) #rendered-stories {
        width: 100%;
      }

      :host([fullwidth]) story-renderer {
        width: 100%;
      }

      label {
        display: flex;
        align-items: center;
      }
    `,
  ];

  /** If true, will not show the UI for any knobs on this collection. */
  @property({type: Boolean}) hideKnobs: boolean = false;
  @property({attribute: false})
  focusStories?: readonly Story[];
  @property({attribute: false}) collection?: Collection;
  @property({type: Boolean}) hideLabels = false;
  @property({type: Boolean, reflect: true}) hasKnobs = false;
  @state() knobsOpen = true;
  @state() knobsPanelType: 'modal' | 'inline' = 'inline';

  private observedKnobs: undefined | KnobValues<PolymorphicArrayOfKnobs> =
    undefined;

  override render() {
    const collection = this.collection;
    if (collection === undefined) {
      return html``;
    }

    this.updateObservedKnobs();

    const rendered = this.renderStories(this.getStoriesToRender(collection));
    const knobsSection = this.renderKnobs(collection);

    return html`
      <div id="rendered-stories">${rendered}</div>
      ${knobsSection}
    `;
  }

  private renderStories(stories: Story[]): TemplateResult[] {
    return stories.map((story) => {
      let label: string | TemplateResult = '';

      if (!this.hideLabels) {
        const description = story.description
          ? html`<small>${story.description}</small>`
          : '';
        label = html`
          <h3 class="m-headline5">${story.name}</h3>
          ${description}
        `;
      }

      return html`
        <div>
          ${label}
          <story-renderer .story=${story}></story-renderer>
        </div>
      `;
    });
  }

  private renderKnobs(collection: Collection) {
    const knobs = collection.knobs;

    let knobsSection: string | TemplateResult = '';

    this.hasKnobs = !this.hideKnobs && !knobs.empty;

    if (!knobs.empty && !this.hideKnobs) {
      const onOpenChanged = (event: CustomEvent<{open: boolean}>) => {
        this.knobsOpen = event.detail.open;
      };

      knobsSection = html`
        <story-knob-panel
          .open=${this.knobsOpen}
          .type=${this.knobsPanelType}
          @open-changed=${onOpenChanged}>
          ${knobs.renderUI()}
        </story-knob-panel>
      `;
    }

    return knobsSection;
  }

  override connectedCallback() {
    super.connectedCallback();
    this.updateObservedKnobs();

    window.addEventListener('message', this.onWindowMessage);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.unobserveKnobs();
    window.removeEventListener('message', this.onWindowMessage);
  }

  private readonly onWindowMessage = (event: MessageEvent) => {
    const message: string = event.data;

    if (message === 'toggle-knobs-panel') {
      this.knobsOpen = !this.knobsOpen;
    } else if (message === 'modal-knobs-panel') {
      this.knobsPanelType = 'modal';
    } else if (message === 'inline-knobs-panel') {
      this.knobsPanelType = 'inline';
    }
  };

  private updateObservedKnobs() {
    if (this.collection?.knobs === this.observedKnobs) {
      return; // nothing to do;
    }
    // Stop watching the knobs that we're currently observing.
    this.unobserveKnobs();
    const newKnobs = this.collection?.knobs;
    if (newKnobs !== undefined) {
      newKnobs.addEventListener('changed', this.boundRequestUpdate);
    }
    // Keep track of the ones we're observing, so we can later unobserve them.
    this.observedKnobs = newKnobs;
  }

  private getStoriesToRender(collection: Collection): Story[] {
    let storiesToRender: Story[] = [];

    if (this.focusStories) {
      const allowedStories = new Set(collection.stories);
      for (const story of this.focusStories) {
        if (!allowedStories.has(story)) {
          console.error(
            `A stories renderer can only render stories ` +
              `from its collection.`,
          );
        } else {
          storiesToRender.push(story);
        }
      }
    } else {
      storiesToRender = collection.stories;
    }

    return storiesToRender;
  }

  private unobserveKnobs() {
    if (this.observedKnobs !== undefined) {
      this.observedKnobs.removeEventListener(
        'changed',
        this.boundRequestUpdate,
      );
    }
  }

  private readonly boundRequestUpdate = () => {
    this.requestUpdate();
  };
}

declare global {
  interface HTMLElementTagNameMap {
    'stories-renderer': StoriesRenderer;
  }
}
