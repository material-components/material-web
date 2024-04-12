/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

// import 'jasmine'; (google3-only)

import {html, render, TemplateResult} from 'lit';

/**
 * Options for creating form tests.
 */
export interface FormTestsOptions<T extends HTMLElement> {
  /**
   * A `querySelector` result that returns the tested element.
   *
   * @param root The root element to query from.
   * @return `root.querySelector('md-component')`
   */
  queryControl(root: Element): T | null;
  /**
   * Tests for `setFormValue`. Tests should render a form element, then
   * assert that the form's `FormData` matches the expected value (or lack of
   * one).
   *
   * There must be at least one value test.
   */
  valueTests: [ValueTest, ...ValueTest[]];
  /**
   * Tests for `formResetCallback`. Tests should render a form element with an
   * initial state, change the value of the element, then assert that the
   * control was reset to its initial value.
   *
   * There must be at least one reset test.
   */
  resetTests: [ResetTest<T>, ...Array<ResetTest<T>>];
  /**
   * Tests for `formStateRestoreCallback`. Tests should render a form element
   * with an initial state, then assert that a new control was restored with the
   * same state.
   *
   * There must be at least one restore test.
   */
  restoreTests: [RestoreTest<T>, ...Array<RestoreTest<T>>];
}

/**
 * Creates a series of tests that ensure an element works with forms as a form
 * associated custom element.
 *
 * @param options Options for creating tests, including use cases.
 */
export function createFormTests<T extends HTMLElement>(
  options: FormTestsOptions<T>,
) {
  // Patch attachInternals in order to spy on `setFormValue()` for simulating
  // form state restoration.
  const originalAttachInternals = HTMLElement.prototype.attachInternals;
  const INTERNALS = Symbol('internals');

  interface HTMLElementWithInternals {
    [INTERNALS]: SpiedElementInternals;
  }

  interface SpiedElementInternals extends ElementInternals {
    setFormValue: jasmine.Spy<ElementInternals['setFormValue']>;
  }

  function getInternals(element: HTMLElement) {
    return (element as unknown as HTMLElementWithInternals)[INTERNALS];
  }

  beforeAll(() => {
    HTMLElement.prototype.attachInternals = function (this: HTMLElement) {
      const internals = originalAttachInternals.call(this);
      spyOn(internals, 'setFormValue').and.callThrough();
      (this as unknown as HTMLElementWithInternals)[INTERNALS] =
        internals as SpiedElementInternals;
      return internals;
    };
  });

  afterAll(() => {
    HTMLElement.prototype.attachInternals = originalAttachInternals;
  });

  let root: HTMLElement | undefined;

  beforeEach(() => {
    root = document.createElement('div');
    document.body.appendChild(root);
  });

  afterEach(() => {
    root?.remove();
  });

  async function setupTest(content = options.valueTests[0].render()) {
    if (!root) {
      throw new Error('root was not set up correctly.');
    }

    render(html`<form>${content}</form>`, root);
    const form = root.querySelector('form');
    if (!form) {
      throw new Error('Could not query rendered <form>');
    }

    const control = options.queryControl(root) as
      | (T & ExpectedFormAssociatedElement)
      | null;
    if (!control) {
      throw new Error('`queryControl` must return an element.');
    }

    await control?.updateComplete;
    return {form, control};
  }

  it('should have `static formAssociated = true;`', async () => {
    const {control} = await setupTest();

    expect(control.constructor.formAssociated)
      .withContext('control.constructor.formAssociated')
      .toBeTrue();
  });

  it('should return associated form for `form` property', async () => {
    const {form, control} = await setupTest();
    expect(control.form).withContext('control.form').toBe(form);
  });

  it('should return null for `form` when not part of a <form>', async () => {
    const {form, control} = await setupTest();
    form.parentElement?.append(control);
    expect(control.form).withContext('control.form').toBeNull();
  });

  it('should return associated labels for `labels` property', async () => {
    const {form, control} = await setupTest();
    const labelFor = document.createElement('label');
    const labelParent = document.createElement('label');
    labelFor.htmlFor = 'control';
    control.id = 'control';
    form.append(labelFor);
    labelParent.appendChild(control);
    form.appendChild(labelParent);

    expect(control.labels)
      .withContext('control.labels')
      .toBeInstanceOf(NodeList);
    const labels = Array.from(control.labels);
    expect(labels)
      .withContext('should contain parent label element')
      .toContain(labelParent);
    expect(labels)
      .withContext('should contain label element with for attribute')
      .toContain(labelFor);
  });

  it('should return empty NodeList for `labels` when not part of a <form>', async () => {
    const {form, control} = await setupTest();
    form.parentElement?.append(control);
    expect(control.labels)
      .withContext('control.labels')
      .toBeInstanceOf(NodeList);
    expect(control.labels.length).withContext('control.labels.length').toBe(0);
  });

  it('should have a name property that reflects to the name attribute', async () => {
    const {control} = await setupTest();
    control.name = 'control';
    await control?.updateComplete;
    expect(control.getAttribute('name'))
      .withContext('"name" reflected attribute')
      .toBe('control');
  });

  it('should not add a form value without a name', async () => {
    const {form, control} = await setupTest();
    control.name = '';
    await control?.updateComplete;
    const data = new FormData(form);
    expect(data).withContext('data should be empty').toHaveSize(0);
  });

  for (const valueTest of options.valueTests) {
    it(`should pass the "${valueTest.name}" value test`, async () => {
      const {form} = await setupTest(valueTest.render());
      valueTest.assertValue(new FormData(form));
    });
  }

  for (const resetTest of options.resetTests) {
    it(`it should pass the "${resetTest.name}" reset test`, async () => {
      const {form, control} = await setupTest(resetTest.render());
      resetTest.change(control);
      await control?.updateComplete;
      form.reset();
      resetTest.assertReset(control);
    });
  }

  for (const restoreTest of options.restoreTests) {
    it(`it should pass the "${restoreTest.name}" restore test`, async () => {
      const {form} = await setupTest(restoreTest.render());
      const controls = Array.from(
        form.elements,
      ) as ExpectedFormAssociatedElement[];
      for (const control of controls) {
        // Simulate restoring a new set of controls. For each control, we
        // grab its value and state from its internals. Then, we remove it from
        // the form, add a new control, and simulate restoring the state and
        // value for that control.
        const [value, state] = getInternals(
          control,
        ).setFormValue.calls.mostRecent()?.args ?? [null, null];

        const newControl = document.createElement(
          control.tagName,
        ) as ExpectedFormAssociatedElement;
        // Include any children for controls like `<select>`
        newControl.append(...control.children);
        control.remove();
        form.appendChild(newControl);
        let restoreState: FormState | null | FormData = state ?? value;
        if (restoreState instanceof FormData) {
          restoreState = Array.from(restoreState.entries());
        }

        newControl?.formStateRestoreCallback(restoreState, 'restore');
        await newControl?.updateComplete;
      }

      const control = options.queryControl(form);
      if (!control) {
        throw new Error('`queryControl` must return an element.');
      }

      restoreTest.assertRestored(control);
    });
  }
}

