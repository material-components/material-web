# `<mwc-card-media>`
A [Material Components](https://material.io/develop/) card-media implementation using [Web Components](https://www.webcomponents.org/introduction)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Cards can include a variety of media, including photos, and graphics, such as weather icons.

[Material Design Guidelines: Card](https://material.io/design/components/cards.html)

## Installation

```sh
npm install @material/mwc-card @material/mwc-card-media
```

> NOTE: The Material Web Components are distributed as ES2017 JavaScript
> Modules, and use the Custom Elements API. They are compatible with all modern
> browsers including Chrome, Firefox, Safari, Edge, and IE11, but an additional
> tooling step is required to resolve *bare module specifiers*, as well as
> transpilation and polyfills for Edge and IE11. See
> [here](https://github.com/material-components/material-components-web-components#quick-start)
> for detailed instructions.

## Example Usage

### Standard

```html
<mwc-card>
    <mwc-card-media class="card__image"></mwc-card-media>
</mwc-card>

<script type="module">
  import '@material/mwc-card';
  import '@material/mwc-card-media';
</script>
```

```css
.card__image {
    --mdc-card-media-background-image: url(card-image.jpg);
}
```

### Aspect Ratio 16:9

```html
<mwc-card>
    <mwc-card-media aspectRatio="16-9" class="card-image"></mwc-card-media>
</mwc-card>
```

### Text over Media

```html
<mwc-card>
    <mwc-card-media class="card__image">
        <div class="card__media-content">
            <div class="card__header">
                <div class="card__header-text">
                    <div class="card__title">Our Changing Planet</div>
                    <div class="card__subtitle">by Kurt Wagner</div>
                </div>
            </div>
        </div>
    </mwc-card-media>
</mwc-card>
```

```css
.card__image {
    --mdc-card-media-background-image: url(card-image.jpg);
}

.card__media-content {
    display: flex;
    align-items: flex-end;
    width: 100%;
    height: 100%;
}

.card__media-content .card__title,
.card__media-content .card__subtitle {
    color: rgb(255, 255, 255);
}

.card__header {
    display: flex;
    flex-direction: row;
    padding: 16px;
}

.card__header-text {
    display: flex;
    flex-direction: column;
}

.card__title,
.card__subtitle,
.card__secondary {
    font-family: Roboto, sans-serif;
}

.card__title {
    font-size: 1.25rem;
    font-weight: 500;
    line-height: 2rem;
    color: rgba(0, 0, 0);
}

.card__subtitle {
    font-size: .875rem;
    line-height: 1.375rem;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.54);
    text-decoration: inherit;
    text-decoration-line: inherit;
    text-decoration-style: inherit;
    text-decoration-color: inherit;
}

.card__secondary {
    font-size: .875rem;
    line-height: 1.25rem;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.54);
    text-decoration: inherit;
    text-transform: inherit;
    padding: 1rem 1rem 8px;
}
```

## API

### Properties/Attributes

| Name                | Type              | Description
| ------------------- | ----------------- |------------
| `aspectRatio`       | `AspectRatioType` | A string specifying the aspect ratio for the image.

\*  `AspectRatioType` is exported by `mwc-card-media` and `mwc-card-media-base`

```ts
type AspectRatioType = '16-9' | 'square' | '';
```

### CSS Custom Properties

| Name                                              | Default               | Description
| ------------------------------------------------- | --------------------- |------------
| `--mdc-card-media-border-radius`                  | `0`                   | Border radius of the card media.
| `--mdc-card-media-background-image`               | `none`                | Background image of the card media.

## Additional references

- [MDC Web cards](https://material.io/develop/web/components/cards/)