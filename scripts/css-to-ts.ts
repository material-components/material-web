/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';
import * as util from 'util';

const {values, positionals} = util.parseArgs({
  allowPositionals: true,
  options: {
    suffix: {
      type: 'string',
    },
  },
});

const cssFilePath = positionals[0];
if (!cssFilePath) {
  throw new Error(
    `Usage: node scripts/css-to-ts.js <input.css> [output.ts] [--suffix=<suffix>]`,
  );
}

const tsFilePath =
  positionals[1] || cssFilePath.replace('.css', `${values.suffix || ''}.ts`);
const cssContent = fs
  .readFileSync(cssFilePath, {encoding: 'utf8'})
  // Remove source map comments since the css is embedded.
  // "/*# sourceMappingURL=checkbox-styles.css.map */"
  .replace(/\/\*#\ sourceMappingURL=[^\*]+ \*\//, '');

fs.writeFileSync(
  tsFilePath,
  `/**
 * @license
 * Copyright ${new Date().getFullYear()} Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
// Generated stylesheet for ${cssFilePath}.
import {css} from 'lit';
export const styles = css\`${cssContent}\`;
export default styles.styleSheet!;
`,
);
