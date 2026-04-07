/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {adoptStyles} from './adopt-styles.js';

describe('adoptStyles()', () => {
  let sheet: CSSStyleSheet;

  beforeEach(() => {
    document.adoptedStyleSheets = [];
    sheet = new CSSStyleSheet();
  });

  it('should adopt to a ShadowRoot', () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({mode: 'open'});
    adoptStyles(shadowRoot, sheet);

    expect(shadowRoot.adoptedStyleSheets)
      .withContext('shadowRoot.adoptedStyleSheets after adopt')
      .toContain(sheet);
  });

  it('should adopt to a Document', () => {
    adoptStyles(document, sheet);

    expect(document.adoptedStyleSheets)
      .withContext('document.adoptedStyleSheets after adopt')
      .toContain(sheet);
  });

  it("should adopt to an Element's document", () => {
    const element = document.createElement('div');
    adoptStyles(element, sheet);

    expect(document.adoptedStyleSheets)
      .withContext(
        'document.adoptedStyleSheets after adopt (element in light dom)',
      )
      .toContain(sheet);
  });

  it("should adopt to an Element's document and host ShadowRoot", () => {
    const host = document.createElement('div');
    const shadowRoot = host.attachShadow({mode: 'open'});
    const element = document.createElement('div');
    shadowRoot.appendChild(element);

    adoptStyles(element, sheet);

    expect(document.adoptedStyleSheets)
      .withContext(
        'document.adoptedStyleSheets after adopt (element in shadow dom)',
      )
      .toContain(sheet);
    expect(shadowRoot.adoptedStyleSheets)
      .withContext(
        'shadowRoot.adoptedStyleSheets after adopt (element in shadow dom)',
      )
      .toContain(sheet);
  });
});
