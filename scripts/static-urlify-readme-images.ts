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

// Our READMEs contain images. But we don't want to publish images in NPM
// tarballs, because we want to keep them small. This script replaces any
// relative-path image references in the READMEs with static
// githubusercontent.com URLs, using the SHA of master.

import {execFileSync} from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import {URL} from 'url';

const mwcRepoRoot = path.resolve(__dirname, '..', '..');

const githubRaw =
    `https://raw.githubusercontent.com/material-components/material-components-web-components`;

// Matches markdown image syntax like `![description](url "tooltip")`
const imageRegexp = /(\!\[.*?\]\()([^) ]+)(.*?\))/g;

function isUrl(str: string): boolean {
  try {
    new URL(str);
  } catch (e) {
    return false;
  }
  return true;
}

function main() {
  const fileNames = process.argv.slice(2);
  if (fileNames.length === 0) {
    throw new Error('Expected at least one markdown file argument.');
  }

  // Resolve the SHA for master as of right now. This way the URLs we generate
  // will be valid and identical forever in this version of the README, whereas
  // if we used the "master" branch name in the URL, they would become invalid
  // when we change or move the images.
  const sha = execFileSync('git', ['rev-parse', '--verify', 'master'], {
                encoding: 'utf8'
              }).trim();

  for (const fileName of fileNames) {
    const markdown = fs.readFileSync(fileName, 'utf8');
    const updated = markdown.replace(
        imageRegexp, (_, prefix: string, oldUrl: string, suffix: string) => {
          if (isUrl(oldUrl)) {
            // Only transform relative image paths, not fully qualified URLs.
            return prefix + oldUrl + suffix;
          }
          // Absolute path on disk of the image file.
          const absFilePath = path.resolve(path.dirname(fileName), oldUrl);
          if (!fs.existsSync(absFilePath)) {
            throw new Error(`Image file does not exist: ${absFilePath}`);
          }
          // Relative URL path from the MWC repo root to the image file.
          const relUrlPath = path.relative(mwcRepoRoot, absFilePath)
                                 .replace(path.win32.sep, '/');
          const newUrl = `${githubRaw}/${sha}/${relUrlPath}`;
          return prefix + newUrl + suffix
        });
    fs.writeFileSync(fileName, updated, 'utf8');
  }
}

main();
