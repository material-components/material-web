/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {createFormTests} from '../testing/forms.js';
import {createTokenTests} from '../testing/tokens.js';

import {MdSwitch} from './switch.js';

describe('<md-switch>', () => {
  describe('.styles', () => {
    createTokenTests(MdSwitch.styles);
  });

  describe('forms', () => {
    createFormTests({
      queryControl: (root) => root.querySelector('md-switch'),
      valueTests: [
        {
          name: 'unnamed',
          render: () => html`<md-switch selected></md-switch>`,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form without a name')
              .toHaveSize(0);
          },
        },
        {
          name: 'unselected',
          render: () => html`<md-switch name="switch"></md-switch>`,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form when unselected')
              .toHaveSize(0);
          },
        },
        {
          name: 'selected default value',
          render: () => html`<md-switch name="switch" selected></md-switch>`,
          assertValue(formData) {
            expect(formData.get('switch')).toBe('on');
          },
        },
        {
          name: 'selected custom value',
          render: () =>
            html`<md-switch
              name="switch"
              selected
              value="Custom value"></md-switch>`,
          assertValue(formData) {
            expect(formData.get('switch')).toBe('Custom value');
          },
        },
        {
          name: 'disabled',
          render: () =>
            html`<md-switch name="switch" selected disabled></md-switch>`,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form when disabled')
              .toHaveSize(0);
          },
        },
      ],
      resetTests: [
        {
          name: 'reset to unselected',
          render: () => html`<md-switch name="switch"></md-switch>`,
          change(control) {
            control.selected = true;
          },
          assertReset(control) {
            expect(control.selected)
              .withContext('control.selected after reset')
              .toBeFalse();
          },
        },
        {
          name: 'reset to selected',
          render: () => html`<md-switch name="switch" selected></md-switch>`,
          change(control) {
            control.selected = false;
          },
          assertReset(control) {
            expect(control.selected)
              .withContext('control.selected after reset')
              .toBeTrue();
          },
        },
      ],
      restoreTests: [
        {
          name: 'restore unselected',
          render: () => html`<md-switch name="switch"></md-switch>`,
          assertRestored(control) {
            expect(control.selected)
              .withContext('control.selected after restore')
              .toBeFalse();
          },
        },
        {
          name: 'restore selected',
          render: () => html`<md-switch name="switch" selected></md-switch>`,
          assertRestored(control) {
            expect(control.selected)
              .withContext('control.selected after restore')
              .toBeTrue();
          },
        },
      ],
    });
  });
});
