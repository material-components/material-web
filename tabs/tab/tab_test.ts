/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import './secondary-tab';
import './primary-tab';
import 'jasmine';

import {MdIcon} from '@material/web/icon/icon';
import {Environment} from '@material/web/testing/environment';
import {State, TemplateBuilder, TemplateProps} from '@material/web/testing/templates';
import {html, TemplateResult} from 'lit';

import {MdTabIndicator} from '../tab_indicator/tab-indicator';

import {TabHarness} from './harness';

describe('Tab', () => {
  const env = new Environment();

  async function setupPrimaryTest(
      {props, iconSlot}:
          {props?: TemplateProps<TabHarness>, iconSlot?: TemplateResult} = {}) {
    const tabTemplate = getTabTemplate({iconSlot})
                            .variant('primary', props)
                            .render(State.DEFAULT);
    const instance = tabTemplate ?
        env.render(tabTemplate).querySelector('md-primary-tab') :
        null;

    if (!instance) {
      throw new Error('Could not query rendered <md-primary-tab>');
    }

    await env.waitForStability();
    return {instance, harness: new TabHarness(instance)};
  }

  async function setupSecondaryTest(
      {props, iconSlot}:
          {props?: TemplateProps<TabHarness>, iconSlot?: TemplateResult} = {}) {
    const tabTemplate = getTabTemplate({iconSlot})
                            .variant('secondary', props)
                            .render(State.DEFAULT);
    const instance = tabTemplate ?
        env.render(tabTemplate).querySelector('md-secondary-tab') :
        null;

    if (!instance) {
      throw new Error('Could not query rendered <md-secondary-tab>');
    }

    await env.waitForStability();
    return {instance, harness: new TabHarness(instance)};
  }

  describe('primary', () => {
    it('active tab has `md3-tab--active` class', async () => {
      const {harness} = await setupPrimaryTest({props: {active: true}});
      const tabClasses = (await harness.getInteractiveElement()).classList;
      expect(tabClasses).toContain('md3-tab--active');
    });

    it('active tab has an active tab indicator', async () => {
      const {harness} = await setupPrimaryTest({props: {active: true}});
      const tabIndicator =
          (await harness.getInteractiveElement())
              .querySelector<MdTabIndicator>('md-tab-indicator')!;
      expect(tabIndicator.active).toBeTrue();
    });

    it('inactive tab has an inactive tab indicator', async () => {
      const {harness} = await setupPrimaryTest({props: {active: false}});
      const tabIndicator =
          (await harness.getInteractiveElement())
              .querySelector<MdTabIndicator>('md-tab-indicator')!;
      expect(tabIndicator.active).toBeFalse();
    });

    it('emits interaction event when clicked with mouse', async () => {
      const {harness} = await setupPrimaryTest();

      const interactionHandler = jasmine.createSpy('tab-interaction');
      harness.element.addEventListener('tab-interaction', interactionHandler);

      await harness.clickWithMouse();
      expect(interactionHandler).toHaveBeenCalled();
      expect(interactionHandler.calls.argsFor(0)).toEqual([
        jasmine.objectContaining({detail: {tabId: 'primary-default-id'}})
      ]);
    });

    it('will generate an md-icon', async () => {
      const {harness} = await setupPrimaryTest({props: {icon: 'home'}});
      const icon = (await harness.getInteractiveElement())
                       .querySelector<MdIcon>('md-icon')!;
      expect(icon.textContent!.trim()).toEqual('home');
    });

    it('node with `slot=icon` will serve as the icon', async () => {
      const iconSlot = html`<i slot="icon">home</i>`;
      const {harness} = await setupPrimaryTest({iconSlot});
      const slottedIcon =
          (await harness.getInteractiveElement())
              .querySelector<HTMLSlotElement>('slot[name="icon"]')!;
      const icon = slottedIcon.assignedElements()[0];
      expect(icon.textContent!.trim()).toEqual('home');
    });
  });

  describe('secondary', () => {
    it('active tab has `md3-tab--active` class', async () => {
      const {harness} = await setupSecondaryTest({props: {active: true}});
      const tabClasses = (await harness.getInteractiveElement()).classList;
      expect(tabClasses).toContain('md3-tab--active');
    });

    it('active tab has an active tab indicator', async () => {
      const {harness} = await setupSecondaryTest({props: {active: true}});
      const tabIndicator =
          (await harness.getInteractiveElement())
              .querySelector<MdTabIndicator>('md-tab-indicator')!;
      expect(tabIndicator.active).toBeTrue();
    });

    it('inactive tab has an inactive tab indicator', async () => {
      const {harness} = await setupSecondaryTest({props: {active: false}});
      const tabIndicator =
          (await harness.getInteractiveElement())
              .querySelector<MdTabIndicator>('md-tab-indicator')!;
      expect(tabIndicator.active).toBeFalse();
    });

    it('emits interaction event when clicked with mouse', async () => {
      const {harness} = await setupSecondaryTest();

      const interactionHandler = jasmine.createSpy('tab-interaction');
      harness.element.addEventListener('tab-interaction', interactionHandler);

      await harness.clickWithMouse();
      expect(interactionHandler).toHaveBeenCalled();
      expect(interactionHandler.calls.argsFor(0)).toEqual([
        jasmine.objectContaining({detail: {tabId: 'secondary-default-id'}})
      ]);
    });

    it('will generate an md-icon', async () => {
      const {harness} = await setupSecondaryTest({props: {icon: 'home'}});
      const icon = (await harness.getInteractiveElement())
                       .querySelector<MdIcon>('md-icon')!;
      expect(icon.textContent!.trim()).toEqual('home');
    });

    it('node with `slot=icon` will serve as the icon', async () => {
      const iconSlot = html`<i slot="icon">home</i>`;
      const {harness} = await setupSecondaryTest({iconSlot});
      const slottedIcon =
          (await harness.getInteractiveElement())
              .querySelector<HTMLSlotElement>('slot[name="icon"]')!;
      const icon = slottedIcon.assignedElements()[0];
      expect(icon.textContent!.trim()).toEqual('home');
    });
  });
});

function getTabTemplate({iconSlot}: {iconSlot?: TemplateResult} = {}) {
  return new TemplateBuilder().withHarness(TabHarness).withVariants({
    primary(directive, props) {
      return html`<md-primary-tab
      .label=${props.label ?? 'default label'}
      .active=${!!props.active}
      .icon=${props.icon ?? ''}
      .hasImageIcon=${!!iconSlot}
      data-tab-id=${'primary-default-id'}
      ${directive}>
      ${iconSlot}
     </md-primary-tab>
    `;
    },
    secondary(directive, props) {
      return html`<md-secondary-tab
      .label=${props.label ?? 'default label'}
      .active=${!!props.active}
      .icon=${props.icon ?? ''}
      .hasImageIcon=${!!iconSlot}
      data-tab-id=${'secondary-default-id'}
      ${directive}>
      ${iconSlot}
     </md-secondary-tab>
    `;
    },
  });
}
