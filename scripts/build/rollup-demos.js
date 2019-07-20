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
const fs = require('fs');
const util = require('util');
const path = require('path');

const del = require('del');
const rollup = require('rollup');
const dom5 = require('dom5/lib/index-next.js');
const parse5 = require('parse5');
const babel = require('rollup-plugin-babel');
const nodeRes = require('rollup-plugin-node-resolve');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const pred = dom5.predicates;
const moduleFinder = pred.AND(
  pred.hasTagName('script'),
  pred.hasAttrValue('type', 'module'),
);

const file = process.argv[2];

if (!file) {
  console.log('Need input file!');
  process.exit(1);
}

const jsFile = `${path.dirname(file)}/${path.basename(file, '.html')}.js`;

const rollupOptions = {
  input: jsFile,
  plugins: [
    nodeRes({
      module: true,
      jsnext: true,
      main: true,
    }),
    babel({
      presets: ['es2015-rollup'],
      babelrc: false
    }),
  ],
};

const outputOptions = {
  format: 'iife',
  name: 'bundle',
};

async function build(scriptContent) {
  await writeFile(jsFile, scriptContent, 'utf-8');
  const bundle = await rollup.rollup(rollupOptions);
  const {code} = await bundle.generate(outputOptions);
  await del(jsFile);
  return code;
}

async function prependES5Adapter(doc) {
  const preamble = dom5.constructors.element('script');
  dom5.setTextContent(preamble, 'if (!window.customElements) { document.write("<!--") }');
  const es5Adapter = dom5.constructors.element('script');
  const es5AdapterContent = await readFile(require.resolve('@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js'), 'utf-8');
  dom5.setTextContent(es5Adapter, es5AdapterContent);
  const comment = dom5.constructors.comment('! do not remove');
  const head = dom5.query(doc, pred.hasTagName('head'));
  if (head.childNodes.length) {
    const firstChild = head.childNodes[0];
    dom5.insertBefore(head, firstChild, preamble);
    dom5.insertBefore(head, firstChild, es5Adapter);
    dom5.insertBefore(head, firstChild, comment);
  } else {
    dom5.append(head, preamble);
    dom5.append(head, es5Adapter);
    dom5.append(head, comment);
  }
}

const removeNpmPath = /\.\.\/\.\.\/node_modules\//;

async function separateScripts() {
  const content = await readFile(file, 'utf-8');
  const imports = [];
  const scripts = [];
  const doc = parse5.parse(content);
  const nodes = dom5.queryAll(doc, moduleFinder);
  for (const node of nodes) {
    const src = dom5.getAttribute(node, 'src');
    if (src) {
      const namePath = src.replace(removeNpmPath, '');
      imports.push(`import "${namePath}";`);
    } else {
      scripts.push(dom5.getTextContent(node));
    }
    dom5.remove(node);
  }
  const newScript = dom5.constructors.element('script');
  const moduleText = `${imports.join('\n')}\n${scripts.join(';\n')}`;
  const newScriptContent = await build(moduleText);
  dom5.setTextContent(newScript, newScriptContent);
  const body = dom5.query(doc, pred.hasTagName('body'));
  dom5.append(body, newScript);
  await prependES5Adapter(doc);
  await writeFile(file, parse5.serialize(doc), 'utf-8');
}

separateScripts().catch((err) => {
  console.error(err);
  process.exit(-1);
});
