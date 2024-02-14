<!-- catalog-only-start --><!-- ---
name: Support
title: Support
order: 4
-----><!-- catalog-only-end -->

# Support

<!-- go/mwc-support -->

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'lizmitchell' reviewed: '2023-09-15' }
*-->

<!-- [TOC] -->

<!--#include file="../googlers/support.md" -->

## Browsers

<!-- go/mwc-browsers -->

MWC aims to support the latest two major versions of browsers at the time of
each release.

Current browsers and versions supported:

Browser | Version
------- | -------
Chrome  | 120 +
Edge    | 120 +
Firefox | 119 +
Safari* | 16.4 +

*\* previous versions of Safari may be supported with an
[`ElementInternals` polyfill](https://www.npmjs.com/package/element-internals-polyfill).*

## FAQ

<!-- go/mwc-faq -->

*If you have a question that isn't listed here, consider asking it so we can
include it!*

### How do I change the color of a button?

Many components have multiple tokens for a color, including "hover", "focus",
and "pressed" states.

Use `--md-sys-color-*` tokens to change the key color that the component uses.

```css
/* Buttons use the `primary` key color */
md-filled-button.spooky {
  --md-sys-color-primary: black;
  --md-sys-color-on-primary: yellow;
}

md-filled-button.error {
  --md-sys-color-primary: var(--md-sys-color-error);
  --md-sys-color-on-primary: var(--md-sys-color-on-error);
}
```

### Why does my color change on hover/focus/pressed?

Many colors have multiple tokens, including "hover", "focus", and "pressed"
states.

Rather than setting all of them, or use the `--md-sys-color-*` token that the
component maps to (see the previous question).

### Why doesn't `prefers-color-scheme: dark` work?

It's up to the app to decide when and how dark mode is applied. Any selector can
be used with `--md-sys-color-*` dark theme tokens to scope how the changes
apply.

For example, using Sass:

```scss
@use '@material/web/color/color';

:root {
  @media (prefers-color-scheme: dark) {
    @include color.dark-theme;
  }
}
```

> **Why not automatically?** Not all apps need dark mode, and the CSS size for
> automatically supporting it is much higher and not as flexible.

See
[How do I use `--md-sys-*` custom properties in my styles?](#how-do-i-use-md-sys-custom-properties-in-my-styles)
for more info on how to generate a set of dark theme tokens.

### How do I use `--md-sys-*` custom properties in my styles?

-   Use Sass APIs.

    ```scss
    @use '@material/web/color/color';
    @use '@material/web/color/typography';

    :root {
      @include color.light-theme;
      @include typography.theme;

      @media (prefers-color-scheme: dark) {
        @include color.dark-theme;
      }
    }
    ```

-   Use the
    [Material theme builder Figma plugin](https://www.figma.com/community/plugin/1034969338659738588/Material-Theme-Builder)<!-- {.external} -->
    to generate a color scheme.

-   Use the
    [`material-color-utilities` library](https://www.npmjs.com/package/@material/material-color-utilities)<!-- {.external} -->
    to generate color schemes at runtime.

### How do I customize an `<md-*>` element that is inside another component?

Use [CSS `::part()`s](https://developer.mozilla.org/en-US/docs/Web/CSS/::part)
to access sub-components. The part name is the sub-component's tag name without
the "md-" prefix.

```css
md-checkbox::part(focus-ring) {
  width: 32px;
  height: 32px;
}
```
