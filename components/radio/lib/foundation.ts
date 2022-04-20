/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {MDCFoundation} from '@material/base/foundation';
import {MDCRadioAdapter} from './adapter';
import {cssClasses, strings} from './constants';

export class MDCRadioFoundation extends MDCFoundation<MDCRadioAdapter> {
  static override get cssClasses() {
    return cssClasses;
  }

  static override get strings() {
    return strings;
  }

  static override get defaultAdapter(): MDCRadioAdapter {
    return {
      addClass: () => undefined,
      removeClass: () => undefined,
      setNativeControlDisabled: () => undefined,
    };
  }

  constructor(adapter?: Partial<MDCRadioAdapter>) {
    super({...MDCRadioFoundation.defaultAdapter, ...adapter});
  }

  setDisabled(disabled: boolean) {
    const {DISABLED} = MDCRadioFoundation.cssClasses;
    this.adapter.setNativeControlDisabled(disabled);
    if (disabled) {
      this.adapter.addClass(DISABLED);
    } else {
      this.adapter.removeClass(DISABLED);
    }
  }
}

// tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.
export default MDCRadioFoundation;
