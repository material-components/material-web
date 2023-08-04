/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)
import './list.js';
import './list-item.js';

import {html} from 'lit';

import {Environment} from '../testing/environment.js';
import {createTokenTests} from '../testing/tokens.js';

import {ListHarness} from './harness.js';
import {MdList} from './list.js';
import {MdListItem} from './list-item.js';

describe('<md-list>', () => {
  const env = new Environment();

  describe('.styles', () => {
    createTokenTests(MdList.styles);
  });

  describe('keyboard navigation', () => {
    it('non-nagivable key does nothing', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);

      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeTrue();
      expect(third.active).toBeFalse();

      await listHarness.keypress('k');
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeTrue();
      expect(third.active).toBeFalse();
    });

    it('ArrowDown activates the next item', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);

      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeTrue();
      expect(third.active).toBeFalse();

      await listHarness.pressHandledKey('ArrowDown');
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();
    });

    it('ArrowDown will loop around', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();

      await listHarness.pressHandledKey('ArrowDown');
      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();
    });

    it('ArrowDown activates the first item if nothing is active', async () => {
      const root = env.render(html`
          <md-list>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();

      await listHarness.pressHandledKey('ArrowDown');
      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();
    });

    it('ArrowDown will do nothing if nothing is selectable', async () => {
      const root = env.render(html`
          <md-list>
            <md-list-item disabled></md-list-item>
            <md-list-item disabled></md-list-item>
          </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second] = Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();

      await listHarness.pressHandledKey('ArrowDown');
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
    });

    it('ArrowDown does not activate disabled items', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item active></md-list-item>
          <md-list-item disabled></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();

      await listHarness.pressHandledKey('ArrowDown');
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();
    });

    it('ArrowDown will select itself if its the only activatable', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item active></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const first = root.querySelector('md-list-item')!;

      await env.waitForStability();

      expect(first.active).toBeTrue();

      await listHarness.pressHandledKey('ArrowDown');
      await env.waitForStability();

      expect(first.active).toBeTrue();
    });

    it('ArrowUp activates the previous item', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeTrue();
      expect(third.active).toBeFalse();

      await listHarness.pressHandledKey('ArrowUp');
      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();
    });

    it('activatePreviousItem will loop around', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();

      await listHarness.pressHandledKey('ArrowUp');
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();
    });

    it('ArrowUp activates the last item if nothing is active', async () => {
      const root = env.render(html`
          <md-list>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();

      await listHarness.pressHandledKey('ArrowUp');
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();
    });

    it('ArrowUp will return null if nothing is selectable', async () => {
      const root = env.render(html`
          <md-list>
            <md-list-item disabled></md-list-item>
            <md-list-item disabled></md-list-item>
          </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second] = Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();

      await listHarness.pressHandledKey('ArrowUp');
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
    });

    it('ArrowUp does not activate disabled items', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item disabled></md-list-item>
          <md-list-item active></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();

      await listHarness.pressHandledKey('ArrowUp');
      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();
    });

    it('ArrowUp will select itself if its the only activatable', async () => {
      const root = env.render(html`
          <md-list>
            <md-list-item active></md-list-item>
          </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const first = root.querySelector('md-list-item')!;

      await env.waitForStability();

      expect(first.active).toBeTrue();

      await listHarness.pressHandledKey('ArrowUp');
      await env.waitForStability();

      expect(first.active).toBeTrue();
    });

    it('Home will select the first item if something is already selected',
       async () => {
         const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const listHarness = new ListHarness(listEl);
         const [first, second, third] =
             Array.from(root.querySelectorAll('md-list-item'));

         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeTrue();
         expect(third.active).toBeFalse();

         await listHarness.pressHandledKey('Home');
         await env.waitForStability();

         expect(first.active).toBeTrue();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();
       });

    it('Home will select the first activatable item if first is non-activatable',
       async () => {
         const root = env.render(html`
        <md-list>
          <md-list-item disabled></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const listHarness = new ListHarness(listEl);
         const [first, second, third] =
             Array.from(root.querySelectorAll('md-list-item'));

         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();

         await listHarness.pressHandledKey('Home');
         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeTrue();
         expect(third.active).toBeFalse();
       });

    it('Home will select the first item if nothing is already selected',
       async () => {
         const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const listHarness = new ListHarness(listEl);
         const [first, second, third] =
             Array.from(root.querySelectorAll('md-list-item'));

         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();

         await listHarness.pressHandledKey('Home');
         await env.waitForStability();

         expect(first.active).toBeTrue();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();
       });

    it('Home will select the first item if it is already selected',
       async () => {
         const root = env.render(html`
        <md-list>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const listHarness = new ListHarness(listEl);
         const [first, second, third] =
             Array.from(root.querySelectorAll('md-list-item'));

         await env.waitForStability();

         expect(first.active).toBeTrue();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();

         await listHarness.pressHandledKey('Home');
         await env.waitForStability();

         expect(first.active).toBeTrue();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();
       });

    it('End will select the last item if something is already selected',
       async () => {
         const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const listHarness = new ListHarness(listEl);
         const [first, second, third] =
             Array.from(root.querySelectorAll('md-list-item'));

         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeTrue();
         expect(third.active).toBeFalse();

         await listHarness.pressHandledKey('End');
         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeFalse();
         expect(third.active).toBeTrue();
       });

    it('End will select the last activatable item if last is non-activatable',
       async () => {
         const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item disabled></md-list-item>
        </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const listHarness = new ListHarness(listEl);
         const [first, second, third] =
             Array.from(root.querySelectorAll('md-list-item'));

         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();

         await listHarness.pressHandledKey('End');
         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeTrue();
         expect(third.active).toBeFalse();
       });

    it('End will select the last item if nothing is already selected',
       async () => {
         const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const listHarness = new ListHarness(listEl);
         const [first, second, third] =
             Array.from(root.querySelectorAll('md-list-item'));

         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();

         await listHarness.pressHandledKey('End');
         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeFalse();
         expect(third.active).toBeTrue();
       });

    it('End will select the last item if it is already selected', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const listHarness = new ListHarness(listEl);
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();

      await listHarness.pressHandledKey('End');
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();
    });
  });

  describe('activate items methods', () => {
    it('activateNextItem activates the next item', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeTrue();
      expect(third.active).toBeFalse();

      const nextItem = listEl.activateNextItem();
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();
      expect(nextItem).toEqual(third);
    });

    it('activateNextItem will loop around', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();

      const nextItem = listEl.activateNextItem();
      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();
      expect(nextItem).toEqual(first);
    });

    it('activateNextItem activates the first item if nothing is active',
       async () => {
         const root = env.render(html`
          <md-list>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const [first, second, third] =
             Array.from(root.querySelectorAll('md-list-item'));

         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();

         const nextItem = listEl.activateNextItem();
         await env.waitForStability();

         expect(first.active).toBeTrue();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();
         expect(nextItem).toEqual(first);
       });

    it('activateNextItem will return null if nothing is selectable',
       async () => {
         const root = env.render(html`
          <md-list>
          </md-list>`);
         const listEl = root.querySelector('md-list')!;

         await env.waitForStability();

         const nextItem = listEl.activateNextItem();
         await env.waitForStability();

         expect(nextItem).toBeNull();
       });

    it('activateNextItem does not activate disabled items', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item active></md-list-item>
          <md-list-item disabled></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();

      const nextItem = listEl.activateNextItem();
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();
      expect(nextItem).toEqual(third);
    });

    it('activateNextItem will return itself if it is the only activatable item',
       async () => {
         const root = env.render(html`
        <md-list>
          <md-list-item active></md-list-item>
        </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const first = root.querySelector('md-list-item')!;

         await env.waitForStability();

         expect(first.active).toBeTrue();

         const nextItem = listEl.activateNextItem();
         await env.waitForStability();

         expect(first.active).toBeTrue();
         expect(nextItem).toEqual(first);
       });

    it('activatePreviousItem activates the previous item', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeTrue();
      expect(third.active).toBeFalse();

      const nextItem = listEl.activatePreviousItem();
      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();
      expect(nextItem).toEqual(first);
    });

    it('activatePreviousItem will loop around', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item active></md-list-item>
          <md-list-item></md-list-item>
          <md-list-item></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();

      const nextItem = listEl.activatePreviousItem();
      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();
      expect(nextItem).toEqual(third);
    });

    it('activatePreviousItem activates the last item if nothing is active',
       async () => {
         const root = env.render(html`
          <md-list>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
            <md-list-item></md-list-item>
          </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const [first, second, third] =
             Array.from(root.querySelectorAll('md-list-item'));

         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeFalse();
         expect(third.active).toBeFalse();

         const nextItem = listEl.activatePreviousItem();
         await env.waitForStability();

         expect(first.active).toBeFalse();
         expect(second.active).toBeFalse();
         expect(third.active).toBeTrue();
         expect(nextItem).toEqual(third);
       });

    it('activatePreviousItem will return null if nothing is selectable',
       async () => {
         const root = env.render(html`
          <md-list>
          </md-list>`);
         const listEl = root.querySelector('md-list')!;

         await env.waitForStability();

         const nextItem = listEl.activatePreviousItem();
         await env.waitForStability();

         expect(nextItem).toBeNull();
       });

    it('activatePreviousItem does not activate disabled items', async () => {
      const root = env.render(html`
        <md-list>
          <md-list-item></md-list-item>
          <md-list-item disabled></md-list-item>
          <md-list-item active></md-list-item>
        </md-list>`);
      const listEl = root.querySelector('md-list')!;
      const [first, second, third] =
          Array.from(root.querySelectorAll('md-list-item'));

      await env.waitForStability();

      expect(first.active).toBeFalse();
      expect(second.active).toBeFalse();
      expect(third.active).toBeTrue();

      const nextItem = listEl.activatePreviousItem();
      await env.waitForStability();

      expect(first.active).toBeTrue();
      expect(second.active).toBeFalse();
      expect(third.active).toBeFalse();
      expect(nextItem).toEqual(first);
    });

    it('activatePreviousItem will return itself if its activatable',
       async () => {
         const root = env.render(html`
          <md-list>
            <md-list-item active></md-list-item>
          </md-list>`);
         const listEl = root.querySelector('md-list')!;
         const first = root.querySelector('md-list-item')!;

         await env.waitForStability();

         expect(first.active).toBeTrue();

         const nextItem = listEl.activatePreviousItem();
         await env.waitForStability();

         expect(first.active).toBeTrue();
         expect(nextItem).toEqual(first);
       });
  });
});

