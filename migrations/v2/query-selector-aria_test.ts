/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/checkbox/checkbox.js';
import {html} from 'lit';

import {Environment} from '../../testing/environment.js';
import {ariaSelector} from './query-selector-aria.js';

describe('query-selector-aria', () => {
  const env = new Environment();

  it('is needed when querying by aria attribute selectors fails', () => {
    // Arrange
    const root = env.render(
      html`<md-checkbox aria-label="Agree"></md-checkbox>`,
    );

    // Act
    const checkbox = root.querySelector('[aria-label="Agree"]');

    // Assert
    expect(checkbox)
      .withContext('aria attribute query expected to fail without patches')
      .toBeNull();
  });

  describe('ariaSelector()', () => {
    it('returns the element with an aria attribute query', () => {
      // Arrange
      const root = env.render(
        html`<md-checkbox aria-label="Agree"></md-checkbox>`,
      );

      // Act
      const element = root.querySelector(ariaSelector('[aria-label="Agree"]'));

      // Assert
      expect(element).withContext('queried element').not.toBeNull();
    });

    it('returns the element with a role attribute query', () => {
      // Arrange
      const root = env.render(html`<md-checkbox role="radio"></md-checkbox>`);

      // Act
      const element = root.querySelector(ariaSelector('[role="radio"]'));

      // Assert
      expect(element).withContext('queried element').not.toBeNull();
    });

    it('returns the element when combined with other selectors', () => {
      // Arrange
      const root = env.render(html`
        <md-checkbox
          class="checkbox"
          aria-label="Agree"
          aria-haspopup="true"></md-checkbox>
      `);

      // Act
      const element = root.querySelector(
        ariaSelector('.checkbox[aria-label="Agree"][aria-haspopup="true"]'),
      );

      // Assert
      expect(element).withContext('queried element').not.toBeNull();
    });

    it('returns expected elements when not using aria attribute selectors', () => {
      // Arrange
      const root = env.render(html`
        <md-checkbox class="checkbox"></md-checkbox>
      `);

      // Act
      const element = root.querySelector(ariaSelector('.checkbox'));

      // Assert
      expect(element).withContext('queried element').not.toBeNull();
    });
  });
});
