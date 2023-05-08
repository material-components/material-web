<!-- catalog-only-start --><!-- ---
name: Circular Progress
dirname: circularprogress
-----><!-- catalog-only-end -->

# Circular progress

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'lizmitchell' reviewed: '2023-05-02' }
tag: 'docType:reference'
*-->

<!-- go/md-circular-progress -->

<!-- [TOC] -->

[Progress indicators](https://m3.material.io/components/progress-indicators)<!-- {.external} -->
inform users about the status of ongoing processes, such as loading an app or
submitting a form.

There are two types of progress indicators: Linear and circular.

Circular progress indicators display progress by animating along an invisible
circular track in a clockwise direction.

![An animated image of an indeterminate circular progress indicator.](images/circularprogress/hero.gif "Circular progress indicators are composed of an invisible track and an indicator")

*   [Design article](https://m3.material.io/components/progress-indicators)
    <!-- {.external} -->
*   API Documentation (*coming soon*)
*   [Source code](https://github.com/material-components/material-web/tree/main/circularprogress)
    <!-- {.external} -->

## Usage

Circular progress indicators may be determinate to show progress, or
indeterminate for an unspecified amount of progress.

![Two circular progress indicators, one with three quarters of the track full
and the other
indeterminate.](images/circularprogress/usage.gif "Determinate and indeterminate circular progress indicators.")

```html
<md-circular-progress progress="0.75"></md-circular-progress>

<md-circular-progress indeterminate></md-circular-progress>
```

### Four colors

Indeterminate circular progress indicators may cycle between four colors
(primary, primary container, tertiary, and tertiary container by default).

![An indeterminate circular progress indicator that cycles between four colors.](images/circularprogress/usage-four-color.gif "A four-color indeterminate circular progress indicator")

```html
<md-circular-progress four-color indeterminate></md-circular-progress>
```

## Accessibility

Add an
[`aria-label`](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)<!-- {.external} -->
attribute to progress indicators to give them a descriptive name.

```html
<md-circular-progress progress="0.5" aria-label="Page refresh progress"></md-circular-progress>
```

## Theming

Circular progress supports [Material theming](../theming.md) and can be
customized in terms of color.

### Tokens

Token                                           | Default value
----------------------------------------------- | ------------------------
`--md-circular-progress-color`                  | `--md-sys-color-primary`
`--md-circular-progress-size`                   | `48px`
`--md-circular-progress-active-indicator-width` | `8.3333` (%)

> Note: the active indicator width must be specified as a unit-less percentage
> of the size.

*   [All tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-circular-progress-indicator.scss)
    <!-- {.external} -->

### Example

![Image of a circular progress indicator with a different theme applied](images/circularprogress/theming.png "Circular progress indicator theming example.")

```html
<style>
:root {
  --md-circular-progress-size: 32px;
  --md-circular-progress-active-indicator-width: 20;
  --md-sys-color-primary: #006A6A;
}
</style>

<md-circular-progress progress="0.5"></md-circular-progress>
```
