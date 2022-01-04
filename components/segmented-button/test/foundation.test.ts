/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {Environment} from '../../testing/environment';
import {spyOnAllFunctions} from '../../testing/jasmine';
import {SegmentedButtonFoundation, SegmentedButtonSetFoundation} from '../lib/foundation';
import {SegmentedButtonAdapter, SegmentedButtonSetAdapter, SegmentedButtonState} from '../lib/state';

function fakeMouseEvent(data: object): MouseEvent {
  return {
    ...data,
    preventDefault: jasmine.createSpy('preventDefault'),
  } as unknown as MouseEvent;
}

function fakeKeyboardEvent(data: object): KeyboardEvent {
  return {
    ...data,
    preventDefault: jasmine.createSpy('preventDefault'),
  } as unknown as KeyboardEvent;
}

describe('SegmentedButtonFoundation', () => {
  const env = new Environment();
  function setupTest() {
    const adapter: SegmentedButtonAdapter = {
      state: {
        disabled: false,
        selected: false,
        focusable: false,
        label: '',
      },
      animateSelection: () => {
        const anim = new Animation();
        anim.play();
        return Promise.resolve(anim);
      },
    };

    const foundation = new SegmentedButtonFoundation(adapter);
    return {
      foundation: spyOnAllFunctions(foundation).and.callThrough(),
      adapter: spyOnAllFunctions(adapter).and.callThrough(),
    };
  }

  it('#onSelectedChange() animates selection', async () => {
    // Setup.
    const {adapter} = setupTest();
    const animation = new Animation();
    adapter.animateSelection.and.returnValue(Promise.resolve(animation));
    // Test case.
    adapter.state.selected = true;
    await env.waitForStability();
    // Assertion.
    expect(adapter.animateSelection)
        .withContext('should animates selecting')
        .toHaveBeenCalledTimes(1);
  });

  it('#onSelectedChange() animates deselection', async () => {
    // Setup.
    const {adapter} = setupTest();
    adapter.state.selected = true;
    await env.waitForStability();
    adapter.animateSelection.calls.reset();
    const animation = new Animation();
    adapter.animateSelection.and.returnValue(Promise.resolve(animation));
    // Test case.
    adapter.state.selected = false;
    await env.waitForStability();
    // Assertion.
    expect(adapter.animateSelection)
        .withContext('should animates selecting')
        .toHaveBeenCalledTimes(1);
  });
});

interface SegmentedButtonSetOptions {
  buttons: SegmentedButtonState[];
  isRTL: boolean;
  isMultiselect: boolean;
}

