# Breaking changes from v1 to v2

<!-- go/mwc-migrations-v2 -->

## ARIA attribute querySelector

**What changed?**

`role` and `aria-*` attributes now shift at runtime to `data-role` and
`data-aria-*` attributes. This fixes a screen reader bug around labels
announcing more than once.

**What broke?**

Using `querySelector` or `querySelectorAll` with `[role]` or `[aria-*]`
attribute selectors.

```html
<md-checkbox aria-label="Agree"></md-checkbox>
<script>
  const agreeCheckbox = document.querySelector(
    'md-checkbox[aria-label="Agree"]'
  );
  // `agreeCheckbox` is null!
</script>
```

**How to fix?**

Provide selector strings to `ariaSelector()` before querying.

```ts
import {ariaSelector} from '@material/web/migrations/v2/query-selector-aria';

const agreeCheckbox = document.querySelector(
  ariaSelector('md-checkbox[aria-label="Agree"]')
);
```

Note: Element APIs, such as `element.getAttribute('role')` and
`element.ariaLabel` will continue to work as expected.

## Sass `tokens.md-comp-*-values()` include custom properties by default

**What changed?**

Sass component token functions return a `var()` with the component's custom
property, instead of just a value.

```scss
@use '@material/web/tokens';

$checkbox-tokens: tokens.md-comp-checkbox-values();
// (
//   // 'icon-size': 18px, // Before
//   'icon-size': var(--md-checkbox-icon-size, 18px), // After
// )
```

**What broke?**

Sass token values from `tokens.md-comp-*-values()` functions are `var()`
functions instead of CSS values. This may introduce additional unnecessary CSS
or break Sass.

```scss
@use '@material/web/tokens';

$checkbox-tokens: tokens.md-comp-checkbox-values();

$double-icon-size: math.mult(map.get($checkbox-tokens, 'icon-size'), 2);
// @error var(--md-checkbox-icon-size, 18px) is not a number.
```

**How to fix?**

Add the parameter `$exclude-custom-properties: true` to the values function.

```scss
@use '@material/web/tokens';

$checkbox-tokens: tokens.md-comp-checkbox-values($exclude-custom-properties: true);
// (
//   'icon-size': 18px,
// )
```
