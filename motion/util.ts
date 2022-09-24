/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  CssVendorPropertyMap, JsVendorPropertyMap,
  PrefixedCssPropertyName, PrefixedJsEventType,
  StandardCssPropertyName, StandardJsEventType,
} from './types.js';

const cssPropertyNameMap: CssVendorPropertyMap = {
  animation: {
    prefixed: '-webkit-animation',
    standard: 'animation',
  },
  transform: {
    prefixed: '-webkit-transform',
    standard: 'transform',
  },
  transition: {
    prefixed: '-webkit-transition',
    standard: 'transition',
  },
};

const jsEventTypeMap: JsVendorPropertyMap = {
  animationend: {
    cssProperty: 'animation',
    prefixed: 'webkitAnimationEnd',
    standard: 'animationend',
  },
  animationiteration: {
    cssProperty: 'animation',
    prefixed: 'webkitAnimationIteration',
    standard: 'animationiteration',
  },
  animationstart: {
    cssProperty: 'animation',
    prefixed: 'webkitAnimationStart',
    standard: 'animationstart',
  },
  transitionend: {
    cssProperty: 'transition',
    prefixed: 'webkitTransitionEnd',
    standard: 'transitionend',
  },
};

function isWindow(windowObj: Window): boolean {
  return Boolean(windowObj.document) && typeof windowObj.document.createElement === 'function';
}

export function getCorrectPropertyName(windowObj: Window, cssProperty: StandardCssPropertyName):
    StandardCssPropertyName | PrefixedCssPropertyName {
  if (isWindow(windowObj) && cssProperty in cssPropertyNameMap) {
    const el = windowObj.document.createElement('div');
    const {standard, prefixed} = cssPropertyNameMap[cssProperty];
    const isStandard = standard in el.style;
    return isStandard ? standard : prefixed;
  }
  return cssProperty;
}

export function getCorrectEventName(windowObj: Window, eventType: StandardJsEventType):
    StandardJsEventType | PrefixedJsEventType {
  if (isWindow(windowObj) && eventType in jsEventTypeMap) {
    const el = windowObj.document.createElement('div');
    const {standard, prefixed, cssProperty} = jsEventTypeMap[eventType];
    const isStandard = cssProperty in el.style;
    return isStandard ? standard : prefixed;
  }
  return eventType;
}
