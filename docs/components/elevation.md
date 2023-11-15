# Elevation

<!--*
# Document freshness: For more information, see go/fresh-source.
freshness: { owner: 'lizmitchell' reviewed: '2023-11-10' }
tag: 'docType:reference'
*-->

<!-- go/md-elevation -->

<!-- [TOC] -->

[Elevation](https://m3.material.io/styles/elevation)<!-- {.external} --> is the relative
distance between two surfaces along the z-axis.

Material's elevation system is deliberately limited to just a handful of levels.
This creative constraint means you need to make thoughtful decisions about your
UI’s elevation story.

![Diagram showing the five elevation levels and their respective dp values](images/elevation/hero.png "Material uses six levels of elevation, each with a corresponding dp value. These values are named for their relative distance above the UI’s surface: 0, +1, +2, +3, +4, and +5. An element’s resting state can be on levels 0 to +3, while levels +4 and +5 are reserved for user-interacted states such as hover and dragged.")

*   [Design article](https://m3.material.io/styles/elevation) <!-- {.external} -->
*   [API Documentation](#api)
*   [Source code](https://github.com/material-components/material-web/tree/main/elevation)
    <!-- {.external} -->

## Usage

Elevation can be set from 0 to 5 using the `--md-elevation-level` CSS custom
property. The elevation will automatically fill the nearest `position: relative`
element's size and shape.

![A rounded square with a drop shadow beneath it.](images/elevation/usage.png "A surface with an elevation shadow.")

```html
<style>
  .surface {
    position: relative;
    border-radius: 16px;
    height: 64px;
    width: 64px;

    --md-elevation-level: 3;
  }
</style>
<div class="surface">
  <md-elevation></md-elevation>
  <!-- Content -->
</div>
```

### Animation

Shadows may be animated between levels by adding `transition-duration` and
`transition-easing-function` CSS properties.

![A rounded square with a drop shadow beneath it. After a moment, the square
lowers into the background and the shadow disappears, then
repeats.](images/elevation/usage-animation.gif "Animating between elevations.")

```html
<style>
  .surface {
    /* ... */
    transition-duration: 250ms;
    transition-timing-function: ease-in-out;

    --md-elevation-level: 3;
  }

  .surface:active {
    --md-elevation-level: 0;
  }
</style>
<div class="surface">
  <md-elevation></md-elevation>
  <!-- Content -->
</div>
```

## Accessibility

Elevation is a visual component and does not have accessibility concerns.

## Theming

Elevation supports [Material theming](../theming/README.md) and can be
customized in terms of color.

### Tokens

Token                         | Default value
----------------------------- | -----------------------
`--md-elevation-level`        | `0`
`--md-elevation-shadow-color` | `--md-sys-color-shadow`

*   [All tokens](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-elevation.scss)
    <!-- {.external} -->

### Example

![Image of an elevation surface with a different theme applied](images/elevation/theming.png "Elevation theming example.")

```html
<style>
  .surface {
    position: relative;
    border-radius: 16px;
    height: 64px;
    width: 64px;
  }

  :root {
    --md-elevation-level: 5;
    --md-sys-color-shadow: #006A6A;
  }
</style>
<div class="surface">
  <md-elevation></md-elevation>
  <!-- Content -->
</div>
```

<!-- auto-generated API docs start -->
<!-- auto-generated API docs end -->
