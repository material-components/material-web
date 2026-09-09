/**
 * @license
 * Copyright 2026 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/** @fileoverview Generates tokens/versions/latest/_md-{name}-meta.scss files. */

import * as fs from 'fs';
import * as util from 'util';
function generateMetaFile(inputFilePath: string, outputFilePath: string) {
  const content = fs.readFileSync(inputFilePath, {encoding: 'utf8'});
  const metaVars: string[] = [];

  // Regex to match variable declarations: $name: value;
  const varRegex = /^\s*\$([\w-]+)\s*:\s*([^;]+);/gm;
  let match: RegExpExecArray | null;
  while ((match = varRegex.exec(content)) !== null) {
    const name = match[1];
    let value = match[2].trim();

    // Resolve the value to a CSS var() if it references another token.
    // (e.g. md-sys-color.$primary or $primary)
    const refMatch = value.match(/^(?:([\w-]+)\.)?\$([\w-]+)$/);
    if (refMatch) {
      const refModule = refMatch[1] || null;
      const refToken = refMatch[2];
      value = `var(--${refModule ? `${refModule}-` : ''}${refToken})`;
    }

    metaVars.push(`$${name}--resolved: ${value};`);
  }

  fs.writeFileSync(
    outputFilePath,
    `//
// Copyright 2026 Google LLC
// SPDX-License-Identifier: Apache-2.0
//
// Auto-generated token metadata.
${metaVars.join('\n')}
`,
  );
}

const {values, positionals} = util.parseArgs({
  allowPositionals: true,
  options: {
    outputs: {type: 'string'},
  },
});

const inputs: string[] = positionals;
const outputs: string[] = [];

if (inputs.length === 0) {
  throw new Error(
    `Usage: node generate-sass-token-meta.js <input.scss>... [--outputs "out1-meta.scss out2-meta.scss"]`,
  );
}
if (values.outputs) {
  outputs.push(...values.outputs.trim().split(/\s+/).filter(Boolean));
}
if (outputs.length === 0) {
  for (const input of inputs) {
    outputs.push(input.replace('.scss', '-meta.scss'));
  }
}
if (inputs.length !== outputs.length) {
  throw new Error(
    `Inputs and outputs length mismatch: ${inputs.length} vs ${outputs.length}`,
  );
}

for (let i = 0; i < inputs.length; i++) {
  generateMetaFile(inputs[i], outputs[i]);
}
