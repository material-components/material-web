/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  createPackageAnalyzer,
  type AbsolutePath,
} from '@lit-labs/analyzer/package-analyzer.js';
import {generateManifest} from '@lit-labs/gen-manifest';
import {writeFileTree} from '@lit-labs/gen-utils/lib/file-utils.js';
import type {Package as Manifest} from 'custom-elements-manifest';
import * as path from 'path';

const ROOT = process.cwd() as AbsolutePath;

const mainManifest = await generateManifestFromTsconfig(ROOT);
const gbManifest = await generateManifestFromTsconfig(
  path.resolve(ROOT, 'labs/gb') as AbsolutePath,
);

const modulePathsAdded = new Set<string>(
  mainManifest.modules.map((module) => module.path),
);
const combinedModules = [...mainManifest.modules];
for (const module of gbManifest.modules) {
  if (!modulePathsAdded.has(module.path)) {
    modulePathsAdded.add(module.path);
    combinedModules.push(module);
  }
}
const manifest = {
  ...mainManifest,
  modules: combinedModules,
};

await writeFileTree(ROOT, {
  'custom-elements.json': JSON.stringify(manifest, null, 2),
});
console.log('Generated custom-elements.json');

async function generateManifestFromTsconfig(basePath: AbsolutePath) {
  const analyzer = createPackageAnalyzer(basePath);
  const pkg = analyzer.getPackage();
  const files = await generateManifest(pkg);
  const manifestContent = files['custom-elements.json'];
  if (typeof manifestContent !== 'string') {
    throw new Error(
      `Expected 'custom-elements.json': '<string>' from @lit-labs/gen-manifest, but got ${typeof manifestContent}`,
    );
  }
  return JSON.parse(manifestContent) as Manifest;
}
