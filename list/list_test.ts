/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './list.js';
import './list-item.js';

import {html, LitElement, render} from 'lit';

import {createTokenTests} from '../testing/tokens.js';

import {MdList} from './list.js';
import {MdListItem} from './list-item.js';

async function awaitAllListElements(root: HTMLElement) {
  const els = Array.from(root.querySelectorAll('md-list-item,mdList'));
  await Promise.all(els.map(el => (el as LitElement).updateComplete));
}

describe('<md-list>', () => {
  describe('.styles', () => {
    createTokenTests(MdList.styles);
  });

  let root: HTMLDivElement;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root?.remove();
  });

  it('activateNextItem activates the next item', async () => {
    render(
        html`
          <md-list>
            <md-list-item></md-list-item>
            <md-list-item active></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`,
        root);
    const listEl = root.querySelector('md-list')!;
    const [first, second, third] =
        Array.from(root.querySelectorAll('md-list-item'));

    await awaitAllListElements(root);

    expect(first.active).toBeFalse();
    expect(second.active).toBeTrue();
    expect(third.active).toBeFalse();

    const nextItem = listEl.activateNextItem();
    await awaitAllListElements(root);

    expect(first.active).toBeFalse();
    expect(second.active).toBeFalse();
    expect(third.active).toBeTrue();
    expect(nextItem).toEqual(third);
  });

  it('activateNextItem will loop around', async () => {
    render(
        html`
          <md-list>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
            <md-list-item active></md-list-item>
          </md-list>`,
        root);
    const listEl = root.querySelector('md-list')!;
    const [first, second, third] =
        Array.from(root.querySelectorAll('md-list-item'));

    await awaitAllListElements(root);

    expect(first.active).toBeFalse();
    expect(second.active).toBeFalse();
    expect(third.active).toBeTrue();

    const nextItem = listEl.activateNextItem();
    await awaitAllListElements(root);

    expect(first.active).toBeTrue();
    expect(second.active).toBeFalse();
    expect(third.active).toBeFalse();
    expect(nextItem).toEqual(first);
  });

  it('activateNextItem activates the first item if nothing is active',
     async () => {
       render(
           html`
          <md-list>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`,
           root);
       const listEl = root.querySelector('md-list')!;
       const [first, second, third] =
           Array.from(root.querySelectorAll('md-list-item'));

       await awaitAllListElements(root);

       expect(first.active).toBeFalse();
       expect(second.active).toBeFalse();
       expect(third.active).toBeFalse();

       const nextItem = listEl.activateNextItem();
       await awaitAllListElements(root);

       expect(first.active).toBeTrue();
       expect(second.active).toBeFalse();
       expect(third.active).toBeFalse();
       expect(nextItem).toEqual(first);
     });

  it('activateNextItem will return null if nothing is selecatble', async () => {
    render(
        html`
          <md-list>
          </md-list>`,
        root);
    const listEl = root.querySelector('md-list')!;

    await awaitAllListElements(root);

    const nextItem = listEl.activateNextItem();
    await awaitAllListElements(root);

    expect(nextItem).toBeNull();
  });

  it('activateNextItem does not activate disabled items', async () => {
    render(
        html`
          <md-list>
            <md-list-item active></md-list-item>
            <md-list-item disabled></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`,
        root);
    const listEl = root.querySelector('md-list')!;
    const [first, second, third] =
        Array.from(root.querySelectorAll('md-list-item'));

    await awaitAllListElements(root);

    expect(first.active).toBeTrue();
    expect(second.active).toBeFalse();
    expect(third.active).toBeFalse();

    const nextItem = listEl.activateNextItem();
    await awaitAllListElements(root);

    expect(first.active).toBeFalse();
    expect(second.active).toBeFalse();
    expect(third.active).toBeTrue();
    expect(nextItem).toEqual(third);
  });

  it('activateNextItem will return itself if its activatable', async () => {
    render(
        html`
          <md-list>
            <md-list-item active></md-list-item>
          </md-list>`,
        root);
    const listEl = root.querySelector('md-list')!;
    const first = root.querySelector('md-list-item')!;

    await awaitAllListElements(root);

    expect(first.active).toBeTrue();

    const nextItem = listEl.activateNextItem();
    await awaitAllListElements(root);

    expect(first.active).toBeTrue();
    expect(nextItem).toEqual(first);
  });

  ////

  it('activatePreviousItem activates the previous item', async () => {
    render(
        html`
          <md-list>
            <md-list-item></md-list-item>
            <md-list-item active></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`,
        root);
    const listEl = root.querySelector('md-list')!;
    const [first, second, third] =
        Array.from(root.querySelectorAll('md-list-item'));

    await awaitAllListElements(root);

    expect(first.active).toBeFalse();
    expect(second.active).toBeTrue();
    expect(third.active).toBeFalse();

    const nextItem = listEl.activatePreviousItem();
    await awaitAllListElements(root);

    expect(first.active).toBeTrue();
    expect(second.active).toBeFalse();
    expect(third.active).toBeFalse();
    expect(nextItem).toEqual(first);
  });

  it('activatePreviousItem will loop around', async () => {
    render(
        html`
          <md-list>
            <md-list-item active></md-list-item>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`,
        root);
    const listEl = root.querySelector('md-list')!;
    const [first, second, third] =
        Array.from(root.querySelectorAll('md-list-item'));

    await awaitAllListElements(root);

    expect(first.active).toBeTrue();
    expect(second.active).toBeFalse();
    expect(third.active).toBeFalse();

    const nextItem = listEl.activatePreviousItem();
    await awaitAllListElements(root);

    expect(first.active).toBeFalse();
    expect(second.active).toBeFalse();
    expect(third.active).toBeTrue();
    expect(nextItem).toEqual(third);
  });

  it('activatePreviousItem activates the last item if nothing is active',
     async () => {
       render(
           html`
          <md-list>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`,
           root);
       const listEl = root.querySelector('md-list')!;
       const [first, second, third] =
           Array.from(root.querySelectorAll('md-list-item'));

       await awaitAllListElements(root);

       expect(first.active).toBeFalse();
       expect(second.active).toBeFalse();
       expect(third.active).toBeFalse();

       const nextItem = listEl.activatePreviousItem();
       await awaitAllListElements(root);

       expect(first.active).toBeFalse();
       expect(second.active).toBeFalse();
       expect(third.active).toBeTrue();
       expect(nextItem).toEqual(third);
     });

  it('activatePreviousItem will return null if nothing is selecatble',
     async () => {
       render(
           html`
          <md-list>
          </md-list>`,
           root);
       const listEl = root.querySelector('md-list')!;

       await awaitAllListElements(root);

       const nextItem = listEl.activatePreviousItem();
       await awaitAllListElements(root);

       expect(nextItem).toBeNull();
     });

  it('activatePreviousItem does not activate disabled items', async () => {
    render(
        html`
            <md-list>
              <md-list-item></md-list-item>
              <md-list-item disabled></md-list-item>
              <md-list-item active></md-list-item>
            </md-list>`,
        root);
    const listEl = root.querySelector('md-list')!;
    const [first, second, third] =
        Array.from(root.querySelectorAll('md-list-item'));

    await awaitAllListElements(root);

    expect(first.active).toBeFalse();
    expect(second.active).toBeFalse();
    expect(third.active).toBeTrue();

    const nextItem = listEl.activatePreviousItem();
    await awaitAllListElements(root);

    expect(first.active).toBeTrue();
    expect(second.active).toBeFalse();
    expect(third.active).toBeFalse();
    expect(nextItem).toEqual(first);
  });

  it('activatePreviousItem will return itself if its activatable', async () => {
    render(
        html`
          <md-list>
            <md-list-item active></md-list-item>
          </md-list>`,
        root);
    const listEl = root.querySelector('md-list')!;
    const first = root.querySelector('md-list-item')!;

    await awaitAllListElements(root);

    expect(first.active).toBeTrue();

    const nextItem = listEl.activatePreviousItem();
    await awaitAllListElements(root);

    expect(first.active).toBeTrue();
    expect(nextItem).toEqual(first);
  });
});

describe('<md-list-item>', () => {
  describe('.styles', () => {
    createTokenTests(MdListItem.styles);
  });
});
