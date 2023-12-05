/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {TemplateResult} from 'lit';
import {DirectiveResult} from 'lit/directive.js';
import {ClassInfo} from 'lit/directives/class-map.js';
import {ref} from 'lit/directives/ref.js';
import {literal, StaticValue} from 'lit/static-html.js';

import {Harness, HarnessElement, isElementWithHarness} from './harness.js';
import {TestTableTemplate} from './table/test-table.js';

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
  SELECTED = 'Selected',
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
 *     templates.variant('filled', {label: 'Filled'}),
 *     templates.variant('filled', {label: ''}),
 *     templates.variant('outlined', {label: 'outlined'}, {}),
 *     templates.variant('outlined', {label: ''}, {}),
 *   ];
 *
 * @template H Optional element harness type.
 * @template V Variant name types.
 */
export class TemplateBuilder<
  H extends Harness = Harness,
  V extends string = never,
> {
  /**
   * A map of variant names and their template factories.
   */
  private readonly variants = new Map<V, TemplateVariant<H>>();
  /**
   * The current harness constructor to use when rendering.
   */
  private harnessCtor?: new (element: HarnessElement<H>) => H;
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
  all(...testCaseProps: Array<TemplateProps<H>>): TestTableTemplate[] {
    if (!testCaseProps.length) {
      // Allow calling templates.all() and assume default props.
      testCaseProps.push({});
    }

    return Array.from(this.variants.values()).flatMap(({display, factory}) => {
      return testCaseProps.map((props) => ({display, render: factory(props)}));
    });
  }

  /**
   * Creates and returns the test table template for a specific variant and
   * test case.
   *
   * @param variant The variant to render.
   * @param testCaseProps Element properties to render for this variant.
   * @return A test table template for the given variant and test case.
   */
  variant(variant: V, testCaseProps?: TemplateProps<H>): TestTableTemplate {
    const displayAndRender = this.variants.get(variant);
    if (!displayAndRender) {
      throw new Error(`Missing variant '${variant}' in TemplateBuilder.`);
    }

    const {display, factory} = displayAndRender;
    const render = factory(testCaseProps);
    return {display, render};
  }

  /**
   * Sets the harness constructor to use for the template builder.
   *
   * @template NewHarness The new harness type.
   * @param harnessCtor The constructor for the harness.
   * @return The template builder, now using the provided harness type.
   */
  withHarness<NewHarness extends Harness>(
    harnessCtor: new (element: HarnessElement<NewHarness>) => NewHarness,
  ) {
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
   *     either variant render functions or an object of variant options. The
   *     options specify a `display` name and the variant `render` function.
   * @return The template builder, now using the provided variants.
   */
  withVariants(
    variants: Record<string, TemplateRender<H> | TemplateVariantOptions<H>>,
  ) {
    // TODO: clean this up by only allowing TemplateVariantOptions and force
    // users to specify the display name.
    for (const variant of Object.keys(variants)) {
      this.withVariant(variant, variants[variant]);
    }

    return this as unknown as TemplateBuilder<
      H,
      V | Extract<keyof typeof variants, string>
    >;
  }

  /**
   * Adds a variant render function to the template builder.
   *
   * @param variant The new variant name to add.
   * @param renderOrOptions The variant's render function, or an object with the
   *     `render` function and a `display` name. The default display name is the
   *     `variant` name when a render function is provided instead.
   * @return The template builder, now using the provided variant.
   */
  withVariant<NewVariant extends string>(
    variant: NewVariant,
    renderOrOptions: TemplateRender<H> | TemplateVariantOptions<H>,
  ) {
    // TODO: clean this up by only allowing TemplateVariantOptions and force
    // users to specify the display name.
    const typedThis = this as unknown as TemplateBuilder<H, V | NewVariant>;
    const {display, render} =
      typeof renderOrOptions === 'function'
        ? {display: variant, render: renderOrOptions}
        : renderOrOptions;

    typedThis.variants.set(variant, {
      display: display ?? variant,
      factory: (props) => {
        return (state) => {
          const directive = ref(async (element) => {
            if (!element) {
              return;
            }

            const harness = await this.createHarnessAndApplyState(
              element as HarnessElement<H>,
              state,
            );

            // Allow the component to apply additional state or perform custom
            // state logic.
            this.stateCallback?.(state, harness);
          });

          return render(directive, props || {}, state);
        };
      },
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
    element: HarnessElement<H>,
    state: string,
  ): Promise<H | never> {
    if (!this.harnessCtor) {
      return undefined as never;
    }

    const harness = isElementWithHarness(element)
      ? (element.harness as H)
      : new this.harnessCtor(element);
    // Common shared component state harness actions
    await harness.reset();
    switch (state) {
      case State.FOCUS:
        await harness.focusWithKeyboard();
        break;
      case State.HOVER:
        await harness.startHover();
        break;
      case State.PRESSED:
        await harness.startClickWithMouse();
        break;
      default:
        break;
    }

    return harness;
  }
}

/**
 * A template variant, which includes the display name of the variant and a
 * factory to create `TestTableTemplate` objects.
 *
 * @template H The harness type.
 */
export interface TemplateVariant<H extends Harness> {
  /** The variant's display name. */
  display: string | StaticValue;
  /**
   * A factory function that takes an object of element properties and returns
   * another a test table template that renders the variant's element for a
   * given state.
   *
   * @template H The harness type.
   * @param props Optional properties for the element.
   * @return A function that renders the element for a given state.
   */
  factory: (props?: TemplateProps<H>) => TestTableTemplate['render'];
}

/** Options for rendering a template variant. */
export interface TemplateVariantOptions<H extends Harness> {
  /** A function to render this variant. */
  render: TemplateRender<H>;
  /** Custom variant display name. Defaults to the name of the variant. */
  display?: string | ReturnType<typeof literal>;
}

// TODO: clean this devx up a bit by swapping props/state args
/**
 * A function that renders a variant to display. The function receives a test
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
export type TemplateRender<H extends Harness> = (
  directive: DirectiveResult,
  props: TemplateProps<H>,
  state: string,
) => TemplateResult | null;

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
export type TemplateStateCallback<H extends Harness> = (
  state: string,
  harness: H,
) => void;

/**
 * Element properties for a harness constructor. Returns a partial object with
 * shared template properties and optional properties that are unique to the
 * element itself (excludes `HTMLElement` properties).
 *
 * @template H The harness type.
 */
export type TemplateProps<H extends Harness = Harness> = Partial<
  Pick<HarnessElement<H>, Exclude<keyof HarnessElement<H>, keyof HTMLElement>>
> &
  SharedTemplateProps;

/**
 * Shared element properties for all harnesses.
 */
export interface SharedTemplateProps {
  /**
   * The light DOM content of the element.
   */
  content?: TemplateResult;
  /**
   * Classes to add to the element.
   */
  classes?: ClassInfo;
}
