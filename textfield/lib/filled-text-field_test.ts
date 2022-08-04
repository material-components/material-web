/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';
import '@material/web/field/filled-field';

import {Environment} from '@material/web/testing/environment';
import {html} from 'lit';
import {customElement} from 'lit/decorators';

import {TextFieldHarness} from '../harness';

import {FilledTextField} from './filled-text-field';

declare global {
  interface HTMLElementTagNameMap {
    'md-test-filled-text-field': TestTextField;
  }
}

@customElement('md-test-filled-text-field')
class TestTextField extends FilledTextField {
  protected override renderField() {
    return html`
      <md-filled-field
        class="md3-text-field__field"
        ?disabled=${this.disabled}
        .error=${this.error}
        .label=${this.label}
        .populated=${Boolean(this.value)}
        .required=${this.required}
      >
        ${this.renderFieldContent()}
      </md-filled-field>
    `;
  }

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
