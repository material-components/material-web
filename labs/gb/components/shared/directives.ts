/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {noChange} from 'lit';
import {
  AsyncDirective,
  AttributePart,
  directive,
  DirectiveResult,
  ElementPart,
} from 'lit/async-directive.js';
import {classMap, type ClassInfo} from 'lit/directives/class-map.js';

/**
 * A function that sets up logic for a directive's element.
 *
 * @param element The element attached to the directive.
 * @param opts Options for setting up the element, including an AbortSignal for
 *     cleanup.
 */
export type SetupElementFunction = (
  element: HTMLElement,
  opts: {signal: AbortSignal},
) => void;

/**
 * All class map directives include AdditionalClasses to allow adding dynamic
 * classes to the element using `classMap()`.
 */
export interface AdditionalClasses {
  /**
   * Additional classes to apply to the element.
   */
  classes?: ClassInfo;
}

/**
 * Options for creating a class map directive.
 *
 * @param getClasses A function that returns the class names and truthy values
 *     if they apply.
 * @param setupElement An optional function to set up logic for the directive's
 *     element.
 */
export interface ClassMapDirectiveOptions<State> {
  getClasses: (state?: State) => ClassInfo;
  setupElement?: SetupElementFunction;
}

/**
 * Creates a Lit directive that behaves like `classMap()`, but also provides
 * element setup and cleanup logic.
 *
 * These directives bind to `class="${componentDirectiveName()}"`.
 *
 * @example
 * ```ts
 * const toggleButton = createClassMapDirective({
 *   getClasses: (state: ToggleButtonState) => ({
 *     'toggle-button': true,
 *     'toggle-button-selected': state.selected,
 *   }),
 *   setupElement: (element, opts) => {
 *     element.addEventListener('click', () => {
 *       state.selected = !state.selected;
 *     }, opts);
 *   },
 * });
 *
 * html`
 *   <button class="${toggleButton()}">Unselected</button>
 *   <button class="${toggleButton({selected: true})}">Selected</button>
 *   <button class="${toggleButton({classes: {'visible': isVisible}})}">
 *     With additional classes
 *   </button>
 * `;
 * ```
 *
 * @param options Options for creating the class map directive.
 * @return A Lit `directive()` that binds to the class attribute.
 */
export function createClassMapDirective<State = {}>(
  options: ClassMapDirectiveOptions<State>,
): (state?: State & AdditionalClasses) => DirectiveResult {
  return directive(
    class ComponentClassMapDirective extends SetupElementDirective {
      render(params?: State & AdditionalClasses) {
        const {classes, ...state} = params || {};
        return classMap({
          ...(classes || {}),
          ...options.getClasses(state as State),
        });
      }

      protected override setupElement = options.setupElement;
    },
  );
}

/**
 * Creates a Lit directive that can be used to add setup and cleanup logic to
 * an element.
 *
 * These directives bind as element parts.
 *
 * @example
 * ```ts
 * const logClick = createElementDirective((element, opts) => {
 *   element.addEventListener('click', (event) => {
 *     console.log('click', event);
 *   }, opts);
 * });
 *
 * html`<button ${logClick()}>Click me</button>`;
 * ```
 *
 * @param setupElement The function to set up logic for the directive's element.
 * @return A Lit `directive()` that binds as an element part.
 */
export function createElementDirective(
  setupElement: SetupElementFunction,
): () => DirectiveResult {
  return directive(
    class ElementDirective extends SetupElementDirective {
      render() {
        return noChange;
      }

      protected override setupElement = setupElement;
    },
  );
}

/**
 * A base class for Lit element and attribute directives that provides a setup
 * method for initializing logic when a directive's element is connected.
 */
abstract class SetupElementDirective extends AsyncDirective {
  /**
   * Called when the directive's element changes. Use this method to add
   * event listeners or perform other setup logic.
   *
   * The `signal` option is used to clean up setup logic when the element is
   * disconnected.
   *
   * @param element The element attached to the directive.
   * @param signal An AbortSignal to clean up event listeners and other logic.
   */
  protected setupElement?: (
    element: HTMLElement,
    opts: {signal: AbortSignal},
  ) => void;

  private element?: HTMLElement;
  private cleanup?: AbortController;

  override update({element}: ElementPart | AttributePart, params: unknown[]) {
    if (element !== this.element) {
      this.element = element as HTMLElement;
      this.disconnected();
      if (this.isConnected) {
        this.reconnected();
      }
    }

    return this.render(...params);
  }

  protected override disconnected() {
    this.cleanup?.abort();
  }

  protected override reconnected() {
    if (this.element && this.setupElement) {
      this.cleanup = new AbortController();
      this.setupElement(this.element, {signal: this.cleanup.signal});
    }
  }
}
