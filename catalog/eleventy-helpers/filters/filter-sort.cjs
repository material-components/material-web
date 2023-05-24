/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * A filter that sorts and filters an array based on truthyness and sorts the
 * filtered array.
 *
 * This filter takes the following arguments:
 * - arr: (required) The array to filter-sort.
 * - attr: (required) The attribute to filter and sort by.
 *
 * @example
 * ```html
 * <!--
 *   Will generate an array of anchor tags based on the array of entries in the
 *   "component" 11ty collection. The anchor tags are sorted alphabetically by
 *   `data.name` and will not be rendered if `data.name` is not defined.
 * -->
 * {% for component in collections.component|filtersort('data.name') %}
 *   <a href={{ component.url }}>{{ component.data.name }}</a>
 * {% endfor %}
 * ```
 *
 * @param eleventyConfig The 11ty config in which to attach this filter.
 */
function filterSort (eleventyConfig) {
  eleventyConfig.addFilter("filtersort", function(arr, attr) {
    // get the parts of the attribute to look up
    const attrParts = attr.split(".");

    const array = arr.filter(item => {
      let value = item;

      // get the deep attribute
      for (const part of attrParts) {
        value = value[part];
      }

      return !!value;
    });

    array.sort((a, b) => {
      let aVal = a;
      let bVal = b;

      // get the deep attributes of each a and b
      for (const part of attrParts) {
        aVal = aVal[part];
        bVal = bVal[part];
      }

      if (aVal < bVal) {
        return -1;
      } else if (aVal > bVal) {
        return 1;
      }

      return 0;
    });

    return array;
  });
};

module.exports = filterSort;