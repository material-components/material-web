/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 *
 * @requirecss {tabs.tab_indicator.lib.tab_indicator_styles}
 */


import {html, LitElement, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {cssClasses} from './constants.js';

/** @soyCompatible */
export class TabIndicator extends LitElement {
  @query('.md3-tab-indicator') protected root!: HTMLElement;

  @query('.md3-tab-indicator__content') protected contentElement!: HTMLElement;

  @property() icon = '';

  @property({type: Boolean}) fade = false;

  @property({type: Boolean}) active = false;

  /** @soyTemplate */
  protected override render(): TemplateResult {
    /** @classMap */
    const contentClasses = {
      'md3-tab-indicator__content--icon': this.icon,
      'material-icons': this.icon,
      'md3-tab-indicator__content--underline': !this.icon,
    };
    return html`
      <span class="md3-tab-indicator ${classMap({
      'md3-tab-indicator--fade': this.fade,
      'md3-tab-indicator--active': this.active,
    })}">
        <span class="md3-tab-indicator__content ${classMap(contentClasses)}">${
        this.icon}</span>
      </span>
      `;
  }

  computeContentClientRect() {
    return this.contentElement.getBoundingClientRect();
  }

  activate(previousIndicatorClientRect?: DOMRect) {
    if (!this.fade && previousIndicatorClientRect) {
      this.activateSlidingIndicator(previousIndicatorClientRect);
    }
    this.active = true;
  }

  activateSlidingIndicator(previousIndicatorClientRect: DOMRect) {
    const currentClientRect = this.computeContentClientRect();
    const widthDelta =
        previousIndicatorClientRect.width / currentClientRect.width;
    const xPosition = previousIndicatorClientRect.left - currentClientRect.left;
    this.root.classList.add(cssClasses.NO_TRANSITION);
    this.contentElement.style.setProperty(
        'transform', `translateX(${xPosition}px) scaleX(${widthDelta})`);

    // Force repaint before updating classes and transform to ensure the
    // transform properly takes effect
    this.computeContentClientRect();

    this.root.classList.remove(cssClasses.NO_TRANSITION);
    this.contentElement.style.setProperty('transform', '');
  }

  deactivate() {
    this.active = false;
  }
}
