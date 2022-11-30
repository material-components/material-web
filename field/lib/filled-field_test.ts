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
    return this.strokeTransformOrigin;
  }
  set strokeTransformOriginProp(strokeTransformOrigin: string) {
    this.strokeTransformOrigin = strokeTransformOrigin;
  }

  get restingLabelElement() {
    return this.restingLabelEl;
  }

  get floatingLabelElement() {
    return this.floatingLabelEl;
  }

  override getRenderClasses() {
    return super.getRenderClasses();
  }

  override handleClick(event: MouseEvent|TouchEvent) {
    super.handleClick(event);
  }

  override updateStrokeTransformOrigin(event?: MouseEvent|TouchEvent) {
    return super.updateStrokeTransformOrigin(event);
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
        expect(classes['md3-field--filled'])
            .withContext('should set variant class to true')
            .toBeTrue();
      });
    });

    describe('.strokeTransformOrigin', () => {
      it('should update when clicked', async () => {
        // Set up.
        const {instance} = await setupTest();
        spyOn(instance, 'updateStrokeTransformOrigin');
        const event = new MouseEvent('click', {clientX: 10});
        // Test case.
        instance.handleClick(event);
        await env.waitForStability();
        // Assertion.
        expect(instance.updateStrokeTransformOrigin)
            .withContext('should update stroke transform when clicked')
            .toHaveBeenCalledTimes(1);
      });

      it('should be set to eventClientX - rootClientX', async () => {
        // Set up.
        const {instance} = await setupTest();
        const rootRect = new DOMRect(5, 5, 200, 56);
        spyOn(instance, 'getBoundingClientRect').and.returnValue(rootRect);
        const event = new MouseEvent('click', {clientX: 10});
        // Test case.
        instance.handleClick(event);
        await env.waitForStability();
        // Assertion.
        expect(instance.strokeTransformOriginProp)
            .withContext(`should be event.clientX (${
                event.clientX}) - root.clientX (${rootRect.x})`)
            .toBe(`${event.clientX - rootRect.x}px`);
      });

      it('should not update when disabled and clicked', async () => {
        // Set up.
        const {instance} = await setupTest({disabled: true});
        spyOn(instance, 'updateStrokeTransformOrigin');
        const event = new MouseEvent('click', {clientX: 10});
        // Test case.
        instance.handleClick(event);
        await env.waitForStability();
        // Assertion.
        expect(instance.updateStrokeTransformOrigin)
            .withContext('should not update stroke transform when disabled')
            .not.toHaveBeenCalled();
      });

      it('should be reset when unfocused', async () => {
        // Set up.
        const {instance, harness} = await setupTest();
        await harness.focusWithKeyboard();
        instance.strokeTransformOriginProp = '10px';
        // Test case.
        await harness.blur();
        await env.waitForStability();
        // Assertion.
        expect(instance.strokeTransformOriginProp)
            .withContext('should rest stroke transform when unfocused')
            .toBe('');
      });
    });
  });
});
