/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {CSSResult} from 'lit';

/**
 * Create tests for `MdComponent.styles` that checks for undefined or unused
 * tokens.
 *
 * @param styles An array of `CSSResult`s to run tests on.
 */
export function createTokenTests(styles: CSSResult[]) {
  it('should not have any undefined tokens', () => {
    const undefinedTokens = getUndefinedTokens(styles);
    expect(undefinedTokens).withContext('undefined tokens').toHaveSize(0);
  });

  it('should not have any unused tokens', () => {
    const unusedTokens = getUnusedTokens(styles);
    expect(unusedTokens).withContext('unused tokens').toHaveSize(0);
  });
}

/**
 * Retrieves all undefined tokens. This method checks for any
 * `--_local-custom-property` that is used, but does not have a CSS style
 * declaration giving it a value.
 *
 * @example
 * :host {
 *   --_defined-token: 8px;
 *   border-radius: var(--_undefined-token);
 * }
 *
 * // returns ['--_undefined-token']
 *
 * @param styles An array of `CSSResult`s to get undefined tokens for.
 * @return An array of all token names that are undefined.
 */
export function getUndefinedTokens(styles: CSSResult[]) {
  let defined = new Set<string>();
  let used = new Set<string>();
  for (const {styleSheet} of styles) {
    if (!styleSheet) {
      throw new Error('CSSResult.styleSheet is not supported.');
    }

    defined = new Set([...defined, ...getDefinedTokensFromRule(styleSheet)]);
    used = new Set([...used, ...getUsedTokensFromRule(styleSheet)]);
  }

  const undefinedTokens: string[] = [];
  for (const usedToken of used) {
    if (!defined.has(usedToken)) {
      undefinedTokens.push(usedToken);
    }
  }

  return undefinedTokens;
}

/**
 * Retrieves all unused tokens. This method checks for any
 * `--_local-custom-property` that has a CSS declaration value, but it otherwise
 * unused.
 *
 * @example
 * :host {
 *   --_used-token: 8px;
 *   --_unused-token: 8px;
 *   border-radius: var(--_used-token);
 * }
 *
 * // returns ['--_unused-token']
 *
 * @param styles An array of `CSSResult`s to get unused tokens for.
 * @return An array of all token names that are unused.
 */
export function getUnusedTokens(styles: CSSResult[]) {
  let defined = new Set<string>();
  let used = new Set<string>();
  for (const {styleSheet} of styles) {
    if (!styleSheet) {
      throw new Error('CSSResult.styleSheet is not supported.');
    }

    defined = new Set([...defined, ...getDefinedTokensFromRule(styleSheet)]);
    used = new Set([...used, ...getUsedTokensFromRule(styleSheet)]);
  }

  const unusedTokens: string[] = [];
  for (const definedToken of defined) {
    if (!used.has(definedToken)) {
      unusedTokens.push(definedToken);
    }
  }

  return unusedTokens;
}

function getDefinedTokensFromRule(rule: CSSRule|CSSStyleSheet|
                                  CSSStyleRule): Set<string> {
  let defined = new Set<string>();
  if ('cssRules' in rule) {
    // Rule is either a CSSStyleSheet, CSSKeyframesRule, or one of the
    // CSSGroupingRules.
    for (const childRule of rule.cssRules) {
      defined = new Set([...defined, ...getDefinedTokensFromRule(childRule)]);
    }
  }

  if ('style' in rule) {
    for (const property of rule.style) {
      if (property.match(/--_(?!_)[\w-]+/)) {
        defined.add(property);
      }
    }
  }

  return defined;
}

function getUsedTokensFromRule(rule: CSSRule|CSSStyleSheet|
                               CSSStyleRule): Set<string> {
  let used = new Set<string>();
  if ('cssRules' in rule) {
    // Rule is either a CSSStyleSheet, CSSKeyframesRule, or one of the
    // CSSGroupingRules.
    for (const childRule of rule.cssRules) {
      used = new Set([...used, ...getUsedTokensFromRule(childRule)]);
    }
  }

  if ('style' in rule) {
    // Shorthand properties are not included in CSSStyleDeclaration's iterator.
    // Check them explicitly as well for properties like border-radius.
    for (const property of [...rule.style, ...CSS_SHORTHAND_PROPERTIES]) {
      const value = rule.style.getPropertyValue(property);
      for (const match of value.matchAll(/--_(?!_)[\w-]+/g)) {
        used.add(match[0]);
      }
    }
  }

  return used;
}

// https://developer.mozilla.org/en-US/docs/Web/CSS/Shorthand_properties#see_also
const CSS_SHORTHAND_PROPERTIES = [
  'all',
  'animation',
  'background',
  'border',
  'border-block-end',
  'border-block-start',
  'border-bottom',
  'border-color',
  'border-image',
  'border-inline-end',
  'border-inline-start',
  'border-left',
  'border-radius',
  'border-right',
  'border-style',
  'border-top',
  'border-width',
  'column-rule',
  'columns',
  'contain-intrinsic-size',
  'flex',
  'flex-flow',
  'font',
  'gap',
  'grid',
  'grid-area',
  'grid-column',
  'grid-row',
  'grid-template',
  'list-style',
  'margin',
  'mask',
  'offset',
  'outline',
  'overflow',
  'padding',
  'place-content',
  'place-items',
  'place-self',
  'scroll-margin',
  'scroll-padding',
  'scroll-timeline',
  'text-decoration',
  'text-emphasis',
  'transition',
];
