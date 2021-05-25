/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {IconButtonToggle} from '@material/mwc-icon-button-toggle';

const ICON_BUTTON_ON_SELECTOR = '.mdc-icon-button.mdc-icon-button--on';
const ICON_SELECTOR =
    '.mdc-icon-button__icon.mdc-icon-button__icon--on i.material-icons';
const OFF_ICON_SELECTOR =
    '.mdc-icon-button__icon:not(.mdc-icon-button__icon--on) i.material-icons';

interface IconButtonToggleInternals {
  mdcRoot: HTMLElement;
}

describe('mwc-icon-button-toggle', () => {
  let element: IconButtonToggle;
  let internals: IconButtonToggleInternals;

  beforeEach(() => {
    element = document.createElement('mwc-icon-button-toggle');
    internals = element as unknown as IconButtonToggleInternals;
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  it('initializes as an mwc-icon-button', () => {
    expect(element).toBeInstanceOf(IconButtonToggle);
  });

  it('setting `icon` updates the textContent inside <i class="mdc-icon-button__icon mdc-icon-button__icon--on">',
     async () => {
       let icon = 'check';
       element.onIcon = icon;
       await element.updateComplete;
       const i = element.shadowRoot!.querySelector(ICON_SELECTOR)!;
       let content = i.textContent as string;
       expect(content).toMatch(new RegExp(`^\\s*${icon}\\s*$`));

       icon = 'menu';
       element.onIcon = icon;
       await element.updateComplete;
       content = i.textContent as string;
       expect(content).toMatch(new RegExp(`^\\s*${icon}\\s*$`));
     });

  it('setting `offIcon` updates the textContent inside <i class="mdc-icon-button__icon">',
     async () => {
       let icon = 'check';
       element.offIcon = icon;
       await element.updateComplete;
       const i = element.shadowRoot!.querySelector(OFF_ICON_SELECTOR)!;
       let content = i.textContent as string;
       expect(content).toMatch(new RegExp(`^\\s*${icon}\\s*$`));

       icon = 'menu';
       element.offIcon = icon;
       await element.updateComplete;
       content = i.textContent as string;
       expect(content).toMatch(new RegExp(`^\\s*${icon}\\s*$`));
     });

  it('setting `ariaLabel` updates the aria-label attribute on the native button element',
     async () => {
       const ariaLabel = 'hello';
       element.ariaLabel = ariaLabel;
       await element.updateComplete;
       const button = element.shadowRoot!.querySelector('button')!;
       expect(button.getAttribute('aria-label')).toEqual(ariaLabel);
     });

  it('setting `on` updates the aria-pressed attribute on the native button element',
     async () => {
       element.onIcon = 'alarm_on';
       element.offIcon = 'alarm_off';

       element.on = true;
       await element.updateComplete;
       const button = element.shadowRoot!.querySelector('button')!;
       expect(button.getAttribute('aria-pressed')).toEqual('true');

       element.on = false;
       await element.updateComplete;
       expect(button.getAttribute('aria-pressed')).toEqual('false');
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

  it('icon button toggles when clicked with two icons', async () => {
    element.onIcon = 'alarm_on';
    element.offIcon = 'alarm_off';
    await element.updateComplete;
    expect(element.on).toEqual(false);
    internals.mdcRoot.click();
    await element.updateComplete;
    expect(element.on).toEqual(true);
  });

  const svgTemplate = document.createElement('template');
  svgTemplate.innerHTML = `
  <svg slot="onIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
  <svg slot="offIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z"/><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`;

  it('nodes with `slot=onIcon` will serve as the on icon', async () => {
    const iconQuery = svgTemplate.content.querySelector('svg[slot="onIcon"]')!;
    expect(iconQuery).toBeInstanceOf(SVGElement);

    const icon = iconQuery.cloneNode(true);
    element.appendChild(icon);
    await element.updateComplete;
    const iconSlot = element.shadowRoot!.querySelector('slot[name="onIcon"]') as
        HTMLSlotElement;
    expect(iconSlot.assignedNodes()).toContain(icon);
  });

  it('nodes with `slot=offIcon` will serve as the off icon', async () => {
    const iconQuery = svgTemplate.content.querySelector('svg[slot="offIcon"]')!;
    expect(iconQuery).toBeInstanceOf(SVGElement);

    const icon = iconQuery.cloneNode(true);
    element.appendChild(icon);
    await element.updateComplete;
    const root = element.shadowRoot!;
    const iconSlot =
        root.querySelector('slot[name="offIcon"]') as HTMLSlotElement;
    expect(iconSlot.assignedNodes()).toContain(icon);
  });

  it('icon-button toggles with slotted icon and offIcon', async () => {
    const fragment = svgTemplate.content.cloneNode(true);
    element.appendChild(fragment);
    await element.updateComplete;
    expect(element.on).toEqual(false);
    expect(element.shadowRoot!.querySelector(ICON_BUTTON_ON_SELECTOR))
        .toBeNull();
    internals.mdcRoot.click();
    await element.updateComplete;
    expect(element.on).toEqual(true);
    expect(element.shadowRoot!.querySelector(ICON_BUTTON_ON_SELECTOR))
        .not.toBeNull();
  });

  it('button with toggled aria label toggles aria label', async () => {
    element.ariaLabelOn = 'aria label on';
    element.ariaLabelOff = 'aria label off';
    await element.updateComplete;

    const button = internals.mdcRoot;
    expect(element.on).toBeFalse();
    expect(button.getAttribute('aria-label')).toEqual('aria label off');
    expect(button.getAttribute('aria-pressed')).toBeNull();

    // Toggle
    button.click();
    await element.updateComplete;
    expect(element.on).toBeTrue();
    expect(button.getAttribute('aria-label')).toEqual('aria label on');
    expect(button.getAttribute('aria-pressed')).toBeNull();
  });
});
