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
import {NotchedOutline} from '@material/mwc-notched-outline';
import {MDCSelectAdapter} from '@material/select/adapter';
import MDCSelectFoundation from '@material/select/foundation.js';
import {html, property, query, TemplateResult} from 'lit-element';
import {classMap} from 'lit-html/directives/class-map';
import {ifDefined} from 'lit-html/directives/if-defined';


// must be done to get past lit-analyzer checks
declare global {
  interface Element {
    floatingLabelFoundation?: MDCFloatingLabelFoundation;
    lineRippleFoundation?: MDCLineRippleFoundation;
  }
}

type CustomValidityState = {
  -readonly[P in keyof ValidityState]: ValidityState[P]
};

const createValidityObj =
    (customValidity: Partial<ValidityState> = {}): ValidityState => {
      /*
       * We need to make ValidityState an object because it is readonly and
       * we cannot use the spread operator. Also, we don't export
       * `CustomValidityState` because it is a leaky implementation and the user
       * already has access to `ValidityState` in lib.dom.ts. Also an interface
       * {a: Type} can be casted to {readonly a: Type} so passing any object
       * should be fine.
       */
      const objectifiedCustomValidity: Partial<CustomValidityState> = {};

      // eslint-disable-next-line guard-for-in
      for (const propName in customValidity) {
        /*
         * Casting is needed because ValidityState's props are all readonly and
         * thus cannot be set on `onjectifiedCustomValidity`. In the end, the
         * interface is the same as ValidityState (but not readonly), but the
         * function signature casts the output to ValidityState (thus readonly).
         */
        objectifiedCustomValidity[propName as keyof CustomValidityState] =
            customValidity[propName as keyof ValidityState];
      }

      return {
        badInput: false,
        customError: false,
        patternMismatch: false,
        rangeOverflow: false,
        rangeUnderflow: false,
        stepMismatch: false,
        tooLong: false,
        tooShort: false,
        typeMismatch: false,
        valid: true,
        valueMissing: false,
        ...objectifiedCustomValidity
      };
    };

/**
 * @fires selected {SelectedDetail}
 * @fires opened
 * @fires closed
 * @fires change
 * @fires invalid
 */
export abstract class SelectBase extends FormElement {
  protected mdcFoundation!: MDCSelectFoundation;

  protected readonly mdcFoundationClass = MDCSelectFoundation;

  @query('.mdc-select') protected mdcRoot!: HTMLElement;

