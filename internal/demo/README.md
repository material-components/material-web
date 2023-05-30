# Material Demo Server

## Sass source maps

To get Sass source maps to work in the demo server:

1.  Add `sourcemap_embed_sources = True` to the `sass_binary` rules.
2.  Add `debug_styles = True` to the material_web_demo rule.
3.  Add a list of the `sass_binary` rules to the `material_web_demo` rules.
    For example:

    ```build {highlight="context:1,sass_binaries,4"}
    material_web_demo(
        name = "demo",
        debug_styles = True,
        sass_binaries = [
            "//third_party/javascript/material/web/focus/lib:focus_ring_css",
            "//third_party/javascript/material/web/switch/lib:switch_css",
        ],
        deps = [":ts"],
    )
    ```
