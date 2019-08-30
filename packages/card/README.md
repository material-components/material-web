# `<mwc-card>`
A [Material Components](https://material.io/develop/) card implementation using [Web Components](https://www.webcomponents.org/introduction)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

Cards contain content and actions about a single subject.

[Material Design Guidelines: Card](https://material.io/design/components/cards.html)

## Installation

```sh
npm install @material/mwc-card @material/mwc-card-primary-action @material/mwc-card-media
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
    <mwc-card-primary-action>
        <mwc-card-media aspectRatio="16-9" class="card__image"></mwc-card-media>
        <div class="card__header">
            <div class="card__header-text">
                <div class="card__title">Our Changing Planet</div>
                <div class="card__subtitle">by Kurt Wagner</div>
            </div>
        </div>
        <div class="card__secondary mdc-typography mdc-typography--body2">
            Visit ten places on our planet that are undergoing the biggest changes today.
        </div>
    </mwc-card-primary-action>
    <mwc-button slot="button">Read</mwc-button>
    <mwc-button slot="button">Bookmark</mwc-button>
    <mwc-icon-button slot="icon" icon="favorite"></mwc-icon-button>
    <mwc-icon-button slot="icon" icon="share"></mwc-icon-button>
    <mwc-icon-button slot="icon" icon="more_vert"></mwc-icon-button>
</mwc-card>

<script type="module">
  import '@material/mwc-card';
  import '@material/mwc-card-primary-action';
  import '@material/mwc-card-media';
</script>
```

```css
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
    padding: 0 1rem 8px;
}

.card__image {
    --mdc-card-media-background-image: url(card__image.jpg);
}
```

### Outlined

```html
<mwc-card outlined>
      <mwc-card-primary-action>
        <mwc-card-media aspectRatio="16-9" class="card__image"></mwc-card-media>
        <div class="card__header">
            <div class="card__header-text">
                <div class="card__title">Our Changing Planet</div>
                <div class="card__subtitle">by Kurt Wagner</div>
            </div>
        </div>
        <div class="card__secondary mdc-typography mdc-typography--body2">
            Visit ten places on our planet that are undergoing the biggest changes today.
        </div>
    </mwc-card-primary-action>
    <mwc-button slot="button">Read</mwc-button>
    <mwc-button slot="button">Bookmark</mwc-button>
    <mwc-icon-button slot="icon" icon="favorite"></mwc-icon-button>
    <mwc-icon-button slot="icon" icon="share"></mwc-icon-button>
    <mwc-icon-button slot="icon" icon="more_vert"></mwc-icon-button>
</mwc-card>
```

### Full Bleed Action

```html
<mwc-card fullBleed>
    <mwc-card-primary-action>
        <mwc-card-media aspectRatio="16-9" class="card__image"></mwc-card-media>
        <div class="card__header">
            <div class="card__header-text">
                <div class="card__title">Our Changing Planet</div>
                <div class="card__subtitle">by Kurt Wagner</div>
            </div>
        </div>
        <div class="card__secondary mdc-typography mdc-typography--body2">
            Visit ten places on our planet that are undergoing the biggest changes today.
        </div>
    </mwc-card-primary-action>
    <mwc-button slot="button">Read</mwc-button>
</mwc-card>
```

## API

### Slots
| Name        | Description
| ----------- | -----------
| `button`    | Optional `<button>` to display an action button in the action row.
| `icon`      | Optional `<button>` to display an action button in the action row.

### Properties/Attributes

| Name                | Type             | Description
| ------------------- | ---------------- |------------
| `outlined`          | `boolean`        | Whether or not to show the material outlined variant.
| `fullBleed`         | `boolean`        | Whether or not to make a single action button take up the entire width of the action row. 

### CSS Custom Properties

| Name                                              | Default               | Description
| ------------------------------------------------- | --------------------- |------------
| `--mdc-card-border-radius`                        | `4px 4px 4px 4px`     | Border radius of the standard / outlined card.

## Additional references

- [MDC Web cards](https://material.io/develop/web/components/cards/)