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
import {css, html} from 'lit';

/** Knob types for dialog stories. */
export interface StoryKnobs {
  footerHidden: boolean;
  icon: string;
  headline: string;
  supportingText: string;
}

function clickHandler(event: Event) {
  ((event.target as Element).nextElementSibling as MdDialog)?.show();
}


const standard: MaterialStoryInit<StoryKnobs> = {
  name: '<md-dialog>',
  render({footerHidden, icon, headline, supportingText}) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog
          .footerHidden=${footerHidden}
      >
        <md-icon slot="headline-prefix">${icon}</md-icon>
        <span slot="headline">${headline}</span>
        <span>${supportingText}</span>
        <md-text-button slot="footer" dialog-action="close">Close</md-text-button>
      </md-dialog>`;
  }
};

const alert: MaterialStoryInit<StoryKnobs> = {

  name: 'Alert',
  render({footerHidden, icon, headline, supportingText}) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
        <md-dialog
            .footerHidden=${footerHidden}
        >
          <span slot="header">Alert dialog</span>
          <span>This is a standard alert dialog. Alert dialogs interrupt users with urgent information, details, or actions.</span>
          <md-text-button slot="footer" dialog-action="ok">OK</md-text-button>
        </md-dialog>`;
  }
};

const confirm: MaterialStoryInit<StoryKnobs> = {
  name: 'Confirm',
  render({footerHidden, icon, headline, supportingText}) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog style="--md-dialog-container-max-inline-size: 320px;"
          .footerHidden=${footerHidden}
      >
        <md-icon slot="headline-prefix">delete_outline</md-icon>
        <span slot="headline">Permanently delete?</span>
        <div>
          Deleting the selected photos will also remove them from all synced devices.
        </div>
        <md-text-button slot="footer" dialog-action="delete">Delete</md-text-button>
        <md-filled-tonal-button slot="footer" autofocus dialog-action="cancel">Cancel</md-filled-tonal-button>
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
  render({footerHidden, icon, headline, supportingText}) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog
          .footerHidden=${footerHidden}
      >
        <span slot="header">Choose your favorite pet</span>
        <p>
          This is a standard choice dialog. These dialogs give users the ability to make
          a decision and confirm it. This gives them a chance to change their minds if necessary.
        </p>
        <label><md-radio name="pet" value="cats" checked></md-radio> Cats</label>
        <label><md-radio name="pet" value="dogs"></md-radio> Dogs</label>
        <label><md-radio name="pet" value="birds"></md-radio> Birds</label>
        <md-text-button slot="footer" dialog-action="cancel">Cancel</md-text-button>
        <md-text-button slot="footer" autofocus dialog-action="ok">OK</md-text-button>
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
  render({footerHidden, icon, headline, supportingText}) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog class="contacts"
          .footerHidden=${footerHidden}
      >
        <span slot="header">
          <md-icon-button dialog-action="close"><md-icon>close</md-icon></md-icon-button>
          <span class="headline">Create new contact</span>
        </span>
        <div class="contact-content">
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
        </div>
        <md-text-button slot="footer" dialog-action="cancel">Cancel</md-text-button>
        <md-text-button slot="footer" dialog-action="save">Save</md-text-button>
      </md-dialog>`;
  }
};

const floatingSheet: MaterialStoryInit<StoryKnobs> = {
  name: 'Floating sheet',
  render({footerHidden, icon, headline, supportingText}) {
    return html`
      <md-filled-button @click=${clickHandler}>Open</md-filled-button>
      <md-dialog
          .footerHidden=${footerHidden}
      >
      <span slot="header">
        <span style="flex: 1;">Floating Sheet</span>
        <md-icon-button dialog-action="close"><md-icon>close</md-icon></md-icon-button>
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
