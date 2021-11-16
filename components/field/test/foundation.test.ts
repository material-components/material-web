/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {Environment} from '../../testing/environment';
import {spyOnAllFunctions} from '../../testing/jasmine';
import {FieldFoundation, FilledFieldFoundation} from '../lib/foundation';
import {FieldAdapter, FilledFieldAdapter, LabelType} from '../lib/state';

describe('FieldFoundation', () => {
  const env = new Environment();

  function setupTest() {
    const adapter: FieldAdapter = {
      state: {
        disabled: false,
        error: false,
        labelText: '',
        focused: false,
        populated: false,
        required: false,
        visibleLabelType: LabelType.RESTING,
        get floatingLabelRect() {
          return Promise.resolve(new DOMRect(0, 0, 1, 1));
        },
        get restingLabelRect() {
          return Promise.resolve(new DOMRect(0, 0, 1, 1));
        },
      },
      animateLabel: () => {
        const animation = new Animation();
        animation.play();
        return Promise.resolve(animation);
      },
    };

    const foundation = new FieldFoundation(adapter);
    return {
      foundation: spyOnAllFunctions(foundation).and.callThrough(),
      adapter: spyOnAllFunctions(adapter).and.callThrough(),
    };
  }

  it('#onDisabledChange() unfocuses field when disabled', () => {
    const {adapter} = setupTest();
    adapter.state.focused = true;
    adapter.state.disabled = true;
    expect(adapter.state.focused)
        .withContext('focused is false after disabled is set to true')
        .toBe(false);
  });

  it('#onLabelChange() sets labelText', () => {
    const {adapter} = setupTest();
    const labelValue = 'Label';
    adapter.state.label = labelValue;
    expect(adapter.state.labelText)
        .withContext('labelText should equal label when not required')
        .toBe(labelValue);
    adapter.state.label = undefined;
    expect(adapter.state.labelText)
        .withContext(
            'labelText should be empty string if label is not provided')
        .toBe('');
  });

  it('#onLabelChange() adds asterisk if required', () => {
    const {adapter} = setupTest();
    adapter.state.required = true;
    const labelValue = 'Label';
    adapter.state.label = labelValue;
    expect(adapter.state.labelText)
        .withContext('labelText should equal label with asterisk when required')
        .toBe(`${labelValue}*`);
    adapter.state.label = undefined;
    expect(adapter.state.labelText)
        .withContext(
            'labelText should be empty string if label is not provided, even when required')
        .toBe('');
  });

  it('#onFocusedChange() does not allow focus if disabled', () => {
    const {adapter} = setupTest();
    adapter.state.disabled = true;
    adapter.state.focused = true;
    expect(adapter.state.focused)
        .withContext('focused set back to false when disabled')
        .toBe(false);
  });

  it('#onFocusedChange() animates label and sets the visible label type',
     async () => {
       const {adapter} = setupTest();
       const animation = new Animation();
       adapter.animateLabel.and.returnValue(Promise.resolve(animation));
       adapter.state.label = 'Label';
       adapter.state.focused = true;
       await env.waitForStability();
       expect(adapter.state.visibleLabelType)
           .withContext('visible label should be resting by default')
           .toBe(LabelType.RESTING);
       expect(adapter.animateLabel)
           .withContext('focusing should animate label')
           .toHaveBeenCalledTimes(1);
       animation.play();
       await env.waitForStability();
       expect(adapter.state.visibleLabelType)
           .withContext('visible label should be floating after focusing')
           .toBe(LabelType.FLOATING);
       adapter.animateLabel.calls.reset();

       adapter.state.focused = false;
       await env.waitForStability();
       expect(adapter.animateLabel)
           .withContext('unfocusing should animate label')
           .toHaveBeenCalledTimes(1);
       animation.play();
       await env.waitForStability();
       expect(adapter.state.visibleLabelType)
           .withContext('visible label should be resting after unfocusing')
           .toBe(LabelType.RESTING);
     });

  it('#onFocusedChange() sets the visible label type but does not animate if there is no label',
     async () => {
       const {adapter} = setupTest();
       adapter.state.focused = true;
       await env.waitForStability();
       expect(adapter.animateLabel)
           .withContext('should not animate label when there is none')
           .not.toHaveBeenCalled();
       expect(adapter.state.visibleLabelType)
           .withContext(
               'focusing should still set visible label type to floating')
           .toBe(LabelType.FLOATING);

       adapter.state.focused = false;
       await env.waitForStability();
       expect(adapter.animateLabel)
           .withContext('should not animate label when there is none')
           .not.toHaveBeenCalled();
       expect(adapter.state.visibleLabelType)
           .withContext(
               'unfocusing should still set visible label type to resting')
           .toBe(LabelType.RESTING);
     });

  it('#onPopulatedChange() animates label and sets the visible label type',
     async () => {
       const {adapter} = setupTest();
       const animation = new Animation();
       adapter.animateLabel.and.returnValue(Promise.resolve(animation));
       adapter.state.label = 'Label';
       adapter.state.populated = true;
       await env.waitForStability();
       expect(adapter.state.visibleLabelType)
           .withContext('visible label should be resting by default')
           .toBe(LabelType.RESTING);
       expect(adapter.animateLabel)
           .withContext('populating should animate label')
           .toHaveBeenCalledTimes(1);
       animation.play();
       await env.waitForStability();
       expect(adapter.state.visibleLabelType)
           .withContext('visible label should be floating after populating')
           .toBe(LabelType.FLOATING);
       adapter.animateLabel.calls.reset();

       adapter.state.populated = false;
       await env.waitForStability();
       expect(adapter.animateLabel)
           .withContext('unpopulating should animate label')
           .toHaveBeenCalledTimes(1);
       animation.play();
       await env.waitForStability();
       expect(adapter.state.visibleLabelType)
           .withContext('visible label should be resting after unpopulating')
           .toBe(LabelType.RESTING);
     });

  it('#onPopulatedChange() sets the visible label type but does not animate if there is no label',
     async () => {
       const {adapter} = setupTest();
       adapter.state.populated = true;
       await env.waitForStability();
       expect(adapter.animateLabel)
           .withContext('should not animate label when there is none')
           .not.toHaveBeenCalled();
       expect(adapter.state.visibleLabelType)
           .withContext(
               'populating should still set visible label type to floating')
           .toBe(LabelType.FLOATING);

       adapter.state.populated = false;
       await env.waitForStability();
       expect(adapter.animateLabel)
           .withContext('should not animate label when there is none')
           .not.toHaveBeenCalled();
       expect(adapter.state.visibleLabelType)
           .withContext(
               'unpopulating should still set visible label type to resting')
           .toBe(LabelType.RESTING);
     });

  it('#updateLayoutAsterisk() should add or remove asterisk called when required changes',
     () => {
       const {adapter} = setupTest();
       const labelValue = 'Label';
       adapter.state.label = labelValue;
       adapter.state.required = true;
       expect(adapter.state.labelText)
           .withContext('labelText should have an asterisk when required')
           .toBe(`${labelValue}*`);
       adapter.state.required = false;
       expect(adapter.state.labelText)
           .withContext('labelText should not have an asterisk when required')
           .toBe(labelValue);
     });

  it('#animateLabel() should not animate if not needed', async () => {
    const {adapter} = setupTest();
    adapter.state.label = 'Label';
    adapter.state.focused = true;
    adapter.state.populated = true;
    await env.waitForStability();
    adapter.animateLabel.calls.reset();

    adapter.state.populated = false;
    await env.waitForStability();
    expect(adapter.animateLabel)
        .withContext('should not animate when unpopulating a focused field')
        .not.toHaveBeenCalled();
    adapter.state.populated = true;
    await env.waitForStability();
    expect(adapter.animateLabel)
        .withContext('should not animate when populating a focused field')
        .not.toHaveBeenCalled();

    adapter.state.focused = false;
    await env.waitForStability();
    expect(adapter.animateLabel)
        .withContext('should not animate when focusing a populated field')
        .not.toHaveBeenCalled();
    adapter.state.focused = true;
    await env.waitForStability();
    expect(adapter.animateLabel)
        .withContext('should not animate when unfocusing a populated field')
        .not.toHaveBeenCalled();
  });

  it('#animateLabel() should only animate once if floating state changes quickly',
     async () => {
       const {adapter} = setupTest();
       adapter.state.label = 'Label';
       adapter.state.focused = true;
       adapter.state.focused = false;
       adapter.state.populated = true;
       adapter.state.populated = false;
       await env.waitForStability();
       expect(adapter.animateLabel)
           .withContext(
               'changing animation state quickly should only call animateLabel once')
           .toHaveBeenCalledTimes(1);
     });

  it('#animateLabel() should cancel previous animations if still playing while floating state changes',
     async () => {
       const {adapter} = setupTest();
       const firstAnimation = new Animation();
       spyOn(firstAnimation, 'cancel').and.callThrough();
       const secondAnimation = new Animation();
       spyOn(secondAnimation, 'cancel').and.callThrough();
       adapter.animateLabel.and.returnValues(
           Promise.resolve(firstAnimation), Promise.resolve(secondAnimation));
       adapter.state.label = 'Label';
       adapter.state.focused = true;
       await env.waitForStability();
       adapter.state.focused = false;
       await env.waitForStability();
       expect(firstAnimation.cancel)
           .withContext('first animation should be cancelled')
           .toHaveBeenCalled();
       expect(secondAnimation.cancel)
           .withContext('second animation should play')
           .not.toHaveBeenCalled();
     });
});

