/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import '@material/web/focus/focus-ring.js';
import '@material/web/ripple/ripple.js';

import {ActionElement} from '@material/web/actionelement/action-element.js';
import {ariaProperty} from '@material/web/decorators/aria-property.js';
import {MdRipple} from '@material/web/ripple/ripple.js';
import {html, TemplateResult} from 'lit';
import {property, query, state} from 'lit/decorators.js';
import {ClassInfo, classMap} from 'lit/directives/class-map.js';

/**
 * Base class for all actions.
 * @soyCompatible
 */
export abstract class Action extends ActionElement {
  @property({type: Boolean, reflect: true}) isFocusable = false;

  @property({type: Boolean, reflect: true}) isTouchable = false;

  @property({type: Boolean, reflect: true}) disabled = false;

  @state() showFocusRing = false;

  @query('md-ripple') ripple?: MdRipple|null;

  /** @soyPrefixAttribute */
  @ariaProperty  // tslint:disable-line:no-new-decorators
  @property({type: String, attribute: 'aria-label'})
  override ariaLabel!: string;

  /** @soyTemplate */
  protected getRootClasses(): ClassInfo {
    return {
      'md3-chip__action': true,
    };
  }

  /** @soyTemplate */
  protected getRippleClasses(): ClassInfo {
    return {
      'md3-chip__ripple': true,
    };
  }

  /** @soyTemplate */
  protected renderTouchTarget(): TemplateResult {
    return  this.isTouchable ?
        html`<span class="md3-chip__action-touch"></span>` : html`` ;
  }

  /** @soyTemplate */
  protected renderRipple(): TemplateResult {
    return html`
      <md-ripple class="${classMap(this.getRippleClasses())}"
          ?disabled="${this.disabled}">
      </md-ripple>`;
  }

  /** @soyTemplate */
  protected renderFocusRing(): TemplateResult {
    return html`
      <md-focus-ring .visible="${this.showFocusRing}"></md-focus-ring>`;
  }
}
