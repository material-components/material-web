# Material Web

> IMPORTANT: Material Web is a work in progress and subject to major changes
> until 1.0 release.

Material Web is Google’s UI toolkit for building beautiful, accessible web
applications. Material Web is implemented as a collection of
[web components](https://developer.mozilla.org/en-US/docs/Web/Web_Components).

The Material team is currently working on
[Material You](https://material.io/blog/announcing-material-you) (Material
Design 3) support for Material components.

Developers using this library should expect some big changes as we work to
improve our codebase and ease of use and implement the newest Material Design.

A few notable changes you should expect:

-   UX changes as we adopt the new designs (production users will definitely
    want to pin to an appropriate release, not mainline)
-   A single npm package (`@material/web`)
-   Simplification of tag name prefixes to `md-` (CSS custom properties will be
    `--md-`)
-   Components as top-level folders which contain all variants

Example: `top-app-bar` and `top-app-bar-fixed` will be placed in the same
folder: `top-app-bar` - Components with variant attributes will be split into
several variant components:

Example: `mwc-button` will be split into `md-text-button`, `md-filled-button`,
`md-tonal-button`, `md-outlined-button`, etc

> Note: Looking for Material 2? MWC components are now on the
> [`mwc` branch](https://github.com/material-components/material-web/tree/mwc).
