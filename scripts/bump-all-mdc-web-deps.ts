/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {execFileSync} from 'child_process';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

const packagesDir = path.resolve(__dirname, '..', '..', 'packages');

interface PackageJson {
  name: string;
  dependencies?: {[mdcwPkg: string]: string};
}

function isMdcWebPackage(mdcwPkg: string): boolean {
  return mdcwPkg.startsWith('@material/') &&
      !mdcwPkg.startsWith('@material/mwc-');
}

function main() {
  const newVersion =
      '=' + execFileSync('npm', ['info', '@material/base@canary', 'version'], {
              encoding: 'utf8'
            }).trim();
  console.log(`Found latest MDC Web canary version: ${newVersion}\n`);

  const packageJsonPaths =
      glob.sync(path.join('*', 'package.json'), {cwd: packagesDir})
  let anyChanged = false;
  for (const relPath of packageJsonPaths) {
    const absPath = path.join(packagesDir, relPath);
    const pj = JSON.parse(fs.readFileSync(absPath, 'utf8')) as PackageJson;
    if (!pj.dependencies) {
      continue;
    }
    console.log(`Checking ${pj.name}`);
    let changed = false;
    for (const [pkg, oldVersion] of Object.entries(pj.dependencies)) {
      if (isMdcWebPackage(pkg)) {
        if (oldVersion !== newVersion) {
          pj.dependencies[pkg] = newVersion;
          console.log(`\tUpdating ${pkg} from ${oldVersion} to ${newVersion}`);
          changed = true;
          anyChanged = true;
        }
      }
    }
    if (changed) {
      console.log(`\tWriting new package.json`);
      fs.writeFileSync(absPath, JSON.stringify(pj, null, 2) + '\n', 'utf8');
    }
  }
  if (anyChanged) {
    // Set an output value for consumption by a GitHub Action.
    // https://help.github.com/en/articles/development-tools-for-github-actions#set-an-output-parameter-set-output
    console.log(
        `::set-output name=new-mdc-version::${newVersion.substring(1)}`);
    console.log(`\nRemember to run npm install!`);
  }
}

main();
