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
