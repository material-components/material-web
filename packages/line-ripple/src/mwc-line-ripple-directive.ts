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
import {MDCLineRippleAdapter} from '@material/line-ripple/adapter.js';
import {MDCLineRippleFoundation} from '@material/line-ripple/foundation.js';
import {directive, PropertyPart} from 'lit-html';

export interface LineRipple extends HTMLElement {
  foundation: MDCLineRippleFoundation;
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

const partToFoundationMap =
    new WeakMap<PropertyPart, MDCLineRippleFoundation>();

export const lineRipple = directive(() => (part: PropertyPart) => {
  const lastFoundation = partToFoundationMap.get(part);
  if (!lastFoundation) {
    const lineElement = part.committer.element as LineRipple;
    lineElement.classList.add('mdc-line-ripple');
    const adapter = createAdapter(lineElement);
    const foundation = new MDCLineRippleFoundation(adapter);
    part.setValue(foundation);
    partToFoundationMap.set(part, foundation);
  }
});
