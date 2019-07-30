import { MDCLineRippleAdapter } from '@material/line-ripple/adapter.js';
import { MDCLineRippleFoundation } from '@material/line-ripple/foundation.js';
import { directive, PropertyPart } from 'lit-html';

export interface LineRipple extends HTMLElement {
  foundation: MDCLineRippleFoundation;
}

const createAdapter = (lineElement: HTMLElement): MDCLineRippleAdapter => {
  return {
    addClass: className => lineElement.classList.add(className),
    removeClass: className => lineElement.classList.remove(className),
    hasClass: className => lineElement.classList.contains(className),
    setStyle: (propertyName, value) => lineElement.style.setProperty(propertyName, value),
    registerEventHandler: (evtType, handler) => {lineElement.addEventListener(evtType, handler)},
    deregisterEventHandler: (evtType, handler) => {lineElement.removeEventListener(evtType, handler)},
  }
}

const partToFoundationMap = new WeakMap<PropertyPart, MDCLineRippleFoundation>();

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