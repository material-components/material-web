"""
Contains testing and demo build rules for the Material Design team.
"""

load("//javascript/typescript:build_defs.bzl", "ts_development_sources", "ts_library")
load("//tools/build_defs/js/devserver:web_dev_server.bzl", "web_dev_server")
load("//javascript/lit/stories:build_defs.bzl", "catalog_entry")

def material_web_demo(
        name,
        collection_name = "",
        deps = [],
        sass_binaries = [],
        debug_styles = False,
        visibility = None):
    """Generates a demo web server and creates a `:stories` ts_library rule.

    Args:
      name: Required.
      collection_name: Optional. The stories collection name.
      deps: Optional dependencies for the stories file.
      sass_binaries: Optional `sass_binary` rules used for source maps.
      debug_styles: If true, this will have lit use <style> tags instead of constructed stylesheets.
        This can be used to allow source mapping.
      visibility: Standard Blaze attribute.
    """

    # Static file to serve unchanged. See go/wds-guide#static_files
    # This is used to serve the .css.map files.
    static_files = []
    static_files.extend([name for name in sass_binaries])

    # Depot path prefixes to strip from the files in static_files. See go/wds-guide#static_files.
    # This is needed because go/sass_binary builds source maps with relative paths. But because
    # these styles are added to a <style> tag they look for the source maps relative to the current
    # URL.
    # TODO(b/228463084): Remove the need for serving .css.map files from the root.
    static_files_path_prefixes = []
    static_files_path_prefixes.extend([Label(name).package for name in sass_binaries])

    ts_lib_deps = [
        "//javascript/lit/stories",
        "//third_party/javascript/material/web/internal/demo/stories",
    ]

    ts_library(
        name = "%s.ts_library" % name,
        srcs = ["demo.ts"],
        deps = ts_lib_deps + deps,
    )

    if collection_name != "":
        catalog_entry(
            name = "%s.catalog_entry" % name,
            collection_name = collection_name,
            id = collection_name,
            stories = "%s.ts_library" % name,
            visibility = visibility,
        )

    ts_development_sources(
        name = "%s.ts_development_sources" % name,
        runtime_deps = ["//javascript/lit/hot_elements"],
        deps = ["%s.ts_library" % name] + deps,
    )

    static_routes = {}
    if debug_styles:
        static_routes = {"//third_party/javascript/material/web/internal/demo:index_debug_styles.html": "/"}

    web_dev_server(
        name = name,
        concatjs_routes = {":%s.ts_development_sources" % name: "/_/ts_scripts.js"},
        static_routes = static_routes,
        cross_origin_headers = False,
        static_files = static_files,
        static_files_path_prefixes = static_files_path_prefixes,
        visibility = visibility,
    )
