/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {doesElementContainFocus} from '@material/mwc-base/utils';
import {fixture, TestFixture} from 'google3/third_party/javascript/material_web_components/testing/helpers';
import * as hanbi from 'hanbi';
import {html, TemplateResult} from 'lit';
import {customElement} from 'lit/decorators';

import {MDNavigationTab} from '../navigation-tab';

@customElement('md-test-navigation-tab')
class TestNavigationTab extends MDNavigationTab {
  getFoundation() {
    return this.mdcFoundation;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'md-test-navigation-tab': TestNavigationTab;
  }
}

interface NavigationTabProps {
  active: boolean;
  hideInactiveLabel: boolean;
  label: string;
  ariaLabel: string;
  badgeValue: string;
  showBadge: boolean;
  activeIconTemplate: TemplateResult;
  inactiveIconTemplate: TemplateResult;
  onNavigationTabRendered(): void;
}

const defaultNavTabElement =
    html`<md-test-navigation-tab></md-test-navigation-tab>`;

const navTabElement = (propsInit: Partial<NavigationTabProps>) => {
  return html`
    <md-test-navigation-tab
      ?active=${propsInit.active === true}
      .hideInactiveLabel=${propsInit.hideInactiveLabel === true}
      .showBadge=${propsInit.showBadge === true}
      .label=${propsInit.label}
      .ariaLabel=${propsInit.ariaLabel}
      .badgeValue=${propsInit.badgeValue ?? ''}
      @navigation-tab-rendered=${propsInit.onNavigationTabRendered}>
      ${propsInit.activeIconTemplate ?? html``}
      ${propsInit.inactiveIconTemplate ?? html``}</md-test-navigation-tab>
  `;
};

describe('mwc-navigation-tab', () => {
  let fixt: TestFixture;
  let element: TestNavigationTab;

  afterEach(() => {
    fixt.remove();
  });

  describe('basic', () => {
    beforeEach(async () => {
      fixt = await fixture(defaultNavTabElement);
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('initializes as an mwc-navigation-tab', () => {
      expect(element).toBeInstanceOf(MDNavigationTab);
      expect(element.active).toBeFalse();
      expect(element.hideInactiveLabel).toBeFalse();
      expect(element.label).toBeUndefined();
      expect(element.badgeValue).toEqual('');
      expect(element.showBadge).toBeFalse();
    });

    it('emits interaction event on click', () => {
      const interactionHandler = hanbi.spy();
      element.addEventListener(
          'navigation-tab-interaction', interactionHandler.handler);
      const tab = element.shadowRoot!.querySelector<HTMLElement>(
          '.mdc-navigation-tab')!;
      tab.click();
      expect(interactionHandler.called).toBeTrue();
    });

    it('focus() sets focus on button element', () => {
      const button = element.shadowRoot!.querySelector('button')!;
      element.focus();
      expect(doesElementContainFocus(button)).toBeTrue();
    });

    describe('handleClick()', () => {
      it('should call foundation.handleClick()', () => {
        const foundation = element.getFoundation();
        spyOn(foundation, 'handleClick').and.callThrough();
        element.click();
        expect(foundation.handleClick).toHaveBeenCalledTimes(1);
      });
    });
  });

  it('on render navigation-tab-rendered event fires', async () => {
    const renderedHandler = hanbi.spy();
    fixt = await fixture(navTabElement({
      onNavigationTabRendered: () => renderedHandler.handler(),
    }));
    expect(renderedHandler.called).toBeTrue();
  });

  describe('active', () => {
    beforeEach(async () => {
      fixt = await fixture(navTabElement({active: true}));
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('affects `aria-selected` of native button', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      expect(button.getAttribute('aria-selected')).toEqual('true');

      element.active = false;
      await element.updateComplete;
      expect(button.getAttribute('aria-selected')).toEqual('false');
    });

    it('affects `tabindex` of native button', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      expect(button.getAttribute('tabindex')).toEqual('0');

      element.active = false;
      await element.updateComplete;
      expect(button.getAttribute('tabindex')).toEqual('-1');
    });

    it('sets the correct classes', () => {
      const navTab = element.shadowRoot!.querySelector('.mdc-navigation-tab')!;
      expect(navTab.classList.contains('mdc-navigation-tab--active'))
          .toBeTrue();
    });
  });

  describe('hideInactiveLabel', () => {
    beforeEach(async () => {
      fixt = await fixture(navTabElement({hideInactiveLabel: true}));
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('sets the correct classes', () => {
      const navTab = element.shadowRoot!.querySelector('.mdc-navigation-tab')!;
      expect(
          navTab.classList.contains('mdc-navigation-tab--hide-inactive-label'))
          .toBeTrue();
    });
  });

  describe('label', () => {
    beforeEach(async () => {
      fixt = await fixture(navTabElement({label: 'foo'}));
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('displays label text', () => {
      const content =
          element.shadowRoot!.querySelector('.mdc-navigation-tab__label-text')!;
      expect(content.textContent!.trim()).toEqual('foo');
    });
  });

  describe('ariaLabel', () => {
    beforeEach(async () => {
      fixt = await fixture(navTabElement({ariaLabel: 'bar', label: 'foo'}));
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('affects `aria-label` of native button', async () => {
      const button = element.shadowRoot!.querySelector('button')!;
      expect(button.getAttribute('aria-label')).toEqual('bar');
    });
  });

  describe('showBadge', () => {
    beforeEach(async () => {
      fixt = await fixture(navTabElement({showBadge: true}));
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('displays small badge', () => {
      const badge =
          element.shadowRoot!.querySelector('.mdc-navigation-tab__badge')!;
      expect(badge.classList.contains('mdc-navigation-tab__badge-large'))
          .toBeFalse();
    });

    it('does not display badge if showBadge is false', async () => {
      element.showBadge = false;
      await element.updateComplete;
      const badge =
          element.shadowRoot!.querySelector('.mdc-navigation-tab__badge');
      expect(badge).toEqual(null);
    });
  });

  describe('badgeValue', () => {
    beforeEach(async () => {
      fixt = await fixture(navTabElement({badgeValue: '9', showBadge: true}));
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('displays large badge', () => {
      const badge =
          element.shadowRoot!.querySelector('.mdc-navigation-tab__badge')!;
      expect(badge.classList.contains('mdc-navigation-tab__badge-large'))
          .toBeTrue();
    });

    it('displays badge value', () => {
      const badge =
          element.shadowRoot!.querySelector('.mdc-navigation-tab__badge')!;
      expect(badge.textContent!.trim()).toEqual('9');
    });
  });

  describe('icons', () => {
    beforeEach(async () => {
      fixt = await fixture(navTabElement({
        activeIconTemplate:
            html`<i slot="activeIcon" class="material-icons">star</i>`,
        inactiveIconTemplate:
            html`<i slot="inactiveIcon" class="material-icons">star_border</i>`
      }));
      element = fixt.root.querySelector('md-test-navigation-tab')!;
      await element.updateComplete;
    });

    it('nodes with `slot=activeIcon` will serve as the active icon', () => {
      const icon = element.querySelector<HTMLElement>('[slot="activeIcon"]')!;
      expect(icon.textContent!.trim()).toEqual('star');
    });

    it('nodes with `slot=inactiveIcon` will serve as the inactive icon', () => {
      const icon = element.querySelector<HTMLElement>('[slot="inactiveIcon"]')!;
      expect(icon.textContent!.trim()).toEqual('star_border');
    });
  });
});
