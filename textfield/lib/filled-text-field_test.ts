/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import '../../field/filled-field.js';

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';
import {literal} from 'lit/static-html.js';

import {Environment} from '../../testing/environment.js';
import {TextFieldHarness} from '../harness.js';

import {FilledTextField} from './filled-text-field.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-test-filled-text-field': TestTextField;
  }
}

@customElement('md-test-filled-text-field')
class TestTextField extends FilledTextField {
  protected override readonly fieldTag = literal`md-filled-field`;

  override getRenderClasses() {
    return super.getRenderClasses();
  }
}

describe('FilledTextField', () => {
  const env = new Environment();

  function setupTest() {
    // Variant type does not matter for shared tests
    const element =
        env.render(
               html`<md-test-filled-text-field></md-test-filled-text-field>`)
            .querySelector('md-test-filled-text-field');
    if (!element) {
      throw new Error('Could not query rendered <md-test-filled-text-field>.');
    }

    return {
      element,  // Used for TestTextField type
      harness: new TextFieldHarness(element),
    };
  }

  describe('getRenderClasses()', () => {
    it('should set the variant class to true', () => {
      // Setup.
      const {element} = setupTest();
      // Test case.
      const classes = element.getRenderClasses();
      // Assertion.
      expect(classes).toEqual(jasmine.objectContaining({
        'md3-text-field--filled': true,
      }));
    });
  });
});
