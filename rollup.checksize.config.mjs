/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import { compileLitTemplates } from "@lit-labs/compiler";
import typescript from '@rollup/plugin-typescript';
import summary from "rollup-plugin-summary";
import { terser } from "rollup-plugin-terser";

const skipBundleOutput = {
  generateBundle(_options, bundles) {
    // Deleting all bundles from this object prevents them from being written,
    // see https://rollupjs.org/guide/en/#generatebundle.
    for (const name in bundles) {
      delete bundles[name];
    }
  },
};

export default {
  input: "all.ts",
  output: {
    dir: '.',
    format: 'esm',
    preserveModules: true
  },
  plugins: [
    typescript({
        tsconfig: './tsconfig.json',
        declarationDir: '.',
        transformers: {
          before: [compileLitTemplates()],
        },
      }),
    terser(),
    summary({
      showBrotliSize: true,
      showGzippedSize: true,
    }),
    skipBundleOutput
  ],
};
