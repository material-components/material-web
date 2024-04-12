/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/button/filled-button.js';
import '@material/web/button/filled-tonal-button.js';
import '@material/web/button/text-button.js';
import '@material/web/dialog/dialog.js';
import '@material/web/icon/icon.js';
import '@material/web/iconbutton/icon-button.js';
import '@material/web/radio/radio.js';
import '@material/web/textfield/filled-text-field.js';

import {MdDialog} from '@material/web/dialog/dialog.js';
import {MaterialStoryInit} from './material-collection.js';
import {css, html, nothing} from 'lit';

/** Knob types for dialog stories. */
export interface StoryKnobs {
  quick: boolean;
  icon: string;
  headline: string;
  supportingText: string;
}

function showDialog(event: Event) {
  ((event.target as Element).nextElementSibling as MdDialog)?.show();
}

const standard: MaterialStoryInit<StoryKnobs> = {
  name: 'Dialog',
  render({icon, headline, supportingText, quick}) {
    return html`
      <md-filled-button @click=${showDialog} aria-label="Open a dialog">
        Open
      </md-filled-button>

      <md-dialog
        aria-label=${headline ? nothing : 'A simple dialog'}
        ?quick=${quick}>
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
  },
};

const alert: MaterialStoryInit<StoryKnobs> = {
  name: 'Alert',
  render({quick}) {
    return html`
      <md-filled-button @click=${showDialog} aria-label="Open an alert dialog">
        Alert
      </md-filled-button>

      <md-dialog type="alert" ?quick=${quick}>
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
  },
};

const confirm: MaterialStoryInit<StoryKnobs> = {
  name: 'Confirm',
  render({quick}) {
    return html`
      <md-filled-button
        @click=${showDialog}
        aria-label="Open a confirmation dialog">
        Confirm
      </md-filled-button>

      <md-dialog style="max-width: 320px;" ?quick=${quick}>
        <div slot="headline">Permanently delete?</div>
        <md-icon slot="icon">delete_outline</md-icon>
        <form id="form" slot="content" method="dialog">
          Deleting the selected photos will also remove them from all synced
          devices.
        </form>
        <div slot="actions">
          <md-text-button form="form" value="delete">Delete</md-text-button>
          <md-filled-tonal-button form="form" value="cancel" autofocus
            >Cancel</md-filled-tonal-button
          >
        </div>
      </md-dialog>
    `;
  },
};

const choose: MaterialStoryInit<StoryKnobs> = {
  name: 'Choose',
  styles: css`
    label {
      display: flex;
      align-items: center;
    }
  `,
  render({quick}) {
    return html`
      <md-filled-button @click=${showDialog} aria-label="Open a choice dialog">
        Choice
      </md-filled-button>

      <md-dialog ?quick=${quick}>
        <div slot="headline">Choose your favorite pet</div>
        <form id="form" slot="content" method="dialog">
          <label>
            <md-radio
              name="pet"
              value="cats"
              aria-label="Cats"
              touch-target="wrapper"
              checked></md-radio>
            <span aria-hidden="true">Cats</span>
          </label>
          <label>
            <md-radio
              name="pet"
              value="dogs"
              aria-label="Dogs"
              touch-target="wrapper"></md-radio>
            <span aria-hidden="true">Dogs</span>
          </label>
          <label>
            <md-radio
              name="pet"
              value="birds"
              aria-label="Birds"
              touch-target="wrapper"></md-radio>
            <span aria-hidden="true">Birds</span>
          </label>
        </form>
        <div slot="actions">
          <md-text-button form="form" value="cancel">Cancel</md-text-button>
          <md-text-button form="form" autofocus value="ok">OK</md-text-button>
        </div>
      </md-dialog>
    `;
  },
};

const contacts: MaterialStoryInit<StoryKnobs> = {
  name: 'Form',
  styles: css`
    .contacts {
      min-width: calc(100vw - 212px);
    }

    .contacts [slot='header'] {
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
    }

    .contacts .headline {
      flex: 1;
    }

    .contact-content,
    .contact-row {
      display: flex;
      gap: 8px;
    }

    .contact-content {
      flex-direction: column;
    }

    .contact-row > * {
      flex: 1;
    }
  `,
  render({quick}) {
    return html`
      <md-filled-button @click=${showDialog} aria-label="Open a form dialog">
        Form
      </md-filled-button>

      <md-dialog class="contacts" ?quick=${quick}>
        <span slot="headline">
          <md-icon-button form="form" value="close" aria-label="Close dialog">
            <md-icon>close</md-icon>
          </md-icon-button>
          <span class="headline">Create new contact</span>
        </span>
        <form id="form" slot="content" method="dialog" class="contact-content">
          <div class="contact-row">
            <md-filled-text-field
              autofocus
              label="First Name"></md-filled-text-field>
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
          <md-text-button form="form" value="reset" type="reset"
            >Reset</md-text-button
          >
          <div style="flex: 1"></div>
          <md-text-button form="form" value="cancel">Cancel</md-text-button>
          <md-text-button form="form" value="save">Save</md-text-button>
        </div>
      </md-dialog>
    `;
  },
};

const floatingSheet: MaterialStoryInit<StoryKnobs> = {
  name: 'Floating sheet',
  render({quick}) {
    return html`
      <md-filled-button @click=${showDialog} aria-label="Open a floating sheet">
        Floating sheet
      </md-filled-button>

      <md-dialog ?quick=${quick}>
        <span slot="headline">
          <span style="flex: 1;">Floating Sheet</span>
          <md-icon-button form="form" value="close" aria-label="Close dialog">
            <md-icon>close</md-icon>
          </md-icon-button>
        </span>
        <form id="form" slot="content" method="dialog">
          This is a floating sheet with title. Floating sheets offer no action
          buttons at the bottom, but there's a close icon button at the top
          right. They accept any HTML content.
        </form>
      </md-dialog>
    `;
  },
};

/** Dialog stories. */
export const stories = [
  standard,
  alert,
  confirm,
  choose,
  contacts,
  floatingSheet,
];
