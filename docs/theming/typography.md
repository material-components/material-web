<!-- catalog-only-start --><!-- ---
name: Typography
title: Typography
order: 3
-----><!-- catalog-only-end -->

# Typography

<!-- go/mwc-typography -->

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'lizmitchell' reviewed: '2024-03-05' }
tag: 'docType:howTo'
*-->

<!-- [TOC] -->

[Typography](https://m3.material.io/styles/typography)<!-- {.external} --> helps make
writing legible and beautiful.

> Tip: "typeface" and "typescale" can be confusing. "face" refers to
> `font-family` and `font-weight`.
>
> "scale" refers to a group of `font-family`, `font-size`, `line-height`, and
> `font-weight` tokens.

## Typeface

<!-- go/md-ref-typeface -->

A [typeface](https://m3.material.io/styles/typography/fonts)<!-- {.external} --> is a
`font-family`. In Material there are plain and brand typefaces.

Each typeface has normal, medium, and bold styles (defaults to `400`, `500`, and
`700`). All three weight styles need to be included for a font.

> Important: if you do not change the typeface, be sure to load the default
> `'Roboto'` font. For example, from
> [fonts.google.com](https://fonts.google.com/share?selection.family=Roboto:wght@400;500;700).

### Tokens

Typefaces can be set using
[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)<!-- {.external} -->.
Tokens follow the naming convention `--md-ref-typeface-<token>`.

Typeface | Token
-------- | -------------------------
Brand    | `--md-ref-typeface-brand`
Plain    | `--md-ref-typeface-plain`

*   [All tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-ref-typeface.scss)
    <!-- {.external} -->

```css
@import url('https://fonts.googleapis.com/css2?family=Open%20Sans:wght@400;500;700&display=swap');

:root {
  --md-ref-typeface-brand: 'Open Sans';
  --md-ref-typeface-plain: system-ui;
}
```

## Typescale

<!-- go/md-sys-typescale -->

A
[typescale](https://m3.material.io/styles/typography/type-scale-tokens)<!-- {.external} -->
is a collection of font styles: `font-family`, `font-size`, `line-height`, and
`font-weight`.

### Classes

<!-- go/md-typescale -->

Typescales can be applied to an element using the classes from the typescale
stylesheet.

Class names follow the naming convention `.md-typescale-<scale>-<size>`.

```ts
import {styles as typescaleStyles} from '@material/web/typography/md-typescale-styles.js';

// `typescaleStyles.styleSheet` is a `CSSStyleSheet` that can be added to a
// document or shadow root's `adoptedStyleSheets` to use the `.md-typescale-*`
// classes.
document.adoptedStyleSheets.push(typescaleStyles.styleSheet);

// `typescaleStyles` can also be added to a `LitElement` component's styles.
class App extends LitElement {
  static styles = [typescaleStyles, css`...`];

  render() {
    return html`
      <h1 class="md-typescale-display-large">Large display</h1>
      <p class="md-typescale-body-medium">Body text</p>
    `;
  }
}
```

### Tokens

Typescales can be set using
[CSS custom properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)<!-- {.external} -->.
Each typescale has three sizes: `small`, `medium`, and `large`. Each size has
four properties: `font` (family), `size`, `line-height`, and `weight`.

Tokens follow the naming convention
`--md-sys-typescale-<scale>-<size>-<property>`.

Typescale | Tokens
--------- | ------------------------------------------------
Display   | `--md-sys-typescale-display-medium-font`
&nbsp;    | `--md-sys-typescale-display-medium-size`
&nbsp;    | `--md-sys-typescale-display-medium-line-height`
&nbsp;    | `--md-sys-typescale-display-medium-weight`
Headline  | `--md-sys-typescale-headline-medium-font`
&nbsp;    | `--md-sys-typescale-headline-medium-size`
&nbsp;    | `--md-sys-typescale-headline-medium-line-height`
&nbsp;    | `--md-sys-typescale-headline-medium-weight`
Title     | `--md-sys-typescale-title-medium-font`
&nbsp;    | `--md-sys-typescale-title-medium-size`
&nbsp;    | `--md-sys-typescale-title-medium-line-height`
&nbsp;    | `--md-sys-typescale-title-medium-weight`
Body      | `--md-sys-typescale-body-medium-font`
&nbsp;    | `--md-sys-typescale-body-medium-size`
&nbsp;    | `--md-sys-typescale-body-medium-line-height`
&nbsp;    | `--md-sys-typescale-body-medium-weight`
Label     | `--md-sys-typescale-label-medium-font`
&nbsp;    | `--md-sys-typescale-label-medium-size`
&nbsp;    | `--md-sys-typescale-label-medium-line-height`
&nbsp;    | `--md-sys-typescale-label-medium-weight`

*   [All tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-sys-typescale.scss)
    <!-- {.external} -->

```css
:root {
  --md-sys-typescale-body-medium-size: 1rem;
  --md-sys-typescale-body-medium-line-height: 1.5rem;
  /* ... */
}
```

> Tip: to change all font families across typescales, prefer setting
> `--md-ref-typeface-brand` and `--md-ref-typeface-plain`, which map to each
> typescale.
>
> Use `--md-sys-typescale-<scale>-font` to change the typeface that a font is
> mapped to. This is useful for custom typefaces.
>
> ```css
> :root {
>   --my-brand-font: 'Open Sans';
>   --my-headline-font: 'Montserrat';
>   --my-title-font: 'Montserrat';
>   --my-plain-font: system-ui;
>
>   --md-ref-typeface-brand: var(--my-brand-font);
>   --md-ref-typeface-plain: var(--my-plain-font);
>
>   --md-sys-typescale-headline-font: var(--my-headline-font);
>   --md-sys-typescale-title-font: var(--my-title-font);
> }
> ```

<!--#include file="../../googlers/theming-typography.md" -->
