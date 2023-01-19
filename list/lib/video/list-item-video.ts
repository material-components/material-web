/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {html, LitElement, nothing, TemplateResult} from 'lit';
import {property} from 'lit/decorators.js';

/**
 * @fires loadeddata {Event} Dispatched whenever the native HTMLVideoElement
 * fires the loadeddate event.
 */
export class ListItemVideo extends LitElement {
  /**
   * Displays the video in a taller format
   */
  @property({type: Boolean}) large = false;

  /**
   * The underlying `<video>`'s `autoplay` property.
   */
  @property({type: Boolean}) autoplay = false;

  /**
   * The underlying `<video>`'s `muted` property.
   */
  @property({type: Boolean}) muted = false;

  /**
   * The underlying `<video>`'s `loop` property.
   */
  @property({type: Boolean}) loop = false;

  /**
   * The underlying `<video>`'s `controls` property.
   */
  @property({type: Boolean}) controls = false;

  /**
   * The underlying `<video>`'s `playsinline` property.
   */
  @property({type: Boolean}) playsinline = false;

  /**
   * The underlying `<video>`'s `preload` property.
   */
  @property({type: String}) preload: ''|'auto'|'metadata'|'none' = '';

  /**
   * The underlying `<video>`'s `poster` property.
   */
  @property({type: String}) poster = '';

  /**
   * The `src` of the video.
   */
  @property({type: String}) video = '';

  /**
   * The `alt` attribute if the video.
   */
  @property({type: String}) altText = '';

  override render(): TemplateResult {
    return html`
        <video
            @loadeddata=${() => this.dispatchEvent(new Event('loadeddata'))}
            .src="${this.video || nothing}"
            .poster="${this.poster || nothing}"
            alt="${this.altText || nothing}"
            .autoplay=${this.autoplay}
            .muted=${this.muted}
            .loop=${this.loop}
            .playsinline=${this.playsinline}
            .controls=${this.controls}
            class="md3-list-item__video ${this.large ? 'large' : ''}">
          <slot></slot>
        </video>
      `;
  }
}
