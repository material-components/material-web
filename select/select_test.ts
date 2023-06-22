/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render} from 'lit';

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
        html`
          <md-outlined-select @change=${() => {
          changed = true;
        }}>
            <md-select-option selected></md-select-option>
            <md-select-option></md-select-option>
          </md-outlined-select>`,
        root);
    const selectEl = root.querySelector('md-outlined-select')!;
    await selectEl.updateComplete;

    await new SelectHarness(selectEl).clickOption(1);

    expect(changed).toBeTrue();
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
