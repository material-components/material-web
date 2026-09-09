/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/// <reference types="../../types/command-event.d.ts" />
/// <reference types="../../types/popover.d.ts" />

import {queryAssociatedById} from './query-associated.js';

/**
 * An element's `command` attribute state: either one of a fixed set of commands
 * with spec-defined actions, `custom` (if it begins with `--`), or `unknown`.
 *
 * https://whatpr.org/html/12011/popover.html#attr-command
 */
type CommandState =
  | 'toggle-popover'
  | 'show-popover'
  | 'hide-popover'
  | 'close'
  | 'request-close'
  | 'show-modal'
  | 'custom'
  | 'unknown';

/**
 * Determines an element's `command` attribute state, given the attribute value.
 */
function getCommandState(attrValue: string | null): CommandState {
  switch (attrValue) {
    case 'toggle-popover':
    case 'show-popover':
    case 'hide-popover':
    case 'close':
    case 'request-close':
    case 'show-modal':
      return attrValue;
    default:
      return attrValue?.startsWith('--') ? 'custom' : 'unknown';
  }
}

/**
 * An element's popover state, as determined by its type or `popover` attribute.
 *
 * https://whatpr.org/html/12011/popover.html#popover-state
 */
type PopoverState = 'auto' | 'manual' | 'hint' | 'no-popover';

/** Determines the popover state of an element. */
function getPopoverState(element: HTMLElement): PopoverState {
  if (element.localName === 'md-aria-menulist') {
    return 'auto';
  }

  const attrValue = element.getAttribute('popover');
  switch (attrValue) {
    case '':
      return 'auto';
    case 'auto':
    case 'manual':
    case 'hint':
      return attrValue;
    case null:
    default:
      return 'no-popover';
  }
}

/**
 * An element's popover target action state: the action taken on the popover
 * referenced by the element's `popovertarget` attribute.
 *
 * https://whatpr.org/html/12011/popover.html#attr-popovertargetaction
 */
type PopoverTargetActionState = 'toggle' | 'show' | 'hide';

/**
 * Determines the popover target action from an element's `popovertargetaction`
 * attribute value.
 */
function getPopoverTargetActionState(
  attrValue: string,
): PopoverTargetActionState {
  switch (attrValue) {
    case 'toggle':
    case 'show':
    case 'hide':
      return attrValue;
    default:
      return 'toggle';
  }
}

/**
 * Performs the 'shared command invoker activation steps' for a button or
 * menuitem, to be called when that element is activated: either runs a command
 * (i.e. the element has `command` and `commandfor` attributes) or changes a
 * popover's state (i.e. the element has the `popovertarget` and possibly
 * `popovertargetaction` attributes).
 *
 * https://whatpr.org/html/12011/popover.html#shared-command-invoker-activation-steps
 *
 * @param element The button or menuitem being activated.
 * @param event The event that activated `element`.
 */
export function sharedCommandInvokerActivationSteps(
  element: HTMLElement,
  event: Event,
) {
  const idref = element.getAttribute('commandfor');
  const commandTarget = queryAssociatedById(
    element,
    idref ?? '',
  ) as HTMLElement | null;
  if (!commandTarget) {
    popoverTargetAttributeActivationBehavior(element, event.target as Node);
    return;
  }

  const command = element.getAttribute('command');
  const commandState = getCommandState(command);
  if (commandState === 'unknown' || command === null) {
    return;
  }

  const isPopover = getPopoverState(commandTarget) !== 'no-popover';
  if (isPopover && commandState !== 'custom') {
    // `<dialog>` is the only element that defines 'is valid command steps'.
    if (
      commandTarget.localName === 'dialog' &&
      !['close', 'request-close', 'show-modal'].includes(commandState)
    ) {
      return;
    }
  }

  const continueSteps = commandTarget.dispatchEvent(
    new CommandEvent('command', {source: element, command, cancelable: true}),
  );

  if (
    !continueSteps ||
    !commandTarget.isConnected ||
    commandState === 'custom'
  ) {
    return;
  }

  switch (command) {
    case 'hide-popover':
      try {
        // Use `togglePopover` because `hidePopover` doesn't support `source`.
        commandTarget.togglePopover({force: false, source: element});
      } catch (e) {
        // Do nothing. No exception should be thrown by these steps if the
        // popover isn't in the expected state.
      }
      break;
    case 'toggle-popover':
      try {
        commandTarget.togglePopover({source: element});
      } catch (e) {
        // Do nothing. No exception should be thrown by these steps if the
        // popover isn't in the expected state.
      }
      break;
    case 'show-popover':
      try {
        commandTarget.showPopover({source: element});
      } catch (e) {
        // Do nothing. No exception should be thrown by these steps if the
        // popover isn't in the expected state.
      }
      break;
    default:
      // An element can have 'command steps', which are run if the element's
      // command is not a popover command. Currently, only `<dialog>` defines
      // 'command steps', so they're inlined here.
      //
      // https://whatpr.org/html/12011/popover.html#command-steps
      // https://whatpr.org/html/12011/interactive-elements.html#the-dialog-element:command-steps
      if (commandTarget.localName === 'dialog') {
        const dialog = commandTarget as HTMLDialogElement;
        if (dialog.matches(':popover-open')) {
          return;
        }

        switch (commandState) {
          case 'close':
            if (dialog.hasAttribute('open')) {
              dialog.close(element.getAttribute('value') ?? undefined);
            }
            break;
          case 'request-close':
            if (dialog.hasAttribute('open')) {
              dialog.requestClose(element.getAttribute('value') ?? undefined);
            }
            break;
          case 'show-modal':
            if (!dialog.hasAttribute('open')) {
              dialog.showModal();
            }
            break;
          default:
            // Do nothing.
            break;
        }
      }
  }
}

/**
 * Performs the 'popover target attribute activation behavior' for a button or
 * menuitem.
 *
 * These steps are taken when a button or menuitem is activated, but doesn't
 * target an element with a `command` attribute.
 *
 * https://whatpr.org/html/12011/popover.html#popover-target-attribute-activation-behavior
 *
 * @param element The button or menuitem being activated.
 * @param eventTarget The target of the event that activated `element`.
 */
function popoverTargetAttributeActivationBehavior(
  element: HTMLElement,
  eventTarget: Node,
) {
  const idref = element.getAttribute('popovertarget');
  const popover = queryAssociatedById(
    element,
    idref ?? '',
  ) as HTMLElement | null;
  if (!popover) {
    return;
  }

  // TODO: The spec describes a case here that's relevant when the popover is
  // nested inside its invoker itself, which would cause clicking anywhere in
  // the popover to close the popover.
  //
  // https://github.com/whatwg/html/pull/10770

  const open = popover.matches(':popover-open');
  const action = getPopoverTargetActionState(
    element.getAttribute('popovertargetaction') ?? '',
  );
  if (!open && (action === 'show' || action === 'toggle')) {
    try {
      popover.showPopover({source: element});
    } catch (e) {
      // Do nothing. No exception should be thrown by these steps if the
      // popover isn't in the expected state.
    }
  } else if (open && (action === 'hide' || action === 'toggle')) {
    try {
      // Use `togglePopover` because `hidePopover` doesn't support `source`.
      popover.togglePopover({force: false, source: element});
    } catch (e) {
      // Do nothing. No exception should be thrown by these steps if the
      // popover isn't in the expected state.
    }
  }
}
