/**
 * @license
 * Copyright 2020 Google Inc. All Rights Reserved.
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
// taze: chai from //third_party/javascript/chai:closure_chai

import '@material/mwc-list/mwc-list-item';
import '@material/mwc-icon';

import {isNodeElement} from '@material/mwc-base/utils';
import {GraphicType, ListItem, RequestSelectedDetail} from '@material/mwc-list/mwc-list-item';
import {ListItemBase} from '@material/mwc-list/mwc-list-item-base';
import {html} from 'lit-html';

import {fixture, TestFixture} from '../../../../test/src/util/helpers';

const defaultListItemProps = {
  twoLine: false,
  selected: false,
  activated: false,
  graphic: null as GraphicType,
  hasMeta: false,
  noninteractive: false,
  primary: html``,
  secondary: html``,
  graphicSlot: html``,
  meta: html``,
  onRequestSelected: (() => undefined) as
      (ev: CustomEvent<RequestSelectedDetail>) => void,
  onListItemRendered: (() => undefined) as (ev: Event) => void,
};

type ListItemProps = typeof defaultListItemProps;

const listItem = (propsInit: Partial<ListItemProps> = {}) => {
  const props: ListItemProps = {...defaultListItemProps, ...propsInit};

  return html`
    <mwc-list-item
        ?twoline=${props.twoLine}
        ?selected=${props.selected}
        ?activated=${props.activated}
        ?hasMeta=${props.hasMeta}
        .graphic=${props.graphic}
        .noninteractive=${props.noninteractive}
        @request-selected=${props.onRequestSelected}
        @list-item-rendered=${props.onListItemRendered}>
      ${props.primary}
      ${props.secondary}
      ${props.graphicSlot}
      ${props.meta}
    </mwc-list-item>`;
};

suite('mwc-list:', () => {
  let fixt: TestFixture;

  suite('mwc-list-item: initialization', () => {
    let element: ListItem;

    test('initializes as an mwc-list-item', async () => {
      fixt = await fixture(listItem());
      element = fixt.root.querySelector('mwc-list-item')!;
      assert.instanceOf(element, ListItem);
      assert.instanceOf(element, ListItemBase);
    });

    test('sets attribute on connection', async () => {
      fixt = await fixture(listItem());
      element = fixt.root.querySelector('mwc-list-item')!;

      assert.isTrue(element.hasAttribute('mwc-list-item'));
    });

    test('noninteractive does not set attribute on connection', async () => {
      fixt = await fixture(listItem({noninteractive: true}));
      element = fixt.root.querySelector('mwc-list-item')!;

      assert.isFalse(element.hasAttribute('mwc-list-item'));
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('mwc-list-item: variants', () => {
    let element: ListItem;

    test('single line renders correctly', async () => {
      fixt = await fixture(listItem({
        primary: html`<span class="primary">Apple</span>`,
        secondary: html`<span slot="secondary">This is a Fruit</span>`,
        graphicSlot: html`<mwc-icon slot="graphic">done</mwc-icon>`,
        meta: html`<mwc-icon slot="meta">code</mwc-icon>`,
      }));
      element = fixt.root.querySelector('mwc-list-item')!;

      const root = (element.shadowRoot as ShadowRoot);
      const defaultSlot =
          root.querySelector('.mdc-list-item__text > slot') as HTMLSlotElement;
      const primaryTextWrapper =
          root.querySelector('.mdc-list-item__primaray-text');
      const secondaryTextWrapper =
          root.querySelector('.mdc-list-item__secondary-text');
      const metaWrapper = root.querySelector('.mdc-list-item__meta');
      const graphicWrapper = root.querySelector('.mdc-list-item__graphic');

      assert.notEqual(defaultSlot, null, 'default slot exists with no wrapper');
      assert.equal(
          primaryTextWrapper, null, 'no primary-text wrapper (only two line)');
      assert.equal(
          secondaryTextWrapper,
          null,
          'no secondary-text wrapper (only two line)');
      assert.equal(metaWrapper, null, 'no meta wrapper (only two line)');
      assert.equal(graphicWrapper, null, 'no graphic wrapper (only two line)');

      const primaryTextElement = element.querySelector('.primary') as Element;
      const projectedElements =
          defaultSlot.assignedNodes({flatten: true}).filter(isNodeElement);

      assert.equal(
          projectedElements.length, 1, 'there is only one projected element');
      assert.equal(
          primaryTextElement,
          projectedElements[0],
          'primary text is projected');
    });

    test('two line renders correctly', async () => {
      fixt = await fixture(listItem({
        primary: html`<span class="primary">Apple</span>`,
        secondary: html`<span slot="secondary">This is a Fruit</span>`,
        graphicSlot: html`<mwc-icon slot="graphic">done</mwc-icon>`,
        meta: html`<mwc-icon slot="meta">code</mwc-icon>`,
        twoLine: true,
      }));
      element = fixt.root.querySelector('mwc-list-item')!;

      const root = (element.shadowRoot as ShadowRoot);
      const defaultSlot = root.querySelector('.mdc-list-item__text > slot');
      const primaryTextSlot =
          root.querySelector('.mdc-list-item__primary-text > slot') as
          HTMLSlotElement;
      const secondaryTextSlot =
          root.querySelector('.mdc-list-item__secondary-text > slot') as
          HTMLSlotElement;
      const metaWrapper = root.querySelector('.mdc-list-item__meta');
      const graphicWrapper = root.querySelector('.mdc-list-item__graphic');

      assert.equal(
          defaultSlot, null, 'default slot doesnt exist (single line only)');
      assert.notEqual(primaryTextSlot, null, 'primary text slot exists');
      assert.notEqual(secondaryTextSlot, null, 'secondary text slot exists');
      assert.equal(metaWrapper, null, 'no meta wrapper (only two line)');
      assert.equal(graphicWrapper, null, 'no graphic wrapper (only two line)');

      const primaryTextElement = element.querySelector('.primary') as Element;
      const secondaryTextElement =
          element.querySelector('[slot="secondary"]') as Element;
      const primaryProjEls =
          primaryTextSlot.assignedNodes({flatten: true}).filter(isNodeElement);
      const secondaryProjEls = secondaryTextSlot.assignedNodes({flatten: true})
                                   .filter(isNodeElement);

      assert.equal(
          primaryProjEls.length,
          1,
          'there is only one projected primary text element');
      assert.equal(
          primaryTextElement, primaryProjEls[0], 'primary text is projected');
      assert.equal(
          secondaryProjEls.length,
          1,
          'there is only one projected secondary text element');
      assert.equal(
          secondaryTextElement,
          secondaryProjEls[0],
          'secondary text is projected');
    });

    test('meta renders correctly', async () => {
      fixt = await fixture(listItem({
        primary: html`<span class="primary">Apple</span>`,
        secondary: html`<span slot="secondary">This is a Fruit</span>`,
        graphicSlot: html`<mwc-icon slot="graphic">done</mwc-icon>`,
        meta: html`<mwc-icon slot="meta">code</mwc-icon>`,
        hasMeta: true,
      }));
      element = fixt.root.querySelector('mwc-list-item')!;

      const root = (element.shadowRoot as ShadowRoot);
      const defaultSlot = root.querySelector('.mdc-list-item__text > slot');
      const primaryTextWrapper =
          root.querySelector('.mdc-list-item__primaray-text');
      const secondaryTextWrapper =
          root.querySelector('.mdc-list-item__secondary-text');
      const metaWrapper = root.querySelector('.mdc-list-item__meta');
      const metaSlot =
          root.querySelector('slot[name="meta"]') as HTMLSlotElement;
      const graphicWrapper = root.querySelector('.mdc-list-item__graphic');

      assert.notEqual(defaultSlot, null, 'default slot exists with no wrapper');
      assert.equal(
          primaryTextWrapper, null, 'no primary-text wrapper (only two line)');
      assert.equal(
          secondaryTextWrapper,
          null,
          'no secondary-text wrapper (only two line)');
      assert.notEqual(metaWrapper, null, 'meta wrapper exists');
      assert.notEqual(metaSlot, null, 'meta slot exists');
      assert.equal(graphicWrapper, null, 'no graphic wrapper (only two line)');

      const metaElement = element.querySelector('[slot="meta"]') as Element;
      const projectedElements =
          metaSlot.assignedNodes({flatten: true}).filter(isNodeElement);

      assert.equal(
          projectedElements.length, 1, 'there is only one projected element');
      assert.equal(metaElement, projectedElements[0], 'meta icon is projected');
    });

    test('graphic renders correctly', async () => {
      fixt = await fixture(listItem({
        primary: html`<span class="primary">Apple</span>`,
        secondary: html`<span slot="secondary">This is a Fruit</span>`,
        graphicSlot: html`<mwc-icon slot="graphic">done</mwc-icon>`,
        meta: html`<mwc-icon slot="meta">code</mwc-icon>`,
        graphic: 'icon',
      }));
      element = fixt.root.querySelector('mwc-list-item')!;

      const root = (element.shadowRoot as ShadowRoot);
      const defaultSlot = root.querySelector('.mdc-list-item__text > slot');
      const primaryTextWrapper =
          root.querySelector('.mdc-list-item__primaray-text');
      const secondaryTextWrapper =
          root.querySelector('.mdc-list-item__secondary-text');
      const metaWrapper = root.querySelector('.mdc-list-item__meta');
      const graphicWrapper = root.querySelector('.mdc-list-item__graphic');
      const graphicSlot =
          root.querySelector('slot[name="graphic"]') as HTMLSlotElement;

      assert.notEqual(defaultSlot, null, 'default slot exists with no wrapper');
      assert.equal(
          primaryTextWrapper, null, 'no primary-text wrapper (only two line)');
      assert.equal(
          secondaryTextWrapper,
          null,
          'no secondary-text wrapper (only two line)');
      assert.equal(metaWrapper, null, 'meta wrapper exists');
      assert.notEqual(
          graphicWrapper, null, 'no graphic wrapper (only two line)');
      assert.notEqual(graphicSlot, null, 'graphic slot exists');

      const graphicElement =
          element.querySelector('[slot="graphic"]') as Element;
      const projectedElements =
          graphicSlot.assignedNodes({flatten: true}).filter(isNodeElement);

      assert.equal(
          projectedElements.length, 1, 'there is only one projected element');
      assert.equal(
          graphicElement, projectedElements[0], 'meta icon is projected');
    });

    test('noninteractive removes props and attrs on bootup', async () => {
      fixt = await fixture(listItem({
        noninteractive: true,
        selected: true,
        activated: true,
      }));
      element = fixt.root.querySelector('mwc-list-item')!;

      assert.isTrue(element.noninteractive, 'is noninteractive');
      assert.isFalse(element.activated, 'removes activated on boot up');
      assert.isFalse(element.selected, 'removes selected on boot up');
      assert.isFalse(
          element.hasAttribute('mwc-list-item'),
          'removes selectability on boot up');
    });

    test('noninteractive +/- props and attrs on change', async () => {
      fixt = await fixture(listItem({
        noninteractive: false,
        selected: true,
        activated: true,
      }));
      element = fixt.root.querySelector('mwc-list-item')!;

      assert.isFalse(element.noninteractive, 'is interactive');
      assert.isTrue(element.activated, 'activated on boot up');
      assert.isTrue(element.selected, 'selected on boot up');
      assert.isTrue(
          element.hasAttribute('mwc-list-item'), 'selectability on boot up');

      element.noninteractive = true;
      await element.updateComplete;

      assert.isTrue(element.noninteractive, 'is noninteractive');
      assert.isFalse(element.activated, 'removes activated on prop change');
      assert.isFalse(element.selected, 'removes selected on prop change');
      assert.isFalse(
          element.hasAttribute('mwc-list-item'),
          'removes selectability on prop change');

      element.noninteractive = false;
      await element.updateComplete;

      assert.isFalse(element.noninteractive, 'is interactive');
      assert.isFalse(
          element.activated, 'does not add activated on prop change');
      assert.isFalse(element.selected, 'does not add selected on prop change');
      assert.isTrue(
          element.hasAttribute('mwc-list-item'),
          'adds selectability on prop change');
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });

  suite('mwc-list-item: interaction', () => {
    let element: ListItem;

    test('rendered event fires', async () => {
      let numRenderCalls = 0;
      fixt = await fixture(listItem({
        onListItemRendered: () => numRenderCalls++,
      }));

      assert.equal(
          numRenderCalls, 1, 'list-item-rendered called only once on bootup');
    });

    test('request selected event', async () => {
      let numReqSelectedCalls = 0;
      let lastReqSelectedEv = {detail: {}} as
          CustomEvent<RequestSelectedDetail>;
      fixt = await fixture(listItem({
        onRequestSelected: (ev) => {
          numReqSelectedCalls++;
          lastReqSelectedEv = ev;
        },
        noninteractive: true,
      }));
      element = fixt.root.querySelector('mwc-list-item')!;

      assert.isFalse(element.selected, 'element is not selected');
      assert.equal(
          numReqSelectedCalls, 0, 'request-selected not called on bootup');

      element.click();
      assert.equal(
          numReqSelectedCalls, 0, 'request-selected not called on click');

      element.selected = true;
      await element.updateComplete;

      assert.isTrue(element.selected, 'element is selected');
      assert.equal(
          numReqSelectedCalls, 0, 'request-selected not called on selected ev');

      element.noninteractive = false;
      await element.updateComplete;

      element.click();
      assert.equal(numReqSelectedCalls, 1, 'request-selected called on click');
      numReqSelectedCalls = 0;
      assert.equal(
          lastReqSelectedEv.detail.source,
          'interaction',
          'interaction event on click');
      assert.notEqual(
          lastReqSelectedEv.detail.selected,
          element.selected,
          'click ev has selected opposite of state');

      await element.updateComplete;

      assert.isTrue(
          element.selected, 'element does not change selected on click');

      element.selected = false;
      await element.updateComplete;

      assert.isFalse(element.selected, 'element is not selected');
      assert.equal(
          numReqSelectedCalls, 1, 'request-selected called on selected ev');
      numReqSelectedCalls = 0;
      assert.equal(
          lastReqSelectedEv.detail.source,
          'property',
          'property event on click');
      assert.equal(
          lastReqSelectedEv.detail.selected,
          element.selected,
          'property request selected ev requests for the same as selected state');
    });

    teardown(() => {
      if (fixt) {
        fixt.remove();
      }
    });
  });
});
