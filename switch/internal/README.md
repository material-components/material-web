# Switch

## DOM structure

```html
<button class="switch">
  <div class="track">
    ::before
    <div class="handle">
      ::before
      <div class="icons">
      </div>
    </div>
  </div>
  <input type="checkbox" aria-hidden="true">
</button>
```

### .switch

This is the outermost button. It holds the track and the input checkbox.

NOTE: This is intentionally left without a border to make the focus-ring simpler
to apply.

### .track

This is the track. It contains the track selected styles.

### .track::before

This element contains the track unselected styles. Its opacity is set to 0
when the switch is selected.

### .handle

This is the handle. It contains the styles of selected styles.

### .handle::before

This element contains the handle unselected styles. Its opacity is set to 0
when the switch is selected.


## Animations

*  opacity on .track::before
   *  Why? setting opacity will change between selected and unselected track
*  opacity on .handle::before
   *  Why? setting opacity will change between selected and unselected handle
*  transform (scale) on .handle
   *  Why? This animates the growing & shrinking of the handle.
*  margin-inline-start & margin-inline-end on .handle
   *  Why? This animates the position of the handle.

