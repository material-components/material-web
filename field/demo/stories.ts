/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/icon/icon.js';
import '@material/web/field/filled-field.js';
import '@material/web/field/outlined-field.js';

import {MaterialStoryInit} from './material-collection.js';
import {css, html, nothing} from 'lit';

/** Knob types for field stories. */
export interface StoryKnobs {
  label: string;
  'Supporting text': string;
  'Supporting text (end)': string;
  disabled: boolean;
  error: boolean;
  focused: boolean;
  populated: boolean;
  required: boolean;
  'Leading icon': boolean;
  'Trailing icon': boolean;
  resizable: boolean;
}

const START_CONTENT = html`<md-icon slot="start">search</md-icon>`;
const END_CONTENT = html`<md-icon slot="end">event</md-icon>`;

const styles = css`
  input,
  textarea {
    background: none;
    border: none;
    box-sizing: border-box;
    color: currentColor;
    font: inherit;
    outline: 1px dashed currentColor;
    padding: 0;
    resize: none;
    margin: 0;
    width: 100%;
  }
`;

const filled: MaterialStoryInit<StoryKnobs> = {
  name: 'Filled',
  styles,
  render(knobs) {
    const {label, disabled, error, focused, populated, required, resizable} =
        knobs;
    const supportingText = knobs['Supporting text'];
    const supportingTextEnd = knobs['Supporting text (end)'];
    const hasStart = knobs['Leading icon'];
    const hasEnd = knobs['Trailing icon'];

    const content = resizable ?
        html`<textarea rows="1" ?disabled=${disabled}></textarea>` :
        html`<input ?disabled=${disabled}>`;

    return html`
      <md-filled-field
        .label=${label}
        ?disabled=${disabled}
        .error=${error}
        .focused=${focused}
        .hasStart=${hasStart}
        .hasEnd=${hasEnd}
        .populated=${populated}
        .resizable=${resizable}
        .required=${required}
      >
        ${hasStart ? START_CONTENT : nothing}
        ${content}
        <span slot="supporting-text">${supportingText}</span>
        <span slot="supporting-text-end">${supportingTextEnd}</span>
        ${hasEnd ? END_CONTENT : nothing}
      </md-filled-field>
    `;
  }
};

const outlined: MaterialStoryInit<StoryKnobs> = {
  name: 'Outlined',
  styles,
  render(knobs) {
    const {label, disabled, error, focused, populated, required, resizable} =
        knobs;
    const supportingText = knobs['Supporting text'];
    const supportingTextEnd = knobs['Supporting text (end)'];
    const hasStart = knobs['Leading icon'];
    const hasEnd = knobs['Trailing icon'];
    const content = resizable ?
        html`<textarea rows="1" ?disabled=${disabled}></textarea>` :
        html`<input ?disabled=${disabled}>`;

    return html`
      <md-outlined-field
        .label=${label}
        ?disabled=${disabled}
        .error=${error}
        .focused=${focused}
        .hasStart=${hasStart}
        .hasEnd=${hasEnd}
        .populated=${populated}
        .resizable=${resizable}
        .required=${required}
      >
        ${hasStart ? START_CONTENT : nothing}
        ${content}
        <span slot="supporting-text">${supportingText}</span>
        <span slot="supporting-text-end">${supportingTextEnd}</span>
        ${hasEnd ? END_CONTENT : nothing}
      </md-outlined-field>
    `;
  }
};

/** Field stories. */
export const stories = [filled, outlined];
