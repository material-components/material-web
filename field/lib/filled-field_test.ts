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

import {FilledField} from './filled-field.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-test-filled-field': TestFilledField;
  }
}

@customElement('md-test-filled-field')
class TestFilledField extends FilledField {
  get strokeTransformOriginProp() {
    const element =
        this.renderRoot.querySelector('.md3-field__active-indicator');
    if (!element) {
      return '';
    }

    return getComputedStyle(element).transformOrigin.split(' ')[0];
  }
}

describe('Field', () => {
  describe('<md-filled-field>', () => {
    const env = new Environment();

    async function setupTest(props: Partial<FilledField> = {}) {
      // Variant type does not matter for shared tests
      const template = html`
        <md-test-filled-field
          .label=${props.label}
          ?disabled=${props.disabled ?? false}
          .error=${props.error ?? false}
          .populated=${props.populated ?? false}
          .required=${props.required ?? false}
        >
          <input>
        </md-test-filled-field>
      `;
      const root = env.render(template);
      const instance = root.querySelector('md-test-filled-field');
      if (!instance) {
        throw new Error('Could not query rendered <md-test-filled-field>.');
      }

      await env.waitForStability();
      return {
        instance,
        harness: new FieldHarness(instance),
      };
    }

    describe('.strokeTransformOrigin', () => {
      it('should be set to eventClientX - rootClientX on click', async () => {
        // Set up.
        const {instance, harness} = await setupTest();
        const rootRect = new DOMRect(5, 5, 200, 56);
        spyOn(instance, 'getBoundingClientRect').and.returnValue(rootRect);
        // Test case.
        const clientX = 10;
        await harness.clickWithMouse({clientX});
        await env.waitForStability();
        // Assertion.
        expect(instance.strokeTransformOriginProp)
            .withContext(`should be event.clientX (${
                clientX}) - root.clientX (${rootRect.x})`)
            .toBe(`${clientX - rootRect.x}px`);
      });

      it('should not update when disabled and clicked', async () => {
        // Set up.
        const {instance, harness} = await setupTest({disabled: true});
        // Test case.
        await harness.clickWithMouse({clientX: 10});
        await env.waitForStability();
        // Assertion.
        expect(instance.strokeTransformOriginProp)
            .withContext('should not update stroke transform when disabled')
            .toBe('0px');
      });

      it('should be reset when unfocused', async () => {
        // Set up.
        const {instance, harness} = await setupTest();
        await harness.clickWithMouse({clientX: 10});
        await env.waitForStability();
        expect(instance.strokeTransformOriginProp)
            .withContext('should have a pre-set transform origin')
            .toBeTruthy();

        await harness.focusWithKeyboard();
        // Test case.
        await harness.blur();
        await env.waitForStability();
        // Assertion.
        expect(instance.strokeTransformOriginProp)
            .withContext('should rest stroke transform when unfocused')
            .toBe('0px');
      });
    });
  });
});
