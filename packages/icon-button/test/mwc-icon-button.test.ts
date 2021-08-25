/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import {IconButton} from '@material/mwc-icon-button';
import {html, render} from 'lit-html';

const ICON_SELECTOR = 'i.material-icons';


describe('mwc-icon-button', () => {
  /** @type {HTMLElement} */
  let element: IconButton;

  beforeEach(() => {
    element = document.createElement('mwc-icon-button');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('initializes as an mwc-icon-button', () => {
    expect(element).toBeInstanceOf(IconButton);
  });

  it('setting `icon` updates the textContent inside <i class="mdc-icon-button__icon mdc-icon-button__icon--on">',
     async () => {
       element.icon = 'check';
       await element.updateComplete;
       const icon = element.shadowRoot!.querySelector(ICON_SELECTOR)!;
       expect(icon).toBeInstanceOf(HTMLElement);
       expect(icon.textContent!.trim()).toEqual('check');
       element.icon = 'menu';
       await element.updateComplete;
       expect(icon.textContent!.trim()).toEqual('menu');
     });

  it('setting `ariaLabel` updates the aria-label attribute on the native button element',
     async () => {
       const ariaLabel = 'hello';
       element.ariaLabel = ariaLabel;
       await element.updateComplete;
       const button = element.shadowRoot!.querySelector('button')!;
       expect(button.getAttribute('aria-label')).toEqual(ariaLabel);
     });

  it('setting `disabled` updates the disabled attribute on the native button element',
     async () => {
       element.disabled = true;
       await element.updateComplete;
       const button = element.shadowRoot!.querySelector('button')!;
       expect(button.hasAttribute('disabled')).toEqual(true);

       element.disabled = false;
       await element.updateComplete;
       expect(button.hasAttribute('disabled')).toEqual(false);
     });

  const svgTemplate = document.createElement('template');
  render(
      html`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>`,
      svgTemplate.content);

  it('default node will serve as the on icon', async () => {
    const iconQuery = svgTemplate.content.querySelector('svg')!;
    expect(iconQuery).toBeInstanceOf(SVGElement);

    const icon = iconQuery.cloneNode(true);
    element.appendChild(icon);
    await element.updateComplete;
    const root = element.shadowRoot!;
    const iconSlot = root.querySelector('slot') as HTMLSlotElement;
    expect(iconSlot.assignedNodes()).toContain(icon);
  });
});
