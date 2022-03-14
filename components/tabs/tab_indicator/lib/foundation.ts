/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCFoundation} from '@material/base/foundation';

import {MDCTabIndicatorAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export abstract class MDCTabIndicatorFoundation extends
    MDCFoundation<MDCTabIndicatorAdapter> {
  static override get cssClasses() {
    return cssClasses;
  }

  static override get strings() {
    return strings;
  }

  static override get defaultAdapter(): MDCTabIndicatorAdapter {
    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      computeContentClientRect: () =>
          ({top: 0, right: 0, bottom: 0, left: 0, width: 0, height: 0} as any),
      setContentStyleProperty: () => undefined,
    };
    // tslint:enable:object-literal-sort-keys
  }

  constructor(adapter?: Partial<MDCTabIndicatorAdapter>) {
    super({...MDCTabIndicatorFoundation.defaultAdapter, ...adapter});
  }

  computeContentClientRect(): DOMRect {
    return this.adapter.computeContentClientRect();
  }

  abstract activate(previousIndicatorClientRect?: DOMRect): void;
  abstract deactivate(): void;
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCTabIndicatorFoundation;
