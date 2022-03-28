/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TemplateResult} from 'lit';
import {DirectiveResult} from 'lit/directive';
import {ref} from 'lit/directives/ref';

import {Harness, HarnessElement} from './harness';

/**
 * Pre-defined test table template states commonly shared between components.
 */
export enum State {
  DEFAULT = 'Default',
  DISABLED = 'Disabled',
  ERROR = 'Error',
  FOCUS = 'Focus',
  HOVER = 'Hover',
  PRESSED = 'Pressed',
}

/**
 * A template builder class that can be used to easily build test table template
 * render functions for multiple variants.
 *
 * If a harness is used, invoke `.withHarness()` before `.withVariants()` for
 * accurate types.
 *
 * @example
 *   const templates = new TemplateBuilder()
 *      .withHarness(MyHarness)
 *      .withVariants({
 *        filled(directive, props) {
 *          return html`
 *            <my-filled-element .label=${props.label} ${directive}>
 *              ${props.content}
 *            </my-filled-element>
 *          `;
 *        },
 *        outlined(directive, props) {
 *          return html`
 *            <my-outlined-element .label=${props.label} ${directive}>
 *              ${props.content}
 *            </my-outlined-element>
 *          `;
 *        },
 *      });
 *
 *   // Create an array of templates for every variant and provided property
 *   // object. This example creates both variants with and without a label.
 *   const testTemplates = templates.all({label: 'Foo'}, {});
 *
 *   // Create specific variant templates. Useful for when the properties are
 *   // not the same for each rendered variant.
 *   const variantTemplates = [
 *     templates.variant('filled')({label: 'Filled'}, {}),
 *     templates.variant('outlined')({label: 'outlined'}, {}),
 *   ];
 *
 * @template H Optional element harness type.
 * @template V Variant name types.
 */
export class TemplateBuilder<H extends Harness = never,
                                       V extends string = never> {
  /**
   * A map of variant names and their template factories.
   */
  private readonly variants = new Map<V, TemplateFactory<H>>();
  /**
   * The current harness constructor to use when rendering.
   */
  private harnessCtor?: new(element: HarnessElement<H>) => H;
  /**
   * The current state callback to invoke after rendering.
   */
  private stateCallback?: TemplateStateCallback<H>;

  /**
   * Creates and return an array of test table templates that will render every
   * variant once for each test case element properties object provided.
   *
   * @param testCaseProps Element properties to render for every variant.
   * @return An array of test table templates for every variant and test case.
   */
  all(...testCaseProps: Array<TemplateProps<H>>) {
    if (!testCaseProps.length) {
      // Allow calling templates.all() and assume default props.
      testCaseProps.push({});
    }

    return Array.from(this.variants.entries()).flatMap(([name, factory]) => {
      return testCaseProps.map(props => ({name, render: factory(props)}));
    });
  }

  /**
   * Retrieves the template factory for a specific variant.
   *
   * @param variant The variant to render.
   * @return A test table template for the given variant.
   */
  variant(variant: V) {
    const factory = this.variants.get(variant);
    if (!factory) {
      throw new Error(`Missing variant '${variant}' in TemplateBuilder.`);
    }

    return {name: variant, render: factory};
  }

  /**
   * Sets the harness constructor to use for the template builder.
   *
   * @template NewHarness The new harness type.
   * @param harnessCtor The constructor for the harness.
   * @return The template builder, now using the provided harness type.
   */
  withHarness<NewHarness extends Harness>(
      harnessCtor: new(element: HarnessElement<NewHarness>) => NewHarness) {
    const typedThis = this as unknown as TemplateBuilder<NewHarness, V>;
    typedThis.harnessCtor = harnessCtor;
    return typedThis;
  }

  /**
   * Sets the state callback to use for the template builder. It is invoked
   * after the template's element has rendered and provides the current state
   * and harness.
   *
   * This callback is typically used when additional behavior needs to be
   * simulated with the harness according to the current state.
   *
   * @example
   *   // Element-specific state that does not belong in the shared `State`
   *   // enum.
   *   enum MyState {
   *     FOCUS_MOUSE = 'Focus (Mouse)', // A unique state
   *   }
   *
   *   const templates = new TemplateBuilder()
   *       .withHarness(MyHarness)
   *       .withStateCallback(async (state, harness) => {
   *         // Use the harness to perform additional behavior not handled
   *         // by default.
   *         if (state === MyState.FOCUS_MOUSE) {
   *           await harness.focusWithMouse();
   *         }
   *       })
   *       .withVariants({/* ... *\/})
   *
   * @template NewHarness The new harness type.
   * @param callback The callback to be called.
   * @return The template builder, now using the provided harness type.
   */
  withStateCallback(callback: TemplateStateCallback<H>) {
    this.stateCallback = callback;
    return this;
  }

  /**
   * Adds multiple variant render functions to the template builder.
   *
   * @param variants An object whose keys are variant names and values are
   *     render functions.
   * @return The template builder, now using the provided variants.
   */
  withVariants<NewVariants extends Record<string, TemplateRender<H>>>(
      variants: NewVariants) {
    for (const variant of Object.keys(variants)) {
      this.withVariant(variant, variants[variant]);
    }

    return this as unknown as
        TemplateBuilder<H, V|Extract<keyof NewVariants, string>>;
  }

  /**
   * Adds a variant render function to the template builder.
   *
   * @param variant The new variant name to add.
   * @param render The variant's render function.
   * @return The template builder, now using the provided variant.
   */
  withVariant<NewVariant extends string>(
      variant: NewVariant, render: TemplateRender<H>) {
    const typedThis = this as unknown as TemplateBuilder<H, V|NewVariant>;
    typedThis.variants.set(variant, props => {
      return state => {
        const directive = ref(async element => {
          if (!element) {
            return;
          }

          const harness = await this.createHarnessAndApplyState(
              element as HarnessElement<H>, state);

          // Allow the component to apply additional state or perform custom
          // state logic.
          this.stateCallback?.(state, harness);
        });

        return render(directive, props || {}, state);
      };
    });

    return typedThis;
  }

  /**
   * Creates a harness for the given element (if a harness constructor is
   * being used). This function will also apply default shared state, including
   * focusing, hovering, and pressing the element.
   *
   * @param element The element to create a harness for.
   * @param state The current state of the element.
   * @return The created harness, or undefined if a harness constructor is not
   *     being used.
   */
  private async createHarnessAndApplyState(
      element: HarnessElement<H>, state: string): Promise<H|never> {
    if (!this.harnessCtor) {
      return undefined as never;
    }

    const harness = new this.harnessCtor(element);
    // Common shared component state harness actions
    switch (state) {
      case State.FOCUS:
        await harness.focusWithKeyboard();
        break;
      case State.HOVER:
        await harness.hoverEnter();
        break;
      case State.PRESSED:
        await harness.press();
        break;
      default:
        break;
    }

    return harness;
  }
}

