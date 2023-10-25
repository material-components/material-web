/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render} from 'lit';

import {createFormTests} from '../testing/forms.js';
import {createTokenTests} from '../testing/tokens.js';

import {MdFilledSelect} from './filled-select.js';
import {SelectHarness} from './harness.js';
import {MdOutlinedSelect} from './outlined-select.js';
import {MdSelectOption} from './select-option.js';

describe('<md-outlined-select>', () => {
  describe('.styles', () => {
    createTokenTests(MdOutlinedSelect.styles);
  });

  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root?.remove();
  });

  it('clicking on option triggers change', async () => {
    let changed = false;
    render(
      html` <md-outlined-select
        @change=${() => {
          changed = true;
        }}>
        <md-select-option selected></md-select-option>
        <md-select-option></md-select-option>
      </md-outlined-select>`,
      root,
    );
    const selectEl = root.querySelector('md-outlined-select')!;
    await selectEl.updateComplete;

    await new SelectHarness(selectEl).clickOption(1);

    expect(changed).toBeTrue();
  });

  describe('forms', () => {
    createFormTests({
      queryControl: (root) => root.querySelector('md-outlined-select'),
      valueTests: [
        {
          name: 'unnamed',
          render: () => html`
            <md-outlined-select>
              <md-select-option value="one"></md-select-option>
              <md-select-option value="two" selected></md-select-option>
            </md-outlined-select>
          `,
          assertValue(formData) {
            expect(formData)
              .withContext('should not add anything to form without a name')
              .toHaveSize(0);
          },
        },
        {
          name: 'unselected',
          render: () => html`
            <md-outlined-select name="select">
              <md-select-option value="one"></md-select-option>
              <md-select-option value="two"></md-select-option>
            </md-outlined-select>
          `,
          assertValue(formData) {
            expect(formData.get('select')).toBe('');
          },
        },
        {
          name: 'selected',
          render: () => html`
            <md-outlined-select name="select">
              <md-select-option value="one"></md-select-option>
              <md-select-option value="two" selected></md-select-option>
            </md-outlined-select>
          `,
          assertValue(formData) {
            expect(formData.get('select')).toBe('two');
          },
        },
        {
          name: 'disabled',
          render: () => html`
            <md-outlined-select name="select" disabled>
              <md-select-option value="one"></md-select-option>
              <md-select-option value="two" selected></md-select-option>
            </md-outlined-select>
          `,
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
          render: () => html`
            <md-outlined-select name="select">
              <md-select-option value="one"></md-select-option>
              <md-select-option value="two"></md-select-option>
            </md-outlined-select>
          `,
          change(select) {
            select.value = 'one';
          },
          assertReset(select) {
            expect(select.value)
              .withContext('select.value after reset')
              .toBe('');
          },
        },
        {
          name: 'reset to selected',
          render: () => html`
            <md-outlined-select name="select">
              <md-select-option value="one"></md-select-option>
              <md-select-option value="two" selected></md-select-option>
            </md-outlined-select>
          `,
          change(select) {
            select.value = 'one';
          },
          assertReset(select) {
            expect(select.value)
              .withContext('select.value after reset')
              .toBe('two');
          },
        },
      ],
      restoreTests: [
        {
          name: 'restore unselected',
          render: () => html`
            <md-outlined-select name="select">
              <md-select-option value="one"></md-select-option>
              <md-select-option value="two"></md-select-option>
            </md-outlined-select>
          `,
          assertRestored(select) {
            expect(select.value)
              .withContext('select.value after restore')
              .toBe('');
          },
        },
        {
          name: 'restore selected',
          render: () => html`
            <md-outlined-select name="select">
              <md-select-option value="one"></md-select-option>
              <md-select-option value="two" selected></md-select-option>
            </md-outlined-select>
          `,
          assertRestored(select) {
            expect(select.value)
              .withContext('select.value after restore')
              .toBe('two');
          },
        },
      ],
    });
  });
});

describe('<md-filled-select>', () => {
  describe('.styles', () => {
    createTokenTests(MdFilledSelect.styles);
  });
});

describe('<md-select-option>', () => {
  describe('.styles', () => {
    createTokenTests(MdSelectOption.styles);
  });
});
