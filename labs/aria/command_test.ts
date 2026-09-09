/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import './menu/md-aria-menuitem.js';
import './menu/md-aria-menulist.js';

import {html} from 'lit';
import {Environment} from '../../testing/environment.js';
import {sharedCommandInvokerActivationSteps} from './command.js';

describe('command', () => {
  const env = new Environment();

  describe('sharedCommandInvokerActivationSteps()', () => {
    describe('popovertarget behavior (when commandfor is absent)', () => {
      it('does nothing if target element does not exist', async () => {
        const root = env.render(html`
          <button popovertarget="nonexistent">Open</button>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const event = new MouseEvent('click', {bubbles: true});

        expect(() => {
          sharedCommandInvokerActivationSteps(button, event);
        }).not.toThrow();
      });

      it('shows popover when popovertargetaction is "show"', async () => {
        const root = env.render(html`
          <button popovertarget="test-popover" popovertargetaction="show">
            Show
          </button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;
        expect(popover.matches(':popover-open')).toBeFalse();

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(popover.matches(':popover-open')).toBeTrue();
      });

      it('hides popover when popovertargetaction is "hide"', async () => {
        const root = env.render(html`
          <button popovertarget="test-popover" popovertargetaction="hide">
            Hide
          </button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;
        popover.showPopover();
        expect(popover.matches(':popover-open')).toBeTrue();

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(popover.matches(':popover-open')).toBeFalse();
      });

      it('toggles popover when popovertargetaction is "toggle" or unspecified', async () => {
        const root = env.render(html`
          <button popovertarget="test-popover">Toggle</button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;
        expect(popover.matches(':popover-open')).toBeFalse();

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(popover.matches(':popover-open')).toBeTrue();

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(popover.matches(':popover-open')).toBeFalse();
      });
    });

    describe('command behavior (when commandfor is present)', () => {
      it('does nothing when target exists but command attribute is missing or unknown', async () => {
        const root = env.render(html`
          <button commandfor="test-popover" command="invalid-command">
            Run
          </button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;
        const commandSpy = jasmine.createSpy('commandSpy');
        popover.addEventListener('command', commandSpy);

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(commandSpy).not.toHaveBeenCalled();
        expect(popover.matches(':popover-open')).toBeFalse();
      });

      it('dispatches a CommandEvent on the associated target element', async () => {
        const root = env.render(html`
          <button commandfor="test-popover" command="show-popover">Show</button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;

        const commandEventPromise = new Promise<CommandEvent>((resolve) => {
          popover.addEventListener('command', (event: CommandEvent) => {
            resolve(event);
          });
        });

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        const event = await commandEventPromise;
        expect(event).toBeDefined();
        expect(event.command).toBe('show-popover');
        expect(event.source).toBe(button);
      });

      it('supports custom commands prefixed with -- without invoking built-in action', async () => {
        const root = env.render(html`
          <button commandfor="test-popover" command="--my-custom-action">
            Custom
          </button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;

        const commandSpy = jasmine.createSpy('commandSpy');
        popover.addEventListener('command', commandSpy);

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(commandSpy).toHaveBeenCalledTimes(1);
        expect(popover.matches(':popover-open')).toBeFalse();
      });

      it('aborts command execution if CommandEvent is canceled via preventDefault()', async () => {
        const root = env.render(html`
          <button commandfor="test-popover" command="show-popover">Show</button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;

        popover.addEventListener('command', (event: Event) => {
          event.preventDefault();
        });

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(popover.matches(':popover-open')).toBeFalse();
      });

      it('aborts command execution if target is disconnected during command event dispatch', async () => {
        const root = env.render(html`
          <button commandfor="test-popover" command="show-popover">Show</button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;

        popover.addEventListener('command', () => {
          popover.remove();
        });

        expect(() => {
          sharedCommandInvokerActivationSteps(
            button,
            new MouseEvent('click', {bubbles: true}),
          );
        }).not.toThrow();
      });
    });

    describe('popover commands', () => {
      it('shows popover on "show-popover" command', async () => {
        const root = env.render(html`
          <button commandfor="test-popover" command="show-popover">Show</button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(popover.matches(':popover-open')).toBeTrue();
      });

      it('hides popover on "hide-popover" command', async () => {
        const root = env.render(html`
          <button commandfor="test-popover" command="hide-popover">Hide</button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;
        popover.showPopover();
        expect(popover.matches(':popover-open')).toBeTrue();

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(popover.matches(':popover-open')).toBeFalse();
      });

      it('toggles popover on "toggle-popover" command', async () => {
        const root = env.render(html`
          <button commandfor="test-popover" command="toggle-popover">
            Toggle
          </button>
          <div id="test-popover" popover="manual">Content</div>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const popover = root.querySelector('#test-popover') as HTMLElement;
        expect(popover.matches(':popover-open')).toBeFalse();

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();
        expect(popover.matches(':popover-open')).toBeTrue();

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();
        expect(popover.matches(':popover-open')).toBeFalse();
      });

      it('recognizes md-aria-menulist as a popover target', async () => {
        const root = env.render(html`
          <button commandfor="test-menu" command="show-popover">Open</button>
          <md-aria-menulist id="test-menu">
            <md-aria-menuitem>Item 1</md-aria-menuitem>
          </md-aria-menulist>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const menulist = root.querySelector('md-aria-menulist')!;

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(menulist.matches(':popover-open')).toBeTrue();
      });
    });

    describe('dialog commands', () => {
      it('opens closed dialog as modal on "show-modal" command', async () => {
        const root = env.render(html`
          <button commandfor="test-dialog" command="show-modal">Open</button>
          <dialog id="test-dialog">Content</dialog>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const dialog = root.querySelector('dialog')!;

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(dialog.matches(':open')).toBeTrue();
        expect(dialog.matches(':modal')).toBeTrue();
      });

      it('closes open dialog on "close" command with invoker value attribute', async () => {
        const root = env.render(html`
          <button commandfor="test-dialog" command="close" value="confirmed">
            Close
          </button>
          <dialog id="test-dialog" open>Content</dialog>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const dialog = root.querySelector('dialog')!;

        const returnValue = new Promise<unknown>((resolve) => {
          dialog.addEventListener(
            'close',
            (event) => {
              resolve(dialog.returnValue);
            },
            {once: true},
          );
        });

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(dialog.matches(':open')).toBeFalse();
        expect(await returnValue).toEqual('confirmed');
      });

      it('calls requestClose on open dialog with invoker value on "request-close" command', async () => {
        const root = env.render(html`
          <button
            commandfor="test-dialog"
            command="request-close"
            value="canceled">
            Request Close
          </button>
          <dialog id="test-dialog" open>Content</dialog>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const dialog = root.querySelector('dialog')!;

        const returnValue = new Promise<unknown>((resolve) => {
          dialog.addEventListener(
            'close',
            (event) => {
              resolve(dialog.returnValue);
            },
            {once: true},
          );
        });

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(dialog.matches(':open')).toBeFalse();
        expect(await returnValue).toEqual('canceled');
      });

      it('ignores dialog commands when dialog is currently open as a popover', async () => {
        const root = env.render(html`
          <button commandfor="test-dialog" command="close">Close</button>
          <dialog id="test-dialog" popover="manual" open>Content</dialog>
        `);
        await env.waitForStability();
        const button = root.querySelector('button')!;
        const dialog = root.querySelector('dialog')!;
        dialog.showPopover();
        expect(dialog.matches(':popover-open')).toBeTrue();

        sharedCommandInvokerActivationSteps(
          button,
          new MouseEvent('click', {bubbles: true}),
        );
        await env.waitForStability();

        expect(dialog.matches(':popover-open')).toBeTrue();
      });
    });
  });
});
