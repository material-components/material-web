# `<mwc-card-primary-action>`
A [Material Components](https://material.io/develop/) card-primary-action implementation using [Web Components](https://www.webcomponents.org/introduction)

> IMPORTANT: The Material Web Components are a work in progress and subject to
> major changes until 1.0 release.

The primary action area of a card is typically the card itself. Often cards are one large touch target to a detail screen on a subject. 

[Material Design Guidelines: Card](https://material.io/design/components/cards.html)

## Installation

```sh
npm install @material/mwc-card @material/mwc-card-primary-action
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
```

### Label

```html
<mwc-card>
    <mwc-card-primary-action label="navigate to article">
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

## API

### Properties/Attributes

| Name                | Type             | Description
| ------------------- | ---------------- |------------
| `label`             | `string`         | Label to display for the `aria-label`

## Additional references

- [MDC Web cards](https://material.io/develop/web/components/cards/)