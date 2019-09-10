# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

## Unreleased


### Changed

- **BREAKING:** Added custom `.focus()` and `.blur()` functions to mwc-button
  that cause the button to ripple as when tab focusing.
- **BREAKING:** mwc-textfield's custom `.focus()` function will now call
  `.focus()` on the native internal input causing the caret to appear instead of
  just forcing focus styles to appear.
- **BREAKING:** mwc-textfield's custom `.blur()` function will now call
  `.blur()` on the native internal input instead of just forcing focus styles to
  disapprear.

### Fixed

- `<mwc-drawer>` can now be used with Rollup (via version bump to pick up
  [WICG/inert#135](https://github.com/WICG/inert/pull/135)).


## [0.8.0] - 2019-09-03

### Changed

- Published JavaScript files no longer include inlined TypeScript helpers such
  as `__decorate`. Instead, helpers are now imported from the
  [`tslib`](https://github.com/microsoft/tslib) module dependency. This reduces
  code size by allowing multiple components to share the same helpers, and
  eliminates *"this has been rewritten to undefined"* errors from Rollup.
  ([#439](https://github.com/material-components/material-components-web-components/pull/439))

- **BREAKING** Renamed component *`base`* modules:
  ([#440](https://github.com/material-components/material-components-web-components/pull/440)):
  - `icon-button-toggle-base.ts` → `mwc-icon-button-toggle-base.ts`
  - `icon-button-base.ts` → `mwc-icon-button-base.ts`
  - `top-app-bar-fixed-base.ts` → `mwc-top-app-bar-fixed-base.ts`

## [0.7.1] - 2019-08-27

### Added
- Added "module" field in all packages' `package.json` manifests
  ([#434](https://github.com/material-components/material-components-web-components/pull/434))

## [0.7.0] - 2019-08-27

### Added
- New components:
  - [`<mwc-textfield>`](https://github.com/material-components/material-components-web-components/tree/master/packages/textfield) ([#297](https://github.com/material-components/material-components-web-components/pull/297))
  - [`<mwc-textarea>`](https://github.com/material-components/material-components-web-components/tree/master/packages/textarea) ([#297](https://github.com/material-components/material-components-web-components/pull/297))
  - [`<mwc-icon-button-toggle>`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon-button-toggle) ([#370](https://github.com/material-components/material-components-web-components/pull/370))
  - [`<mwc-top-app-bar-fixed>`](https://github.com/material-components/material-components-web-components/tree/master/packages/top-app-bar-fixed) ([#379](https://github.com/material-components/material-components-web-components/pull/379))

- Added support for `<svg>` and `<img>` icons to `<mwc-icon-button>` and
  `<mwc-icon-button-toggle>`.
  ([#358](https://github.com/material-components/material-components-web-components/pull/358))

- Added `--mdc-snackbar-action-color` CSS custom property to `<mwc-snackbar>` to
  override the default action button color
  ([#354](https://github.com/material-components/material-components-web-components/pull/354)).

- Added a default slot to `<mwc-top-app-bar>` and `<mwc-top-app-bar-fixed>`
  which takes page content and automatically applies the correct `padding-top`
  ([#370](https://github.com/material-components/material-components-web-components/pull/370)).

- Added documentation for:
  - [`<mwc-button>`](https://github.com/material-components/material-components-web-components/tree/master/packages/button)
    ([#366](https://github.com/material-components/material-components-web-components/pull/366))
  - [`<mwc-fab>`](https://github.com/material-components/material-components-web-components/tree/master/packages/fab)
    ([#361](https://github.com/material-components/material-components-web-components/pull/361))
  - [`<mwc-icon-button>`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon-button)
    ([#370](https://github.com/material-components/material-components-web-components/pull/370))
  - [`<mwc-radio>`](https://github.com/material-components/material-components-web-components/tree/master/packages/radio)
    ([#377](https://github.com/material-components/material-components-web-components/pull/377))
  - [`<mwc-snackbar>`](https://github.com/material-components/material-components-web-components/tree/master/packages/snackbar)
    ([#355](https://github.com/material-components/material-components-web-components/pull/355))
  - [`<mwc-top-app-bar>`](https://github.com/material-components/material-components-web-components/tree/master/packages/top-app-bar)
    ([#379](https://github.com/material-components/material-components-web-components/pull/379))

### Changed
- **BREAKING** The Material Icons font is no longer loaded automatically
  ([#314](https://github.com/material-components/material-components-web-components/pull/314)).
  This allows more control over how fonts are loaded (e.g. serving fonts from a
  different server, or loading multiple fonts with a single request). Most users
  should now add a tag like this to their HTML page:

  ```html
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500|Material+Icons" rel="stylesheet">
  ```

- **BREAKING** The *toggling* behavior of `<mwc-icon-button>` has been removed
  (i.e. `offIcon`), and is now instead supported by the dedicated
  [`<mwc-icon-button-toggle>`](https://github.com/material-components/material-components-web-components/tree/master/packages/icon-button-toggle)
  component
  ([#370](https://github.com/material-components/material-components-web-components/pull/370)).


- **BREAKING** The *short* layout for `<mwc-top-app-bar>` has been removed, and
  is no longer supported because it is not part of the Material Design
  specification
  ([#422](https://github.com/material-components/material-components-web-components/pull/422)).


- **BREAKING** The *fixed* layout for `<mwc-top-app-bar>` has been removed, and
  is now instead implemented by the dedicated `<mwc-top-app-bar-fixed>`
  component
  ([#379](https://github.com/material-components/material-components-web-components/pull/379)).

### Fixed

- Fixed bug where `<mwc-snackbar>` `open` method threw if called immediately
  after construction (before `firstUpdated`)
  ([#356](https://github.com/material-components/material-components-web-components/pull/356)).
- Fixed bug where setting the `<mwc-snackbar>` `labelText` property could throw
  an exception and fail to render
  ([#412](https://github.com/material-components/material-components-web-components/pull/412)).
- Buttons slotted into `<mwc-snackbar>` now render with the correct default
  styles
  ([#354](https://github.com/material-components/material-components-web-components/pull/354)).
- Fixed layout issue affecting scrolling `<mwc-tab-bar>` in Firefox
  ([#349](https://github.com/material-components/material-components-web-components/pull/349)).
- Fixed bug where `<mwc-icon>` icons did not render in IE11
  ([#353](https://github.com/material-components/material-components-web-components/pull/353)).
- Fixed bug where setting the `checked` property on an `<mwc-radio>` did not
  result in the other radios in the group becoming unchecked
  ([#373](https://github.com/material-components/material-components-web-components/pull/373)).
- Fixed bug where `<mwc-drawer>` did not work in IE
  ([WICG/inert#129](https://github.com/WICG/inert/pull/129)).
- Fixed `dense` and `prominent` styling bugs in `<mwc-top-app-bar>`
  ([#379](https://github.com/material-components/material-components-web-components/pull/379)).

## [0.6.0] - 2019-06-05
- Upgrade lerna to 3.x
- Upgrade typescript to 3.4, add config for tsbuildinfo files needed for incremental compilation mode
- Add README notes that component set is in experimental status.
- Remove draft components, simplify package listing.
- Prepare drawer, icon-button, linear-progress, slider, snackbar, tab components, and top-app-bar for release.
- Fix typing for event listeners in adapters due to typescript update.
- Add wicg-inert and blocking-elements dependencies to mwc-drawer

## [0.5.0] - 2019-03-26
- Update to mdc 1.0
- Rewrite Adapters and Foundations with Typescript types
- Disable pointer-events on disabled buttons

## [0.4.0] - 2019-03-11
- Update to mdc 0.44
- fix button label issues

## [0.3.6] - 2019-02-05
- Use `static get styles()` on all components
- Clean up dependencies
- Implement drawer focus trapping
- Add tests
- Setup travis CI
- Update to lit-html 1.0

## [0.3.5] - 2019-01-11
- Update lit and lit-element dependencies
- Publish mwc-drawer

## [0.3.4] - 2018-12-13
- Update to lit-element 0.6.5 and lit-html 1.0.0-rc.1

## [0.3.3] - 2018-12-03
- Fix ripple directive for lit-html 0.13

## [0.3.2] - 2018-11-16
- Move event listeners to the class with lit-element 0.6.2
- Add `@eventOptions({passive: true})` to event handlers in tab-bar-scroller
  - More efficient scrolling behavior, as `preventDefault` is never called
- Implement icon-button in typescript

## [0.3.1] - 2018-10-08
- Fix demo publishing
- Update to lit-element 0.6.2
- Add dependencies to lit-html where necessary
- Add explicit `.js` endings to imports, where necessary
- Fill in CHANGELOG

## [0.3.0] - 2018-10-04
- Rewrite elements in typescript
- Add `ripple` lit directive to add a material ripple to any component
- Add `@observe` decorator to tie data changes into base MDC Foundation handlers
- Add a watcher for styling and typescript changes

## [0.2.1] - 2018-09-21
- Update to lit-element 0.6.1

## [0.2.0] - 2018-09-13
- Use lit-element 0.6

## [0.1.2] - 2018-06-14
- Use lit-element 0.5

## [0.1.1] - 2018-05-09
- Add READMEs and examples

## [0.1.0] - 2018-05-08
- Initial WIP of components
