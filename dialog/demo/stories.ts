/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/iconbutton/standard-icon-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/radio/radio.js';
import '@material/web/icon/icon.js';
import '@material/web/button/tonal-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';

import {MaterialStoryInit} from './material-collection.js';
import {MdDialog, DialogTransition} from '@material/web/dialog/dialog.js';
import {css, html} from 'lit';

/** Knob types for dialog stories. */
export interface StoryKnobs {
  transition: DialogTransition|undefined;
  fullscreen: boolean;
  modeless: boolean;
  footerHidden: boolean;
  stacked: boolean;
  draggable: boolean;
  icon: string;
  headline: string;
  supportingText: string;
}

function clickHandler(e: Event) {
  ((e.target as Element).nextElementSibling as MdDialog)?.show();
}


const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-dialog>',
  render({
    transition,
    fullscreen,
    modeless,
    footerHidden,
    stacked,
    draggable,
    icon,
    headline,
    supportingText
  }) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog
          .fullscreen=${fullscreen}
          .modeless=${modeless}
          .footerHidden=${footerHidden}
          .stacked=${stacked}
          .draggable=${draggable}
          .transition=${transition!}
      >
        <md-icon slot="headline-prefix">${icon}</md-icon>
        <span slot="headline">${headline}</span>
        <span>${supportingText}</span>
        <md-text-button slot="footer" dialogAction="close">Close</md-text-button>
      </md-dialog>`;
  }
};

const alert: MaterialStoryInit<StoryKnobs> = {

  name: 'Alert',
  render({
    transition,
    fullscreen,
    modeless,
    footerHidden,
    stacked,
    draggable,
    icon,
    headline,
    supportingText
  }) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
        <md-dialog
            .fullscreen=${fullscreen}
            .modeless=${modeless}
            .footerHidden=${footerHidden}
            .stacked=${stacked}
            .draggable=${draggable}
            .transition=${transition!}
        >
          <span slot="header">Alert dialog</span>
          <span>This is a standard alert dialog. Alert dialogs interrupt users with urgent information, details, or actions.</span>
          <md-text-button slot="footer" dialogAction="ok">OK</md-text-button>
        </md-dialog>`;
  }
};

const confirm: MaterialStoryInit<StoryKnobs> = {
  name: 'Confirm',
  render({
    transition,
    fullscreen,
    modeless,
    footerHidden,
    stacked,
    draggable,
    icon,
    headline,
    supportingText
  }) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog transition="shrink" style="--md-dialog-container-max-inline-size: 320px;"
          .fullscreen=${fullscreen}
          .modeless=${modeless}
          .footerHidden=${footerHidden}
          .stacked=${stacked}
          .draggable=${draggable}
          .transition=${transition!}
      >
        <md-icon slot="headline-prefix">delete_outline</md-icon>
        <span slot="headline">Permanently delete?</span>
        <div>
          Deleting the selected photos will also remove them from all synced devices.
        </div>
        <md-text-button slot="footer" dialogAction="delete">Delete</md-text-button>
        <md-tonal-button slot="footer" dialogFocus dialogAction="cancel">Cancel</md-tonal-button>
      </md-dialog>`;
  }
};

const choose: MaterialStoryInit<StoryKnobs> = {
  name: 'Choose',
  styles: css`
    label {
      display: flex;
      gap: 8px;
      align-items: center;
    }
    `,
  render({
    transition,
    fullscreen,
    modeless,
    footerHidden,
    stacked,
    draggable,
    icon,
    headline,
    supportingText
  }) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog
          .fullscreen=${fullscreen}
          .modeless=${modeless}
          .footerHidden=${footerHidden}
          .stacked=${stacked}
          .draggable=${draggable}
          .transition=${transition!}
      >
        <span slot="header">Choose your favorite pet</span>
        <p>
          This is a standard choice dialog. These dialogs give users the ability to make
          a decision and confirm it. This gives them a chance to change their minds if necessary.
        </p>
        <label><md-radio name="pet" value="cats" checked></md-radio> Cats</label>
        <label><md-radio name="pet" value="dogs"></md-radio> Dogs</label>
        <label><md-radio name="pet" value="birds"></md-radio> Birds</label>
        <md-text-button slot="footer" dialogAction="cancel">Cancel</md-text-button>
        <md-text-button slot="footer" dialogFocus dialogAction="ok">OK</md-text-button>
      </md-dialog>`;
  }
};

const contacts: MaterialStoryInit<StoryKnobs> = {
  name: 'Contacts',
  styles: css`
    .contacts {
      --md-dialog-container-min-inline-size: calc(100vw - 212px);
    }

    .contacts [slot="header"] {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
    }

    .contacts[showing-fullscreen] [slot="header"] {
      flex-direction: row;
    }

    .contacts .headline {
      flex: 1;
    }

    .contact-content, .contact-row {
      display: flex;
      gap: 8px;
    }

    .contact-content {
      flex-direction: column;
    }

    .contact-row > * {
      flex: 1;
    }`,
  render({
    transition,
    fullscreen,
    modeless,
    footerHidden,
    stacked,
    draggable,
    icon,
    headline,
    supportingText
  }) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog class="contacts"
          .fullscreen=${fullscreen}
          .modeless=${modeless}
          .footerHidden=${footerHidden}
          .stacked=${stacked}
          .draggable=${draggable}
          .transition=${transition!}
      >
        <span slot="header">
          <md-standard-icon-button dialogAction="close">close</md-standard-icon-button>
          <span class="headline">Create new contact</span>
        </span>
        <div class="contact-content">
          <div class="contact-row">
            <md-filled-text-field dialogFocus label="First Name"></md-filled-text-field>
            <md-filled-text-field label="Last Name"></md-filled-text-field>
          </div>
          <div class="contact-row">
            <md-filled-text-field label="Company"></md-filled-text-field>
            <md-filled-text-field label="Job Title"></md-filled-text-field>
          </div>
          <md-filled-text-field label="Email"></md-filled-text-field>
          <md-filled-text-field label="Phone"></md-filled-text-field>
        </div>
        <md-text-button slot="footer" dialogAction="cancel">Cancel</md-text-button>
        <md-text-button slot="footer" dialogAction="save">Save</md-text-button>
      </md-dialog>`;
  }
};

const floatingSheet: MaterialStoryInit<StoryKnobs> = {
  name: 'Floating sheet',
  render({
    transition,
    fullscreen,
    modeless,
    footerHidden,
    stacked,
    draggable,
    icon,
    headline,
    supportingText
  }) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog
          .fullscreen=${fullscreen}
          .modeless=${modeless}
          .footerHidden=${footerHidden}
          .stacked=${stacked}
          .draggable=${draggable}
          .transition=${transition!}
      >
      <span slot="header">
        <span style="flex: 1;">Floating Sheet</span>
        <md-standard-icon-button dialogAction="close">close</md-standard-icon-button>
      </span>
      <div>This is a floating sheet with title.
        Floating sheets offer no action buttons at the bottom,
        but there's a close icon button at the top right.
        They accept any HTML content.
      </div>
    </md-dialog>`;
  }
};

/** Dialog stories. */
export const stories =
    [standard, alert, confirm, choose, contacts, floatingSheet];
