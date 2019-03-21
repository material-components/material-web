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
import { html, property, customElement, classMap, query, LitElement } from '@material/mwc-base/base-element';
import { style } from './mwc-card-actions-css.js';

declare global {
  interface HTMLElementTagNameMap {
    'mwc-card-actions': CardActions;
  }
}


@customElement('mwc-card-actions' as any)
export class CardActions extends LitElement {

  @query('[name="icon"]')
  protected _iconSlot!: HTMLSlotElement;

  @query('[name="button"]')
  protected _buttonSlot!: HTMLSlotElement;

  @property({type: Boolean})
  fullBleed = false;

  protected buttonCount = 0;
  protected iconCount = 0;

  firstUpdated() {
    this._buttonSlot.addEventListener('slotchange', this.onButtonSlotChanged.bind(this));
    this._iconSlot.addEventListener('slotchange', this.onIconSlotChanged.bind(this));
  }

  protected onButtonSlotChanged() { 
    const buttons = this._buttonSlot.assignedNodes();
    this.buttonCount = buttons.length;
    if(this.buttonCount > 0) {
      buttons.forEach(button => { 
        const buttonElement = button as HTMLElement;
        if(!buttonElement.classList.contains('mdc-card__action')) {
          buttonElement.classList.add('mdc-card__action');
        }
        if(!buttonElement.classList.contains('mdc-card__action--button')) {
          buttonElement.classList.add('mdc-card__action--button');
        }
      })
    }
    this.requestUpdate();
  };

  protected onIconSlotChanged() { 
    const icons = this._iconSlot.assignedNodes();
    this.iconCount = icons.length;
    if(this.iconCount > 0) {
      icons.forEach(icon => { 
        const iconElement = icon as HTMLElement;
        if(!iconElement.classList.contains('mdc-card__action')) {
          iconElement.classList.add('mdc-card__action');
        }
        if(!iconElement.classList.contains('mdc-card__action--icon')) {
          iconElement.classList.add('mdc-card__action--icon');
        }
      })
    }
    this.requestUpdate();
  };


  static styles = style;

  render() {
    const classes = {
      'mdc-card__actions': true,
      'mdc-card__actions--full-bleed': this.fullBleed
    };    

    return html`
      <div class="${classMap(classes)}">
        ${ this.buttonCount > 1 || (this.iconCount > 0 && this.buttonCount > 0) ? html`
        <div class="mdc-card__action-buttons">
          <slot name="button"></slot>
        </div>` 
        : html`<slot name="button"></slot>` }          
        ${ this.iconCount > 0 ? html`
        <div class="mdc-card__action-icons">
          <slot name="icon"></slot>
        </div>` 
        : html`<slot name="icon"></slot>` }
      </div>
      `;
  }

}