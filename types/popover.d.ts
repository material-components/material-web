/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

interface ShowPopoverOptions {
  source?: HTMLElement;
}

interface TogglePopoverOptions extends ShowPopoverOptions {
  force?: boolean;
}

interface HTMLElement {
  showPopover(options?: ShowPopoverOptions | boolean): void;
  togglePopover(options?: TogglePopoverOptions | boolean): boolean;
}

interface ToggleEvent {
  source: Element | null;
}
