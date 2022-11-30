/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {FieldHarness} from '../harness.js';

import {OutlinedField} from './outlined-field.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-test-outlined-field': TestOutlinedField;
  }
}

@customElement('md-test-outlined-field')
class TestOutlinedField extends OutlinedField {
  get restingLabelElement() {
    return this.restingLabelEl;
  }

  get floatingLabelElement() {
    return this.floatingLabelEl;
  }

  override getRenderClasses() {
    return super.getRenderClasses();
  }
}

describe('Field', () => {
  describe('<md-outlined-field>', () => {
    const env = new Environment();

    async function setupTest(props: Partial<OutlinedField> = {}) {
      // Variant type does not matter for shared tests
      const template = html`
        <md-test-outlined-field
          .label=${props.label}
          ?disabled=${props.disabled ?? false}
          .error=${props.error ?? false}
          .populated=${props.populated ?? false}
          .required=${props.required ?? false}
        >
          <input>
        </md-test-outlined-field>
      `;
      const root = env.render(template);
      const instance = root.querySelector('md-test-outlined-field');
      if (!instance) {
        throw new Error('Could not query rendered <md-test-outlined-field>.');
      }

      await env.waitForStability();
      return {
        instance,
        harness: new FieldHarness(instance),
      };
    }

    it('should render resting and floating labels', async () => {
      // Set up.
      // Test case.
      const {instance} = await setupTest();
      // Assertion.
      expect(instance.floatingLabelElement)
          .withContext('should render .md3-field__label--floating')
          .toBeTruthy();
      expect(instance.restingLabelElement)
          .withContext('should render .md3-field__label--resting')
          .toBeTruthy();
    });

    describe('#getRenderClasses()', () => {
      it('should add variant-specific class', async () => {
        // Set up.
        const {instance} = await setupTest();
        // Test case.
        const classes = instance.getRenderClasses();
        // Assertion.
        expect(classes['md3-field--outlined'])
            .withContext('should set variant class to true')
            .toBeTrue();
      });
    });
  });
});
