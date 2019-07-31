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
import {addHasRemoveClass, FormElement, html, HTMLElementWithRipple, observer, property, query,} from '@material/mwc-base/form-element.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';
import {MDCRadioAdapter} from '@material/radio/adapter.js';
import MDCRadioFoundation from '@material/radio/foundation.js';

export class RadioBase extends FormElement {
  @query('.mdc-radio') protected mdcRoot!: HTMLElementWithRipple;

  @query('input')
  protected formElement!: HTMLInputElement

      @property({type: Boolean})
      @observer(function(this: RadioBase, checked: boolean) {
        this.formElement.checked = checked;
      }) checked = false;

  @property({type: Boolean})
  @observer(function(this: RadioBase, disabled: boolean) {
    this.mdcFoundation.setDisabled(disabled);
  })
  disabled = false;

  @property({type: String})
  @observer(function(this: RadioBase, value: string) {
    this.formElement.value = value;
  })
  value = '';

  @property({type: String}) name = '';

  protected mdcFoundationClass = MDCRadioFoundation;

  protected mdcFoundation!: MDCRadioFoundation;

  private _selectionController: SelectionController|null = null;

  constructor() {
    super();
    // Selection Controller is only needed for native ShadowDOM
    if (!window['ShadyDOM'] || !window['ShadyDOM']['inUse']) {
      this._selectionController = SelectionController.getController(this);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    if (this._selectionController) {
      this._selectionController.register(this);
    }
  }

  disconnectedCallback() {
    if (this._selectionController) {
      this._selectionController.unregister(this);
    }
  }

  focusNative() {
    this.formElement.focus();
  }

  get ripple() {
    return this.mdcRoot.ripple;
  }

  protected createAdapter(): MDCRadioAdapter {
    return {
      ...addHasRemoveClass(this.mdcRoot),
      setNativeControlDisabled: (disabled: boolean) => {
        this.formElement.disabled = disabled;
      },
    };
  }

  private _changeHandler() {
    this.checked = this.formElement.checked;
    if (this._selectionController) {
      this._selectionController.update(this);
    }
  }

  private _focusHandler() {
    if (this._selectionController) {
      this._selectionController.focus(this);
    }
  }

  private _clickHandler() {
    // Firefox has weird behavior with radios if they are not focused
    this.formElement.focus();
  }

  render() {
    return html`
      <div class="mdc-radio" .ripple="${ripple()}">
        <input
          class="mdc-radio__native-control"
          type="radio"
          name="${this.name}"
          .checked="${this.checked}"
          .value="${this.value}"
          @change="${this._changeHandler}"
          @focus="${this._focusHandler}"
          @click="${this._clickHandler}">
        <div class="mdc-radio__background">
          <div class="mdc-radio__outer-circle"></div>
          <div class="mdc-radio__inner-circle"></div>
        </div>
      </div>`;
  }

  firstUpdated() {
    super.firstUpdated();
    if (this._selectionController) {
      this._selectionController.update(this);
    }
  }
}

/**
 * Unique symbol for marking roots
 */
const selectionController = Symbol('selection controller');

class SelectionSet {
  selected: RadioBase|null = null;
  ordered: RadioBase[]|null = null;
  readonly set = new Set<RadioBase>();
}

export class SelectionController {
  private sets: {[name: string]: SelectionSet} = {};

  private focusedSet: SelectionSet|null = null;

  private mouseIsDown = false;

  private updating = false;

  static getController(element: HTMLElement) {
    const root = element.getRootNode() as Node &
        {[selectionController]?: SelectionController};
    if (!root[selectionController]) {
      root[selectionController] = new SelectionController(root);
    }
    return root[selectionController] as SelectionController;
  }

  constructor(element: Node) {
    element.addEventListener(
        'keydown', (e: Event) => this.keyDownHandler(e as KeyboardEvent));
    element.addEventListener('mousedown', () => this.mousedownHandler());
    element.addEventListener('mouseup', () => this.mouseupHandler());
  }

  protected keyDownHandler(e: KeyboardEvent) {
    if (!(e.target instanceof RadioBase)) {
      return;
    }
    const element = e.target;
    if (!this.has(element)) {
      return;
    }
    if (e.key == 'ArrowRight' || e.key == 'ArrowDown') {
      this.next(element);
    } else if (e.key == 'ArrowLeft' || e.key == 'ArrowUp') {
      this.previous(element);
    }
  }

  protected mousedownHandler() {
    this.mouseIsDown = true;
  }

  protected mouseupHandler() {
    this.mouseIsDown = false;
  }

  has(element: RadioBase) {
    const set = this.getSet(element.name);
    return set.set.has(element);
  }

  previous(element: RadioBase) {
    const order = this.getOrdered(element);
    const i = order.indexOf(element);
    this.select(order[i - 1] || order[order.length - 1]);
  }

  next(element: RadioBase) {
    const order = this.getOrdered(element);
    const i = order.indexOf(element);
    this.select(order[i + 1] || order[0]);
  }

  select(element: RadioBase) {
    element.click();
  }

  /**
   * Helps to track the focused selection group and if it changes, focuses
   * the selected item in the group. This matches native radio button behavior.
   */
  focus(element: RadioBase) {
    // Only manage focus state when using keyboard
    if (this.mouseIsDown) {
      return;
    }
    const set = this.getSet(element.name);
    const currentFocusedSet = this.focusedSet;
    this.focusedSet = set;
    if (currentFocusedSet != set && set.selected && set.selected != element) {
      set.selected!.focusNative();
    }
  }

  getOrdered(element: RadioBase) {
    const set = this.getSet(element.name);
    if (!set.ordered) {
      set.ordered = Array.from(set.set);
      set.ordered.sort(
          (a, b) =>
              a.compareDocumentPosition(b) == Node.DOCUMENT_POSITION_PRECEDING ?
              1 :
              0);
    }
    return set.ordered;
  }

  getSet(name: string) {
    if (!this.sets[name]) {
      this.sets[name] = new SelectionSet();
    }
    return this.sets[name];
  }

  register(element: RadioBase) {
    const set = this.getSet(element.name);
    set.set.add(element);
    set.ordered = null;
  }

  unregister(element: RadioBase) {
    const set = this.getSet(element.name);
    set.set.delete(element);
    set.ordered = null;
    if (set.selected == element) {
      set.selected = null;
    }
  }

  update(element: RadioBase) {
    if (this.updating) {
      return;
    }
    this.updating = true;
    if (element.checked) {
      const set = this.getSet(element.name);
      for (const e of set.set) {
        e.checked = (e == element);
      }
      set.selected = element;
    }
    this.updating = false;
  }
}
