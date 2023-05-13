function filterSort (eleventyConfig) {
  eleventyConfig.addFilter("filtersort", function(arr, attr) {
    const attrParts = attr.split(".");
    const array = arr.filter(item => {
      let value = item;
      for (const part of attrParts) {
        value = value[part];
      }

      return !!value;
    });

    array.sort((a, b) => {
      let aVal = a;
      let bVal = b;
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