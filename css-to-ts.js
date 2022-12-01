/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';

for (let i = 2; i < process.argv.length; i++) {
  try {
    const filePath = process.argv[i];
    const content = fs.readFileSync(filePath);
    fs.writeFileSync(`${filePath}.ts`, `/**
  * @license
  * Copyright 2022 Google LLC
  * SPDX-License-Identifier: Apache-2.0
  */
 import {css} from 'lit';
 export const styles = css\`${content.toString('utf8')}\`;
 `);

  } catch (error) {
    console.error(error);
  }
}
