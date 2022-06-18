/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import 'jasmine';

import {Environment} from '@material/web/testing/environment';
import {html} from 'lit';
import {customElement, property} from 'lit/decorators';

import {ActionElement} from './action-element';

declare global {
  interface HTMLElementTagNameMap {
    'test-action-element': TestActionElement;
  }
}

@customElement('test-action-element')
class TestActionElement extends ActionElement {
  @property({type: Boolean}) disabled = false;
}

describe('Action Element', () => {
  const env = new Environment();
  let el!: TestActionElement;
  let actionEvent: CustomEvent|null = null;

  beforeEach(async () => {
    actionEvent = null;
    const root = env.render(html`<test-action-element></test-action-element>`);
    el = root.querySelector('test-action-element')!;
    el.addEventListener('action', (ev: Event) => {
      actionEvent = ev as CustomEvent;
    });
    await env.waitForStability();
  });

  it('fires action event from endPress', () => {
    el.endPress({cancelled: false});
    expect(actionEvent).toBeInstanceOf(CustomEvent);
    expect(actionEvent!.detail).toBeNull();
  });

  it('fires action event with actionData', () => {
    const data = {
      test: true,
    };
    el.endPress({cancelled: false, actionData: data});
    expect(actionEvent).toBeInstanceOf(CustomEvent);
    expect(actionEvent!.detail).toEqual(data);
  });

  describe('cancelled', () => {
    it('does not fire action event from endPress', () => {
      el.endPress({cancelled: true});
      expect(actionEvent).toBeNull();
    });

    it('does not fire action event with actionData', () => {
      const data = {
        test: true,
      };
      el.endPress({cancelled: true, actionData: data});
      expect(actionEvent).toBeNull();
    });
  });
});
