/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {createFormTests} from '../testing/forms.js';
import {createTokenTests} from '../testing/tokens.js';

import {MdCheckbox} from './checkbox.js';

describe('<md-checkbox>', () => {
  describe('.styles', () => {
    createTokenTests(MdCheckbox.styles);
  });

  describe('forms', () => {
    createFormTests({
      queryControl: (root) => root.querySelector('md-checkbox'),
      valueTests: [
        {
          name: 'unnamed',
          render: () => html`<md-checkbox checked></md-checkbox>`,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form without a name')
              .toHaveSize(0);
          },
        },
        {
          name: 'unchecked',
          render: () => html`<md-checkbox name="checkbox"></md-checkbox>`,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form when unchecked')
              .toHaveSize(0);
          },
        },
        {
          name: 'checked default value',
          render: () =>
            html`<md-checkbox name="checkbox" checked></md-checkbox>`,
          assertValue(formData) {
            expect(formData.get('checkbox')).toBe('on');
          },
        },
        {
          name: 'checked custom value',
          render: () =>
            html`<md-checkbox
              name="checkbox"
              checked
              value="Custom value"></md-checkbox>`,
          assertValue(formData) {
            expect(formData.get('checkbox')).toBe('Custom value');
          },
        },
        {
          name: 'indeterminate',
          render: () =>
            html`<md-checkbox
              name="checkbox"
              checked
              indeterminate></md-checkbox>`,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form when indeterminate')
              .toHaveSize(0);
          },
        },
        {
          name: 'disabled',
          render: () =>
            html`<md-checkbox name="checkbox" checked disabled></md-checkbox>`,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form when disabled')
              .toHaveSize(0);
          },
        },
      ],
      resetTests: [
        {
          name: 'reset to unchecked',
          render: () => html`<md-checkbox name="checkbox"></md-checkbox>`,
          change(checkbox) {
            checkbox.checked = true;
          },
          assertReset(checkbox) {
            expect(checkbox.checked)
              .withContext('checkbox.checked after reset')
              .toBeFalse();
          },
        },
        {
          name: 'reset to checked',
          render: () =>
            html`<md-checkbox name="checkbox" checked></md-checkbox>`,
          change(checkbox) {
            checkbox.checked = false;
          },
          assertReset(checkbox) {
            expect(checkbox.checked)
              .withContext('checkbox.checked after reset')
              .toBeTrue();
          },
        },
        {
          name: 'reset to indeterminate',
          render: () =>
            html`<md-checkbox name="checkbox" indeterminate></md-checkbox>`,
          change(checkbox) {
            checkbox.indeterminate = false;
          },
          assertReset(checkbox) {
            expect(checkbox.indeterminate)
              .withContext('checkbox.indeterminate should not be reset')
              .toBeFalse();
          },
        },
      ],
      restoreTests: [
        {
          name: 'restore unchecked',
          render: () => html`<md-checkbox name="checkbox"></md-checkbox>`,
          assertRestored(checkbox) {
            expect(checkbox.checked)
              .withContext('checkbox.checked after restore')
              .toBeFalse();
          },
        },
        {
          name: 'restore checked',
          render: () =>
            html`<md-checkbox name="checkbox" checked></md-checkbox>`,
          assertRestored(checkbox) {
            expect(checkbox.checked)
              .withContext('checkbox.checked after restore')
              .toBeTrue();
          },
        },
        {
          name: 'restore indeterminate',
          render: () =>
            html`<md-checkbox name="checkbox" indeterminate></md-checkbox>`,
          assertRestored(checkbox) {
            expect(checkbox.indeterminate)
              .withContext('checkbox.indeterminate should not be restored')
              .toBeFalse();
          },
        },
      ],
    });
  });
});
