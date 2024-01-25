/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs/promises';

import {MarkdownTable} from '../analyzer/markdown-tree-builder.js';
import {COMPONENT_CUSTOM_ELEMENTS} from '../component-custom-elements.js';
import {Bundle, Size, getBundleSize} from './bundle-size.js';

// The bundles to track sizes for.

const bundles: Bundle[] = [
  {
    name: 'all',
    inputs: ['all.js'],
  },
  {
    name: 'common',
    inputs: ['common.js'],
  },
  ...(
    Object.keys(COMPONENT_CUSTOM_ELEMENTS) as Array<
      keyof typeof COMPONENT_CUSTOM_ELEMENTS
    >
  ).map((component) => {
    const tsCustomElementPaths = COMPONENT_CUSTOM_ELEMENTS[component];
    const jsCustomElementPaths = tsCustomElementPaths.map((tsPath) =>
      tsPath.replace(/\.ts$/, '.js'),
    );

    return {
      name: component,
      inputs: jsCustomElementPaths,
    };
  }),
];

// Compute bundle sizes.

const bundleSizes = await Promise.all(
  bundles.map((bundle) => getBundleSize(bundle)),
);

// Create a markdown table with size data.

const columns = ['Component', 'gzip', 'minified', '*% CSS*', 'Import'];
const rows: string[][] = [];
for (const {name, size, inputs} of bundleSizes) {
  rows.push([
    `**${camelToSentenceCase(name)}**`,
    `**${bytesToString(size.gzip)}**`,
    bytesToString(size.raw),
    getCssPercent(size),
    inputs.length === 1 ? getImport(inputs[0].input) : '',
  ]);

  if (inputs.length > 1) {
    rows.push(
      ...inputs.map((input) => {
        return [
          '',
          bytesToString(input.size.gzip),
          bytesToString(input.size.raw),
          getCssPercent(input.size),
          getImport(input.input),
        ];
      }),
    );
  }
}

const markdownTable = new MarkdownTable(columns);
for (const row of rows) {
  markdownTable.addRow(row);
}

// Update markdown file.

const markdownContent = await fs.readFile('docs/size.md', {encoding: 'utf8'});
const updateTrackingStart = '<!-- MWC_UPDATE_TRACKING_START -->';
const updateTrackingEnd = '<!-- MWC_UPDATE_TRACKING_END -->';

const now = new Date();
const nowString = now.toISOString().split('T')[0];

const newMarkdownContent = [
  markdownContent.substring(0, markdownContent.indexOf(updateTrackingStart)),
  updateTrackingStart,
  '\n\n',
  `<sub>Last updated ${nowString}.</sub>\n\n`,
  markdownTable.toString(),
  '\n\n',
  markdownContent.substring(markdownContent.indexOf(updateTrackingEnd)),
].join('');

await fs.writeFile('docs/size.md', newMarkdownContent);

// Text formatting functions for markdown table.

function getImport(input: string) {
  return `\`@material/web/${input}\``;
}

function getCssPercent(size: Size) {
  return `*${Math.round((size.css / size.raw) * 100)}% CSS*`;
}

function bytesToString(bytes: number) {
  return `${(Math.round(bytes / 100) / 10).toFixed(1)}kb`;
}

function camelToSentenceCase(value: string) {
  const withSpaces = value.replaceAll(/([a-z])([A-Z])/g, '$1 $2');
  return withSpaces[0].toUpperCase() + withSpaces.slice(1).toLowerCase();
}