describe('<md-list-item>', () => {
  const env = new Environment();

  describe('.styles', () => {
    createTokenTests(MdListItem.styles);
  });

  describe('rendering', () => {
    it('disabled overrides tabIndex', async () => {
      const root = env.render(html`<md-list-item></md-list-item>`);

      const listItem = root.querySelector('md-list-item')!;

      await env.waitForStability();

      const internalRoot =
          listItem.renderRoot.querySelector('#item') as HTMLElement;

      expect(internalRoot.tabIndex).toBe(-1);

      listItem.itemTabIndex = 2;

      await env.waitForStability();

      expect(listItem.disabled).toBeFalse();
      expect(internalRoot.tabIndex).toBe(2);

      listItem.disabled = true;

      await env.waitForStability();

      expect(listItem.disabled).toBeTrue();
      expect(internalRoot.tabIndex).toBe(-1);
    });

    it('supportingText is rendered only when set', async () => {
      const root = env.render(html`<md-list-item></md-list-item>`);

      const listItem = root.querySelector('md-list-item')!;

      await env.waitForStability();

      let supporingTextEl =
          listItem.renderRoot.querySelector('.supporting-text');

      expect(supporingTextEl).toBeNull();

      listItem.supportingText = 'Yolo';

      await env.waitForStability();

      supporingTextEl = listItem.renderRoot.querySelector('.supporting-text');
      expect(supporingTextEl).toBeTruthy();
    });

    it('trailingSupportingText is rendered only when set', async () => {
      const root = env.render(html`<md-list-item></md-list-item>`);

      const listItem = root.querySelector('md-list-item')!;

      await env.waitForStability();

      let supporingTextEl =
          listItem.renderRoot.querySelector('.trailing-supporting-text');

      expect(supporingTextEl).toBeNull();

      listItem.trailingSupportingText = 'Yolo';

      await env.waitForStability();

      supporingTextEl =
          listItem.renderRoot.querySelector('.trailing-supporting-text');
      expect(supporingTextEl).toBeTruthy();
    });

    it('only one "with-*-line" class is set at a time', async () => {
      const root = env.render(html`<md-list-item></md-list-item>`);

      const listItem = root.querySelector('md-list-item')!;

      await env.waitForStability();

      const rootEl = listItem.renderRoot.querySelector('#item') as HTMLElement;

      expect(rootEl.classList.contains('with-one-line')).toBeTrue();
      expect(rootEl.classList.contains('with-two-line')).toBeFalse();
      expect(rootEl.classList.contains('with-three-line')).toBeFalse();

      listItem.multiLineSupportingText = true;

      await env.waitForStability();

      expect(rootEl.classList.contains('with-one-line')).toBeTrue();
      expect(rootEl.classList.contains('with-two-line')).toBeFalse();
      expect(rootEl.classList.contains('with-three-line')).toBeFalse();

      listItem.multiLineSupportingText = false;
      listItem.supportingText = 'YOLO';

      await env.waitForStability();

      expect(rootEl.classList.contains('with-one-line')).toBeFalse();
      expect(rootEl.classList.contains('with-two-line')).toBeTrue();
      expect(rootEl.classList.contains('with-three-line')).toBeFalse();

      listItem.multiLineSupportingText = true;

      await env.waitForStability();

      expect(rootEl.classList.contains('with-one-line')).toBeFalse();
      expect(rootEl.classList.contains('with-two-line')).toBeFalse();
      expect(rootEl.classList.contains('with-three-line')).toBeTrue();
    });

    it('ripple and focus ring not rendered on noninteractive', async () => {
      const root = env.render(html`<md-list-item></md-list-item>`);

      const listItem = root.querySelector('md-list-item')!;

      await env.waitForStability();

      let rippleEl = listItem.renderRoot.querySelector('md-ripple');
      let focusRingEl = listItem.renderRoot.querySelector('md-focus-ring');

      expect(rippleEl).toBeTruthy();
      expect(focusRingEl).toBeTruthy();

      listItem.noninteractive = true;

      await env.waitForStability();

      rippleEl = listItem.renderRoot.querySelector('md-ripple');
      focusRingEl = listItem.renderRoot.querySelector('md-focus-ring');

      expect(rippleEl).toBeNull();
      expect(focusRingEl).toBeNull();
    });
  });

  describe('active', () => {
    it('initializing with non-active does not override itemTabIndex',
       async () => {
         const root = env.render(html`
        <md-list-item
            .active=${false}
            item-tabindex="3">
        </md-list-item>`);

         const listItemEl = root.querySelector('md-list-item')!;

         await env.waitForStability();

         expect(listItemEl.active).toBeFalse();
         expect(listItemEl.itemTabIndex).toBe(3);
       });

    it('setting active to false after first update sets tabIndex to -1',
       async () => {
         const root = env.render(html`
          <md-list-item
              active
              item-tabindex="3">
          </md-list-item>`);

         const listItemEl = root.querySelector('md-list-item')!;

         await env.waitForStability();

         listItemEl.active = false;

         await env.waitForStability();

         expect(listItemEl.active).toBeFalse();
         expect(listItemEl.itemTabIndex).toBe(-1);
       });

    it('active sets tabindex to 0 and overrides item-tabindex', async () => {
      const root = env.render(html`
          <md-list-item
              active
              item-tabindex="3">
          </md-list-item>`);

      const listItemEl = root.querySelector('md-list-item')!;

      await env.waitForStability();

      expect(listItemEl.active).toBeTrue();
      expect(listItemEl.itemTabIndex).toBe(0);
    });

    it('active does not set tabindex to 0 if disabled', async () => {
      const root = env.render(html`
          <md-list-item
              active
              disabled>
          </md-list-item>`);

      const listItemEl = root.querySelector('md-list-item')!;

      await env.waitForStability();

      expect(listItemEl.active).toBeTrue();
      expect(listItemEl.itemTabIndex).toBe(-1);
    });

    it('active does not focus the element on first update', async () => {
      const root = env.render(html`
          <md-list-item active>
          </md-list-item>`);

      const listItemEl = root.querySelector('md-list-item')!;

      spyOn(listItemEl, 'focus').and.callThrough();

      await env.waitForStability();

      expect(listItemEl.active).toBeTrue();
      expect(listItemEl.focus).toHaveBeenCalledTimes(0);
    });

    it('active sets focus after firstUpdate', async () => {
      const root = env.render(html`
          <md-list-item>
          </md-list-item>`);

      const listItemEl = root.querySelector('md-list-item')!;

      spyOn(listItemEl, 'focus').and.callThrough();

      await env.waitForStability();

      expect(listItemEl.active).toBeFalse();
      expect(listItemEl.focus).toHaveBeenCalledTimes(0);

      listItemEl.active = true;

      await env.waitForStability();

      expect(listItemEl.active).toBeTrue();
      expect(listItemEl.focus).toHaveBeenCalledTimes(1);
    });

    it('self-describes as a list-item', async () => {
      const root = env.render(html`
          <md-list-item>
          </md-list-item>`);

      const listItemEl = root.querySelector('md-list-item')!;

      await env.waitForStability();

      expect(listItemEl.hasAttribute('md-list-item')).toBeTrue();
    });
  });
});

