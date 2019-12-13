/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

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
import {directive, PropertyPart} from 'lit-html';
import {AnchorableElement} from './mwc-menu-ponyfill';

export interface MenuAnchor extends HTMLElement {
  anchoring: Element|null;
}

const partToTarget = new WeakMap<PropertyPart, AnchorableElement|null>();

export const menuAnchor =
    directive((forSelector: string) => (part: PropertyPart) => {
      const lastTarget = partToTarget.get(part);
      const anchorElement = part.committer.element;
      const root = anchorElement.getRootNode() as Document | ShadowRoot;
      const target =
          root.querySelector(forSelector) as AnchorableElement | null;

      if (target !== lastTarget) {
        anchorElement.classList.add('mdc-menu-anchor');

        if (target) {
          target.anchorElement = anchorElement;
          partToTarget.set(part, target);
        }

        partToTarget.set(part, target);
        part.setValue(target);
      }
    });
