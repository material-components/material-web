# Changelog

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
