/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/button/elevated-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/tonal-button.js';

import {MaterialStoryInit} from './material-collection.js';
import {html} from 'lit';

/** Knob types for button stories. */
export interface StoryKnobs {
  label: string;
  disabled: boolean;
}

const elevated: MaterialStoryInit<StoryKnobs> = {
  name: 'Elevated buttons',
  render({label, disabled}) {
    const standardLabel = label || 'Elevated';
    const linkLabel = label || 'Elevated link';
    return html`
      <md-elevated-button
        aria-label=${ariaLabelMsg('elevated', label)}
        ?disabled=${disabled ?? false}
      >
        ${standardLabel}
      </md-elevated-button>

      <md-elevated-button
        aria-label=${ariaLabelMsg('elevated', linkLabel)}
        href="https://google.com"
        target="_blank"
        trailing-icon
      >
        ${linkLabel}
        <md-icon slot="icon" aria-hidden="true">open_in_new</md-icon>
      </md-elevated-button>
    `;
  }
};

const filled: MaterialStoryInit<StoryKnobs> = {
  name: 'Filled button',
  render({label, disabled}) {
    const standardLabel = label || 'Filled';
    const linkLabel = label || 'Filled link';
    return html`
      <md-filled-button
        aria-label=${ariaLabelMsg('filled', label)}
        ?disabled=${disabled ?? false}
      >
        ${standardLabel}
      </md-filled-button>

      <md-filled-button
        aria-label=${ariaLabelMsg('filled', linkLabel)}
        href="https://google.com"
        target="_blank"
        trailing-icon
      >
        ${linkLabel}
        <md-icon slot="icon" aria-hidden="true">open_in_new</md-icon>
      </md-filled-button>
    `;
  }
};

const tonal: MaterialStoryInit<StoryKnobs> = {
  name: 'Tonal buttons',
  render({label, disabled}) {
    const standardLabel = label || 'Tonal';
    const linkLabel = label || 'Tonal link';
    return html`
      <md-tonal-button
        aria-label=${ariaLabelMsg('tonal', label)}
        ?disabled=${disabled ?? false}
      >
        ${standardLabel}
      </md-tonal-button>

      <md-tonal-button
        aria-label=${ariaLabelMsg('tonal', linkLabel)}
        href="https://google.com"
        target="_blank"
        trailing-icon
      >
        ${linkLabel}
        <md-icon slot="icon" aria-hidden="true">open_in_new</md-icon>
      </md-tonal-button>
    `;
  }
};

const outlined: MaterialStoryInit<StoryKnobs> = {
  name: 'Outlined buttons',
  render({label, disabled}) {
    const standardLabel = label || 'Outlined';
    const linkLabel = label || 'Outlined link';
    return html`
      <md-outlined-button
        aria-label=${ariaLabelMsg('outlined', label)}
        ?disabled=${disabled ?? false}
      >
        ${standardLabel}
      </md-outlined-button>

      <md-outlined-button
        aria-label=${ariaLabelMsg('outlined', linkLabel)}
        href="https://google.com"
        target="_blank"
        trailing-icon
      >
        ${linkLabel}
        <md-icon slot="icon" aria-hidden="true">open_in_new</md-icon>
      </md-outlined-button>
    `;
  }
};

const text: MaterialStoryInit<StoryKnobs> = {
  name: 'Text buttons',
  render({label, disabled}) {
    const standardLabel = label || 'Text';
    const linkLabel = label || 'Text link';
    return html`
      <md-text-button
        aria-label=${ariaLabelMsg('text', label)}
        ?disabled=${disabled ?? false}
      >
        ${standardLabel}
      </md-text-button>

      <md-text-button
        aria-label=${ariaLabelMsg('text', linkLabel)}
        href="https://google.com"
        target="_blank"
        trailing-icon
      >
        ${linkLabel}
        <md-icon slot="icon" aria-hidden="true">open_in_new</md-icon>
      </md-text-button>
    `;
  }
};

function ariaLabelMsg(type: string, label: string) {
  return `An example ${type} button, labelled "${label}"`;
}

/** Button stories. */
export const stories = [elevated, filled, tonal, outlined, text];