describe('FilledFieldFoundation', () => {
  const env = new Environment();

  function setupTest() {
    const adapter: FilledFieldAdapter = {
      state: {
        disabled: false,
        error: false,
        labelText: '',
        focused: false,
        populated: false,
        required: false,
        visibleLabelType: LabelType.RESTING,
        strokeTransformOrigin: '',
        get rootRect() {
          return Promise.resolve(new DOMRect(0, 0, 1, 1));
        },
        get floatingLabelRect() {
          return Promise.resolve(new DOMRect(0, 0, 1, 1));
        },
        get restingLabelRect() {
          return Promise.resolve(new DOMRect(0, 0, 1, 1));
        },
      },
      animateLabel: () => {
        const animation = new Animation();
        animation.play();
        return Promise.resolve(animation);
      },
    };

    const foundation = new FilledFieldFoundation(adapter);
    return {
      foundation: spyOnAllFunctions(foundation).and.callThrough(),
      adapter: spyOnAllFunctions(adapter).and.callThrough(),
    };
  }

  it('#handleClick() should set strokeTransformOrigin', async () => {
    const {foundation, adapter} = setupTest();
    const event = new MouseEvent('click', {clientX: 10});
    foundation.handleClick(event);
    await env.waitForStability();
    expect(adapter.state.strokeTransformOrigin).toBe('10px');
  });

  it('#handleClick() should do nothing when disabled', async () => {
    const {foundation, adapter} = setupTest();
    adapter.state.disabled = true;
    const event = new MouseEvent('click', {clientX: 10});
    foundation.handleClick(event);
    await env.waitForStability();
    expect(adapter.state.strokeTransformOrigin)
        .withContext('strokeTransformOrigin should not be set when disabled')
        .toBe('');
  });

  it('#onFocusedChange() should reset strokeTransformOrigin when unfocusing',
     async () => {
       const {adapter} = setupTest();
       adapter.state.focused = true;
       adapter.state.strokeTransformOrigin = '10px';
       await env.waitForStability();
       adapter.state.focused = false;
       await env.waitForStability();
       expect(adapter.state.strokeTransformOrigin)
           .withContext('unfocusing should reset strokeTransformOrigin')
           .toBe('');
     });
});