/**
 * The expected interface of a Form Associated Custom Element. Used for type
 * checking in this file only.
 */
interface ExpectedFormAssociatedElement extends HTMLElement {
  new (): ExpectedFormAssociatedElement;
  constructor: (new () => ExpectedFormAssociatedElement) & {
    readonly formAssociated: true;
  };
  prototype: ExpectedFormAssociatedElement;
  form: HTMLFormElement | null;
  labels: NodeList;
  name: string;
  formStateRestoreCallback(
    state: FormState | null,
    reason: 'restore' | 'autocomplete',
  ): void;
  updateComplete?: Promise<void>;
}

/**
 * `formStateRestoreCallback` type for `state`. May be a string, `File`,
 * `FormData` entries, or null.
 */
type FormState = FormDataEntryValue | Array<[string, FormDataEntryValue]>;

/**
 * A test for `FormData` values.
 */
interface ValueTest {
  /**
   * The name of the test.
   */
  name: string;
  /**
   * Renders a form element with or without a value for form submission.
   */
  render(): TemplateResult;
  /**
   * Asserts that the form's `FormData` contains or does not contain the form
   * element's value.
   */
  assertValue(formData: FormData): void;
}

/**
 * A test for `formResetCallback`.
 */
interface ResetTest<T extends HTMLElement> {
  /**
   * The name of the test.
   */
  name: string;
  /**
   * Renders a form element with some initial state.
   */
  render(): TemplateResult;
  /**
   * Changes the state of a form element.
   */
  change(control: T): void;
  /**
   * Asserts that the control was reset to its initial state.
   */
  assertReset(control: T): void;
}

/**
 * A test form `formStateRestoreCallback`.
 */
interface RestoreTest<T extends HTMLElement> {
  /**
   * The name of the test.
   */
  name: string;
  /**
   * Renders a form element with some initial state.
   */
  render(): TemplateResult;
  /**
   * Asserts that the newly created control was restored to the original
   * control's state.
   */
  assertRestored(control: T): void;
}
