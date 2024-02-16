<!-- catalog-only-start --><!-- ---
name: Material Theming
title: Theming
order: 1
-----><!-- catalog-only-end -->

# Theming

<!-- go/mwc-theming -->

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'lizmitchell' reviewed: '2024-02-12' }
tag: 'docType:concepts'
*-->

<!-- [TOC] -->

[Material Design theming](https://m3.material.io/foundations/customization)<!-- {.external} -->
creates unique branded products with familiar patterns and accessible
interactions.

![collage of views of a mobile UI that show a user's setting and preference for
a green primary color flows through system UI
harmoniously](images/theming.png "A user-generated color scheme can flow through apps that use a custom theme.")

## Tokens

Material is expressed in
[design tokens](https://m3.material.io/foundations/design-tokens/overview)<!-- {.external} -->,
which are the building blocks of all UI elements.

Each component token maps to a system token, which has a concrete reference
value.

![A diagram showing the heirachy of component tokens to system tokens to
reference
tokens](images/token-types.png "The relationship between reference, system, and component tokens.")

On the web, design tokens are
[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)<!-- {.external} -->
and can be scoped with CSS selectors.

```css
.square-buttons {
  /* Changes all <md-filled-button> instances matching the selector */
  --md-filled-button-container-shape: 0px;
}
```

### Reference

Reference tokens hold concrete values, such as a hex color, pixel size, or font
family name.

#### Typeface

[`--md-ref-typeface` tokens](typography.md#typeface) can be used to change font
families and weights across all system and component tokens.

```css
:root {
  --md-ref-typeface-brand: 'Open Sans';
  --md-ref-typeface-plain: 'Open Sans';
}
```

#### Palette

*MWC does not currently support `--md-ref-palette` tokens.*

### System

System tokens define decisions and roles that give the design system its
character, from color and typography, to elevation and shape.

#### Color

[`--md-sys-color` tokens](color.md#tokens) define dynamic color roles that map
to components. See the [color guide](color.md) for more details.

```css
:root {
  --md-sys-color-primary: red;
  --md-sys-color-secondary: blue;
}
```

#### Typography

[`--md-sys-typography` tokens](typography.md#typescale) define typescale roles
that map to components. See the [typography guide](typography.md) for more
details.

```css
:root {
  --md-sys-typography-body-medium-size: 1rem;
  --md-sys-typography-body-medium-line-height: 1.5rem;
}
```

#### Shape

[`--md-sys-shape` tokens](shape.md#tokens) define corner shapes used in
components. See the [shape guide](shape.md) for more details.

```css
:root {
  --md-sys-shape-corner-small: 4px;
  --md-sys-shape-corner-medium: 6px;
  --md-sys-shape-corner-large: 8px;
}
```

#### Motion

*MWC does not currently support `--md-sys-motion` tokens.*

### Component

Component tokens are design attributes assigned to elements. They can be system
tokens or concrete values.

```css
:root {
  --md-filled-button-container-shape: 0px;
}

md-filled-button.error {
  --md-filled-button-container-color: var(--md-sys-color-error);
  --md-filled-button-label-text-color: var(--md-sys-color-on-error);
}
```

Refer to each [components' documentation](../components/) for available tokens.

> Note: unlike `--md-ref-*` and `--md-sys-*` tokens, which are prefixed with
> `ref` and `sys`, component tokens are *not* prefixed with `comp`.
