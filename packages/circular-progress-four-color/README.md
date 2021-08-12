# `<mwc-circular-progress-four-color>` [![Published on npm](https://img.shields.io/npm/v/@material/mwc-circular-progress-four-color.svg)](https://www.npmjs.com/package/@material/mwc-circular-progress-four-color)
> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Progress indicators express an unspecified wait time or display the length of a
process.

The four color circular progress indicator rotates between four colors in
indeterminate mode.

<img src="images/showcase.gif" height="48px">

[Material Design Guidelines: Progress Indicators](https://material.io/components/progress-indicators/#circular-progress-indicators)

[Demo](https://material-components.github.io/material-web/demos/circular-progress/)

## Example usage

### Determinate

```html
<script type="module">
  import '@material/mwc-circular-progress-four-color';
</script>
<mwc-circular-progress-four-color progress="0.7"></mwc-circular-progress-four-color>
```

### Indeterminate

```html
<mwc-circular-progress-four-color indeterminate></mwc-circular-progress-four-color>
```

### Styled

The four-color Circular Progress Indicator does not specify the value of the
four colors by default. These colors may be specified as follows:

<img src="images/showcase.gif" height="48px">

```html
<style>
  mwc-circular-progress-four-color {
    --mdc-circular-progress-bar-color-1: #2196f3;
    --mdc-circular-progress-bar-color-2: #e91e63;
    --mdc-circular-progress-bar-color-3: #ffc107;
    --mdc-circular-progress-bar-color-4: #03dac5;
  }
</style>
<mwc-circular-progress-four-color indeterminate></mwc-circular-progress-four-color>
```

## API

### Slots

None

### Properties/Attributes

| Name            | Type      | Default | Description
| --------------- | --------- | ------- | -----------
| `indeterminate` | `boolean` | `false` | Sets the circular-progress into its indeterminate state.
| `progress`      | `number`  | `0`     | Sets the progress bar's value. Value should be between [0, 1].
| `density`       | `number`  | `0`     | Sets the progress indicator's sizing based on density scale. Minimum value is `-8`. Each unit change in density scale corresponds to 4px change in side dimensions. The stroke width adjusts automatically.
| `closed`        | `boolean` | `false` | Sets the progress indicator to the closed state. Sets content opacity to 0. Typically should be set to true when loading has finished.

### Methods

Name              | Description
----------------- | ------------------------------------------
`open() => void`  | Sets `CircularProgress.closed` to `false`;
`close() => void` | Sets `CircularProgress.closed` to `true`;

### Events

None

### CSS Custom Properties

Name                                  | Default                                                             | Description
------------------------------------- | ------------------------------------------------------------------- | -----------
`--mdc-circular-progress-bar-color-1` | `--mdc-theme-primary`                                               | Sets the first of the four rotating colors.
`--mdc-circular-progress-bar-color-2` | `--mdc-theme-primary`                                               | Sets the second of the four rotating colors.
`--mdc-circular-progress-bar-color-3` | `--mdc-theme-primary`                                               | Sets the third of the four rotating colors.
`--mdc-circular-progress-bar-color-4` | `--mdc-theme-primary`                                               | Sets the last of the four rotating colors.
`--mdc-circular-progress-track-color` | transparent                                                         | Sets the track color of the determinate progress bar.

#### Global Custom Properties

This component exposes the following global [theming](https://github.com/material-components/material-components-web-components/blob/master/docs/theming.md)
custom properties.

| Name                                 | Description
| ------------------------------------ | -----------
| `--mdc-theme-primary`                | Sets the color of determinate progress bar. If the indeterminate four colors are unset, sets the color for indeterminate state as well.
