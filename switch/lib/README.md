# Switch

## DOM structure

```html
<button class="md3-switch">
  <div class="md3-switch__track">
    ::before
    <div class="md3-switch__handle">
      ::before
      <div class="md3-switch__icons">
      </div>
    </div>
  </div>
  <input type="checkbox" aria-hidden="true">
</button>
```

### .md3-switch

This is the outermost button. It holds the track and the input checkbox.

NOTE: This is intentionally left without a border to make the focus-ring simpler
to apply.

### .md3-switch__track

This is the track. It contains the track selected styles.

### .md3-switch__track::before

This element contains the track unselected styles. Its opacity is set to 0
when the switch is selected.

### .md3-switch__handle

This is the handle. It contains the styles of selected styles.

### .md3-switch__handle::before

This element contains the handle unselected styles. Its opacity is set to 0
when the switch is selected.


## Animations

*  opacity on .md3-switch__track::before
   *  Why? setting opacity will change between selected and unselected track
*  opacity on .md3-switch__handle::before
   *  Why? setting opacity will change between selected and unselected handle
*  transform (scale) on .md3-switch__handle
   *  Why? This animates the growing & shrinking of the handle.
*  margin-inline-start & margin-inline-end on .md3-switch__handle
   *  Why? This animates the position of the handle.

