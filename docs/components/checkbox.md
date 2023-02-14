# Checkbox

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'lizmitchell' reviewed: '2023-01-25' }
*-->

<!-- go/md-checkbox -->

<!-- [TOC] -->

[Checkboxes](https://m3.material.io/components/checkbox)<!-- {.external} --> allow users
to select one or more items from a set. Checkboxes can turn an option on or off.

There's one type of checkbox in Material. Use this selection control when the
user needs to select one or more options from a list.

![A list of burger additions represented with checkboxes](images/checkbox/hero.png "Checkboxes in a list of items.")

*   [Design article](https://m3.material.io/components/checkbox) <!-- {.external} -->
*   API Documentation (*coming soon*)
*   [Source code](https://github.com/material-components/material-web/tree/master/checkbox)
    <!-- {.external} -->

## Usage

Checkboxes may be standalone, pre-checked, or indeterminate.

![Three checkboxes in a row that are unselected, selected, and indeterminate](images/checkbox/usage.png "Unselected, selected, and indeterminate checkboxes.")

```html
<md-checkbox></md-checkbox>
<md-checkbox checked></md-checkbox>
<md-checkbox indeterminate></md-checkbox>
```

### Label

Associate a label with a checkbox using the `<label>` element.

![Two checkboxes with labels](images/checkbox/usage-label.png "Labeled checkboxes.")

```html
<label>
  <md-checkbox></md-checkbox>
  Checkbox one
</label>

<md-checkbox id="checkbox-two"></md-checkbox>
<label for="checkbox-two">Checkbox two</label>
```

## Accessibility

Add an
[`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)<!-- {.external} -->
attribute to checkboxes without labels or checkboxes whose labels need to be
more descriptive.

```html
<md-checkbox aria-label="Select all checkboxes"></md-checkbox>

<label>
  <md-checkbox aria-label="Agree to terms and conditions"></md-checkbox>
  Agree
</label>
```

## Theming

Checkbox supports [Material theming](../theming.md) and can be customized in
terms of color and shape.

### Tokens

Token                                    | Default value
---------------------------------------- | -----------------------------------
`--md-checkbox-unselected-outline-color` | `--md-sys-color-on-surface-variant`
`--md-checkbox-selected-container-color` | `--md-sys-color-primary`
`--md-checkbox-selected-icon-color`      | `--md-sys-color-on-primary`
`--md-checkbox-container-shape`          | `2px`

*   [All tokens](https://github.com/material-components/material-web/blob/master/tokens/v0_152/_md-comp-checkbox.scss)
    <!-- {.external} -->

### Example

![Image of a checkbox with a different theme applied](images/checkbox/theming.png "Checkbox theming example.")

```html
<style>
:root {
  --md-sys-color-primary: #006A6A;
  --md-sys-color-on-primary: #FFFFFF;
  --md-sys-color-on-surface-variant: #3F4948;
  --md-checkbox-container-shape: 0px;
}
</style>

<md-checkbox></md-checkbox>
<md-checkbox checked></md-checkbox>
```
