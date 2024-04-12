/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';
import {FieldHarness} from '../harness.js';

import {Field} from './field.js';

declare global {
  interface HTMLElementTagNameMap {
    'md-test-field': TestField;
  }
}

@customElement('md-test-field')
class TestField extends Field {
  get labelText() {
    return this.renderRoot.querySelector('.label')?.textContent ?? '';
  }

  get supportingTextContent() {
    return this.renderRoot.querySelector('.supporting-text')?.textContent ?? '';
  }

  didErrorAnnounce() {
    return (
      this.renderRoot
        .querySelector('.supporting-text')
        ?.getAttribute('role') === 'alert'
    );
  }

  // Ensure floating/resting labels are both rendered
  protected override renderOutline(floatingLabel: TemplateResult) {
    return floatingLabel;
  }
}

describe('Field', () => {
  const env = new Environment();

  async function setupTest(props: Partial<Field> = {}) {
    // Variant type does not matter for shared tests
    const template = html`
      <md-test-field
        .label=${props.label ?? ''}
        ?disabled=${props.disabled ?? false}
        .error=${props.error ?? false}
        .populated=${props.populated ?? false}
        .required=${props.required ?? false}
        .supportingText=${props.supportingText ?? ''}
        .errorText=${props.errorText ?? ''}>
        <input />
      </md-test-field>
    `;
    const root = env.render(template);
    const instance = root.querySelector('md-test-field');
    if (!instance) {
      throw new Error('Could not query rendered <md-test-field>.');
    }

    await env.waitForStability();
    return {
      instance,
      harness: new FieldHarness(instance),
    };
  }

  it('should unfocus field when disabled', async () => {
    // Setup.
    const {instance, harness} = await setupTest();
    await harness.focusWithKeyboard();
    await env.waitForStability();
    // Test case.
    instance.disabled = true;
    await env.waitForStability();
    // Assertion.
    expect(instance.focused)
      .withContext('focused is false after disabled is set to true')
      .toBe(false);
  });

  it('should not allow focus when disabled', async () => {
    // Setup.
    const {instance, harness} = await setupTest({disabled: true});
    await harness.focusWithKeyboard();
    // Test case.
    await env.waitForStability();
    // Assertion.
    expect(instance.focused)
      .withContext('focused set back to false when disabled')
      .toBe(false);
  });

  /*
    TODO(b/225951156): update animation tests since l2w refactor breaks them
    describe('#animateLabelIfNeeded()', () => {
      it('should update visible label type to resting before animation
    finishes', async () => {
           // Setup.
           const {instance, harness} = await setupTest({label: 'Label'});
           const floatingLabel = await instance.floatingLabelElement;
           // Test case.
           await harness.focusWithKeyboard();
           await env.waitForStability();
           // Assertion.
           expect(floatingLabel.classList)
               .withContext('should display resting label for animation')
               .not.toContain('label--hidden');
         });

      it('should update visible label type to resting immediately when resting',
         async () => {
           // Setup.
           const {instance, harness} = await setupTest({label: 'Label'});
           const restingLabel = await instance.restingLabelElement;
           await harness.focusWithKeyboard();
           // Test case.
           await harness.blur();
           // Assertion.
           expect(restingLabel.classList)
               .withContext('should display resting label for animation')
               .not.toContain('label--hidden');
         });

      it('should update visible label type after floating animation ends',
         async () => {
           // Setup.
           const {instance, harness} = await setupTest({label: 'Label'});
           const animation = new Animation();
           const floatingLabel = await instance.floatingLabelElement;
           const restingLabel = await instance.restingLabelElement;
           spyOn(restingLabel, 'animate').and.returnValue(animation);
           // Test case.
           await harness.focusWithKeyboard();
           await env.waitForStability();
           animation.play();
           await env.waitForStability();
           // Assertion.
           expect(floatingLabel.classList)
               .withContext('visible label should be floating after focusing')
               .not.toContain('label--hidden');
         });

      it('should update visible label type after resting animation ends',
         async () => {
           // Setup.
           const {instance, harness} = await setupTest({label: 'Label'});
           await harness.focusWithKeyboard();
           const animation = new Animation();
           const restingLabel = await instance.restingLabelElement;
           spyOn(restingLabel, 'animate').and.returnValue(animation);
           // Test case.
           await harness.blur();
           await env.waitForStability();
           animation.play();
           await env.waitForStability();
           // Assertion.
           expect(restingLabel.classList)
               .withContext('visible label should be resting after unfocusing')
               .not.toContain('label--hidden');
         });

      it('should animate label when focused changes', async () => {
        // Setup.
        const {instance, harness} = await setupTest({label: 'Label'});
        const floatingLabel = await instance.floatingLabelElement;
        spyOn(floatingLabel, 'animate').and.callThrough();
        // Test case.
        await harness.focusWithKeyboard();
        await env.waitForStability();
        // Assertion.
        expect(floatingLabel.animate).toHaveBeenCalledTimes(1);
      });

      it('should animate label when populated changes', async () => {
        // Setup.
        const {instance} = await setupTest({label: 'Label'});
        const floatingLabel = await instance.floatingLabelElement;
        spyOn(floatingLabel, 'animate').and.callThrough();
        // Test case.
        instance.populated = true;
        await env.waitForStability();
        // Assertion.
        expect(floatingLabel.animate).toHaveBeenCalledTimes(1);
      });

      it('should not animate when there is no label', async () => {
        // Setup.
        const {instance, harness} = await setupTest({label: undefined});
        const floatingLabel = await instance.floatingLabelElement;
        spyOn(floatingLabel, 'animate').and.callThrough();
        // Test case.
        await harness.focusWithKeyboard();
        await env.waitForStability();
        // Assertion.
        expect(floatingLabel.animate)
            .withContext('should not animate label when there is none')
            .not.toHaveBeenCalled();
      });

      it('should still set the visible label type when there is no label',
         async () => {
           // Setup.
           const {instance, harness} = await setupTest({label: undefined});
           const floatingLabel = await instance.floatingLabelElement;
           await harness.focusWithKeyboard();
           // Test case.
           await env.waitForStability();
           // Assertion.
           expect(floatingLabel.classList)
               .withContext(
                   'focusing should still set visible label type to floating')
               .toContain('label--hidden');

           // Test case.
           await harness.blur();
           await env.waitForStability();
           // Test case.
           expect(floatingLabel.classList)
               .withContext(
                   'unfocusing should still set visible label type to resting')
               .not.toContain('label--hidden');
         });

      it('should not animate if focusing a populated field', async () => {
        // Setup.
        const {instance, harness} =
            await setupTest({label: 'Label', populated: true});
        const floatingLabel = await instance.floatingLabelElement;
        spyOn(floatingLabel, 'animate').and.callThrough();
        // Test case.
        await harness.focusWithKeyboard();
        await env.waitForStability();
        // Assertion.
        expect(floatingLabel.animate)
            .withContext('should not animate when focusing a populated field')
            .not.toHaveBeenCalled();
      });

      it('should not animate if populating a focused field', async () => {
        // Setup.
        const {instance, harness} = await setupTest({label: 'Label'});
        await harness.focusWithKeyboard();
        const floatingLabel = await instance.floatingLabelElement;
        spyOn(floatingLabel, 'animate').and.callThrough();
        // Test case.
        instance.populated = true;
        await env.waitForStability();
        // Assertion.
        expect(floatingLabel.animate)
            .withContext('should not animate when populated a focused field')
            .not.toHaveBeenCalled();
      });

      it('should cancel previous animation', async () => {
        // Set up.
        const {instance, harness} = await setupTest({label: 'Label'});
        const restingLabel = await instance.restingLabelElement;
        const firstAnimation = new Animation();
        spyOn(firstAnimation, 'cancel').and.callThrough();
        const secondAnimation = new Animation();
        spyOn(secondAnimation, 'cancel').and.callThrough();
        spyOn(restingLabel, 'animate')
            .and.returnValues(firstAnimation, secondAnimation);
        // Test case.
        await harness.focusWithKeyboard();
        await env.waitForStability();
        await harness.blur();
        await env.waitForStability();
        // Assertion.
        expect(firstAnimation.cancel)
            .withContext('first animation should be cancelled')
            .toHaveBeenCalled();
        expect(secondAnimation.cancel)
            .withContext('second animation should play')
            .not.toHaveBeenCalled();
      });
    });
  */
  describe('.label', () => {
    it('should render empty string when there is no label', async () => {
      // Setup.
      // Test case.
      const {instance} = await setupTest({label: undefined});
      // Assertion.
      expect(instance.labelText)
        .withContext(
          'label text should be empty string if label is not provided',
        )
        .toBe('');
    });

    it('should render label', async () => {
      // Setup.
      // Test case.
      const labelValue = 'Label';
      const {instance} = await setupTest({label: labelValue});
      // Assertion.
      expect(instance.labelText)
        .withContext('label text should equal label when not required')
        .toBe(labelValue);
    });

    it('should adds asterisk if required', async () => {
      // Setup.
      // Test case.
      const labelValue = 'Label';
      const {instance} = await setupTest({required: true, label: labelValue});
      // Assertion.
      expect(instance.labelText)
        .withContext(
          'label text should equal label with asterisk when required',
        )
        .toBe(`${labelValue}*`);
    });

    it('should not render asterisk if required when there is no label', async () => {
      // Setup.
      // Test case.
      const {instance} = await setupTest({required: true, label: undefined});
      // Assertion.
      expect(instance.labelText)
        .withContext(
          'label text should be empty string if label is not provided, even when required',
        )
        .toBe('');
    });
  });

  describe('supporting text', () => {
    it('should update to errorText when error is true', async () => {
      const errorText = 'Error message';
      const {instance} = await setupTest({
        error: true,
        supportingText: 'Supporting text',
        errorText,
      });

      expect(instance.supportingTextContent).toEqual(errorText);
    });
  });

  describe('error announcement', () => {
    it('should announce errors when both error and errorText are set', async () => {
      const {instance} = await setupTest({
        error: true,
        errorText: 'Error message',
      });

      expect(instance.didErrorAnnounce())
        .withContext('instance.didErrorAnnounce()')
        .toBeTrue();
    });

    it('should not announce supporting text', async () => {
      const {instance} = await setupTest();
      instance.error = true;
      instance.supportingText = 'Not an error';
      await env.waitForStability();

      expect(instance.didErrorAnnounce())
        .withContext('instance.didErrorAnnounce()')
        .toBeFalse();
    });

    it('should re-announce when reannounceError() is called', async () => {
      const {instance} = await setupTest({
        error: true,
        errorText: 'Error message',
      });

      instance.reannounceError();
      await env.waitForStability();
      // After lit update, but before re-render refresh
      expect(instance.didErrorAnnounce())
        .withContext('didErrorAnnounce() before refresh')
        .toBeFalse();

      // After the second lit update render refresh
      await env.waitForStability();
      expect(instance.didErrorAnnounce())
        .withContext('didErrorAnnounce() after refresh')
        .toBeTrue();
    });
  });
});
