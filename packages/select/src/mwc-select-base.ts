/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

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
import '@material/mwc-notched-outline';
import '@material/mwc-menu';

import {MDCFloatingLabelFoundation} from '@material/floating-label/foundation.js';
import {MDCLineRippleFoundation} from '@material/line-ripple/foundation.js';
import {addHasRemoveClass, FormElement, observer} from '@material/mwc-base/form-element.js';
import {floatingLabel, FloatingLabel} from '@material/mwc-floating-label';
import {lineRipple, LineRipple} from '@material/mwc-line-ripple';
import {ListItemBase} from '@material/mwc-list/mwc-list-item-base';
import {Menu} from '@material/mwc-menu';
import {menuAnchor} from '@material/mwc-menu/mwc-menu-surface-anchor-directive';
import {NotchedOutline} from '@material/mwc-notched-outline';
import {MDCSelectAdapter} from '@material/select/adapter';
import MDCSelectFoundation from '@material/select/foundation.js';
import {html, property, query, TemplateResult} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';


// must be done to get past lit-analyzer checks
declare global {
  interface Element {
    floatingLabelFoundation?: MDCFloatingLabelFoundation;
    lineRippleFoundation?: MDCLineRippleFoundation;
  }
}

export abstract class SelectBase extends FormElement {
  protected mdcFoundation!: MDCSelectFoundation;

  protected readonly mdcFoundationClass = MDCSelectFoundation;

  @query('.mdc-select') protected mdcRoot!: HTMLElement;

  @query('.formElement') protected formElement!: HTMLDivElement;

  @query('slot') protected slotElement!: HTMLSlotElement|null;

  @query('select') protected nativeSelectElement!: HTMLSelectElement|null;

  @query('input') protected nativeInputElement!: HTMLInputElement|null;

  @query('.mdc-line-ripple') protected lineRippleElement!: LineRipple|null;

  @query('.mdc-floating-label') protected labelElement!: FloatingLabel|null;

  @query('mwc-notched-outline') protected outlineElement!: NotchedOutline|null;

  @query('.mdc-menu') protected menuElement!: Menu|null;

  @query('.mdc-select__selected-text')
  protected selectedTextElement!: HTMLDivElement|null;

  @query('.mdc-select__anchor') protected anchorElement!: HTMLDivElement|null;

