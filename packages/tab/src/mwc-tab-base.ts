/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
// Make TypeScript not remove the import.
import '@material/mwc-tab-indicator';

import {addHasRemoveClass, BaseElement} from '@material/mwc-base/base-element.js';
import {ripple} from '@material/mwc-ripple/ripple-directive';
import {TabIndicator} from '@material/mwc-tab-indicator';
import {MDCTabAdapter} from '@material/tab/adapter';
import MDCTabFoundation from '@material/tab/foundation';
import {html, property, query} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';

import {style} from './mwc-tab-css';

// used for generating unique id for each tab
let tabIdCounter = 0;

export class TabBase extends BaseElement {
  protected mdcFoundation!: MDCTabFoundation;

  protected readonly mdcFoundationClass = MDCTabFoundation;

  @query('.mdc-tab') protected mdcRoot!: HTMLElement;

  @query('mwc-tab-indicator') protected tabIndicator!: TabIndicator;

  @property() label = '';

  @property() icon = '';

  @property({type: Boolean}) hasImageIcon = false;

  @property({type: Boolean}) isFadingIndicator = false;

  @property({type: Boolean}) minWidth = false;

  @property({type: Boolean}) isMinWidthIndicator = false;

  @property({type: Boolean, reflect: true, attribute: 'active'})
  get active(): boolean {
    return this._active;
  }

  @property() indicatorIcon = '';

  @property({type: Boolean}) stacked = false;

  protected _active = false;

  /**
   * Other properties
   * indicatorContent <slot>
   * previousIndicatorClientRect (needed?)
   * onTransitionEnd (needed?)
   */

  @query('mwc-tab-indicator') private _tabIndicator!: HTMLElement;

  @query('.mdc-tab__content') private _contentElement!: HTMLElement;

  private _handleClick() {
    this.mdcFoundation.handleClick();
  }

  protected createRenderRoot() {
    return this.attachShadow({mode: 'open', delegatesFocus: true});
  }

  connectedCallback() {
    this.dir = document.dir;
    super.connectedCallback();
  }

  static styles = style;

  protected firstUpdated() {
    super.firstUpdated();
    // create an unique id
    this.id = this.id || `mdc-tab-${++tabIdCounter}`;
  }

  protected render() {
    const classes = {
      'mdc-tab--min-width': this.minWidth,
      'mdc-tab--stacked': this.stacked,
    };

    let iconTemplate = html``;
    if (this.hasImageIcon || this.icon) {
      // NOTE: MUST be on same line as spaces will cause vert alignment issues
      // in IE
      iconTemplate = html`
        <span class="mdc-tab__icon material-icons"><slot name="icon">${
          this.icon}</slot></span>`;
    }

    let labelTemplate = html``;
    if (this.label) {
      labelTemplate = html`
        <span class="mdc-tab__text-label">${this.label}</span>`;
    }

    const rippleDirective = ripple({
      interactionNode: this,
      unbounded: false,
    });

    return html`
      <button
        @click="${this._handleClick}"
        class="mdc-tab ${classMap(classes)}"
        role="tab"
        aria-selected="false"
        tabindex="-1">
        <span class="mdc-tab__content">
          ${iconTemplate}
          ${labelTemplate}
          ${this.isMinWidthIndicator ? this.renderIndicator() : ''}
        </span>
        ${this.isMinWidthIndicator ? '' : this.renderIndicator()}
        <span class="mdc-tab__ripple" .ripple="${rippleDirective}"></span>
      </button>`;
  }

  protected renderIndicator() {
    return html`<mwc-tab-indicator
        .icon="${this.indicatorIcon}"
        .fade="${this.isFadingIndicator}"></mwc-tab-indicator>`;
  }


  protected createAdapter(): MDCTabAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      setAttr: (attr: string, value: string) =>
          this.mdcRoot.setAttribute(attr, value),
      activateIndicator: (previousIndicatorClientRect: ClientRect) =>
          (this._tabIndicator as TabIndicator)
              .activate(previousIndicatorClientRect),
      deactivateIndicator: () =>
          (this._tabIndicator as TabIndicator).deactivate(),
      notifyInteracted: () => this.dispatchEvent(
          new CustomEvent(MDCTabFoundation.strings.INTERACTED_EVENT, {
            detail: {tabId: this.id},
            bubbles: true,
            composed: true,
            cancelable: true,
          })),
      getOffsetLeft: () => this.offsetLeft,
      getOffsetWidth: () => this.mdcRoot.offsetWidth,
      getContentOffsetLeft: () => this._contentElement.offsetLeft,
      getContentOffsetWidth: () => this._contentElement.offsetWidth,
      focus: () => this.mdcRoot.focus(),
    };
  }

  activate(clientRect: ClientRect) {
    this.mdcFoundation.activate(clientRect);
    this.setActive(this.mdcFoundation.isActive());
  }

  deactivate() {
    this.mdcFoundation.deactivate();
    this.setActive(this.mdcFoundation.isActive());
  }

  protected setActive(newValue: boolean) {
    const oldValue = this.active;

    if (oldValue !== newValue) {
      this._active = newValue;
      this.requestUpdate('active', oldValue);
    }
  }

  computeDimensions() {
    return this.mdcFoundation.computeDimensions();
  }

  computeIndicatorClientRect() {
    return this.tabIndicator.computeContentClientRect();
  }

  // NOTE: needed only for ShadyDOM where delegatesFocus is not implemented
  focus() {
    this.mdcRoot.focus();
  }
}
