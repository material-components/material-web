/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/list/list-item-link.js';
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
  active: boolean;
  multiLineSupportingText: boolean;
  headline: string;
  supportingText: string;
  trailingSupportingText: string;
  itemTabIndex: number;

  'data-variant=icon': void;
  'start icon': string;
  'end icon': string;

  'data-variant=link': void;
  href: string;
  target: string;
  'link end icon': string;

  'data-variant=avatar': void;
  'avatar img': string;
  'avatar label': string;

  'data-variant=image': void;
  image: string;

  'data-variant=video': void;
  'data-variant=video-large': boolean;
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
      max-width: 36px;
    }`,
  render(knobs) {
    const {
      listTabIndex,
      disabled,
      noninteractive,
      active,
      multiLineSupportingText,
      headline,
      supportingText,
      trailingSupportingText,
      itemTabIndex,
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
              .noninteractive=${noninteractive}
              .itemTabIndex=${itemTabIndex}
              .active=${active}>
          </md-list-item>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}
              .itemTabIndex=${itemTabIndex}
              .active=${active}>
            <md-icon data-variant="icon" slot="start">
              ${knobs['start icon']}
            </md-icon>
            <md-icon data-variant="icon" slot="end">
              ${knobs['end icon']}
            </md-icon>
          </md-list-item>

          <md-list-item-link
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}
              .itemTabIndex=${itemTabIndex}
              .href=${href}
              .target=${target}
              .active=${active}>
            <md-icon data-variant="icon" slot="end">${
        knobs['link end icon']}</md-icon>
          </md-list-item-link>

          <md-divider></md-divider>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}
              .itemTabIndex=${itemTabIndex}
              .active=${active}>
            <img src=${knobs['avatar img']} slot="start" data-variant="avatar">
          </md-list-item>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}
              .itemTabIndex=${itemTabIndex}
              .active=${active}>
            <span slot="start" data-variant="avatar">
              ${knobs['avatar label']}
            </span>
          </md-list-item>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}
              .itemTabIndex=${itemTabIndex}
              .active=${active}>
            <img .src=${image} data-variant="image" slot="start">
          </md-list-item>

          <md-list-item
              .headline=${headline}
              .supportingText=${supportingText}
              .multiLineSupportingText=${multiLineSupportingText}
              .trailingSupportingText=${trailingSupportingText}
              .disabled=${disabled}
              .noninteractive=${noninteractive}
              .itemTabIndex=${itemTabIndex}
              .active=${active}>
            <video
                slot="start"
                muted
                autoplay
                loop
                playsinline
                .src=${knobs['video src']}
                data-variant=${
        knobs['data-variant=video-large'] ? 'video-large' : 'video'}
            ></video>
          </md-list-item>
        </md-list>
      </div>
  `;
  },
};

/** List stories. */
export const stories = [standard];
