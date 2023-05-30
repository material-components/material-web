/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {css} from 'lit';

interface WithAdopted {
  adoptedStyleSheets?: StyleSheetOrElement[];
}

/**
 * An array of tuples from css property to it's corresponding value
 */
export type CssPropArray = Array<[string, string]>;

interface WithCssProps {
  // tslint:disable-next-line
  __cssProps?: CssPropArray;
}

type ElementWithMetadata = HTMLElement&WithCssProps;

type StyleHost = (ShadowRoot|Document)&WithAdopted;

/**
 * A CSS StyleSheet or Element that can have styles applied to it via
 * constructable stylesheets or inline styles.
 */
export type StyleSheetOrElement = CSSStyleSheet|ElementWithMetadata;

/**
 * Creates a constructable stylesheet and applies it to the given StyleHost. If
 * Constructable Stylesheets are not available, return the element hosting the
 * shadow root or the document.body if at root.
 *
 * @param renderRoot
 *     The host of styles to apply the given styles to. e.g. a Document or a
 *     Shadow Root
 * @return The adopted stylesheet or the element to apply inline styles.
 */
export function initSheetOrElement(renderRoot: StyleHost): StyleSheetOrElement {
  const constructableStylesheet = css``.styleSheet;

  // Use adopted stylesheets
  if (constructableStylesheet) {
    renderRoot.adoptedStyleSheets.push(constructableStylesheet);

    return constructableStylesheet;

    // Use inline styles on the stylehost's host element when adopted
    // stylesheets are not supported by returning an HTMLElement
  } else {
    const styleRoot: ElementWithMetadata = renderRoot === document ?
        document.body :
        (renderRoot as ShadowRoot).host as HTMLElement;

    return styleRoot;
  }
}

function isStylableElement(sheetOrElement: StyleSheetOrElement):
    sheetOrElement is ElementWithMetadata {
  return (sheetOrElement as HTMLElement)?.nodeType === Node.ELEMENT_NODE;
}

/**
 * Replaces the styles in a constructable stylesheet or applies inline styles
 * to the given element.
 *
 * @param sheetOrElement
 *    The HTML element or constructable stylesheet to be updated.
 * @param cssProps The css props to apply to the element or stylesheet
 */
export function replaceStyles(
    sheetOrElement: StyleSheetOrElement, cssProps: CssPropArray) {
  // no constructable stylesheets
  if (isStylableElement(sheetOrElement)) {
    removeCssPropsFromEl(sheetOrElement);
    applyCssPropsToEl(sheetOrElement, cssProps);
  } else {
    // turn css props into valid CSS rules and replace stylesheet
    sheetOrElement.replaceSync(cssPropArrayToCSSText(cssProps));
  }
}

/**
 * Removes previously-applied css props from an element. Only invoked when
 * constructable stylesheets are not available.
 *
 * @param el Element from which to remove previously applied css props.
 */
function removeCssPropsFromEl(el: ElementWithMetadata) {
  const previousProps = el.__cssProps ?? [];
  for (const [property] of previousProps) {
    el.style.removeProperty(property);
  }

  el.__cssProps = [];
}

/**
 * Applies a css props array to an element as inline styles. Only invoked when
 * constructable stylesheets are not available.
 *
 * @param el The element to have styles applied to.
 * @param cssProps The css props to apply to an element.
 */
function applyCssPropsToEl(el: ElementWithMetadata, cssProps: CssPropArray) {
  for (const [property, value] of cssProps) {
    el.style.setProperty(property, value);
  }

  el.__cssProps = cssProps;
}

/**
 * Converts css props into proper CSS text by wrapping the props in a CSS rule.
 *
 * @param cssProps The css prop array to convert to css text.
 * @return CSS text with the inlined prop array.
 */
function cssPropArrayToCSSText(cssProps: CssPropArray) {
  let out = '';
  for (const [prop, value] of cssProps) {
    out += `${prop}:${value};`;
  }

  return `:host, :root {${out}}`;
}

/**
 * Removes the given styles from the style host.
 *
 * @param renderRoot The host of styles to remove the given styles from.
 * @param sheetsOrElements The stylesheet or style element to remove from the
 *     renderRoot.
 */
export function removeStyles(
    renderRoot: StyleHost, sheetsOrElements: StyleSheetOrElement[]) {
  sheetsOrElements.forEach(sheetOrElement => {
    if (isStylableElement(sheetOrElement)) {
      removeCssPropsFromEl(sheetOrElement);
    } else {
      const i = renderRoot.adoptedStyleSheets?.indexOf(sheetOrElement) ?? -1;
      if (i >= 0) {
        renderRoot.adoptedStyleSheets.splice(i, 1);
      }
    }
  });
}
