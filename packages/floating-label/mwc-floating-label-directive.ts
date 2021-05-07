/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import {MDCFloatingLabelAdapter} from '@material/floating-label/adapter';
import {MDCFloatingLabelFoundation} from '@material/floating-label/foundation';
import {AttributePart, directive, Directive, DirectiveParameters, PartInfo, PartType} from 'lit-html/directive';

export interface FloatingLabel extends HTMLLabelElement {
  floatingLabelFoundation: MDCFloatingLabelFoundation;
}

const createAdapter = (labelElement: HTMLElement): MDCFloatingLabelAdapter => {
  return {
    addClass: (className) => labelElement.classList.add(className),
    removeClass: (className) => labelElement.classList.remove(className),
    getWidth: () => labelElement.scrollWidth,
    registerInteractionHandler: (evtType, handler) => {
      labelElement.addEventListener(evtType, handler);
    },
    deregisterInteractionHandler: (evtType, handler) => {
      labelElement.removeEventListener(evtType, handler);
    },
  };
};

class FloatingLabelDirective extends Directive {
  private foundation: MDCFloatingLabelFoundation|null = null;
  private previousPart: AttributePart|null = null;

  constructor(partInfo: PartInfo) {
    super(partInfo);

    switch (partInfo.type) {
      // Only allow Attribute and Part bindings
      case PartType.ATTRIBUTE:
      case PartType.PROPERTY:
        break;
      default:
        throw new Error(
            'FloatingLabel directive only support attribute and property parts');
    }
  }

  /**
   * There is no PropertyPart in Lit 2 so far. For more info see:
   * https://github.com/lit/lit/issues/1863
   */
  update(part: AttributePart, [label]: DirectiveParameters<this>) {
    if (part !== this.previousPart) {
      if (this.foundation) {
        this.foundation.destroy();
      }
      this.previousPart = part;
      const labelElement = part.element as FloatingLabel;
      labelElement.classList.add('mdc-floating-label');
      const adapter = createAdapter(labelElement);
      this.foundation = new MDCFloatingLabelFoundation(adapter);
      this.foundation.init();
    }
    return this.render(label);
  }
  render(_label: string): MDCFloatingLabelFoundation|null {
    return this.foundation;
  }
}

export const floatingLabel = directive(FloatingLabelDirective);
