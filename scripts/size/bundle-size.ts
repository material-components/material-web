/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import multiEntry from '@rollup/plugin-multi-entry';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import {rollup} from 'rollup';
import {promisify} from 'util';
import {gzip} from 'zlib';

const gzipPromise = promisify(gzip);

export interface Bundle {
  name: string;
  inputs: string[];
}

export interface BundleSize {
  name: string;
  size: Size;
  inputs: InputSize[];
}

export interface InputSize {
  input: string;
  size: Size;
}

export interface Size {
  raw: number;
  css: number;
  gzip: number;
}

export async function getBundleSize(bundle: Bundle): Promise<BundleSize> {
  const bundleSize = await computeBundleSize(bundle.inputs);
  let inputSizes: InputSize[];
  if (bundle.inputs.length === 1) {
    // If there's only one input, we don't need to re-generate the bundle.
    inputSizes = [{input: bundle.inputs[0], size: bundleSize}];
  } else {
    // Include computed bundle size for individual inputs.
    inputSizes = await Promise.all(
      bundle.inputs.map(async (input) => {
        return {
          input,
          size: await computeBundleSize(input),
        };
      }),
    );
  }

  return {
    name: bundle.name,
    size: bundleSize,
    inputs: inputSizes,
  };
}

async function computeBundleSize(input: string | string[]): Promise<Size> {
  const rollupBundle = await rollup({
    input,
    external: [/node_modules/],
    plugins: [multiEntry(), nodeResolve(), terser()],
  });

  let code = '';
  try {
    const {output} = await rollupBundle.generate({});
    code = output[0].code;
  } finally {
    rollupBundle.close();
  }

  const litCssTagNameMatch = code.match(/css\s*as\s*(\w+)/);
  if (!litCssTagNameMatch) {
    throw new Error("Cannot find `import { css as X } from 'lit'`");
  }

  const litCssTagName = litCssTagNameMatch[1];
  const codeWithoutCss = code.replaceAll(
    new RegExp(`${litCssTagName}\`([^\`]*)\``, 'g'),
    '',
  );

  const encoder = new TextEncoder();
  const codeSize = encoder.encode(code).length;
  const codeSizeWithoutCss = encoder.encode(codeWithoutCss).length;
  const cssSize = codeSize - codeSizeWithoutCss;
  const gzipSize = (await gzipPromise(code)).length;
  return {
    raw: codeSize,
    css: cssSize,
    gzip: gzipSize,
  };
}
