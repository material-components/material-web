/**
 * @license
 * Copyright 2017 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// import { transformStyleProperties } from '@material/animation/index';

import { cssClasses } from './constants';

export default class MDCCircularProgressFoundation {
  public determinate_: Boolean = true;
  public progress_: Number = 0;
  public color_: any;
  public adapter_!: any;

  static get cssClasses() {
    return cssClasses;
  }

  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => { },
      hasClass: (/* className: string */) => false,
      removeClass: (/* className: string */) => { },
      setStyle: (/* el: Element, styleProperty: string, value: string */) => { },
      getElement: (/* el: Element */) => {},
      getColor: (/* color: string */) => {}
    };
  }

  constructor(adapter) {
    this.adapter_ = { ...MDCCircularProgressFoundation.defaultAdapter, ...adapter };
  }

  init() {
    this.determinate_ = !this.adapter_.hasClass(cssClasses.INDETERMINATE_CLASS);
    this.color_ = this.adapter_.getColor();
    this.progress_ = 0;
    
    this.setColor();
  }

  destroy() {
  }

  setDeterminate(isDeterminate) {
    this.determinate_ = isDeterminate;
    
    if (this.determinate_) {
      this.adapter_.removeClass(cssClasses.INDETERMINATE_CLASS);
    } else {
      this.adapter_.addClass(cssClasses.INDETERMINATE_CLASS);
    }
  }

  setColor(value = this.color_) {
    this.color_ = value;
    this.adapter_.setStyle(this.adapter_.getElement(), 'color', this.color_);
  }

  setProgress(value) {
    this.progress_ = value;
  }

  open() {
    this.adapter_.removeClass(cssClasses.CLOSED_CLASS);
  }

  close() {
    this.adapter_.addClass(cssClasses.CLOSED_CLASS);
  }
}
