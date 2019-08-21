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
import {MDCTextFieldCharacterCounterAdapter} from '@material/textfield/character-counter/adapter.js';
import {MDCTextFieldCharacterCounterFoundation} from '@material/textfield/character-counter/foundation.js';
import {directive, PropertyPart} from 'lit-html';

export interface CharacterCounter extends HTMLElement {
  foundation: MDCTextFieldCharacterCounterFoundation;
}

const createAdapter =
    (hostElement: HTMLElement): MDCTextFieldCharacterCounterAdapter => {
      return {setContent: (content) => hostElement.textContent = content};
    };

const partToFoundationMap =
    new WeakMap<PropertyPart, MDCTextFieldCharacterCounterFoundation>();

export const characterCounter = directive(() => (part: PropertyPart) => {
  const lastFoundation = partToFoundationMap.get(part);
  if (!lastFoundation) {
    const hostElement = part.committer.element as CharacterCounter;
    hostElement.classList.add('mdc-text-field-character-counter');
    const adapter = createAdapter(hostElement);
    const foundation = new MDCTextFieldCharacterCounterFoundation(adapter);
    foundation.init();
    part.setValue(foundation);
    partToFoundationMap.set(part, foundation);
  }
});