describe('<md-list-item> link', () => {
  const env = new Environment();

  describe('.styles', () => {
    createTokenTests(MdListItem.styles);
  });

  it('setting href renders an anchor tag', async () => {
    const root = env.render(
        html`<md-list-item href="https://google.com"></md-list-item>`);

    const listItem = root.querySelector('md-list-item')!;

    await env.waitForStability();

    const internalRoot =
        listItem.renderRoot.querySelector('#item') as HTMLElement;

    expect(internalRoot.tagName).toBe('A');
  });
  
  it('setting type and href does not render a role', async () => {
    const root = env.render(
        html`<md-list-item type="menuitem" href="https://google.com"></md-list-item>`);

    const listItem = root.querySelector('md-list-item')!;

    await env.waitForStability();

    const internalRoot =
        listItem.renderRoot.querySelector('#item') as HTMLElement;

    expect(internalRoot.hasAttribute('role')).toBe(false);
  });
  
  it('setting target without href renders nothing', async () => {
    const root = env.render(
        html`<md-list-item target="_blank"></md-list-item>`);

    const listItem = root.querySelector('md-list-item')!;

    await env.waitForStability();

    const internalRoot =
        listItem.renderRoot.querySelector('#item') as HTMLElement;

    expect(internalRoot.hasAttribute('target')).toBe(false);
  });
});
