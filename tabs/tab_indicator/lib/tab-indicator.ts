/**
 * @requirecss {tabs.tab_indicator.lib.tab_indicator_styles}
 *
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */


import {Easing} from '@material/web/motion/animation';
import {html, LitElement, TemplateResult} from 'lit';
import {property, query} from 'lit/decorators';
import {classMap} from 'lit/directives/class-map';

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

  private createSlidingIndicatorKeyframes(previousIndicatorClientRect:
                                              DOMRect) {
    const currentClientRect = this.computeContentClientRect();
    const widthDelta =
        previousIndicatorClientRect.width / currentClientRect.width;
    const xPosition = previousIndicatorClientRect.left - currentClientRect.left;
    return [
      {transform: `translateX(${xPosition}px) scaleX(${widthDelta})`},
      {transform: 'translateX(0) scaleX(1)'},
    ];
  }

  activate(previousIndicatorClientRect?: DOMRect) {
    if (!this.fade && previousIndicatorClientRect) {
      this.activateSlidingIndicator(previousIndicatorClientRect);
    }
    this.active = true;
  }

  activateSlidingIndicator(previousIndicatorClientRect: DOMRect) {
    const keyframes =
        this.createSlidingIndicatorKeyframes(previousIndicatorClientRect);
    this.root.animate(keyframes, {duration: 250, easing: Easing.STANDARD});
  }

  deactivate() {
    this.active = false;
  }
}
