import { MDCTextFieldCharacterCounterAdapter } from '@material/textfield/character-counter/adapter.js';
import { MDCTextFieldCharacterCounterFoundation } from '@material/textfield/character-counter/foundation.js';
import { directive, PropertyPart } from 'lit-html';

export interface CharacterCounter extends HTMLElement {
  foundation: MDCTextFieldCharacterCounterFoundation;
}

const createAdapter = (hostElement: HTMLElement): MDCTextFieldCharacterCounterAdapter => {
  return {
    setContent: content => hostElement.textContent = content
  }
}

const partToFoundationMap = new WeakMap<PropertyPart, MDCTextFieldCharacterCounterFoundation>();

export const characterCounter = directive(() => (part: PropertyPart) => {
  const lastFoundation = partToFoundationMap.get(part);
  if (!lastFoundation) {
    const hostElement = part.committer.element as CharacterCounter;
    hostElement.classList.add('mdc-text-field-character-counter');
    const adapter = createAdapter(hostElement);
    const foundation = new MDCTextFieldCharacterCounterFoundation(adapter);
    part.setValue(foundation);
    partToFoundationMap.set(part, foundation);
  }
});