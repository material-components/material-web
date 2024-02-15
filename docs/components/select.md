<!-- catalog-only-start --><!-- ---
name: Select
dirname: select
-----><!-- catalog-only-end -->

<catalog-component-header image-align="start">
<catalog-component-header-title slot="title">

# Select

<!-- no-catalog-start -->

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'ajakubowicz' reviewed: '2023-09-14' }
tag: 'docType:reference'
*-->

<!-- go/md-select -->

<!-- [TOC] -->

<!-- external-only-start -->
**This documentation is fully rendered on the
[Material Web catalog](https://material-web.dev/components/select/)**
<!-- external-only-end -->

<!-- no-catalog-end -->

[Select menus](https://m3.material.io/components/menus/overview#b1704de4-94b7-4177-9e96-b677ae767cb4)<!-- {.external} -->
display a list of choices on temporary surfaces and display the currently
selected menu item above the menu.

</catalog-component-header-title>

<img class="hero" src="images/select/hero.png" alt="A textfield containing the text Item 2, with a dropdown menu containing Item 1, Item 2, and Item 3.">

</catalog-component-header>

*   Design article (*coming soon*)
*   [API Documentation](#api)
*   [Source code](https://github.com/material-components/material-web/tree/main/select)
    <!-- {.external} -->

## Usage

Select (also referred to as a dropdown menu) allows choosing a value from a
fixed list of available options. It is analogous to the native HTML
[`<select>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/select)<!-- {.external} -->.

<!-- no-catalog-start -->

![Example usage of an outlined dropdown menu and a filled dropdown menu.](images/select/usage.png "An outlined dropdown menu filled with Apple, and a filled dropdown menu.")

<!-- no-catalog-end -->
<!-- catalog-include "figures/select/usage.html" -->

```html
<md-outlined-select>
  <md-select-option aria-label="blank"></md-select-option>
  <md-select-option selected value="apple">
    <div slot="headline">Apple</div>
  </md-select-option>
  <md-select-option value="apricot">
    <div slot="headline">Apricot</div>
  </md-select-option>
</md-outlined-select>

<md-filled-select>
  <md-select-option aria-label="blank"></md-select-option>
  <md-select-option value="apple">
    <div slot="headline">Apple</div>
  </md-select-option>
  <md-select-option value="apricot">
    <div slot="headline">Apricot</div>
  </md-select-option>
</md-filled-select>
```

### Required select

Indicate that a selection is mandatory by adding the `required` attribute.

```html
<md-filled-select required>
  <md-select-option value="one">
    <div slot="headline">One</div>
  </md-select-option>
  <md-select-option value="two">
    <div slot="headline">Two</div>
  </md-select-option>
</md-filled-select>
```

<!--
## Accessibility

*Insert a 1-2 sentence description of a common accessibility scenario, followed
by a code snippet. Do not include a rendered image for accessibility examples.*

```html
<component-name aria-label="Example">
```

*Repeat with additional examples as needed to explain how to make the component
accessible.* -->

## Theming

Select supports
[Material theming](https://github.com/material-components/material-web/blob/main/docs/theming/README.md)<!-- {.external} -->
and can be customized in terms of color, typography, and shape.

### Filled Select tokens

Token                                            | Default value
------------------------------------------------ | -------------
`--md-filled-select-text-field-container-color`  | `--md-sys-color-surface-container-highest`
`--md-filled-select-text-field-container-shape`  | `--md-sys-shape-corner-extra-small`
`--md-filled-select-text-field-input-text-color` | `--md-sys-color-on-surface`
`--md-filled-select-text-field-input-text-font`  | `--md-sys-typescale-body-large-font`

*   [Filled Select tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-filled-select.scss)
    <!-- {.external} -->

To theme the select's dropdown menu, use the `md-menu` component tokens on the
`::part(menu)` selector.

### Filled Select example

<!-- no-catalog-start -->

![Image of a filled select with a different theme applied](images/select/theming-filled.png "Filled select theming example.")

<!-- no-catalog-end -->
<!-- catalog-include "figures/select/theming-filled.html" -->

```html
<style>
:root {
  --md-filled-select-text-field-container-shape: 0px;
  --md-filled-select-text-field-container-color: #f7faf9;
  --md-filled-select-text-field-input-text-color: #005353;
  --md-filled-select-text-field-input-text-font: system-ui;
}

md-filled-select::part(menu) {
  --md-menu-container-color: #f4fbfa;
  --md-menu-container-shape: 0px;
}
</style>

<md-filled-select>
  <md-select-option selected value="apple">
    <div slot="headline">Apple</div>
  </md-select-option>
  <md-select-option value="tomato">
    <div slot="headline">Tomato</div>
  </md-select-option>
</md-filled-select>
```

### Outlined Select tokens

Token                                              | Default value
-------------------------------------------------- | -------------
`--md-outlined-select-text-field-outline-color`    | `--md-sys-color-outline`
`--md-outlined-select-text-field-container-shape`  | `--md-sys-shape-corner-extra-small`
`--md-outlined-select-text-field-input-text-color` | `--md-sys-color-on-surface`
`--md-outlined-select-text-field-input-text-font`  | `--md-sys-typescale-body-large-font`

*   [Outlined Select tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-outlined-select.scss)
    <!-- {.external} -->

### Outlined Select example

<!-- no-catalog-start -->

![Image of a outlined select with a different theme applied](images/select/theming-outlined.png "Outlined select theming example.")

<!-- no-catalog-end -->
<!-- catalog-include "figures/select/theming-outlined.html" -->

```html
<style>
:root {
  --md-outlined-select-text-field-outline-color: #6e7979;
  --md-outlined-select-text-field-container-shape: 0px;
  --md-outlined-select-text-field-input-text-color: #005353;
  --md-outlined-select-text-field-input-text-font: system-ui;
}

md-outlined-select::part(menu) {
  --md-menu-container-color: #f4fbfa;
  --md-menu-container-shape: 0px;
}
</style>

<md-outlined-select>
  <md-select-option selected value="apple">
    <div slot="headline">Apple</div>
  </md-select-option>
  <md-select-option value="tomato">
    <div slot="headline">Tomato</div>
  </md-select-option>
</md-outlined-select>
```

<!-- auto-generated API docs start -->

## API


### MdFilledSelect <code>&lt;md-filled-select&gt;</code>

#### Properties

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Property | Attribute | Type | Default | Description
--- | --- | --- | --- | ---
`quick` | `quick` | `boolean` | `false` | Opens the menu synchronously with no animation.
`required` | `required` | `boolean` | `false` | Whether or not the select is required.
`disabled` | `disabled` | `boolean` | `false` | Disables the select.
`errorText` | `error-text` | `string` | `''` | The error message that replaces supporting text when `error` is true. If `errorText` is an empty string, then the supporting text will continue to show.<br>This error message overrides the error message displayed by `reportValidity()`.
`label` | `label` | `string` | `''` | The floating label for the field.
`supportingText` | `supporting-text` | `string` | `''` | Conveys additional information below the select, such as how it should be used.
`error` | `error` | `boolean` | `false` | Gets or sets whether or not the select is in a visually invalid state.<br>This error state overrides the error state controlled by `reportValidity()`.
`menuPositioning` | `menu-positioning` | `string` | `'absolute'` | Whether or not the underlying md-menu should be position: fixed to display in a top-level manner, or position: absolute.<br>position:fixed is useful for cases where select is inside of another element with stacking context and hidden overflows such as `md-dialog`.
`typeaheadDelay` | `typeahead-delay` | `number` | `DEFAULT_TYPEAHEAD_BUFFER_TIME` | The max time between the keystrokes of the typeahead select / menu behavior before it clears the typeahead buffer.
`hasLeadingIcon` | `has-leading-icon` | `boolean` | `false` | Whether or not the text field has a leading icon. Used for SSR.
`displayText` | `display-text` | `string` | `''` | Text to display in the field. Only set for SSR.
`value` | `value` | `string` | `undefined` |
`selectedIndex` | `selected-index` | `number` | `undefined` |
`options` |  | `SelectOption[]` | `undefined` |
`selectedOptions` |  | `SelectOption[]` | `undefined` |
`name` |  | `string` | `undefined` |
`form` |  | `HTMLFormElement` | `undefined` |
`labels` |  | `NodeList` | `undefined` |
`validity` |  | `ValidityState` | `undefined` |
`validationMessage` |  | `string` | `undefined` |
`willValidate` |  | `boolean` | `undefined` |

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Methods

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Method | Parameters | Returns | Description
--- | --- | --- | ---
`select` | `value` | `void` | Selects an option given the value of the option, and updates MdSelect's value.
`selectIndex` | `index` | `void` | Selects an option given the index of the option, and updates MdSelect's value.
`reset` | _None_ | `void` | Reset the select to its default value.
`checkValidity` | _None_ | `boolean` | Checks the select's native validation and returns whether or not the element is valid.<br>If invalid, this method will dispatch the `invalid` event.<br>https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity
`reportValidity` | _None_ | `boolean` | Checks the select's native validation and returns whether or not the element is valid.<br>If invalid, this method will dispatch the `invalid` event.<br>This method will display or clear an error text message equal to the select's `validationMessage`, unless the invalid event is canceled.<br>Use `setCustomValidity()` to customize the `validationMessage`.<br>This method can also be used to re-announce error messages to screen readers.
`setCustomValidity` | `error` | `void` | Sets the select's native validation error message. This is used to customize `validationMessage`.<br>When the error is not an empty string, the select is considered invalid and `validity.customError` will be true.<br>https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/setCustomValidity
`getUpdateComplete` | _None_ | `Promise<boolean>` |

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Events

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Event | Description
--- | ---
`input` | Fired when a selection is made by the user via mouse or keyboard interaction.
`change` | Fired when a selection is made by the user via mouse or keyboard interaction.
`opening` | Fired when the select's menu is about to open.
`opened` | Fired when the select's menu has finished animations and opened.
`closing` | Fired when the select's menu is about to close.
`closed` | Fired when the select's menu has finished animations and closed.

<!-- mdformat on(autogenerated might break rendering in catalog) -->

### MdOutlinedSelect <code>&lt;md-outlined-select&gt;</code>

#### Properties

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Property | Attribute | Type | Default | Description
--- | --- | --- | --- | ---
`quick` | `quick` | `boolean` | `false` | Opens the menu synchronously with no animation.
`required` | `required` | `boolean` | `false` | Whether or not the select is required.
`disabled` | `disabled` | `boolean` | `false` | Disables the select.
`errorText` | `error-text` | `string` | `''` | The error message that replaces supporting text when `error` is true. If `errorText` is an empty string, then the supporting text will continue to show.<br>This error message overrides the error message displayed by `reportValidity()`.
`label` | `label` | `string` | `''` | The floating label for the field.
`supportingText` | `supporting-text` | `string` | `''` | Conveys additional information below the select, such as how it should be used.
`error` | `error` | `boolean` | `false` | Gets or sets whether or not the select is in a visually invalid state.<br>This error state overrides the error state controlled by `reportValidity()`.
`menuPositioning` | `menu-positioning` | `string` | `'absolute'` | Whether or not the underlying md-menu should be position: fixed to display in a top-level manner, or position: absolute.<br>position:fixed is useful for cases where select is inside of another element with stacking context and hidden overflows such as `md-dialog`.
`typeaheadDelay` | `typeahead-delay` | `number` | `DEFAULT_TYPEAHEAD_BUFFER_TIME` | The max time between the keystrokes of the typeahead select / menu behavior before it clears the typeahead buffer.
`hasLeadingIcon` | `has-leading-icon` | `boolean` | `false` | Whether or not the text field has a leading icon. Used for SSR.
`displayText` | `display-text` | `string` | `''` | Text to display in the field. Only set for SSR.
`value` | `value` | `string` | `undefined` |
`selectedIndex` | `selected-index` | `number` | `undefined` |
`options` |  | `SelectOption[]` | `undefined` |
`selectedOptions` |  | `SelectOption[]` | `undefined` |
`name` |  | `string` | `undefined` |
`form` |  | `HTMLFormElement` | `undefined` |
`labels` |  | `NodeList` | `undefined` |
`validity` |  | `ValidityState` | `undefined` |
`validationMessage` |  | `string` | `undefined` |
`willValidate` |  | `boolean` | `undefined` |

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Methods

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Method | Parameters | Returns | Description
--- | --- | --- | ---
`select` | `value` | `void` | Selects an option given the value of the option, and updates MdSelect's value.
`selectIndex` | `index` | `void` | Selects an option given the index of the option, and updates MdSelect's value.
`reset` | _None_ | `void` | Reset the select to its default value.
`checkValidity` | _None_ | `boolean` | Checks the select's native validation and returns whether or not the element is valid.<br>If invalid, this method will dispatch the `invalid` event.<br>https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/checkValidity
`reportValidity` | _None_ | `boolean` | Checks the select's native validation and returns whether or not the element is valid.<br>If invalid, this method will dispatch the `invalid` event.<br>This method will display or clear an error text message equal to the select's `validationMessage`, unless the invalid event is canceled.<br>Use `setCustomValidity()` to customize the `validationMessage`.<br>This method can also be used to re-announce error messages to screen readers.
`setCustomValidity` | `error` | `void` | Sets the select's native validation error message. This is used to customize `validationMessage`.<br>When the error is not an empty string, the select is considered invalid and `validity.customError` will be true.<br>https://developer.mozilla.org/en-US/docs/Web/API/HTMLSelectElement/setCustomValidity
`getUpdateComplete` | _None_ | `Promise<boolean>` |

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Events

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Event | Description
--- | ---
`input` | Fired when a selection is made by the user via mouse or keyboard interaction.
`change` | Fired when a selection is made by the user via mouse or keyboard interaction.
`opening` | Fired when the select's menu is about to open.
`opened` | Fired when the select's menu has finished animations and opened.
`closing` | Fired when the select's menu is about to close.
`closed` | Fired when the select's menu has finished animations and closed.

<!-- mdformat on(autogenerated might break rendering in catalog) -->

### MdSelectOption <code>&lt;md-select-option&gt;</code>

#### Properties

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Property | Attribute | Type | Default | Description
--- | --- | --- | --- | ---
`disabled` | `disabled` | `boolean` | `false` | Disables the item and makes it non-selectable and non-interactive.
`selected` | `selected` | `boolean` | `false` | Sets the item in the selected visual state when a submenu is opened.
`value` | `value` | `string` | `''` | Form value of the option.
`type` |  | `string` | `'option' as const` |
`typeaheadText` |  | `string` | `undefined` |
`displayText` |  | `string` | `undefined` |

<!-- mdformat on(autogenerated might break rendering in catalog) -->

#### Events

<!-- mdformat off(autogenerated might break rendering in catalog) -->

Event | Description
--- | ---
`close-menu` | Closes the encapsulating menu on
`request-selection` | Requests the parent md-select to select this element (and deselect others if single-selection) when `selected` changed to `true`.
`request-deselection` | Requests the parent md-select to deselect this element when `selected` changed to `false`.

<!-- mdformat on(autogenerated might break rendering in catalog) -->

<!-- auto-generated API docs end -->
