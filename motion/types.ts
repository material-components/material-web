/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

export type StandardCssPropertyName = 'animation'|'transform'|'transition';

export type PrefixedCssPropertyName =
    '-webkit-animation'|'-webkit-transform'|'-webkit-transition';

export type StandardJsEventType =
    'animationend'|'animationiteration'|'animationstart'|'transitionend';

export type PrefixedJsEventType = 'webkitAnimationEnd'|
    'webkitAnimationIteration'|'webkitAnimationStart'|'webkitTransitionEnd';

export interface CssVendorProperty {
  prefixed: PrefixedCssPropertyName;
  standard: StandardCssPropertyName;
}

export interface JsVendorProperty {
  cssProperty: StandardCssPropertyName;
  prefixed: PrefixedJsEventType;
  standard: StandardJsEventType;
}

export type CssVendorPropertyMap = {
  [K in StandardCssPropertyName]: CssVendorProperty
};
export type JsVendorPropertyMap = {
  [K in StandardJsEventType]: JsVendorProperty
};