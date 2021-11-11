/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

const USING_SHADY_DOM = window.ShadyDOM?.inUse ?? false;

/**
 * `true` if `:dir()` ponyfilling is needed
 *
 * This will enable in browsers not supporting the `:dir()` syntax, and also not
 * using ShadyDOM.
 */
const PONYFILL_DIR = !USING_SHADY_DOM &&
    !(CSS.supports('selector(:dir(rtl))') &&
      // Safari 15 supports `:dir()` syntax, but does not evaluate it
      document.documentElement.matches(':dir(rtl),:dir(ltr)'));


function getPageDirection() {
  return getComputedStyle(document.documentElement).direction;
}

const HOSTS = new Set<HTMLElement>();

/**
 * Set the page direction to the host element.
 */
function syncDocumentDirection(
    host: HTMLElement, direction = getPageDirection()) {
  host.dir = direction;
}

function resetDirection(host: HTMLElement) {
  host.dir = '';
}

const DOCUMENT_OBSERVER = new MutationObserver(() => {
  const direction = getPageDirection();
  for (const host of HOSTS) {
    syncDocumentDirection(host, direction);
  }
});

function enableObserver() {
  DOCUMENT_OBSERVER.observe(
      document.documentElement, {attributes: true, attributeFilter: ['dir']});
}

function disableObserver() {
  DOCUMENT_OBSERVER.disconnect();
}

/**
 * Sync text direction with the document.
 * Use this in conjunction with the RTL sass mixin.
 *
 * This controller does nothing if the browsers supports the `:dir()` selector
 *
 * **Example:**
 * ```ts
 * class RTLElement extends LitElement {
 *   protected rtlController = new RTLController(this);
 *
 *   connectedCallback() {
 *     super.connectedCallback();
 *     this.rtlController.connect();
 *   }
 *   disconnectedCallback() {
 *     super.disconnectedCallback();
 *     this.rtlController.disconnect();
 *   }
 * }
 * ```
 */
export class RTLController {
  private readonly shouldObserve: boolean;
  private optOut = false;

  constructor(private readonly host: HTMLElement) {
    this.shouldObserve = PONYFILL_DIR
        // tslint:disable-next-line:no-any bail if applied to internal generated class
        && !((host as any).dispatchWizEvent);
  }
  /**
   * Call this method in the component's `connectedCallback`
   */
  connect() {
    if (!this.shouldObserve || this.optOut) {
      return;
    }
    // opt out any component with a manually set direction
    if (this.host.dir !== '') {
      this.optOut = true;
      return;
    }
    if (HOSTS.size === 0) {
      enableObserver();
    }
    HOSTS.add(this.host);
    syncDocumentDirection(this.host);
  }
  /**
   * Call this method in the component's `disconnectedCallback`
   */
  disconnect() {
    if (!this.shouldObserve || this.optOut) {
      // allow user to opt-in again by removing direction while disconnected
      this.optOut = false;
      return;
    }
    HOSTS.delete(this.host);
    // reset direction to differentiate manual vs automatic use of the `dir`
    // attribute
    resetDirection(this.host);
    if (HOSTS.size === 0) {
      disableObserver();
    }
  }
}