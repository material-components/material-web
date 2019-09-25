/**
 * @license
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {IconButtonToggle} from '@material/mwc-icon-button-toggle';

const ICON_SELECTOR =
    '.mdc-icon-button__icon.mdc-icon-button__icon--on i.material-icons';
const OFF_ICON_SELECTOR =
    '.mdc-icon-button__icon:not(.mdc-icon-button__icon--on) i.material-icons';

interface IconButtonToggleInternals {
  mdcRoot: HTMLElement;
}

suite('mwc-icon-button-toggle', () => {
  let element: IconButtonToggle;
  let internals: IconButtonToggleInternals;

  setup(() => {
    element = document.createElement('mwc-icon-button-toggle');
    internals = element as unknown as IconButtonToggleInternals;
    document.body.appendChild(element);
  });

  teardown(() => {
    document.body.removeChild(element);
  });

  test('initializes as an mwc-icon-button', () => {
    assert.instanceOf(element, IconButtonToggle);
  });

  test(
      'setting `icon` updates the textContent inside <i class="mdc-icon-button__icon mdc-icon-button__icon--on">',
      async () => {
        let icon = 'check';
        element.onIcon = icon;
        await element.updateComplete;
        const i = element.shadowRoot!.querySelector(ICON_SELECTOR)!;
        let content = i.textContent as string;
        assert.match(content, new RegExp(`^\\s*${icon}\\s*$`));

        icon = 'menu';
        element.onIcon = icon;
        await element.updateComplete;
        content = i.textContent as string;
        assert.match(content, new RegExp(`^\\s*${icon}\\s*$`));
      });

  test(
      'setting `offIcon` updates the textContent inside <i class="mdc-icon-button__icon">',
      async () => {
        let icon = 'check';
        element.offIcon = icon;
        await element.updateComplete;
        const i = element.shadowRoot!.querySelector(OFF_ICON_SELECTOR)!;
        let content = i.textContent as string;
        assert.match(content, new RegExp(`^\\s*${icon}\\s*$`));

        icon = 'menu';
        element.offIcon = icon;
        await element.updateComplete;
        content = i.textContent as string;
        assert.match(content, new RegExp(`^\\s*${icon}\\s*$`));
      });

  test(
      'setting `label` updates the aria-label attribute on the native button element',
      async () => {
        const label = 'hello';
        element.label = label;
        await element.updateComplete;
        const button = element.shadowRoot!.querySelector('button')!;
        assert.equal(button.getAttribute('aria-label'), label);
      });

  test(
      'setting `on` updates the aria-pressed attribute on the native button element',
      async () => {
        element.onIcon = 'alarm_on';
        element.offIcon = 'alarm_off';

        element.on = true;
        await element.updateComplete;
        const button = element.shadowRoot!.querySelector('button')!;
        assert.equal(button.getAttribute('aria-pressed'), 'true');

        element.on = false;
        await element.updateComplete;
        assert.equal(button.getAttribute('aria-pressed'), 'false');
      });

  test(
      'setting `disabled` updates the disabled attribute on the native button element',
      async () => {
        element.disabled = true;
        await element.updateComplete;
        const button = element.shadowRoot!.querySelector('button')!;
        assert.equal(button.hasAttribute('disabled'), true);

        element.disabled = false;
        await element.updateComplete;
        assert.equal(button.hasAttribute('disabled'), false);
      });

  test('icon button toggles when clicked with two icons', async () => {
    element.onIcon = 'alarm_on';
    element.offIcon = 'alarm_off';
    await element.updateComplete;
    assert.equal(element.on, false);
    internals.mdcRoot.click();
    await element.updateComplete;
    assert.equal(element.on, true);
  });

  const svgTemplate = document.createElement('template');
  svgTemplate.innerHTML = `
  <svg slot="onIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
  <svg slot="offIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" d="M0 0h24v24H0V0zm0 0h24v24H0V0z"/><path d="M16.59 7.58L10 14.17l-3.59-3.58L5 12l5 5 8-8zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/></svg>`;

  test('nodes with `slot=onIcon` will serve as the on icon', async () => {
    const iconQuery = svgTemplate.content.querySelector('svg[slot="onIcon"]')!;
    assert.instanceOf(iconQuery, SVGElement);

    const icon = iconQuery.cloneNode(true);
    element.appendChild(icon);
    await element.updateComplete;
    const iconSlot = element.shadowRoot!.querySelector('slot[name="onIcon"]') as
        HTMLSlotElement;
    assert.include(iconSlot.assignedNodes(), icon);
  });

  test('nodes with `slot=offIcon` will serve as the off icon', async () => {
    const iconQuery = svgTemplate.content.querySelector('svg[slot="offIcon"]')!;
    assert.instanceOf(iconQuery, SVGElement);

    const icon = iconQuery.cloneNode(true);
    element.appendChild(icon);
    await element.updateComplete;
    const root = element.shadowRoot!;
    const iconSlot =
        root.querySelector('slot[name="offIcon"]') as HTMLSlotElement;
    assert.include(iconSlot.assignedNodes(), icon);
  });

  test('icon-button toggles with slotted icon and offIcon', async () => {
    const fragment = svgTemplate.content.cloneNode(true);
    element.appendChild(fragment);
    await element.updateComplete;
    assert.equal(element.on, false);
    internals.mdcRoot.click();
    await element.updateComplete;
    assert.equal(element.on, true);
  });
});
