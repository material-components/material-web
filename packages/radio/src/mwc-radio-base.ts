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
import {addHasRemoveClass, FormElement, HTMLElementWithRipple} from '@material/mwc-base/form-element.js';
import {observer} from '@material/mwc-base/observer.js';
import {ripple} from '@material/mwc-ripple/ripple-directive.js';
import {MDCRadioAdapter} from '@material/radio/adapter.js';
import MDCRadioFoundation from '@material/radio/foundation.js';
import {html, property, query} from 'lit-element';

/**
 * @fires checked
 */
export class RadioBase extends FormElement {
  @query('.mdc-radio') protected mdcRoot!: HTMLElement;

  @query('input') protected formElement!: HTMLInputElement;

  @query('.mdc-radio__ripple') protected rippleElement!: HTMLElementWithRipple;

  private _checked = false;

  @property({type: Boolean}) global = false;

  @property({type: Boolean, reflect: true})
  get checked() {
    return this._checked;
  }

  /**
   * We define our own getter/setter for `checked` because we need to track
   * changes to it synchronously.
   *
   * The order in which the `checked` property is set across radio buttons
   * within the same group is very important. However, we can't rely on
   * UpdatingElement's `updated` callback to observe these changes (which is
   * also what the `@observer` decorator uses), because it batches changes to
   * all properties.
   *
   * Consider:
   *
   *   radio1.disabled = true;
   *   radio2.checked = true;
   *   radio1.checked = true;
   *
   * In this case we'd first see all changes for radio1, and then for radio2,
   * and we couldn't tell that radio1 was the most recently checked.
   */
  set checked(checked: boolean) {
    const oldValue = this._checked;
    if (!!checked === !!oldValue) {
      return;
    }
    this._checked = checked;
    if (this.formElement) {
      this.formElement.checked = checked;
    }
    if (this._selectionController !== undefined) {
      this._selectionController.update(this);
    }
    this.requestUpdate('checked', oldValue);

    // useful when unchecks self and wrapping element needs to synchronize
    this.dispatchEvent(new Event('checked', {bubbles: true, composed: true}));
  }

  @property({type: Boolean})
  @observer(function(this: RadioBase, disabled: boolean) {
    this.mdcFoundation.setDisabled(disabled);
  })
  disabled = false;

  @property({type: String})
  @observer(function(this: RadioBase, value: string) {
    this._handleUpdatedValue(value);
  })
  value = '';

  _handleUpdatedValue(newValue: string) {
    // the observer function can't access protected fields (according to
    // closure compiler) because it's not a method on the class, so we need this
    // wrapper.
    this.formElement.value = newValue;
  }

  @property({type: String}) name = '';

  protected mdcFoundationClass = MDCRadioFoundation;

  protected mdcFoundation!: MDCRadioFoundation;

  private _selectionController?: SelectionController;

  connectedCallback() {
    super.connectedCallback();
    // Note that we must defer creating the selection controller until the
    // element has connected, because selection controllers are keyed by the
    // radio's shadow root. For example, if we're stamping in a lit-html map
    // or repeat, then we'll be constructed before we're added to a root node.
    //
    // Also note if we aren't using native shadow DOM, then we don't technically
    // need a SelectionController, because our inputs will share document-scoped
    // native selection groups. However, it simplifies implementation and
    // testing to use one in all cases. In particular, it means we correctly
    // manage groups before the first update stamps the native input.
    //
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    this._selectionController = SelectionController.getController(this);
    this._selectionController.register(this);
    // With native <input type="radio">, when a checked radio is added to the
    // root, then it wins. Immediately update to emulate this behavior.
    this._selectionController.update(this);
  }

  disconnectedCallback() {
    // The controller is initialized in connectedCallback, so if we are in
    // disconnectedCallback then it must be initialized.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    this._selectionController!.unregister(this);
    this._selectionController = undefined;
  }

  focusNative() {
    this.formElement.focus();
  }

  get ripple() {
    return this.rippleElement.ripple;
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
  }

  private _focusHandler() {
    if (this._selectionController !== undefined) {
      this._selectionController.focus(this);
    }
  }

  private _clickHandler() {
    // Firefox has weird behavior with radios if they are not focused
    this.formElement.focus();
  }

  protected render() {
    return html`
      <div class="mdc-radio" .ripple=${ripple()}>
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
        <div class="mdc-radio__ripple"></div>
      </div>`;
  }

  protected firstUpdated() {
    super.firstUpdated();
    // We might not have been able to synchronize this from the checked setter
    // earlier, if checked was set before the input was stamped.
    this.formElement.checked = this.checked;
    if (this._selectionController !== undefined) {
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

/**
 * Only one <input type="radio" name="group"> per group name can be checked at
 * once. However, the scope of "name" is the document/shadow root, so built-in
 * de-selection does not occur when two radio buttons are in different shadow
 * roots. This class bridges the checked state of radio buttons with the same
 * group name across different shadow roots.
 */
export class SelectionController {
  private sets: {[name: string]: SelectionSet} = {};

  private focusedSet: SelectionSet|null = null;

  private mouseIsDown = false;

  private updating = false;

  static getController(element: HTMLElement|HTMLElement&{global: boolean}) {
    const useGlobal =
        !('global' in element) || ('global' in element && element.global);
    const root = useGlobal ?
        document as Document & {[selectionController]?: SelectionController} :
        element.getRootNode() as Node &
            {[selectionController]?: SelectionController};
    let controller = root[selectionController];
    if (controller === undefined) {
      controller = new SelectionController(root);
      root[selectionController] = controller;
    }
    return controller;
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
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
