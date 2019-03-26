# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/)
and this project adheres to [Semantic Versioning](http://semver.org/).

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