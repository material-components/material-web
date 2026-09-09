/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';

import {Environment} from '../../testing/environment.js';

import {queryAssociatedById, queryAssociatedByIds} from './query-associated.js';

@customElement('test-shadow-component')
class TestShadowComponent extends LitElement {
  override render() {
    return html`
      <div id="shadow1">Shadow Child 1</div>
      <div id="shadow2">Shadow Child 2</div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'test-shadow-component': TestShadowComponent;
  }
}

describe('query-associated', () => {
  const env = new Environment();

  describe('queryAssociatedById()', () => {
    it('returns element with matching ID in light DOM', async () => {
      const root = env.render(html`
        <div id="el1">Element 1</div>
        <div id="el2">Element 2</div>
        <div id="el3">Element 3</div>
      `);
      await env.waitForStability();

      const el1 = root.querySelector('#el1')!;
      const el2 = root.querySelector('#el2')!;

      expect(queryAssociatedById(el1, 'el2')).toBe(el2);
    });

    it('returns null when element with given ID does not exist', async () => {
      const root = env.render(html`<div id="el1">Element 1</div>`);
      await env.waitForStability();

      const el1 = root.querySelector('#el1')!;

      expect(queryAssociatedById(el1, 'nonexistent')).toBeNull();
    });

    it('returns null when given an empty string ID', async () => {
      const root = env.render(html`<div id="el1">Element 1</div>`);
      await env.waitForStability();

      const el1 = root.querySelector('#el1')!;

      expect(queryAssociatedById(el1, '')).toBeNull();
    });

    it('queries within shadow root when element is in shadow DOM', async () => {
      const root = env.render(html`
        <test-shadow-component></test-shadow-component>
      `);
      await env.waitForStability();

      const component = root.querySelector('test-shadow-component')!;
      const shadow1 = component.shadowRoot!.querySelector('#shadow1')!;
      const shadow2 = component.shadowRoot!.querySelector('#shadow2')!;

      expect(queryAssociatedById(shadow1, 'shadow2')).toBe(shadow2);
    });
  });

  describe('queryAssociatedByIds()', () => {
    it('returns elements with matching IDs in light DOM', async () => {
      const root = env.render(html`
        <div id="el1">Element 1</div>
        <div id="el2">Element 2</div>
        <div id="el3">Element 3</div>
      `);
      await env.waitForStability();

      const el1 = root.querySelector('#el1')!;
      const el2 = root.querySelector('#el2')!;
      const el3 = root.querySelector('#el3')!;

      const result = queryAssociatedByIds(el1, 'el2 el3');
      expect(Array.from(result)).toEqual([el2, el3]);
    });

    it('returns empty array when elements with given IDs do not exist', async () => {
      const root = env.render(html`<div id="el1">Element 1</div>`);
      await env.waitForStability();

      const el1 = root.querySelector('#el1')!;

      const result = queryAssociatedByIds(el1, 'missing1 missing2');
      expect(Array.from(result)).toEqual([]);
    });

    it('returns matching elements even if some IDs do not exist', async () => {
      const root = env.render(html`
        <div id="el1">Element 1</div>
        <div id="el2">Element 2</div>
      `);
      await env.waitForStability();

      const el1 = root.querySelector('#el1')!;
      const el2 = root.querySelector('#el2')!;

      const result = queryAssociatedByIds(el1, 'missing el2');
      expect(Array.from(result)).toEqual([el2]);
    });

    it('queries within shadow root when elements are in shadow DOM', async () => {
      const root = env.render(html`
        <test-shadow-component></test-shadow-component>
      `);
      await env.waitForStability();

      const component = root.querySelector('test-shadow-component')!;
      const shadow1 = component.shadowRoot!.querySelector('#shadow1')!;
      const shadow2 = component.shadowRoot!.querySelector('#shadow2')!;

      const result = queryAssociatedByIds(shadow1, 'shadow1 shadow2');
      expect(Array.from(result)).toEqual([shadow1, shadow2]);
    });

    it('returns empty array when given an empty string ID', async () => {
      const root = env.render(html`<div id="el1">Element 1</div>`);
      await env.waitForStability();

      const el1 = root.querySelector('#el1')!;

      const result = queryAssociatedByIds(el1, '');
      expect(Array.from(result)).toEqual([]);
    });

    it('handles multiple spaces within list of IDs', async () => {
      const root = env.render(html`
        <div id="el1">Element 1</div>
        <div id="el2">Element 2</div>
        <div id="el3">Element 3</div>
      `);
      await env.waitForStability();

      const el1 = root.querySelector('#el1')!;
      const el2 = root.querySelector('#el2')!;
      const el3 = root.querySelector('#el3')!;

      const result = queryAssociatedByIds(el1, '  el2   el3  ');
      expect(Array.from(result)).toEqual([el2, el3]);
    });
  });
});
