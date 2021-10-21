/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {KEY} from 'google3/third_party/javascript/material_components_web/dom/keyboard';
import {setUpFoundationTest, setUpMdcTestEnvironment} from 'google3/third_party/javascript/material_components_web/testing/helpers/setup';

import {MDCNavigationBarFoundation} from '../foundation';

describe('MDCNavigationBarFoundation', () => {
  setUpMdcTestEnvironment();

  function setupTest() {
    return setUpFoundationTest(MDCNavigationBarFoundation, {
      state: {
        activeIndex: 0,
        hideInactiveLabels: false,
        tabs: [
          {active: true, hideInactiveLabel: false},
          {active: false, hideInactiveLabel: false},
          {active: false, hideInactiveLabel: false},
        ]
      },
      focusTab: () => {},
      getFocusedTabIndex: () => {
        return 0;
      },
      isRTL: () => {
        return false;
      },
    });
  }

  it('#handleNavigationTabInteraction() activates the given tab', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    expect(mockAdapter.state.activeIndex).toBe(0);
    foundation.handleNavigationTabInteraction(new CustomEvent(
        'interaction', {detail: {state: mockAdapter.state.tabs[2]}}));
    expect(mockAdapter.state.activeIndex).toBe(2);
  });

  it('#handleKeydown(Enter) activates the focused tab', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    mockAdapter.getFocusedTabIndex.and.returnValue(1);
    const event = {key: KEY.ENTER} as KeyboardEvent;
    expect(mockAdapter.state.activeIndex).toBe(0);
    foundation.handleKeydown(event);
    expect(mockAdapter.state.activeIndex).toBe(1);
  });

  it('#handleKeydown(Spacebar) activates the focused tab', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    mockAdapter.getFocusedTabIndex.and.returnValue(2);
    const event = {key: KEY.SPACEBAR} as KeyboardEvent;
    expect(mockAdapter.state.activeIndex).toBe(0);
    foundation.handleKeydown(event);
    expect(mockAdapter.state.activeIndex).toBe(2);
  });

  it('#handleKeydown(Home) sets focus on the first tab', () => {
    const {foundation, mockAdapter} = setupTest();
    const event = {key: KEY.HOME} as KeyboardEvent;
    foundation.handleKeydown(event);
    expect(mockAdapter.focusTab).toHaveBeenCalledWith(0);
  });

  it('#handleKeydown(End) sets focus on the last tab', () => {
    const {foundation, mockAdapter} = setupTest();
    const event = {key: KEY.END} as KeyboardEvent;
    foundation.handleKeydown(event);
    expect(mockAdapter.focusTab).toHaveBeenCalledWith(2);
  });

  describe('#handleKeydown(ArrowLeft)', () => {
    // Use the same key for all tests
    const key = KEY.ARROW_LEFT;

    it(`sets focus on previous tab`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getFocusedTabIndex.and.returnValue(1);
      const event = {key} as KeyboardEvent;
      foundation.handleKeydown(event);
      expect(mockAdapter.focusTab).toHaveBeenCalledWith(0);
    });

    it(`sets focus to last tab when focus is on the first tab`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getFocusedTabIndex.and.returnValue(0);
      const event = {key} as KeyboardEvent;
      foundation.handleKeydown(event);
      expect(mockAdapter.focusTab).toHaveBeenCalledWith(2);
    });

    it(`sets focus on next tab in RTL`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getFocusedTabIndex.and.returnValue(1);
      mockAdapter.isRTL.and.returnValue(true);
      const event = {key} as KeyboardEvent;
      foundation.handleKeydown(event);
      expect(mockAdapter.focusTab).toHaveBeenCalledWith(2);
    });
  });

  describe('#handleKeydown(ArrowRight)', () => {
    // Use the same key for all tests
    const key = KEY.ARROW_RIGHT;

    it(`sets focus on next tab`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getFocusedTabIndex.and.returnValue(1);
      const event = {key} as KeyboardEvent;
      foundation.handleKeydown(event);
      expect(mockAdapter.focusTab).toHaveBeenCalledWith(2);
    });

    it(`sets focus to first tab when focus is on the last tab`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getFocusedTabIndex.and.returnValue(2);
      const event = {key} as KeyboardEvent;
      foundation.handleKeydown(event);
      expect(mockAdapter.focusTab).toHaveBeenCalledWith(0);
    });

    it(`sets focus on previous tab in RTL`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getFocusedTabIndex.and.returnValue(1);
      mockAdapter.isRTL.and.returnValue(true);
      const event = {key} as KeyboardEvent;
      foundation.handleKeydown(event);
      expect(mockAdapter.focusTab).toHaveBeenCalledWith(0);
    });
  });

  it('#onActiveIndexChange() throws error when value is out of bounds', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    expect(() => {
      mockAdapter.state.activeIndex = -1;
    }).toThrowError();
  });

  it('#onActiveIndexChange() sets tab at activeIndex to active', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    expect(mockAdapter.state.tabs[2].active).toBeFalse();
    mockAdapter.state.activeIndex = 2;
    expect(mockAdapter.state.tabs[2].active).toBeTrue();
  });

  it('#onActiveIndexChange() sets previously active tab to inactive', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    expect(mockAdapter.state.tabs[0].active).toBeTrue();
    mockAdapter.state.activeIndex = 1;
    expect(mockAdapter.state.tabs[0].active).toBeFalse();
  });

  it('#onHideInactiveLabelsChange() sets the tabs hideInactiveLabel state',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       mockAdapter.state.hideInactiveLabels = true;
       expect(mockAdapter.state.tabs[0].hideInactiveLabel).toBeTrue();
       expect(mockAdapter.state.tabs[1].hideInactiveLabel).toBeTrue();
       expect(mockAdapter.state.tabs[2].hideInactiveLabel).toBeTrue();
       mockAdapter.state.hideInactiveLabels = false;
       expect(mockAdapter.state.tabs[0].hideInactiveLabel).toBeFalse();
       expect(mockAdapter.state.tabs[1].hideInactiveLabel).toBeFalse();
       expect(mockAdapter.state.tabs[2].hideInactiveLabel).toBeFalse();
     });

  it('#onTabsChange() updates activeIndex to the first active tab', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    expect(mockAdapter.state.activeIndex).toBe(0);
    mockAdapter.state.tabs = [
      {active: false, hideInactiveLabel: false},
      {active: true, hideInactiveLabel: false},
      {active: true, hideInactiveLabel: false},
      {active: false, hideInactiveLabel: false},
    ];
    expect(mockAdapter.state.activeIndex).toBe(1);
  });

  it('#onTabsChange() when no active tab, syncs tabs\' active state with the' +
         ' navigation bar\'s activeIndex state',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       expect(mockAdapter.state.activeIndex).toBe(0);
       mockAdapter.state.tabs = [
         {active: false, hideInactiveLabel: false},
         {active: false, hideInactiveLabel: false},
         {active: false, hideInactiveLabel: false},
         {active: false, hideInactiveLabel: false},
       ];
       expect(mockAdapter.state.tabs[0].active).toBeTrue();
       expect(mockAdapter.state.tabs[1].active).toBeFalse();
       expect(mockAdapter.state.tabs[2].active).toBeFalse();
       expect(mockAdapter.state.tabs[3].active).toBeFalse();
     });

  it('#onTabsChange() syncs tabs\' hideInactiveLabel state with the' +
         'navigation bar\'s hideInactiveLabels state',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       expect(mockAdapter.state.hideInactiveLabels).toBeFalse();
       mockAdapter.state.tabs = [
         {active: true, hideInactiveLabel: false},
         {active: false, hideInactiveLabel: true},
         {active: false, hideInactiveLabel: true},
         {active: false, hideInactiveLabel: false},
       ];
       for (const tab of mockAdapter.state.tabs) {
         expect(tab.hideInactiveLabel).toBeFalse();
       }
     });
});
