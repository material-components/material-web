/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore

import {MDCLineRippleAdapter} from '@material/line-ripple/adapter';
import {MDCLineRippleFoundation} from '@material/line-ripple/foundation';
import {AttributePart, directive, Directive, DirectiveParameters, PartInfo, PartType} from 'lit-html/directive.js';

export interface LineRipple extends HTMLElement {
  lineRippleFoundation: MDCLineRippleFoundation;
}

const createAdapter = (lineElement: HTMLElement): MDCLineRippleAdapter => {
  return {
    addClass: (className) => lineElement.classList.add(className),
    removeClass: (className) => lineElement.classList.remove(className),
    hasClass: (className) => lineElement.classList.contains(className),
    setStyle: (propertyName, value) =>
        lineElement.style.setProperty(propertyName, value),
    registerEventHandler: (evtType, handler) => {
      lineElement.addEventListener(evtType, handler);
    },
    deregisterEventHandler: (evtType, handler) => {
      lineElement.removeEventListener(evtType, handler);
    },
  };
};

export class LineRippleDirective extends Directive {
  private previousPart: AttributePart|null = null;
  protected foundation: MDCLineRippleFoundation|null = null;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    switch (partInfo.type) {
      case PartType.ATTRIBUTE:
      case PartType.PROPERTY:
        return;
      default:
        throw new Error(
            'LineRipple only support attribute and property parts.');
    }
  }

  /**
   * There is no PropertyPart in Lit 2 so far. For more info see:
   * https://github.com/lit/lit/issues/1863
   */
  override update(part: AttributePart, _params: DirectiveParameters<this>) {
    if (this.previousPart !== part) {
      if (this.foundation) {
        this.foundation.destroy();
      }
      this.previousPart = part;
      const lineElement = part.element as LineRipple;
      lineElement.classList.add('mdc-line-ripple');
      const adapter = createAdapter(lineElement);
      this.foundation = new MDCLineRippleFoundation(adapter);
      this.foundation.init();
    }
    return this.render();
  }

  render(): MDCLineRippleFoundation|null {
    return this.foundation;
  }
}

export const lineRipple = directive(LineRippleDirective);
