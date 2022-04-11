/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {SegmentedButtonState} from '../../segmented_button/lib/state';
import {spyOnAllFunctions} from '../../testing/jasmine';
import {SegmentedButtonSetFoundation} from '../lib/foundation';
import {SegmentedButtonSetAdapter} from '../lib/state';


/** Used to allow passing through a custom target. */
function fakeMouseEvent(data: object): MouseEvent {
  return {
    ...data,
    preventDefault: jasmine.createSpy('preventDefault'),
  } as unknown as MouseEvent;
}

/** Used to allow passing through a custom target. */
function fakeKeyboardEvent(data: object): KeyboardEvent {
  return {
    ...data,
    preventDefault: jasmine.createSpy('preventDefault'),
  } as unknown as KeyboardEvent;
}

/** Used to allow passing through a custom target. */
function fakeFocusEvent(data: object): FocusEvent {
  return {
    ...data,
    preventDefault: jasmine.createSpy('preventDefault'),
  } as unknown as FocusEvent;
}

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

    it('#handleFocusIn() makes the target button selected', () => {
      const buttons: SegmentedButtonState[] = [
        {
          label: 'Button 0',
          disabled: false,
          selected: false,
          focusable: false,
        },
        {
          label: 'Button 1',
          disabled: false,
          selected: false,
          focusable: true,
        },
      ];

      const {adapter, foundation} = setupSingleSelectTest({
        buttons,
      });

      foundation.handleFocusIn(fakeFocusEvent({
        target: buttons[1],
      }));
      expect(adapter.state.buttons[0].selected)
          .withContext('0th button')
          .toBeFalse();
      expect(adapter.state.buttons[1].selected)
          .withContext('1st button')
          .toBeTrue();
    });
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

    it('#handleFocusIn() does not update selection', () => {
      const buttons: SegmentedButtonState[] = [
        {
          label: 'Button 0',
          disabled: false,
          selected: true,
          focusable: false,
        },
        {
          label: 'Button 1',
          disabled: false,
          selected: false,
          focusable: true,
        },
      ];

      const {adapter, foundation} = setupMultiSelectTest({
        buttons,
      });

      foundation.handleFocusIn(fakeFocusEvent({
        target: buttons[1],
      }));
      expect(adapter.state.buttons[0].selected)
          .withContext('0th button')
          .toBeTrue();
      expect(adapter.state.buttons[1].selected)
          .withContext('1st button')
          .toBeFalse();
    });
  });

  describe('LTR navigation', () => {
    function setupLtrTest(
        opts: Omit<SegmentedButtonSetOptions, 'isRTL'|'isMultiselect'>) {
      return setupTest({
        isRTL: false,
        isMultiselect: false,
        ...opts,
      });
    }

    it('handleKeydown(ArrowLeft) makes focusable and focuses the prior button',
       () => {
         const buttons: SegmentedButtonState[] = [
           {
             label: 'Button 0',
             focusable: false,
             selected: false,
             disabled: false,
           },
           {
             label: 'Button 1',
             focusable: false,
             selected: false,
             disabled: false,
           },
           {
             label: 'Button 2',
             focusable: true,
             selected: false,
             disabled: false,
           },
         ];

         const {adapter, foundation} = setupLtrTest({
           buttons,
         });

         foundation.handleKeydown(fakeKeyboardEvent({
           key: 'ArrowLeft',
           target: buttons[2],
         }));
         expect(adapter.state.buttons[0].focusable)
             .withContext('0th button')
             .toBeFalse();
         expect(adapter.state.buttons[1].focusable)
             .withContext('1st button')
             .toBeTrue();
         expect(adapter.state.buttons[2].focusable)
             .withContext('2nd button')
             .toBeFalse();
         expect(adapter.focusButton)
             .withContext('focuses button')
             .toHaveBeenCalledOnceWith(1);
       });

    it('handleKeydown(ArrowLeft) makes focusable and focuses the prior non-disabled button',
       () => {
         const buttons: SegmentedButtonState[] = [
           {
             label: 'Button 0',
             focusable: false,
             selected: false,
             disabled: false,
           },
           {
             label: 'Button 1',
             focusable: false,
             selected: false,
             disabled: true,
           },
           {
             label: 'Button 2',
             focusable: true,
             selected: false,
             disabled: false,
           },
         ];

         const {adapter, foundation} = setupLtrTest({
           buttons,
         });

         foundation.handleKeydown(fakeKeyboardEvent({
           key: 'ArrowLeft',
           target: buttons[2],
         }));
         expect(adapter.state.buttons[0].focusable)
             .withContext('0th button')
             .toBeTrue();
         expect(adapter.state.buttons[1].focusable)
             .withContext('1st disabled button')
             .toBeFalse();
         expect(adapter.state.buttons[2].focusable)
             .withContext('2nd button')
             .toBeFalse();
         expect(adapter.focusButton)
             .withContext('focuses button')
             .toHaveBeenCalledOnceWith(0);
       });

    it('handleKeydown(ArrowRight) makes focusable and focuses the next button',
       () => {
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
           {
             label: 'Button 2',
             focusable: false,
             selected: false,
             disabled: false,
           },
         ];

         const {adapter, foundation} = setupLtrTest({
           buttons,
         });

         foundation.handleKeydown(fakeKeyboardEvent({
           key: 'ArrowRight',
           target: buttons[0],
         }));
         expect(adapter.state.buttons[0].focusable)
             .withContext('0th button')
             .toBeFalse();
         expect(adapter.state.buttons[1].focusable)
             .withContext('1st button')
             .toBeTrue();
         expect(adapter.state.buttons[2].focusable)
             .withContext('2nd button')
             .toBeFalse();
         expect(adapter.focusButton)
             .withContext('focuses button')
             .toHaveBeenCalledOnceWith(1);
       });

    it('handleKeydown(ArrowRight) makes focusable and focuses the next non-disabled button',
       () => {
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
             disabled: true,
           },
           {
             label: 'Button 2',
             focusable: false,
             selected: false,
             disabled: false,
           },
         ];

         const {adapter, foundation} = setupLtrTest({
           buttons,
         });

         foundation.handleKeydown(fakeKeyboardEvent({
           key: 'ArrowRight',
           target: buttons[0],
         }));
         expect(adapter.state.buttons[0].focusable)
             .withContext('0th button')
             .toBeFalse();
         expect(adapter.state.buttons[1].focusable)
             .withContext('1st disabled button')
             .toBeFalse();
         expect(adapter.state.buttons[2].focusable)
             .withContext('2nd button')
             .toBeTrue();
         expect(adapter.focusButton)
             .withContext('focuses button')
             .toHaveBeenCalledOnceWith(2);
       });
  });

  describe('RTL navigation', () => {
    function setupRtlTest(
        opts: Omit<SegmentedButtonSetOptions, 'isRTL'|'isMultiselect'>) {
      return setupTest({
        isRTL: true,
        isMultiselect: false,
        ...opts,
      });
    }

    it('handleKeydown(ArrowLeft) makes focusable and focuses the next button',
       () => {
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
           {
             label: 'Button 2',
             focusable: false,
             selected: false,
             disabled: false,
           },
         ];

         const {adapter, foundation} = setupRtlTest({
           buttons,
         });

         foundation.handleKeydown(
             fakeKeyboardEvent({key: 'ArrowLeft', target: buttons[0]}));
         expect(adapter.state.buttons[0].focusable)
             .withContext('0th button')
             .toBeFalse();
         expect(adapter.state.buttons[1].focusable)
             .withContext('1st button')
             .toBeTrue();
         expect(adapter.state.buttons[2].focusable)
             .withContext('2nd button')
             .toBeFalse();
         expect(adapter.focusButton)
             .withContext('focuses button')
             .toHaveBeenCalledOnceWith(1);
       });

    it('handleKeydown(ArrowLeft) makes focusable and focuses the next non-disabled button',
       () => {
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
             disabled: true,
           },
           {
             label: 'Button 2',
             focusable: false,
             selected: false,
             disabled: false,
           },
         ];

         const {adapter, foundation} = setupRtlTest({
           buttons,
         });

         foundation.handleKeydown(fakeKeyboardEvent({
           key: 'ArrowLeft',
           target: buttons[0],
         }));
         expect(adapter.state.buttons[0].focusable)
             .withContext('0th button')
             .toBeFalse();
         expect(adapter.state.buttons[1].focusable)
             .withContext('1st disabled button')
             .toBeFalse();
         expect(adapter.state.buttons[2].focusable)
             .withContext('2nd button')
             .toBeTrue();
         expect(adapter.focusButton)
             .withContext('focuses button')
             .toHaveBeenCalledOnceWith(2);
       });

    it('handleKeydown(ArrowRight) makes focusable and focuses the next button',
       () => {
         const buttons: SegmentedButtonState[] = [
           {
             label: 'Button 0',
             focusable: false,
             selected: false,
             disabled: false,
           },
           {
             label: 'Button 1',
             focusable: false,
             selected: false,
             disabled: false,
           },
           {
             label: 'Button 2',
             focusable: true,
             selected: false,
             disabled: false,
           },
         ];

         const {adapter, foundation} = setupRtlTest({
           buttons,
         });

         foundation.handleKeydown(fakeKeyboardEvent({
           key: 'ArrowRight',
           target: buttons[2],
         }));
         expect(adapter.state.buttons[0].focusable)
             .withContext('0th button')
             .toBeFalse();
         expect(adapter.state.buttons[1].focusable)
             .withContext('1st button')
             .toBeTrue();
         expect(adapter.state.buttons[2].focusable)
             .withContext('2nd button')
             .toBeFalse();
         expect(adapter.focusButton)
             .withContext('focuses button')
             .toHaveBeenCalledOnceWith(1);
       });

    it('handleKeydown(ArrowRight) makes focusable and focuses the next non-disabled button',
       () => {
         const buttons: SegmentedButtonState[] = [
           {
             label: 'Button 0',
             focusable: false,
             selected: false,
             disabled: false,
           },
           {
             label: 'Button 1',
             focusable: false,
             selected: false,
             disabled: true,
           },
           {
             label: 'Button 2',
             focusable: true,
             selected: false,
             disabled: false,
           },
         ];

         const {adapter, foundation} = setupRtlTest({
           buttons,
         });

         foundation.handleKeydown(fakeKeyboardEvent({
           key: 'ArrowRight',
           target: buttons[2],
         }));
         expect(adapter.state.buttons[0].focusable)
             .withContext('0th button')
             .toBeTrue();
         expect(adapter.state.buttons[1].focusable)
             .withContext('1st disabled button')
             .toBeFalse();
         expect(adapter.state.buttons[2].focusable)
             .withContext('2nd button')
             .toBeFalse();
         expect(adapter.focusButton)
             .withContext('focuses button')
             .toHaveBeenCalledOnceWith(0);
       });
  });

  it('#onButtonsChange() makes the first non-disabled component focusable',
     () => {
       const startButtons: SegmentedButtonState[] = [
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

       const endButtons: SegmentedButtonState[] = [
         {
           label: 'Button X',
           disabled: true,
           selected: false,
           focusable: false,
         },
         {
           label: 'Button Y',
           disabled: false,
           selected: false,
           focusable: false,
         }
       ];

       const {adapter} = setupTest({
         isMultiselect: false,
         isRTL: false,
         buttons: startButtons,
       });

       adapter.state.buttons = endButtons;

       expect(adapter.state.buttons[0].focusable)
           .withContext('0th button')
           .toBeFalse();
       expect(adapter.state.buttons[1].focusable)
           .withContext('1st button')
           .toBeTrue();
     });

  it('#onButtonsChange() makes only one button focusable', () => {
    const startButtons: SegmentedButtonState[] = [
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

    const endButtons: SegmentedButtonState[] = [
      {
        label: 'Button X',
        disabled: false,
        selected: false,
        focusable: true,
      },
      {
        label: 'Button Y',
        disabled: false,
        selected: false,
        focusable: true,
      }
    ];

    const {adapter} = setupTest({
      isMultiselect: false,
      isRTL: false,
      buttons: startButtons,
    });

    adapter.state.buttons = endButtons;

    expect(adapter.state.buttons[0].focusable)
        .withContext('0th button')
        .toBeTrue();
    expect(adapter.state.buttons[1].focusable)
        .withContext('1st button')
        .toBeFalse();
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

  it('#handleKeydown(Home) makes focusable and focuses the first button',
     () => {
       const buttons: SegmentedButtonState[] = [
         {
           label: 'Button 0',
           focusable: false,
           selected: false,
           disabled: false,
         },
         {
           label: 'Button 1',
           focusable: false,
           selected: false,
           disabled: false,
         },
         {
           label: 'Button 2',
           focusable: true,
           selected: false,
           disabled: false,
         },
       ];

       const {adapter, foundation} = setupTest({
         isRTL: false,
         isMultiselect: false,
         buttons,
       });

       foundation.handleKeydown(
           fakeKeyboardEvent({key: 'Home', target: buttons[2]}));
       expect(adapter.state.buttons[0].focusable)
           .withContext('0th button')
           .toBeTrue();
       expect(adapter.state.buttons[1].focusable)
           .withContext('1st button')
           .toBeFalse();
       expect(adapter.state.buttons[2].focusable)
           .withContext('2nd button')
           .toBeFalse();
       expect(adapter.focusButton)
           .withContext('focuses button')
           .toHaveBeenCalledOnceWith(0);
     });

  it('#handleKeydown(Home) makes focusable and focuses the first non-disabled button',
     () => {
       const buttons: SegmentedButtonState[] = [
         {
           label: 'Button 0',
           focusable: false,
           selected: false,
           disabled: true,
         },
         {
           label: 'Button 1',
           focusable: false,
           selected: false,
           disabled: false,
         },
         {
           label: 'Button 2',
           focusable: true,
           selected: false,
           disabled: false,
         },
       ];

       const {adapter, foundation} = setupTest({
         isRTL: false,
         isMultiselect: false,
         buttons,
       });

       foundation.handleKeydown(fakeKeyboardEvent({
         key: 'Home',
         target: buttons[2],
       }));
       expect(adapter.state.buttons[0].focusable)
           .withContext('0th button')
           .toBeFalse();
       expect(adapter.state.buttons[1].focusable)
           .withContext('1st button')
           .toBeTrue();
       expect(adapter.state.buttons[2].focusable)
           .withContext('2nd button')
           .toBeFalse();
       expect(adapter.focusButton)
           .withContext('focuses button')
           .toHaveBeenCalledOnceWith(1);
     });

  it('#handleKeydown(End) makes focusable and focuses the last button', () => {
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
      {
        label: 'Button 2',
        focusable: false,
        selected: false,
        disabled: false,
      },
    ];

    const {adapter, foundation} = setupTest({
      isRTL: false,
      isMultiselect: false,
      buttons,
    });

    foundation.handleKeydown(fakeKeyboardEvent({
      key: 'End',
      target: buttons[0],
    }));
    expect(adapter.state.buttons[0].focusable)
        .withContext('0th button')
        .toBeFalse();
    expect(adapter.state.buttons[1].focusable)
        .withContext('1st button')
        .toBeFalse();
    expect(adapter.state.buttons[2].focusable)
        .withContext('2nd button')
        .toBeTrue();
    expect(adapter.focusButton)
        .withContext('focuses button')
        .toHaveBeenCalledOnceWith(2);
  });

  it('#handleKeydown(End) makes focusable and focuses the last non-disabled button',
     () => {
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
         {
           label: 'Button 2',
           focusable: false,
           selected: false,
           disabled: true,
         },
       ];

       const {adapter, foundation} = setupTest({
         isRTL: false,
         isMultiselect: false,
         buttons,
       });

       foundation.handleKeydown(fakeKeyboardEvent({
         key: 'End',
         target: buttons[0],
       }));
       expect(adapter.state.buttons[0].focusable)
           .withContext('0th button')
           .toBeFalse();
       expect(adapter.state.buttons[1].focusable)
           .withContext('1st button')
           .toBeTrue();
       expect(adapter.state.buttons[2].focusable)
           .withContext('2nd button')
           .toBeFalse();
       expect(adapter.focusButton)
           .withContext('focuses button')
           .toHaveBeenCalledOnceWith(1);
     });

  it('#handleKeydown(ArrowUp) makes focusable and focuses the previous non-disabled button',
     () => {
       const buttons: SegmentedButtonState[] = [
         {
           label: 'Button 0',
           focusable: false,
           selected: false,
           disabled: false,
         },
         {
           label: 'Button 1',
           focusable: false,
           selected: false,
           disabled: true,
         },
         {
           label: 'Button 2',
           focusable: true,
           selected: false,
           disabled: false,
         },
       ];

       const {adapter, foundation} = setupTest({
         isRTL: false,
         isMultiselect: false,
         buttons,
       });

       foundation.handleKeydown(fakeKeyboardEvent({
         key: 'ArrowUp',
         target: buttons[2],
       }));
       expect(adapter.state.buttons[0].focusable)
           .withContext('0th button')
           .toBeTrue();
       expect(adapter.state.buttons[1].focusable)
           .withContext('1st button')
           .toBeFalse();
       expect(adapter.state.buttons[2].focusable)
           .withContext('2nd button')
           .toBeFalse();
       expect(adapter.focusButton)
           .withContext('focuses button')
           .toHaveBeenCalledOnceWith(0);
     });

  it('#handleKeydown(ArrowDown) makes focusable and focuses the next non-disabled button',
     () => {
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
           disabled: true,
         },
         {
           label: 'Button 2',
           focusable: false,
           selected: false,
           disabled: false,
         },
       ];

       const {adapter, foundation} = setupTest({
         isRTL: false,
         isMultiselect: false,
         buttons,
       });

       foundation.handleKeydown(fakeKeyboardEvent({
         key: 'ArrowDown',
         target: buttons[0],
       }));
       expect(adapter.state.buttons[0].focusable)
           .withContext('0th button')
           .toBeFalse();
       expect(adapter.state.buttons[1].focusable)
           .withContext('1st button')
           .toBeFalse();
       expect(adapter.state.buttons[2].focusable)
           .withContext('2nd button')
           .toBeTrue();
       expect(adapter.focusButton)
           .withContext('focuses button')
           .toHaveBeenCalledOnceWith(2);
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