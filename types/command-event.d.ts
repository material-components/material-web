/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

interface CommandEventInit extends EventInit {
  // TODO: go/ts60upgrade - Fix after TS 6.0 upgrade.
  //   TS2717: Subsequent property declarations must have the same type.
  // @ts-ignore
  source?: Element;
  // TODO: go/ts60upgrade - Fix after TS 6.0 upgrade.
  //   TS2687: All declarations of 'command' must have identical modifiers.
  // @ts-ignore
  command: string;
}

// TODO: go/ts60upgrade - Fix after TS 6.0 upgrade.
//   TS2451: Cannot redeclare block-scoped variable 'CommandEvent'.
// @ts-ignore
interface CommandEvent extends Event {
  new (type: string, init: CommandEventInit): CommandEvent;
  source?: Element;
  command: string;
}

interface HTMLElementEventMap {
  command: CommandEvent;
}

// TODO: go/ts60upgrade - Fix after TS 6.0 upgrade.
//   TS2451: Cannot redeclare block-scoped variable 'CommandEvent'.
// @ts-ignore
declare let CommandEvent: CommandEvent;
