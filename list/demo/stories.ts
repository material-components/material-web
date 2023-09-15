/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/list/list-item.js';
import '@material/web/divider/divider.js';
import '@material/web/list/list.js';
import '@material/web/icon/icon.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html} from 'lit';

/** Knob types for list stories. */
export interface StoryKnobs {
  listTabIndex: number;

  'md-list-item': void;
  disabled: boolean;
  noninteractive: boolean;
  multiLineSupportingText: boolean;
  headline: string;
  supportingText: string;
  trailingSupportingText: string;
  href: string;
  target: string;
  'link end icon': string;

  'slot[name=start|end-icon]': void;
  'start icon': string;
  'end icon': string;

  'slot[name=start-avatar]': void;
  'avatar img': string;
  'avatar label': string;

  'slot[name=start-image]': void;
  image: string;

  'slot[name=start-video]': void;
  'slot[name=start-video-large]': boolean;
  'video src': string;
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-list>',
  styles: css`
    .list-demo {
      border-radius: 8px;
      border: 1px solid var(--md-sys-color-outline);
      max-width: 360px;
      overflow: hidden;
      width: 100%;
    }

    .list {
      max-width: 200px;
    }`,
  render(knobs) {
    const {
      listTabIndex,
      disabled,
      noninteractive,
      multiLineSupportingText,
      headline,
      supportingText,
      trailingSupportingText,
      href,
      target,
      image,
    } = knobs;
    return html`
      <div class="list-demo">
        <md-list
            .listTabIndex=${listTabIndex}
            class="list">
          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}>
          </md-list-item>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}>
            <md-icon slot="start-icon">
              ${knobs['start icon']}
            </md-icon>
            <md-icon slot="end-icon">
              ${knobs['end icon']}
            </md-icon>
          </md-list-item>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}
              .href=${href}
              .target=${target as '' | '_blank' | '_parent' | '_self' | '_top'}>
            <md-icon slot="end-icon">${knobs['link end icon']}</md-icon>
          </md-list-item>

          <md-divider></md-divider>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}>
            <img src=${knobs['avatar img']} slot="start-avatar">
          </md-list-item>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}>
            <span slot="start-avatar">
              ${knobs['avatar label']}
            </span>
          </md-list-item>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}>
            <img .src=${image} slot="start-image">
          </md-list-item>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}>
            <video
                muted
                autoplay
                loop
                playsinline
                .src=${knobs['video src']}
                slot=${
        knobs['slot[name=start-video-large]'] ? 'start-video-large' :
                                                'start-video'}
            ></video>
          </md-list-item>
        </md-list>
      </div>
  `;
  },
};

/** List stories. */
export const stories = [standard];
