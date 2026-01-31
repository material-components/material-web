This folder contains auto-generated files for Material Design token versions.

> **WARNING: These files may unexpectedly change across different non-major
> versions of `@material/web`.**
>
> Most users should ignore this folder and use other APIs provided by
> `@material/web/tokens`.

`@material/web/tokens/versions` is useful for custom implementations of or
experimentations with the Material Design system.

To avoid unexpected breakages when using these files, save the *exact version*
of `@material/web` instead of a version range (e.g. `@2.0.0` instead of
`@^2.0.0`).

```
Example of a minor breaking change:

<!-- v2.0.0 - add tokens v5 -->
@material/web@2.0.0/tokens/version/v5_0/_md-sys-color.scss

The path to this file may break in a typically non-breaking minor version bump.

<!-- v2.1.0 - update v5 tokens to include a new component -->
@material/web@2.1.0/tokens/version/v5_1/_md-sys-color.scss
```
