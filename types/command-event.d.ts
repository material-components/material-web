/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

interface CommandEventInit extends EventInit {
  source?: Element;
  command: string;
}

interface CommandEvent extends Event {
  new (type: string, init: CommandEventInit): CommandEvent;
  source?: Element;
  command: string;
}

interface HTMLElementEventMap {
  command: CommandEvent;
}

declare let CommandEvent: CommandEvent;
