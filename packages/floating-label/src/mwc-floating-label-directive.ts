import { MDCFloatingLabelAdapter } from '@material/floating-label/adapter.js';
import { MDCFloatingLabelFoundation } from '@material/floating-label/foundation.js';
import { directive, PropertyPart } from 'lit-html';

export interface FloatingLabel extends HTMLLabelElement {
  foundation: MDCFloatingLabelFoundation;
}

const createAdapter = (labelElement: HTMLElement): MDCFloatingLabelAdapter => {
  return {
    addClass: className => labelElement.classList.add(className),
    removeClass: className => labelElement.classList.remove(className),
    getWidth: () => labelElement.scrollWidth,
    registerInteractionHandler: (evtType, handler) => {labelElement.addEventListener(evtType, handler)},
    deregisterInteractionHandler: (evtType, handler) => {labelElement.removeEventListener(evtType, handler)},
  }
}

const partToFoundationMap = new WeakMap<PropertyPart, MDCFloatingLabelFoundation>();

export const floatingLabel = directive(() => (part: PropertyPart) => {
  const lastFoundation = partToFoundationMap.get(part);
  if (!lastFoundation) {
    const labelElement = part.committer.element as FloatingLabel;
    labelElement.classList.add('mdc-floating-label');
    const adapter = createAdapter(labelElement);
    const foundation = new MDCFloatingLabelFoundation(adapter);
    part.setValue(foundation);
    partToFoundationMap.set(part, foundation);
  }
});