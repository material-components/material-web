/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';

import {msg, str} from './localize.js';


describe('localize test', () => {
  it('passes through TemplateResults', () => {
    const expression = html`<span>world!</span>`
    const result = msg(html`<div tmpl>Hello ${expression}</div>`);
    expect(msg(result)).toEqual(result);
  });

  it('passes through strings', () => {
    expect(msg('Hello!')).toEqual('Hello!');
  });

  it('converts str templates to strings', () => {
    const expression = 'world';
    expect(msg(str`Hello ${expression}!`)).toEqual('Hello world!');
  });
});