describe('SegmentedButtonSetFoundation', () => {
  function setupTest(opts: SegmentedButtonSetOptions) {
    const adapter: SegmentedButtonSetAdapter = {
      state: {
        buttons: opts.buttons,
        get isRTL() {
          return opts.isRTL;
        },
        get isMultiselect() {
          return opts.isMultiselect;
        },
      },
      focusButton: () => {},
    };

    const foundation = new SegmentedButtonSetFoundation(adapter);
    return {
      foundation: spyOnAllFunctions(foundation).and.callThrough(),
      adapter: spyOnAllFunctions(adapter).and.callThrough(),
    };
  }

  describe('single select', () => {
    function setupSingleSelectTest(
        opts: Omit<SegmentedButtonSetOptions, 'isMultiselect'|'isRTL'>) {
      return setupTest({isMultiselect: false, isRTL: false, ...opts});
    }

    it('#handleClick() selects the unselected target button', () => {
      const buttons: SegmentedButtonState[] = [
        {
          label: 'Button 0',
          disabled: false,
          selected: true,
          focusable: true,
        },
        {
          label: 'Button 1',
          disabled: false,
          selected: false,
          focusable: false,
        },
      ];

      const {adapter, foundation} = setupSingleSelectTest({
        buttons,
      });

      foundation.handleClick(fakeMouseEvent({
        target: buttons[1],
      }));
      expect(adapter.state.buttons[0].selected)
          .withContext('0th button')
          .toBeFalse();
      expect(adapter.state.buttons[1].selected)
          .withContext('1st button')
          .toBeTrue();
    });

    it('#handleClick() does not deselect the selected target button', () => {
      const buttons: SegmentedButtonState[] = [
        {
          label: 'Button 0',
          disabled: false,
          selected: false,
          focusable: true,
        },
        {
          label: 'Button 1',
          disabled: false,
          selected: true,
          focusable: false,
        },
      ];

      const {adapter, foundation} = setupSingleSelectTest({
        buttons,
      });

      foundation.handleClick(fakeMouseEvent({
        target: buttons[1],
      }));
      expect(adapter.state.buttons[0].selected)
          .withContext('0th button')
          .toBeFalse();
      expect(adapter.state.buttons[1].selected)
          .withContext('1st button')
          .toBeTrue();
    });

    it('#handleClick() makes the target button focusable', () => {
      const buttons: SegmentedButtonState[] = [
        {
          label: 'Button 0',
          disabled: false,
          selected: true,
          focusable: true,
        },
        {
          label: 'Button 1',
          disabled: false,
          selected: false,
          focusable: false,
        },
      ];

      const {adapter, foundation} = setupSingleSelectTest({
        buttons,
      });

      foundation.handleClick(fakeMouseEvent({
        target: buttons[1],
      }));
      expect(adapter.state.buttons[0].focusable)
          .withContext('0th button')
          .toBeFalse();
      expect(adapter.state.buttons[1].focusable)
          .withContext('1st button')
          .toBeTrue();
      expect(adapter.focusButton)
          .withContext('focuses button')
          .not.toHaveBeenCalled();
    });

    const interactionKeys = [
      'Enter',
      ' ',  // Spacebar
    ];

    for (const key of interactionKeys) {
      it(`#handleKeydown("${key}") selects the unselected target button`,
         () => {
           const buttons: SegmentedButtonState[] = [
             {
               label: 'Button 0',
               disabled: false,
               selected: true,
               focusable: true,
             },
             {
               label: 'Button 1',
               disabled: false,
               selected: false,
               focusable: false,
             },
           ];

           const {adapter, foundation} = setupSingleSelectTest({
             buttons,
           });

           foundation.handleKeydown(fakeKeyboardEvent({
             target: buttons[1],
             key,
           }));
           expect(adapter.state.buttons[0].selected)
               .withContext('0th button')
               .toBeFalse();
           expect(adapter.state.buttons[1].selected)
               .withContext('1st button')
               .toBeTrue();
         });

      it(`#handleKeydown("${
             key}") does not deselect the selected target button`,
         () => {
           const buttons: SegmentedButtonState[] = [
             {
               label: 'Button 0',
               disabled: false,
               selected: false,
               focusable: true,
             },
             {
               label: 'Button 1',
               disabled: false,
               selected: true,
               focusable: false,
             },
           ];

           const {adapter, foundation} = setupSingleSelectTest({
             buttons,
           });

           foundation.handleKeydown(fakeKeyboardEvent({
             target: buttons[1],
             key,
           }));
           expect(adapter.state.buttons[0].selected)
               .withContext('0th button')
               .toBeFalse();
           expect(adapter.state.buttons[1].selected)
               .withContext('1st button')
               .toBeTrue();
         });

      it(`#handleKeydown("${key}") makes the target button focusable`, () => {
        const buttons: SegmentedButtonState[] = [
          {
            label: 'Button 0',
            disabled: false,
            selected: true,
            focusable: true,
          },
          {
            label: 'Button 1',
            disabled: false,
            selected: false,
            focusable: false,
          },
        ];

        const {adapter, foundation} = setupSingleSelectTest({
          buttons,
        });

        foundation.handleKeydown(fakeKeyboardEvent({
          target: buttons[1],
          key,
        }));
        expect(adapter.state.buttons[0].focusable)
            .withContext('0th button')
            .toBeFalse();
        expect(adapter.state.buttons[1].focusable)
            .withContext('1st button')
            .toBeTrue();
        expect(adapter.focusButton)
            .withContext('focuses button')
            .not.toHaveBeenCalled();
      });
    }
  });

  describe('multiselect', () => {
    function setupMultiSelectTest(
        opts: Omit<SegmentedButtonSetOptions, 'isMultiselect'|'isRTL'>) {
      return setupTest({isMultiselect: true, isRTL: false, ...opts});
    }

    it('#handleClick() selects the unselected target button', () => {
      const buttons: SegmentedButtonState[] = [
        {
          label: 'Button 0',
          disabled: false,
          selected: true,
          focusable: true,
        },
        {
          label: 'Button 1',
          disabled: false,
          selected: false,
          focusable: false,
        },
      ];

      const {adapter, foundation} = setupMultiSelectTest({
        buttons,
      });

      foundation.handleClick(fakeMouseEvent({
        target: buttons[1],
      }));
      expect(adapter.state.buttons[0].selected)
          .withContext('0th button')
          .toBeTrue();
      expect(adapter.state.buttons[1].selected)
          .withContext('1st button')
          .toBeTrue();
    });

    it('#handleClick() deselects the selected target button', () => {
      const buttons: SegmentedButtonState[] = [
        {
          label: 'Button 0',
          disabled: false,
          selected: true,
          focusable: true,
        },
        {
          label: 'Button 1',
          disabled: false,
          selected: true,
          focusable: false,
        },
      ];

      const {adapter, foundation} = setupMultiSelectTest({
        buttons,
      });

      foundation.handleClick(fakeMouseEvent({
        target: buttons[1],
      }));
      expect(adapter.state.buttons[0].selected)
          .withContext('0th button')
          .toBeTrue();
      expect(adapter.state.buttons[1].selected)
          .withContext('1st button')
          .toBeFalse();
    });

    it('#handleClick() makes the target button focusable', () => {
      const buttons: SegmentedButtonState[] = [
        {
          label: 'Button 0',
          disabled: false,
          selected: true,
          focusable: true,
        },
        {
          label: 'Button 1',
          disabled: false,
          selected: false,
          focusable: false,
        },
      ];

      const {adapter, foundation} = setupMultiSelectTest({
        buttons,
      });

      foundation.handleClick(fakeMouseEvent({
        target: buttons[1],
      }));
      expect(adapter.state.buttons[0].focusable)
          .withContext('0th button')
          .toBeFalse();
      expect(adapter.state.buttons[1].focusable)
          .withContext('1st button')
          .toBeTrue();
      expect(adapter.focusButton)
          .withContext('focuses button')
          .not.toHaveBeenCalled();
    });
  });

  it('#handleClick() does not select disabled buttons', () => {
    const buttons: SegmentedButtonState[] = [
      {
        label: 'Button 0',
        disabled: false,
        selected: true,
        focusable: true,
      },
      {
        label: 'Button 1',
        disabled: true,
        selected: false,
        focusable: false,
      },
    ];

    const {adapter, foundation} = setupTest({
      isMultiselect: false,
      isRTL: false,
      buttons,
    });

    foundation.handleClick(fakeMouseEvent({
      target: buttons[1],
    }));
    expect(adapter.state.buttons[0].selected)
        .withContext('0th button')
        .toBeTrue();
    expect(adapter.state.buttons[1].selected)
        .withContext('1st button')
        .toBeFalse();
  });
  const allKeys = [
    'Enter',
    ' ',  // Spacebar
  ];

  for (const key of allKeys) {
    it(`#handleKeyDown("${key}") calls prevents default`, () => {
      const buttons: SegmentedButtonState[] = [
        {
          label: 'Button 0',
          focusable: true,
          selected: false,
          disabled: false,
        },
        {
          label: 'Button 1',
          focusable: false,
          selected: false,
          disabled: false,
        },
      ];

      const {foundation} = setupTest({
        isRTL: false,
        isMultiselect: false,
        buttons,
      });

      const keydown = fakeKeyboardEvent({
        target: buttons[0],
        key,
      });
      foundation.handleKeydown(keydown);
      expect(keydown.preventDefault).toHaveBeenCalled();
    });
  }
});