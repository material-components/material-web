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
import {LitElement, property, query} from 'lit-element';
import {html, TemplateResult} from 'lit-html';
import {classMap} from 'lit-html/directives/class-map';

export class CardBase extends LitElement {
  @query('[name="icon"]') protected _iconSlot!: HTMLSlotElement;

  @query('[name="button"]') protected _buttonSlot!: HTMLSlotElement;

  @property({type: Boolean}) outlined = false;

  @property({type: Boolean}) fullBleed = false;

  protected buttonCount = 0;
  protected iconCount = 0;

  protected onButtonSlotChanged() {
    const buttons = this._buttonSlot.assignedNodes();
    this.buttonCount = buttons.length;
    if (this.buttonCount > 0) {
      buttons.forEach((button) => {
        const buttonElement = button as HTMLElement;
        buttonElement.classList.add('mdc-card__action');
        buttonElement.classList.add('mdc-card__action--button');
      });
    }
    this.requestUpdate();
  }

  protected onIconSlotChanged() {
    const icons = this._iconSlot.assignedNodes();
    this.iconCount = icons.length;
    if (this.iconCount > 0) {
      icons.forEach((icon) => {
        const iconElement = icon as HTMLElement;
        iconElement.classList.add('mdc-card__action');
        iconElement.classList.add('mdc-card__action--icon');
      });
    }
    this.requestUpdate();
  }

  render() {
    const classes = {'mdc-card--outlined': this.outlined};
    return html`
        <div class="mdc-card ${classMap(classes)}">
            <slot></slot>
            ${this.renderActions()}
        </div>`;
  }

  protected renderActions() {
    const buttonSlotTemplate = html`<slot name="button" @slotchange=${
        this.onButtonSlotChanged}></slot>`;
    const iconSlotTemplate =
        html`<slot name="icon" @slotchange=${this.onIconSlotChanged}></slot>`;

    if (this.iconCount > 0 || this.buttonCount > 0) {
      const classes = {'mdc-card__actions--full-bleed': this.fullBleed};

      return html`
        <div class="mdc-card__actions ${classMap(classes)}">
          ${this.wrapButtonSlot(buttonSlotTemplate)}
          ${this.wrapIconSlot(iconSlotTemplate)}
        </div>`;
    }
    return html`
      ${buttonSlotTemplate}
      ${iconSlotTemplate}
    `;
  }

  protected wrapButtonSlot(buttonSlotTemplate: TemplateResult|string) {
    if (this.buttonCount > 0 && !this.fullBleed) {
      return html`
      <div class="mdc-card__action-buttons">
        ${buttonSlotTemplate}
      </div>`;
    } else {
      return buttonSlotTemplate;
    }
  }

  protected wrapIconSlot(iconSlotTemplate: TemplateResult|string) {
    if (this.iconCount > 0) {
      return html`
      <div class="mdc-card__action-icons">
        ${iconSlotTemplate}
      </div>`;
    } else {
      return iconSlotTemplate;
    }
  }
}
