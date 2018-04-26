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
export class SelectionController {
  static getController(element) {
    const root = element.getRootNode();
    if (!root.__selectionController) {
      root.__selectionController = new SelectionController(root);
    }
    return root.__selectionController;
  }

  constructor(node) {
    node.addEventListener('keydown', (e) => this._keyDownHandler(e));
    node.addEventListener('mousedown', (e) => this._mousedownHandler(e));
    node.addEventListener('mouseup', (e) => this._mouseupHandler(e));
    this._sets = {};
    this._property = 'checked';
  }

  _keyDownHandler(e) {
    this._keyIsDown = true;
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

  _mousedownHandler(e) {
    this._mouseIsDown = true;
  }

  _mouseupHandler(e) {
    this._mouseIsDown = false;
  }

  has(element) {
    const set = this.getSet(element.name);
    return set.has(element);
  }

  previous(element) {
    const order = this.getOrdered(element);
    const i = order.indexOf(element);
    this.select(order[i-1] || order[order.length-1]);
  }

  next(element) {
    const order = this.getOrdered(element);
    const i = order.indexOf(element);
    this.select(order[i+1] || order[0]);
  }

  select(element) {
    element.focus();
    element.click();
  }

  /**
   * Helps to track the focused selection group and if it changes, focuses
   * the selected item in the group. This matches native radio button behavior.
   * @param {*} event
   * @param {*} element
   */
  focus(event, element) {
    // Only manage focus state when using keyboard
    if (this._mouseIsDown) {
      return;
    }
    cancelAnimationFrame(this._blurRaf);
    const set = this.getSet(element.name);
    const currentFocusedSet = this._focusedSet;
    this._focusedSet = set;
    if (currentFocusedSet != set && set._selected && set._selected != element) {
      // TODO(sorvell): needed because MDC Ripple delays focus/blur until RAF.
      requestAnimationFrame(() =>{
        set._selected.focus();
      });
    }
  }

  /**
   * Helps track the focused selection group by setting it to null asynchronously
   * on blur if no focus event is received.
   * @param {*} element
   */
  blur(element) {
    // Only manage focus state when using keyboard
    if (this._mouseIsDown) {
      return;
    }
    this._blurRaf = requestAnimationFrame(() => {
      this._focusedSet = null;
    });
  }

  getOrdered(element) {
    const set = this.getSet(element.name);
    if (!set._ordered) {
      set._ordered = [];
      for (const e of set) {
        set._ordered.push(e);
      }
      set._ordered.sort((a, b) =>
        a.compareDocumentPosition(b) == Node.DOCUMENT_POSITION_PRECEDING ? 1 : 0
      );
    }
    return set._ordered;
  }

  getSet(name) {
    if (!this._sets[name]) {
      this._sets[name] = new Set();
    }
    return this._sets[name];
  }

  register(element) {
    const set = this.getSet(element.name);
    set.add(element);
    set._ordered = null;
  }

  unregister(element) {
    const set = this.getSet(element.name);
    set.delete(element);
    set._ordered = null;
    if (set._selected == element) {
      set._selected = null;
    }
  }

  update(element) {
    if (this._updating) {
      return;
    }
    this._updating = true;
    if (element[this._property]) {
      const set = this.getSet(element.name);
      for (const e of set) {
        e[this._property] = (e == element);
      }
      set._selected = element;
    }
    this._updating = false;
  }
}
