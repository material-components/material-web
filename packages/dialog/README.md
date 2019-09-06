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

<img src="images/simple.gif" width="596px">

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

<mwc-dialog id="dialog1" title="Phone Ringtone" open>
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

### Icon - Trailing

<img src="images/icon-trailing.png" width="244px">

```html
<mwc-dialog label="My Dialog" iconTrailing="delete"></mwc-dialog>
```

### Helper Text

<img src="images/helper.png" width="244px">

```html
<mwc-dialog label="My Dialog" helper="Helper Text"></mwc-dialog>
```

### Primary Color

<img src="images/color-primary.png" width="244px">

```html
<style>
  mwc-dialog {
    --mdc-theme-primary: green;
  }
</style>

<mwc-dialog
    label="My Dialog"
    iconTrailing="delete"
    required>
</mwc-dialog>
```

## Variants

### Outlined

<img src="images/outlined.png" width="244px">

```html
<mwc-dialog
    outlined
    label="My Dialog"
    iconTrailing="delete">
</mwc-dialog>
```

#### Shaping Outlined

<img src="images/shape-left.png" width="244px">
<img src="images/shape-right.png" width="244px">
<img src="images/shape-left-right.png" width="244px">

```html
<style>
  mwc-dialog.left {
    --mdc-notched-outline-leading-width: 28px;
    --mdc-notched-outline-leading-border-radius: 28px 0 0 28px;
  }

  mwc-dialog.right {
    --mdc-notched-outline-trailing-border-radius: 0 28px 28px 0;
  }
</style>

<mwc-dialog
    class="left";
    label="My Dialog"
    iconTrailing="delete"
    outlined>
</mwc-dialog>

<mwc-dialog
    class="right";
    label="My Dialog"
    iconTrailing="delete"
    outlined>
</mwc-dialog>

<mwc-dialog
    class="left right";
    label="My Dialog"
    iconTrailing="delete"
    outlined>
</mwc-dialog>
```

### Fullwidth

<img src="images/fullwidth.png" width="777px">

```html
<!-- Note: Fullwidth does not support label; only placeholder -->
<mwc-dialog fullwidth placeholder="Standard" helper="Helper Text"></mwc-dialog>
```

## API

### Properties/Attributes

| Name                | Type             | Description
| ------------------- | ---------------- |------------
| `value`             | `string`         | The input control's value.
| `type`              | `TextFieldType*` | A string specifying the type of control to render.
| `label`             | `string`         | Sets floating label value.
| `placeholder`       | `string`         | Sets disappearing input placeholder.
| `icon`              | `string`         | Leading icon to display in input. See [`mwc-icon`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon).
| `iconTrailing`      | `string`         | Trailing icon to display in input. See [`mwc-icon`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon).
| `disabled`          | `boolean`        | Whether or not the input should be disabled.
| `charCounter`       | `boolean`        | **Note: requries `maxLength` to be set.** Display character counter with max length.
| `outlined`          | `boolean`        | Whether or not to show the material outlined variant.
| `fullwidth`         | `boolean`        | Whether or not to make the input fullwidth. No longer displays `label`; only `placeholder` and `helper`.
| `helper`            | `string`         | Helper text to display below the input. Display default only when focused.
| `helperPersistent`  | `boolean`        | Always show the helper text despite focus.
| `required`          | `boolean`        | Displays error state if value is empty and input is blurred.
| `maxLength`         | `number`         | Maximum length to accept input.
| `validationMessage` | `string`         | Message to show in the error color when the dialog is invalid. (Helper text will not be visible)
| `pattern`           | `string`         | [`HTMLInputElement.prototype.pattern`](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes) (empty string will unset attribute)
| `min`               | `number|string`  | [`HTMLInputElement.prototype.min`](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes) (empty string will unset attribute)
| `max`               | `number|string`  | [`HTMLInputElement.prototype.max`](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes) (empty string will unset attribute)
| `step`              | `number|null`    | [`HTMLInputElement.prototype.step`](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation#Validation-related_attributes) (null will unset attribute)
| `validity`          | `ValidityState` (readonly) | The [`ValidityState`](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState) of the dialog.
| `willValidate`      | `boolean` (readonly)       | [`HTMLInputElement.prototype.willValidate`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement#Properties)
| `validityTransform` | `ValidityTransform**|null` | Callback called before each validation check. See the [validation section](#Validation) for more details.
| `validateOnInitialRender` | `boolean`            | Runs validation check on initial render.

\*  `TextFieldType` is exported by `mwc-dialog` and `mwc-dialog-base`
```ts
type TextFieldType = 'text'|'search'|'tel'|'url'|'email'|'password'|
    'date'|'month'|'week'|'time'|'datetime-local'|'number'|'color';
```

\*\* `ValidityTransform` is not exported. See the [validation section](#Validation) for more details.
```ts
type ValidityTransform = (value: string, nativeValidity: ValidityState) => Partial<ValidityState>
```

### Methods

| Name     | Description
| -------- | -------------
| `checkValidity() => boolean`   | Returns `true` if the dialog passes validity checks. Returns `false` and fires an [`invalid`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/invalid_event) event on the dialog otherwise.
| `reportValidity() => boolean`   | Runs `checkValidity()` method, and if it returns false, then ir reports to the user that the input is invalid.
| `setCustomValidity(message:string) => void`   | Sets a custom validity message (also overwrites `validationMessage`). If this message is not the empty string, then the element is suffering froma  custom validity error and does not validate.

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