/**
 * A function that renders an element to display. The function receives a test
 * directive that should be added to the element.
 *
 * If a harness for the element is used, optional properties for the harness's
 * element are provided to bind to the template.
 *
 * The render function may also use a third parameter, which is the current
 * state the element should be rendered in.
 *
 * @template H The harness type.
 * @param directive A test directive that should be placed on the element.
 * @param props Properties for the element.
 * @param state The current state to render the element in.
 * @return A `TemplateResult` rendering the element.
 */
export type TemplateRender<H extends Harness> =
    (directive: DirectiveResult, props: TemplateProps<H>, state: string) =>
        TemplateResult;

/**
 * A callback that is invoked after the template's element has rendered. It
 * provides the current state and harness (if used).
 *
 * This callback is typically used when additional behavior needs to be
 * simulated with the harness according to the current state.
 *
 * @template H The harness type.
 * @param state The current test table state.
 * @param harness The rendered element's harness.
 */
export type TemplateStateCallback<H extends Harness> =
    (state: string, harness: H) => void;

/**
 * Element properties for a harness constructor. Returns a partial object with
 * shared template properties and optional properties that are unique to the
 * element itself (excludes `HTMLElement` properties).
 *
 * @template H The harness type.
 */
export type TemplateProps<H extends Harness> = Partial<Pick<
    HarnessElement<H>, Exclude<keyof HarnessElement<H>, keyof HTMLElement>>>&
    SharedTemplateProps;

/**
 * Shared element properties for all harnesses.
 */
export interface SharedTemplateProps {
  /**
   * The light DOM content of the element.
   */
  content?: TemplateResult;
}

/**
 * A factory function that takes an object of element properties and returns
 * a render function that renders the element for a given state.
 *
 * @template H The harness type.
 * @param props Optional properties for the element.
 * @return A function that renders the element for a given state.
 */
export type TemplateFactory<H extends Harness> = (props?: TemplateProps<H>) =>
    (state: string) => TemplateResult;
