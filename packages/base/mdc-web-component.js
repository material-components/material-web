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

const hasCustomEventConstructor = typeof CustomEvent === 'function';

export const MDCWebComponentMixin = (superClass) =>

  class MDCWebComponent extends superClass {
    get host() {
      return this._host;
    }

    // TODO(sorvell): should be changed in MDC
    get activeElement() {
      return this.host.getRootNode().activeElement;
    }

    initialize(...args) {
      super.initialize(...args);
      this._host = this.root_.getRootNode().host;
    }

    // TODO(sorvell): would be nice in MDC
    createAdapter() {
      return null;
    }

    getDefaultFoundation() {
      const foundation = super.getDefaultFoundation();
      Object.assign(foundation.adapter_, this.createAdapter());
      return foundation;
    }

    // TODO(sorvell): convenient but maybe not best.
    emit(evtType, evtData, shouldBubble = false) {
      let evt;
      if (hasCustomEventConstructor) {
        evt = new CustomEvent(evtType, {
          detail: evtData,
          bubbles: shouldBubble,
          composed: true,
        });
      } else {
        evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(evtType, shouldBubble, false, evtData);
      }

      this.root_.dispatchEvent(evt);
    }
  };