  @query('.formElement') protected formElement!: HTMLInputElement;

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
    if (this.renderReady) {
      this.mdcFoundation.setDisabled(value);
    }
  })
  disabled = false;

  @property({type: Boolean}) outlined = false;

  @property({type: String}) label = '';

  @property({type: Boolean}) outlineOpen = false;

  @property({type: Number}) outlineWidth = 0;

  @property({type: String})
  @observer(function(this: SelectBase) {
    if (this.mdcFoundation) {
      this.reportValidity();
    }
  })
  value = '';

  @property({type: String}) protected selectedText = '';

  @property({type: String}) icon = '';

  @property({type: Boolean}) protected menuOpen = false;

  @property({type: String}) helper = '';

  @property({type: Boolean}) helperPersistent = false;

  @property({type: Boolean}) validateOnInitialRender = false;

  @property({type: String}) validationMessage = '';

  @property({type: Boolean}) required = false;

  @property({type: Boolean}) protected isUiValid = true;

  protected listeners: ({
    target: Element;
    name: string;
    cb: EventListenerOrEventListenerObject;
  })[] = [];
  protected onBodyClickBound: (evt: MouseEvent) => void = () => { /* init */ };
  protected _outlineUpdateComplete: null|Promise<unknown> = null;
  protected _menuUpdateComplete: null|Promise<unknown> = null;
  protected get shouldRenderHelperText(): boolean {
    return !!this.helper || !!this.validationMessage;
  }

  protected renderReady = false;

  validityTransform:
      ((value: string,
        nativeValidity: ValidityState) => Partial<ValidityState>)|null = null;

  protected _validity: ValidityState = createValidityObj();

  get validity(): ValidityState {
    this._checkValidity(this.value);

    return this._validity;
  }

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
      'mdc-select--with-leading-icon': !!this.icon,
      'mdc-select--required': this.required,
      'mdc-select--invalid': !this.isUiValid,
    };

    const describedby = this.shouldRenderHelperText ? 'helper-text' : undefined;

    return html`
      <div class="mdc-select ${classMap(classes)}">
        <input
            class="formElement"
            .value=${this.value}
            hidden
            ?required=${this.required}>
        ${this.icon ? this.renderIcon(this.icon) : ''}
        <div class="mdc-select__anchor" @click=${this.onClick}>
          <i class="mdc-select__dropdown-icon">
            <svg
                width="10px"
                height="5px"
                viewBox="7 10 10 5"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink">
              <polygon
                  stroke="none"
                  fill-rule="evenodd"
                  points="7 10 12 15 17 10">
              </polygon>
            </svg>
          </i>
          <!-- @ts-ignore -->
          <div
              class="mdc-select__selected-text"
              role="button"
              aria-invalid=${!this.isUiValid}
              aria-haspopup="listbox"
              aria-labelledby="label"
              aria-required=${this.required}
              aria-describedby=${ifDefined(describedby)}
              @focus=${this.onFocus}
              @blur=${this.onBlur}
              @keydown=${this.onKeydown}>
            ${this.selectedText}
          </div>
          ${outlinedOrUnderlined}
        </div>
        ${this.renderHelperText()}
        <mwc-menu
            innerRole="listbox"
            class="mdc-select__menu mdc-menu mdc-menu-surface"
            activatable
            .open=${this.menuOpen}
            .anchor=${this.anchorElement}
            @selected=${this.onSelected}
            @opened=${this.onOpened}
            @closed=${this.onClosed}>
            <slot></slot>
        </mwc-menu>
      </div>`;
  }

  protected renderHelperText() {
    const showValidationMessage = this.validationMessage && !this.isUiValid;
    const classes = {
      'mdc-select-helper-text--persistent':
          this.helperPersistent || showValidationMessage,
      'mdc-select-helper-text--validation-msg': showValidationMessage,
      'hidden': !this.shouldRenderHelperText,
    };

    return html`
        <p class="mdc-select-helper-text ${classMap(classes)}" id="helper-text">
          ${showValidationMessage ? this.validationMessage : this.helper}
        </p>`;
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
    return html`<i class="material-icons mdc-select__icon">${icon}</i>`;
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

        return menuElement.selected as ListItemBase | null;
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

  checkValidity(): boolean {
    const isValid = this._checkValidity(this.value);

    if (!isValid) {
      const invalidEvent =
          new Event('invalid', {bubbles: false, cancelable: true});
      this.dispatchEvent(invalidEvent);
    }

    return isValid;
  }

  reportValidity(): boolean {
    const isValid = this.checkValidity();

    this.isUiValid = isValid;

    return isValid;
  }

  protected _checkValidity(value: string) {
    const nativeValidity = this.formElement.validity;

    let validity = createValidityObj(nativeValidity);

    if (this.validityTransform) {
      const customValidity = this.validityTransform(value, validity);
      validity = {...validity, ...customValidity};
    }

    this._validity = validity;

    return this._validity.valid;
  }

  setCustomValidity(message: string) {
    this.validationMessage = message;
    this.formElement.setCustomValidity(message);
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

    this.mdcFoundation.isValid = () => true;
    this.mdcFoundation.setValid = () => undefined;
    this.mdcFoundation.setDisabled(this.disabled);


    if (this.validateOnInitialRender) {
      this.reportValidity();
    }

    this.renderReady = true;
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

    const menuElement = this.menuElement;

    if (menuElement && !menuElement.open) {
      this.reportValidity();
    }
  }

  protected onClick(evt: MouseEvent|TouchEvent) {
    if (this.mdcFoundation) {
      this.focus();
      const targetClientRect = (evt.target as Element).getBoundingClientRect();
      let xCoord = 0;

      if ('touches' in evt) {
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
