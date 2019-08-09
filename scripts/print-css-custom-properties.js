#!/usr/bin/env node

/**
@license
Copyright 2019 Google Inc. All Rights Reserved.

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

const shadyCss = require('shady-css-parser');
const sass = require('sass');
const nodeSassImport = require('node-sass-import');
const util = require('util');
const renderSass = util.promisify(sass.render);

/**
 * Walk from text[start] matching parens and
 * returns position of the outer end paren
 * @param {string} text
 * @param {number} start
 * @return {number}
 */
function findMatchingParen(text, start) {
  let level = 0;
  for (let i=start, l=text.length; i < l; i++) {
    if (text[i] === '(') {
      level++;
    } else if (text[i] === ')') {
      if (--level === 0) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * @param {string} str
 * @param {function(string, string, string, string)} callback
 */
function processVariableAndFallback(str, callback) {
  // find 'var('
  const start = str.indexOf('var(');
  if (start === -1) {
    // no var?, everything is prefix
    return callback(str, '', '', '');
  }
  // ${prefix}var(${inner})${suffix}
  const end = findMatchingParen(str, start + 3);
  const inner = str.substring(start + 4, end);
  const prefix = str.substring(0, start);
  // suffix may have other variables
  const suffix = processVariableAndFallback(str.substring(end + 1), callback);
  const comma = inner.indexOf(',');
  // value and fallback args should be trimmed to match in property lookup
  if (comma === -1) {
    // variable, no fallback
    return callback(prefix, inner.trim(), '', suffix);
  }
  // var(${value},${fallback})
  const value = inner.substring(0, comma).trim();
  const fallback = inner.substring(comma + 1).trim();
  return callback(prefix, value, fallback, suffix);
}

function walkPathToSelector(path) {
  for (let i = path.length - 1; i >= 0; i--) {
    const node = path[i];
    if (node.type === 'ruleset') {
      return node.selector;
    }
  }
  return '';
}

async function sassToCss(sassFile) {
  const result = await renderSass({
    file: sassFile,
    importer: nodeSassImport,
  });
  return result.css.toString();
}

function printProperty(node, selector) {
  const property = node.name;
  const expression = node.value.text;
  processVariableAndFallback(expression, (_, value, fallback) => {
    if (value) {
      console.log(`${selector} { ${property}: var(${value}${fallback ? ', ' + fallback : ''}) }`);
    }
  });
}

class PropertyFinder extends shadyCss.Stringifier {
  declaration(node) {
    printProperty(node, walkPathToSelector(this.path));
  }
}

async function main() {
  const css = await sassToCss(process.argv[2]);

  const parser = new shadyCss.Parser();
  const ast = parser.parse(css);
  const propfinder = new PropertyFinder();
  propfinder.visit(ast);
}
main();
