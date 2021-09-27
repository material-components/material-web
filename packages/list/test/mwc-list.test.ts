/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// Style preference for leading underscores.
// tslint:disable:strip-private-property-underscore


import '@material/mwc-icon';

import {isNodeElement} from '@material/mwc-base/utils';
import {IndexDiff, List, SelectedDetail} from '@material/mwc-list';
import {CheckListItem} from '@material/mwc-list/mwc-check-list-item';
import {GraphicType, ListItem, RequestSelectedDetail} from '@material/mwc-list/mwc-list-item';
import {ListItemBase} from '@material/mwc-list/mwc-list-item-base';
import {RadioListItem} from '@material/mwc-list/mwc-radio-list-item';
import {isIndexSet} from '@material/mwc-menu';
import {html, TemplateResult} from 'lit';
import {ifDefined} from 'lit/directives/if-defined.js';

import {fixture, TestFixture} from '../../../test/src/util/helpers';

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

const asssertDiffsEqual = (first: IndexDiff, second: IndexDiff) => {
  const firstAddedArray = first.added.sort((a, b) => {
    return a - b;
  });
  const firstRemovedArray = first.removed.sort((a, b) => {
    return a - b;
  });

  const secondAddedArray = second.added.sort((a, b) => {
    return a - b;
  });
  const secondRemovedArray = second.removed.sort((a, b) => {
    return a - b;
  });

  expect(firstAddedArray.length)
      .withContext('added diffs different length')
      .toEqual(secondAddedArray.length);
  expect(firstRemovedArray.length)
      .withContext('removed diffs different length')
      .toEqual(secondRemovedArray.length);

  for (let i = 0; i < firstAddedArray.length; i++) {
    expect(firstAddedArray[i])
        .withContext('added diffs different values')
        .toEqual(secondAddedArray[i]);
  }

  for (let i = 0; i < firstRemovedArray.length; i++) {
    expect(firstRemovedArray[i])
        .withContext('removed diffs different values')
        .toEqual(secondRemovedArray[i]);
  }
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

const createEmptyList = (emptyMessage: string|undefined) => {
  return html`
    <mwc-list emptyMessage="${ifDefined(emptyMessage)}"></mwc-list>
  `;
};

describe('mwc-list:', () => {
  let fixt: TestFixture|null;

  describe('mwc-list-item', () => {
    describe('initialization', () => {
      let element: ListItem;

      it('initializes as an mwc-list-item', async () => {
        fixt = await fixture(listItem());
        element = fixt.root.querySelector('mwc-list-item')!;
        expect(element).toBeInstanceOf(ListItem);
        expect(element).toBeInstanceOf(ListItemBase);
      });

      it('sets attribute on connection', async () => {
        fixt = await fixture(listItem());
        element = fixt.root.querySelector('mwc-list-item')!;

        expect(element.hasAttribute('mwc-list-item')).toBeTrue();
      });

      it('noninteractive does not set attribute on connection', async () => {
        fixt = await fixture(listItem({noninteractive: true}));
        element = fixt.root.querySelector('mwc-list-item')!;

        expect(element.hasAttribute('mwc-list-item')).toBeFalse();
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    describe('variants', () => {
      let element: ListItem;

      it('single line renders correctly', async () => {
        fixt = await fixture(listItem({
          primary: html`<span class="primary">Apple</span>`,
          secondary: html`<span slot="secondary">This is a Fruit</span>`,
          graphicSlot: html`<mwc-icon slot="graphic">done</mwc-icon>`,
          meta: html`<mwc-icon slot="meta">code</mwc-icon>`,
        }));
        element = fixt.root.querySelector('mwc-list-item')!;

        const root = (element.shadowRoot as ShadowRoot);
        const mdcRoot = root.querySelector('.mdc-deprecated-list-item__text') as
            HTMLElement;
        const defaultSlot =
            root.querySelector('slot:not([name])') as HTMLSlotElement;
        const primaryTextWrapper =
            root.querySelector('.mdc-deprecated-list-item__primaray-text');
        const secondaryTextWrapper =
            root.querySelector('.mdc-deprecated-list-item__secondary-text');
        const metaWrapper =
            root.querySelector('.mdc-deprecated-list-item__meta');
        const graphicWrapper =
            root.querySelector('.mdc-deprecated-list-item__graphic');

        expect(defaultSlot)
            .withContext('default slot exists with no wrapper')
            .toBeTruthy();
        expect(defaultSlot.parentNode)
            .withContext('default slot exists with no wrapper')
            .toEqual(mdcRoot);
        expect(primaryTextWrapper)
            .withContext('no primary-text wrapper (only two line)')
            .toEqual(null);
        expect(secondaryTextWrapper)
            .withContext('no secondary-text wrapper (only two line)')
            .toEqual(null);
        expect(metaWrapper)
            .withContext('no meta wrapper (only two line)')
            .toEqual(null);
        expect(graphicWrapper)
            .withContext('no graphic wrapper (only two line)')
            .toEqual(null);

        const primaryTextElement = element.querySelector('.primary') as Element;
        const projectedElements =
            defaultSlot.assignedNodes({flatten: true}).filter(isNodeElement);

        expect(projectedElements.length)
            .withContext('there is only one projected element')
            .toEqual(1);
        expect(primaryTextElement)
            .withContext('primary text is projected')
            .toEqual(projectedElements[0]);
      });

      it('two line renders correctly', async () => {
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
            root.querySelector('.mdc-deprecated-list-item__primary-text') as
            HTMLElement;
        const secondaryTextSlot =
            root.querySelector('slot[name="secondary"]') as HTMLSlotElement;
        const metaWrapper =
            root.querySelector('.mdc-deprecated-list-item__meta');
        const graphicWrapper =
            root.querySelector('.mdc-deprecated-list-item__graphic');

        expect(defaultSlot).withContext('default slot exists').toBeTruthy();
        expect(primaryTextWrapper)
            .withContext('primary text slot wrapper exists')
            .toBeTruthy();
        expect(defaultSlot.parentNode)
            .withContext('primary text slot exists')
            .toEqual(primaryTextWrapper);

        expect(secondaryTextSlot)
            .withContext('secondary text slot exists')
            .toBeTruthy();
        expect(metaWrapper)
            .withContext('no meta wrapper (only two line)')
            .toEqual(null);
        expect(graphicWrapper)
            .withContext('no graphic wrapper (only two line)')
            .toEqual(null);

        const primaryTextElement = element.querySelector('.primary') as Element;
        const secondaryTextElement =
            element.querySelector('[slot="secondary"]') as Element;
        const primaryProjEls =
            defaultSlot.assignedNodes({flatten: true}).filter(isNodeElement);
        const secondaryProjEls =
            secondaryTextSlot.assignedNodes({flatten: true})
                .filter(isNodeElement);

        expect(primaryProjEls.length)
            .withContext('there is only one projected primary text element')
            .toEqual(1);
        expect(primaryTextElement)
            .withContext('primary text is projected')
            .toEqual(primaryProjEls[0]);
        expect(secondaryProjEls.length)
            .withContext('there is only one projected secondary text element')
            .toEqual(1);
        expect(secondaryTextElement)
            .withContext('secondary text is projected')
            .toEqual(secondaryProjEls[0]);
      });

      it('meta renders correctly', async () => {
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
        const mdcRoot = root.querySelector('.mdc-deprecated-list-item__text') as
            HTMLElement;
        const defaultSlot =
            root.querySelector('slot:not([name])') as HTMLSlotElement;
        const primaryTextWrapper =
            root.querySelector('.mdc-deprecated-list-item__primaray-text');
        const secondaryTextWrapper =
            root.querySelector('.mdc-deprecated-list-item__secondary-text');
        const metaWrapper =
            root.querySelector('.mdc-deprecated-list-item__meta');
        const metaSlot =
            root.querySelector('slot[name="meta"]') as HTMLSlotElement;
        const graphicWrapper =
            root.querySelector('.mdc-deprecated-list-item__graphic');

        expect(defaultSlot)
            .withContext('default slot exists with no wrapper')
            .toBeTruthy();
        expect(defaultSlot.parentNode)
            .withContext('default slot exists with no wrapper')
            .toEqual(mdcRoot);
        expect(primaryTextWrapper)
            .withContext('no primary-text wrapper (only two line)')
            .toEqual(null);
        expect(secondaryTextWrapper)
            .withContext('no secondary-text wrapper (only two line)')
            .toEqual(null);
        expect(metaWrapper).withContext('meta wrapper exists').toBeTruthy();
        expect(metaSlot).withContext('meta slot exists').toBeTruthy();
        expect(graphicWrapper)
            .withContext('no graphic wrapper (only two line)')
            .toEqual(null);

        const metaElement = element.querySelector('[slot="meta"]') as Element;
        const projectedElements =
            metaSlot.assignedNodes({flatten: true}).filter(isNodeElement);

        expect(projectedElements.length)
            .withContext('there is only one projected element')
            .toEqual(1);
        expect(metaElement)
            .withContext('meta icon is projected')
            .toEqual(projectedElements[0]);
      });

      it('graphic renders correctly', async () => {
        fixt = await fixture(listItem({
          primary: html`<span class="primary">Apple</span>`,
          secondary: html`<span slot="secondary">This is a Fruit</span>`,
          graphicSlot: html`<mwc-icon slot="graphic">done</mwc-icon>`,
          meta: html`<mwc-icon slot="meta">code</mwc-icon>`,
          graphic: 'icon',
        }));
        element = fixt.root.querySelector('mwc-list-item')!;

        const root = (element.shadowRoot as ShadowRoot);
        const mdcRoot = root.querySelector('.mdc-deprecated-list-item__text') as
            HTMLElement;
        const defaultSlot =
            root.querySelector('slot:not([name])') as HTMLSlotElement;
        const primaryTextWrapper =
            root.querySelector('.mdc-deprecated-list-item__primaray-text');
        const secondaryTextWrapper =
            root.querySelector('.mdc-deprecated-list-item__secondary-text');
        const metaWrapper =
            root.querySelector('.mdc-deprecated-list-item__meta');
        const graphicWrapper =
            root.querySelector('.mdc-deprecated-list-item__graphic');
        const graphicSlot =
            root.querySelector('slot[name="graphic"]') as HTMLSlotElement;

        expect(defaultSlot)
            .withContext('default slot exists with no wrapper')
            .toBeTruthy();
        expect(defaultSlot.parentNode)
            .withContext('default slot exists with no wrapper')
            .toEqual(mdcRoot);
        expect(primaryTextWrapper)
            .withContext('no primary-text wrapper (only two line)')
            .toEqual(null);
        expect(secondaryTextWrapper)
            .withContext('no secondary-text wrapper (only two line)')
            .toEqual(null);
        expect(metaWrapper).withContext('meta wrapper exists').toEqual(null);
        expect(graphicWrapper)
            .withContext('no graphic wrapper (only two line)')
            .not.toEqual(null);
        expect(graphicSlot).withContext('graphic slot exists').toBeTruthy();

        const graphicElement =
            element.querySelector('[slot="graphic"]') as Element;
        const projectedElements =
            graphicSlot.assignedNodes({flatten: true}).filter(isNodeElement);

        expect(projectedElements.length)
            .withContext('there is only one projected element')
            .toEqual(1);
        expect(graphicElement)
            .withContext('meta icon is projected')
            .toEqual(projectedElements[0]);
      });

      it('noninteractive removes props and attrs on bootup', async () => {
        fixt = await fixture(listItem({
          noninteractive: true,
          selected: true,
          activated: true,
        }));
        element = fixt.root.querySelector('mwc-list-item')!;

        expect(element.noninteractive)
            .withContext('is noninteractive')
            .toBeTrue();
        expect(element.activated)
            .withContext('removes activated on boot up')
            .toBeFalse();
        expect(element.selected)
            .withContext('removes selected on boot up')
            .toBeFalse();
        expect(element.hasAttribute('mwc-list-item'))
            .withContext('removes selectability on boot up')
            .toBeFalse();
      });

      it('noninteractive +/- props and attrs on change', async () => {
        fixt = await fixture(listItem({
          noninteractive: false,
          selected: true,
          activated: true,
        }));
        element = fixt.root.querySelector('mwc-list-item')!;

        expect(element.noninteractive)
            .withContext('is interactive')
            .toBeFalse();
        expect(element.activated)
            .withContext('activated on boot up')
            .toBeTrue();
        expect(element.selected).withContext('selected on boot up').toBeTrue();
        expect(element.hasAttribute('mwc-list-item'))
            .withContext('selectability on boot up')
            .toBeTrue();

        element.noninteractive = true;
        await element.updateComplete;

        expect(element.noninteractive)
            .withContext('is noninteractive')
            .toBeTrue();
        expect(element.activated)
            .withContext('removes activated on prop change')
            .toBeFalse();
        expect(element.selected)
            .withContext('removes selected on prop change')
            .toBeFalse();
        expect(element.hasAttribute('mwc-list-item'))
            .withContext('removes selectability on prop change')
            .toBeFalse();

        element.noninteractive = false;
        await element.updateComplete;

        expect(element.noninteractive)
            .withContext('is interactive')
            .toBeFalse();
        expect(element.activated)
            .withContext('does not add activated on prop change')
            .toBeFalse();
        expect(element.selected)
            .withContext('does not add selected on prop change')
            .toBeFalse();
        expect(element.hasAttribute('mwc-list-item'))
            .withContext('adds selectability on prop change')
            .toBeTrue();
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    describe('interaction', () => {
      let element: ListItem;

      it('rendered event fires', async () => {
        let numRenderCalls = 0;
        fixt = await fixture(listItem({
          onListItemRendered: () => numRenderCalls++,
        }));

        expect(numRenderCalls)
            .withContext('list-item-rendered called only once on bootup')
            .toEqual(1);
      });

      it('request selected event', async () => {
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

        expect(element.selected)
            .withContext('element is not selected')
            .toBeFalse();
        expect(numReqSelectedCalls)
            .withContext('request-selected not called on bootup')
            .toEqual(0);

        element.click();
        expect(numReqSelectedCalls)
            .withContext(
                'request-selected not called on click on noninteractive')
            .toEqual(0);

        element.selected = true;
        await element.updateComplete;

        expect(element.selected).withContext('element is selected').toBeTrue();
        expect(numReqSelectedCalls)
            .withContext(
                'request-selected not called on noninteractive selected prop')
            .toEqual(0);

        element.noninteractive = false;
        await element.updateComplete;

        element.click();
        expect(numReqSelectedCalls)
            .withContext('request-selected called on click')
            .toEqual(1);
        numReqSelectedCalls = 0;
        expect(lastReqSelectedEv.detail.source)
            .withContext('interaction event on click')
            .toEqual('interaction');
        expect(lastReqSelectedEv.detail.selected)
            .withContext('click ev has selected opposite of state')
            .not.toEqual(element.selected);

        await element.updateComplete;

        expect(element.selected)
            .withContext('element does not change selected on click')
            .toBeTrue();

        element.selected = false;
        await element.updateComplete;

        expect(element.selected)
            .withContext('element is not selected')
            .toBeFalse();
        expect(numReqSelectedCalls)
            .withContext('request-selected called on selected prop')
            .toEqual(1);
        numReqSelectedCalls = 0;
        expect(lastReqSelectedEv.detail.source)
            .withContext('property event on click')
            .toEqual('property');
        expect(lastReqSelectedEv.detail.selected)
            .withContext(
                'property request selected ev requests for the same as selected state')
            .toEqual(element.selected);
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });
  });

  describe('mwc-check-list-item', () => {
    describe('initialization', () => {
      let element: CheckListItem;

      it('initializes as an mwc-check-list-item', async () => {
        fixt = await fixture(checkListItem());
        element = fixt.root.querySelector('mwc-check-list-item')!;
        expect(element)
            .withContext('is checklsit item')
            .toBeInstanceOf(CheckListItem);
        expect(element)
            .withContext('inherits base')
            .toBeInstanceOf(ListItemBase);
      });

      it('sets attribute on connection', async () => {
        fixt = await fixture(checkListItem());
        element = fixt.root.querySelector('mwc-check-list-item')!;

        expect(element.hasAttribute('mwc-list-item')).toBeTrue();
      });

      it('left functions as intended', async () => {
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

        expect(first)
            .withContext('checkbox is first when left')
            .toEqual(checkbox);
        expect(second).withContext('slot is second when left').toEqual(slot);

        element.left = false;
        await element.updateComplete;

        // technically a new node must be queried again
        slot = element.shadowRoot!.querySelector('slot')!;

        childrenColl = element.shadowRoot!.children;
        children = Array.from(childrenColl).filter(isNodeElement);
        first = children[0].firstElementChild;
        second = children[1].firstElementChild;

        expect(first).withContext('slot is first when not left').toEqual(slot);
        expect(second)
            .withContext('checkbox is second when not left')
            .toEqual(checkbox);
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    describe('interaction', () => {
      let element: CheckListItem;

      it('request selected event', async () => {
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
        expect(numReqSelectedCalls)
            .withContext('request-selected called on click')
            .toEqual(1);
        numReqSelectedCalls = 0;
        expect(lastReqSelectedEv.detail.source)
            .withContext('interaction event on click')
            .toEqual('interaction');
        expect(lastReqSelectedEv.detail.selected)
            .withContext('click ev has selected opposite of state')
            .not.toEqual(element.selected);

        await element.updateComplete;

        expect(element.selected)
            .withContext('element does not change selected on click')
            .toBeFalse();

        element.selected = true;
        await element.updateComplete;
        await checkbox.updateComplete;

        expect(element.selected)
            .withContext('element is selected on prop')
            .toBeTrue();
        expect(checkbox.checked)
            .withContext('checkbox mirrors element selection state on prop')
            .toBeTrue();
        expect(numReqSelectedCalls)
            .withContext('request-selected called on selected prop')
            .toEqual(1);
        numReqSelectedCalls = 0;
        expect(lastReqSelectedEv.detail.source)
            .withContext('property event on click')
            .toEqual('property');
        expect(lastReqSelectedEv.detail.selected)
            .withContext(
                'property request selected ev requests for the same as selected state')
            .toEqual(element.selected);

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
          expect(element.selected)
              .withContext('element is deselected on checkbox click')
              .toBeFalse();
          expect(element.selected)
              .withContext('checkbox mirrors element selection state on prop')
              .toEqual(checkbox.checked);
          expect(numReqSelectedCalls)
              .withContext('request-selected called on checkbox click')
              .toEqual(1);
          numReqSelectedCalls = 0;
          expect(lastReqSelectedEv.detail.source)
              .withContext('interaction event on checkbox click')
              .toEqual('interaction');
        }
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });
  });

  describe('mwc-radio-list-item', () => {
    describe('mwc-radio-list-item: initialization', () => {
      let element: RadioListItem;

      it('initializes as an mwc-radio-list-item', async () => {
        fixt = await fixture(radioListItem());
        element = fixt.root.querySelector('mwc-radio-list-item')!;
        expect(element)
            .withContext('is checklsit item')
            .toBeInstanceOf(RadioListItem);
        expect(element)
            .withContext('inherits base')
            .toBeInstanceOf(ListItemBase);
      });

      it('sets attribute on connection', async () => {
        fixt = await fixture(radioListItem());
        element = fixt.root.querySelector('mwc-radio-list-item')!;

        expect(element.hasAttribute('mwc-list-item')).toBeTrue();
      });

      it('left functions as intended', async () => {
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

        expect(first)
            .withContext('checkbox is first when left')
            .toEqual(checkbox);
        expect(second).withContext('slot is second when left').toEqual(slot);

        element.left = false;
        await element.updateComplete;

        // technically a new node must be queried again
        slot = element.shadowRoot!.querySelector('slot')!;

        childrenColl = element.shadowRoot!.children;
        children = Array.from(childrenColl).filter(isNodeElement);
        first = children[0].firstElementChild;
        second = children[1].firstElementChild;

        expect(first).withContext('slot is first when not left').toEqual(slot);
        expect(second)
            .withContext('checkbox is second when not left')
            .toEqual(checkbox);
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    describe('mwc-radio-list-item: interaction', () => {
      let firstElement: RadioListItem;
      let secondElement: RadioListItem;

      it('request selected event', async () => {
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

        expect(reqSelectedEvts.length)
            .withContext('request-selected called on click of first')
            .toEqual(1);
        expect(reqSelectedEvts[0].detail.source)
            .withContext('interaction event on click')
            .toEqual('interaction');
        expect(reqSelectedEvts[0].detail.selected)
            .withContext('click ev has selected opposite of state')
            .not.toEqual(firstElement.selected);
        reqSelectedEvts = [];

        expect(firstElement.selected)
            .withContext('element does not change selected on click')
            .toBeFalse();

        firstElement.selected = true;

        await firstElement.updateComplete;
        await secondElement.updateComplete;
        await firstRadio.updateComplete;
        await secondRadio.updateComplete;

        expect(firstElement.selected)
            .withContext('first element is not selected when set with prop')
            .toBeTrue();
        expect(firstRadio.checked)
            .withContext('radio mirrors element selection state on prop')
            .toEqual(firstElement.selected);
        expect(secondElement.selected)
            .withContext(
                'second element is deselected on first element prop set')
            .not.toEqual(firstElement.selected);
        expect(secondRadio.checked)
            .withContext('radio mirrors element selection state on prop')
            .toEqual(secondElement.selected);
        expect(reqSelectedEvts.length)
            .withContext('request-selected called on selected prop, prop set')
            .toEqual(1);
        expect(reqSelectedEvts[0].detail.source)
            .withContext('property event on click')
            .toEqual('property');
        expect(reqSelectedEvts[0].detail.selected)
            .withContext(
                'property request selected ev requests for the same as selected state')
            .toEqual(firstElement.selected);
        reqSelectedEvts = [];

        secondElement.selected = true;

        await firstElement.updateComplete;
        await secondElement.updateComplete;
        await firstRadio.updateComplete;
        await secondRadio.updateComplete;

        expect(secondElement.selected)
            .withContext('second element is not selected when set with prop')
            .toBeTrue();
        expect(secondRadio.checked)
            .withContext('radio mirrors element selection state on prop')
            .toEqual(secondElement.selected);
        expect(secondElement.selected)
            .withContext(
                'first element is deselected on first element prop set')
            .not.toEqual(firstElement.selected);
        expect(firstRadio.checked)
            .withContext('radio mirrors element selection state on prop')
            .toEqual(firstElement.selected);
        expect(reqSelectedEvts.length)
            .withContext('radio mirrors element selection state on prop')
            .toEqual(2);
        expect(reqSelectedEvts[0].detail.source)
            .withContext('property event on click')
            .toEqual('property');
        expect(reqSelectedEvts[0].detail.selected)
            .withContext(
                'property request selected ev requests for the same as selected state')
            .toEqual(secondElement.selected);
        expect(reqSelectedEvts[1].detail.source)
            .withContext(
                'interaction event on radio deselection on first prop set')
            .toEqual('interaction');
        reqSelectedEvts = [];

        firstRadio.click();

        await firstRadio.updateComplete;
        await firstElement.updateComplete;
        await secondRadio.updateComplete;
        await secondElement.updateComplete;

        expect(firstElement.selected)
            .withContext('first element is selected on radio click')
            .toBeTrue();
        expect(firstRadio.checked)
            .withContext('radio mirrors element selection state on click')
            .toEqual(firstElement.selected);
        expect(firstElement.selected)
            .withContext('element is deselected on radio click')
            .not.toEqual(secondElement.selected);
        expect(firstRadio.checked)
            .withContext('radio mirrors element selection state on interaction')
            .toEqual(firstElement.selected);
        expect(reqSelectedEvts.length)
            .withContext('request-selected called on radio click')
            .toEqual(2);
        expect(reqSelectedEvts[0].detail.source)
            .withContext('interaction event on radio click')
            .toEqual('interaction');
        expect(reqSelectedEvts[1].detail.source)
            .withContext('interaction event on radio click')
            .toEqual('interaction');
        reqSelectedEvts = [];
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });
  });


  describe('mwc-list', () => {
    let element: List;

    describe('initialization', () => {
      it('initializes as an mwc-list', async () => {
        fixt = await fixture(listTemplate());
        element = fixt.root.querySelector('mwc-list')!;
        expect(element).toBeInstanceOf(List);
      });

      it('with no children', async () => {
        fixt = await fixture(listTemplate());
        element = fixt.root.querySelector('mwc-list')!;

        expect(element.selected)
            .withContext('empty list `selected` initializes as `null`')
            .toEqual(null);
        expect(element.items.length)
            .withContext('empty list `items` initializes as `[]`')
            .toEqual(0);
        expect(element.index)
            .withContext('empty list `index` initializes as `-1`')
            .toEqual(-1);

        element.multi = true;
        await element.updateComplete;

        const selected = element.selected as ListItem[];

        expect(selected.length)
            .withContext('empty multi list `selected` initializes as `[]`')
            .toEqual(0);
        expect(element.items.length)
            .withContext('empty multi list `items` initializes as `[]`')
            .toEqual(0);

        const index = element.index as Set<number>;
        expect(isIndexSet(index))
            .withContext('empty multi list `index` initializes as a Set')
            .toBeTrue();
        expect(index.size)
            .withContext('empty multi list `index` Set is empty')
            .toEqual(0);

        element.multi = false;
        await element.updateComplete;

        expect(element.selected)
            .withContext('multi -> not list `selected` initializes as `null`')
            .toEqual(null);
        expect(element.items.length)
            .withContext('multi -> not list `items` initializes as `[]`')
            .toEqual(0);
        expect(element.index)
            .withContext('multi -> not list `index` initializes as `-1`')
            .toEqual(-1);
      });

      it('single with unselected children', async () => {
        const itemsTemplates = [listItem(), listItem(), listItem()];
        fixt = await fixture(listTemplate({items: itemsTemplates}));
        element = fixt.root.querySelector('mwc-list')!;

        expect(element.selected)
            .withContext('`selected` initializes as `null`')
            .toEqual(null);
        expect(element.items[0].tabIndex)
            .withContext('tabindex set to 0 on first')
            .toEqual(0);
        expect(element.items[1].tabIndex)
            .withContext('tabindex on others -1')
            .toEqual(-1);
        expect(element.items[2].tabIndex)
            .withContext('tabindex on others -1')
            .toEqual(-1);
        expect(element.items.length)
            .withContext('`items` are enumerated correctly')
            .toEqual(3);
        expect(element.index)
            .withContext(
                'list with no selected children `index` initializes as `-1`')
            .toEqual(-1);
      });

      it('single with selected child', async () => {
        const itemsTemplates =
            [listItem(), listItem({selected: true}), listItem()];
        fixt = await fixture(listTemplate({items: itemsTemplates}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = Array.from(element.querySelectorAll('mwc-list-item'));

        expect(element.selected)
            .withContext('second item is selected on startup')
            .toEqual(items[1]);
        expect(element.items.length)
            .withContext('list has three items')
            .toEqual(3);
        expect(element.index).withContext('second item is index').toEqual(1);
      });

      it('single lazy', async () => {
        const itemsTemplates =
            [listItem(), listItem({selected: true}), listItem()];
        fixt = await fixture(listTemplate());
        element = fixt.root.querySelector('mwc-list')!;

        expect(element.selected)
            .withContext('empty list `selected` initializes as `null`')
            .toEqual(null);
        expect(element.items.length)
            .withContext('empty list `items` initializes as `[]`')
            .toEqual(0);
        expect(element.index)
            .withContext('empty list `index` initializes as `-1`')
            .toEqual(-1);

        fixt.template = listTemplate({items: itemsTemplates});

        await fixt.updateComplete;
        await element.updateComplete;
        const items = Array.from(element.querySelectorAll('mwc-list-item'));
        await items[2].updateComplete;

        expect(element.selected)
            .withContext('second item is selected on lazy startup')
            .toEqual(items[1]);
        expect(element.items.length)
            .withContext('list has three items on lazy startup')
            .toEqual(3);
        expect(element.index)
            .withContext('second item is index on lazy startup')
            .toEqual(1);
      });

      it('multi with unselected children', async () => {
        const itemsTemplates = [listItem(), listItem(), listItem()];
        fixt =
            await fixture(listTemplate({items: itemsTemplates, multi: true}));
        element = fixt.root.querySelector('mwc-list')!;

        const selected = element.selected as ListItem[];
        const index = element.index as Set<number>;

        expect(selected.length)
            .withContext('`selected` initializes as `[]`')
            .toEqual(0);
        expect(element.items.length)
            .withContext('`items` are enumerated correctly')
            .toEqual(3);
        expect(index.size)
            .withContext(
                'multi list with no selected children `index` initializes as empty set')
            .toEqual(0);
      });

      it('multi with selected children', async () => {
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

        expect(selected.length)
            .withContext(
                '`selected` initializes as correctly with single preselection')
            .toEqual(
                1,
            );
        expect(selected.indexOf(items[1]) !== -1)
            .withContext('selected value is correct')
            .toBeTrue();
        expect(element.items.length)
            .withContext('`items` are enumerated correctly')
            .toEqual(3);
        expect(index.size)
            .withContext(
                'multi list with selected child `index` initializes as correctly sized set')
            .toEqual(1);
        expect(index.has(1))
            .withContext('multi list with selected child `index` is correct')
            .toBeTrue();

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

        expect(selected.length)
            .withContext(
                '`selected` initializes as correctly with multiple preselections')
            .toEqual(2);
        expect(selected.indexOf(items[0]) !== -1)
            .withContext('selected values are correct')
            .toBeTrue();
        expect(selected.indexOf(items[2]) !== -1)
            .withContext('selected values are correct')
            .toBeTrue();
        expect(index.size)
            .withContext(
                'multi list with selected child `index` initializes as correctly sized set')
            .toEqual(
                2,
            );
        expect(index.has(0))
            .withContext('multi list with selected children `index` is correct')
            .toBeTrue();
        expect(index.has(2))
            .withContext('multi list with selected children `index` is correct')
            .toBeTrue();
      });

      it('multi lazy', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true}), listItem({selected: true})
        ];
        fixt = await fixture(listTemplate({multi: true}));
        element = fixt.root.querySelector('mwc-list')!;

        let selected = element.selected as ListItem[];
        let index = element.index as Set<number>;

        expect(selected.length)
            .withContext('empty list `selected` initializes as `[]`')
            .toEqual(0);
        expect(element.items.length)
            .withContext('empty list `items` initializes as `[]`')
            .toEqual(0);
        expect(index.size)
            .withContext('empty list `index` initializes as empty set')
            .toEqual(0);

        fixt.template = listTemplate({multi: true, items: itemsTemplates});

        await fixt.updateComplete;
        await element.updateComplete;
        const items = Array.from(element.querySelectorAll('mwc-list-item'));
        await items[2].updateComplete;

        selected = element.selected as ListItem[];
        index = element.index as Set<number>;

        expect(selected.length)
            .withContext('list has correct num of selections on lazy startup')
            .toEqual(2);
        expect(selected.indexOf(items[1]) !== -1)
            .withContext('list selections correct on lazy startup')
            .toBeTrue();
        expect(selected.indexOf(items[2]) !== -1)
            .withContext('list selections correct on lazy startup')
            .toBeTrue();
        expect(element.items.length)
            .withContext('list has three items on lazy startup')
            .toEqual(3);
        expect(index.size)
            .withContext('list has correct number of indices on lazy startup')
            .toEqual(2);
        expect(index.has(1))
            .withContext('indicies are correct on lazy startup')
            .toBeTrue();
        expect(index.has(2))
            .withContext('indicies are correct on lazy startup')
            .toBeTrue();
      });

      it('a11y roles are set', async () => {
        const itemsTemplate = [listItem(), dividerTempl, listItem()];
        fixt = await fixture(
            listTemplate({items: itemsTemplate, itemRoles: 'option'}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;
        const divider = element.querySelector('li')!;

        expect(items[0].getAttribute('role'))
            .withContext('item role propagates correctly')
            .toEqual('option');
        expect(items[1].getAttribute('role'))
            .withContext('item role propagates correctly')
            .toEqual('option');
        expect(divider.getAttribute('role'))
            .withContext('divider role propagates correctly')
            .toEqual('separator');
      });

      it('noninteractive', async () => {
        const itemsTemplate = [listItem(), listItem()];
        fixt = await fixture(
            listTemplate({items: itemsTemplate, noninteractive: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        expect(items[0].tabIndex)
            .withContext(
                'noninteractive sets tabindex -1 on previously tabbable')
            .toEqual(-1);
        expect(items[1].tabIndex)
            .withContext('other items are still tabindex -1')
            .toEqual(-1);

        element.noninteractive = false;
        await element.updateComplete;

        expect(items[0].tabIndex)
            .withContext(
                'previously tabbable element is now set to tabbable again')
            .toEqual(0);
        expect(items[1].tabIndex)
            .withContext('other items are still tabindex -1')
            .toEqual(-1);
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    describe('single', () => {
      it('click selection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[2].click();
        await items[2].updateComplete;
        await element.updateComplete;

        expect(items[2].selected)
            .withContext('third item is selected after click')
            .toBeTrue();
        expect(items[2].activated)
            .withContext('third item is activated after click')
            .toBeTrue();
        expect(items[1].selected)
            .withContext('second item is deselected after other is clicked')
            .toBeFalse();
        expect(items[1].activated)
            .withContext('second item is deactivated after other is clicked')
            .toBeFalse();
        expect(element.index)
            .withContext('index is correct after click')
            .toEqual(2);
        expect(element.selected)
            .withContext('selected is correct after click')
            .toEqual(items[2]);
      });

      it('no deselection on click', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[1].click();
        await items[1].updateComplete;
        await element.updateComplete;

        expect(items[1].selected)
            .withContext('second item stays selected after click')
            .toBeTrue();
        expect(items[1].activated)
            .withContext('second item stays activated after click')
            .toBeTrue();
        expect(element.index)
            .withContext('index is correct after click')
            .toEqual(1);
        expect(element.selected)
            .withContext('selected is correct after click')
            .toEqual(items[1]);
      });

      it('prop selection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[2].selected = true;
        await items[2].updateComplete;
        await element.updateComplete;

        expect(items[2].selected)
            .withContext('third item is selected after prop set')
            .toBeTrue();
        expect(items[2].activated)
            .withContext('third item is activated after prop set')
            .toBeTrue();
        expect(items[1].selected)
            .withContext('second item is deselected after other is selected')
            .toBeFalse();
        expect(items[1].activated)
            .withContext('second item is deactivated after other is selected')
            .toBeFalse();
        expect(element.index)
            .withContext('index is correct after prop selection')
            .toEqual(2);
        expect(element.selected)
            .withContext('selected is correct after prop selection')
            .toEqual(items[2]);
      });

      it('prop deselection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        items[1].selected = false;
        await items[1].updateComplete;
        await element.updateComplete;

        expect(items[1].selected)
            .withContext('second item is deselected after prop deselection')
            .toBeFalse();
        expect(items[1].activated)
            .withContext('second item is deactivated after prop deselection')
            .toBeFalse();
        expect(element.index)
            .withContext('index is set to -1 prop deselection')
            .toEqual(-1);
        expect(element.selected)
            .withContext('selected is null prop deselection')
            .toEqual(null);
      });

      it('index selection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        element.select(2);
        await items[2].updateComplete;
        await element.updateComplete;

        expect(items[2].selected)
            .withContext('third item is selected after index selection')
            .toBeTrue();
        expect(items[2].activated)
            .withContext('third item is activated after index selection')
            .toBeTrue();
        expect(items[1].selected)
            .withContext('second item is deselected after other is selected')
            .toBeFalse();
        expect(items[1].activated)
            .withContext('second item is deactivated after other is selected')
            .toBeFalse();
        expect(element.index)
            .withContext('index is correct after index selection')
            .toEqual(2);
        expect(element.selected)
            .withContext('selected is correct after index selection')
            .toEqual(items[2]);
      });

      it('index deselection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        element.select(-1);
        await items[1].updateComplete;
        await element.updateComplete;

        expect(items[1].selected)
            .withContext('second item is deselected after index deselection')
            .toBeFalse();
        expect(items[1].activated)
            .withContext('second item is deactivated after index deselection')
            .toBeFalse();
        expect(element.index)
            .withContext('index is set to -1 index deselection')
            .toEqual(-1);
        expect(element.selected)
            .withContext('selected is null index deselection')
            .toEqual(null);
      });

      it('prop deselection on disconnect', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true, activated: true}),
          listItem(),
        ];
        fixt = await fixture(
            listTemplate({items: itemsTemplates, activatable: true}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        expect(items[1].selected)
            .withContext('second item is selected on init')
            .toBeTrue();
        expect(items[1].activated)
            .withContext('second item is activated on init')
            .toBeTrue();
        expect(element.index).withContext('index is set to 1 init').toEqual(1);
        expect(element.selected)
            .withContext('selected is second item on init')
            .toEqual(items[1]);

        element.removeChild(items[1]);

        await element.updateComplete;
        await items[1].updateComplete;
        await element.updateComplete;

        expect(items[1].selected)
            .withContext('second item is still selected after disconnect')
            .toBeTrue();
        expect(items[1].activated)
            .withContext('second item is still activated after disconnect')
            .toBeTrue();
        expect(element.index)
            .withContext('index is reset to null on selected item disconnect')
            .toEqual(-1);
        expect(element.selected)
            .withContext('selected is null on selected item disconnect')
            .toEqual(null);
      });

      it('single to multi', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
        ];
        fixt = await fixture(listTemplate({items: itemsTemplates}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        expect(element.index)
            .withContext('index is initially correct')
            .toEqual(1);
        expect(element.selected)
            .withContext('selected is initially correct')
            .toEqual(items[1]);

        element.multi = true;
        await element.updateComplete;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        expect(index.size)
            .withContext('only one item is in selected indices')
            .toEqual(1);
        expect(index.has(1)).withContext('index is correct').toBeTrue();
        expect(selected.length)
            .withContext('only one selected item')
            .toEqual(1);
        expect(selected[0])
            .withContext('selected is correct')
            .toEqual(items[1]);
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    describe('multi', () => {
      it('click selection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
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

        expect(items[2].selected)
            .withContext('third item is selected after click')
            .toBeTrue();
        expect(items[2].activated)
            .withContext('third item is activated after click')
            .toBeTrue();
        expect(items[1].selected)
            .withContext('second item is not deselected after other is clicked')
            .toBeTrue();
        expect(items[1].activated)
            .withContext(
                'second item is not deactivated after other is clicked')
            .toBeTrue();
        expect(index.size)
            .withContext('correct amount of indices after click')
            .toEqual(2);
        expect(index.has(1))
            .withContext('index is correct after click')
            .toBeTrue();
        expect(index.has(2))
            .withContext('index is correct after click')
            .toBeTrue();
        expect(selected.length)
            .withContext('correct number of selected after click')
            .toEqual(2);
        expect(selected.indexOf(items[1]) !== -1)
            .withContext('selected is correct after click')
            .toBeTrue();
        expect(selected.indexOf(items[2]) !== -1)
            .withContext('selected is correct after click')
            .toBeTrue();
      });

      it('deselection on click', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
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

        expect(items[1].selected)
            .withContext('second item is deselected after click')
            .toBeFalse();
        expect(items[1].activated)
            .withContext('second item is deactivated after click')
            .toBeFalse();
        expect(index.size).withContext('index is empty after click').toEqual(0);
        expect(selected.length)
            .withContext('nothing is selected after click')
            .toEqual(0);
      });

      it('prop selection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
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

        expect(items[2].selected)
            .withContext('third item is selected after prop selection')
            .toBeTrue();
        expect(items[2].activated)
            .withContext('third item is activated after prop selection')
            .toBeTrue();
        expect(items[1].selected)
            .withContext(
                'second item is not deselected after other is selected')
            .toBeTrue();
        expect(items[1].activated)
            .withContext(
                'second item is not deactivated after other is selected')
            .toBeTrue();
        expect(index.size)
            .withContext('correct amount of indices after prop selection')
            .toEqual(2);
        expect(index.has(1))
            .withContext('index is correct after prop selection')
            .toBeTrue();
        expect(index.has(2))
            .withContext('index is correct after prop selection')
            .toBeTrue();
        expect(selected.length)
            .withContext('correct number of selected after prop selection')
            .toEqual(2);
        expect(selected.indexOf(items[1]) !== -1)
            .withContext('selected is correct after prop selection')
            .toBeTrue();
        expect(selected.indexOf(items[2]) !== -1)
            .withContext('selected is correct after prop selection')
            .toBeTrue();
      });

      it('prop deselection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
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

        expect(items[1].selected)
            .withContext('second item is deselected after prop deselection')
            .toBeFalse();
        expect(items[1].activated)
            .withContext('second item is deactivated after prop deselection')
            .toBeFalse();
        expect(index.size)
            .withContext('index is empty after prop deselection')
            .toEqual(0);
        expect(selected.length)
            .withContext('nothing is selected after prop deselection')
            .toEqual(0);
      });

      it('index selection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
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

        expect(items[0].selected)
            .withContext('first item is selected after index selection')
            .toBeTrue();
        expect(items[0].activated)
            .withContext('first item is activated after index selection')
            .toBeTrue();
        expect(items[2].selected)
            .withContext('third item is selected after index selection')
            .toBeTrue();
        expect(items[2].activated)
            .withContext('third item is activated after index selection')
            .toBeTrue();
        expect(items[1].selected)
            .withContext('second item deselected after others are selected')
            .toBeFalse();
        expect(items[1].activated)
            .withContext('second item deactivated after others are selected')
            .toBeFalse();
        expect(index.size)
            .withContext('correct amount of indices after index selection')
            .toEqual(2);
        expect(index.has(0))
            .withContext('index is correct after index selection')
            .toBeTrue();
        expect(index.has(2))
            .withContext('index is correct after index selection')
            .toBeTrue();
        expect(selected.length)
            .withContext('correct number of selected after index selection')
            .toEqual(2);
        expect(selected.indexOf(items[0]) !== -1)
            .withContext('selected is correct after index selection')
            .toBeTrue();
        expect(selected.indexOf(items[2]) !== -1)
            .withContext('selected is correct after index selection')
            .toBeTrue();
      });

      it('multi index selection diff', async () => {
        const itemsTemplate = [
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
        ];
        fixt = await fixture(listTemplate({items: itemsTemplate, multi: true}));
        element = fixt.root.querySelector('mwc-list')!;
        let lastDiff: IndexDiff|null = null;
        element.addEventListener(
            'selected', ((event: CustomEvent<SelectedDetail<Set<number>>>) => {
                          lastDiff = event.detail.diff;
                        }) as EventListener);

        element.select(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
        await element.updateComplete;

        expect(lastDiff).toBeTruthy();
        if (!lastDiff) {
          return;
        }
        asssertDiffsEqual(lastDiff, {
          added: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
          removed: [],
        });

        lastDiff = null;

        element.select(new Set([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]));
        await element.updateComplete;

        expect(lastDiff).toBeTruthy();
        if (!lastDiff) {
          return;
        }
        asssertDiffsEqual(lastDiff, {
          added: [10],
          removed: [],
        });

        lastDiff = null;

        element.select(new Set([3, 4, 5, 6, 11]));
        await element.updateComplete;

        expect(lastDiff).toBeTruthy();
        if (!lastDiff) {
          return;
        }
        asssertDiffsEqual(lastDiff, {
          added: [11],
          removed: [0, 1, 2, 7, 8, 9, 10],
        });
      });

      it('index deselection', async () => {
        const itemsTemplates = [
          listItem(), listItem({selected: true, activated: true}), listItem()
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

        expect(items[1].selected)
            .withContext('second item is deselected after index deselection')
            .toBeFalse();
        expect(items[1].activated)
            .withContext('second item is deactivated after index deselection')
            .toBeFalse();
        expect(index.size)
            .withContext('index is empty after index deselection')
            .toEqual(0);
        expect(selected.length)
            .withContext('nothing is selected after index deselection')
            .toEqual(0);
      });

      it('multi to single', async () => {
        const itemsTemplates = [
          listItem(),
          listItem({selected: true}),
          listItem({selected: true}),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
          listItem(),
        ];
        fixt =
            await fixture(listTemplate({multi: true, items: itemsTemplates}));
        element = fixt.root.querySelector('mwc-list')!;
        const items = element.items;

        const index = element.index as Set<number>;
        const selected = element.selected as ListItem[];

        expect(index.size)
            .withContext('two items are in selected indices')
            .toEqual(2);
        expect(index.has(1)).withContext('index is correct').toBeTrue();
        expect(index.has(2)).withContext('index is correct').toBeTrue();
        expect(selected.length).withContext('two selected items').toEqual(2);
        expect(selected.indexOf(items[1]) !== -1)
            .withContext('selected is correct')
            .toBeTrue();
        expect(selected.indexOf(items[2]) !== -1)
            .withContext('selected is correct')
            .toBeTrue();

        element.multi = false;
        await element.updateComplete;

        expect(element.index)
            .withContext('index is now only the first item')
            .toEqual(1);
        expect(element.selected)
            .withContext('element is selected')
            .toEqual(items[1]);
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    describe('empty list', () => {
      // IE does not support slots and cannot run this test
      // IE feature detection.
      if ((document as any).documentMode) {
        return;
      }

      let fixt: TestFixture;
      let component: List|null;
      let placeholderElement: ListItem|null;

      it('does not render placeholder by default', async () => {
        fixt = await fixture(createEmptyList(undefined));
        component = fixt.root.querySelector('mwc-list');
        if (component && component.shadowRoot) {
          placeholderElement =
              component.shadowRoot.querySelector('mwc-list-item');
        }

        expect(placeholderElement).toBeNull();
      });

      it('will render a noninteractive paceholder if provided', async () => {
        fixt = await fixture(
            createEmptyList('Unfortunately, no results were found.'));
        component = fixt.root.querySelector('mwc-list');

        if (component && component.shadowRoot) {
          placeholderElement =
              component.shadowRoot.querySelector('mwc-list-item');
        }

        expect(placeholderElement).not.toBeNull();
      });

      afterEach(() => {
        if (fixt) {
          fixt.remove();
        }
      });
    });

    describe('performance issue', () => {
      it('removing list should not call layout more than once', async () => {
        let count = 0;
        const originalLayout = List.prototype.layout;
        List.prototype.layout = function(update) {
          originalLayout.call(this, update);
          count++;
        };

        const itemsTemplates = new Array(50).fill(0).map(() => listItem());
        fixt = await fixture(listTemplate({items: itemsTemplates}));
        element = fixt.root.querySelector('mwc-list')!;

        count = 0;

        fixt.remove();
        await element.updateComplete;
        fixt = null;
        expect(count)
            .withContext(
                'list.layout ran more than once while it shouldn\'t have')
            .toEqual(1);
        List.prototype.layout = originalLayout;
      });
    });
  });
});
