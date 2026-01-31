/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

/**
 * A Sassdoc comment block.
 */
interface SassdocComment {
  /**
   * The content of the Sassdoc comment block, without the forward slashes
   * (`///`).
   */
  content: string;
  /**
   * The Sass symbol the comment block is attached to (ex: `@function foo`,
   * `@mixin bar`, `$baz`).
   */
  symbol: string;
}

/**
 * A sassdoc file.
 */
interface SassdocModule {
  /**
   * The Sass file's module name (ex: `foo-ext` for `_foo-ext.scss`).
   */
  name: string;
  /**
   * The Sassdoc comments in the file.
   */
  comments: SassdocComment[];
}

function parseSassFile(sassFile: string): SassdocModule {
  const content = fs.readFileSync(sassFile, 'utf-8');

  const comments: SassdocComment[] = [];
  let sassdocLines: string[] = [];
  for (const line of content.split('\n')) {
    if (line.startsWith('///')) {
      sassdocLines.push(line.replace(/^\/\/\/\s?/, ''));
      continue;
    }

    const symbolMatch = line.match(/(?:@function|@mixin)\s*(\$?[\w-]+)/);
    if (symbolMatch && sassdocLines.length) {
      const symbol = symbolMatch[1];
      // Ignore private documented symbols.
      if (!symbol.startsWith('_')) {
        comments.push({
          symbol,
          content: sassdocLines.join('\n'),
        });
      }

      sassdocLines = [];
      continue;
    }
  }

  return {
    name: path.basename(sassFile).replace(/^_|\.scss$/g, ''),
    comments,
  };
}

const TWO_SPACES = '  ';
const FOUR_SPACES = '    ';

function sassdocToMarkdown(
  comment: SassdocComment,
  moduleName: string,
): string {
  const header = `### \`${comment.symbol}\` {#${moduleName}.${comment.symbol}}\n\n`;
  let markdown = '';

  const lines = comment.content.split('\n');
  const annotations: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    const exampleMatch = line.match(/^@example(?:\s-?(\w+))?/);
    if (exampleMatch) {
      const exampleLines = [];
      while (lines[i + 1] === '' || lines[i + 1]?.startsWith(TWO_SPACES)) {
        exampleLines.push(lines[i + 1].replace(/^\s\s/, ''));
        i++;
      }

      const exampleLang = exampleMatch[1] || 'scss';
      const exampleMarkdown =
        '```' + `${exampleLang}\n` + exampleLines.join('\n') + '```\n\n';
      markdown += exampleMarkdown;
      continue;
    }

    const annotationMatch = line.match(/^@(\w+)/);
    if (annotationMatch) {
      const annotationLines = [line];
      // Collect multi-line annotation lines.
      while (lines[i + 1]?.startsWith(FOUR_SPACES)) {
        annotationLines.push(lines[i + 1].trim());
        i++;
      }

      // Annotations are listed at the end of the markdown.
      annotations.push(annotationLines.join(' '));
      continue;
    }

    markdown += `${line}\n`;
  }

  const params = annotations
    .filter((annotation) => annotation.startsWith('@param'))
    .map((annotation) => annotation.match(/(\$[\w-]+)/)?.[1]);
  const returnType = annotations
    .find((annotation) => annotation.startsWith('@return'))
    ?.match(/@return\s{(\w+)}/)?.[1];
  const returnComment = returnType ? ` //=> ${returnType}` : '';
  const signature =
    '```scss\n' +
    `${moduleName}.${comment.symbol}(${params.join(', ')})${returnComment}` +
    '\n\n' +
    annotations.map((a) => `/// ${a}`).join('\n') +
    '\n```\n\n';

  return header + signature + markdown;
}

const {values} = util.parseArgs({
  options: {
    input: {type: 'string'},
    output: {type: 'string'},
  },
});

if (!values.input || !values.output) {
  throw new Error(
    'Usage: update-sass-ext-docs --input=path/to/sass/ext/ --output=path/to/sass-ext.md',
  );
}

const outputPath = values.output;
const sassExtPath = values.input;
const sassdocModules = fs
  .readdirSync(sassExtPath)
  .filter(
    (file) =>
      file.startsWith('_') && file.endsWith('.scss') && !file.includes('test'),
  )
  .map((file) => parseSassFile(path.join(sassExtPath, file)));

let generatedDocs = ``;
for (const sassdocModule of sassdocModules) {
  generatedDocs += `## \`${sassdocModule.name}\`\n\n`;
  for (const comment of sassdocModule.comments) {
    generatedDocs += sassdocToMarkdown(comment, sassdocModule.name);
  }
}

const mdContent = fs.readFileSync(outputPath, 'utf-8');
const MARKER = '<!-- generated_docs_start -->\n';
const newMdContent =
  mdContent.substring(0, mdContent.indexOf(MARKER)) +
  MARKER +
  '\n' +
  generatedDocs.trim() +
  '\n';

fs.writeFileSync(outputPath, newMdContent);

console.log('Updated sass-ext.md');
