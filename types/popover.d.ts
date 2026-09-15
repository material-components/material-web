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
  // TODO: go/ts60upgrade - Fix after TS 6.0 upgrade.
  //   TS2687: All declarations of 'source' must have identical modifiers.
  // @ts-ignore
  source: Element | null;
}
