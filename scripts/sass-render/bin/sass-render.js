#!/usr/bin/env node

/**
@license
Copyright 2018 Google Inc. All Rights Reserved.

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

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const sassRender = require('../index.js').sassRender;

const options = [
  {
    name: 'source',
    alias: 's',
    type: String,
    description: 'Template file to render sass into.',
    defaultOption: true,
  },
  {
    name: 'output',
    alias: 'o',
    type: String,
    description: 'Output file path',
  },
  {
    name: 'template',
    alias: 't',
    type: String,
    description: 'Template file to use, must use `<% content %>` as delimiter',
  },
  {
    name: 'help',
    alias: 'h',
    type: Boolean,
    description: 'Print this message.',
  },
];

const {source, output, template, help} = commandLineArgs(options);

function printUsage() {
  const sections = [
    {
      header: 'sass-render',
      content: 'Render sass into an element\'s lit template',
    },
    {
      header: 'Options',
      optionList: options,
    },
  ];
  console.log(commandLineUsage(sections));
}

if (help) {
  printUsage();
  process.exit(0);
}

if (!(source && template && output)) {
  console.error('Must provide a source, template, and output file!');
  printUsage();
  process.exit(-1);
}

sassRender(source, template, output).catch((err) => {
  console.error(err);
  process.exit(-1);
});
