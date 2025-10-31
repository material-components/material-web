# Changelog

## [2.4.2](https://github.com/material-components/material-web/compare/v2.4.1...v2.4.2) (2025-10-31)


### Bug Fixes

* **field:** prevent NaN transforms when element is hidden ([590ae99](https://github.com/material-components/material-web/commit/590ae99ff77c5296258b322dd98351c7e2be20f5))

## [2.4.1](https://github.com/material-components/material-web/compare/v2.4.0...v2.4.1) (2025-10-27)


### Bug Fixes

* **radio:** also move sibling uncheck logic after root assignment ([6010e52](https://github.com/material-components/material-web/commit/6010e52c8fcd53577a8cf2cee53095033f329d2a))
* **radio:** move root assignment to mirror hostDisconnected ([adb8d10](https://github.com/material-components/material-web/commit/adb8d104f2ebc29890b8c578e34a412e8c5c3fc2))
* **tokens:** `@material/web/tokens/v*` moved to `@material/web/tokens/versions/v*` ([60c0cfa](https://github.com/material-components/material-web/commit/60c0cfa58ad135c189cb0fa95c5f2744499f0327))

## [2.4.0](https://github.com/material-components/material-web/compare/v2.3.0...v2.4.0) (2025-08-21)


### Features

* **button:** add disabled link support ([c3c4848](https://github.com/material-components/material-web/commit/c3c48485b152595c0e892383dc5ab38fdb1ac442))
* **button:** add gradient support to container colors ([5bc1506](https://github.com/material-components/material-web/commit/5bc15069d136c51e912137dcba1b212a106bb1dd))
* **catalog:** hide body if dsd-pending ([bf89645](https://github.com/material-components/material-web/commit/bf896458b0a656a40187d3fdddbc573407a4e55b))
* **select:** add showPicker() functionality ([8808a25](https://github.com/material-components/material-web/commit/8808a25da8cb879d120c11b6961e10ef75ca5add))


### Bug Fixes

* **catalog:** hydrate CSR component pages ([0037c14](https://github.com/material-components/material-web/commit/0037c14f6ba17ae224f8377e4afcba35862c4bf4))
* **menu:** output menu item theme values ([ca5f750](https://github.com/material-components/material-web/commit/ca5f75094b3ac2d314ccb31ec06ec653501cf801))
* **radio:** stack overflow error when rendering many radios ([688ab3c](https://github.com/material-components/material-web/commit/688ab3cf5f12ddbff07407910b8e8e158b3282d7))
* **ripple:** misaligned when using CSS zoom ([3072a9b](https://github.com/material-components/material-web/commit/3072a9bc286876be157e15d65b0d4877245e1acc))
* **ripple:** remove pointerdown contextmenu bounds check for Chrome ([cd7512f](https://github.com/material-components/material-web/commit/cd7512ff90cf25ad98c6caa9842bf86d284146c7))

## [2.3.0](https://github.com/material-components/material-web/compare/v2.2.0...v2.3.0) (2025-03-26)


### Features

* **button:** add download filename support for link buttons ([4098832](https://github.com/material-components/material-web/commit/4098832b8b6fe9def9c08d551014f113e39b2546))
* **button:** rename attribute downloadFilename to download ([8aefe19](https://github.com/material-components/material-web/commit/8aefe1983d28abcc3bc9c659ff0b328454e0547e))
* **chip:** add download attribute to assist chip ([902a84f](https://github.com/material-components/material-web/commit/902a84fe0cc389c1d691e42ce1c95d9156a4781b))
* **icon-button:** add download attribute ([9e84130](https://github.com/material-components/material-web/commit/9e8413080d911108fd1fb97fe8909b96926e1a24))
* **menu:** add menu padding tokens ([767d1f1](https://github.com/material-components/material-web/commit/767d1f159e9ebcd001968bb7e8bcdf6c4ef1e537))
* **text-field:** add showPicker method ([bad490c](https://github.com/material-components/material-web/commit/bad490c7cb05be4898d8528569776d4e75bbb8fd))


### Bug Fixes

* **catalog:** add hyphen to md-evelated-button attribute ([ac9b14a](https://github.com/material-components/material-web/commit/ac9b14a65c384d9389022f11555fb063b932ec96))
* **iconbutton:** href will respond to touch target ([ea1134a](https://github.com/material-components/material-web/commit/ea1134a1a77c032f8b8c6c749e670fca90d8cd89))
* **labs:** add mixinCustomStateSet() for :state() compatibility ([045fe94](https://github.com/material-components/material-web/commit/045fe94872607f67da6c18d3689bff6a541102d2))
* **listitem:** click() from listItemRoot ([1c60e56](https://github.com/material-components/material-web/commit/1c60e56c6c1210fd5a116290271b9bc7e612fdf7))
* **menu:** export CloseReason ([29d6763](https://github.com/material-components/material-web/commit/29d6763dc3abe4e80a6fb3ad0eaca5bb24b2d29a))
* **select:** missing accessible label ([1bdcbd3](https://github.com/material-components/material-web/commit/1bdcbd38ab96f6a7537c36cb7d61d9e8db2144e7))

## [2.2.0](https://github.com/material-components/material-web/compare/v2.1.0...v2.2.0) (2024-09-17)


### Features

* **field,textfield:** add `container` slot for custom background content ([44c13cd](https://github.com/material-components/material-web/commit/44c13cdd753108137e9765bf14a6ea3ed46be18e))


### Bug Fixes

* **checkbox:** add override to symbol properties ([a9ee4f5](https://github.com/material-components/material-web/commit/a9ee4f5bc1d6702e5dc352eefed13a1d849577e3))
* remove the input entirely and replace it with a touch target ([cf84a27](https://github.com/material-components/material-web/commit/cf84a271e75b806075427f4d176b38f8884fdd7e))
* remove unnecessary css variable prefixes ([5044e6e](https://github.com/material-components/material-web/commit/5044e6eb2fe6c6bd3e53b19bef04ba6b6c0b2a2b))
* Replace aria-hidden attribute with inert attribute in &lt;md-radio&gt; component ([192f17e](https://github.com/material-components/material-web/commit/192f17e8c1ce4a38cf76b5a81cb6c2b1ddcfbe46))
* Set touch target to `display: none` ([a696121](https://github.com/material-components/material-web/commit/a69612162d79b63f0b82da0468201942dc82ed9e))

## [2.1.0](https://github.com/material-components/material-web/compare/v2.0.0...v2.1.0) (2024-08-20)


### Features

* **switch:** add touch target token ([b8f362a](https://github.com/material-components/material-web/commit/b8f362a97d8369e0f6bab834794f99bd50b5ab78))
* **textfield,field:** add leading/trailing icon spacing tokens ([c1991c4](https://github.com/material-components/material-web/commit/c1991c4c894c48fe77abe09a2791f97dc77d438f))


### Bug Fixes

* changed checkmark to check in md-icon selected slot ([2e2817b](https://github.com/material-components/material-web/commit/2e2817bab5fc51bb32363b36471cb01d1f029a46))

## [2.0.0](https://github.com/material-components/material-web/compare/v1.5.1...v2.0.0) (2024-07-23)


### ⚠ BREAKING CHANGES

* **tokens:** Sass component tokens, such as `tokens.md-comp-checkbox-values()`, return `var(--md-<component>, <value>)` instead of just the CSS value. Use `$exclude-custom-properties: true` to remove them.
* `querySelector` for `[role]` and `[aria-*]` attributes may no longer work. See `@material/web/migrations/v2/README.md` and `@material/web/migrations/v2/query-selector-aria.ts`.

### Features

* **button:** add `soft-disabled` attribute for focusable disabled buttons ([48124ba](https://github.com/material-components/material-web/commit/48124ba09f538c6264407a49e6bc0ba097991a9d))
* check for server before creating treewalker from document ([0d50ed9](https://github.com/material-components/material-web/commit/0d50ed91f0c542b4d5b5e2c913930a52a46136e5))
* **chips:** add label slot ([7ec70c4](https://github.com/material-components/material-web/commit/7ec70c4c2d8863fa1e1d38724d77a9b6d4e6a20c))
* **chips:** add new `soft-disabled` attribute for focusable disabled chips ([750b886](https://github.com/material-components/material-web/commit/750b886acfa15960d66f83a08599d2a2155ae659))
* **iconbutton:** add `soft-disabled` attribute for focusable disabled icon buttons ([281c092](https://github.com/material-components/material-web/commit/281c092d061f77b812e57f473e77cfd123016471))


### Bug Fixes

* add typecast ([1482bff](https://github.com/material-components/material-web/commit/1482bfff0de55e136513861c1976776c5a4b4b93))
* aria-labels announcing twice with "group" on components ([5df9410](https://github.com/material-components/material-web/commit/5df9410e604cf446c83bb5ada3454596c34b2c50))
* **chips:** add truncation support ([713f0a8](https://github.com/material-components/material-web/commit/713f0a80fcfc9ef730e1c1f88e15098b9d10735b))
* **tokens:** `tokens.md-comp-*-values()` include custom properties by default ([55b4650](https://github.com/material-components/material-web/commit/55b46500634c022c335d9c4818121a1b5d95e111))

## [1.5.1](https://github.com/material-components/material-web/compare/v1.5.0...v1.5.1) (2024-06-25)


### Bug Fixes

* **checkbox:** sass theme mixin not working ([46d66ed](https://github.com/material-components/material-web/commit/46d66ed9d188243e313e6833f244a5b750aa9fdb)), closes [#5651](https://github.com/material-components/material-web/issues/5651)
* **dialog:** have content expand to fill height ([17aa21a](https://github.com/material-components/material-web/commit/17aa21a53ecc949b3326ed0d2c2bf461a20617c6))
* **menu:** resolve aborted animations as false rather than reject ([4f7ff4f](https://github.com/material-components/material-web/commit/4f7ff4f63adaec11cfc7e2772990a757139be01b)), closes [#5638](https://github.com/material-components/material-web/issues/5638)
* **switch:** pressing enter toggles the switch ([99ec9e2](https://github.com/material-components/material-web/commit/99ec9e25eb0d64887a3530e494ba8683909c0e62))

## [1.5.0](https://github.com/material-components/material-web/compare/v1.4.1...v1.5.0) (2024-05-23)


### Features

* **menu:** allow customizing `scrollbar-width` ([1bf8b5f](https://github.com/material-components/material-web/commit/1bf8b5fbf9ff8f7c0084acee77988b1af9ad7e19))
* **select:** make required asterisk optional ([8f194a5](https://github.com/material-components/material-web/commit/8f194a51dbc85ead2d9d8c10e0be69f183788a31))
* **textfield:** make required asterisk optional ([be5bb43](https://github.com/material-components/material-web/commit/be5bb43100fbf0df3a7cfec4c4d4399559a23114))


### Bug Fixes

* **button:** add part attribute to button ([a2b5c91](https://github.com/material-components/material-web/commit/a2b5c91a549e206603f23d84233de83a8c165d77))
* **dialog:** focus is trapped for a11y, use `no-focus-trap` to disable ([0aea436](https://github.com/material-components/material-web/commit/0aea4364a142f3db84b77ae99eea1df6a3cd8456))
* **docs:** progress.webp not playing ([2f0c99a](https://github.com/material-components/material-web/commit/2f0c99ad3d3320341a4ae61db5abe64c37649ddb)), closes [#5569](https://github.com/material-components/material-web/issues/5569)
* **menu:** `getBoundingClientRect()` and `getClientRects()` not working ([e1f9cbc](https://github.com/material-components/material-web/commit/e1f9cbc59e4cbb50921304158edbb8e68706c405))

## [1.4.1](https://github.com/material-components/material-web/compare/v1.4.0...v1.4.1) (2024-04-15)


### Bug Fixes

* **dialog:** update info comment with autocomplete -&gt; autofocus ([fc4c999](https://github.com/material-components/material-web/commit/fc4c9992f8827e2a07e5c0b32cc48a065356cf29))
* **select:** select.click() opens the menu ([7a6cf16](https://github.com/material-components/material-web/commit/7a6cf16a4e37889d0497af4f1c4df8be78aefa54))

## [1.4.0](https://github.com/material-components/material-web/compare/v1.3.0...v1.4.0) (2024-03-21)


### Features

* **menu:** add `no-navigation-wrap` to fix select accessibility ([c6ffd70](https://github.com/material-components/material-web/commit/c6ffd70fc82060d894e4f4ef7fc43a1fb15e2a65))
* **typography:** add `@material/web/typography/md-typescale` classes ([36dd77e](https://github.com/material-components/material-web/commit/36dd77ef97bfa9fbbd9f3a8885f010cb0741e797))


### Bug Fixes

* **button,fab,chips,labs:** text-transform inherits through shadow root ([758e615](https://github.com/material-components/material-web/commit/758e61581ef30481e5dd8c1bd7707db2a2988ab8))
* **elevation:** expose md-elevation `::part` in all components ([b74e3dd](https://github.com/material-components/material-web/commit/b74e3dd2e3f11fa20dd5a39148a6b491bacded16))
* **elevation:** limit elevation transition to box-shadow and opacity ([34c0a67](https://github.com/material-components/material-web/commit/34c0a6779e8a722ec6dfbf6ad5c0d1bb607289e6))
* publish `.css` files for `[@import](https://github.com/import)`-ing ([cde649c](https://github.com/material-components/material-web/commit/cde649c83b5236bc441607cda797bdd8caf7e6ad))
* rename internal `&lt;styles&gt;.css.js` to `<styles>.css` ([c35bad0](https://github.com/material-components/material-web/commit/c35bad0c643a7c3ee982739868ee3676372e23ad))
* **switch:** reflect `selected` state in input event ([8d201e0](https://github.com/material-components/material-web/commit/8d201e0d5dfb5c26aa6b4e58e526db1b1ef6c404))
* **tabs:** default `scroll-behavior: smooth` not working ([274ce3e](https://github.com/material-components/material-web/commit/274ce3e4e06867acfab642123192e0a7aa9b45d4)), closes [#5497](https://github.com/material-components/material-web/issues/5497)
* **textfield:** no longer inherits `text-align` from parents ([668f0ee](https://github.com/material-components/material-web/commit/668f0ee5e96ed0b697596d7fa7d0b4748924162b)), closes [#5509](https://github.com/material-components/material-web/issues/5509)
* **typography:** rename md-typescale.js to md-typescale-styles.js ([1e47fd7](https://github.com/material-components/material-web/commit/1e47fd7383ea2818beab64e7f9f4339cc790a5ee))
* use explicit `CSSResult[]` types for static styles ([ce41b7b](https://github.com/material-components/material-web/commit/ce41b7bfb3fc04f8e93a781eb6d92fe15b1d7fac))

## [1.3.0](https://github.com/material-components/material-web/compare/v1.2.0...v1.3.0) (2024-02-22)


### Features

* add `--md-sys-shape-*` tokens for all components ([41bac9e](https://github.com/material-components/material-web/commit/41bac9e44d0afef2a9cba08cb855572556e61342))
* **tabs:** expose activeTabIndex ([4bce86d](https://github.com/material-components/material-web/commit/4bce86d18b8d553607b8d2ee909faff0c095096b)), closes [#5297](https://github.com/material-components/material-web/issues/5297)
* **tokens:** add component custom properties to Sass values ([feff721](https://github.com/material-components/material-web/commit/feff7214a753559bc5ed5da5ed50ad508b4417e7))


### Bug Fixes

* **icon:** fix uncentered icons when using WCAG text spacing overrides ([b23e321](https://github.com/material-components/material-web/commit/b23e3218eebc293dc99a7343a6ecddebe585e89e))
* **labs:** hasConstructed and constructor deprecated, changing tabIndex update in connectedCallback ([fb086bb](https://github.com/material-components/material-web/commit/fb086bbd355d69a99dc9e6c38c2b8ebb7d7ce9ad))
* **labs:** removing hasConstructed and setting privateIsConstructed to handle setting tabIndex ([ea518d0](https://github.com/material-components/material-web/commit/ea518d0353facd94037843aca7e623b91a16363c))
* **labs:** update tabIndex once the element is connected to the DOM ([a6b8c09](https://github.com/material-components/material-web/commit/a6b8c090262ef173eb9d88161ba5051c31e2f930))
* **menu:** left arrow in submenu closes submenu in closure ([2049323](https://github.com/material-components/material-web/commit/2049323dde3eec643f14a03f12f0b449e4432aeb))
* remove `:host-context` rtl selectors ([f2ff867](https://github.com/material-components/material-web/commit/f2ff86725ccb96347af1881657428e4de1fe0bae))

## [1.2.0](https://github.com/material-components/material-web/compare/v1.1.1...v1.2.0) (2024-01-24)


### Features

* **select:** add keyboard support for arrow end and home ([8912019](https://github.com/material-components/material-web/commit/8912019b902803a018a1d92fb7caaa39369f6cf6))
* **select:** add menuAlign to allow end-aligning the select menu ([50a9ffa](https://github.com/material-components/material-web/commit/50a9ffae46499ec575a38887b5dcce8f5506e576))
* **select:** support width fit-content ([4bb9418](https://github.com/material-components/material-web/commit/4bb9418a52564984e32666c9383d8eb262e876cf))
* **textfield:** add `no-spinner` to remove number spin buttons ([3c6e550](https://github.com/material-components/material-web/commit/3c6e55006b3a7bad0d7fa782fab3141e1961e686))


### Bug Fixes

* **button:** add missing sass imports ([37fad06](https://github.com/material-components/material-web/commit/37fad0660dd96cf565062075e056a6288fea5290))
* **chips:** filter's `click.preventDefault()` not working when also updating `selected` ([5dc870b](https://github.com/material-components/material-web/commit/5dc870bfe1609a50702ef078a3da1b01620f7ef8))
* **dialog:** buttons not reflecting value attribute when setting property ([35913a6](https://github.com/material-components/material-web/commit/35913a6ea42776f2c402d879067ae772833e52b5)), closes [#5409](https://github.com/material-components/material-web/issues/5409)
* **dialog:** immediate escape key not firing cancel event in Chrome 120 ([be3dc6f](https://github.com/material-components/material-web/commit/be3dc6f6776f86a95619de0d708e2815e744ac6d)), closes [#5313](https://github.com/material-components/material-web/issues/5313)
* **dialog:** text is now selectable ([4ae9db6](https://github.com/material-components/material-web/commit/4ae9db6c67e3704a7be8bd83dfa18dbd50b7fc94))
* forms correctly focus the first invalid control instead of last ([7dd7a68](https://github.com/material-components/material-web/commit/7dd7a68ae9229d5685fe4ab85a6d8514624245d8))
* **labs:** add card support for high contrast mode ([53ec44b](https://github.com/material-components/material-web/commit/53ec44b4b81cbf691a0455efb6d9907957ef1205))
* **labs:** card content not clickable with outline fix ([9c5cff8](https://github.com/material-components/material-web/commit/9c5cff8f90198860149e6237798e73f2c846a36b)), closes [#5312](https://github.com/material-components/material-web/issues/5312)
* **menu:** `--md-menu-item-container-color` not working ([86bd6f8](https://github.com/material-components/material-web/commit/86bd6f830913330e41033c5eceab938fa4f42bc2))
* **progress:** prevent unnecessary animation to run when not visible ([4de5e74](https://github.com/material-components/material-web/commit/4de5e74b5caec5cff0fdb4696cb64790d471170c))
* rename and move `internal/controller/events` ([eca1357](https://github.com/material-components/material-web/commit/eca1357f1a7d185d4ec8a368f6467f481f9b2798))
* **ripple:** multiple touches causing ripples to start from center ([cef1b74](https://github.com/material-components/material-web/commit/cef1b740ee0a72488a9a9c4f197e2398d4027f1e)), closes [#5349](https://github.com/material-components/material-web/issues/5349)
* **select:** allow aria-expanded to be set to false ([73725be](https://github.com/material-components/material-web/commit/73725be67053f3a5ba4aa25f8b12a82afc4cad71)), closes [#5360](https://github.com/material-components/material-web/issues/5360)
* **select:** clicking select toggles the menu rather than just open ([043bbad](https://github.com/material-components/material-web/commit/043bbad6f30293c053c1fc1689cbf0d1e90c0d75))
* **select:** ensure md-select selection logic uses fresh DOM references ([8942715](https://github.com/material-components/material-web/commit/89427158b7a15265556db2f86423a9905760c696))
* **select:** expose SelectOption interface ([edb3559](https://github.com/material-components/material-web/commit/edb3559a1ce12d13921d93761bedbfde4c1c7898))
* **slider:** move ripple and focus ring beneath handle ([68b078b](https://github.com/material-components/material-web/commit/68b078b4e1f7357a15098bb59ae22ae8a4d02cbf))
* **slider:** nested dir attributes do not break on chrome 120+ ([57168f6](https://github.com/material-components/material-web/commit/57168f6a95403cd5a29e2774e42525efeb1e3eae))
* **tabs:** `--md-elevation-level` no longer leaks into tabs ([ddf1fb0](https://github.com/material-components/material-web/commit/ddf1fb0c613e43d26735832b9fdb1efcf2969949)), closes [#5137](https://github.com/material-components/material-web/issues/5137)
* **tabs:** `tabs.scrollToTab()` not working ([eb7c17e](https://github.com/material-components/material-web/commit/eb7c17e3dc6b14d900f4ce9d13d93ce0c09b9806))
* **textfield:** counter showing when max length is 0 or removed ([9973b90](https://github.com/material-components/material-web/commit/9973b90981b2414cc18dfb91279f204b7f50c080))
* **textfield:** error styles not removing when an unrelated control is invalid ([3151fd8](https://github.com/material-components/material-web/commit/3151fd8d904f0ac529f3a4f872a9dac537a65dc0))
* **textfield:** focus style lost after `reportValidity()` during change ([6efc904](https://github.com/material-components/material-web/commit/6efc90403b17684f77d1da577453fa66cfcb1c30))
* **textfield:** remove Firefox high contrast mode background on linux ([926edfb](https://github.com/material-components/material-web/commit/926edfb367de71eed77deaba45a4a7eaa79342fc))
* **tokens:** moved '_values.scss' to 'internal/_values.scss' ([b986b1e](https://github.com/material-components/material-web/commit/b986b1eb7cac5a5feef90478406247cebe7e690e))


### Performance Improvements

* **ripple:** don't process events in high contrast mode ([839667d](https://github.com/material-components/material-web/commit/839667dcf6becda087015edcb5468b8b2107d8c7))

## [1.1.1](https://github.com/material-components/material-web/compare/v1.1.0...v1.1.1) (2023-12-13)


### Bug Fixes

* formAssociated disabled attribute not working ([ab04299](https://github.com/material-components/material-web/commit/ab042992acd6702f11fd8f1d64bb1597cb701815))

## [1.1.0](https://github.com/material-components/material-web/compare/v1.0.1...v1.1.0) (2023-12-12)


### Features

* **chips:** add filter chip `selected-icon` slot to customize checkmark ([89b4c2e](https://github.com/material-components/material-web/commit/89b4c2e752fd7055f35f8b743cad6861376f3d95))
* **chips:** add tokens to customize padding ([c9e8de0](https://github.com/material-components/material-web/commit/c9e8de0207f158791d79629599682edf21d26498))
* **chip:** trailing remove icon can now be customized ([b44b90c](https://github.com/material-components/material-web/commit/b44b90c82643be1d0ae9c24d2450081db13dc04d))
* **chip:** trailing remove icon can now be customized ([49a6be1](https://github.com/material-components/material-web/commit/49a6be141b1f4a28c27b0982e0123ede7825a19d))
* **chip:** trailing remove icon can now be customized ([76883cd](https://github.com/material-components/material-web/commit/76883cd420a058dfa9c71c887605e890233ff53b))
* **menu,select:** allow menu and select typeahead to read default slot text content ([af49b64](https://github.com/material-components/material-web/commit/af49b64ab4e66872ff25d6ad767f9d37fce231b6))
* **menu:** add document-level positioning ([2b591ca](https://github.com/material-components/material-web/commit/2b591ca759ec8180659476a072db1a8b83c1ae20)), closes [#5120](https://github.com/material-components/material-web/issues/5120)
* **menu:** add popover functionality ([7859b39](https://github.com/material-components/material-web/commit/7859b39afef3de779225dfdb87470daf1f91fc27)), closes [#2023](https://github.com/material-components/material-web/issues/2023) [#5120](https://github.com/material-components/material-web/issues/5120)
* **radio:** add required constraint validation ([b5686ea](https://github.com/material-components/material-web/commit/b5686ea4e0ad17717ef086bcdf7dfdeb565acc9b)), closes [#4316](https://github.com/material-components/material-web/issues/4316)
* **select:** match menu width to select and introduce clamp-menu-width ([a5a40b6](https://github.com/material-components/material-web/commit/a5a40b6dd35a36e1d3f9a512d68369f3d639922d))
* **switch:** add slot icons ([9255be1](https://github.com/material-components/material-web/commit/9255be1be587cdbb29d6cd99efefc512de4882db))


### Bug Fixes

* 5182: dialog icon padding error ([257e9c6](https://github.com/material-components/material-web/commit/257e9c6f6f47bb61155fd21729bbd8326a7156e2))
* add `@material/web@nightly` publishes ([91c1221](https://github.com/material-components/material-web/commit/91c1221cef63b82e134949c7ff14b99653897602))
* **behaviors:** add focusable behavior to labs ([d1ef1fe](https://github.com/material-components/material-web/commit/d1ef1febb648b7afd521e05123024f9e4c71bca0))
* **behaviors:** validation not reporting when form tries to submit ([c53a419](https://github.com/material-components/material-web/commit/c53a4194e9796b5bd862ac166e66f0c16d4d8bcd))
* **button:** allow overriding `cursor` using CSS ([798f5ae](https://github.com/material-components/material-web/commit/798f5ae179c63d22a83ad4a7bcf8bb085541f6a1))
* **button:** allow overriding `min-width` and `user-select` ([1852238](https://github.com/material-components/material-web/commit/18522381d8038beeb28948bf993a679cc8feb02a))
* **button:** allow overriding `padding` and `gap` ([5bb4a42](https://github.com/material-components/material-web/commit/5bb4a422de35e953a35c032a66949cacea1e0496))
* **button:** don't show overflowing labels ([8dcb3f6](https://github.com/material-components/material-web/commit/8dcb3f62c7ccce09290211350e418c0089265305))
* **button:** height increases when label wraps ([7cd657b](https://github.com/material-components/material-web/commit/7cd657b83dcb80107d8d4e3601491b259476742b))
* **button:** labels not truncating, add support for multiline with `text-wrap: wrap` ([5d964ad](https://github.com/material-components/material-web/commit/5d964adcf9df7cfc4cc0b6108e378e6bc6b330fd))
* **button:** sometimes submits form even when click listener prevents default ([9e3f080](https://github.com/material-components/material-web/commit/9e3f0801aab349504f88e9aa221d0fcb5baa248b)), closes [#5032](https://github.com/material-components/material-web/issues/5032)
* **checkbox:** `checked` and `indeterminate` not updated during input event ([e78a52f](https://github.com/material-components/material-web/commit/e78a52f1e4f427cf328ab1e2373a7ba9ed1d4d8f))
* **chip:** disabled attribute prevents click event. ([2dba006](https://github.com/material-components/material-web/commit/2dba006ddd49f71f362bfb7b3c1547a4f9ced8c2))
* **chip:** disabled attribute prevents click event. ([d501ddd](https://github.com/material-components/material-web/commit/d501dddfd541a72ef50aff667cd06644801b1e90))
* **chip:** make tap highlight transparent ([c3bfbaa](https://github.com/material-components/material-web/commit/c3bfbaaf4c055fc3bc68f6f28b229ac2aa8fe5bc))
* Circular progress isn't circular in flex column display ([075119c](https://github.com/material-components/material-web/commit/075119c98fd71d3f4ec1b8c3e513e2c750e4550f))
* **docs:** prepare docs generator for mixin version of lit analyzer ([5e0000a](https://github.com/material-components/material-web/commit/5e0000a495ae6dc836a2e7cedf9778830e326ad0))
* **fab:** make tap highlight transparent ([4e8053d](https://github.com/material-components/material-web/commit/4e8053d15d8d06ed152844a1517a3f2313e37651))
* **filter-chip:** reflect correct value on click event ([0b4d4c2](https://github.com/material-components/material-web/commit/0b4d4c2e07b4f6be2289733500fbba36de29a2d3))
* **list-item:** hide headline overflow and fix width. ([4697407](https://github.com/material-components/material-web/commit/4697407cff0c8032c3a292aad24338df0927f865))
* **list-item:** make tap highlight transparent ([cca0789](https://github.com/material-components/material-web/commit/cca0789826af0dae789f143d243c359aa23dd1ad))
* **menu:** declare popover API types ([bf8d3f6](https://github.com/material-components/material-web/commit/bf8d3f6289c76bc708e5b487231939d02bfab3c4))
* **menu:** declare popover property type on HTMLElement ([3d8c7ac](https://github.com/material-components/material-web/commit/3d8c7ac7f3780158f885f7ca647b658071c81556))
* **menu:** escape not closing menus with submenus ([bd88880](https://github.com/material-components/material-web/commit/bd88880f78e54e88cb5083a74134ac4e130f3228))
* **menu:** shift tab into anchor closes menu ([c4cbd36](https://github.com/material-components/material-web/commit/c4cbd3612c08a6143eb104db07eb90a1171fb23c))
* **progress:** allow linear progress to fill flex containers ([a450e42](https://github.com/material-components/material-web/commit/a450e4288cdac6f61a13790f8820d57a7fb141a7)), closes [#5042](https://github.com/material-components/material-web/issues/5042)
* **segmented-button:** make tap highlight transparent ([e4728bd](https://github.com/material-components/material-web/commit/e4728bd018e5640fb03fc49169805a51aabf0a5c))
* **select,textfield:** native form validation shows error state ([6b5ab21](https://github.com/material-components/material-web/commit/6b5ab21332438dc971eb94b7da2271511bb99719))
* **select:** focus() delegates properly, focus on reporting validity ([897d977](https://github.com/material-components/material-web/commit/897d9775c2143dd3b8d07deab35dfe90decd1336))
* **select:** form failure no longer throws non-focusable error ([a5a6974](https://github.com/material-components/material-web/commit/a5a6974decb19b5ce42020c3c7c5386a8b203d76)), closes [#5078](https://github.com/material-components/material-web/issues/5078)
* **select:** select menu render is over most stacking contexts with popover ([a2b3204](https://github.com/material-components/material-web/commit/a2b32042bd51c34853a9ca7b1c7901fb69270a44))
* **tabs:** allow changing tab padding ([dd005df](https://github.com/material-components/material-web/commit/dd005df7806002a60fe9af136387ad4623b4ae8e))
* **tabs:** fields intended to be accessed from templates must be exported ([b7be1cb](https://github.com/material-components/material-web/commit/b7be1cbbb4e7b08421d293ba89f364632822d113))
* **text-field:** wrap text in textarea ([4fce487](https://github.com/material-components/material-web/commit/4fce487c812954da816c0bdb4ba5165902c2f3e9))

## [1.0.1](https://github.com/material-components/material-web/compare/v1.0.0...v1.0.1) (2023-10-18)


### Bug Fixes

* **catalog:** align one liners to center ([fbc1fa6](https://github.com/material-components/material-web/commit/fbc1fa626a92299c627004efa9d41151b44febb0))
* **catalog:** center items in blockquotes ([5235b3e](https://github.com/material-components/material-web/commit/5235b3ea52b7aa5a27c2b00a49712a3ce0e22378))
* **checkbox:** cursor should be pointer when not disabled ([18fe451](https://github.com/material-components/material-web/commit/18fe45170a66588e84ecaac9ef2be0f96bec5d8d)), closes [#5079](https://github.com/material-components/material-web/issues/5079)
* **fab:** cursor should be pointer ([5280c6e](https://github.com/material-components/material-web/commit/5280c6ec27ee54f82df4f4a25f0a1343961c168b)), closes [#5017](https://github.com/material-components/material-web/issues/5017)
* **list:** list items will not escape their parent when parent width is restricted ([4b00a95](https://github.com/material-components/material-web/commit/4b00a9561c39b8f87299daed36e4aff0679e1263))
* **list:** show pointer cursor for button list items ([16480d0](https://github.com/material-components/material-web/commit/16480d0e5d1c24f24ef143f8401192e6fa7e2c52)), closes [#5045](https://github.com/material-components/material-web/issues/5045)
* **md-item:** exclude start slot from hidden overflow ([5607059](https://github.com/material-components/material-web/commit/56070593cebeb1b25b87fbe7e4767f6291548004))
* **md-item:** exclude start slot from hidden overflow ([e087141](https://github.com/material-components/material-web/commit/e0871411dd70554dd47bd256da9c2c50b44404c2))
* **menu,select:** enter clicks href items ([8ae8c02](https://github.com/material-components/material-web/commit/8ae8c02866d9284ee2e3a4e95b7cf573fdebf984))
* **menu:** fix menu item fade in order animation ([73eb15e](https://github.com/material-components/material-web/commit/73eb15ebee06d1ac12e94a43d7b59234b8bd48ee)), closes [#5014](https://github.com/material-components/material-web/issues/5014)
* **menu:** fix menu OOB from resizing window ([863109e](https://github.com/material-components/material-web/commit/863109e2043d82af2acf28c90a9393509b6ef5ee)), closes [#5063](https://github.com/material-components/material-web/issues/5063)
* **menu:** fix menu tapping behaviors on iOS and do not close on anchor click ([8bbb4b4](https://github.com/material-components/material-web/commit/8bbb4b4ffffa45373bc539da95152af5724713a8))
* **menu:** fix submenu SSR left keyboard close navigation ([d6f7220](https://github.com/material-components/material-web/commit/d6f7220f0b0d394ae265ca1546eb0af4f63c07d9))
* **radio:** cursor should be pointer except when disabled ([7779987](https://github.com/material-components/material-web/commit/7779987118a6c88091ad378eeee24b96f0c2c037))
* **select:** cursor on select options should be pointer ([ff250dc](https://github.com/material-components/material-web/commit/ff250dc983794e356c329a9bef8f391583948d71)), closes [#5066](https://github.com/material-components/material-web/issues/5066)
* **slider:** slider knob has size to drag on ios safari ([6298cd2](https://github.com/material-components/material-web/commit/6298cd2cf04cc4c62e940972068d7469a9f1a1cc)), closes [#5016](https://github.com/material-components/material-web/issues/5016)
* **switch:** cursor should be pointer except when disabled ([9a3ff28](https://github.com/material-components/material-web/commit/9a3ff289f5343e4350afa5951cf09527f270c2c6)), closes [#5075](https://github.com/material-components/material-web/issues/5075)
* **tabs:** revert `isTab` check so it is possible to create your own tab ([db3c865](https://github.com/material-components/material-web/commit/db3c8651c2407e777042cace9ba7aac4eb75f988))
* **tabs:** revert `isTab` check so it is possible to create your own tab ([e10186e](https://github.com/material-components/material-web/commit/e10186e91b35e4844e437914394e5581ff63fbc1))
* **tabs:** use `md-tab` attribute to brand individual tab children ([8ec0813](https://github.com/material-components/material-web/commit/8ec08133af05c0755fbac764b3275af0f8ae0c1c))
* **textfield:** calling focus on textfield with a leading icon focuses the input ([8f999d4](https://github.com/material-components/material-web/commit/8f999d4a0db80658664437e38bb51f2eaee6fe2d))
* **textfield:** forward the `multiple` field to the native input ([03e5a7e](https://github.com/material-components/material-web/commit/03e5a7ec8be9690368677693f95e3ba1c640852f)), closes [#5064](https://github.com/material-components/material-web/issues/5064)
* **textfield:** missing focused left border for textarea in HCM ([9194cc9](https://github.com/material-components/material-web/commit/9194cc94db76c5395cfff3e2bd2bb205c702d1a4))
* **tabs:** use `md-tab` attribute to brand individual tab children


### Reverts

* fix(tabs)!: use md-tab attribute to brand individual tab children ([d1f3887](https://github.com/material-components/material-web/commit/d1f3887613bf9eda7a148b8c3cebd1f370b4cc26))
* pardon the mess, "use `md-tab` attribute to brand individual tab children" is not a breaking change ([43af3ba](https://github.com/material-components/material-web/commit/43af3baa7f599c0d9cf3f5562e2a772e229d95c2))

## [1.0.0](https://github.com/material-components/material-web/compare/v1.0.0-pre.17...v1.0.0) (2023-09-26)


### ⚠ BREAKING CHANGES

* **list:** the new ListController behavior no longer waits for event.preventDefault asynchronously because it was causing keyboard navigations to scroll the page.
* **list:** `<md-list-item>` now uses slots instead of properties and has removed many prescriptive items (such as avatar, image, and video items). The default slot can be used for any custom content. ```html <md-list-item>   <div slot="overline">OVERLINE</div>   <div slot="headline">First line</div>   <div slot="supporting-text">Second+ lines</div>   <div slot="trailing-supporting-text">Trailing</div>   <md-icon slot="start">star</md-icon>   <md-icon slot="end">star</md-icon> </md-list-item> ``` Add `type="button"` or `type="link"` for interactive list items.
* **menu:** Several enums in menu had their values changed from SCREAM_CASE to kebab-case to follow style guide. They are NAVIGABLE_KEYS -> NavigableKey, SELECTION_KEY -> SelectionKey, CLOSE_REASON -> CloseReason, KEYDOWN_CLOSE_KEY -> KeydownCloseKey
* **menu,select:** refactor `fixed` property to `positioning="fixed"` in Menu and `menuFixed` to `menuPositioning="fixed"`
* **menu:** This change refactors menu-item to no longer subclass or import from list-item. It also refactors it to use md-item directly which means that the API of menu item has moved from properties to slots. `start-*` and `end-*` slots are now just `start` and `end`, many tokens are now gone in favor of slotting. `headline` property is now a `slot="headline"` slot. Typeahead search text can now be set via `typeaheadText` which defaults to the slotted headline `textContent`. `select-option` now has the `displayText` which is used to display text in the `md-select` when the option is selected; defaults to the slotted headline `textContent`.
* **menu:** We have deleted `md-sub-menu-item`. Instead it is recommended to use `md-sub-menu` which can have `md-menu-item[slot=item]` and `md-menu[slot=menu]` slotted into it. This makes `sub-menu-item` accessible for screen readers using linear navigation
* **menu:** Menu no longer uses md-list internally which means the list-related properties such as `list-tabindex` and `type` should now be on the host of md-menu. The new attributes should be `tabindex` and `role` respectively.
* **iconbutton:** Replace `container-size` tokens with `container-width` and `container-height`.
* **list:** the `noninteractive` property has been replaced by the `interactive` property, and by default, a list-item will no longer show a ripple or focus ring. What to change:
    - To preserve prior default behavior, add the `interactive` attribute explicitly.
    - Any setting of a truthy `noninteractive` attribute or property can be removed as it's the new default behavior.
* **menu:** rename corner and focus state values lowercase with dashes
* **chips:** chips now follow the [aria toolbar pattern](https://www.w3.org/WAI/ARIA/apg/patterns/toolbar/examples/toolbar/). Chip sets are toolbars and chips are buttons or links. Filter chips are toggle buttons. What to change:
    - Remove `type` attribute from `<md-chip-set>` (you can mix and match chip types!)
    - Remove `single-select` from `<md-chip-set>`. Use JS to control filter chips if single selection is required. Radio filter chips will come in a future update.
    - Disabled chips CAN be focused with the keyboard if `always-focusable` is set.
    - Filter chips no longer dispatch a `"selected"` event. Listen to `"click"` and use `event.target.selected` instead.
    - ArrowUp and ArrowDown no longer navigate between chips. These are reserved for chip actions, like dropdown menu chips.
* **list,menu,select:** the data-variant=".." selectors in list-item and all variants have been removed in favor of their respective slots. e.g. a slotted icon of the form `md-icon[slot=end][data-variant=icon]` should now be `md-icon[slot=end-icon]`.
* **menu:** menu selected container color changed to secondary-container
* **list:** 
* **list:** Aria and roles on List have been moved to the host element. list-tabindex attribute should be migrated to tabindex attribute. type attribute should be migrated to role attribute.
* **list,menu,select:** removed `active` from list-item, menu-item, and select-option. Instead, List uses tabindex to track whether something is focusable.
* **select:** `option.selected` no longer reflects. Set the attribute instead if relying on the attribute for styles/queries.
* **dialog:** if overriding margin on a dialog's content, swap it to padding. If a dialog's slotted first or last child has built-in margin (such as `<h3>` or `<p>`), remove the top/bottom margin as needed (since margin swapped to padding, there's no more margin collapsing).
* **tabs:** Rename the `selected` index property on md-tabs to `activeTabIndex` (`active-tab-index` attribute). Rename `select-on-focus` to `auto-activate`
* **typography:** composite `-type` tokens are no longer supported. Use discrete `-font`, `-size`, `-line-height`, and `-weight` tokens instead.
* **tabs:** replace `label-text-type` tokens with `-font`, `-size`, `-line-height`, and `-weight`
* **tabs:** rename `selected` to `active` for primary and secondary tabs.
* **textfield:** replace slot names `leadingicon` and `trailingicon` with `leading-icon` and `trailing-icon`
* **select:** replace `leadingicon` and `trailingicon` slot names with `leading-icon` and `trailing-icon`
* **navigationtab:** change slot names activeIcon and inactiveIcon to active-icon and inactive-icon

### Features

* **chips:** swap to toolbar a11y pattern ([16bfac1](https://github.com/material-components/material-web/commit/16bfac1343128f641b34e74e21c69a05a28a9185))
* **iconbutton:** update tokens to v0.192 ([e8b5b29](https://github.com/material-components/material-web/commit/e8b5b29d1eb18566126b77fcdc01c5f7f8899e25))
* **item:** add `&lt;md-item&gt;` layout component ([ffe4f79](https://github.com/material-components/material-web/commit/ffe4f79b5d749eabf051e677cb09a03488a1717d))
* **items:** add `&lt;md-item&gt;` to `@material/web/labs` ([b35212a](https://github.com/material-components/material-web/commit/b35212a9ac7907af3460ea64cc4f2e5874bf73fc))
* **list,menu,select:** add slots for specific slotted variants ([ed68995](https://github.com/material-components/material-web/commit/ed689952ddc6380fc6f004e190d521e6c739e415))
* **menu:** create a Menu interface for easier md-menu wrapping ([5fad4f0](https://github.com/material-components/material-web/commit/5fad4f088f2bcc957ee5cef0c261d537bf7caa12))
* **menu:** do not close menu if anchor is clicked ([c7c276f](https://github.com/material-components/material-web/commit/c7c276fdfa5eb2c7b4d06c7ccef8e36deaa96e5c))
* **menu:** implement md-sub-menu ([54fbb2e](https://github.com/material-components/material-web/commit/54fbb2ed5ee28d68d6d27b8121a8c4b3b1d10c8e))
* **menu:** menus will resize and flip corners to stay in viewport ([235a203](https://github.com/material-components/material-web/commit/235a2033d7e492e5ed245e7a81b0082e8ecd35ac))
* **menu:** update tokens to v0.192 ([94b5c81](https://github.com/material-components/material-web/commit/94b5c8125e2f264699b8afd1b44968346a526759))
* **select:** add required and form association ([4ad2336](https://github.com/material-components/material-web/commit/4ad2336b878b8db1523e1d333fc80c72a0969647)), closes [#4903](https://github.com/material-components/material-web/issues/4903)
* **tabs:** add `tabs` property to retrieve tab elements ([bf48fc3](https://github.com/material-components/material-web/commit/bf48fc307ecadb7eb768052a54838a5ab532e059))
* **typography:** add typography Sass APIs ([8e480de](https://github.com/material-components/material-web/commit/8e480deae3501eaec7d8d5f5b959bff10ab699d7))


### Bug Fixes

* aria polyfill overrides user values and user values override internals values ([8aa4faf](https://github.com/material-components/material-web/commit/8aa4faf14ac8207c9a39f783f971bfbf5933bfa5))
* **catalog:** remove TODO from home page ([af27ff8](https://github.com/material-components/material-web/commit/af27ff8374e1814e7f1a3b303a28ab1c49b115a7))
* **dialog:** change content margin to padding ([8613fe6](https://github.com/material-components/material-web/commit/8613fe6a5845f87c7264254bdc114341fef7d824))
* **dialog:** not delegating focus in closure ([375b766](https://github.com/material-components/material-web/commit/375b7664efcc84925f7f283ef0902c32b558c090))
* **iconbutton:** allow prevent default click for toggles ([ed539c6](https://github.com/material-components/material-web/commit/ed539c6853cc6f1c6e5f3b2c40f06e83c779c3e5)), closes [#4857](https://github.com/material-components/material-web/issues/4857)
* **iconbutton:** fix HCM disabled opacity and outlined ([1163315](https://github.com/material-components/material-web/commit/116331594826032c09e5dacee5e97d729c7f36a3))
* **linearprogress:** linear progress buffer dots now visible in HCM ([70bfea8](https://github.com/material-components/material-web/commit/70bfea873818d321343649df36046931c8eaab25))
* **list,menu:** clicking items in a list followed by keyboard nav functions as expected ([af171df](https://github.com/material-components/material-web/commit/af171df086d73094df4fa01ba052ffdef06a1197))
* **list,menu:** list items left right keyboard navigation ([fad6104](https://github.com/material-components/material-web/commit/fad61043914463f3e385bf786f6a6ff0b4d0c60c))
* **list:** list items are now noninteractive by default ([3b5cbc4](https://github.com/material-components/material-web/commit/3b5cbc4ede8c32066a76087870f08b55a246d13a))
* **list:** text items are no longer tabbable, links cannot be disabled ([54c4ddb](https://github.com/material-components/material-web/commit/54c4ddba4c13be05de08a64f635a0cf11fbb33cb))
* **list:** update tokens to 0.192 ([58539b1](https://github.com/material-components/material-web/commit/58539b156984d7bbbbb4a534230d796596984323))
* **menu,select:** fix final aria issues ([aeb5103](https://github.com/material-components/material-web/commit/aeb5103e1c6342d565f4af01da1f9d3fb59c50a6))
* **menu:** allow submenus to close when focus is lost ([7a19c7e](https://github.com/material-components/material-web/commit/7a19c7e97a40103e65697c1f669d887b176f1cc6))
* **menu:** apply padding to dividers per spec ([df52d92](https://github.com/material-components/material-web/commit/df52d927242fc13828f58fd10b495c586ce92324))
* **menu:** expose item custom properties and fix selected color ([d27ef2e](https://github.com/material-components/material-web/commit/d27ef2e059454624293c0a6ce7ee6d25afde8d5d))
* **menu:** fix submenus on mobile ([368991c](https://github.com/material-components/material-web/commit/368991ce306e904959a5d53e49293a8a683c46a1))
* **menu:** menu's default focus behavior follows google accessibility practices ([2927245](https://github.com/material-components/material-web/commit/29272451146afcb918237c11e8b7d7ef715a4675))
* **menu:** update default min width to spec and allow max-width to inherit ([2e25bf8](https://github.com/material-components/material-web/commit/2e25bf8ce2979de4a5bccabc244fd4ca715ecebc))
* **navigationtab:** change slot names activeIcon and inactiveIcon to active-icon and inactive-icon ([f019ac3](https://github.com/material-components/material-web/commit/f019ac37fe07da0a0a75821ce955dc6c6cbdc3c9))
* **radio:** dispatches input event on select ([e444de3](https://github.com/material-components/material-web/commit/e444de3c0264697e2fc094c35ae59808a04ff29f))
* **select:** change slot names to kebab-case ([059dad5](https://github.com/material-components/material-web/commit/059dad5d44ed43f4c84e754ce73f10b24bbbd1ae))
* **select:** don't reflect `selected` attribute ([573caae](https://github.com/material-components/material-web/commit/573caaee1b7fe64b57b84e2b287b6c5c74666de1))
* **select:** select can reopen when animation interrupted ([78e7c17](https://github.com/material-components/material-web/commit/78e7c1742f04437eee3f804cc73de9d3ffaaf1bb))
* **select:** update select docs and fix initial selection ([5e4434b](https://github.com/material-components/material-web/commit/5e4434bfed93db4ea0b02f3987483860ed7b2411))
* **slider:** border should only appear when handle nubs are overlapping ([6e72a8e](https://github.com/material-components/material-web/commit/6e72a8e5f4d118992fd110e19a02a2a3b2e31dc9))
* **slider:** label should not changed size when stacked ([b50d5c8](https://github.com/material-components/material-web/commit/b50d5c87b33f0a46bc98e2d362abc0656fdbc424))
* **slider:** make tickmarks visible when slider is disabled ([e9d1e7d](https://github.com/material-components/material-web/commit/e9d1e7d3c4ff937ed4f8913ab7280aee28a9e3eb))
* **tabs:** a11y and tabs sometimes not activating ([58f2446](https://github.com/material-components/material-web/commit/58f24462467b549c810554d8bc78480673d36e3d))
* **tabs:** remove font shorthand tokens ([88eb175](https://github.com/material-components/material-web/commit/88eb1759c50863eb444bc45dc28aa861beb8f853))
* **tabs:** remove previously selected tab property ([70ce0d2](https://github.com/material-components/material-web/commit/70ce0d2779e2310d28351141296106dbcb526255))
* **tabs:** remove public indicator property ([d296316](https://github.com/material-components/material-web/commit/d296316a2b69beff48ceb89dfc9b79bd475b0122))
* **tabs:** rename tab `selected` to `active` ([23b291b](https://github.com/material-components/material-web/commit/23b291b2ddf2450875868679ef7a288e770920bc))
* **tabs:** scrollable divider not taking up full width ([a0fca90](https://github.com/material-components/material-web/commit/a0fca90bdf8a8254ed6f28802b7d58248e24f889))
* **tabs:** setting `active` on tab selects them ([1442f9b](https://github.com/material-components/material-web/commit/1442f9b223761f0202b3c935159bc0b26bb0a16d))
* **textfield,focus,ripple:** fix textfield SSR ([f576b60](https://github.com/material-components/material-web/commit/f576b60aecf8f0e01746c61f6a4319922d1753e8))
* **textfield:** add demo a11y and fix outlined label navigation ([7866a93](https://github.com/material-components/material-web/commit/7866a939b95e10e5e5dafa5e4098370971e78e8b))
* **textfield:** broken required validity on Safari ([c26a578](https://github.com/material-components/material-web/commit/c26a578448666fda50eb2b25be59b88390e32097)), closes [#4796](https://github.com/material-components/material-web/issues/4796)
* **textfield:** change slot names to kebab-case ([82e9e92](https://github.com/material-components/material-web/commit/82e9e92a19b82c401d2d878b2a713fbd773b1ad6))
* **textfield:** don't show focus indicator when focused on icon ([61c8f6d](https://github.com/material-components/material-web/commit/61c8f6db460c23caa9ab27b1ccfa84a72a8e1709))
* **textfield:** remove icon that appears in search input in chrome and safari ([86aaacd](https://github.com/material-components/material-web/commit/86aaacd32c02ee533a5506723ac7dbd77faf8fd3))
* **tokens:** generate tokens v0.192 ([116b448](https://github.com/material-components/material-web/commit/116b448639454674f9024b22f1dfe88187851d0d))
* **tokens:** update components to v0.192 ([cfd053c](https://github.com/material-components/material-web/commit/cfd053c39701aa0b8d8e33a9e0392a68ec842a83))


### Miscellaneous Chores

* prep release version ([df508ef](https://github.com/material-components/material-web/commit/df508ef5fdd1494bf6a3c567d9ac82da978fb8e0))


### Code Refactoring

* **list,menu,select:** remove active concept and now parent controls tabIndex and focus ([d446315](https://github.com/material-components/material-web/commit/d4463154cc1f5831aac79cf2894146289d9a56be))
* **list,menu,select:** remove data-variant slotted variant selectors ([1f31df8](https://github.com/material-components/material-web/commit/1f31df818be4140640bc1b12a8401a9f202b7914))
* **list:** move list aria to host ([9447ec7](https://github.com/material-components/material-web/commit/9447ec7d72999f5e6bcef91baf803d51d0d0e442))
* **list:** refactor list to reuse ListController ([6d0c7e8](https://github.com/material-components/material-web/commit/6d0c7e8538c41be727cd333faffc5c6085d69c6b))
* **list:** refactor list using md-item ([7536774](https://github.com/material-components/material-web/commit/753677489b90175ca799bd422cdd7c2b9b2ede42))
* **menu,select:** rename `fixed` to `positioning` ([63b0142](https://github.com/material-components/material-web/commit/63b01425e7ed5e810853c7af629f4e3198a9fb5d))
* **menu:** pull logic out of menuitem into a controller & change enum vals ([1217b62](https://github.com/material-components/material-web/commit/1217b62ef2cd73fbf28fe32ef45941ce130961d1))
* **menu:** refactor menu-item to use md-item and not rely on md-list-item ([2a1d877](https://github.com/material-components/material-web/commit/2a1d8776a76025ff9ff5ebc8cacea1f12f69badf))
* **menu:** remove sub-menu-item in favor of sub-menu ([d6cbf74](https://github.com/material-components/material-web/commit/d6cbf741374cbb22abe3764d19afe265f42f9a5f))
* **menu:** rename corner and focus state values lowercase with dashes ([6e54048](https://github.com/material-components/material-web/commit/6e54048f1eadb8234c3681009a5b8193f14f7c14))
* **menu:** update menu to use host-aria ([0384507](https://github.com/material-components/material-web/commit/03845074479894e3e609b7c5ec6e37d4f6cdaf88))

## [1.0.0-pre.17](https://github.com/material-components/material-web/compare/v1.0.0-pre.16...v1.0.0-pre.17) (2023-09-06)


### ⚠ BREAKING CHANGES

* **slider:** replace `label-text-type` tokens with `-font`, `-size`, `-line-height`, and `-weight`. Additionally, rename `label-label-*` tokens to a single `label-*`
* **list:** replace `*-type` font tokens with `-font`, `-size`, `-line-height`, and `-weight`
* **chips:** replace `label-text-type` tokens with `label-text-font`, `-size`, `-line-height`, and `-weight`
* **text-field,select:** replace `*-type` font tokens with `-font`, `-size`, `-line-height`, and `-weight`
* **fab:** replace `label-text-type` tokens with `-font`, `-size`, `-line-height`, and `-weight`
* **dialogs:** replace `headline-text-type` and `supporting-text-type` tokens with `-font`, `-size`, `-line-height`, and `-weight`
* **button:** replace `label-text-type` tokens with `label-text-font`, `-size`, `-line-height`, and `-weight`
* **circularprogress:** make default width 4px
* **textfield:** The field component must add the `resizable` attribute rather than using CSS. CSS `resize` can still customize the direction (defaults to both).
* **list,menu,select:** menu harnesses will not automatically open menus in quick mode anymore and interactions in menu and list harnesses will not automatically go to the first item but rather the menu roots.
* **iconbutton:** change `slot="selectedIcon"` to `slot="selected"` for toggle icon buttons.
* **tabs:** secondary tabs always have inline icons
* **tabs:** remove `variant` attributes and change `md-tab` to `md-primary-tab`, or `md-secondary-tab` if using `variant="secondary"
* **menu:** allow anchoring with idref string and set element ref on anchorElement
* **tokens:** Change "radio-button" and "progress-indicator" Sass token APIs to "radio" and "progress". This matches the tag names of their components.
* **tabs:** Remove `--md-*tab-divider` tokens and use `md-tabs::part(divider)` and `--md-divider-*` tokens
* **tabs:** tabs cannot be disabled per spec. If disabled tabs are required, use `pointer-events: none` and CSS to style them.
* **iconbutton:** change visibility of `willUpdate` to protected

### Features

* **color:** add color folder for md-sys-color theming APIs ([cdd9b26](https://github.com/material-components/material-web/commit/cdd9b264cb18dd9c43c4691b32fd47b65a90dab9))
* **color:** add color folder for md-sys-color theming APIs ([87af9aa](https://github.com/material-components/material-web/commit/87af9aa13022ed69dbe20961293e67b2bf5914c4))
* **focus,ripple:** allow setting `element.control = elementRef` ([1e7aff5](https://github.com/material-components/material-web/commit/1e7aff50cf3882f711dd6eb56f08a95ee6f3c084))
* **menu:** allow anchoring with idref string and set element ref on anchorElement ([5ba348d](https://github.com/material-components/material-web/commit/5ba348dfd07f771d0db093841353f85b2a366c5a))
* **select:** dispatch select-(open|close)(ing|ed) events ([1a1fb93](https://github.com/material-components/material-web/commit/1a1fb93be77634d45c373bf97804ccd074cef719)), closes [#4798](https://github.com/material-components/material-web/issues/4798)
* **switch:** add required and form validity ([9694191](https://github.com/material-components/material-web/commit/9694191ec02bb37575df8d74af6e530f3e4e45e9))


### Bug Fixes

* add aria-hidden="true" to ripple, focus ring, and elevation ([2295f12](https://github.com/material-components/material-web/commit/2295f12e711f563b05a19d1d354e37a986027d5d))
* **badge:** center align value text ([cc195a9](https://github.com/material-components/material-web/commit/cc195a947656b2f4765be77ba2fa3cbfe680ba76))
* **button:** remove font shorthand tokens ([8894c20](https://github.com/material-components/material-web/commit/8894c20c6becab188f6136753f538372258b8faf))
* **button:** update demos to fix a11y ([4b61e8d](https://github.com/material-components/material-web/commit/4b61e8d2034448a0d06baddca4d6f768f82b35bd))
* **chips:** apply cursor styling ([9389e26](https://github.com/material-components/material-web/commit/9389e26b68705e82c1cde5469ab7777790db5477))
* **chips:** linear navigation not working in VoiceOver ([dfc87f3](https://github.com/material-components/material-web/commit/dfc87f32e8621b0bbcf8156a276bd67a5ecd1ddc))
* **chips:** remove font shorthand tokens ([87ad1da](https://github.com/material-components/material-web/commit/87ad1dae4fbcdc037f842e65e173d0b66e210081))
* **circularprogress:** make default width 4px ([c864d3b](https://github.com/material-components/material-web/commit/c864d3b638fffdb22a1897507595d666fb16784a))
* **dialog, select:** allow fixed selects to render correctly in dialogs ([d6aa6b2](https://github.com/material-components/material-web/commit/d6aa6b22c794ed48f2937ea4a33f321d0b1f9b25))
* **dialog:** content not displaying on Safari ([9b7647b](https://github.com/material-components/material-web/commit/9b7647bd3d44c433e0edad7cd4d30f6fdd220f25)), closes [#4728](https://github.com/material-components/material-web/issues/4728)
* **dialog:** not showing if opened before connected ([d25c5e9](https://github.com/material-components/material-web/commit/d25c5e9ecade4ecc3d6ea4ceb9c5e2bc1d19dc06)), closes [#4728](https://github.com/material-components/material-web/issues/4728)
* **dialogs:** remove font shorthand tokens ([81e11e0](https://github.com/material-components/material-web/commit/81e11e09fa5ded5ab41e7cbcb977cd7dbc3ece81))
* **fab:** remove font shorthand tokens ([f77ee36](https://github.com/material-components/material-web/commit/f77ee3628c0ef6945f11c8045c3c2e4e0f262d68))
* **iconbutton:** change visibility of `willUpdate` to protected ([dffff2d](https://github.com/material-components/material-web/commit/dffff2d1a31f3ed40b28f57570ba4df7f61f7210))
* **iconbutton:** rename `selectedIcon` slot to `selected` ([9647f5e](https://github.com/material-components/material-web/commit/9647f5e5147b2d94f2db8ea6ca45c7f819714324))
* **iconbutton:** update demos to fix a11y ([a9091fe](https://github.com/material-components/material-web/commit/a9091fe036af55986123770606a686388fd39b3f))
* **labs:** remove font shorthand tokens ([acd40a2](https://github.com/material-components/material-web/commit/acd40a2f57277a67850c8e103a405dfcc4d3fdce))
* **list,menu:** restrict type to only supported aria roles ([32a8c44](https://github.com/material-components/material-web/commit/32a8c4410eff4bede75c77bcdd43541967c8d0e7))
* **list:** remove font shorthand tokens ([ca2cd56](https://github.com/material-components/material-web/commit/ca2cd56bd1b668904c6aea2b4d18602e773e1c9f))
* **list:** remove internal md3-* class prefix ([641142d](https://github.com/material-components/material-web/commit/641142dff0fa679754a6f26518e9db7eccf5f6f5))
* **menu,list,select:** do not stopPropagation on native events when handled only prevent default ([b85b57f](https://github.com/material-components/material-web/commit/b85b57fa792663460dbc1730c9e574e2b5ab998d))
* **radio:** make host radio role to fix a11y ([0711f8c](https://github.com/material-components/material-web/commit/0711f8c03c2c4c743386abf490e6dddf243be5e6))
* ripple and focus ring not centered in Safari ([0e8afc0](https://github.com/material-components/material-web/commit/0e8afc01757c3f1f8a5bf904e8cb857ea88bd7bf))
* **select, menu:** allow item selection while animation is running in non-overflow contexts ([b905807](https://github.com/material-components/material-web/commit/b9058076b6bdf10ad135003b6c91ac46ebcb273b))
* **select:** announce typeahead selection when select is closed ([2c892c4](https://github.com/material-components/material-web/commit/2c892c411472481c44d6d5a0bdec073d74634d89))
* **slider:** display tick marks when forced-colors is active ([2f9cc20](https://github.com/material-components/material-web/commit/2f9cc208df53f0587e3712ec03c164bac25efade))
* **slider:** remove font shorthand tokens ([6988a49](https://github.com/material-components/material-web/commit/6988a49a3b28273d02cad20ff0129c2906a63a26))
* **tabs:** add nocollapse so isTab doesn't get minified ([17ddcd3](https://github.com/material-components/material-web/commit/17ddcd3c2e1c994b868d8b49d55a7457234929b2))
* **tabs:** incorrect layout and primary indicator width ([0467c48](https://github.com/material-components/material-web/commit/0467c4845db7c31deddf7383beb199157f4c5034))
* **tabs:** make indicator animation faster ([b542d2a](https://github.com/material-components/material-web/commit/b542d2aa12dcfc70fa250265cc82647d04218254))
* **tabs:** remove disabled tabs ([d18db2a](https://github.com/material-components/material-web/commit/d18db2a6acb90a059856fbf74e8c2212f7680a68))
* **tabs:** remove divider tokens in favor of md-divider ([13690a3](https://github.com/material-components/material-web/commit/13690a396f666b2073f6dc4995090d12947de59f))
* **tabs:** secondary tabs always have inline icons ([6b2955b](https://github.com/material-components/material-web/commit/6b2955bffe68adc4c8c36ee96e2d45c2955b3a4c))
* **tabs:** split md-tab into md-primary-tab and md-secondary-tab ([5b13b5c](https://github.com/material-components/material-web/commit/5b13b5c05bdbe7a85e30408a33a07de6480317d2))
* **tabs:** use instanceof to check for a Tab ([58497f1](https://github.com/material-components/material-web/commit/58497f13b2ca494f233c290f6571f5f03f142d7f))
* **testing:** harness not applying :active to parents ([327eeaf](https://github.com/material-components/material-web/commit/327eeafbf9f3f7bbf5f80d458cd9e423c5a7d98d))
* **testing:** remove font shorthand tokens ([01a99a5](https://github.com/material-components/material-web/commit/01a99a5cc36cafe11422062d513e38cbf7442e02))
* **text-field,select:** remove font shorthand tokens ([0c5a2a2](https://github.com/material-components/material-web/commit/0c5a2a2886fd934c598361aacc0719ad484ade9b))
* **textfield:** don't transition colors when disabling ([11cc472](https://github.com/material-components/material-web/commit/11cc4721ce42bf63ed06637081fdeb01aa2f25bb))
* **textfield:** line breaks not visible in Firefox ([541c0e9](https://github.com/material-components/material-web/commit/541c0e947d1ad4549256af5ebdde645a86724171)), closes [#4581](https://github.com/material-components/material-web/issues/4581)
* **textfield:** show overflowing content like popups and focus rings ([ecac7ec](https://github.com/material-components/material-web/commit/ecac7ecbad43b90b94f61d44974312d5546877d8)), closes [#4071](https://github.com/material-components/material-web/issues/4071)
* **textfield:** textarea resize handle overlapping outline ([cdd2ea6](https://github.com/material-components/material-web/commit/cdd2ea6c1db189495abd3b45eee5e9872fc9622c))
* **tokens:** rename token override files ([59c44fc](https://github.com/material-components/material-web/commit/59c44fc2f9266b60d22e9bd5ff5d39e7d0ee8dff))


### Reverts

* feat(color): add color folder for md-sys-color theming APIs ([a528393](https://github.com/material-components/material-web/commit/a5283936fedd8da92af994fa0d721e07bc2686c4))


### Miscellaneous Chores

* update next version ([f41c816](https://github.com/material-components/material-web/commit/f41c8165f47e6a212b6c8ca104951187c8020622))


### Tests

* **list,menu,select:** clean up internal testing patterns from harnesses ([fcfc696](https://github.com/material-components/material-web/commit/fcfc696c4628fd2f41b09c060e6af4cd8e7658c2))

## [1.0.0-pre.16](https://github.com/material-components/material-web/compare/v1.0.0-pre.15...v1.0.0-pre.16) (2023-08-21)


### ⚠ BREAKING CHANGES

* **list-item:** remove duplicate list-item menu-item from custom prop names

### Features

* **fab:** do not require has-icon ([156ca3c](https://github.com/material-components/material-web/commit/156ca3cbe7fc03290892a1b20c8b5036b996d2ed))
* **iconbutton:** add touch target configs ([0862c58](https://github.com/material-components/material-web/commit/0862c58d24054a496b452d22fd56726e38057669))
* **list:** change default host display to flex so max-width can be set without user setting display ([aa3fe3d](https://github.com/material-components/material-web/commit/aa3fe3d1ecff7c32850045b5c7eaedb2adbedc43))
* **switch:** add touch target configs ([8bad07b](https://github.com/material-components/material-web/commit/8bad07bcf7aade5bb79b04a177acc227da8527bc))
* **tab:** add logical container shape tokens ([dbed51c](https://github.com/material-components/material-web/commit/dbed51cc275dd37251e4e7e151e8f9b7d698ff22))
* **textfield:** support inputmode attribute ([5d0cbf5](https://github.com/material-components/material-web/commit/5d0cbf5e9758e07d2d580fd2a47bc6bc74289856))


### Bug Fixes

* **button:** `href` and `target` default value is now an empty string ([d665864](https://github.com/material-components/material-web/commit/d665864cba14e06aa050a1c77d8b5db914355113))
* **button:** add value to form when submitting ([f23fac1](https://github.com/material-components/material-web/commit/f23fac1465d7e0f6a6fa029f7395c91bd5b765c6)), closes [#4526](https://github.com/material-components/material-web/issues/4526)
* **button:** incorrect HCM colors ([b144227](https://github.com/material-components/material-web/commit/b1442274383a8ba83e6ec94e24d04becb5988b88))
* **checkbox:** not working after formAssociated changes ([33803ab](https://github.com/material-components/material-web/commit/33803aba39ab531f233c6b4831eaa9d7715919a7)), closes [#4747](https://github.com/material-components/material-web/issues/4747)
* **chips:** avatar input chips are rounded by default ([b7671fb](https://github.com/material-components/material-web/commit/b7671fb7882836e192de194d801e6d3edc856eb0))
* **chips:** make forced-color border color explicit ([cd8f2fc](https://github.com/material-components/material-web/commit/cd8f2fc9fc9315024a9b22c89d07ac870836ddd5))
* **chips:** per spec, trailing focus rings are always circles ([fc9b945](https://github.com/material-components/material-web/commit/fc9b945d9969091611d54b7b80e6b41a44c2df16))
* **elevation:** don't transition border-radius ([7d616fa](https://github.com/material-components/material-web/commit/7d616faecdc20ff2bb407e6af99f46716b1a813f))
* **iconbutton:** make target type stricter ([c874cd5](https://github.com/material-components/material-web/commit/c874cd55c70d0b3b5fe99464b2301a325dfea2df))
* **iconbutton:** rename selectedAriaLabel to ariaLabelSelected along with attribute ([2bbab09](https://github.com/material-components/material-web/commit/2bbab09a509595e50b3d4684374b3210f4b44c42))
* **icon:** don't allow user text selection by default ([53aab28](https://github.com/material-components/material-web/commit/53aab285e94495bbac577712d35db264a9d6c908))
* **list:** use margin over padding on slotted content and fix extraneous spacing ([1530aca](https://github.com/material-components/material-web/commit/1530aca17de16919380e3a52d5eb348da05e60d8))
* **menu:** make overriding default styles less likely ([626b4ef](https://github.com/material-components/material-web/commit/626b4efd69166b9c5602fdbb62389ce490bdef56))
* **progress:** incorrect HCM colors ([f39da54](https://github.com/material-components/material-web/commit/f39da54bc579d0ec1f230fc4ab3b40a7466867d0))
* **slider:** fix accessibility issues ([e836dc3](https://github.com/material-components/material-web/commit/e836dc333bdb840f41ed9afafd6f04f87ca67896))
* **slider:** focus ring too small ([8942568](https://github.com/material-components/material-web/commit/8942568ffec755b588055cfd84a8d5b1e7829197))
* **switch:** unselected handle too big with selected icon only ([ecf83a0](https://github.com/material-components/material-web/commit/ecf83a0e7a0f8ed377350ee4af40cb51b4404496))
* **textfield:** add form validity support ([a167cab](https://github.com/material-components/material-web/commit/a167cabeff27275b88bcaa4c98d14307fc0f1fe9)), closes [#4435](https://github.com/material-components/material-web/issues/4435)
* **textfield:** focus indicator and outline are 3px ([bbb7840](https://github.com/material-components/material-web/commit/bbb784012a3d29aa594e2051e1763f745e29d666))


### Miscellaneous Chores

* update next version ([1675fd0](https://github.com/material-components/material-web/commit/1675fd0062e8378897dbc8de4b2869dda3079987))


### Code Refactoring

* **list-item:** remove duplicate list-item menu-item from custom prop names ([2d9352e](https://github.com/material-components/material-web/commit/2d9352e3f4ec0fef3d5ffca5d34f07bf38345a92))

## [1.0.0-pre.15](https://github.com/material-components/material-web/compare/v1.0.0-pre.14...v1.0.0-pre.15) (2023-08-10)


### ⚠ BREAKING CHANGES

* **dialog:** See https://github.com/material-components/material-web/discussions/4675 for more details.
* **fab:** Replace `reduced-touch-target` with `touch-target="none"`
* **checkbox:** Checkbox's size is now smaller by default. Add margin or `touch-target="wrapper"` to increase it to the previous size.
* **radio:** Radio's size is now smaller by default. Add margin or `touch-target="wrapper"` to increase it to the previous size.
* **dialog:** Fullscreen dialogs weren't matching spec, so we're removing them for now to avoid future breaking changes. They will be re-added later.
* **list,menu:** list-item-link and menu-item-link have been removed and their functionality has been added to menu-item and list-item respectively.
* **dialog:** use `autofocus` attribute instead of `dialog-focus`
* **dialog:** Use dialog.open, dialog.show(), and dialog.close() instead.
* **dialog:** dialog actions can set their own layout with a container element.
* **dialog:** Material dialogs are always modal.
* **select:** select will now show an arrow indicator and will apply default styles to slotted icons
* **icon:** Remove css custom properties from icon and prefer applying normal css properties on host except for font-family.
* **menu:** subclassing events is not supported in ES5 so all menu-related events now use CustomEvent rather than subclassing Event
* **button:** Buttons submit forms by default, like `<button>`. Add `type="button"` to not submit forms.
* **checkbox:** Design is still exploring error-state checkboxes. If needed, theme with an error color and set aria-invalid.
* **iconbutton:** Remove "unselected" from `--md-*-icon-button-*` custom properties.
* **button:** Rename "md-tonal-button" elements, imports, and tokens to "md-filled-tonal-button"
* **iconbutton:** rename <md-standard-icon-button> to <md-icon-button>
* **dialog:** remove transitions
* **dialog:** remove content and divider tokens
* **dialog:** remove transition and scrim tokens
* **switch:** Rename `--md-switch-unselected-<token>` to `--md-switch-<token>`
* **button:** Rename `--md-<button>-spacing-<token>` to `--md-<button>-<token>-space`. Rename `--md-<button>-with-icon-*` to `--md-<button>-with-leading-icon-*`.
* **dialog:** remove draggable
* **dialog:** remove fullscreen tokens
* **radio:** Rename `--md-radio-unselected-<token>` to `--md-radio-<token>`

### Features

* **button:** add touch target configs ([1f46179](https://github.com/material-components/material-web/commit/1f46179e831537b4470548e09e1574c1c4c5a90c))
* **checkbox:** add required and form validity ([5606eef](https://github.com/material-components/material-web/commit/5606eefc38b08ebeb5f63d54b4b82631ea67936a))
* **checkbox:** add touch target configurations ([f574b00](https://github.com/material-components/material-web/commit/f574b00a6384ec8f95bffd5e2c730c58639f98dd))
* **chips:** add touch target configs ([2300eb6](https://github.com/material-components/material-web/commit/2300eb6e4f666f8776d9860157ce6f09f322e4b6))
* **fab:** add touch target configurations ([8588a3f](https://github.com/material-components/material-web/commit/8588a3f52e7496e281bf59d6b1ad6a9ab116d236))
* **icon:** add aria-hidden true by default ([08d50e2](https://github.com/material-components/material-web/commit/08d50e231dd7091f5fd4b843e636e9f04941f998))
* **iconbutton:** add form submission ([c0da72b](https://github.com/material-components/material-web/commit/c0da72b6dc743772f34fb1e20ef678850bcc0dd1))
* **list,menu:** add css shadow parts to sub components ([65d04a3](https://github.com/material-components/material-web/commit/65d04a3cf3cba46deb12cd0affa2649bf3e45407))
* **radio:** add touch target configurations ([7c461ca](https://github.com/material-components/material-web/commit/7c461cad75c58eb28c3b02321197ebcf9d3b93cd))


### Bug Fixes

* **button:** rename `&lt;md-tonal-button&gt;` to `<md-filled-tonal-button>` ([cc26ef6](https://github.com/material-components/material-web/commit/cc26ef6c02dabf9e853b4aee08f5cb3af5e29f8f))
* **button:** rename spacing tokens ([2329d2b](https://github.com/material-components/material-web/commit/2329d2b419d2963d8050dc4cda1607f165f3d2fd))
* **button:** type is submit by default ([97f5b61](https://github.com/material-components/material-web/commit/97f5b616d6b76e23e378f7abed4c6a72b60c9367))
* **checkbox:** remove error property ([ce248dc](https://github.com/material-components/material-web/commit/ce248dc3831a494bf70625d3f4b0b6ca895a2d97))
* **dialog:** misspelled `transition` ([fa103cb](https://github.com/material-components/material-web/commit/fa103cbc78677b4829a94743b1561a023d44058f)), closes [#4638](https://github.com/material-components/material-web/issues/4638)
* **dialog:** remove content and divider tokens ([5adbf73](https://github.com/material-components/material-web/commit/5adbf730d3c9bf9ccfa066a0b7e10ac1831b8269))
* **dialog:** remove draggable ([2568d4f](https://github.com/material-components/material-web/commit/2568d4fbac69c8b5e9a5d5198c6525224ebf778d))
* **dialog:** remove fullscreen temporarily ([39ae5a6](https://github.com/material-components/material-web/commit/39ae5a694723d83674eab06dcee9f8a3c5d7d764))
* **dialog:** remove fullscreen tokens ([8b896e0](https://github.com/material-components/material-web/commit/8b896e0e638f61a7963a9104db70d27f6d2afbca))
* **dialog:** remove modeless ([d8ac9ce](https://github.com/material-components/material-web/commit/d8ac9ce29e146516d84c3f6ba38cd9b8d39db8ec))
* **dialog:** remove stacked ([500472b](https://github.com/material-components/material-web/commit/500472bbdf094187de1c937a2e2fac293880ba1c))
* **dialog:** remove toggleShow() ([b992b15](https://github.com/material-components/material-web/commit/b992b154dee676a746cd3ada066809514c8a1dbb))
* **dialog:** remove transition and scrim tokens ([e581142](https://github.com/material-components/material-web/commit/e581142d67ebe5429999e3517cf420138cfac671))
* **dialog:** remove transitions ([2d1c580](https://github.com/material-components/material-web/commit/2d1c58022e70c3141f79e94cb2ccc12af1d3f816))
* **dialog:** use `autofocus` attribute instead of `dialog-focus` ([50fd2f3](https://github.com/material-components/material-web/commit/50fd2f3fe08d9c9dc8c2e188fc0b9c39750e8af8))
* **filter-chip:** make click event preventDefault proof ([041cb21](https://github.com/material-components/material-web/commit/041cb21233b49680ec47980bea2e5cf44cbcbd05))
* **filter-chip:** move click event to inner button ([22b5b21](https://github.com/material-components/material-web/commit/22b5b2173aedfec88362b256a02d7841097e9598))
* **focus:** allow `--md-focus-ring-*` cascading again ([1fa5cf3](https://github.com/material-components/material-web/commit/1fa5cf34852fde4353352056b76520ff5c1321d1))
* **icon-button:** delegates focus ([db2010d](https://github.com/material-components/material-web/commit/db2010d2c12673a5905e751c68583d3df86f281d))
* **iconbutton:** remove unselected token prefix ([0a63c26](https://github.com/material-components/material-web/commit/0a63c267e9ccb272916d80b30c79908c2736e37f))
* **iconbutton:** rename &lt;md-standard-icon-button&gt; to <md-icon-button> ([a117b06](https://github.com/material-components/material-web/commit/a117b06b7b1d177cc9cd8abd4c9b9ff489e20d5d))
* **radio:** remove "unselected" prefix from tokens ([fb1c603](https://github.com/material-components/material-web/commit/fb1c6039e763dc7b78687f660772aeec5fe494b9))
* **segmentedbutton:** add back container height token ([db8be0a](https://github.com/material-components/material-web/commit/db8be0a15c81dd4854ea984d842c5bfe21e890d6))
* **segmentedbutton:** add back shape token ([c148bf6](https://github.com/material-components/material-web/commit/c148bf61fe11564eb60bd34ca8d1a92bb33cb0a8))
* **select:** add trailing icon indicator and fix icon token application ([4ab2e39](https://github.com/material-components/material-web/commit/4ab2e393d440225b6eb37c83aead7fd62920b11a))
* **switch:** remove unselected token prefix ([3681b58](https://github.com/material-components/material-web/commit/3681b588e02a43a4c72d4be703206348eea943a7))


### Miscellaneous Chores

* update next version ([432e660](https://github.com/material-components/material-web/commit/432e660d0cf65d94e390d9d1f0043d03c1381061))


### Code Refactoring

* **dialog:** match native `&lt;dialog&gt;` and fix spacing ([2996a8b](https://github.com/material-components/material-web/commit/2996a8b8266ac721e66d88fce9b1097e23f8ff49))
* **icon:** remove css custom props from icon and apply values directly on host ([ff60a88](https://github.com/material-components/material-web/commit/ff60a88843f901eb553e271fb5a786d6439935c8))
* **list,menu:** add href to (list|menu)-item and remove (menu|list)-item-link ([09cb6da](https://github.com/material-components/material-web/commit/09cb6da8fb0335494df04f8310242d3248507b40))
* **menu:** events no longer subclass Event but rather use CustomEvent ([043d548](https://github.com/material-components/material-web/commit/043d5482702620fe36f87255c74b17bb76d10554))

## [1.0.0-pre.14](https://github.com/material-components/material-web/compare/v1.0.0-pre.13...v1.0.0-pre.14) (2023-07-24)


### ⚠ BREAKING CHANGES

* Rename `@material/web/<component>/lib` to `@material/web/<component>/internal`. Prefer not using internal files.
* **focus:** Change `@material/web/focus/focus-ring.js` to `@material/web/focus/md-focus-ring.js`.
* **menu:** Rename `@material/web/menu/lib` to `@material/web/menu/internal`. Prefer not using internal files.
* **list:** Rename `@material/web/list/lib` to `@material/web/list/internal`. Prefer not using internal files.
* **focus:** Rename `@material/web/focus/lib` to `@material/web/focus/internal`. Prefer not using internal files.
* **icon:** Rename `@material/web/icon/lib` to `@material/web/icon/internal`. Prefer not using internal files.
* **iconbutton:** Rename `@material/web/iconbutton/lib` to `@material/web/iconbutton/internal`. Prefer not using internal files.
* **field:** Rename `@material/web/field/lib` to `@material/web/field/internal`. Prefer not using internal files.
* **divider:** Rename `@material/web/divider/lib` to `@material/web/divider/internal`. Prefer not using internal files.
* **chips:** Rename `@material/web/chips/lib` to `@material/web/chips/internal`. Prefer not using internal files.
* **elevation:** Rename `@material/web/elevation/lib` to `@material/web/elevation/internal`. Prefer not using internal files.
* **fab:** Rename `@material/web/fab/lib` to `@material/web/fab/internal`. Prefer not using internal files.
* **dialog:** Rename `@material/web/dialog/lib` to `@material/web/dialog/internal`. Prefer not using internal files.
* **checkbox:** Rename `@material/web/checkbox/lib` to `@material/web/checkbox/internal`. Prefer not using internal files.
* **button:** Rename `@material/web/button/lib` to `@material/web/button/internal`. Prefer not using internal files.
* **checkbox:** Rename `--md-checkbox-unselected-<token>` to `--md-checkbox-<token>`
* **progress:** rename `progress` property to `value`
* **progress:** remove circular progress slots
* **focus:** Set `--md-focus-ring-*` tokens directly on `<md-focus-ring>` elements. Focus rings are exposed with `::part(focus-ring)`.
* **linearprogress:** remove linearprogress directory
* **circularprogress:** remove circularprogress directory
* **field:** remove resizable, use css `resize: both`
* **textfield:** Rename `--md-*-field-container-padding-vertical` to `--md-*-field-top-space` and `--md-*-field-bottom-space`. Rename `--md-filled-*-field-with-label-container-padding-vertical` to `--md-filled-*-field-with-label-top-space` and `--md-filled-*-field-with-label-bottom-space`
* **textfield:** Rename `--md-*-field-container-padding-horizontal` to `--md-*-field-leading-space` and `--md-*-field-trailing-space`
* **textfield:** Rename `--md-*-field-supporting-text-padding` to `--md-*-field-supporting-text-leading-space` and `--md-*-field-supporting-text-trailing-space`. Rename `--md-*-field-supporting-text-padding-top` to `--md-*-field-supporting-text-top-space`
* **textfield:** Rename `--md-*-text-field-input-text-prefix-padding` and `--md-*-text-field-input-text-suffix-padding` to `--md-*-text-field-input-text-prefix-trailing-space` and `--md-*-text-field-input-text-suffix-leading-space`

### Features

* add component convenience bundles ([ae407b0](https://github.com/material-components/material-web/commit/ae407b0874760cb6a3d5a8db55c72f6cd4dc3d3c))
* **all:** expose `focus-ring` parts ([243e231](https://github.com/material-components/material-web/commit/243e231a1370c06d6ecd34b81be5f7c091cee6a7))
* **checkbox:** dispatch input event ([154861c](https://github.com/material-components/material-web/commit/154861c99e51e22c0a96f29fe5be22e053bbe04f))
* **progress:** add `max` property ([02a509b](https://github.com/material-components/material-web/commit/02a509b480145abf6bea44ec9d1f03379ea25538))
* **select:** expose menu and field CSS shadow parts ([c512808](https://github.com/material-components/material-web/commit/c5128089cdaed532ea47c0f8c3b556183d1ad3ec)), closes [#4291](https://github.com/material-components/material-web/issues/4291)
* **textfield:** add textarea type ([ff2e089](https://github.com/material-components/material-web/commit/ff2e0896800faeca0942dbd0fc4e0e159974d6a4))


### Bug Fixes

* **button:** remove md3-* class prefixes ([2dabbdc](https://github.com/material-components/material-web/commit/2dabbdc142c88e4c94bcbcbaa333811e7126ba97))
* **button:** rename "lib" directory to "internal" ([601ebb6](https://github.com/material-components/material-web/commit/601ebb669cc02b9a50c25950210bf6142550d546))
* **checkbox:** add a11y to demos ([89b99a7](https://github.com/material-components/material-web/commit/89b99a70947c10353f243c6adc6c12b6e895f6e5))
* **checkbox:** do not announce icon for screen readers ([921f185](https://github.com/material-components/material-web/commit/921f185aa14b22d3dce72fe1fe272b1501404cc4))
* **checkbox:** fix broken "lib" to "internal" sass import ([2147af7](https://github.com/material-components/material-web/commit/2147af7e28e1c96dc138c85c55eb1b1dd70da715))
* **checkbox:** reduce forced-colors size ([b5712f3](https://github.com/material-components/material-web/commit/b5712f3d4b4845e98cfb74f145e400647b492823))
* **checkbox:** remove "unselected" prefix from tokens ([66d7b8b](https://github.com/material-components/material-web/commit/66d7b8b275a51ae3a2f8a3957178583bb2904d5a))
* **checkbox:** rename "lib" directory to "internal" ([c4ac9f7](https://github.com/material-components/material-web/commit/c4ac9f73d923237457f856589b10e0413943664c))
* **checkbox:** screen readers announce errors as invalid ([ec02fe4](https://github.com/material-components/material-web/commit/ec02fe40fc6b576f8060b5862141f5061e85529c))
* **chips:** rename "lib" directory to "internal" ([a8880f7](https://github.com/material-components/material-web/commit/a8880f791b0a4961065dd8cc19f3727eb4d60100))
* **circularprogress:** remove circularprogress directory ([48edec0](https://github.com/material-components/material-web/commit/48edec020034a648961ea3b5670f8d60b5b27cda))
* **dialog:** rename "lib" directory to "internal" ([aaa672b](https://github.com/material-components/material-web/commit/aaa672b8687f89b638050aef08691a01a73e23c2))
* **divider:** rename "lib" directory to "internal" ([7fc17c9](https://github.com/material-components/material-web/commit/7fc17c99c9b6daaf2fa677889b242a71468d9f10))
* **elevation:** rename "lib" directory to "internal" ([0432e6d](https://github.com/material-components/material-web/commit/0432e6d9ceb454b94265ddafb63db2059633acbd))
* **fab:** rename "lib" directory to "internal" ([5618b5e](https://github.com/material-components/material-web/commit/5618b5e23f8dc6ad3e9b4625d7172d6f3f4a1bfd))
* **field:** keep label in same spot when resizing ([e1f8819](https://github.com/material-components/material-web/commit/e1f881991aac43c87b050bc4b1ec255f8d394fa3))
* **field:** move padding to slotted content ([0ab5fd5](https://github.com/material-components/material-web/commit/0ab5fd595d8c163065860a2e0deec8b77c8c9d77))
* **field:** remove resizable, use css `resize: both` ([6734344](https://github.com/material-components/material-web/commit/6734344e7362c484fb3e1f47449c364c3a8ad176))
* **field:** rename "lib" directory to "internal" ([dac3639](https://github.com/material-components/material-web/commit/dac363972149d78ca8f810bee970487f2a533946))
* **field:** use margin for textarea content ([7fdd0c4](https://github.com/material-components/material-web/commit/7fdd0c4c31a1cbaeba8297179c18645947410dfa))
* **focus:** move --md-focus-ring tokens to host ([f7eff48](https://github.com/material-components/material-web/commit/f7eff48c665ba5d59756c7d9013bcd058ba41575))
* **focus:** rename "lib" directory to "internal" ([77110d7](https://github.com/material-components/material-web/commit/77110d7c8ef8a91974bc93a7a0060433ee3fee04))
* **focus:** rename import to md-focus-ring.ts ([d49f9b8](https://github.com/material-components/material-web/commit/d49f9b89e4aed98382705f62cdacf0e777b5f5e0))
* **iconbutton:** rename "lib" directory to "internal" ([38b1b69](https://github.com/material-components/material-web/commit/38b1b69a9c0f243836fecc38cae17a237c312313))
* **icon:** rename "lib" directory to "internal" ([21b7bec](https://github.com/material-components/material-web/commit/21b7becd7bddc8e04f0428a1f8fb8d5fd37c912c))
* **linearprogress:** remove linearprogress directory ([bac10a6](https://github.com/material-components/material-web/commit/bac10a619bcb0d4e413ac94a0c387dcff2184d02))
* **list,menu,select:** update layout tokens to latest values and fix targets ([e9ef7ec](https://github.com/material-components/material-web/commit/e9ef7ec5b450b7126ff4a6f01f98720826c6b51f))
* **list:** rename "lib" directory to "internal" ([c6e6f65](https://github.com/material-components/material-web/commit/c6e6f65445f8436ed1f27830624dfaaea144d132))
* **menu:** rename "lib" directory to "internal" ([a8c2fa9](https://github.com/material-components/material-web/commit/a8c2fa9a8b2b591aed88babf1c65d8c89e181a4f))
* **progress:** add shared class ([75058ca](https://github.com/material-components/material-web/commit/75058ca2be558ac19c35f3b56f6c211cefa4027a))
* **progress:** remove circular progress slots ([aea4d5e](https://github.com/material-components/material-web/commit/aea4d5e4fd60b061183c2f8219b7ece5cc581372))
* **progress:** remove circular progress will-change CSS ([0f7e881](https://github.com/material-components/material-web/commit/0f7e881ee7612951cccaf360d49c51e3c965f3d8))
* **progress:** rename `progress` property to `value` ([a2b4f61](https://github.com/material-components/material-web/commit/a2b4f6152d7b284f291e494f120aad98c54dbb16))
* **progress:** squash linearprogress and circular progress into progress ([15df1d5](https://github.com/material-components/material-web/commit/15df1d5f1a82dd508b44cf8988c46ad4013db491))
* **progress:** update circular demos ([c1aac11](https://github.com/material-components/material-web/commit/c1aac1174c1da3022e8447c494b006f2d3d49f86))
* rename "lib" directory to "internal" ([6ec3f06](https://github.com/material-components/material-web/commit/6ec3f06429b2cd54382780ee74bb4bcf0ed0b5b6))
* **textfield:** rename container-padding-horizontal token ([447886d](https://github.com/material-components/material-web/commit/447886da2e5c648837704a3fc7a4552b5ba6e80a))
* **textfield:** rename container-padding-vertical tokens ([86aba33](https://github.com/material-components/material-web/commit/86aba33dea126463fe51498196b844f2f41c807b))
* **textfield:** rename prefix/suffix padding tokens ([53966af](https://github.com/material-components/material-web/commit/53966af32da0d269b3e8d7cd74102e168dcede53))
* **textfield:** rename supporting-text-padding tokens ([4f37b44](https://github.com/material-components/material-web/commit/4f37b4474fbca2b8aa6b2ce1f06f832bf9e11fd9))


### Miscellaneous Chores

* update next version ([4596c4a](https://github.com/material-components/material-web/commit/4596c4a2bcb098093afed3cfcfd56dd23c73c35a))

## [1.0.0-pre.13](https://github.com/material-components/material-web/compare/v1.0.0-pre.12...v1.0.0-pre.13) (2023-07-10)


### ⚠ BREAKING CHANGES

* **segmentedbutton:** remove with-* token prefixes
* **button:** remove with-* prefix from tokens
* **dialog:** remove with-icon prefix from with-icon-icon-color and with-icon-icon-size
* **textfield:** remove autocomplete-specific features for now

### Features

* **field:** add supporting/error text logic ([b4b3e67](https://github.com/material-components/material-web/commit/b4b3e67ae6681210d38f5079ff876896f0c20fe2))


### Bug Fixes

* **button:** remove with-* prefix from tokens ([25be982](https://github.com/material-components/material-web/commit/25be9825685df91a6fc3e66c2dd7c9537a0a7829))
* **dialog:** fire a change event when using arrow keys. ([65d31a6](https://github.com/material-components/material-web/commit/65d31a68c1c5904ebd258f00d531b6d46f31461a))
* **dialog:** fix two close icons in demo ([dc0ac97](https://github.com/material-components/material-web/commit/dc0ac971ac52b9d47edcb1ce722d7fd8ec94f3e1))
* **dialog:** remove with-icon prefix from with-icon-icon-color and with-icon-icon-size ([1893e08](https://github.com/material-components/material-web/commit/1893e08f545606d6e3112d25913bf4d52d0d4bb3))
* **dialog:** use dialog-action and dialog-focus in demo ([332836c](https://github.com/material-components/material-web/commit/332836cacb5ad47af9561579753e040a8ba42a16))
* **segmentedbutton:** remove with-* token prefixes ([cc786d1](https://github.com/material-components/material-web/commit/cc786d1f73950b324549392218177f3eb30a4a0f))
* supported tokens were not being verified ([2922914](https://github.com/material-components/material-web/commit/292291426385c5114664c7759b095823ec43f549))
* **tab:** add closure conformance types ([d80b7b5](https://github.com/material-components/material-web/commit/d80b7b55e92650eacc3aa31bdf343aba7c7196b7))
* **textfield:** make label strict string type ([6762b00](https://github.com/material-components/material-web/commit/6762b0058871e2502626dc842a03efba047f3e31))
* **textfield:** remove autocomplete-specific features for now ([8fee0a7](https://github.com/material-components/material-web/commit/8fee0a7ebd3081730d556488ff29fc5e2d416143))


### Miscellaneous Chores

* update next version ([b1077d8](https://github.com/material-components/material-web/commit/b1077d856bf8ec710b19c3027a030f9c63d75f37))

## [1.0.0-pre.12](https://github.com/material-components/material-web/compare/v1.0.0-pre.11...v1.0.0-pre.12) (2023-06-28)


### ⚠ BREAKING CHANGES

* **button:** remove unnecessary property preventClickDefault
* **slider:** change compound attribute names to kebab-case
* **iconbutton:** rename attribute flipiconinrtl to flip-icon-in-rtl
* **menu:** rename typeaheadBufferDelay and list-tab-index for consistency
* **select:** change compound attribute names to kebab-case
* **dialog:** change compound attribute names to kebab-case
* **list:** change compound attribute names to kebab-case
* **field:** change compound attribute names to kebab-case
* **button:** normalize compound properties to have kebab-cased attributes
* **textfield:** compound properties should have kebab-case attributes
* **tabs:** change compound attribute names to kebab case
* **switch:** change showonlyselectedicon to show-only-selected-icon

### Features

* **chips:** add high contrast support ([950cd4f](https://github.com/material-components/material-web/commit/950cd4ffc3efcb3a9e4a0d0c16ea97324d8ac69f))
* **dialog:** redispatch the native cancel event ([826262f](https://github.com/material-components/material-web/commit/826262fb727c65f787a913ae41adb8c0612af542)), closes [#1583](https://github.com/material-components/material-web/issues/1583)
* **fab:** add label only mode ([0fd4f45](https://github.com/material-components/material-web/commit/0fd4f45241cb67ae96e994b655ec95a9f022368a))
* **fab:** set aria hidden on the icon slot if element has aria-label or label ([fb4d9c8](https://github.com/material-components/material-web/commit/fb4d9c8008e863f48feea91ef1f5b4c3c004dc3c))
* **list,menu:** expose activate next and prev items ([30937ac](https://github.com/material-components/material-web/commit/30937acd18cba9376ea2745b6dfc4099ddbaeae3))


### Bug Fixes

* **button:** normalize compound properties to have kebab-cased attributes ([1a6fc29](https://github.com/material-components/material-web/commit/1a6fc291745f827dd055c9ac84ec432b09bcc071))
* **button:** remove unnecessary property preventClickDefault ([9244524](https://github.com/material-components/material-web/commit/9244524471093a9727750a964d1ad1436737d22f))
* **chips:** incorrect input leading icon color ([b13271b](https://github.com/material-components/material-web/commit/b13271b785224408173e0361bb91c929cab11e41))
* **chips:** incorrect rtl up/down behavior and add unit tests ([2cd235d](https://github.com/material-components/material-web/commit/2cd235dcb4e65fb593197aaf43b839cb326a2524))
* **dialog:** change compound attribute names to kebab-case ([82d17ca](https://github.com/material-components/material-web/commit/82d17ca172f009599f6863e9109bb7cbb0d68be5))
* **dialog:** focus before animation to fix a11y ([61e5e87](https://github.com/material-components/material-web/commit/61e5e87106d09fd43ae82828f6645e0444ae1b10))
* **field:** change compound attribute names to kebab-case ([2937aef](https://github.com/material-components/material-web/commit/2937aefa23c8b050b5c9f66b9b29432dae87be09))
* **iconbutton:** rename attribute flipiconinrtl to flip-icon-in-rtl ([a5e4354](https://github.com/material-components/material-web/commit/a5e4354ed64e646b24b2f1a0ea1fe36807ae490a))
* **labs:** compound properties should have kebab-case attributes ([28f897b](https://github.com/material-components/material-web/commit/28f897b5ea2d9a49d9754cd34d56720f79770bfc))
* **list:** change compound attribute names to kebab-case ([0e3fe72](https://github.com/material-components/material-web/commit/0e3fe72f8f69413085170291e1f4a50607e3b5ca))
* **menu:** close menu when escape is pressed on list root ([d5035db](https://github.com/material-components/material-web/commit/d5035db0c42d3e80f4ac61710109059a469d4666))
* **menu:** rename typeaheadBufferDelay and list-tab-index for consistency ([3f22ed0](https://github.com/material-components/material-web/commit/3f22ed039120b39563d2566e0442f45867312151))
* **repo:** remove "." from workspace config ([d436c8f](https://github.com/material-components/material-web/commit/d436c8fe5e31494654e2875215b7c0e52ae0ee91))
* **select:** change compound attribute names to kebab-case ([224a73b](https://github.com/material-components/material-web/commit/224a73b0387160c9810899d55f647e8b1da9fc48))
* **select:** fixed menu select not 100% window width ([a968759](https://github.com/material-components/material-web/commit/a968759b2747404ef0625f2c6d34e36899a599f9))
* **slider:** change compound attribute names to kebab-case ([83d9ede](https://github.com/material-components/material-web/commit/83d9edea79c08fb068f04fe6410273e12ae26387))
* **switch:** change showonlyselectedicon to show-only-selected-icon ([a8e489e](https://github.com/material-components/material-web/commit/a8e489e2d8c26cd35849b3f5d94ff7f58ea7016f))
* **tabs:** change compound attribute names to kebab case ([a9d030a](https://github.com/material-components/material-web/commit/a9d030ad4252d3a14738b24a60eec060824b4d1c))
* **textfield:** compound properties should have kebab-case attributes ([34dfcb4](https://github.com/material-components/material-web/commit/34dfcb4db1657db0fc13f23a5014fef234795a46))
* wireit sass watch memory leak ([8b1507e](https://github.com/material-components/material-web/commit/8b1507e0b73298b02a8ce6d2023d8a82d305d25d))


### Miscellaneous Chores

* update next version ([399fa07](https://github.com/material-components/material-web/commit/399fa07eacc80678d522896cdc7161dffbe4e214))
* update next version ([7dd2f3d](https://github.com/material-components/material-web/commit/7dd2f3d91ca548b2f5819c4b02fe24aded147a1b))

## [1.0.0-pre.11](https://github.com/material-components/material-web/compare/v1.0.0-pre.10...v1.0.0-pre.11) (2023-06-16)


### Features

* **chips:** add basic chip set component ([919a9d3](https://github.com/material-components/material-web/commit/919a9d3e9152dcdbb9be09c7f898dcc5168da543))
* **chips:** add multi-action chip navigation ([2444734](https://github.com/material-components/material-web/commit/24447343a5fa240967ea32a53f625da173cb9557))
* **chips:** add scrolling chip set example ([938bf38](https://github.com/material-components/material-web/commit/938bf384a488addf0acf576cf6e2b3556b80e2ff))
* **chips:** add single select filter chip set ([f8bb2f1](https://github.com/material-components/material-web/commit/f8bb2f18f0141f1e2d4ef5ca0b18fc569fb6276f))
* **list:** expose list item role ([2be1b78](https://github.com/material-components/material-web/commit/2be1b7824159760c91f577cea68905b3791a2831))


### Bug Fixes

* **chips:** add aria grid/listbox models to chip set ([fcdb126](https://github.com/material-components/material-web/commit/fcdb126f2fcccf696e199e617c5df3f696e79c4b))
* **chips:** misaligned trailing action ripple ([9c0336a](https://github.com/material-components/material-web/commit/9c0336aa12405bd3a926109d2ae29a418bb97e03))
* **chips:** remove selected event from input chips ([a33fcbb](https://github.com/material-components/material-web/commit/a33fcbb3771fe1f77664f501aa25d76e292db099))
* **slider:** default values to between min and max to better match native input ([2ef3606](https://github.com/material-components/material-web/commit/2ef3606bfe66fd700d803812b524b95c22ea4028))
* **slider:** fix slider focus ring inheritance weakness ([e44c903](https://github.com/material-components/material-web/commit/e44c903484d1beb351dfc5ff9e9ea653cc35f6ba))
* **testing:** use sys-color-* theming for dark mode tests ([b1172d8](https://github.com/material-components/material-web/commit/b1172d8470c33124556b71c93ba84b7b3b906dcf))


### Miscellaneous Chores

* update next version ([3d7612e](https://github.com/material-components/material-web/commit/3d7612e7617e1496641ada9ce7a97d03ac5a1842))

## [1.0.0-pre.10](https://github.com/material-components/material-web/compare/v1.0.0-pre.9...v1.0.0-pre.10) (2023-06-05)


### ⚠ BREAKING CHANGES

* **ripple:** Remove ripple directives and attach like focus rings (parent, `for` attribute, or with `.attach()`
* **all:** Remove any *-focus-state-layer-* custom properties (they don't do anything)
* **ripple:** Set `border-radius: 50%` and remove `unbounded` attribute

### Features

* add labs and internal folders for non-client code ([4b0c98c](https://github.com/material-components/material-web/commit/4b0c98c1aaf1166c1d12734097812b123e48da4e))
* **button:** adds `type` property to support form submit and reset ([545ce0d](https://github.com/material-components/material-web/commit/545ce0d8959ae408dd3d84ae459d7e994532cee7))
* **ripple:** add semantic and imperative attaching ([d65327d](https://github.com/material-components/material-web/commit/d65327d21b6e7f930eb45a9a40f177a6e2de2da2))
* **slider:** add full form association support ([ae70f1e](https://github.com/material-components/material-web/commit/ae70f1ea05f1f93b482f37dc2a94a5ca5c99d83a))
* **textfield:** add form association support ([e842f79](https://github.com/material-components/material-web/commit/e842f793115b3b65a650d9cb49caf02575a69a91))


### Bug Fixes

* **all:** remove focus state layer tokens ([933fc2e](https://github.com/material-components/material-web/commit/933fc2e0131393e96883ff21fb7475ecd7e45ed7))
* **focus:** split attachable logic into separate controller ([fbd680a](https://github.com/material-components/material-web/commit/fbd680a9fe7d6021f668716f746a080b6e2e8f30))
* **radio:** checked styles not displaying ([8fb5cd8](https://github.com/material-components/material-web/commit/8fb5cd8ae8221a9362cb80edc92b1b5cc0b2ab55)), closes [#4347](https://github.com/material-components/material-web/issues/4347)
* **ripple:** remove ripple directive ([33daf19](https://github.com/material-components/material-web/commit/33daf19c73ae1599a10286dada80edf288b52011))
* **ripple:** remove unbounded ([b69e242](https://github.com/material-components/material-web/commit/b69e24241e490ca3e83ca605b404cb20f74b02df))
* **ripple:** restrict manually controllable methods ([ea2f04a](https://github.com/material-components/material-web/commit/ea2f04a9e99c2c6d3020590321c23ee9ea8e0f5e))
* **ripple:** wrong start point for pressing unbounded ripples ([88b5cfe](https://github.com/material-components/material-web/commit/88b5cfeb21fcacc49f745dde00cfef459a4b5df6))
* **select:** inherit width of the host ([086565c](https://github.com/material-components/material-web/commit/086565cc8c0e6463a6be60162a22014955b23adb))
* **slider:** improve step support for non-integer values and stepping from min ([68c2721](https://github.com/material-components/material-web/commit/68c27212a12d3082a73029e63f24daf4eb6435d7))
* **slider:** prevent lower handle moving beyond upper and visa versa ([f9da935](https://github.com/material-components/material-web/commit/f9da93553bd64e7e8475f8acb8ee12206af12ac4))
* **slider:** renames `withTickMarks` to `tickmarks` and `withLabel` to `labeled` ([0e94e28](https://github.com/material-components/material-web/commit/0e94e286568492d9917bb1594c9cc1ebbb25d2f8))
* **ssr:** make "for" attribute watcher SSR compatible ([f47bdc3](https://github.com/material-components/material-web/commit/f47bdc39258fe4ba38a4cdebe1810e2385f72811))


### Miscellaneous Chores

* update next version ([25ee94b](https://github.com/material-components/material-web/commit/25ee94b1a7f95374ec5e27dfcf9da85a0ffb71e9))

## [1.0.0-pre.9](https://github.com/material-components/material-web/compare/v1.0.0-pre.8...v1.0.0-pre.9) (2023-05-25)


### ⚠ BREAKING CHANGES

* **ripple:** Use `border-radius` instead of `--md-ripple-shape`
* **focus:** inward focus rings must be specified with `inward` rather than a negative offset.
* **textfield:** Explicit "defaultValue" has been removed. Set the 'value' attribute to communicate a default value for resetting (similar to native <input>)
* **iconbutton:** font icons require using <md-icon> directly

### Features

* **checkbox:** add full form association support ([a61f79c](https://github.com/material-components/material-web/commit/a61f79ceb2a169ea8397132505a1ad61ffd84bc8))
* **chips:** add input chips ([d029b63](https://github.com/material-components/material-web/commit/d029b634c7392947f4edfa27f6218be486447de5))
* **chips:** add removable filter chips ([748d70e](https://github.com/material-components/material-web/commit/748d70eceffd6879329435621d65a415a94c8120))
* **iconbutton:** add disabled container opacity tokens ([d84d48c](https://github.com/material-components/material-web/commit/d84d48c2992187788ff54965433b96b21338c649))
* **iconbutton:** add disabled-icon-opacity token ([7403ce1](https://github.com/material-components/material-web/commit/7403ce1a9ebde15efebb5172bbdf22fe2b83b2e1))
* **listitem:** add noninteractive to list item ([57f7ae2](https://github.com/material-components/material-web/commit/57f7ae23303f5bf1fae4618d934582b1954e3a1f))
* **radio:** add full form association support ([9dc8613](https://github.com/material-components/material-web/commit/9dc86130671ad9d6151f397be4d5ea53212be515))
* **slider:** adds explicit multi-value support via range=true, valueStart, valueEnd ([7ab37e4](https://github.com/material-components/material-web/commit/7ab37e4bff51498e83c7d4f7c8f2c19d9719e37b))
* **switch:** add disabled handle opacity tokens ([c623c94](https://github.com/material-components/material-web/commit/c623c941df5b0492fec82270c07ba41fd7c6192d))
* **switch:** add disabled icon opacity tokens ([61550d2](https://github.com/material-components/material-web/commit/61550d2baa512034d860ab44941bfb27a2f88109))
* **switch:** add disabled track tokens ([a2045f5](https://github.com/material-components/material-web/commit/a2045f54440641df5c580ae3ec81f5083d729f2c))
* **switch:** add full form association support ([921a905](https://github.com/material-components/material-web/commit/921a905758d72f9c016eb3075cd42798d4d60d08))
* **tabs:** adds tabs and tab element ([cbb24df](https://github.com/material-components/material-web/commit/cbb24dfbc3e30ff05040e77dd0564d0c9b4b56aa))
* **tabs:** improves support for dynamically adding/removing tabs ([dd5f3f0](https://github.com/material-components/material-web/commit/dd5f3f07a4dc1bb963495fe2197933dc7185c3a1))


### Bug Fixes

* **button:** theme mixin not validating ([c566a64](https://github.com/material-components/material-web/commit/c566a64ef79daec2e6de64fdc91aa1962834b322))
* **chips:** add touch target ([55c9701](https://github.com/material-components/material-web/commit/55c9701d8c8428f846e75b70bdaa379cc3dfdf5d))
* **chips:** incorrect shape custom property names ([6fa8243](https://github.com/material-components/material-web/commit/6fa8243439dced22e4a9bafbb035f68c1e76113a))
* **demo:** fix demos in internal catalog and fix some broken stories in catalog ([2c5e2b9](https://github.com/material-components/material-web/commit/2c5e2b96c29866e24f84d108699cb6c3d60887ae))
* **focus:** corrected outward/inward animations ([26d69c2](https://github.com/material-components/material-web/commit/26d69c271eef5b5a7c57c94041c5aad61c1a3e54))
* formAssociated being stripped from closure ([c1ba0fb](https://github.com/material-components/material-web/commit/c1ba0fb3b60e8c516ff1eec52c1b42f2ab33e7aa))
* **ripple:** remove shape token and will-change ([a6c988b](https://github.com/material-components/material-web/commit/a6c988beddccf6101ab7ba43ed392f30bb58eb57))
* **switch:** add missing tokens ([b1e9c4a](https://github.com/material-components/material-web/commit/b1e9c4abb3123714469d271c0446ee542f7944fa))
* **tabs:** adds a11y roles for tablist/tab ([0da80a0](https://github.com/material-components/material-web/commit/0da80a01d2a8cfce6d27bb0151f5228b84110bd8))
* **tabs:** high contrast and reduced motion styling; improve tab marshaling ([6116c34](https://github.com/material-components/material-web/commit/6116c347e9b21d8147a982a0cf33382d132cccb0))
* **textfield:** remove defaultValue ([2317c5a](https://github.com/material-components/material-web/commit/2317c5af63c56ccdc4aaf5b3f4ea94860e50e987))


### Miscellaneous Chores

* update next version ([8d31bd9](https://github.com/material-components/material-web/commit/8d31bd9bb95f68784bc7e6a47832df18bd8052ab))


### Code Refactoring

* **iconbutton:** remove &lt;md-icon&gt; ([ec47f9b](https://github.com/material-components/material-web/commit/ec47f9bcc4898fb1af783c61c4d810222dadc0a4))

## [1.0.0-pre.8](https://github.com/material-components/material-web/compare/v1.0.0-pre.7...v1.0.0-pre.8) (2023-05-08)


### Features

* **focus:** improve usability ([34d8db0](https://github.com/material-components/material-web/commit/34d8db09aa196507fca73c452b0bedc864bc2ccd))


### Bug Fixes

* **checkbox:** incorrect logical shape var names ([c2ca4f8](https://github.com/material-components/material-web/commit/c2ca4f8795b1a3f7f489bed02431a66ba13ea3ba))
* **checkbox:** support logical shapes ([e62b16b](https://github.com/material-components/material-web/commit/e62b16b9a60402c92f732fa4d744fe3602c380cc))
* **chips:** incorrect shape custom property names ([7ce0e25](https://github.com/material-components/material-web/commit/7ce0e256b2432f3a5f696d75fa64010786bd79d7))
* **focus:** control not working when `for` reflects as empty ([f83db36](https://github.com/material-components/material-web/commit/f83db369c22dba754733bc605394f24a6aa87641))
* **focus:** update focus-ring tokens ([5934de0](https://github.com/material-components/material-web/commit/5934de06037203b01dc7dd532abe2ee89fec109a))
* **listitem:** hide android tap color since we have ripple ([0d3d032](https://github.com/material-components/material-web/commit/0d3d032a4c0869346f06b2182c29d59ea7b46cde))
* **menu:** fix submenu closing when already opened and all menus closing when hovering over menuitem ([f6d72f9](https://github.com/material-components/material-web/commit/f6d72f9c3ff141389f5116a95e6393e410644978))
* **ripple:** ensure ripple occurs when a keyboard generated click happens after a pointer click ([016b851](https://github.com/material-components/material-web/commit/016b8513e71bff04e2ec41a07f1d05cfd1d2762d))
* **slider:** disabled slider no longer displays pressed handle color when pressed ([4c229d9](https://github.com/material-components/material-web/commit/4c229d98727a0ebc6dad4cb5efc77a487dd2710d))
* **testing:** don't fire focus events twice ([04d3496](https://github.com/material-components/material-web/commit/04d3496a71e9fcc838eb496c3572d6ab57dd4503))
* **tokens:** bugs with component values() functions ([beb5f81](https://github.com/material-components/material-web/commit/beb5f816eaa5fe364d7563596f9bd82006d7c1d1))


### Miscellaneous Chores

* update next version ([2b961f3](https://github.com/material-components/material-web/commit/2b961f363ec91e3437a1a6a03285814460b53f95))
* update next version ([a27290a](https://github.com/material-components/material-web/commit/a27290addc3078fef008addcc6951a4616a4a981))
* update next version ([60afab6](https://github.com/material-components/material-web/commit/60afab619ed9a8dff567b9ae21261501ab9998e9))

## [1.0.0-pre.7](https://github.com/material-components/material-web/compare/v1.0.0-pre.6...v1.0.0-pre.7) (2023-04-24)


### ⚠ BREAKING CHANGES

* **button:** remove label property

### Features

* **aria:** add aria delegation ([e0bbe38](https://github.com/material-components/material-web/commit/e0bbe3850cd5c0d03c8da5697ffc0f723f238e6a))
* **chips:** add filter chips ([ae91366](https://github.com/material-components/material-web/commit/ae913666011ff1f885e9c044a6e842f60b2f906b))
* **circular-progress:** adds screenshot tests for circular-progress element ([e4a29c6](https://github.com/material-components/material-web/commit/e4a29c6e3150e44d2cdef17164dfd4cd3ef165dd))
* **linear-progress:** adds linear-progress element ([1c7fcf3](https://github.com/material-components/material-web/commit/1c7fcf39a502c2a1142de10efa0e59838dc8aba3))
* **linear-progress:** adds linear-progress screenshot tests ([212601d](https://github.com/material-components/material-web/commit/212601d4dfe132f6c3a9cb5e31f1de0d68fd8497))
* **select:** implement select ([9c202f5](https://github.com/material-components/material-web/commit/9c202f5546deac424d164cd1f657626e6741a350))


### Bug Fixes

* **actionelement:** remove actionelement ([b7af8ec](https://github.com/material-components/material-web/commit/b7af8ecda1ba6ecb248652250c299fc42a0de1bb))
* **button:** closure conformance issue ([9e23477](https://github.com/material-components/material-web/commit/9e234770b55e2e6901a1fa6e3ef2822f130c7083))
* **button:** fix template typo ([a44bc3a](https://github.com/material-components/material-web/commit/a44bc3a87c496ef808357e59d20b737ab1306dda))
* **button:** remove label property ([e398099](https://github.com/material-components/material-web/commit/e39809969f5ef14b997bc308b2d6553722ea0a75))
* **chips:** remove flat prefixes ([4fa83bf](https://github.com/material-components/material-web/commit/4fa83bf2c6a7e8eb031258c36b7862d0865bb04b))
* **dialog:** fixes [#4080](https://github.com/material-components/material-web/issues/4080): corrects dialog fullscreen height ([b3a6dac](https://github.com/material-components/material-web/commit/b3a6dacb0e857d53bf8734498c52826e309016e2))
* **elevation:** tidy up tokens and update roadmap ([301eb9a](https://github.com/material-components/material-web/commit/301eb9a18f3044a118fad36fcbccc00f8db1166c))
* **icon:** hide font ligature overflowing text ([2eb914e](https://github.com/material-components/material-web/commit/2eb914e8879fce6aba41aff19a51bdda8edad09f))
* **listitem:** border-radius token affects ripple and focus-ring ([c738f92](https://github.com/material-components/material-web/commit/c738f92144c7ca45382920f8358105a084f819f5))
* **menu,list:** new sys token mismatch between menu and list ([55df403](https://github.com/material-components/material-web/commit/55df403768941438f252c7b825b339340ff047d4))
* **menu:** submenus will open correctly on click ([9d7b291](https://github.com/material-components/material-web/commit/9d7b2910d721bf43fac80fa0c909d0ddbc951852))
* **navigationtab:** remove actionelement ([6da677f](https://github.com/material-components/material-web/commit/6da677fbef9567cc915033effac76704be0a40d2))
* remove [@aria](https://github.com/aria)Property decorator ([7b52c45](https://github.com/material-components/material-web/commit/7b52c4515fa048a772f7d598e948b1d62de11c03))
* remove role attribute from elements ([0a35ff5](https://github.com/material-components/material-web/commit/0a35ff504230aa1eae200afb6ea56bc3902f81c4))
* **segmentedbutton:** remove actionelement ([9442df8](https://github.com/material-components/material-web/commit/9442df8239113e674f08805639cb411b5336e6dd))
* **slider:** ensure scrolling is prevented on mobile browsers ([743451b](https://github.com/material-components/material-web/commit/743451b23fe906faeeb38ab0957996f22953caf6))
* **slider:** fixes [#4061](https://github.com/material-components/material-web/issues/4061) and reduce use of private custom properties ([9312a24](https://github.com/material-components/material-web/commit/9312a241d1a2e1ac01e85784e2aeffe00fdb829e))
* **slider:** fixes label focus and ranged handle dragging on Safari ([72b48da](https://github.com/material-components/material-web/commit/72b48da7cc3bc7dc619af3f668f95d68c6c634e5))
* **slider:** fixes ripple hover state after interaction on Firefox ([356d1bc](https://github.com/material-components/material-web/commit/356d1bc9f86604cdec8a1605dd2500d5985a19da))
* **ssr:** try to remove event listener calls on server ([5e1fe1c](https://github.com/material-components/material-web/commit/5e1fe1ccc71e15d2ded4540d846cd222be9d593e))
* **testing:** remove unnecessary type def ([5553da3](https://github.com/material-components/material-web/commit/5553da3a8bc79d93c1041c2ce074f7617d534dc3))


### Miscellaneous Chores

* update next version ([c9f2f7d](https://github.com/material-components/material-web/commit/c9f2f7ddd418345c2fdbeb07e9e33620524049ef))

## [1.0.0-pre.6](https://github.com/material-components/material-web/compare/v1.0.0-pre.5...v1.0.0-pre.6) (2023-04-10)


### ⚠ BREAKING CHANGES

* **elevation:** remove elevation surfaces
* **iconbutton:** rename selected aria label property, add documentation
* **elevation:** remove surface for tonal surface update
* **iconbutton:** combine button, link, and toggle variants into single components
* **button:** merge standard and link buttons

### Features

* **all:** use system typography tokens in components ([1bc73d2](https://github.com/material-components/material-web/commit/1bc73d2e489f12d5822f779733a2ff086ddaf778))
* **circular-progress:** adds circular-progress element ([3adab6a](https://github.com/material-components/material-web/commit/3adab6ae192489db5d5eb1dfd54552f69a0f0ad7))
* **focus:** export the keydown handler ([d7fdfda](https://github.com/material-components/material-web/commit/d7fdfda16237bc7a51c5ed8fb7a85c170ce3e25f))
* **focus:** implement focus ring animation ([85232d5](https://github.com/material-components/material-web/commit/85232d5916af04a2cdc96e059ad000cd5cc9515e))
* **iconbutton:** combine button, link, and toggle variants into single components ([0aa39e8](https://github.com/material-components/material-web/commit/0aa39e81532dc240890f2479f7ac592169ad3070))
* **iconbutton:** rename selected aria label property, add documentation ([5d3af37](https://github.com/material-components/material-web/commit/5d3af375f0d4a9123a2d5755d0279a2ac1c05165))
* **list,menu:** implement forced colors ([712aab3](https://github.com/material-components/material-web/commit/712aab3efc2b3102dc089833320b013c0b83f0ed))
* **tokens:** generate v0.170 ([2b9daea](https://github.com/material-components/material-web/commit/2b9daead7fbab0f7c355a33b10798f4193535ff7))
* **tokens:** generate v0.172 ([189ef06](https://github.com/material-components/material-web/commit/189ef06018f27d6cd772fd5f53b5e1fd9f0c10f7))
* **typography:** add system custom properties for typography ([bcfed09](https://github.com/material-components/material-web/commit/bcfed098f3a1f430fb9b2489390731fadd26e183))


### Bug Fixes

* **button:** incorrect theme custom properties ([2c1c80d](https://github.com/material-components/material-web/commit/2c1c80d3d65905da1071e240d352baa42508faa4)), closes [#4095](https://github.com/material-components/material-web/issues/4095)
* **button:** merge standard and link buttons ([acfdbb4](https://github.com/material-components/material-web/commit/acfdbb4f9273fe1a62430ec7a8857cca391674cb))
* **button:** tonal surface update ([50157e6](https://github.com/material-components/material-web/commit/50157e61a716b3a0f0a2ff0052eb65e4cb781eca))
* **checkbox:** tonal surface update ([7279356](https://github.com/material-components/material-web/commit/72793562e2aad1e284da021cdb5a94f765dfc903))
* **chips:** tonal surface update ([60ef2ab](https://github.com/material-components/material-web/commit/60ef2abbe7e3b9d28233c13d7de2cee87f73e073))
* complete tonal surface update ([7368e2a](https://github.com/material-components/material-web/commit/7368e2a2e23cd4509e27860ef513dd6fc832964a))
* **dialog:** tonal surface update ([c64f416](https://github.com/material-components/material-web/commit/c64f416ecaabb7f5867527b323abb00377cb99aa))
* **elevation:** remove elevation surfaces ([d801a5f](https://github.com/material-components/material-web/commit/d801a5f7cdb1cd43a832e2c11d33b97ef7e67ac0))
* **fab:** tonal surface update ([92a9071](https://github.com/material-components/material-web/commit/92a907142ce39811159c388034e7c3e27e3b6e22))
* **iconbutton:** tonal surface update ([52b45f1](https://github.com/material-components/material-web/commit/52b45f143545c831c04ed92adaba69f8da953ade))
* **list:** fix strong focus first keyboard nav ([6398186](https://github.com/material-components/material-web/commit/6398186d051f1b7fa309dad28a04d49ab2b4329e))
* **menu:** close menu on focusout and make it configurable ([3445b63](https://github.com/material-components/material-web/commit/3445b631febe5d4ab93c45c3ebc1cc35177649cc))
* **menu:** properly implement selected state ([bfa1bec](https://github.com/material-components/material-web/commit/bfa1bec320b6a73f4a4a89e508223e873920e3ac))
* **menu:** tonal surface update ([7ccc21e](https://github.com/material-components/material-web/commit/7ccc21e0d2674b8aa16027d1c008fe73885b4530))
* **navigationbar:** tonal surface update ([ebe666e](https://github.com/material-components/material-web/commit/ebe666eb6ad1298aab7c26d7c7fd1d8cc0c1e1e2))
* **navigationbar:** tonal surface update ([a5fe8f3](https://github.com/material-components/material-web/commit/a5fe8f30375a56d49b94287bfb3199b0913febb7))
* **navigationdrawer:** tonal surface update ([4f9df51](https://github.com/material-components/material-web/commit/4f9df513ddbe15219044444b9d94657823570c90))
* **radio:** tonal surface update ([b5065a6](https://github.com/material-components/material-web/commit/b5065a68a8c3d02fe8a864f14dd6f573023ca1dc))
* **ripple:** tonal surface update ([f08a9db](https://github.com/material-components/material-web/commit/f08a9db3d8257ceb3202a85fcf0e6c3d50ea8bdb))
* **slider:** tonal surface update ([9a020b9](https://github.com/material-components/material-web/commit/9a020b96e8f786faad51fe9217984a664954a596))
* **switch:** tonal surface update ([6ccc759](https://github.com/material-components/material-web/commit/6ccc7595dc4b0cfa956e278ca1901f31dbcade89))
* **textfield:** tonal surface update ([f15d8ca](https://github.com/material-components/material-web/commit/f15d8ca2faf132a3ab1bf5b67efc9653ffa7ce1a))


### Miscellaneous Chores

* **elevation:** remove surface for tonal surface update ([d12ed3e](https://github.com/material-components/material-web/commit/d12ed3e4e3352b4dc548c4e2a34cdaee85b4cb14))
* update next version ([fba9672](https://github.com/material-components/material-web/commit/fba9672fd997c08de6ee64d1386e049c16d99438))
* update next version ([58b4df3](https://github.com/material-components/material-web/commit/58b4df3c4f611db6123eb2e6d087012ccddb1afd))
* update next version ([a878783](https://github.com/material-components/material-web/commit/a878783d8d61dff6293556e67ee3e6cbd435b73f))

## [1.0.0-pre.5](https://github.com/material-components/material-web/compare/v1.0.0-pre.4...v1.0.0-pre.5) (2023-03-21)


### ⚠ BREAKING CHANGES

* remove old menusurface, autocomplete, and tokens v0.160
* **fab:** remove disabled state
* **iconbutton:** properly size iconbutton to 40x40
* **focus:** refactor focus ring to better match component shape

### Features

* **button:** add label slot ([24298e6](https://github.com/material-components/material-web/commit/24298e696cb76c58a1482e770cc5548fc7c78cbd))
* **chips:** add basic assist chip ([27762d8](https://github.com/material-components/material-web/commit/27762d855ce88bf2400082ed4c1f1d2c7d03580a))
* **chips:** add disabled styles ([324e856](https://github.com/material-components/material-web/commit/324e8568c269271e014c130acd4f8b31aa0efdfc))
* **chips:** add focus ring ([9eb861f](https://github.com/material-components/material-web/commit/9eb861fc835b81511652c6fd2d47aebc9854176d))
* **chips:** add icon support ([7e02a15](https://github.com/material-components/material-web/commit/7e02a15ad89df143495b07d1d03f74f5f1077495))
* **chips:** add link chips ([06bdb86](https://github.com/material-components/material-web/commit/06bdb86803a96e680c35132841b73879e6106434))
* **chips:** add ripple ([9582e00](https://github.com/material-components/material-web/commit/9582e006c0fb23250a33018fffc20ca01aa2ade4))
* **chips:** add suggestion chips ([f3fe55e](https://github.com/material-components/material-web/commit/f3fe55ec2bcc7dd3ae57f62b3dd68fbc951e747c))
* **field,menu:** create a surface client rect api for positioning ([533ae6c](https://github.com/material-components/material-web/commit/533ae6c999558cbc8e03b90f9dd59990cac84784))
* **icon:** add icon documentation ([912d66e](https://github.com/material-components/material-web/commit/912d66ea3058a1cf849e33024a254e6e21d62a65))
* **list-item:** expose / override host focus ([d005d72](https://github.com/material-components/material-web/commit/d005d7265e1d980d748c8d7fe3f7f6d9d848cbb2))
* **list:** add spacing tokens and inherit min-width ([35147b2](https://github.com/material-components/material-web/commit/35147b25b0687ae33c86dc81374d1243e697baa6))
* **menu:** prepare menu to support md-select ([193b220](https://github.com/material-components/material-web/commit/193b220a73718226ec15171197a393008f040caa))


### Bug Fixes

* **button:** enable separate color and opacity tokens ([f90aab2](https://github.com/material-components/material-web/commit/f90aab27b4fa497ab6d320b7caa4c1e569d7d00b))
* **button:** text button background not transparent ([6700947](https://github.com/material-components/material-web/commit/67009478065f7ac61ad83df12bbcce60bebfa7b6))
* **dialog:** incorrect elevation layering ([028e44e](https://github.com/material-components/material-web/commit/028e44e8c932d2d7d506a6dccbfdc7957c888d12))
* **elevation:** disable pointer-events ([6155278](https://github.com/material-components/material-web/commit/615527886b122b6532e9afdbe96ec4768c2494de))
* **fab:** remove disabled state ([c368e7d](https://github.com/material-components/material-web/commit/c368e7d633ae1bbb560cb169293344a00e6c012f)), closes [#4045](https://github.com/material-components/material-web/issues/4045)
* **focus:** refactor focus ring to better match component shape ([61ff279](https://github.com/material-components/material-web/commit/61ff27910eae0e0401824d03601ec252489aa83e))
* **iconbutton:** allow icon button to be asymmetrically sized ([8a37ce2](https://github.com/material-components/material-web/commit/8a37ce2e00e7a0611819f8dadc2ea775b6a047dc))
* **iconbutton:** properly size iconbutton to 40x40 ([567d340](https://github.com/material-components/material-web/commit/567d3406b07ab1655924a96f52b6877aa9daff08))
* **menu:** flatten submenu slot query ([ddac76e](https://github.com/material-components/material-web/commit/ddac76e3bce71cc42fe74d4c65a1418a321aeecb))
* **menu:** incorrect elevation ([427d33d](https://github.com/material-components/material-web/commit/427d33d979a4b41229970e9888a287160b714a64))
* **testing:** token tests not working in Safari Chrome ([618a505](https://github.com/material-components/material-web/commit/618a505f574099519b66f0f28d231657041b5686))
* **tokens:** add override files for all tokens ([2623c1d](https://github.com/material-components/material-web/commit/2623c1dd4e5d7a557195edfa33709b7db8993451))


### Miscellaneous Chores

* remove old menusurface, autocomplete, and tokens v0.160 ([878b914](https://github.com/material-components/material-web/commit/878b9143e790702a524b7e07b81262748e2d3818))
* update next version ([405ec53](https://github.com/material-components/material-web/commit/405ec5399ccf2f34f956a7df06a2f39e806621a6))

## [1.0.0-pre.4](https://github.com/material-components/material-web/compare/v1.0.0-pre.3...v1.0.0-pre.4) (2023-03-08)


### ⚠ BREAKING CHANGES

* **icon,iconbutton,list:** use material symbols for icons

### Features

* **field:** add resizability ([fd605d5](https://github.com/material-components/material-web/commit/fd605d537ce3584c97ffca375e019615c26b748b))
* **tokens:** generate tokens v0.161 ([e2cd832](https://github.com/material-components/material-web/commit/e2cd8327b60691f093fd389f7a259d217f1d9b89))


### Bug Fixes

* **all:** update non-menu components to v0.161 ([828d7ae](https://github.com/material-components/material-web/commit/828d7aeb4d3144e3a0229cc4fa81e7c7135c4760))
* **icon,iconbutton,list:** use material symbols for icons ([232982e](https://github.com/material-components/material-web/commit/232982ef034872968924dbb5620f59352c4028c2))
* **icon:** mark icon and icon button as beta ([ff3d379](https://github.com/material-components/material-web/commit/ff3d379bc874be338c5aa8a9afa1593a879fdefa))
* **text-field:** apply suffix-color and icon size tokens ([a969fda](https://github.com/material-components/material-web/commit/a969fdadb61e2d3ffedd17ddbc9ebe019d5f054c))
* **text-field:** remove indicator expansion animation ([d755d10](https://github.com/material-components/material-web/commit/d755d107fa487e9a06c4279dbd76a1074437e369))
* **textfield:** outlined label jumping horizontally with leading icon ([c98f5e0](https://github.com/material-components/material-web/commit/c98f5e017d2bb74caaf88c94c2866e155b61c98e))
* update license year and holder ([510a867](https://github.com/material-components/material-web/commit/510a867f0d4e95663a6e311b368bc879fecb8361)), closes [#3073](https://github.com/material-components/material-web/issues/3073)


### Miscellaneous Chores

* update next version ([a6176de](https://github.com/material-components/material-web/commit/a6176de68460c3e37aa74e1ffac5457eb093bba3))
* update next version ([367e76a](https://github.com/material-components/material-web/commit/367e76aecfae9e6e3cd99094fa021e77f2d7b80a))
* update next version ([9a36b3a](https://github.com/material-components/material-web/commit/9a36b3a9ae0c7d3181b66e36e6f27907c8565656))

## [1.0.0-pre.3](https://github.com/material-components/material-web/compare/v1.0.0-pre.2...v1.0.0-pre.3) (2023-02-22)


### ⚠ BREAKING CHANGES

* **slider:** fix ripple end hover state when leaving handle
* **controller:** fix label activation utility on slotted elements
* **dialog:** fix exception when opening when compiled with advanced closure settings
* **ripple:** rename press methods to event handlers
* **ripple:** rename focus methods to event handlers
* **ripple:** rename hover methods to event handlers
* **navigation,badge:** migrate to `-text-type` tokens
* **fab:** move to `label-text-type` token, shape corners
* **segementedbutton:** move to `label-text-type` token
* **list,menu:** move to `-text-type` tokens
* **dialog:** migrate to `header-type` and `supporting-text-type` tokens
* **button:** replace label-text-* tokens with label-text-type
* **field & dependents:** convert to use text-type tokens
* **all:** checkbox container-width/height tokens have been renamed to container-size
* **ripple:** remove "state-layer" from token names
* **all:** use shape.resolve-tokens and remove shape.resolve-theme

### Features

* **shape, string-ext:** Allow shape corners to fall back to a single custom property ([1afd925](https://github.com/material-components/material-web/commit/1afd9259adacf4cdf429dd0648b82bd23b3cdad6))
* **slider:** adds slider element ([f0f5ae5](https://github.com/material-components/material-web/commit/f0f5ae57abee9ee5324bf628b31af091c0751b17))
* **tokens:** generate v0.160 ([20de321](https://github.com/material-components/material-web/commit/20de321c7449f100187de0663d074b34c03697f2))
* **typography:** implement resolve-tokens function to use `-text-type` ([1550e8e](https://github.com/material-components/material-web/commit/1550e8e60833687ea7cb059e25aa677e783f14a1))


### Bug Fixes

* **all:** update tokens to 0.160 ([9025af3](https://github.com/material-components/material-web/commit/9025af316a0cee7c710e01cedbc8ce58cdd8bcef))
* **all:** use shape.resolve-tokens and remove shape.resolve-theme ([44a8d74](https://github.com/material-components/material-web/commit/44a8d74f56bfe31a422b93675b4085e0dd4b8876))
* **button:** replace label-text-* tokens with label-text-type ([69f9a17](https://github.com/material-components/material-web/commit/69f9a17a12fa86e1e2ba04fc35ad9b9f138b68ad))
* **controller:** fix label activation utility on slotted elements ([8b58f98](https://github.com/material-components/material-web/commit/8b58f98a829fa93e2278ad041bf136cc9ed8b354))
* **dialog:** fix exception when opening when compiled with advanced closure settings ([c63a1d9](https://github.com/material-components/material-web/commit/c63a1d9caf82f906d19607e46070a0bf73010c66))
* **dialog:** migrate to `header-type` and `supporting-text-type` tokens ([66948a4](https://github.com/material-components/material-web/commit/66948a49011c30b072e645ba958a2a44ce218a8b))
* **docs:** fix documentation to show using `-type` tokens ([c955055](https://github.com/material-components/material-web/commit/c955055ae2b1582e467f3b0902281e1724efdf49))
* **fab:** move to `label-text-type` token, shape corners ([8c01aee](https://github.com/material-components/material-web/commit/8c01aeea08c750f3c25a60a0a2691c571f3a8996))
* **field & dependents:** convert to use text-type tokens ([cc5a7db](https://github.com/material-components/material-web/commit/cc5a7db27d4a2ee58eab1dcd59da59847b94344c))
* **list,menu:** move to `-text-type` tokens ([45a6d45](https://github.com/material-components/material-web/commit/45a6d45577b217148bc9d6e008c24710e4845b61))
* **navigation,badge:** migrate to `-text-type` tokens ([7b86677](https://github.com/material-components/material-web/commit/7b8667711a17cc9f8cf30e2d9fdef61dff6d0bb2))
* **ripple:** remove "state-layer" from token names ([ff84a66](https://github.com/material-components/material-web/commit/ff84a66f3effdd5291781321e11cbbd34001dd26))
* **ripple:** rename focus methods to event handlers ([6e97717](https://github.com/material-components/material-web/commit/6e977178c5bb41e47e24264c47b08b7b8d3b9833))
* **ripple:** rename hover methods to event handlers ([cde7ca0](https://github.com/material-components/material-web/commit/cde7ca0e3bbd0edaecf4dcea9226f258dae4070e))
* **ripple:** rename press methods to event handlers ([0cc7d29](https://github.com/material-components/material-web/commit/0cc7d2959a6aca83942cf37cb95bb0dbc395258b))
* **segementedbutton:** move to `label-text-type` token ([bd125fe](https://github.com/material-components/material-web/commit/bd125fe4562712da5ecc1b4abd559fd1e737f8cd))
* **slider:** fix ripple end hover state when leaving handle ([535d889](https://github.com/material-components/material-web/commit/535d8897758aa72bbff41ee5f7c552bec2b4042f))
* **slider:** use `label-label-text-type` font token ([ad889ea](https://github.com/material-components/material-web/commit/ad889ea31bb069418ab2a42d588bd99309809d0f))
* **testing:** convert test-table to use `-type` tokens ([2046401](https://github.com/material-components/material-web/commit/20464014bb0873253bcf8f14b0e950543292ce6d))
* **testing:** remove header-cell-text-tracking ([43ce8c1](https://github.com/material-components/material-web/commit/43ce8c1d31f118eacde8a8aa1a3e898af1dddc4c))
* **typograph:** remove typography resolver ([2a8ba18](https://github.com/material-components/material-web/commit/2a8ba183607035cceb8776dab030ec311471ebcc))


### Miscellaneous Chores

* update next version ([77b4864](https://github.com/material-components/material-web/commit/77b48640e5d53a04ba414de77af0ca22316cccd4))

## [1.0.0-pre.2](https://github.com/material-components/material-web/compare/v1.0.0-pre.1...v1.0.0-pre.2) (2023-02-06)


### ⚠ BREAKING CHANGES

* **iconbutton:** Make a few API improvements
* **textfield:** remove container-height token
* **iconbutton:** normalize toggle variant API with regular icon button
* **iconbutton:** remove icon properties, use slots instead

### Features

* **divider:** add divider component ([9431c16](https://github.com/material-components/material-web/commit/9431c1643140969e52ca3a065a9ec1c4fb299b3b))
* **menu,list:** expose menu theme mixins and remove divider ([e15c4b8](https://github.com/material-components/material-web/commit/e15c4b86d584cfda5dc850cb697bc9b9552e9536))
* **tokens:** generate tokens v0.152 ([c61f46c](https://github.com/material-components/material-web/commit/c61f46c618c38d45c49e85f809330d40e5de40d3))


### Bug Fixes

* **all:** remove `[@requirecss](https://github.com/requirecss)` comments ([80590ae](https://github.com/material-components/material-web/commit/80590ae88dab9944335e78862da048ff92fee99f))
* **forms:** fix form association for switch, checkbox, and radio, including label activation ([1ddba0c](https://github.com/material-components/material-web/commit/1ddba0ca3cfa7d9964ffd24a0e5aab488a83179e))
* **switch:** update to latest animations, and implement sizing tokens ([9e9bf84](https://github.com/material-components/material-web/commit/9e9bf845be82ce1753ffb0d3bf7fec7947f09428))


### Miscellaneous Chores

* update next version ([a539286](https://github.com/material-components/material-web/commit/a539286c3f5f34b7c2969b963b3859ed633a74ef))


### Code Refactoring

* **iconbutton:** Make a few API improvements ([c72e7fd](https://github.com/material-components/material-web/commit/c72e7fd6f74ecd257d9542f9ef1ec2a64e02b1bf))
* **iconbutton:** normalize toggle variant API with regular icon button ([31391eb](https://github.com/material-components/material-web/commit/31391eb610f987a3f66ca07722a8ebca6a0b0a78))
* **iconbutton:** remove icon properties, use slots instead ([36f1a1a](https://github.com/material-components/material-web/commit/36f1a1a0b34dba43d4a859a19d30070b9998ca9a))
* **textfield:** remove container-height token ([1d81416](https://github.com/material-components/material-web/commit/1d81416863a2682fc123b6219c155998db574da7))

## [1.0.0-pre.1](https://github.com/material-components/material-web/compare/v1.0.0-pre.0...v1.0.0-pre.1) (2023-01-09)


### ⚠ BREAKING CHANGES

* **button:** Remove icon property from Button, require slotted icons

### Bug Fixes

* **button:** remove icon property from Button, require slotted icons ([d3b517a](https://github.com/material-components/material-web/commit/d3b517ad0054b8d12ca7bc27e19ad40db987ba4b))
* **icon, iconbutton:** Cleanup styling ([12c9364](https://github.com/material-components/material-web/commit/12c93641a550c594561883943fa5556d1cc40ca7))
* **icon:** Remove fixed left-to-right direction to fix RTL styling ([5a27f05](https://github.com/material-components/material-web/commit/5a27f05cd7534d7c2118b8d205f78ab0eb307b94))
* **radio:** update motion to current spec ([95897b3](https://github.com/material-components/material-web/commit/95897b3e25ef3915c6047239b1794172822b1b35))


### Miscellaneous Chores

* update next version ([ea33cb8](https://github.com/material-components/material-web/commit/ea33cb81224eb46cde33201e331d59e07046f29a))

## [1.0.0-pre.0](https://github.com/material-components/material-web/compare/v0.1.0-alpha.2...v1.0.0-pre.0) (2023-01-09)


### ⚠ BREAKING CHANGES

* **focus-ring, button:** Button shape properties are now of the form `--md-text-button-container-shape-start-start`
* **formfield:** Removed Formfield. The <label> element can now be used, e.g. `<label>Checkbox <md-checkbox></md-checkbox></label>`.
* **checkbox:** Removed reducedTouchTarget. Instead, set the width and height on the checkbox.

### Features

* add _focus-ring.scss partial to expose theming the focus ring ([c47f800](https://github.com/material-components/material-web/commit/c47f8004ac14ac15b19a61e3fe373300c5312f5c))
* add filled-tonal-icon-button sass partial ([30d9c33](https://github.com/material-components/material-web/commit/30d9c33162b08a769ae452079b4911c9080c5c1a))
* add more detail to error message on sass color function. ([c293a8d](https://github.com/material-components/material-web/commit/c293a8dfffdbd73b6902bb9e27075c11f8415328))
* **all:** Implement stubs for lit-localize support ([e72ca03](https://github.com/material-components/material-web/commit/e72ca03799aad6fd688ba5888eda21a4f4f98367))
* **autocomplete:** Add base render functions ([c289678](https://github.com/material-components/material-web/commit/c28967839a834197714a143bc1f1f6852dd57cee))
* **autocomplete:** Add example in demo on how to filter items ([75d6b82](https://github.com/material-components/material-web/commit/75d6b82485a96f8d70f06f131c37742b55c19522))
* **autocomplete:** Add filled autocomplete theming api support ([ef9bdd1](https://github.com/material-components/material-web/commit/ef9bdd196629b15867bd9d9e481631e03393f8d4))
* **autocomplete:** Add keyboard support ([d2ea3ce](https://github.com/material-components/material-web/commit/d2ea3ce0b623801d36c306a2f1f6d803218bad2a))
* **autocomplete:** Add opening and closing upon interaction ([530b6d3](https://github.com/material-components/material-web/commit/530b6d336e5b9ecbe5b64b932e4c16e93037ac14))
* **autocomplete:** Create autocomplete item and connect action to fill value ([c3aa552](https://github.com/material-components/material-web/commit/c3aa5525c1cdd5975e0b2691e3ac532205683e84))
* **autocomplete:** Create MdAutocompleteList to unset min-width. ([e77d472](https://github.com/material-components/material-web/commit/e77d4726faacf3e7cde6f0d92be2fa7ee5e4611b))
* **autocomplete:** Create MdAutocompleteSurface to adjust width ([cc4603e](https://github.com/material-components/material-web/commit/cc4603e99e3adbbe2b386e07dc627a718bf741c4))
* **button:** Add outlines in high contrast mode (HCM) to Button ([9ec33ba](https://github.com/material-components/material-web/commit/9ec33ba879836bb68db367c6f0a75f76b620ca3f))
* **checkbox:** Checkbox now supports form submission and label activation by using FormController and setting formAssociated. ([7b84fca](https://github.com/material-components/material-web/commit/7b84fca5b810a56d473e36dd962b75f3777c6529))
* **checkbox:** refactor and simplify rendering/style logic ([27f7ea8](https://github.com/material-components/material-web/commit/27f7ea89cee0d1a31e50b81e5db994b97bba7748))
* **controller:** add label activation support to FormController ([4e3054b](https://github.com/material-components/material-web/commit/4e3054bab3a1fe5e462ab812ccc1895312a11176))
* **controller:** add stringConverter for empty reflecting attributes ([2a0d563](https://github.com/material-components/material-web/commit/2a0d563338aa84b8038a969f9f0245a245bd78ba))
* **elevation:** create md-elevation component ([9eb7bf0](https://github.com/material-components/material-web/commit/9eb7bf081fa365b853cfc7044c62ed05f969552a))
* **field:** add leading/trailing content styles ([dc7d949](https://github.com/material-components/material-web/commit/dc7d9494f7801634eed6e371e5da879b4f132c59))
* **focus-ring, button:** Match focus ring shape to button shape ([7fad3a5](https://github.com/material-components/material-web/commit/7fad3a56d9888f7d29fd096d683840d8d2217456))
* **form-field:** Added theme styles to form field ([17075f4](https://github.com/material-components/material-web/commit/17075f485544d186e82c1d93bd441a658f0ccf49))
* **icon-button:** Implement isRTL helper library, and refactor icon-button to use it. ([5dd43fa](https://github.com/material-components/material-web/commit/5dd43faffb15d3d386d717239ee9102988433938))
* **iconbutton:** Add internal `linkAttributes` ([10cf00b](https://github.com/material-components/material-web/commit/10cf00bde4250d171d621d9ec051503684677646))
* **icon:** Implement tokens for md-icon ([0327283](https://github.com/material-components/material-web/commit/0327283b7b0da6174a255b3e1434354ac360ab52))
* **list-item:** Added isActive() method to check active status and minor fixes to keyboard navigation ([9f410f6](https://github.com/material-components/material-web/commit/9f410f6248c177885166d1e79e85fc8ce2e72161))
* **list:** Add basic keyboard navigation to M3 list ([ee35bfe](https://github.com/material-components/material-web/commit/ee35bfe7f1aea803f0410a032d41a83026109d42))
* **list:** Add component styles to match spec layout ([a6ddbaa](https://github.com/material-components/material-web/commit/a6ddbaa48cd5aef32228100d9926bb117fb1c7e8))
* **list:** Add customizable `aria-label`/`role` attributes to list, and customizable `role` to list item. ([8f63406](https://github.com/material-components/material-web/commit/8f63406cdc55c0bb6d1edd6407fc954a10c8e02f))
* **list:** Add list elevation overlay and overlay color/opacity to theme API. ([ebb9a4b](https://github.com/material-components/material-web/commit/ebb9a4b360e0690a0c41eee5d198458a14490de5))
* **list:** Add listId property ([78f125d](https://github.com/material-components/material-web/commit/78f125dcbb9b8f664bada5fa8018d599b5dc0a34))
* **list:** Add ripple to M3 list ([4d292f4](https://github.com/material-components/material-web/commit/4d292f4cc63ce1b354d7ddc7f66a8da87a4751c9))
* **list:** Add support for aria active descendant, id ([d9b1deb](https://github.com/material-components/material-web/commit/d9b1deb2f8b3749cfe15f619b8fe40d867db915f))
* **list:** Add support for fetching list items. ([4b79baa](https://github.com/material-components/material-web/commit/4b79baa980388a07a6d6f4cfe5593b0be6949b80))
* **list:** Added aria-checked attribute support to list item. ([2c06c2e](https://github.com/material-components/material-web/commit/2c06c2ed9b35d76a30b75d198cdf41e3e3bb8663))
* **list:** Added avatar web component to list ([899a4e6](https://github.com/material-components/material-web/commit/899a4e6835ecb9d1afc9979ae9539b6b02a26771))
* **list:** Added focus ring to list item ([2d2b3bb](https://github.com/material-components/material-web/commit/2d2b3bbedabed59046e2b4cbcda7fa0f52b9365b))
* **list:** Added image web component to list ([4587cbc](https://github.com/material-components/material-web/commit/4587cbc33b975b42526bc7660a38f5470b6076ea))
* **list:** Added list divider web component ([d2a1b2e](https://github.com/material-components/material-web/commit/d2a1b2ea18724b117650f50a8f96b8238c14b9c7))
* **list:** Added options list to M3 list ([74704d7](https://github.com/material-components/material-web/commit/74704d7cf23fc80053171ae83076be9a3629e82a))
* **list:** Added soy template annotations for image classes slot ([c277252](https://github.com/material-components/material-web/commit/c27725234d3ceb64c8daaf8c87c1d4759997eee1))
* **list:** Added test harnesses to list ([bf29bc3](https://github.com/material-components/material-web/commit/bf29bc36e548b3b0ad4fbe7b844df4949e9f0af0))
* **list:** Added video web component to list ([261b6ef](https://github.com/material-components/material-web/commit/261b6efc0c56768abc233b48ca1a2591eeea0fcc))
* **list:** Created a separate style module for icon web component in list ([e64cdbe](https://github.com/material-components/material-web/commit/e64cdbeb35f530eee78d1bf15129af9881e49931))
* **menu:** Add `aria-label` support in menu, and set `role=menu/menuitem` for menu and menu item components. ([7e35820](https://github.com/material-components/material-web/commit/7e35820536608a24f60cd411860d4b0f05da6d31))
* **menu:** Add initial menu base component class. ([60c4a41](https://github.com/material-components/material-web/commit/60c4a413d38e0cb5d14caa48f03b5e09ab9c3e6a))
* **menu:** Add menu button component. This manages focus automatically on menu open, setting focus to menu item (rather than menu root) if the menu open originated from a keyboard event. ([a29ac8b](https://github.com/material-components/material-web/commit/a29ac8bebbf74b2239d431af629435979ebb9cdd))
* **menu:** Add menu foundation/adapter and Sass (forked from MDC). ([de29937](https://github.com/material-components/material-web/commit/de2993744d6f83850d0c80cf56a9ff245cbc4168))
* **menu:** Fix menu closing on menu item click. ([d37e23d](https://github.com/material-components/material-web/commit/d37e23de0dd24dc489c8cce58bf41c9b6be18f6b))
* **menu:** Implement menu theming API. Use menu surface/list/list item `theme()` mixins to style subcomponents. ([f305806](https://github.com/material-components/material-web/commit/f3058069559df80d29cdc807e2e0fdcf6eb3b9bd))
* **menusurface:** Add `flipMenuHorizontally` property, add unit tests. ([884c3a2](https://github.com/material-components/material-web/commit/884c3a204b0302434497945443008657ebaf0d7d))
* **menusurface:** Add menu surface theming API. ([5e70115](https://github.com/material-components/material-web/commit/5e7011559ac376616f18589faa64df8e42bd8c8b))
* **menusurface:** Add menusurface class (forked from MWC/MDC). ([5f51f26](https://github.com/material-components/material-web/commit/5f51f26bf9e4c0354a99ecdb5a4cb1786f21cb7f))
* **radio:** change SingleSelectionController to a ReactiveController ([b0e87c5](https://github.com/material-components/material-web/commit/b0e87c538acc7d6110e2c4bf3807829e5c128398))
* **ripple:** Create a ripple directive ([6746d0f](https://github.com/material-components/material-web/commit/6746d0f685734369d16f8a22ae24af2c659b6b78))
* **sass:** Added pick() function to map-ext ([10c506c](https://github.com/material-components/material-web/commit/10c506c7183d38e4b18e6b6c0ffe6a8994bcc064))
* **switch:** add ripple to switch ([4a8c333](https://github.com/material-components/material-web/commit/4a8c33362511c70da2a25322b4b445fa97a72d0e))
* **switch:** add warning for `handle-height` and `handle-width` which are not yet implmented. ([e2f3c28](https://github.com/material-components/material-web/commit/e2f3c28bbf4e0d6f36e7533769c1fdbc0da0475f))
* **switch:** added action-element to fire event on press. ([85e85b2](https://github.com/material-components/material-web/commit/85e85b21ba7bf2563ad41036a7170124949c8d82))
* **switch:** mark opacity tokens as hardcoded. ([ad1db85](https://github.com/material-components/material-web/commit/ad1db85d4f4bcc08f15c0a452a0a36470c29280b))
* **switch:** Switch now supports label activation by setting formAssociated. ([7473f46](https://github.com/material-components/material-web/commit/7473f4647d155b0680fde236d97f14fbfacc78d5))
* **switch:** use tokens to shape the focus ring ([ed58af1](https://github.com/material-components/material-web/commit/ed58af19c7540bdf950011a966e0fb5d9407cd00))
* **text-field:** add blur and jsdoc ([5241b76](https://github.com/material-components/material-web/commit/5241b76dcabfe4a0d9a1010d90aaed65e3875c04))
* **text-field:** add character counter ([1cc64f5](https://github.com/material-components/material-web/commit/1cc64f543a9e1284c126129c788d954f7ce2c9ed))
* **text-field:** add error text ([58848f6](https://github.com/material-components/material-web/commit/58848f61c94f8c20c941af0ead82ea461f34a0ef))
* **text-field:** add icons ([424596e](https://github.com/material-components/material-web/commit/424596edce10c6caa4e64446742343668a80f557))
* **text-field:** add min, max, and step ([c73b59c](https://github.com/material-components/material-web/commit/c73b59cea428bf1b59bf04c13704cd79bcce8703))
* **text-field:** add minLength and maxLength ([0c8a91f](https://github.com/material-components/material-web/commit/0c8a91fc8fa83076e467c6db25e5b024b31e560e))
* **text-field:** add native validation APIs ([e2e2c9d](https://github.com/material-components/material-web/commit/e2e2c9d8a58b2487ce33fe05da4cf0ae35ac7d69))
* **text-field:** add pattern ([810a9a4](https://github.com/material-components/material-web/commit/810a9a4101418abbd640ceafb5537d725a61af50))
* **text-field:** add placeholder color tokens ([b945f30](https://github.com/material-components/material-web/commit/b945f30e75fa58bc883048632dd03d68e0ea551c))
* **text-field:** add prefix and suffix ([8e68857](https://github.com/material-components/material-web/commit/8e688579d122eed0f9b8d95786828fc9c824de81))
* **text-field:** add selection APIs ([091a124](https://github.com/material-components/material-web/commit/091a124eafec6e8422bb622165380cd7e21d94a7))
* **text-field:** add SSR ariaLabelledBy property ([e0386ac](https://github.com/material-components/material-web/commit/e0386acda96de375486b93d87fac09b2b7ea9b34))
* **text-field:** add support for text-align: end ([bf3cb81](https://github.com/material-components/material-web/commit/bf3cb81160412ab5ac04df49aa803d24927c2713))
* **text-field:** add supporting text ([77cc80e](https://github.com/material-components/material-web/commit/77cc80e63495a39284a855121b93ac1a725084a7))
* **text-field:** add textDirection ([4bab4b5](https://github.com/material-components/material-web/commit/4bab4b587465839db58d62b2f9bc763c422133fa))
* **text-field:** add valueAsNumber and valueAsDate ([7792ae1](https://github.com/material-components/material-web/commit/7792ae1b094f03a44c6fda868a1f8563a2b702c9))
* **text-field:** announce error messages ([973a982](https://github.com/material-components/material-web/commit/973a98250bef8ebdef9909b4743d2322fe7b7871))
* **text-field:** error/errorText will override reportValidity ([c757bfa](https://github.com/material-components/material-web/commit/c757bfac45b8c4ab44f46da2769faf7e24fb677f))
* **theming:** add theming by color-scheme mixin. ([6ea69ec](https://github.com/material-components/material-web/commit/6ea69ecb0c94598c8a1d35d08e1af3165f20ce95))


### Bug Fixes

* **button, fab:** Ensure elevation is correct when focused and hovering ([6e0775d](https://github.com/material-components/material-web/commit/6e0775ded3e90aa56f6e38903b2e15f68b7a4de4))
* **button:** Move event listeners to anchor to fix focus ring ([e8ba229](https://github.com/material-components/material-web/commit/e8ba229dd09d98a3ab68d667bf8c7f0df69daa53))
* **button:** Remove `aria-label` and `aria-haspopup` attributes from Button HTML if not set ([5e2a46e](https://github.com/material-components/material-web/commit/5e2a46e9a75b6e98fe228b14c36f95d495bd75eb))
* **button:** Replace `&lt;mwc-icon&gt;` with `<md-icon>` ([8720a77](https://github.com/material-components/material-web/commit/8720a7765a0e84ed97da1610f774abd423c56529))
* **button:** Use correct padding for Text Button ([61eb08e](https://github.com/material-components/material-web/commit/61eb08e7b1d95610fec5de7488c800d25cc22b0c))
* **button:** use new elevation component ([2f1a8df](https://github.com/material-components/material-web/commit/2f1a8dfc417605859bab7695a9fb6392acabf25a))
* **button:** use new elevation component ([545c2eb](https://github.com/material-components/material-web/commit/545c2eb494feffcdba1cc3ea80df16449adc5f0c))
* **checkbox:** Fixes incorrect styling of native input which also caused tapping to check to sometimes fail. ([dd6a56b](https://github.com/material-components/material-web/commit/dd6a56bacecef773b9d69ee0bbacdcabf5657b98))
* **checkbox:** Make focus ring circular ([f330c51](https://github.com/material-components/material-web/commit/f330c51d1765982379c1cba7a50f3d5c2627c74f))
* **checkbox:** Remove unused methods and cleanup styles ([9152fed](https://github.com/material-components/material-web/commit/9152fed0b934ff1aef999b61c8577113fe5ac527))
* **checkbox:** Update checkbox to use property bindings for `disabled` and `checked` on internal input element. ([73ed7a0](https://github.com/material-components/material-web/commit/73ed7a0233955d1a5df206ebe5c5f642f69e1aec))
* **chips:** Remove unused import ([e65ebd8](https://github.com/material-components/material-web/commit/e65ebd8ef107013d843f800945f308f8cf24467e))
* **decorators:** ariaProperty not triggering re-renders from data changes ([a171c8f](https://github.com/material-components/material-web/commit/a171c8fff375f2fe8886f6edfe0b9acf34d103d3))
* **field:** content not expanding ([d0d5340](https://github.com/material-components/material-web/commit/d0d5340d07c10d470a5ef77cc5cc6cd523b176c3))
* **field:** supporting text typography not resolving ([a96664b](https://github.com/material-components/material-web/commit/a96664b835e044dddcf0feaf44697f6ee751d80f))
* **focus:** Update focus ring to new design ([601c331](https://github.com/material-components/material-web/commit/601c331d37d73620f1a9f7bdc85181be607d0fa5))
* **formfield:** fix broken import ([b4bcf4e](https://github.com/material-components/material-web/commit/b4bcf4efff02168c195f0dbbd1c32756ae4c9994))
* **formfield:** Removed Formfield. ([753a03b](https://github.com/material-components/material-web/commit/753a03be963f7b5242e98b73d1309abbe9f5bf51))
* **list,textfield:** Fix TS 4.9 compliation of role property override. ([c70198a](https://github.com/material-components/material-web/commit/c70198a5670bc372140315cec20cbca0ed576115))
* **list:** Changed Headline text from slot content to text property of list item ([62092b7](https://github.com/material-components/material-web/commit/62092b7c9b03d72b24369d991d3dd08120854166))
* **list:** Fixed layout of list variants. ([a885a1f](https://github.com/material-components/material-web/commit/a885a1faffc71b30d5adf0da935e08efda7e0dcf))
* **list:** Fixed list item icon padding ([07aaa8a](https://github.com/material-components/material-web/commit/07aaa8a7633a5dc499ce6d7f426b085963ac2bc4))
* **list:** Modify list focus ring horizontal offset to prevent horizontal overflow. ([a88be95](https://github.com/material-components/material-web/commit/a88be95da7b1bf9b8b380bfbf47c0fbe25c2f2d3))
* **list:** Removed unnecessary options list variant ([6b6d651](https://github.com/material-components/material-web/commit/6b6d651714eef8283060d3d44f9b82447e63974a))
* **list:** use new elevation component ([527b273](https://github.com/material-components/material-web/commit/527b273d8f8b9b931b0b0f4c9de0623efd57f213))
* **menu:** Fix focus management bugs (TAB on menu item closes menu without restoring focus to anchor element, on menu open, menu respects focusState option (first item, last item, or list root). ([305b790](https://github.com/material-components/material-web/commit/305b790faa91e1cb7f1d80e5b7f3761acd38c302))
* **menu:** use new elevation component ([563518b](https://github.com/material-components/material-web/commit/563518b59fac92ade3da73b64a6323e81f7b8aa5))
* **navigationdrawer:** use new elevation component ([c2fe5e1](https://github.com/material-components/material-web/commit/c2fe5e1d1b14c0f6d7a585676d3dfbad108eaf8f))
* **radio:** Radio supports form association and label activation by using FormController and setting `formAssociated`. ([91c2425](https://github.com/material-components/material-web/commit/91c24255c243a97d01a873854046ad3a57033352))
* **radio:** update rendering and styles ([3aff084](https://github.com/material-components/material-web/commit/3aff08429715f49de9296e5efb7b3ebd4d0d804b))
* **ripple:** Improves fix for Safari ripple overflow due to https://bugs.webkit.org/show_bug.cgi?id=247546 to handle hover and pressed states. ([8a35672](https://github.com/material-components/material-web/commit/8a35672c4a10a99a8b7e5bfcc9ea6e6a1a1e48cb))
* **styling:** Removes tap highlight color visible on mobile Safari for checkbox, radio, iconbutton, and textfield. ([eec25b3](https://github.com/material-components/material-web/commit/eec25b393eb4ce84d207d27c7d84a2695fe50c8a))
* **tab:** Fixes how tabs renders icons. ([f7e1bbb](https://github.com/material-components/material-web/commit/f7e1bbb7aee4230c1fd324ececf0d872c16f5bbb))
* **text-field:** container-shape not working for outlined variant ([6b25914](https://github.com/material-components/material-web/commit/6b25914f60a79987506a5ba3d8f7e12dec282486))
* **text-field:** correctly resizes when setting width ([7285b3a](https://github.com/material-components/material-web/commit/7285b3a2dbfa6f03f178168f0779abb506f951dd))
* **text-field:** ensure `value` can overwrite `defaultValue` ([58ae98c](https://github.com/material-components/material-web/commit/58ae98cbc8c2b95138994e6976ea4c8694da627a))
* **text-field:** fixed setting width to less than &lt;input&gt; width ([a5849b9](https://github.com/material-components/material-web/commit/a5849b95466b5b22a094757f83fe7f7f823d493d))
* **text-field:** label floating after type changes ([17d92f6](https://github.com/material-components/material-web/commit/17d92f6b4b06ec376df8ac90f55828b2abb8bf20))
* **text-field:** rename readonly to readOnly ([4e6f01d](https://github.com/material-components/material-web/commit/4e6f01d422d9d1a612eeabd0ad649de1a8f7b0fa))


### Miscellaneous Chores

* update release-please ([0b5283d](https://github.com/material-components/material-web/commit/0b5283dadf5889846132d97e86fd21adb72209ed))
