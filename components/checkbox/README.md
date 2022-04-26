# Checkbox
Checkbox inputs provide a variety of options to your user and allow multiple
options to be selected.

## Using checkboxes

### Installation

```
npm install @material/md-checkbox
```

## Example usage

### Checkbox

<img src="images/checkbox.png" alt="Selected checkbox" width="64px">

```html
<md-checkbox checked>
</md-checkbox>
```

## Theming example

<img src="images/checkbox-theme.png" alt="Checkbox with custom theme (green color checkbox with green ripple on focus)" width="64px">

```scss
@use '@material/md-checkbox' as checkbox;

md-checkbox {
  @include checkbox.theme((
    selected-container-color: darkgreen,
    selected-hover-container-color: darkgreen,
    selected-focus-container-color: darkgreen,
    selected-pressed-container-color: darkgreen,
    selected-hover-state-layer-color: darkgreen,
    selected-focus-state-layer-color: darkgreen,
    selected-pressed-state-layer-color: darkgreen,
  ));
}
```

For the full list of supported theme keys, see the
[checkbox tokens](https://github.com/material-components/material-web/blob/master/components/tokens/latest/_md-comp-checkbox.scss).

## API

### Properties and attributes

#### `<md-checkbox>`

| Name                 | Type      | Default     | Description                 |
| -------------------- | --------- | ----------- | --------------------------- |
| `aria-label`         | `string`  | `undefined` | Accessible label for the checkbox. |
| `aria-labelledby`    | `string`  | `undefined` | ID reference of the label assigned to checkbox for accessibility. |
| `aria-describedby`   | `string`  | `undefined` | ID reference of the description text assigned to checkbox for accessibility. |
| `disabled`           | `boolean` | `false`     | Disabled checkbox cannot be interacted with and have no visual interaction effect.  |
| `checked`            | `boolean` | `false`     | Whether the checkbox is in selected state. |
| `indeterminate`      | `boolean` | `false`     | Whether the checkbox is in indeterminate state. |
| `name`               | `string`  | `''`        | The name of the checkbox included when the form is submitted. |
| `value`              | `string`  | `on`        | The value that will be included if the checkbox is submitted in a form.        |
| `reducedTouchTarget` | `boolean` | `false`     | When `true`, the checkbox remove padding for touchscreens and increase density. Note, the checkbox will no longer meet accessibility guidelines for touch. |

### Events

Event Name | Target        | Detail | Description
---------- | ------------- | ------ | -----------
`change`   | `md-checkbox` | `{}`   | Fired when the user modifies the checkbox `checked` or `indeterminate` states from an input device interaction. Note that, like [native `<input>`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event), the `change` event is *not* fired when the `checked` or `indeterminate` properties are set from JavaScript.
