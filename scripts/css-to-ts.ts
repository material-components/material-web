/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';

const cssFilePath = process.argv[2];
if (!cssFilePath) {
  throw new Error(`Usage: node scripts/css-to-ts.js <input.css> [output.ts]`);
}

const tsFilePath = process.argv[3] || cssFilePath.replace('.css', '.ts');
const cssContent = fs
  .readFileSync(cssFilePath, {encoding: 'utf8'})
  // Remove source map comments since the css is embedded.
  // "/*# sourceMappingURL=checkbox-styles.css.map */"
  .replace(/\/\*#\ sourceMappingURL=[^\*]+ \*\//, '');

fs.writeFileSync(
  tsFilePath,
  `/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Generated stylesheet for ${cssFilePath}.
import {css} from 'lit';
export const styles = css\`${cssContent}\`;
`,
);
