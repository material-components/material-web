<!-- catalog-only-start --><!-- ---
name: Checkbox
dirname: checkbox
-----><!-- catalog-only-end -->

<catalog-component-header>
<catalog-component-header-title slot="title">

# Checkbox

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'emarquez' reviewed: '2023-05-03' }
tag: 'docType:reference'
*-->

<!-- github-only-start -->

<!-- go/md-checkbox -->

<!-- [TOC] -->

TODO: update link to live site

**This documentation is fully rendered on the
[Material Web catalog](https://github.com/material-components/material-web/tree/main)<!-- {.external} -->.**

<!-- github-only-end -->

[Checkboxes](https://m3.material.io/components/checkbox)<!-- {.external} --> allow users
to select one or more items from a set. Checkboxes can turn an option on or off.

There's one type of checkbox in Material. Use this selection control when the
user needs to select one or more options from a list.

</catalog-component-header-title>

<img
    class="hero"
    src="images/checkbox/hero.png"
    alt="A list of burger additions represented with checkboxes"
    title="Checkboxes in a list of items.">

</catalog-component-header>

*   [Design article](https://m3.material.io/components/checkbox) <!-- {.external} -->
*   API Documentation (*coming soon*)
*   [Source code](https://github.com/material-components/material-web/tree/main/checkbox)
    <!-- {.external} -->

<!-- catalog-only-start -->

<!--

## Interactive Demo

{% playgroundexample dirname=dirname %}

-->

<!-- catalog-only-end -->

## Usage

Checkboxes may be standalone, pre-checked, or indeterminate.

<!-- github-only-start -->

![Three checkboxes in a row that are unselected, selected, and indeterminate](images/checkbox/usage.png "Unselected, selected, and indeterminate checkboxes.")

<!-- github-only-end -->
<!-- catalog-only-start -->

<!--

<div class="figure-wrapper">
  <figure
      style="justify-content:center;"
      aria-label="Three checkboxes in a row that are unselected, selected, and indeterminate">
    <md-checkbox></md-checkbox>
    <md-checkbox checked></md-checkbox>
    <md-checkbox indeterminate></md-checkbox>
  </figure>
</div>

-->

<!-- catalog-only-end -->

```html
<md-checkbox></md-checkbox>
<md-checkbox checked></md-checkbox>
<md-checkbox indeterminate></md-checkbox>
```

### Label

Associate a label with a checkbox using the `<label>` element.

<!-- github-only-start -->

![Two checkboxes with labels](images/checkbox/usage-label.png "Labeled checkboxes.")

<!-- github-only-end -->
<!-- catalog-only-start -->

<!--

<div class="figure-wrapper">
  <figure
      style="justify-content:center;align-items:center;"
      aria-label="Two checkboxes with labels">
    <label style="display:flex;align-items:center;">
      <md-checkbox></md-checkbox>
      Checkbox one
    </label>
    <md-checkbox id="checkbox-two"></md-checkbox>
    <label for="checkbox-two">Checkbox two</label>
  </figure>
</div>

-->

<!-- catalog-only-end -->

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

*   [All tokens](https://github.com/material-components/material-web/blob/main/tokens/v0_160/_md-comp-checkbox.scss)
    <!-- {.external} -->

### Example

<!-- github-only-start -->

![Image of a checkbox with a different theme applied](images/checkbox/theming.png "Checkbox theming example.")

<!-- github-only-end -->
<!-- catalog-only-start -->

<!--

<div class="figure-wrapper">
  <figure
      style="justify-content:center;align-items:center;"
      class="styled-example"
      aria-label="Image of a checkbox with a different theme applied">
  <style>
    .styled-example {
      background-color: white;
      border-radius: 28px;
      /* System tokens */
      --md-sys-color-primary: #006a6a;
      --md-sys-color-on-primary: #ffffff;
      --md-sys-color-on-surface-variant: #3f4948;
      /* Component tokens */
      --md-checkbox-container-shape: 0px;
    }
  </style>

<md-checkbox></md-checkbox>
<md-checkbox checked></md-checkbox>

  </figure>
</div>

-->

<!-- catalog-only-end -->

```html
<style>
  :root {
    /* System tokens */
    --md-sys-color-primary: #006a6a;
    --md-sys-color-on-primary: #ffffff;
    --md-sys-color-on-surface-variant: #3f4948;

    /* Component tokens */
    --md-checkbox-container-shape: 0px;
  }
</style>

<md-checkbox></md-checkbox>
<md-checkbox checked></md-checkbox>
```
