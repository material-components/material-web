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

import '@material/mwc-list';
import '@material/mwc-list/mwc-list-item';
import '@material/mwc-list/mwc-check-list-item';
import '@material/mwc-list/mwc-radio-list-item';
import '@material/mwc-icon';

import {isNodeElement} from '@material/mwc-base/utils';
import {List} from '@material/mwc-list';
import {CheckListItem} from '@material/mwc-list/mwc-check-list-item';
import {GraphicType, ListItem, RequestSelectedDetail} from '@material/mwc-list/mwc-list-item';
import {ListItemBase} from '@material/mwc-list/mwc-list-item-base';
import {RadioListItem} from '@material/mwc-list/mwc-radio-list-item';
import {isIndexSet} from '@material/mwc-menu';
import {html, TemplateResult} from 'lit-html';

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
  left: false,
  group: null,
  onRequestSelected: (() => undefined) as
      (ev: CustomEvent<RequestSelectedDetail>) => void,
  onListItemRendered: (() => undefined) as (ev: Event) => void,
};

type ListItemProps = typeof defaultListItemProps;

const dividerTempl = html`
  <!-- @ts-ignore -->
  <li divider></li>`;

const listItem = (propsInit: Partial<ListItemProps> = {}) => {
  const props: ListItemProps = {...defaultListItemProps, ...propsInit};

  return html`
    <mwc-list-item
        .twoline=${props.twoLine}
        .selected=${props.selected}
        .activated=${props.activated}
        .hasMeta=${props.hasMeta}
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

const checkListItem = (propsInit: Partial<ListItemProps> = {}) => {
  const props: ListItemProps = {...defaultListItemProps, ...propsInit};

  return html`
    <mwc-check-list-item
        .twoline=${props.twoLine}
        .selected=${props.selected}
        .activated=${props.activated}
        .hasMeta=${props.hasMeta}
        .left=${props.left}
        .graphic=${props.graphic}
        .noninteractive=${props.noninteractive}
        @request-selected=${props.onRequestSelected}
        @list-item-rendered=${props.onListItemRendered}>
      ${props.primary}
      ${props.secondary}
      ${props.graphicSlot}
      ${props.meta}
    </mwc-check-list-item>`;
};

const radioListItem = (propsInit: Partial<ListItemProps> = {}) => {
  const props: ListItemProps = {...defaultListItemProps, ...propsInit};

  return html`
    <mwc-radio-list-item
        .twoline=${props.twoLine}
        .selected=${props.selected}
        .activated=${props.activated}
        .hasMeta=${props.hasMeta}
        .left=${props.left}
        .graphic=${props.graphic}
        .group=${props.group}
        .noninteractive=${props.noninteractive}
        @request-selected=${props.onRequestSelected}
        @list-item-rendered=${props.onListItemRendered}>
      ${props.primary}
      ${props.secondary}
      ${props.graphicSlot}
      ${props.meta}
    </mwc-radio-list-item>`;
};

const defaultListProps = {
  multi: false,
  wrapFocus: false,
  rootTabbable: false,
  noninteractive: false,
  activatable: false,
  itemRoles: null as string | null,
  innerRole: null as string | null,
  items: [] as TemplateResult[],
};

type ListProps = typeof defaultListProps;

const listTemplate = (propsInit: Partial<ListProps> = {}) => {
  const props: ListProps = {...defaultListProps, ...propsInit};

  return html`
    <mwc-list
        .multi=${props.multi}
        .wrapFocus=${props.wrapFocus}
        .rootTabbable=${props.rootTabbable}
        .noninteractive=${props.noninteractive}
        .activatable=${props.activatable}
        .itemRoles=${props.itemRoles}
        .innerRole=${props.innerRole}>
      ${props.items}
    </mwc-list>
  `;
};

suite('mwc-list:', () => {
  let fixt: TestFixture;

  suite('mwc-list-item', () => {
    suite('initialization', () => {
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

    suite('variants', () => {
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
        const mdcRoot =
            root.querySelector('.mdc-list-item__text') as HTMLElement;
        const defaultSlot =
            root.querySelector('slot:not([name])') as HTMLSlotElement;
        const primaryTextWrapper =
            root.querySelector('.mdc-list-item__primaray-text');
        const secondaryTextWrapper =
            root.querySelector('.mdc-list-item__secondary-text');
        const metaWrapper = root.querySelector('.mdc-list-item__meta');
        const graphicWrapper = root.querySelector('.mdc-list-item__graphic');

        assert.notEqual(
            defaultSlot, null, 'default slot exists with no wrapper');
        assert.equal(
            defaultSlot.parentNode,
            mdcRoot,
            'default slot exists with no wrapper');
        assert.equal(
            primaryTextWrapper,
            null,
            'no primary-text wrapper (only two line)');
        assert.equal(
            secondaryTextWrapper,
            null,
            'no secondary-text wrapper (only two line)');
        assert.equal(metaWrapper, null, 'no meta wrapper (only two line)');
        assert.equal(
            graphicWrapper, null, 'no graphic wrapper (only two line)');

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
        const defaultSlot =
            root.querySelector('slot:not([name])') as HTMLSlotElement;
        const primaryTextWrapper =
            root.querySelector('.mdc-list-item__primary-text') as HTMLElement;
        const secondaryTextSlot =
            root.querySelector('slot[name="secondary"]') as HTMLSlotElement;
        const metaWrapper = root.querySelector('.mdc-list-item__meta');
        const graphicWrapper = root.querySelector('.mdc-list-item__graphic');

        assert.notEqual(defaultSlot, null, 'default slot exists');
        assert.notEqual(
            primaryTextWrapper, null, 'primary text slot wrapper exists');
        assert.equal(
            defaultSlot.parentNode,
            primaryTextWrapper,
            'primary text slot exists');
        assert.notEqual(secondaryTextSlot, null, 'secondary text slot exists');
        assert.equal(metaWrapper, null, 'no meta wrapper (only two line)');
        assert.equal(
            graphicWrapper, null, 'no graphic wrapper (only two line)');

        const primaryTextElement = element.querySelector('.primary') as Element;
        const secondaryTextElement =
            element.querySelector('[slot="secondary"]') as Element;
        const primaryProjEls =
            defaultSlot.assignedNodes({flatten: true}).filter(isNodeElement);
        const secondaryProjEls =
            secondaryTextSlot.assignedNodes({flatten: true})
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

        await element.updateComplete;

        const root = (element.shadowRoot as ShadowRoot);
        const mdcRoot =
            root.querySelector('.mdc-list-item__text') as HTMLElement;
        const defaultSlot =
            root.querySelector('slot:not([name])') as HTMLSlotElement;
        const primaryTextWrapper =
            root.querySelector('.mdc-list-item__primaray-text');
        const secondaryTextWrapper =
            root.querySelector('.mdc-list-item__secondary-text');
        const metaWrapper = root.querySelector('.mdc-list-item__meta');
        const metaSlot =
            root.querySelector('slot[name="meta"]') as HTMLSlotElement;
        const graphicWrapper = root.querySelector('.mdc-list-item__graphic');

        assert.notEqual(
            defaultSlot, null, 'default slot exists with no wrapper');
        assert.equal(
            defaultSlot.parentNode,
            mdcRoot,
            'default slot exists with no wrapper');
        assert.equal(
            primaryTextWrapper,
            null,
            'no primary-text wrapper (only two line)');
        assert.equal(
            secondaryTextWrapper,
            null,
            'no secondary-text wrapper (only two line)');
        assert.notEqual(metaWrapper, null, 'meta wrapper exists');
        assert.notEqual(metaSlot, null, 'meta slot exists');
        assert.equal(
            graphicWrapper, null, 'no graphic wrapper (only two line)');

        const metaElement = element.querySelector('[slot="meta"]') as Element;
        const projectedElements =
            metaSlot.assignedNodes({flatten: true}).filter(isNodeElement);

        assert.equal(
            projectedElements.length, 1, 'there is only one projected element');
        assert.equal(
            metaElement, projectedElements[0], 'meta icon is projected');
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
        const mdcRoot =
            root.querySelector('.mdc-list-item__text') as HTMLElement;
        const defaultSlot =
            root.querySelector('slot:not([name])') as HTMLSlotElement;
        const primaryTextWrapper =
            root.querySelector('.mdc-list-item__primaray-text');
        const secondaryTextWrapper =
            root.querySelector('.mdc-list-item__secondary-text');
        const metaWrapper = root.querySelector('.mdc-list-item__meta');
        const graphicWrapper = root.querySelector('.mdc-list-item__graphic');
        const graphicSlot =
            root.querySelector('slot[name="graphic"]') as HTMLSlotElement;

        assert.notEqual(
            defaultSlot, null, 'default slot exists with no wrapper');
        assert.equal(
            defaultSlot.parentNode,
            mdcRoot,
            'default slot exists with no wrapper');
        assert.equal(
            primaryTextWrapper,
            null,
            'no primary-text wrapper (only two line)');
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
        assert.isFalse(
            element.selected, 'does not add selected on prop change');
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

    suite('interaction', () => {
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
            numReqSelectedCalls,
            0,
            'request-selected not called on click on noninteractive');

        element.selected = true;
        await element.updateComplete;

        assert.isTrue(element.selected, 'element is selected');
        assert.equal(
            numReqSelectedCalls,
            0,
            'request-selected not called on noninteractive selected prop');

        element.noninteractive = false;
        await element.updateComplete;

        element.click();
        assert.equal(
            numReqSelectedCalls, 1, 'request-selected called on click');
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
            numReqSelectedCalls, 1, 'request-selected called on selected prop');
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

  suite('mwc-check-list-item', () => {
    suite('initialization', () => {
      let element: CheckListItem;

      test('initializes as an mwc-check-list-item', async () => {
        fixt = await fixture(checkListItem());
        element = fixt.root.querySelector('mwc-check-list-item')!;
        assert.instanceOf(element, CheckListItem, 'is checklsit item');
        assert.instanceOf(element, ListItemBase, 'inherits base');
      });

      test('sets attribute on connection', async () => {
        fixt = await fixture(checkListItem());
        element = fixt.root.querySelector('mwc-check-list-item')!;

        assert.isTrue(element.hasAttribute('mwc-list-item'));
      });

      test('left functions as intended', async () => {
        fixt = await fixture(checkListItem({
          left: true,
        }));
        element = fixt.root.querySelector('mwc-check-list-item')!;
        const checkbox = element.shadowRoot!.querySelector('mwc-checkbox')!;
        let slot = element.shadowRoot!.querySelector('slot')!;

        let childrenColl = element.shadowRoot!.children;
        let children = Array.from(childrenColl).filter(isNodeElement);

        let first = children[0].firstElementChild;
        let second = children[1].firstElementChild;

        assert.equal(first, checkbox, 'checkbox is first when left');
        assert.equal(second, slot, 'slot is second when left');

        element.left = false;
        await element.updateComplete;

        // technically a new node must be queried again
        slot = element.shadowRoot!.querySelector('slot')!;

        childrenColl = element.shadowRoot!.children;
        children = Array.from(childrenColl).filter(isNodeElement);
        first = children[0].firstElementChild;
        second = children[1].firstElementChild;

        assert.equal(first, slot, 'slot is first when not left');
        assert.equal(second, checkbox, 'checkbox is second when not left');
      });

      teardown(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    suite('interaction', () => {
      let element: CheckListItem;

      test('request selected event', async () => {
        let numReqSelectedCalls = 0;
        let lastReqSelectedEv = {detail: {}} as
            CustomEvent<RequestSelectedDetail>;
        fixt = await fixture(checkListItem({
          onRequestSelected: (ev) => {
            numReqSelectedCalls++;
            lastReqSelectedEv = ev;
          }
        }));
        element = fixt.root.querySelector('mwc-check-list-item')!;
        const checkbox = element.shadowRoot!.querySelector('mwc-checkbox')!;

        await checkbox.updateComplete;

        element.click();
        assert.equal(
            numReqSelectedCalls, 1, 'request-selected called on click');
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

        assert.isFalse(
            element.selected, 'element does not change selected on click');

        element.selected = true;
        await element.updateComplete;
        await checkbox.updateComplete;

        assert.isTrue(element.selected, 'element is selected on prop');
        assert.isTrue(
            checkbox.checked,
            'checkbox mirrors element selection state on prop');
        assert.equal(
            numReqSelectedCalls, 1, 'request-selected called on selected prop');
        numReqSelectedCalls = 0;
        assert.equal(
            lastReqSelectedEv.detail.source,
            'property',
            'property event on click');
        assert.equal(
            lastReqSelectedEv.detail.selected,
            element.selected,
            'property request selected ev requests for the same as selected state');

        // old versions of safari have a broken click event that does not
        // compose the click event.
        let skipOldSafari = false;

        const formElement = (checkbox as unknown as {
                              formElement: HTMLInputElement;
                            }).formElement;

        const detectOldSafari = (e: MouseEvent) => {
          if (!e.composed) {
            skipOldSafari = true;
          }
        };

        formElement.addEventListener(
            'click',
            detectOldSafari as unknown as EventListenerOrEventListenerObject);

        checkbox.click();

        await element.updateComplete;
        await checkbox.updateComplete;

        if (!skipOldSafari) {
          assert.isFalse(
              element.selected, 'element is deselected on checkbox click');
          assert.equal(
              element.selected,
              checkbox.checked,
              'checkbox mirrors element selection state on prop');
          assert.equal(
              numReqSelectedCalls,
              1,
              'request-selected called on checkbox click');
          numReqSelectedCalls = 0;
          assert.equal(
              lastReqSelectedEv.detail.source,
              'interaction',
              'interaction event on checkbox click');
        }
      });

      teardown(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });
  });

  suite('mwc-radio-list-item', () => {
    suite('mwc-radio-list-item: initialization', () => {
      let element: RadioListItem;

      test('initializes as an mwc-radio-list-item', async () => {
        fixt = await fixture(radioListItem());
        element = fixt.root.querySelector('mwc-radio-list-item')!;
        assert.instanceOf(element, RadioListItem, 'is checklsit item');
        assert.instanceOf(element, ListItemBase, 'inherits base');
      });

      test('sets attribute on connection', async () => {
        fixt = await fixture(radioListItem());
        element = fixt.root.querySelector('mwc-radio-list-item')!;

        assert.isTrue(element.hasAttribute('mwc-list-item'));
      });

      test('left functions as intended', async () => {
        fixt = await fixture(radioListItem({
          left: true,
        }));
        element = fixt.root.querySelector('mwc-radio-list-item')!;
        const checkbox = element.shadowRoot!.querySelector('mwc-checkbox')!;
        let slot = element.shadowRoot!.querySelector('slot')!;

        let childrenColl = element.shadowRoot!.children;
        let children = Array.from(childrenColl).filter(isNodeElement);

        let first = children[0].firstElementChild;
        let second = children[1].firstElementChild;

        assert.equal(first, checkbox, 'checkbox is first when left');
        assert.equal(second, slot, 'slot is second when left');

        element.left = false;
        await element.updateComplete;

        // technically a new node must be queried again
        slot = element.shadowRoot!.querySelector('slot')!;

        childrenColl = element.shadowRoot!.children;
        children = Array.from(childrenColl).filter(isNodeElement);
        first = children[0].firstElementChild;
        second = children[1].firstElementChild;

        assert.equal(first, slot, 'slot is first when not left');
        assert.equal(second, checkbox, 'checkbox is second when not left');
      });

      teardown(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    suite('mwc-radio-list-item: interaction', () => {
      let firstElement: RadioListItem;
      let secondElement: RadioListItem;

      test('request selected event', async () => {
        let reqSelectedEvts = [] as CustomEvent<RequestSelectedDetail>[];
        const radioItem = radioListItem({
          onRequestSelected: (ev) => {
            reqSelectedEvts.push(ev);
          }
        });
        fixt = await fixture(html`${radioItem}${radioItem}`);
        firstElement = fixt.root.querySelectorAll('mwc-radio-list-item')[0] as
            RadioListItem;
        secondElement = fixt.root.querySelectorAll('mwc-radio-list-item')[1] as
            RadioListItem;
        const firstRadio = firstElement.shadowRoot!.querySelector('mwc-radio')!;
        const secondRadio =
            secondElement.shadowRoot!.querySelector('mwc-radio')!;

        await firstRadio.updateComplete;
        await secondRadio.updateComplete;

        firstElement.click();

        await firstElement.updateComplete;
        await secondElement.updateComplete;

        assert.equal(
            reqSelectedEvts.length,
            1,
            'request-selected called on click of first');
        assert.equal(
            reqSelectedEvts[0].detail.source,
            'interaction',
            'interaction event on click');
        assert.notEqual(
            reqSelectedEvts[0].detail.selected,
            firstElement.selected,
            'click ev has selected opposite of state');
        reqSelectedEvts = [];

        assert.isFalse(
            firstElement.selected, 'element does not change selected on click');

        firstElement.selected = true;

        await firstElement.updateComplete;
        await secondElement.updateComplete;
        await firstRadio.updateComplete;
        await secondRadio.updateComplete;

        assert.isTrue(
            firstElement.selected,
            'first element is not selected when set with prop');
        assert.equal(
            firstRadio.checked,
            firstElement.selected,
            'radio mirrors element selection state on prop');
        assert.notEqual(
            secondElement.selected,
            firstElement.selected,
            'second element is deselected on first element prop set');
        assert.equal(
            secondRadio.checked,
            secondElement.selected,
            'radio mirrors element selection state on prop');
        assert.equal(
            reqSelectedEvts.length,
            1,
            'request-selected called on selected prop, prop set');
        assert.equal(
            reqSelectedEvts[0].detail.source,
            'property',
            'property event on click');
        assert.equal(
            reqSelectedEvts[0].detail.selected,
            firstElement.selected,
            'property request selected ev requests for the same as selected state');
        reqSelectedEvts = [];

        secondElement.selected = true;

        await firstElement.updateComplete;
        await secondElement.updateComplete;
        await firstRadio.updateComplete;
        await secondRadio.updateComplete;

        assert.isTrue(
            secondElement.selected,
            'second element is not selected when set with prop');
        assert.equal(
            secondRadio.checked,
            secondElement.selected,
            'radio mirrors element selection state on prop');
        assert.notEqual(
            secondElement.selected,
            firstElement.selected,
            'first element is deselected on first element prop set');
        assert.equal(
            firstRadio.checked,
            firstElement.selected,
            'radio mirrors element selection state on prop');
        assert.equal(
            reqSelectedEvts.length,
            2,
            'request-selected called on selected prop, prop set and interaction');
        assert.equal(
            reqSelectedEvts[0].detail.source,
            'property',
            'property event on click');
        assert.equal(
            reqSelectedEvts[0].detail.selected,
            secondElement.selected,
            'property request selected ev requests for the same as selected state');
        assert.equal(
            reqSelectedEvts[1].detail.source,
            'interaction',
            'interaction event on radio deselection on first prop set');
        reqSelectedEvts = [];

        firstRadio.click();

        await firstRadio.updateComplete;
        await firstElement.updateComplete;
        await secondRadio.updateComplete;
        await secondElement.updateComplete;

        assert.isTrue(
            firstElement.selected, 'first element is selected on radio click');
        assert.equal(
            firstRadio.checked,
            firstElement.selected,
            'radio mirrors element selection state on click');
        assert.notEqual(
            firstElement.selected,
            secondElement.selected,
            'element is deselected on radio click');
        assert.equal(
            firstRadio.checked,
            firstElement.selected,
            'radio mirrors element selection state on interaction');
        assert.equal(
            reqSelectedEvts.length,
            2,
            'request-selected called on radio click');
        assert.equal(
            reqSelectedEvts[0].detail.source,
            'interaction',
            'interaction event on radio click');
        assert.equal(
            reqSelectedEvts[1].detail.source,
            'interaction',
            'interaction event on radio click');
        reqSelectedEvts = [];
      });

      teardown(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });
  });


  suite('mwc-list', () => {
    let element: List;

    suite('initialization', () => {
      test('initializes as an mwc-list', async () => {
        fixt = await fixture(listTemplate());
        element = fixt.root.querySelector('mwc-list')!;
        assert.instanceOf(element, List);
      });

      test('with no children', async () => {
        fixt = await fixture(listTemplate());
        element = fixt.root.querySelector('mwc-list')!;

        assert.equal(
            element.selected,
            null,
            'empty list `selected` initializes as `null`');
        assert.equal(
            element.items.length, 0, 'empty list `items` initializes as `[]`');
        assert.equal(
            element.index, -1, 'empty list `index` initializes as `-1`');

        element.multi = true;
        await element.updateComplete;

        const selected = element.selected as ListItem[];

        assert.equal(
            selected.length,
            0,
            'empty multi list `selected` initializes as `[]`');
        assert.equal(
            element.items.length,
            0,
            'empty multi list `items` initializes as `[]`');

        const index = element.index as Set<number>;
        assert.isTrue(
            isIndexSet(index), 'empty multi list `index` initializes as a Set');
        assert.equal(index.size, 0, 'empty multi list `index` Set is empty');

        element.multi = false;
        await element.updateComplete;

        assert.equal(
            element.selected,
            null,
            'multi -> not list `selected` initializes as `null`');
        assert.equal(
            element.items.length,
            0,
            'multi -> not list `items` initializes as `[]`');
        assert.equal(
            element.index, -1, 'multi -> not list `index` initializes as `-1`');
      });

      test('single with unselected children', async () => {
        const itemsTemplates = [listItem(), listItem(), listItem()];
        fixt = await fixture(listTemplate({items: itemsTemplates}));
        element = fixt.root.querySelector('mwc-list')!;

        assert.equal(
            element.selected, null, '`selected` initializes as `null`');
        assert.equal(
            element.items[0].tabIndex, 0, 'tabindex set to 0 on first');
        assert.equal(element.items[1].tabIndex, -1, 'tabindex on others -1');
        assert.equal(element.items[2].tabIndex, -1, 'tabindex on others -1');
        assert.equal(
            element.items.length, 3, '`items` are enumerated correctly');
        assert.equal(
            element.index,
            -1,
            'list with no selected children `index` initializes as `-1`');
      });

      test('single with selected child', async () => {
        const itemsTemplates =
            [listItem(), listItem({selected: true}), listItem()];
        fixt = await fixture(listTemplate({items: itemsTemplates}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = Array.from(element.querySelectorAll('mwc-list-item'));

        assert.equal(
            element.selected, items[1], 'second item is selected on startup');
        assert.equal(element.items.length, 3, 'list has three items');
        assert.equal(element.index, 1, 'second item is index');
      });

      test('single lazy', async () => {
        const itemsTemplates =
            [listItem(), listItem({selected: true}), listItem()];
        fixt = await fixture(listTemplate());
        element = fixt.root.querySelector('mwc-list')!;

        assert.equal(
            element.selected,
            null,
            'empty list `selected` initializes as `null`');
        assert.equal(
            element.items.length, 0, 'empty list `items` initializes as `[]`');
        assert.equal(
            element.index, -1, 'empty list `index` initializes as `-1`');

        fixt.template = listTemplate({items: itemsTemplates});

        await fixt.updateComplete;
        await element.updateComplete;
        const items = Array.from(element.querySelectorAll('mwc-list-item'));
        await items[2].updateComplete;

        assert.equal(
            element.selected,
            items[1],
            'second item is selected on lazy startup');
        assert.equal(
            element.items.length, 3, 'list has three items on lazy startup');
        assert.equal(element.index, 1, 'second item is index on lazy startup');
      });

      test('multi with unselected children', async () => {
        const itemsTemplates = [listItem(), listItem(), listItem()];
        fixt =
            await fixture(listTemplate({items: itemsTemplates, multi: true}));
        element = fixt.root.querySelector('mwc-list')!;

        const selected = element.selected as ListItem[];
        const index = element.index as Set<number>;

        assert.equal(selected.length, 0, '`selected` initializes as `[]`');
        assert.equal(
            element.items.length, 3, '`items` are enumerated correctly');
        assert.equal(
            index.size,
            0,
            'multi list with no selected children `index` initializes as empty set');
      });

      test('multi with selected children', async () => {
        let itemsTemplates = [
          listItem(),
          listItem({selected: true}),
          listItem(),
        ];
        fixt =
            await fixture(listTemplate({items: itemsTemplates, multi: true}));
        element = fixt.root.querySelector('mwc-list')!;
        let items = Array.from(element.querySelectorAll('mwc-list-item'));

        let selected = element.selected as ListItem[];
        let index = element.index as Set<number>;

        assert.equal(
            selected.length,
            1,
            '`selected` initializes as correctly with single preselection');
        assert.isTrue(
            selected.indexOf(items[1]) !== -1, 'selected value is correct');
        assert.equal(
            element.items.length, 3, '`items` are enumerated correctly');
        assert.equal(
            index.size,
            1,
            'multi list with selected child `index` initializes as correctly sized set');
        assert.isTrue(
            index.has(1), 'multi list with selected child `index` is correct');

        fixt.remove();

        itemsTemplates = [
          listItem({selected: true}),
          listItem(),
          listItem({selected: true}),
        ];
        fixt =
            await fixture(listTemplate({items: itemsTemplates, multi: true}));
        element = fixt.root.querySelector('mwc-list')!;
        items = Array.from(element.querySelectorAll('mwc-list-item'));

        selected = element.selected as ListItem[];
        index = element.index as Set<number>;

        assert.equal(
            selected.length,
            2,
            '`selected` initializes as correctly with multiple preselections');
        assert.isTrue(
            selected.indexOf(items[0]) !== -1, 'selected values are correct');
        assert.isTrue(
            selected.indexOf(items[2]) !== -1, 'selected values are correct');
        assert.equal(
            index.size,
            2,
            'multi list with selected child `index` initializes as correctly sized set');
        assert.isTrue(
            index.has(0),
            'multi list with selected children `index` is correct');
        assert.isTrue(
            index.has(2),
            'multi list with selected children `index` is correct');
      });

      test('multi lazy', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true}),
          listItem({selected: true})
        ];
        fixt = await fixture(listTemplate({multi: true}));
        element = fixt.root.querySelector('mwc-list')!;

        let selected = element.selected as ListItem[];
        let index = element.index as Set<number>;

        assert.equal(
            selected.length, 0, 'empty list `selected` initializes as `[]`');
        assert.equal(
            element.items.length, 0, 'empty list `items` initializes as `[]`');
        assert.equal(
            index.size, 0, 'empty list `index` initializes as empty set');

        fixt.template = listTemplate({multi: true, items: itemsTemplates});

        await fixt.updateComplete;
        await element.updateComplete;
        const items = Array.from(element.querySelectorAll('mwc-list-item'));
        await items[2].updateComplete;

        selected = element.selected as ListItem[];
        index = element.index as Set<number>;

        assert.equal(
            selected.length,
            2,
            'list has correct num of selections on lazy startup');
        assert.isTrue(
            selected.indexOf(items[1]) !== -1,
            'list selections correct on lazy startup');
        assert.isTrue(
            selected.indexOf(items[2]) !== -1,
            'list selections correct on lazy startup');
        assert.equal(
            element.items.length, 3, 'list has three items on lazy startup');
        assert.equal(
            index.size,
            2,
            'list has correct number of indices on lazy startup');
        assert.isTrue(index.has(1), 'indicies are correct on lazy startup');
        assert.isTrue(index.has(2), 'indicies are correct on lazy startup');
      });

      test('a11y roles are set', async () => {
        const itemsTemplate = [listItem(), dividerTempl, listItem()];
        fixt = await fixture(
            listTemplate({items: itemsTemplate, itemRoles: 'option'}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;
        const divider = element.querySelector('li')!;

        assert.equal(
            items[0].getAttribute('role'),
            'option',
            'item role propagates correctly');
        assert.equal(
            items[1].getAttribute('role'),
            'option',
            'item role propagates correctly');
        assert.equal(
            divider.getAttribute('role'),
            'separator',
            'divider role propagates correctly');
      });

      test('noninteractive', async () => {
        const itemsTemplate = [listItem(), listItem()];
        fixt = await fixture(
            listTemplate({items: itemsTemplate, noninteractive: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        assert.equal(
            items[0].tabIndex,
            -1,
            'noninteractive sets tabindex -1 on previously tabbable');
        assert.equal(
            items[1].tabIndex, -1, 'other items are still tabindex -1');

        element.noninteractive = false;
        await element.updateComplete;

        assert.equal(
            items[0].tabIndex,
            0,
            'previously tabbable element is now set to tabbable again');
        assert.equal(
            items[1].tabIndex, -1, 'other items are still tabindex -1');
      });

      teardown(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    suite('single', () => {
      test('click selection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[2].click();
        await items[2].updateComplete;
        await element.updateComplete;

        assert.isTrue(items[2].selected, 'third item is selected after click');
        assert.isTrue(
            items[2].activated, 'third item is activated after click');
        assert.isFalse(
            items[1].selected,
            'second item is deselected after other is clicked');
        assert.isFalse(
            items[1].activated,
            'second item is deactivated after other is clicked');
        assert.equal(element.index, 2, 'index is correct after click');
        assert.equal(
            element.selected, items[2], 'selected is correct after click');
      });

      test('no deselection on click', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[1].click();
        await items[1].updateComplete;
        await element.updateComplete;

        assert.isTrue(
            items[1].selected, 'second item stays selected after click');
        assert.isTrue(
            items[1].activated, 'second item stays activated after click');
        assert.equal(element.index, 1, 'index is correct after click');
        assert.equal(
            element.selected, items[1], 'selected is correct after click');
      });

      test('prop selection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[2].selected = true;
        await items[2].updateComplete;
        await element.updateComplete;

        assert.isTrue(
            items[2].selected, 'third item is selected after prop set');
        assert.isTrue(
            items[2].activated, 'third item is activated after prop set');
        assert.isFalse(
            items[1].selected,
            'second item is deselected after other is selected');
        assert.isFalse(
            items[1].activated,
            'second item is deactivated after other is selected');
        assert.equal(element.index, 2, 'index is correct after prop selection');
        assert.equal(
            element.selected,
            items[2],
            'selected is correct after prop selection');
      });

      test('prop deselection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[1].selected = false;
        await items[1].updateComplete;
        await element.updateComplete;

        assert.isFalse(
            items[1].selected,
            'second item is deselected after prop deselection');
        assert.isFalse(
            items[1].activated,
            'second item is deactivated after prop deselection');
        assert.equal(element.index, -1, 'index is set to -1 prop deselection');
        assert.equal(
            element.selected, null, 'selected is null prop deselection');
      });

      test('index selection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        element.select(2);
        await items[2].updateComplete;
        await element.updateComplete;

        assert.isTrue(
            items[2].selected, 'third item is selected after index selection');
        assert.isTrue(
            items[2].activated,
            'third item is activated after index selection');
        assert.isFalse(
            items[1].selected,
            'second item is deselected after other is selected');
        assert.isFalse(
            items[1].activated,
            'second item is deactivated after other is selected');
        assert.equal(
            element.index, 2, 'index is correct after index selection');
        assert.equal(
            element.selected,
            items[2],
            'selected is correct after index selection');
      });

      test('index deselection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        element.select(-1);
        await items[1].updateComplete;
        await element.updateComplete;

        assert.isFalse(
            items[1].selected,
            'second item is deselected after index deselection');
        assert.isFalse(
            items[1].activated,
            'second item is deactivated after index deselection');
        assert.equal(element.index, -1, 'index is set to -1 index deselection');
        assert.equal(
            element.selected, null, 'selected is null index deselection');
      });

      test('single to multi', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(listTemplate({items: itemsTemplates}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        assert.equal(element.index, 1, 'index is initially correct');
        assert.equal(
            element.selected, items[1], 'selected is initially correct');

        element.multi = true;
        await element.updateComplete;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        assert.equal(index.size, 1, 'only one item is in selected indices');
        assert.isTrue(index.has(1), 'index is correct');
        assert.equal(selected.length, 1, 'only one selected item');
        assert.equal(selected[0], items[1], 'selected is correct');
      });

      teardown(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    suite('multi', () => {
      test('click selection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(listTemplate(
            {multi: true, items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[2].click();
        await items[2].updateComplete;
        await element.updateComplete;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        assert.isTrue(items[2].selected, 'third item is selected after click');
        assert.isTrue(
            items[2].activated, 'third item is activated after click');
        assert.isTrue(
            items[1].selected,
            'second item is not deselected after other is clicked');
        assert.isTrue(
            items[1].activated,
            'second item is not deactivated after other is clicked');
        assert.equal(index.size, 2, 'correct amount of indices after click');
        assert.isTrue(index.has(1), 'index is correct after click');
        assert.isTrue(index.has(2), 'index is correct after click');
        assert.equal(
            selected.length, 2, 'correct number of selected after click');
        assert.isTrue(
            selected.indexOf(items[1]) !== -1,
            'selected is correct after click');
        assert.isTrue(
            selected.indexOf(items[2]) !== -1,
            'selected is correct after click');
      });

      test('deselection on click', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(listTemplate(
            {multi: true, items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[1].click();
        await items[1].updateComplete;
        await element.updateComplete;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        assert.isFalse(
            items[1].selected, 'second item is deselected after click');
        assert.isFalse(
            items[1].activated, 'second item is deactivated after click');
        assert.equal(index.size, 0, 'index is empty after click');
        assert.equal(selected.length, 0, 'nothing is selected after click');
      });

      test('prop selection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(listTemplate(
            {multi: true, items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[2].selected = true;
        await items[2].updateComplete;
        await element.updateComplete;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        assert.isTrue(
            items[2].selected, 'third item is selected after prop selection');
        assert.isTrue(
            items[2].activated, 'third item is activated after prop selection');
        assert.isTrue(
            items[1].selected,
            'second item is not deselected after other is selected');
        assert.isTrue(
            items[1].activated,
            'second item is not deactivated after other is selected');
        assert.equal(
            index.size, 2, 'correct amount of indices after prop selection');
        assert.isTrue(index.has(1), 'index is correct after prop selection');
        assert.isTrue(index.has(2), 'index is correct after prop selection');
        assert.equal(
            selected.length,
            2,
            'correct number of selected after prop selection');
        assert.isTrue(
            selected.indexOf(items[1]) !== -1,
            'selected is correct after prop selection');
        assert.isTrue(
            selected.indexOf(items[2]) !== -1,
            'selected is correct after prop selection');
      });

      test('prop deselection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(listTemplate(
            {multi: true, items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[1].selected = false;
        await items[1].updateComplete;
        await element.updateComplete;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        assert.isFalse(
            items[1].selected,
            'second item is deselected after prop deselection');
        assert.isFalse(
            items[1].activated,
            'second item is deactivated after prop deselection');
        assert.equal(index.size, 0, 'index is empty after prop deselection');
        assert.equal(
            selected.length, 0, 'nothing is selected after prop deselection');
      });

      test('index selection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(listTemplate(
            {multi: true, items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        element.select(new Set([0, 2]));
        await items[2].updateComplete;
        await element.updateComplete;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        assert.isTrue(
            items[0].selected, 'first item is selected after index selection');
        assert.isTrue(
            items[0].activated,
            'first item is activated after index selection');
        assert.isTrue(
            items[2].selected, 'third item is selected after index selection');
        assert.isTrue(
            items[2].activated,
            'third item is activated after index selection');
        assert.isFalse(
            items[1].selected,
            'second item deselected after others are selected');
        assert.isFalse(
            items[1].activated,
            'second item deactivated after others are selected');
        assert.equal(
            index.size, 2, 'correct amount of indices after index selection');
        assert.isTrue(index.has(0), 'index is correct after index selection');
        assert.isTrue(index.has(2), 'index is correct after index selection');
        assert.equal(
            selected.length,
            2,
            'correct number of selected after index selection');
        assert.isTrue(
            selected.indexOf(items[0]) !== -1,
            'selected is correct after index selection');
        assert.isTrue(
            selected.indexOf(items[2]) !== -1,
            'selected is correct after index selection');
      });

      test('index deselection', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem()
        ];
        fixt = await fixture(listTemplate(
            {multi: true, items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        element.select(new Set());
        await items[1].updateComplete;
        await element.updateComplete;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        assert.isFalse(
            items[1].selected,
            'second item is deselected after index deselection');
        assert.isFalse(
            items[1].activated,
            'second item is deactivated after index deselection');
        assert.equal(index.size, 0, 'index is empty after index deselection');
        assert.equal(
            selected.length, 0, 'nothing is selected after index deselection');
      });

      test('multi to single', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true}),
          listItem({selected: true})
        ];
        fixt =
            await fixture(listTemplate({multi: true, items: itemsTemplates}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        assert.equal(index.size, 2, 'two items are in selected indices');
        assert.isTrue(index.has(1), 'index is correct');
        assert.isTrue(index.has(2), 'index is correct');
        assert.equal(selected.length, 2, 'two selected items');
        assert.isTrue(selected.indexOf(items[1]) !== -1, 'selected is correct');
        assert.isTrue(selected.indexOf(items[2]) !== -1, 'selected is correct');

        element.multi = false;
        await element.updateComplete;

        assert.equal(element.index, 1, 'index is now only the first item');
        assert.equal(element.selected, items[1], 'element is selected');
      });

      teardown(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });
  });
});
