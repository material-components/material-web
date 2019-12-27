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
import {html, LitElement, property} from 'lit-element';
import {LayoutGridCellBase} from './mwc-layout-grid-cell.js';

export class LayoutGridBase extends LitElement {
  @property({type: Boolean, reflect: true}) inner = false;

  @property({type: Boolean, reflect: true}) fixedColumnWidth = false;

  @property({type: String}) position;

  constructor() {
    super();

    // Handle addition of cells
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes &&
            mutation.addedNodes.length > 0) {
          // At least one cell was added - re-render grid to make sure all
          // children elements are in right order and have own slots
          this.requestUpdate();
        }
      }
    });
    // Start observing the root node for configured mutations
    observer.observe(this, {childList: true});
  }

  protected removeCell(e) {
    const slotElement = e.target! as HTMLSlotElement;
    const nodes = slotElement.assignedElements();

    if (nodes.length == 0) {
      // Slot is empty - remove cell
      (slotElement.parentNode! as HTMLElement).remove();
    }
  }

  protected generateCellClasses(child: Element) {
    const classes = ['mdc-layout-grid__cell'];

    if (child instanceof LayoutGridCellBase) {
      // Child is also a LayoutGridBase - get its attributes and set them to
      // cell element
      if (child.span) {
        const childSpan = child.span;
        if (childSpan !== null && typeof childSpan === 'object') {
          // For each property in span add class to cell div
          Object.entries(childSpan).forEach((entry) => {
            classes.push(
                ' mdc-layout-grid__cell--span-' + entry[1] + '-' + entry[0]);
          });
        } else {
          classes.push(' mdc-layout-grid__cell--span-' + childSpan);
        }
      }
      if (child.order) {
        classes.push(' mdc-layout-grid__cell--order-' + child.order);
      }
      if (child.align) {
        classes.push(' mdc-layout-grid__cell--align-' + child.align);
      }
    }

    return classes.join(' ');
  }

  render() {
    if (this.inner) {
      return html`
        <div class="mdc-layout-grid__inner ${
          this.fixedColumnWidth ? 'mdc-layout-grid--fixed-column-width' : ''} ${
          this.position ? 'mdc-layout-grid--align-' + this.position : ''}">
            ${Array.from(this.children).map((element, i) => {
        element.setAttribute('slot', 'slot' + i);
        return html`<div class="${
            this.generateCellClasses(element)}" ><slot name="slot${
            i}" @slotchange=${(e) => this.removeCell(e)}></slot></div>`;
      })}
        </div>`;
    } else {
      return html`
        <div class="mdc-layout-grid ${
          this.fixedColumnWidth ? 'mdc-layout-grid--fixed-column-width' : ''} ${
          this.position ? 'mdc-layout-grid--align-' + this.position : ''}">
          <div class="mdc-layout-grid__inner">
            ${Array.from(this.children).map((element, i) => {
        element.setAttribute('slot', 'slot' + i);
        return html`<div class="${
            this.generateCellClasses(element)}" ><slot name="slot${
            i}" @slotchange=${(e) => this.removeCell(e)}></slot></div>`;
      })}
          </div>
        </div>`;
    }
  }
}
