/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {spyOnAllFunctions} from '../../testing/jasmine';
import {FieldFoundation} from '../lib/foundation';
import {FieldAdapter, LabelType} from '../lib/state';

describe('FieldFoundation', () => {
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
      }
    };

    const foundation = new FieldFoundation(adapter);
    return {
      foundation: spyOnAllFunctions(foundation).and.callThrough(),
      adapter: spyOnAllFunctions(adapter).and.callThrough(),
    };
  }

  it('#onDisabledChange() unfocuses field when disabled', () => {
    const {foundation, adapter} = setupTest();
    foundation.init();
    adapter.state.focused = true;
    adapter.state.disabled = true;
    expect(adapter.state.focused)
        .withContext('focused is false after disabled is set to true')
        .toBe(false);
  });

  it('#onFocusedChange() does not allow focus if disabled', () => {
    const {foundation, adapter} = setupTest();
    foundation.init();
    adapter.state.disabled = true;
    adapter.state.focused = true;
    expect(adapter.state.focused)
        .withContext('focused set back to false when disabled')
        .toBe(false);
  });

  it('#updateLayoutAsterisk() sets labelText when label or required changes',
     () => {
       const {foundation, adapter} = setupTest();
       foundation.init();
       const labelValue = 'Label';
       adapter.state.label = labelValue;
       expect(adapter.state.labelText)
           .withContext('labelText should equal label when not required')
           .toBe(labelValue);
       adapter.state.required = true;
       expect(adapter.state.labelText)
           .withContext(
               'labelText should equal label with asterisk when required')
           .toBe(`${labelValue}*`);
       adapter.state.label = undefined;
       expect(adapter.state.labelText)
           .withContext(
               'labelText should be empty string if label is not provided, even when required')
           .toBe('');
     });
});
