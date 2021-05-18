#!/usr/bin/env node

/**
@license
Copyright 2021 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const path = require('path');
const commandLineArgs = require('command-line-args');
const sassRender = require('./compile.js').sassRender;

const options = [
  {
    name: 'source',
    alias: 's',
    type: String,
    multiple: true,
    defaultOption: true,
  },
];

const {source} = commandLineArgs(options);

if (!source) {
  console.error('Must provide a source file!');
  process.exit(-1);
}

const template = path.resolve(process.argv[1], '../template.tmpl');

for (const sourceFile of source) {
  const output = sourceFile.replace(/\.scss$/, '.css.ts');
  sassRender(sourceFile, template, output).catch((err) => {
    console.error(err);
    process.exit(-1);
  });
}
