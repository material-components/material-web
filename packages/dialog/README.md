# `<mwc-dialog>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-dialog.svg)](https://www.npmjs.com/package/@material/mwc-dialog)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Dialogs inform users about a task and can contain critical information, require decisions, or involve multiple tasks.

<img src="images/standard.gif" width="607px">

[Material Design Guidelines: text fields](https://material.io/design/components/text-fields.html)

## Installation

```sh
npm install @material/mwc-dialog
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example usage

### Simple

<img src="images/simple.gif" width="314px">

```html
<mwc-dialog
    title="Simple Dialog"
    open
    hideActions>
  <ul>
    <li dialog-action="item1">Item 1</li>
    <li dialog-action="item2">Item 2</li>
    <li dialog-action="item3">Item 3</li>
    <li dialog-action="item4">Item 4</li>
  </ul>
</mwc-dialog>
<style>
  /* hover styling for the lists */
  ...
</style>

<script type="module">
  import '@material/mwc-dialog';
</script>
```

### Confirmation

<img src="images/confirmation.gif" width="607px">

```html
<style>
  mwc-dialog > div, mwc-radio {
    display: flex;
    align-items: center;
  }
</style>

<mwc-dialog title="Phone Ringtone" open>
  <div>
    <mwc-radio id="a1" name="a" checked></mwc-radio>
    <label>Never Gonna Give You Up</label>
  </div>
  <div>
    <mwc-radio name="a"></mwc-radio>
    <label>Hot Cross Buns</label>
  </div>
  <div>
    <mwc-radio name="a"></mwc-radio>
    <label>None</label>
  </div>

  <mwc-button
      dialog-action="ok"
      slot="primaryAction">
    ok
  </mwc-button>
  <mwc-button
      dialog-action="cancel"
      slot="secondaryAction">
    cancel
  </mwc-button>
</mwc-dialog>

<script type="module">
  import '@material/mwc-dialog';
  import '@material/mwc-button/mwc-button.js';
  import '@material/mwc-radio/mwc-radio.js';
</script>
```

### Alert

<img src="images/alert.gif" width="308px">

```html
<mwc-dialog open>
  <div>Discard draft?</div>
  <mwc-button
      slot="primaryAction"
      dialog-action="discard">
    Discard
  </mwc-button>
  <mwc-button
      slot="secondaryAction"
      dialog-action="cancel">
    Cancel
  </mwc-button>
</mwc-dialog>
```

### Helper Text

<video src="images/scrollable.webm" autoplay loop muted playsinline width="580px">
</video>

If the above video does not load, view the large gif [here](images/scrollable.gif).

```html
<mwc-dialog title="Privacy Policy" open>
  <div>
    really large amount of text...
  </div>
  <mwc-button
      slot="primaryAction"
      dialog-action="accept">
    Accept
  </mwc-button>
  <mwc-button
      slot="secondaryAction"
      dialog-action="decline"
      disabled>
    Decline
  </mwc-button>
</mwc-dialog>
```

### Styled

<img src="images/styled.png" width="543px">

```html
<style>
  .styled {
    --mdc-theme-surface: lightgreen;
    --mdc-dialog-scrim-color: rgba(250, 128, 114, .32);
    --mdc-dialog-title-ink-color: fuchsia;
    --mdc-dialog-content-ink-color: firebrick;
    --mdc-dialog-scroll-divider-color: red;
    --mdc-dialog-min-width: 500px;
    --mdc-dialog-max-width: 700px;
    --mdc-dialog-max-height: 350px;
    --mdc-dialog-shape-radius: 25px;
  }
</style>

<!-- <mwc-button data-num="5" raised>Styled</mwc-button> -->
<mwc-dialog title="Styled" class="styled" open>
  <div>These are the current styles applied to this dialog</div>
  <pre>
--mdc-theme-surface: lightgreen;
--mdc-dialog-scrim-color: rgba(250, 128, 114, .32);
--mdc-dialog-title-ink-color: fuchsia;
--mdc-dialog-content-ink-color: firebrick;
--mdc-dialog-scroll-divider-color: red;
--mdc-dialog-min-width: 500px;
--mdc-dialog-max-width: 700px;
--mdc-dialog-max-height: 350px;
--mdc-dialog-shape-radius: 25px;
  </pre>
  <mwc-button slot="primaryAction" dialog-action="close">
    Too stylish for me!
  </mwc-button>
</mwc-dialog>
```

### Initial Focus

<img src="images/initial-focus.png" width="594x">

```html
<mwc-dialog title="Initial Focus">
  <div>
    In this example we set "dialog-initial-focus" on a focusable element.
    When this dialog opens, the secondary button is focused.
  </div>
  </mwc-textfield>
  <mwc-button
      slot="primaryAction"
      dialog-action="close">
    Primary
  </mwc-button>
  <mwc-button
      slot="secondaryAction"
      dialog-action="close"
      dialog-initial-focus>
    Secondary
  </mwc-button>
</mwc-dialog>
```

### Stacked

<img src="images/stacked.png" width="594px">

```html
<mwc-dialog title="Stacked" stacked>
  <div>
    This is what happens when you set the stacked property on mwc-dialog.
    Notice that the primary action is now on top.
  </div>
  <mwc-button slot="primaryAction" dialog-action="close">
    Primary
  </mwc-button>
  <mwc-button slot="secondaryAction" dialog-action="close">
    Secondary
  </mwc-button>
</mwc-dialog>
```

## API

### Properties/Attributes

| Name                    | Type      | Description
| ----------------------- | --------- |------------
| `open`                  | `boolean` | Whether or not the dialog should open.
| `hideActions`           | `boolean` | Hides the actions footer of the dialog. Needed to remove excess padding when no actions are slotted in.
| `stacked`               | `boolean` | Whether or not to stack the action buttons.
| `title`                 | `string`  | Title of the dialog.
| `scrimClickAction`      | `string`  | _Default: 'close'_ – Action to be emitted when the dialog closes because the scrim was clicked (see [actions section](#actions)).
| `escapeKeyAction`       | `string`  | _Default: 'close'_ – Action to be emitted when the dialog closes because the excape key was pressed (see [actions section](#actions)).
| `defaultAction`         | `string`  | _Default: 'close'_ – Action emitted when `<mwc-dialog>.open` is toggled (see [actions section](#actions)).
| `actionAttribute`       | `string`  | _Default: 'dialog-action'_ – Attribute to read in light dom of dialog for closing action value (see [actions section](#actions)).
| `initialFocusAttribute` | `string`  | _Default: 'dialog-initial-focus'_ – Attribute to search for in light dom for initial focus on dialog open.

### Methods

| Name     | Description
| -------- | -------------
| `forceLayout() => void` | Forces dialog to relayout (animation frame time). May be required if dialog size is incorrect or if stacked layout has not been triggered correctly.
| `focus() => void` | Focuses on the initial focus element (see [focus section](#focus)).
| `blur() => void` | Blurs the active element.

### CSS Custom Properties

Inherits CSS Custom properties from:
* [`mwc-ripple`](https://github.com/material-components/material-components-web-components/tree/master/packages/ripple)
* [`mwc-notched-outline`](https://github.com/material-components/material-components-web-components/tree/master/packages/notched-outline).
* [`mwc-icon`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon)

| Name                                              | Default               | Description
| ------------------------------------------------- | --------------------- |------------
| `--mdc-theme-primary`                             | `#6200ee`             | Color when active of the underline ripple, the outline, and the caret.
| `--mdc-theme-error`                               | `#b00020`             | Color when errored of the underline, the outline, the caret, and the icons.
| `--mdc-text-field-filled-border-radius`           | `4px 4px 0 0`         | Border radius of the standard / filled dialog's background filling.
| `--mdc-text-field-outlined-idle-border-color`     | `rgba(0, 0, 0, 0.38)` | Color of the outlined dialog's  outline when idle.
| `--mdc-text-field-outlined-hover-border-color`    | `rgba(0, 0, 0, 0.87)` | Color of the outlined dialog's outline when hovering.
| `--mdc-text-field-outlined-disabled-border-color` | `rgba(0, 0, 0, 0.06)` | Color of the outlined dialog's outline when disabled.

### Validation

`<mwc-dialog>` follows the basic `<input>` [constraint validation model](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation).
It exposes:

* `required`
* `maxLength`
* `pattern`
* `min`
* `max`
* `step`
* `validity`
* `willValidate`
* `checkValidity()`
* `reportValidity()`
* `setCustomValidity(message)`

Additionally, it implements more features such as:
* `validationMessage`
* `validateOnInitialRender`
* and `validityTransform`

By default, `<mwc-dialog>` will report validation on `blur`.

#### Custom validation logic

The `validityTransform` property is a function that can be set on `<mwc-dialog>` to
implement custom validation logic that transforms the `ValidityState` of the
input control. The type of a `ValidityTransform` is the following:

```ts
(value: string, nativeValidity: ValidityState) => Partial<ValidityState>
```

Where `value` is the new value in the dialog to be validated and
`nativeValidity` is an interface of
[`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState)
of the native input control. For example:

```html
<mwc-dialog
    id="my-dialog"
    pattern="[0-9]+"
    value="doggos">
</mwc-dialog>
<script>
  const dialog = document.querySelector('#my-dialog');
  dialog.validityTransform = (newValue, nativeValidity) => {
    if (!nativeValidity.valid) {
      if (nativeValidity.patternMismatch) {
        const hasDog = newValue.includes('dog');
        // changes to make to the nativeValidity
        return {
          valid: hasDog,
          patternMismatch: !hasDog;
        };
      } else {
        // no changes
        return {};
      }
    } else {
      const isValid = someExpensiveOperation(newValue);
      // changes to make to the native validity
      return {
        valid: isValid,
        // or whatever type of ValidityState prop you would like to set (if any)
        customError: !isValid,
      };
    }
  }
</script>
```

In this example we first check the native validity which is invalid due to the
pattern mismatching (the value is `doggos` which is not a number). The value
includes `dog`, thus we make it valid and undo the pattern mismatch.

In this example, we also skip an expensive validity check by short-circuiting
the validation by checking the native validation.

*Note:* the UI will only update as valid / invalid by checking the `valid`
property of the transformed `ValidityState`.

## Additional references

- [MDC Web dialogs](https://material.io/develop/web/components/input-controls/text-field/)
