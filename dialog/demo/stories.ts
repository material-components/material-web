/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/iconbutton/icon-button.js';
import '@material/web/textfield/filled-text-field.js';
import '@material/web/radio/radio.js';
import '@material/web/icon/icon.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/filled-button.js';
import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';

import {MdDialog} from '@material/web/dialog/dialog.js';
import {MaterialStoryInit} from './material-collection.js';
import {css, html, nothing} from 'lit';

/** Knob types for dialog stories. */
export interface StoryKnobs {
  icon: string;
  headline: string;
  supportingText: string;
}

function clickHandler(event: Event) {
  ((event.target as Element).nextElementSibling as MdDialog)?.show();
}


const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Standard',
  render({icon, headline, supportingText}) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog>
        ${icon ? html`<md-icon slot="icon">${icon}</md-icon>` : nothing}
        <div slot="headline">${headline}</div>
        <form id="form" slot="content" method="dialog">
          <span>${supportingText}</span>
        </form>
        <div slot="actions">
          <md-text-button form="form" value="close">Close</md-text-button>
          <md-text-button form="form" value="ok" autofocus>OK</md-text-button>
        </div>
      </md-dialog>
    `;
  }
};

const alert: MaterialStoryInit<StoryKnobs> = {
  name: 'Alert',
  render() {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog type="alert">
        <div slot="headline">Alert dialog</div>
        <form id="form" slot="content" method="dialog">
          This is a standard alert dialog. Alert dialogs interrupt users with
          urgent information, details, or actions.
        </form>
        <div slot="actions">
          <md-text-button form="form" value="ok">OK</md-text-button>
        </div>
      </md-dialog>
    `;
  }
};

const confirm: MaterialStoryInit<StoryKnobs> = {
  name: 'Confirm',
  render() {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog style="max-width: 320px;">
        <div slot="headline">Permanently delete?</div>
        <md-icon slot="icon">delete_outline</md-icon>
        <form id="form" slot="content" method="dialog">
          Deleting the selected photos will also remove them from all synced devices.
        </form>
        <div slot="actions">
          <md-text-button form="form" value="delete">Delete</md-text-button>
          <md-filled-tonal-button autofocus form="form" value="cancel">Cancel</md-filled-tonal-button>
        </div>
      </md-dialog>
    `;
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
  render() {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog>
        <div slot="headline">Choose your favorite pet</div>
        <form id="form" slot="content" method="dialog">
          <div>
            This is a standard choice dialog. These dialogs give users the ability to make
            a decision and confirm it. This gives them a chance to change their minds if necessary.
          </div>
          <label><md-radio name="pet" value="cats" touch-target="wrapper" checked></md-radio> Cats</label>
          <label><md-radio name="pet" value="dogs" touch-target="wrapper"></md-radio> Dogs</label>
          <label><md-radio name="pet" value="birds" touch-target="wrapper"></md-radio> Birds</label>
        </form>
        <div slot="actions">
          <md-text-button form="form" value="cancel">Cancel</md-text-button>
          <md-text-button form="form" autofocus value="ok">OK</md-text-button>
        </div>
      </md-dialog>
    `;
  }
};

const contacts: MaterialStoryInit<StoryKnobs> = {
  name: 'Contacts',
  styles: css`
    .contacts {
      min-width: calc(100vw - 212px);
    }

    .contacts [slot="header"] {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
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
  render() {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog class="contacts">
        <span slot="headline">
          <md-icon-button form="form" value="close">
            <md-icon>close</md-icon>
          </md-icon-button>
          <span class="headline">Create new contact</span>
        </span>
        <form id="form" slot="content" method="dialog" class="contact-content">
          <div class="contact-row">
            <md-filled-text-field autofocus label="First Name"></md-filled-text-field>
            <md-filled-text-field label="Last Name"></md-filled-text-field>
          </div>
          <div class="contact-row">
            <md-filled-text-field label="Company"></md-filled-text-field>
            <md-filled-text-field label="Job Title"></md-filled-text-field>
          </div>
          <md-filled-text-field label="Email"></md-filled-text-field>
          <md-filled-text-field label="Phone"></md-filled-text-field>
        </form>
        <div slot="actions">
          <md-text-button form="form" value="cancel">Cancel</md-text-button>
          <md-text-button form="form" value="save">Save</md-text-button>
        </div>
      </md-dialog>
    `;
  }
};

const floatingSheet: MaterialStoryInit<StoryKnobs> = {
  name: 'Floating sheet',
  render() {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog>
        <span slot="headline">
          <span style="flex: 1;">Floating Sheet</span>
          <md-icon-button form="form" value="close">
            <md-icon>close</md-icon>
          </md-icon-button>
        </span>
        <form id="form" slot="content" method="dialog">
          This is a floating sheet with title.
          Floating sheets offer no action buttons at the bottom,
          but there's a close icon button at the top right.
          They accept any HTML content.
        </form>
      </md-dialog>
    `;
  }
};

/** Dialog stories. */
export const stories =
    [standard, alert, confirm, choose, contacts, floatingSheet];