  @property({type: Boolean, attribute: 'disabled', reflect: true})
  @observer(function(this: SelectBase, value: boolean) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setDisabled(value);
    }
  })
  disabled = false;

  @property({type: Boolean}) outlined = false;

  @property({type: String}) label = '';

  @property({type: Boolean}) outlineOpen = false;

  @property({type: Number}) outlineWidth = 0;

  @property({type: String}) value = '';

  @property({type: String}) protected selectedText = '';

  @property({type: String}) icon = '';

  @property({type: Boolean}) protected menuOpen = false;

  protected listeners: ({
    target: Element;
    name: string;
    cb: EventListenerOrEventListenerObject;
  })[] = [];
  protected onBodyClickBound: (evt: MouseEvent) => void = () => { /* init */ };
  protected _outlineUpdateComplete: null|Promise<unknown> = null;
  protected _menuUpdateComplete: null|Promise<unknown> = null;

  render() {
    let outlinedOrUnderlined = html``;

    if (this.outlined) {
      outlinedOrUnderlined = this.renderOutlined();
    } else {
      outlinedOrUnderlined = this.renderUnderlined();
    }

    const classes = {
      'mdc-select--disabled': this.disabled,
      'mdc-select--no-label': !this.label,
      'mdc-select--outlined': this.outlined,
      'mdc-select--with-leading-icon': this.icon,
    };

    return html`
      <div class="mdc-select ${classMap(classes)}">
        <input class=".formElement" .value=${this.value} hidden>
        ${this.icon ? this.renderIcon(this.icon) : ''}
        <!-- @ts-ignore -->
        <div class="mdc-select__anchor" .anchoring=${menuAnchor('mwc-menu')}>
          <i class="mdc-select__dropdown-icon"></i>
          <!-- @ts-ignore -->
          <div
              class="mdc-select__selected-text"
              role="button"
              aria-haspopup="listbox"
              aria-labelledby="label"
              @focus=${this.onFocus}
              @blur=${this.onBlur}
              @keydown=${this.onKeydown}
              @click=${this.onClick}>
            ${this.selectedText}
          </div>
          ${outlinedOrUnderlined}
        </div>
        <mwc-menu
            role="listbox"
            class="mdc-select__menu mdc-menu mdc-menu-surface"
            .open=${this.menuOpen}
            @selected=${this.onSelected}
            @opened=${this.onOpened}
            @closed=${this.onClosed}>
            <slot></slot>
        </mwc-menu>
      </div>`;
  }

  protected renderOutlined() {
    let labelTemplate: TemplateResult|string = '';
    if (this.label) {
      labelTemplate = this.renderLabel();
    }
    return html`
      <mwc-notched-outline
          .width=${this.outlineWidth}
          .open=${this.outlineOpen}
          class="mdc-notched-outline">
        ${labelTemplate}
      </mwc-notched-outline>`;
  }

  protected renderUnderlined() {
    let labelTemplate: TemplateResult|string = '';
    if (this.label) {
      labelTemplate = this.renderLabel();
    }

    return html`
      ${labelTemplate}
      <div .lineRippleFoundation=${lineRipple()}></div>
    `;
  }

  protected renderLabel() {
    return html`
      <label
          .floatingLabelFoundation=${floatingLabel(this.label)}
          @labelchange=${this.onLabelChange}
          id="label">
        ${this.label}
      </label>
    `;
  }

  protected renderIcon(icon: string) {
    return html`<i class="material-icons mdc-text-field__icon">${icon}</i>`;
  }

  createAdapter(): MDCSelectAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      activateBottomLine: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.activate();
        }
      },
      deactivateBottomLine: () => {
        if (this.lineRippleElement) {
          this.lineRippleElement.lineRippleFoundation.deactivate();
        }
      },
      getSelectedMenuItem: () => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return null;
        }

        return menuElement.selected;
      },
      hasLabel: () => {
        return !!this.label;
      },
      floatLabel: (shouldFloat) => {
        if (this.labelElement) {
          this.labelElement.floatingLabelFoundation.float(shouldFloat);
        }
      },
      getLabelWidth: () => {
        if (this.labelElement) {
          return this.labelElement.floatingLabelFoundation.getWidth();
        }

        return 0;
      },
      hasOutline: () => this.outlined,
      notchOutline: (labelWidth) => {
        const outlineElement = this.outlineElement;
        if (outlineElement && !this.outlineOpen) {
          this.outlineWidth = labelWidth;
          this.outlineOpen = true;
        }
      },
      closeOutline: () => {
        if (this.outlineElement) {
          this.outlineOpen = false;
        }
      },
      setRippleCenter: (normalizedX) => {
        if (this.lineRippleElement) {
          const foundation = this.lineRippleElement.lineRippleFoundation;
          foundation.setRippleCenter(normalizedX);
        }
      },
      notifyChange: (value) => {
        this.value = value;
        const ev = new Event('change', {bubbles: true});
        this.dispatchEvent(ev);
      },
      setSelectedText: (value) => this.selectedText = value,
      isSelectedTextFocused: () => {
        const selectedTextElement = this.selectedTextElement;

        if (!selectedTextElement) {
          return false;
        }

        const rootNode =
            selectedTextElement.getRootNode() as ShadowRoot | Document;

        return rootNode.activeElement === selectedTextElement;
      },
      getSelectedTextAttr: (attr) => {
        const selectedTextElement = this.selectedTextElement;

        if (!selectedTextElement) {
          return null;
        }

        return selectedTextElement.getAttribute(attr);
      },
      setSelectedTextAttr: (attr, value) => {
        const selectedTextElement = this.selectedTextElement;

        if (!selectedTextElement) {
          return;
        }

        return selectedTextElement.setAttribute(attr, value);
      },
      openMenu: () => {
        this.menuOpen = true;
      },
      closeMenu: () => {
        this.menuOpen = false;
      },
      getAnchorElement: () => this.anchorElement,
      setMenuAnchorElement: () => {
        /* Handled by anchor directive */
      },
      setMenuAnchorCorner: (anchorCorner) => {
        const menuElement = this.menuElement;
        if (menuElement) {
          menuElement.setAnchorCorner(anchorCorner);
        }
      },
      setMenuWrapFocus: (wrapFocus) => {
        const menuElement = this.menuElement;
        if (menuElement) {
          menuElement.wrapFocus = wrapFocus;
        }
      },
      setAttributeAtIndex: (index: number, attr: string, value: string) => {
        const menuElement = this.menuElement;
        if (!menuElement) {
          return;
        }

        const element = menuElement.items[index];

        if (!element) {
          return;
        }

        element.setAttribute(attr, value);
      },
      removeAttributeAtIndex: (index, attr) => {
        const menuElement = this.menuElement;
        if (!menuElement) {
          return;
        }

        const element = menuElement.items[index];

        if (!element) {
          return;
        }

        element.removeAttribute(attr);
      },
      focusMenuItemAtIndex: (index) => {
        const menuElement = this.menuElement;
        if (!menuElement) {
          return;
        }

        const element = menuElement.items[index];

        if (!element) {
          return;
        }

        (element as HTMLElement).focus();
      },
      getMenuItemCount: () => {
        const menuElement = this.menuElement;

        if (menuElement) {
          return menuElement.items.length;
        }

        return 0;
      },
      getMenuItemValues: () => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return [];
        }

        const items = menuElement.items;

        return items.map((item) => item.value);
      },
      getMenuItemTextAtIndex: (index) => {
        const menuElement = this.menuElement;
        if (!menuElement) {
          return '';
        }

        const element = menuElement.items[index];

        if (!element) {
          return '';
        }

        return element.text;
      },
      getMenuItemAttr: (menuItem) => {
        const listItem = menuItem as ListItemBase;
        return listItem.value;
      },
      addClassAtIndex: (index, className) => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return;
        }

        const element = menuElement.items[index];

        if (!element) {
          return;
        }

        element.classList.add(className);
      },
      removeClassAtIndex: (index, className) => {
        const menuElement = this.menuElement;

        if (!menuElement) {
          return;
        }

        const element = menuElement.items[index];

        if (!element) {
          return;
        }

        element.classList.remove(className);
      },
    };
  }

  async _getUpdateComplete() {
    await super._getUpdateComplete();
    await Promise.all([
      this._outlineUpdateComplete,
      this._menuUpdateComplete,
    ]);
  }

  async firstUpdated() {
    const menuElement = this.menuElement;
    const outlineElement = this.outlineElement;
    if (outlineElement) {
      this._outlineUpdateComplete = outlineElement.updateComplete;
      await this._outlineUpdateComplete;
    }

    if (menuElement) {
      this._menuUpdateComplete = menuElement.updateComplete;
      await this._menuUpdateComplete;
    }

    super.firstUpdated();

    this.mdcFoundation.setDisabled(this.disabled);

    // if (this.validateOnInitialRender) {
    //   this.reportValidity();
    // }

    if (menuElement) {
      const selected = menuElement.selected;

      if (selected) {
        const listIndex = menuElement.index;
        const index = listIndex instanceof Array ? listIndex[0] : listIndex;
        if (index !== -1) {
          this.select(index);
        }
      }
    }
  }

  select(index: number) {
    if (this.mdcFoundation) {
      this.mdcFoundation.setSelectedIndex(index);
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();

    for (const listener of this.listeners) {
      listener.target.removeEventListener(listener.name, listener.cb);
    }
  }

  focus() {
    const focusEvt = new CustomEvent('focus');
    const selectedTextElement = this.selectedTextElement;

    if (selectedTextElement) {
      selectedTextElement.dispatchEvent(focusEvt);
      selectedTextElement.focus();
    }
  }

  blur() {
    const focusEvt = new CustomEvent('blur');
    const selectedTextElement = this.selectedTextElement;

    if (selectedTextElement) {
      selectedTextElement.dispatchEvent(focusEvt);
      selectedTextElement.blur();
    }
  }

  protected onFocus() {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleFocus();
    }
  }

  protected onBlur() {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleBlur();
    }
  }

  protected onClick(evt: MouseEvent|TouchEvent) {
    if (this.mdcFoundation) {
      this.focus();
      const targetClientRect = (evt.target as Element).getBoundingClientRect();
      let xCoord = 0;

      if (evt instanceof TouchEvent) {
        xCoord = evt.touches[0].clientX;
      } else {
        xCoord = evt.clientX;
      }

      const normalizedX = xCoord - targetClientRect.left;
      this.mdcFoundation.handleClick(normalizedX);
    }
  }

  protected onKeydown(evt: KeyboardEvent) {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleKeydown(evt);
    }
  }

  protected onSelected(evt: CustomEvent<{index: number}>) {
    if (this.mdcFoundation) {
      this.mdcFoundation.handleMenuItemAction(evt.detail.index);
    }
  }

  protected onOpened() {
    if (this.mdcFoundation) {
      this.menuOpen = true;
      this.mdcFoundation.handleMenuOpened();
    }
  }

  protected onClosed() {
    if (this.mdcFoundation) {
      this.menuOpen = false;
      this.mdcFoundation.handleMenuClosed();
    }
  }

  protected async onLabelChange() {
    if (this.label) {
      await this.layout();
    }
  }

  async layout() {
    if (this.mdcFoundation) {
      this.mdcFoundation.layout();
    }

    await this.updateComplete;

    if (this.labelElement && this.outlineElement) {
      /* When the textfield automatically notches due to a value and label
       * being defined, the textfield may be set to `display: none` by the user.
       * this means that the notch is of size 0px. We provide this function so
       * that the user may manually resize the notch to the floated label's
       * width.
       */
      if (this.outlineOpen) {
        const labelWidth = this.labelElement.floatingLabelFoundation.getWidth();
        this.outlineWidth = labelWidth;
      }
    }
  }
}
