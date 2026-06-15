/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import { Analyzer, type AbsolutePath } from '@lit-labs/analyzer';
import type { Package as Manifest } from 'custom-elements-manifest';
import ts from 'typescript';
import * as path from 'path';
import { generateManifest } from '@lit-labs/gen-manifest';
import { writeFileTree } from '@lit-labs/gen-utils/lib/file-utils.js';

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
  // Create TS program
  const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (fileName) => fileName,
    getCurrentDirectory: () => ts.sys.getCurrentDirectory(),
    getNewLine: () => ts.sys.newLine,
  };
  const tsconfigPath = ts.findConfigFile(basePath, ts.sys.fileExists);
  const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
  if (configFile.error) {
    throw new Error(ts.formatDiagnostic(configFile.error, formatHost));
  }
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    basePath,
  );
  if (parsedConfig.errors.length) {
    throw new Error(ts.formatDiagnostics(parsedConfig.errors, formatHost));
  }
  const program = ts.createProgram({
    rootNames: parsedConfig.fileNames,
    options: parsedConfig.options,
    host: ts.createCompilerHost(parsedConfig.options, true),
  });

  // Run Lit analyzer
  const analyzer = new Analyzer({
    typescript: ts,
    getProgram: () => program,
    fs: ts.sys,
    path,
    basePath,
  });
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